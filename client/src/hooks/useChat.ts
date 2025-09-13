import { useState, useCallback } from 'react';
import { Message } from '../types/chat';
import { chatService } from '../services/chatService';
import toast from 'react-hot-toast';

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your personal health assistant. I can help you access your patient information, schedule appointments, and answer health-related questions. How can I assist you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');

  const sendMessage = useCallback(async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Use mock service for demo purposes
      const response = await chatService.sendMessageMock(content);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I apologize, but I'm having trouble connecting right now. Please try again in a moment or contact our support team if the issue persists.",
        sender: 'bot',
        timestamp: new Date()
      };
      console.log(error);
      setMessages(prev => [...prev, errorMessage]);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearChat = useCallback(() => {
    setMessages([{
      id: '1',
      content: "Hello! I'm your personal health assistant. How can I assist you today?",
      sender: 'bot',
      timestamp: new Date()
    }]);
    setSessionId('');
  }, []);

  return { 
    messages, 
    isLoading, 
    sendMessage, 
    clearChat,
    sessionId 
  };
};