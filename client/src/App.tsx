import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useChat } from './hooks/useChat';
import './styles/globals.css';

// Types
interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}



// Components
const Header = () => (
  <header className="bg-gradient-to-r from-blue-50 to-green-50 border-b border-blue-100 px-6 py-4">
    <div className="max-w-4xl mx-auto flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center">
        </div>
        <div>
          <h1 className="text-xl font-semibold text-gray-800">HealthCare Assistant</h1>
          <p className="text-sm text-gray-600">Your personal health information companion</p>
        </div>
      </div>
    </div>
  </header>
);

const MessageBubble = ({ message }: { message: Message }) => (
  <motion.div
    initial={{ opacity: 0, y: 20, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ duration: 0.3 }}
    className={`flex items-start space-x-3 ${
      message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
    }`}
  >
    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
      message.sender === 'user' 
        ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white' 
        : 'bg-gradient-to-br from-green-500 to-green-600 text-white'
    }`}>
      {message.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
    </div>
    <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm ${
      message.sender === 'user'
        ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-md'
        : 'bg-white text-gray-800 border border-gray-100 rounded-bl-md'
    }`}>
      <p className="text-sm leading-relaxed">{message.content}</p>
      <p className={`text-xs mt-2 ${
        message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
      }`}>
        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </p>
    </div>
  </motion.div>
);


const ChatInput = ({ onSendMessage, disabled }: { onSendMessage: (message: string) => void; disabled: boolean }) => {
  const [message, setMessage] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  useEffect(() => {
    if (!disabled && inputRef.current) {
      inputRef.current.focus();
    }
  }, [disabled]);

  return (
    <div className="border-t border-gray-100 bg-white p-4">
      <div className="max-w-4xl mx-auto flex items-center space-x-3">
        <div className="flex-1 relative">
          <input
            ref={inputRef}
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about appointments, test results, medications, or any health questions..."
            disabled={disabled}
            className="w-full px-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 text-sm"
          />
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSubmit}
          disabled={disabled || !message.trim()}
          className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-500 text-white rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-shadow"
        >
          {disabled ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </motion.button>
      </div>
    </div>
  );
};


// Main App Component
const App = () => {
  const { messages, isLoading, sendMessage } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);


  const handleSendMessage = (message: string) => {
    sendMessage(message);
  };


  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Header />
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 py-6">
            <div className="space-y-6">
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>
        <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
      </div>
    </div>
  );
};

export default App;