export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export interface ChatSession {
  sessionId: string;
  patientId?: string;
  messages: Message[];
  createdAt: Date;
}

export interface ChatResponse {
  response: string;
  sessionId: string;
}

