export interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  feedback?: 'positive' | 'negative';
}

export interface ApiResponse {
  success: boolean;
  answer?: string;
  error?: string;
}

export interface FeedbackRequest {
  messageId: string;
  feedback: 'positive' | 'negative';
  question: string;
  answer: string;
}