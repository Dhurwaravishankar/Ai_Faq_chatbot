// In-memory storage (replace with database in production)
const unansweredQuestions = new Map();
const feedbackData = new Map();

export const storeUnansweredQuestion = async (question, error) => {
  const key = Date.now().toString();
  const data = {
    question: question.trim(),
    error: error || 'Unknown error',
    timestamp: new Date(),
    attempts: 1
  };

  // Check if similar question already exists
  for (const [existingKey, existingData] of unansweredQuestions.entries()) {
    if (existingData.question.toLowerCase() === question.toLowerCase().trim()) {
      // Increment attempts for existing question
      unansweredQuestions.set(existingKey, {
        ...existingData,
        attempts: existingData.attempts + 1,
        lastAttempt: new Date(),
        lastError: error
      });
      console.log(`📝 Updated unanswered question attempts: "${question}" (${existingData.attempts + 1} attempts)`);
      return existingKey;
    }
  }

  unansweredQuestions.set(key, data);
  console.log(`📝 Stored new unanswered question: "${question}"`);
  return key;
};

export const storeFeedback = async (feedback) => {
  const key = Date.now().toString();
  const data = {
    ...feedback,
    storedAt: new Date()
  };
  
  feedbackData.set(key, data);

  console.log(`💾 Stored feedback: ${feedback.feedback} for "${feedback.question.substring(0, 50)}..."`);
  return key;
};

export const getUnansweredQuestions = () => {
  return Array.from(unansweredQuestions.entries()).map(([id, data]) => ({
    id,
    ...data
  })).sort((a, b) => b.attempts - a.attempts); // Sort by most attempted first
};

export const getFeedbackData = () => {
  return Array.from(feedbackData.entries()).map(([id, data]) => ({
    id,
    ...data
  })).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)); // Sort by newest first
};

export const getAnalytics = () => {
  const totalUnanswered = unansweredQuestions.size;
  const totalFeedback = feedbackData.size;
  
  const feedbackArray = Array.from(feedbackData.values());
  const positiveFeedback = feedbackArray.filter(f => f.feedback === 'positive').length;
  const negativeFeedback = feedbackArray.filter(f => f.feedback === 'negative').length;

  // Calculate satisfaction rate
  const satisfactionRate = totalFeedback > 0 
    ? ((positiveFeedback / totalFeedback) * 100).toFixed(1)
    : 'N/A';

  // Get most common unanswered questions
  const topUnansweredQuestions = Array.from(unansweredQuestions.values())
    .sort((a, b) => b.attempts - a.attempts)
    .slice(0, 5)
    .map(q => ({
      question: q.question,
      attempts: q.attempts,
      lastAttempt: q.lastAttempt || q.timestamp
    }));

  // Get recent feedback
  const recentFeedback = feedbackArray
    .slice(0, 10)
    .map(f => ({
      feedback: f.feedback,
      question: f.question.substring(0, 100),
      timestamp: f.timestamp
    }));

  return {
    summary: {
      totalUnansweredQuestions: totalUnanswered,
      totalFeedback: totalFeedback,
      positiveFeedback: positiveFeedback,
      negativeFeedback: negativeFeedback,
      satisfactionRate: satisfactionRate
    },
    topUnansweredQuestions,
    recentFeedback,
    generatedAt: new Date().toISOString()
  };
};

// Utility functions for data management
export const clearUnansweredQuestions = () => {
  const count = unansweredQuestions.size;
  unansweredQuestions.clear();
  console.log(`🗑️ Cleared ${count} unanswered questions`);
  return count;
};

export const clearFeedbackData = () => {
  const count = feedbackData.size;
  feedbackData.clear();
  console.log(`🗑️ Cleared ${count} feedback entries`);
  return count;
};

export const exportData = () => {
  return {
    unansweredQuestions: getUnansweredQuestions(),
    feedbackData: getFeedbackData(),
    analytics: getAnalytics(),
    exportedAt: new Date().toISOString()
  };
};