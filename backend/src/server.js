import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { router as askRouter } from './routes/ask.js';
import { router as feedbackRouter } from './routes/feedback.js';
import { initializeAI } from './services/aiService.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Initialize AI service
initializeAI();

// Routes
app.use('/ask', askRouter);
app.use('/feedback', feedbackRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'FAQ Chatbot Backend',
    version: '1.0.0'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'AI FAQ Chatbot Backend API',
    version: '1.0.0',
    endpoints: {
      health: 'GET /health',
      ask: 'POST /ask',
      feedback: 'POST /feedback'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 FAQ Chatbot Backend running on http://localhost:${PORT}`);
  console.log(`📱 Frontend should be running on http://localhost:5173`);
  console.log(`🔗 API Documentation: http://localhost:${PORT}`);
  
  if (!process.env.OPENAI_API_KEY) {
    console.warn('⚠️  WARNING: OPENAI_API_KEY not set. Using demo responses.');
    console.warn('   Add your OpenAI API key to .env file for full AI functionality.');
  } else {
    console.log('✅ OpenAI API key configured');
  }
});

export default app;