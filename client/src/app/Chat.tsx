import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2, Stethoscope, Activity, Settings, Plus, Sparkles, History, X, Menu } from "lucide-react";
import { useChat } from "../hooks/useChat";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "../styles/Chat.css";
import { apiService } from "../services/api";
// import { useToast } from "../hooks/Toast";

type ApiOption = "openai" | "gemini" | "grok" | "deepseek";

interface Message {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
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
        </div>
        <div className="header-text">
          <p className="app-subtitle">Your intelligent health companion</p>
        </div>
      </div>
      <div className="header-right">
        <select
          id="api-select"
          value={selectedApi}
          onChange={(e) => setSelectedApi(e.target.value as ApiOption)}
          className="api-selector"
        >
          <option value="openai">🚀 Mercury</option>
          <option value="gemini">✨ Venus</option>
          <option value="grok">🔥 Mars</option>
        </select>
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
          {isUser ? <User className="avatar-icon" /> : <Bot className="avatar-icon" />}
        </div>
      </div>
      <div className="message-content">
        <div className={`message-bubble ${isUser ? "user-bubble" : "bot-bubble"}`}>
          {isUser ? (
            <p className="message-text">{message.content}</p>
          ) : (
            <ReactMarkdown
              children={message.content}
              remarkPlugins={[remarkGfm]}
              components={{
                p: (props) => <p className="message-text" {...props} />,
                strong: (props) => <strong className="markdown-strong" {...props} />,
                ul: (props) => <ul className="markdown-list" {...props} />,
                ol: (props) => <ol className="markdown-ordered-list" {...props} />,
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

const LeftSidebar = ({
  isOpen,
  onClose,
  history,
  selectedHistory,
  onToggleHistory
}: {
  isOpen: boolean;
  onClose: () => void;
  history: string[];
  selectedHistory: string[];
  onToggleHistory: (item: string) => void;
}) => (
  <div className={`sidebar left-sidebar ${isOpen ? 'open' : ''}`}>
    <div className="sidebar-header">
      <div className="sidebar-title">
        <History className="sidebar-icon" />
        <h3>Chat History</h3>
      </div>
      <button onClick={onClose} className="close-btn">
        <X size={18} />
      </button>
    </div>
    <div className="sidebar-content">
      {history.length > 0 ? (
        history.map((item, index) => (
          <label
            key={index}
            className={`history-item ${selectedHistory.includes(item) ? 'selected' : ''}`}
          >
            <input
              type="checkbox"
              checked={selectedHistory.includes(item)}
              onChange={() => onToggleHistory(item)}
              className="history-checkbox"
            />
            <span className="history-text">{item}</span>
          </label>
        ))
      ) : (
        <div className="empty-sidebar">
          <History className="empty-icon" />
          <p>No previous conversations</p>
        </div>
      )}
    </div>
  </div>
);

const RightSidebar = ({
  isOpen,
  onClose,
  contexts,
  selectedContexts,
  onAddContext,
  onRemoveContext,
  onToggleContext
}: {
  isOpen: boolean;
  onClose: () => void;
  contexts: string[];
  selectedContexts: string[];
  onAddContext: (context: string) => void;
  onRemoveContext: (context: string) => void;
  onToggleContext: (context: string) => void;
}) => {
  const [contextInput, setContextInput] = useState("");

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

  return (
    <div className={`sidebar right-sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-title">
          <Settings className="sidebar-icon" />
          <h3>Personal Context</h3>
        </div>
        <button onClick={onClose} className="close-btn">
          <X size={18} />
        </button>
      </div>
      <div className="sidebar-content">
        <div className="context-input-section">
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

        {contexts.length > 0 && (
          <div className="contexts-display">
            <div style={{ marginBottom: '12px', fontSize: '0.875rem', color: '#64748b', fontWeight: '600' }}>
              Selected: {selectedContexts.length}/5
            </div>
            {contexts.map((ctx) => (
              <label
                key={ctx}
                className={`context-chip ${selectedContexts.includes(ctx) ? 'selected' : ''}`}
                style={{ 
                  cursor: 'pointer',
                  opacity: !selectedContexts.includes(ctx) && selectedContexts.length >= 5 ? 0.6 : 1
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedContexts.includes(ctx)}
                  onChange={() => onToggleContext(ctx)}
                  disabled={!selectedContexts.includes(ctx) && selectedContexts.length >= 5}
                  style={{ 
                    cursor: selectedContexts.includes(ctx) || selectedContexts.length < 5 ? 'pointer' : 'not-allowed',
                    marginRight: '10px'
                  }}
                />
                <span className="context-text">{ctx}</span>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    onRemoveContext(ctx);
                  }}
                  className="remove-context-btn"
                >
                  ×
                </button>
              </label>
            ))}
          </div>
        )}

        {contexts.length === 0 && (
          <div className="empty-sidebar">
            <Sparkles className="empty-icon" />
            <p>Add personal context to get more relevant health advice</p>
          </div>
        )}
      </div>
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
        <button
          onClick={handleSubmit}
          disabled={disabled || !message.trim()}
          className={`send-button ${disabled || !message.trim() ? "disabled" : "active"}`}
        >
          {disabled ? (
            <Loader2 className="button-icon spinning" />
          ) : (
            <Send className="button-icon" />
          )}
        </button>
      </div>
    </div>
  );
};

const Chat: React.FC = () => {
  const [selectedApi, setSelectedApi] = useState<ApiOption>("openai");
  const [contexts, setContexts] = useState<string[]>([]);
  const [selectedContexts, setSelectedContexts] = useState<string[]>([]);
  const [selectedHistory, setSelectedHistory] = useState<string[]>([]);
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true);
  
  const { history, messages, isLoading, sendMessage } = useChat(selectedApi);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // const { showToast, ToastContainer } = useToast();

  useEffect(() => {
    const fetchContexts = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) return;

        const res = await apiService.get<{ success: boolean; data: string[]; message?: string }>(
          `/chat/contexts/${userId}`
        );

        if (res.success && res.data) {
          setContexts(res.data);
        }
      } catch (error) {
        console.error("Error fetching contexts:", error);
      }
    };

    fetchContexts();
  }, []);

  const handleAddContext = async (context: string) => {
    if (contexts.includes(context)) {
      alert("This context already exists!")
      // showToast("This context already exists!", "error");
      return;
    }

    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        alert("User ID not found - Please reload the Page")
        // showToast("User ID not found - Please reload the Page", "error");
        return;
      }

      const response = await apiService.post<{ success: boolean; message?: string }>(
        `/chat/add/${userId}`,
        { context }
      );

      if (response.success) {
        setContexts(prev => [...prev, context]);
        if (selectedContexts.length < 5) {
          setSelectedContexts(prev => [...prev, context]);
        }
      } else {
        alert("Failed to add context")
        // showToast("Failed to add context", "info");
      }
    } catch (error) {
      console.error("Error adding context:", error);
      alert("Error adding context")
      // showToast("Error adding context", "error");
    }
  };

  const handleRemoveContext = async (context: string) => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        alert("User ID not found")
        // showToast("User ID not found", "warning");
        return;
      }

      const response = await apiService.post<{ success: boolean; message?: string }>(
        `/chat/remove/${userId}`,
        { context }
      );

      if (response.success) {
        setContexts(prev => prev.filter(c => c !== context));
        setSelectedContexts(prev => prev.filter(c => c !== context));
      } else {
        alert("Failed to remove context")
        // showToast("Failed to remove context", "warning");
      }
    } catch (error) {
      alert("Error removing context")
      console.error("Error removing context:", error);
      // showToast("Error removing context", 'error');
    }
  };

  const handleToggleContext = (context: string) => {
    setSelectedContexts(prev => {
      if (prev.includes(context)) {
        return prev.filter(c => c !== context);
      } else {
        if (prev.length < 5) {
          return [...prev, context];
        }
        return prev;
      }
    });
  };

  const handleToggleHistory = (item: string) => {
    setSelectedHistory(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  const handleSendMessage = (message: string) => {
    sendMessage(message, [...selectedContexts], [...selectedHistory]);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  return (
    <div className="app-container">
      {/* <ToastContainer /> */}
      <Header selectedApi={selectedApi} setSelectedApi={setSelectedApi} />
      
      <div className="main-layout">
        <LeftSidebar
          isOpen={leftSidebarOpen}
          onClose={() => setLeftSidebarOpen(false)}
          history={history}
          selectedHistory={selectedHistory}
          onToggleHistory={handleToggleHistory}
        />

        <main className="chat-main">
          {!leftSidebarOpen && (
            <button
              onClick={() => setLeftSidebarOpen(true)}
              className="toggle-btn left-toggle"
            >
              <Menu size={20} />
            </button>
          )}
          {!rightSidebarOpen && (
            <button
              onClick={() => setRightSidebarOpen(true)}
              className="toggle-btn right-toggle"
            >
              <Settings size={20} />
            </button>
          )}

          <div className="messages-container">
            <div className="messages-wrapper">
              {messages.length === 0 && (
                <div className="welcome-message">
                  <div className="welcome-content">
                    <div className="welcome-icon">
                      <Stethoscope />
                    </div>
                    <h2>Welcome to HealthCare Assistant AI</h2>
                    <p>I'm here to help you with health-related questions, symptom analysis, and wellness advice.</p>
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

        <RightSidebar
          isOpen={rightSidebarOpen}
          onClose={() => setRightSidebarOpen(false)}
          contexts={contexts}
          selectedContexts={selectedContexts}
          onAddContext={handleAddContext}
          onRemoveContext={handleRemoveContext}
          onToggleContext={handleToggleContext}
        />
      </div>
    </div>
  );
};

export default Chat;