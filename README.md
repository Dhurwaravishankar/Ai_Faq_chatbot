# AI-Powered FAQ Chatbot

A modern AI-powered FAQ chatbot with strict separation between frontend (React + Vite + TailwindCSS) and backend (Node.js + Express + OpenAI).

## 🏗️ Project Structure

```
ai-faq-chatbot/
├── frontend/          # React + Vite + TailwindCSS
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   └── types/
│   └── package.json
├── backend/           # Node.js + Express + OpenAI
│   ├── src/
│   │   ├── routes/
│   │   └── services/
│   └── package.json
└── README.md
```

## 🚀 Quick Start

### 1. Install Dependencies

**Frontend:**
```bash
cd frontend
npm install
```

**Backend:**
```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Create `backend/.env` file:
```env
OPENAI_API_KEY=your_openai_api_key_here
PORT=5000
NODE_ENV=development
```

**Note:** The chatbot works without OpenAI API key using demo responses.

### 3. Run the Applications

**Terminal 1 - Start Backend (Port 5000):**
```bash
cd backend
npm run dev
```

**Terminal 2 - Start Frontend (Port 5173):**
```bash
cd frontend
npm run dev
```

### 4. Access the Application

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000

## 🔧 How to Connect Frontend & Backend

The frontend communicates with the backend through REST API calls:

1. **Ask Questions:** `POST http://localhost:5000/ask`
2. **Submit Feedback:** `POST http://localhost:5000/feedback`
3. **Health Check:** `GET http://localhost:5000/health`

The frontend uses the `ApiService` class to handle all API communications:

```typescript
// Frontend API call example
const response = await ApiService.askQuestion("What are your hours?");
```

## 📡 API Endpoints

### POST /ask
Submit a question to the AI assistant.

**Request:**
```json
{
  "question": "What are your business hours?"
}
```

**Response:**
```json
{
  "success": true,
  "answer": "Our support team is available Monday through Friday, 9 AM to 6 PM EST."
}
```

### POST /feedback
Submit feedback on bot responses.

**Request:**
```json
{
  "messageId": "123456789",
  "feedback": "positive",
  "question": "What are your hours?",
  "answer": "We're open 9 AM to 6 PM EST, Monday-Friday."
}
```

### GET /health
Health check endpoint to verify backend status.

## 🎨 Features

### Frontend Features
- **Modern Chat UI:** Message bubbles with distinct user/bot styling
- **Real-time Feedback:** Thumbs up/down buttons for each response
- **Typing Indicators:** Visual feedback while AI processes questions
- **Responsive Design:** Works on desktop, tablet, and mobile
- **Smooth Animations:** Slide-up animations for new messages
- **Error Handling:** Graceful handling of API failures

### Backend Features
- **OpenAI Integration:** GPT-3.5-turbo for intelligent responses
- **Fallback Responses:** Demo responses when OpenAI is unavailable
- **Unanswered Question Logging:** Tracks questions that couldn't be answered
- **Feedback Analytics:** Stores user feedback for improvement
- **CORS Enabled:** Allows frontend-backend communication
- **Error Handling:** Comprehensive error handling and logging

## 🔄 How to Expand

### Adding New FAQ Categories
Edit `backend/src/services/aiService.js` and add keywords to the responses object:

```javascript
const responses = {
  'new-topic': 'Your response for the new topic',
  // ... existing responses
};
```

### Database Integration
Replace in-memory storage in `backend/src/services/dataService.js` with your preferred database:

```javascript
// Example: Replace with MongoDB, PostgreSQL, etc.
export const storeFeedback = async (feedback) => {
  // Database implementation here
};
```

### Enhanced AI Models
Update `backend/src/services/aiService.js` to use different models:

```javascript
const completion = await openai.chat.completions.create({
  model: "gpt-4", // or other models
  // ... other parameters
});
```

## 🚀 Deployment

### Frontend Deployment
1. Build the frontend:
```bash
cd frontend
npm run build
```

2. Deploy the `dist` folder to your hosting service (Netlify, Vercel, etc.)

### Backend Deployment
1. Set environment variables on your hosting platform
2. Deploy to services like Heroku, Railway, or DigitalOcean
3. Update frontend API URL to point to production backend

### Environment Variables for Production
```env
OPENAI_API_KEY=your_production_api_key
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.com
```

## 🛠️ Development

### Frontend Development
- **Framework:** React 18 + TypeScript
- **Build Tool:** Vite
- **Styling:** TailwindCSS
- **Icons:** Lucide React
- **HTTP Client:** Fetch API

### Backend Development
- **Runtime:** Node.js
- **Framework:** Express.js
- **AI Service:** OpenAI GPT-3.5-turbo
- **Storage:** In-memory (expandable to database)

## 📊 Analytics & Monitoring

The backend automatically tracks:
- Unanswered questions for improvement opportunities
- User feedback (positive/negative) for response quality
- API usage patterns
- Error logs for debugging

Access analytics through the data service:
```javascript
import { getAnalytics, getUnansweredQuestions } from './services/dataService.js';

const stats = getAnalytics();
const unanswered = getUnansweredQuestions();
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Troubleshooting

### Common Issues

**Frontend can't connect to backend:**
- Ensure backend is running on port 5000
- Check CORS configuration in backend
- Verify API URLs in frontend

**OpenAI API errors:**
- Check your API key in `.env` file
- Verify API key has sufficient credits
- System works with demo responses if API key is missing

**Port conflicts:**
- Frontend: Change port in `vite.config.ts`
- Backend: Change PORT in `.env` file

For more help, check the console logs in both frontend and backend terminals.