import React from 'react';
import ChatHeader from './components/ChatHeader';
import ChatContainer from './components/ChatContainer';

const App: React.FC = () => {
  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <ChatHeader />
      <div className="flex-1 flex flex-col min-h-0">
        <ChatContainer />
      </div>
    </div>
  );
};

export default App;