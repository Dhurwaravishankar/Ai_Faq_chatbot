import express from 'express';
import { askAI } from '../services/aiService.js';
import { storeUnansweredQuestion } from '../services/dataService.js';

export const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { question } = req.body;

    // Validate input
    if (!question || typeof question !== 'string' || question.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Question is required and must be a non-empty string'
      });
    }

    if (question.trim().length > 1000) {
      return res.status(400).json({
        success: false,
        error: 'Question is too long. Please keep it under 1000 characters.'
      });
    }

    const trimmedQuestion = question.trim();
    
    // Log the incoming question
    console.log(`📝 Question received: "${trimmedQuestion}"`);

    // Get AI response
    const aiResponse = await askAI(trimmedQuestion);
    
    if (aiResponse.success) {
      console.log(`✅ AI Response: "${aiResponse.answer?.substring(0, 100)}..."`);
      res.json(aiResponse);
    } else {
      // Store unanswered question for improvement
      await storeUnansweredQuestion(trimmedQuestion, aiResponse.error);
      console.log(`❌ Failed to answer: "${trimmedQuestion}" - ${aiResponse.error}`);
      
      res.status(500).json({
        success: false,
        error: 'I don\'t know the answer to that question. Our team has been notified and will work on improving my knowledge base.'
      });
    }
  } catch (error) {
    console.error('Error in /ask endpoint:', error);
    
    // Store the question as unanswered
    if (req.body?.question) {
      await storeUnansweredQuestion(req.body.question, error.message);
    }
    
    res.status(500).json({
      success: false,
      error: 'An unexpected error occurred. Please try again.'
    });
  }
});