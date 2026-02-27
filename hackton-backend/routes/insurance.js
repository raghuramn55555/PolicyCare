import express from 'express';
import logger from '../utils/logger.js';
import insuranceOrchestrator from '../services/InsuranceAgentOrchestrator.js';

const router = express.Router();

router.post('/query', async (req, res, next) => {
    try {
        const { message } = req.body;
        if (!message) {
            logger.warn('Empty query received in /api/insurance/query', 'InsuranceRoute');
            return res.status(400).json({ error: 'Message is required' });
        }

        const reply = await insuranceOrchestrator.handleChat(message);

        // Keep Insurance RAG independent by defining isolated response structure
        res.json({
            success: true,
            domain: 'Insurance',
            reply: reply
        });
    } catch (error) {
        logger.error(`Error in /api/insurance/query: ${error.message}`, 'InsuranceRoute');
        next(error);
    }
});

export default router;
