import express from 'express';
import vectorDB from '../services/vectorDB.js';
import logger from '../utils/logger.js';

const router = express.Router();

/**
 * GET /popular
 * Returns popular/featured schemes and policies
 * NO eligibility filtering - just general national-level items
 */
router.get('/', async (req, res) => {
    try {
        const language = req.query.language || 'en';

        // Fetch popular schemes (broad national-level welfare schemes)
        const schemeQuery = 'government welfare scheme benefit';
        const schemeResults = await vectorDB.searchPolicies(schemeQuery, language, 10);

        // Fetch popular policies (common insurance types)
        const policyQuery = 'insurance life health term';
        const policyResults = await vectorDB.searchPolicies(policyQuery, language, 10);

        // Separate and limit to 6 each
        const schemes = schemeResults
            .filter(doc => (doc.type || '').toLowerCase().includes('scheme'))
            .slice(0, 6);

        const policies = policyResults
            .filter(doc => (doc.type || '').toLowerCase().includes('insurance') || doc.minPremium > 0)
            .slice(0, 6);

        res.json({
            success: true,
            schemes,
            policies
        });
    } catch (error) {
        logger.error(`Popular items error: ${error.message}`, 'PopularRoute');
        res.status(500).json({
            success: false,
            schemes: [],
            policies: []
        });
    }
});

export default router;
