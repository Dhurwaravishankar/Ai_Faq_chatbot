import express from 'express';
import { storeFeedback } from '../services/dataService.js';

export const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { messageId, feedback, question, answer } = req.body;

    // Validate required fields
    if (!messageId || !feedback || !question || !answer) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: messageId, feedback, question, answer'
      });
    }

    // Validate feedback value
    if (!['positive', 'negative'].includes(feedback)) {
      return res.status(400).json({
        success: false,
        error: 'Feedback must be either "positive" or "negative"'
      });
    }

    // Store feedback
    await storeFeedback({
      messageId,
      feedback,
      question: question.trim(),
      answer: answer.trim(),
      timestamp: new Date(),
      userAgent: req.get('User-Agent') || 'Unknown',
      ip: req.ip || req.connection.remoteAddress || 'Unknown'
    });

    console.log(`📊 Feedback received: ${feedback} for message ${messageId}`);
    console.log(`   Question: "${question.substring(0, 50)}..."`);

    res.json({
      success: true,
      message: 'Feedback recorded successfully'
    });
  } catch (error) {
    console.error('Error in /feedback endpoint:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to record feedback'
    });
  }
});

// Get feedback analytics (optional endpoint for monitoring)
router.get('/analytics', async (req, res) => {
  try {
    const { getAnalytics } = await import('../services/dataService.js');
    const analytics = getAnalytics();
    
    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('Error in /feedback/analytics endpoint:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve analytics'
    });
  }
});