import { apiService } from './api';
// import { ChatRequest, ChatResponse, Message } from '../types';
import { Message } from '../types/chat';
import { ChatResponse } from '../types/chat';
// import { ChatRequest } from '../types/api';

class ChatService {
  async sendMessage(): Promise<ChatResponse> {
    try {
      return await apiService.post<ChatResponse>('/chat/message',);
    } catch (error) {
      throw new Error(`Failed to send message: ${error}`);
    }
  }

  async getChatHistory(patientId: string, sessionId: string): Promise<Message[]> {
    try {
      return await apiService.get<Message[]>(`/chat/history/${patientId}/${sessionId}`);
    } catch (error) {
      throw new Error(`Failed to fetch chat history: ${error}`);
    }
  }

  // Mock service for demo purposes (when API is not available)
  async sendMessageMock(message: string): Promise<string> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    const lowerMessage = message.toLowerCase();
    
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
    
    return "I'm here to help you with your patient information, appointments, test results, medications, and general health questions. Could you please be more specific about what you'd like to know? For example, you can ask about your next appointment, recent test results, or medication schedules.";
  }
}

export const chatService = new ChatService();
