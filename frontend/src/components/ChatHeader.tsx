import React from 'react';
import { Bot, MessageCircle } from 'lucide-react';

const ChatHeader: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white shadow-lg">
      <div className="flex items-center space-x-3">
        <div className="flex items-center justify-center w-10 h-10 bg-white/20 rounded-full">
          <Bot className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-semibold">AI FAQ Assistant</h1>
          <p className="text-blue-100 text-sm">Ask me anything!</p>
        </div>
        <div className="ml-auto">
          <MessageCircle className="w-6 h-6 text-white/80" />
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;