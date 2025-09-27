import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/App.css";

const App: React.FC = () => {
  const navigate = useNavigate();
  const [messages] = useState<
    { text: string; isUser: boolean; time: string }[]
  >([
    {
      text: "Hello! I'm your personal health assistant. How can I assist you today?",
      isUser: false,
      time: "Just now",
    },
  ]);

  const openChat = () => {
    navigate("/chat");
  };

  const [isTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      // setUserId(storedUserId);
    } else {
      const newUserId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("userId", newUserId);
    }
  }, []);

  return (
    <div>
      <section className="hero">
        <div className="hero-content">
          <h1>HealthAI Assistant</h1>
          <div className="features">
            <div className="feature-card">
              <div className="feature-icon">🏥</div>
              <h3>Symptom Check</h3>
              <p>
                Quick and accurate symptom assessment to guide your health
                decisions
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💊</div>
              <h3>Wellness Tips</h3>
              <p>
                Personalized advice for nutrition, fitness, and mental wellbeing
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🤖</div>
              <h3>24/7 Support</h3>
              <p>
                Always available to answer your health questions anytime,
                anywhere
              </p>
            </div>
          </div>

          <button className="cta-button" onClick={openChat}>
            Start Your Health Journey
          </button>
        </div>
      </section>

      {/* Chat Bubble */}
      <div className="chat-bubble" onClick={openChat}>
        <svg viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12c0 1.54.36 3 .97 4.29L2 22l5.71-.97C9 21.64 10.46 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-1.38 0-2.68-.29-3.85-.81l-.27-.13-2.82.48.48-2.82-.13-.27C4.29 14.68 4 13.38 4 12c0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-8 8z" />
        </svg>
      </div>
    </div>
  );
};

export default App;