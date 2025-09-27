import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2, Stethoscope, Activity, Settings, Plus, Sparkles } from "lucide-react";
import { useChat } from "../hooks/useChat";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "../styles/Chat.css";

type ApiOption = "openai" | "gemini" | "grok" | "deepseek";

interface Message {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
  contexts?: string[];
}

interface MessageWithContext {
  message: string;
  contexts: string[];
}

interface HeaderProps {
  selectedApi: ApiOption;
  setSelectedApi: React.Dispatch<React.SetStateAction<ApiOption>>;
}

const Header: React.FC<HeaderProps> = ({ selectedApi, setSelectedApi }) => (
  <header className="chat-header">
    <div className="header-container">
      <div className="header-left">
        <div className="logo-container">
          <Stethoscope className="logo-icon" />
          <Activity className="pulse-icon" />
          <div className="logo-sparkles">
            <Sparkles className="sparkle sparkle-1" />
            <Sparkles className="sparkle sparkle-2" />
            <Sparkles className="sparkle sparkle-3" />
          </div>
        </div>
        <div className="header-text">
          <p className="app-subtitle">
            Your intelligent health companion
          </p>
        </div>
      </div>
      <div className="header-right">
        <div className="api-selector-container">
          {/* <label htmlFor="api-select">AI Model</label> */}
          <select
            id="api-select"
            value={selectedApi}
            onChange={(e) => setSelectedApi(e.target.value as ApiOption)}
            className="api-selector"
          >
            <option value="openai">🚀 Mercury</option>
            <option value="gemini">✨ Venus</option>
            <option value="grok">🔥 Mars</option>
            <option value="deepseek">⚡ Jupiter</option>
          </select>
        </div>
      </div>
    </div>
  </header>
);

const MessageBubble = ({ message }: { message: Message }) => {
  const isUser = message.sender === "user";
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`message-container ${isUser ? "user-message" : "bot-message"} ${isVisible ? "visible" : ""}`}>
      <div className="message-avatar">
        <div className={`avatar-wrapper ${isUser ? "user-avatar" : "bot-avatar"}`}>
          {isUser ? (
            <User className="avatar-icon" />
          ) : (
            <Bot className="avatar-icon" />
          )}
        </div>
      </div>
      <div className="message-content">
        <div className={`message-bubble ${isUser ? "user-bubble" : "bot-bubble"}`}>
          {/* Context display for user messages */}
          {isUser && message.contexts && message.contexts.length > 0 && (
            <div className="message-contexts">
              <div className="contexts-header">
                <Settings size={12} />
                <span>Context Applied</span>
              </div>
              <div className="contexts-list">
                {message.contexts.map((ctx, index) => (
                  <span key={index} className="context-tag">
                    {ctx}
                  </span>
                ))}
              </div>
            </div>
          )}
          {isUser ? (
            <p className="message-text">{message.content}</p>
          ) : (
            <ReactMarkdown
              children={message.content}
              remarkPlugins={[remarkGfm]}
              components={{
                p: (props) => <p className="message-text" {...props} />,
                strong: (props) => (
                  <strong className="markdown-strong" {...props} />
                ),
                ul: (props) => (
                  <ul className="markdown-list" {...props} />
                ),
                ol: (props) => (
                  <ol className="markdown-ordered-list" {...props} />
                ),
                li: (props) => <li className="markdown-list-item" {...props} />,
                code: (props) => <code className="markdown-code" {...props} />,
                pre: (props) => <pre className="markdown-pre" {...props} />,
              }}
            />
          )}
        </div>
        <div className="message-time">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};

const TypingIndicator = () => (
  <div className="message-container bot-message typing-indicator">
    <div className="message-avatar">
      <div className="avatar-wrapper bot-avatar typing-avatar">
        <Bot className="avatar-icon" />
        <div className="typing-pulse"></div>
      </div>
    </div>
    <div className="message-content">
      <div className="message-bubble bot-bubble typing-bubble">
        <div className="typing-animation">
          <div className="typing-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <span className="typing-text">AI is thinking...</span>
        </div>
      </div>
    </div>
  </div>
);

