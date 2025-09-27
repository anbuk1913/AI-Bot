import { useState, useEffect } from "react";
import { apiService } from "../services/api";

export type ApiOption = "openai" | "gemini" | "grok" | "deepseek";

interface Message {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
  contexts?: string[];
}

interface ChatResponse {
  success: boolean;
  data: {
    responses: {
      [key in ApiOption]?: { answer: string };
    };
  };
}

interface ChatRequest {
  message: string;
  selectedApi: ApiOption;
  userId: string | null;
  contexts?: string[];
}

export const useChat = (selectedApi: ApiOption = "openai") => {
  const [history, setHistory] = useState<string[]>([]);
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

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) return;

        const res = await apiService.get<{ success: boolean; data: string[]; message?: string }>(
          `/chat/history/${userId}`
        );

        if (res.success && res.data) {
          setHistory(res.data);
        }
      } catch (error) {
        console.error("Error fetching history:", error);
      }
    };

    fetchHistory();
  }, []);

  const refreshHistory = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      const res = await apiService.get<{ success: boolean; data: string[]; message?: string }>(
        `/chat/history/${userId}`
      );

      if (res.success && res.data) {
        setHistory(res.data);
      }
    } catch (error) {
      console.error("Error refreshing history:", error);
    }
  };

  const sendMessage = async (content: string, contexts: string[] = []) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: "user",
      timestamp: new Date(),
      contexts: contexts.length > 0 ? [...contexts] : undefined,
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const userId: string | null = localStorage.getItem("userId");
      const requestPayload: ChatRequest = {
        message: content,
        userId,
        selectedApi,
        ...(contexts.length > 0 && { contexts })
      };

      const data: ChatResponse = await apiService.post<ChatResponse>(
        "/chat/message",
        requestPayload
      );

      if (data.success && data.data.responses[selectedApi]) {
        const { answer } = data.data.responses[selectedApi]!;

        const botMessage: Message = {
          id: Date.now().toString(),
          content: `${answer}`,
          sender: "bot",
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, botMessage]);
        
        await refreshHistory();
        
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

  return { 
    history, 
    messages, 
    isLoading, 
    sendMessage,
  };
};