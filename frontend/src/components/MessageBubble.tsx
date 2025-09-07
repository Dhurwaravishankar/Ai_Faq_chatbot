import React from 'react';
import { ThumbsUp, ThumbsDown, User, Bot } from 'lucide-react';
import { Message } from '../types';

interface MessageBubbleProps {
  message: Message;
  onFeedback: (messageId: string, feedback: 'positive' | 'negative') => void;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, onFeedback }) => {
  const { id, text, isUser, timestamp, feedback } = message;

  return (
    <div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 animate-slide-up`}
    >
      <div
        className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${
          isUser ? 'flex-row-reverse space-x-reverse' : ''
        }`}
      >
        {/* Avatar */}
        <div
          className={`flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0 ${
            isUser
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-600'
          }`}
        >
          {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
        </div>
        
        <div className="flex flex-col">
          {/* Message Bubble */}
          <div
            className={`px-4 py-3 rounded-lg shadow-sm ${
              isUser
                ? 'bg-blue-500 text-white rounded-br-sm'
                : 'bg-white border border-gray-200 text-gray-800 rounded-bl-sm'
            }`}
          >
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{text}</p>
          </div>
          
          {/* Timestamp and Feedback */}
          <div className="flex items-center justify-between mt-1">
            <span className="text-xs text-gray-400">
              {timestamp.toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </span>
            
            {/* Feedback Buttons - Only for bot messages */}
            {!isUser && (
              <div className="flex items-center space-x-1 ml-2">
                <button
                  onClick={() => onFeedback(id, 'positive')}
                  className={`p-1 rounded-full text-xs transition-all duration-200 ${
                    feedback === 'positive'
                      ? 'bg-green-100 text-green-600 scale-110'
                      : 'text-gray-400 hover:text-green-600 hover:bg-green-50 hover:scale-110'
                  }`}
                  title="Helpful answer"
                >
                  👍
                </button>
                <button
                  onClick={() => onFeedback(id, 'negative')}
                  className={`p-1 rounded-full text-xs transition-all duration-200 ${
                    feedback === 'negative'
                      ? 'bg-red-100 text-red-600 scale-110'
                      : 'text-gray-400 hover:text-red-600 hover:bg-red-50 hover:scale-110'
                  }`}
                  title="Not helpful"
                >
                  👎
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;