import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useChat } from "./hooks/useChat";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "./styles/App.css"; // Chat styles

// ✅ Single Message type
interface Message {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
}

// Header
const Header = () => (
  <header>
    <div className="container">
      <div className="icon-container">
        <Bot />
      </div>
      <div>
        <h1>HealthCare Assistant</h1>
      </div>
    </div>
  </header>
);

// Message bubble
const MessageBubble = ({ message }: { message: Message }) => {
  const isUser = message.sender === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25 }}
      className={`message-bubble ${isUser ? "user" : "bot"}`}
    >
      <div className={`icon ${isUser ? "user" : "bot"}`}>
        {isUser ? <User /> : <Bot />}
      </div>

      <div className={`content ${isUser ? "user" : "bot"}`}>
        {isUser ? (
          <p>{message.content}</p>
        ) : (
          <ReactMarkdown
            children={message.content}
            remarkPlugins={[remarkGfm]}
            components={{
              strong: (props) => (
                <strong className="font-semibold text-blue-600" {...props} />
              ),
              ul: (props) => (
                <ul className="list-disc pl-5 space-y-1" {...props} />
              ),
              ol: (props) => (
                <ol className="list-decimal pl-5 space-y-1" {...props} />
              ),
              li: (props) => (
                <li className="leading-relaxed" {...props} />
              ),
            }}
          />
        )}
        <p className="timestamp">
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </motion.div>
  );
};

// Input
const ChatInput = ({
  onSendMessage,
  disabled,
}: {
  onSendMessage: (message: string) => void;
  disabled: boolean;
}) => {
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
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
    <div className="chat-input">
      <div className="container">
        <input
          ref={inputRef}
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your health question..."
          disabled={disabled}
        />
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={handleSubmit}
          disabled={disabled || !message.trim()}
        >
          {disabled ? <Loader2 className="animate-spin" /> : <Send />}
        </motion.button>
      </div>
    </div>
  );
};

// Main app
const App = () => {
  const { messages, isLoading, sendMessage } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="app">
      <Header />
      <div className="content">
        <div className="messages">
          {messages.map((m) => (
            <MessageBubble key={m.id} message={m} />
          ))}
          <div ref={messagesEndRef} />
        </div>
        <ChatInput onSendMessage={sendMessage} disabled={isLoading} />
      </div>
    </div>
  );
};

export default App;