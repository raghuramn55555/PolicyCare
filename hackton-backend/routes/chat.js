import express from 'express';
import AgentOrchestrator from '../services/AgentOrchestrator.js';
import logger from '../utils/logger.js';

const router = express.Router();
const orchestrator = new AgentOrchestrator();

/**
 * AI chatbot endpoint for policy-specific queries
 * Powered by Agentic RAG
 */
router.post('/', async (req, res) => {
  const { message, language = 'en', profile } = req.body;

  if (!message) {
    return res.status(400).json({ reply: "Please say something!" });
  }

  try {
    // Inject Language into Profile for agents
    const userProfile = { ...profile, language };

    // Delegate entire flow to Orchestrator
    const reply = await orchestrator.handleChat(message, userProfile);

    res.json({ reply });
  } catch (err) {
    logger.error(`Chat error: ${err.message}`, 'ChatRoute');
    res.status(500).json({ reply: "I'm experiencing some technical difficulties. Please try again later." });
  }
});

export default router;
