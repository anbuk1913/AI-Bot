import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Heart, Shield, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './styles/globals.css';

// Types
interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}



// Mock API service
const chatService = {
  async sendMessage(message: string): Promise<string> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    const lowerMessage = message.toLowerCase();
    
    // Simple patient information responses
    if (lowerMessage.includes('appointment') || lowerMessage.includes('schedule')) {
      return "I can help you with appointment information. Your next appointment is scheduled for Tuesday, October 15th at 2:30 PM with Dr. Johnson. Would you like to reschedule or get directions to the clinic?";
    }
    
    if (lowerMessage.includes('medication') || lowerMessage.includes('prescription')) {
      return "For medication information, I can see you're currently prescribed Lisinopril 10mg daily for blood pressure management. Please remember to take it with food. Do you have any questions about your medication schedule or side effects?";
    }
    
    if (lowerMessage.includes('test results') || lowerMessage.includes('lab')) {
      return "Your recent lab results show all values within normal ranges. Your blood pressure is well-controlled at 128/82, and your cholesterol levels have improved since your last visit. Dr. Johnson will discuss the complete results during your next appointment.";
    }
    
    if (lowerMessage.includes('insurance') || lowerMessage.includes('billing')) {
      return "I can help with billing questions. Your insurance (Blue Cross Blue Shield) covers 80% of your recent visit costs. You have a remaining balance of $45.50. You can pay online through our patient portal or call our billing department at (555) 123-4567.";
    }
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return "Hello! I'm your personal health assistant. I'm here to help you access your patient information, appointment details, test results, and answer general health questions. What would you like to know today?";
    }
    
    if (lowerMessage.includes('pain') || lowerMessage.includes('symptoms')) {
      return "I understand you're experiencing some discomfort. While I can provide general information, please remember that for any urgent symptoms or severe pain, you should contact your healthcare provider immediately or call our 24/7 nurse line at (555) 987-6543. Is this something that needs immediate attention?";
    }
    
    // Default response
    return "I'm here to help you with your patient information, appointments, test results, medications, and general health questions. Could you please be more specific about what you'd like to know? For example, you can ask about your next appointment, recent test results, or medication schedules.";
  }
};

// Custom Hooks
const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your personal health assistant. I can help you access your patient information, schedule appointments, and answer health-related questions. How can I assist you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await chatService.sendMessage(content);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.log(error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I apologize, but I'm having trouble connecting right now. Please try again in a moment or contact our support team if the issue persists.",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return { messages, isLoading, sendMessage };
};

// Components
const Header = () => (
  <header className="bg-gradient-to-r from-blue-50 to-green-50 border-b border-blue-100 px-6 py-4">
    <div className="max-w-4xl mx-auto flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center">
          <Heart className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-gray-800">HealthCare Assistant</h1>
          <p className="text-sm text-gray-600">Your personal health information companion</p>
        </div>
      </div>
      <div className="flex items-center space-x-4 text-sm text-gray-600">
        <div className="flex items-center space-x-1">
          <Shield className="w-4 h-4 text-green-500" />
          <span>Secure</span>
        </div>
        <div className="flex items-center space-x-1">
          <Clock className="w-4 h-4 text-blue-500" />
          <span>24/7 Available</span>
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

const TypingIndicator = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="flex items-start space-x-3"
  >
    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-green-600 text-white flex items-center justify-center">
      <Bot className="w-4 h-4" />
    </div>
    <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-bl-md shadow-sm">
      <div className="flex space-x-1">
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity, delay: 0 }}
          className="w-2 h-2 bg-green-500 rounded-full"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
          className="w-2 h-2 bg-green-500 rounded-full"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
          className="w-2 h-2 bg-green-500 rounded-full"
        />
      </div>
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

const QuickActions = ({ onActionClick }: { onActionClick: (action: string) => void }) => {
  const actions = [
    { label: "My Appointments", query: "When is my next appointment?" },
    { label: "Test Results", query: "Can I see my latest test results?" },
    { label: "Medications", query: "What medications am I currently taking?" },
    { label: "Billing Information", query: "What is my current account balance?" }
  ];

  return (
    <div className="p-4 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <p className="text-sm text-gray-600 mb-3">Quick actions:</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {actions.map((action, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onActionClick(action.query)}
              className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-700 hover:border-blue-300 hover:bg-blue-50 transition-colors"
            >
              {action.label}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

// Main App Component
const App = () => {
  const { messages, isLoading, sendMessage } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showQuickActions, setShowQuickActions] = useState(true);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (message: string) => {
    setShowQuickActions(false);
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
              <AnimatePresence>
                {isLoading && <TypingIndicator />}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>

        {showQuickActions && messages.length === 1 && (
          <QuickActions onActionClick={handleSendMessage} />
        )}

        <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
      </div>

      {/* Emergency Contact Notice */}
      <div className="bg-red-50 border-t border-red-100 px-4 py-2">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs text-red-700 text-center">
            🚨 For medical emergencies, call 911 immediately. For urgent care, contact our 24/7 nurse line: (555) 987-6543
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;