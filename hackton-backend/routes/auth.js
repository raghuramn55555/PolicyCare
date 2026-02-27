import express from 'express';
import fs from 'fs';
import config from '../config/index.js';
import logger from '../utils/logger.js';

const router = express.Router();
const USERS_FILE = config.paths.users;

// Helper to load users from file
function loadUsers() {
    try {
        if (!fs.existsSync(USERS_FILE)) {
            logger.info('users.json missing, creating...', 'Auth');
            fs.writeFileSync(USERS_FILE, JSON.stringify({ users: [] }, null, 2));
            return new Map();
        }
        const rawData = fs.readFileSync(USERS_FILE, 'utf-8');
        if (!rawData || rawData.trim() === '') {
            logger.info('users.json empty, initializing...', 'Auth');
            return new Map();
        }
        const data = JSON.parse(rawData);
        const usersMap = new Map();
        if (data.users && Array.isArray(data.users)) {
            data.users.forEach(user => usersMap.set(user.identifier, user));
        }
        return usersMap;
    } catch (error) {
        logger.error(`Error loading users: ${error.message}`, 'Auth');
        return new Map();
    }
}

// Helper to save users to file
function saveUsers(usersMap) {
    try {
        const usersArray = Array.from(usersMap.values());
        fs.writeFileSync(USERS_FILE, JSON.stringify({ users: usersArray }, null, 2));
    } catch (error) {
        logger.error(`Error saving users: ${error.message}`, 'Auth');
    }
}

// Initialize users from storage
let users = loadUsers();

// Router test endpoint
router.get('/test', (req, res) => {
    res.json({ status: 'alive', usersCount: users.size });
});

/**
 * POST /api/auth/signup
 * Register a new user
 */
router.post('/signup', (req, res) => {
    const { identifier, password, profile } = req.body;
    logger.info(`Signup attempt for: ${identifier}`, 'Auth');

    if (!identifier || !password) {
        return res.status(400).json({ error: 'Email/Phone and Password required' });
    }

    // Refresh memory from disk before checking
    users = loadUsers();

    if (users.has(identifier)) {
        return res.status(400).json({ error: 'User already exists' });
    }

    const newUser = {
        identifier,
        password,
        ...profile, // Store extended profile fields
        createdAt: new Date().toISOString()
    };

    // Store user
    users.set(identifier, newUser);
    saveUsers(users);

    logger.info(`New user registered: ${identifier}`, 'Auth');

    res.json({
        success: true,
        message: 'Sign up successful! You can now login.',
        user: newUser
    });
});

/**
 * POST /api/auth/login
 * Login with existing credentials
 */
router.post('/login', (req, res) => {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
        return res.status(400).json({ error: 'Email/Phone and Password required' });
    }

    // Reload users to ensure we have the latest
    users = loadUsers();
    const user = users.get(identifier);

    if (!user || user.password !== password) {
        return res.status(401).json({ error: 'Invalid identifier or password' });
    }

    res.json({
        success: true,
        message: 'Authentication successful',
        user: {
            id: `user-${Date.now()}`,
            ...user, // Return full user profile (age, income, etc.)
            isNewUser: false
        }
    });
});

export default router;
