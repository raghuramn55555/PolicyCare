import express from 'express';
import RecommendationWorkflow from '../workflows/RecommendationWorkflow.js';
import logger from '../utils/logger.js';

const router = express.Router();
const workflow = new RecommendationWorkflow();

// POST /recommend - Get personalized recommendations
router.post('/', async (req, res) => {
  try {
    // Payload Normalization
    // Frontend might send 'income' (Login flow) or 'annualIncome' (Profile flow)
    // We map everything to 'annualIncome' for the Workflow
    const userProfile = {
      ...req.body,
      annualIncome: Number(req.body.annualIncome) || Number(req.body.income) || 0,
    };

    // Execute Workflow
    const results = await workflow.execute(userProfile);

    res.json({
      success: true,
      recommendations: results.policies.concat(results.schemes), // Combined list 
      schemes: results.schemes, // Separated list
      policies: results.policies, // Separated list
    });
  } catch (error) {
    logger.error(`Recommendation error: ${error.message}`, 'RecommendRoute');
    res.status(500).json({
      success: false,
      message: 'Failed to generate recommendations',
      recommendations: []
    });
  }
});

export default router;
