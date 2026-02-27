// import express from 'express';
// import AgentOrchestrator from '../services/AgentOrchestrator.js';
// import logger from '../utils/logger.js';

// const router = express.Router();
// const orchestrator = new AgentOrchestrator();

// /**
//  * AI chatbot endpoint for policy-specific queries
//  * Powered by Agentic RAG
//  */
// router.post('/', async (req, res) => {
//   const { message, language = 'en', profile } = req.body;

//   if (!message) {
//     return res.status(400).json({ reply: "Please say something!" });
//   }

//   try {
//     // Inject Language into Profile for agents
//     const userProfile = { ...profile, language };

//     // Delegate entire flow to Orchestrator
//     const reply = await orchestrator.handleChat(message, userProfile);

//     res.json({ reply });
//   } catch (err) {
//     logger.error(`Chat error: ${err.message}`, 'ChatRoute');
//     res.status(500).json({ reply: "I'm experiencing some technical difficulties. Please try again later." });
//   }
// });

// export default router;




import express from 'express';
import axios from 'axios';
import logger from '../utils/logger.js';

const router = express.Router();

/**
 * Chat endpoint powered by external Flask RAG
 */
router.post('/', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ reply: "Please say something!" });
  }

  try {
    const response = await axios.post(
      "http://localhost:5000/chat",
      { question: message }
    );

    res.json({ reply: response.data.answer });

  } catch (error) {
    logger.error(`RAG error: ${error.message}`, 'ChatRoute');
    res.status(500).json({ reply: "RAG service not responding." });
  }
});

export default router;