const ContextSection = ({
  contexts,
  onAddContext,
  onRemoveContext,
  history = [],
  selectedHistory,
  setSelectedHistory
}: {
  contexts: string[];
  onAddContext: (context: string) => void;
  onRemoveContext: (index: number) => void;
  history?: string[];
  selectedHistory: string[];
  setSelectedHistory: React.Dispatch<React.SetStateAction<string[]>>;
}) => {
  const [contextInput, setContextInput] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const handleAddContext = () => {
    if (contextInput.trim()) {
      onAddContext(contextInput.trim());
      setContextInput("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddContext();
    }
  };

  const toggleHistorySelection = (item: string) => {
    setSelectedHistory((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  return (
    <div className="context-section">
      <div 
        className={`context-header ${isExpanded ? 'expanded-head' : ""}` }
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="context-header-content">
          <div className="context-header-left">
            <div className="context-icon-wrapper">
              <Settings className="context-icon" />
            </div>
            <div className="context-header-text">
              <h4>Personal Context</h4>
              <span className="context-count">{contexts.length} items added</span>
            </div>
          </div>
          <div className={`expand-arrow ${isExpanded ? 'expanded' : ''}`}>
            ▼
          </div>
        </div>
      </div>
      
      {isExpanded && (
        <div className="context-content">
          <div className="context-input-section">
            <div className="input-group">
              <input
                type="text"
                placeholder="e.g., Age 35, Diabetic, Morning medication"
                value={contextInput}
                onChange={(e) => setContextInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className="context-input"
              />
              <button
                onClick={handleAddContext}
                disabled={!contextInput.trim()}
                className={`add-context-btn ${contextInput.trim() ? 'active' : 'disabled'}`}
              >
                <Plus className="plus-icon" />
                Add Context
              </button>
            </div>
          </div>
          
          {contexts.length > 0 && (
            <div className="contexts-display">
              <div className="contexts-grid">
                {contexts.map((ctx, index) => (
                  <div key={index} className="context-chip">
                    <span className="context-text">{ctx}</span>
                    <button
                      onClick={() => onRemoveContext(index)}
                      className="remove-context-btn"
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {history.length > 0 && (
            <div className="history-section">
              <h5>Previous Conversations</h5>
              <div className="history-list">
                {history.map((item, index) => (
                  <label 
                    key={index} 
                    className={`history-item ${selectedHistory.includes(item) ? 'selected' : ''}`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedHistory.includes(item)}
                      onChange={() => toggleHistorySelection(item)}
                    />
                    <span className="history-item-text">{item}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {contexts.length === 0 && history.length === 0 && (
            <div className="empty-contexts">
              <Sparkles className="empty-icon" />
              <p>Add personal context to get more relevant health advice</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

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
    <div className="chat-input-container">
      <div className="input-wrapper">
        <div className="input-field-wrapper">
          <input
            ref={inputRef}
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me about symptoms, medications, health tips..."
            disabled={disabled}
            className="message-input"
          />
          <div className="input-gradient-border"></div>
        </div>
        <button
          onClick={handleSubmit}
          disabled={disabled || !message.trim()}
          className={`send-button ${disabled || !message.trim() ? "disabled" : "active"}`}
        >
          <div className="button-content">
            {disabled ? (
              <Loader2 className="button-icon spinning" />
            ) : (
              <Send className="button-icon" />
            )}
          </div>
          <div className="button-ripple"></div>
        </button>
      </div>
    </div>
  );
};

const Chat: React.FC = () => {
  const [selectedApi, setSelectedApi] = useState<ApiOption>("openai");
  const [contexts, setContexts] = useState<string[]>([]);
  const [selectedHistory, setSelectedHistory] = useState<string[]>([]);
  const { history, messages, isLoading, sendMessage } = useChat(selectedApi);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

    
    useEffect(() => {
      const storedUserId = localStorage.getItem("userId");
      if (storedUserId) {
        // setUserId(storedUserId);
      } else {
        const newUserId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem("userId", newUserId);
      }
    }, []);

  const handleAddContext = (context: string) => {
    setContexts(prev => [...prev, context]);
  };

  const handleRemoveContext = (index: number) => {
    setContexts(prev => prev.filter((_, i) => i !== index));
  };

  const handleSendMessage = (message: string) => {
    const messageWithContext: MessageWithContext = {
      message,
      contexts: [...contexts, ...selectedHistory],
    };
    console.log("Sending to backend:", messageWithContext);
    sendMessage(message, [...contexts, ...selectedHistory]);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  return (
    <div className="app-container">
      <Header selectedApi={selectedApi} setSelectedApi={setSelectedApi} />
      
      <main className="chat-main">
        <ContextSection
          contexts={contexts}
          onAddContext={handleAddContext}
          onRemoveContext={handleRemoveContext}
          history={history}
          selectedHistory={selectedHistory}
          setSelectedHistory={setSelectedHistory}  
        />
        
        <div 
          className="messages-container"
          ref={messagesContainerRef}
        >
          <div className="messages-wrapper">
            {messages.length === 0 && (
              <div className="welcome-message">
                <div className="welcome-content">
                  <div className="welcome-icon">
                    <Stethoscope />
                  </div>
                  <h2>Welcome to HealthCare Assistant AI</h2>
                  <p>I'm here to help you with health-related questions, symptom analysis, and wellness advice.</p>
                  <div className="welcome-features">
                    <div className="feature">
                      <span className="feature-icon">🩺</span>
                      <span>Symptom Analysis</span>
                    </div>
                    <div className="feature">
                      <span className="feature-icon">💊</span>
                      <span>Medication Info</span>
                    </div>
                    <div className="feature">
                      <span className="feature-icon">🏃‍♂️</span>
                      <span>Wellness Tips</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            {isLoading && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        </div>
        
        <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
      </main>
    </div>
  );
};

export default Chat;