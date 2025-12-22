// src/components/HRAssistant.js
import React, { useState, useRef, useEffect } from "react";
import './HRAssistant.css'; // We'll create this CSS file

const HRAssistant = () => {
  const [question, setQuestion] = useState("");
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const textareaRef = useRef(null);
  const conversationEndRef = useRef(null);

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  // Sample questions for suggestions
  const sampleQuestions = [
    "How many casual leaves do I get per year?",
    "What is the maternity leave policy?",
    "Do I need a medical certificate for sick leave?",
    "How many paternity leaves are available?",
    "What is the earned leave policy?",
    "How many sick leaves can I take annually?",
    "What is the process for applying leave?",
    "Is there a probation period policy?",
    "What are the working hours and overtime policies?",
    "What is the notice period requirement?"
  ];

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuestion(value);
    
    // Show suggestions based on input
    if (value.length > 0) {
      const filtered = sampleQuestions.filter(q =>
        q.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 3));
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const selectSuggestion = (suggestion) => {
    setQuestion(suggestion);
    setShowSuggestions(false);
    textareaRef.current?.focus();
  };

  const askHRQuestion = async (customQuestion = null) => {
    const questionToAsk = customQuestion || question.trim();
    if (!questionToAsk) return;

    // Add user question to conversation immediately
    const userMessage = {
      id: Date.now() + '-user',
      type: 'user',
      content: questionToAsk,
      timestamp: new Date().toLocaleTimeString()
    };

    setConversation(prev => [...prev, userMessage]);
    setQuestion("");
    setLoading(true);
    setShowSuggestions(false);

    try {
      const response = await fetch("https://ai-backend-orpin-three.vercel.app/api/rag/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: questionToAsk }),
      });

      if (!response.ok) throw new Error('Network response was not ok');

      const answer = await response.json();

      const assistantMessage = {
        id: Date.now() + '-assistant',
        type: 'assistant',
        content: answer.answer,
        source: answer.source,
        confidence: answer.confidence,
        relevant_policy: answer.relevant_policy,
        timestamp: new Date().toLocaleTimeString()
      };

      setConversation(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Failed to get HR answer:", error);
      
      const errorMessage = {
        id: Date.now() + '-error',
        type: 'error',
        content: "Sorry, I couldn't fetch the answer. Please make sure the backend server is running on port 5000.",
        timestamp: new Date().toLocaleTimeString()
      };

      setConversation(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const clearConversation = () => {
    setConversation([]);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      askHRQuestion();
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence > 0.8) return '#10b981'; // green
    if (confidence > 0.6) return '#f59e0b'; // yellow
    return '#ef4444'; // red
  };

  return (
    <div className="hr-assistant">
      {/* Header */}
      <div className="hr-header">
        <div className="header-content">
          <div className="header-icon">💼</div>
          <div>
            <h2>HR Policy Assistant</h2>
            <p>Get instant answers about company policies and benefits</p>
          </div>
        </div>
        {conversation.length > 0 && (
          <button className="clear-btn" onClick={clearConversation}>
            Clear Chat
          </button>
        )}
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h4>Quick Questions</h4>
        <div className="action-chips">
          {sampleQuestions.slice(0, 6).map((q, index) => (
            <button
              key={index}
              className="action-chip"
              onClick={() => askHRQuestion(q)}
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Conversation Area */}
      <div className="conversation-area">
        {conversation.length === 0 ? (
          <div className="welcome-message">
            <div className="welcome-icon">👋</div>
            <h3>Welcome to HR Assistant!</h3>
            <p>Ask me anything about company policies, leaves, benefits, or procedures.</p>
            <div className="feature-list">
              <div className="feature">
                <span className="feature-icon">📋</span>
                <span>Leave Policies</span>
              </div>
              <div className="feature">
                <span className="feature-icon">💰</span>
                <span>Benefits Info</span>
              </div>
              <div className="feature">
                <span className="feature-icon">⚖️</span>
                <span>Company Procedures</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="messages-container">
            {conversation.map((message) => (
              <div
                key={message.id}
                className={`message ${message.type}`}
              >
                <div className="message-content">
                  {message.type === 'user' && (
                    <div className="user-message">
                      <div className="message-avatar">👤</div>
                      <div className="message-bubble">
                        <p>{message.content}</p>
                        <span className="message-time">{message.timestamp}</span>
                      </div>
                    </div>
                  )}
                  
                  {message.type === 'assistant' && (
                    <div className="assistant-message">
                      <div className="message-avatar">🤖</div>
                      <div className="message-bubble">
                        <p>{message.content}</p>
                        
                        {message.relevant_policy && (
                          <div className="policy-reference">
                            <div className="reference-header">
                              <strong>📄 Policy Reference</strong>
                            </div>
                            <p>{message.relevant_policy}</p>
                          </div>
                        )}
                        
                        <div className="message-meta">
                          <span className="message-time">{message.timestamp}</span>
                          <span 
                            className="confidence-badge"
                            style={{ backgroundColor: getConfidenceColor(message.confidence) }}
                          >
                            {Math.round(message.confidence * 100)}% confident
                          </span>
                          <span className="source">Source: {message.source}</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {message.type === 'error' && (
                    <div className="error-message">
                      <div className="message-avatar">⚠️</div>
                      <div className="message-bubble">
                        <p>{message.content}</p>
                        <span className="message-time">{message.timestamp}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="message assistant">
                <div className="message-content">
                  <div className="assistant-message">
                    <div className="message-avatar">🤖</div>
                    <div className="message-bubble">
                      <div className="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={conversationEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="input-area">
        <div className="input-container">
          <div className="textarea-wrapper">
            <textarea
              ref={textareaRef}
              value={question}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Ask about HR policies, leaves, benefits..."
              rows="1"
              disabled={loading}
            />
            {showSuggestions && suggestions.length > 0 && (
              <div className="suggestions-dropdown">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    className="suggestion-item"
                    onClick={() => selectSuggestion(suggestion)}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={() => askHRQuestion()}
            disabled={!question.trim() || loading}
            className="send-button"
          >
            {loading ? (
              <div className="loading-spinner"></div>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
              </svg>
            )}
          </button>
        </div>
        <div className="input-hint">
          Press Enter to send • Shift+Enter for new line
        </div>
      </div>
    </div>
  );
};

export default HRAssistant;