import { useState } from "react";
import { apiService } from "../services/api";

export type ApiOption = "openai" | "gemini" | "grok" | "deepseek";

interface Message {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
  responseTime?: number;
}

interface ChatResponse {
  success: boolean;
  data: {
    responses: {
      [key in ApiOption]?: { answer: string; responseTime: number };
    };
  };
}

export const useChat = (selectedApi: ApiOption = "openai") => {
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content:
        "Hello! I'm your personal health assistant. How can I assist you today?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Use apiService to call backend
      const data: ChatResponse = await apiService.post<ChatResponse>(
        "/chat/message",
        {
          message: content,
          selectedApi,
        }
      );
      console.log(data);
      console.log(selectedApi);
      if (data.success && data.data.responses[selectedApi]) {
        const { answer, responseTime } = data.data.responses[selectedApi]!;

        const botMessage: Message = {
          id: Date.now().toString(),
          content: `[${selectedApi.toUpperCase()}] (${responseTime} ms): ${answer}`,
          sender: "bot",
          timestamp: new Date(),
          responseTime,
        };

        setMessages((prev) => [...prev, botMessage]);
      } else {
        const errorMessage: Message = {
          id: Date.now().toString(),
          content: "⚠️ No response from server",
          sender: "bot",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: "❌ Error contacting server",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return { messages, isLoading, sendMessage };
};
