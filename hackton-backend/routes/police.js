import express from 'express';
import logger from '../utils/logger.js';
import policeOrchestrator from '../services/PoliceAgentOrchestrator.js';

const router = express.Router();

router.post('/query', async (req, res, next) => {
    try {
        const { message } = req.body;
        if (!message) {
            logger.warn('Empty query received in /api/police/query', 'PoliceRoute');
            return res.status(400).json({ error: 'Message is required' });
        }

        const reply = await policeOrchestrator.handleChat(message);

        // Keep Police RAG independent by defining isolated response structure
        res.json({
            success: true,
            domain: 'Police',
            reply: reply
        });
    } catch (error) {
        logger.error(`Error in /api/police/query: ${error.message}`, 'PoliceRoute');
        next(error);
    }
});

export default router;
