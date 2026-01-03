// src/components/AIChatAssistant.js
import React, { useState, useRef, useEffect } from "react";
import { 
  FaPaperPlane, 
  FaUser, 
  FaRobot, 
  FaCode,
  FaUserTie,
  FaFilm,
  FaGraduationCap,
  FaLightbulb,
  FaCopy,
  FaTrash
} from "react-icons/fa";
import './AIAssistant.css';

const AIChatAssistant = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "assistant",
      content: "Hello! I'm your AI assistant. I can help you with interview preparation, HR queries, movie recommendations, and more. How can I assist you today?",
      timestamp: new Date().toLocaleTimeString(),
      type: "welcome"
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatMode, setChatMode] = useState("general");
  const messagesEndRef = useRef(null);
  const BACKEND_URL = "https://ai-backend-orpin-three.vercel.app/"; // Your backend URL

  const chatModes = [
    { id: "general", label: "General", icon: <FaRobot />, color: "#667eea" },
    { id: "interview", label: "Interview", icon: <FaGraduationCap />, color: "#10b981" },
    { id: "hr", label: "HR", icon: <FaUserTie />, color: "#f59e0b" },
    { id: "movies", label: "Movies", icon: <FaFilm />, color: "#ef4444" },
    { id: "code", label: "Code", icon: <FaCode />, color: "#8b5cf6" }
  ];
  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleQuickPrompt = (prompt) => {
    setInputMessage(prompt);
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || loading) return;

    const userMessage = {
      id: messages.length + 1,
      role: "user",
      content: inputMessage,
      timestamp: new Date().toLocaleTimeString(),
      type: chatMode
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setLoading(true);

    try {
      // Make API call to your backend
      const response = await fetch(`${BACKEND_URL}/api/chat/completion`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: inputMessage,
          mode: chatMode
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || "Failed to get response");
      }

      const assistantMessage = {
        id: messages.length + 2,
        role: "assistant",
        content: data.response,
        timestamp: new Date().toLocaleTimeString(),
        type: chatMode
      };

      setMessages(prev => [...prev, assistantMessage]);
      setLoading(false);

    } catch (error) {
      console.error("Chat error:", error);
      
      const errorMessage = {
        id: messages.length + 2,
        role: "assistant",
        content: `Sorry, I encountered an error. Please try again.\n\nError: ${error.message}`,
        timestamp: new Date().toLocaleTimeString(),
        type: "error"
      };

      setMessages(prev => [...prev, errorMessage]);
      setLoading(false);
    }
  };

  // Enhanced version with model selection
  const sendMessageEnhanced = async () => {
    if (!inputMessage.trim() || loading) return;

    const userMessage = {
      id: messages.length + 1,
      role: "user",
      content: inputMessage,
      timestamp: new Date().toLocaleTimeString(),
      type: chatMode
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setLoading(true);

    try {
      // Select model based on chat mode
      const model = getModelForMode(chatMode);
      
      // Make API call with model selection
      const response = await fetch(`${BACKEND_URL}/api/chat/completion`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: inputMessage,
          mode: chatMode,
          model: model,
          temperature: getTemperatureForMode(chatMode),
          max_tokens: 1000
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      
      let aiResponse = "";
      if (data.response) {
        aiResponse = data.response;
      } else if (data.choices && data.choices[0]) {
        aiResponse = data.choices[0].message.content;
      } else {
        aiResponse = "I received your message, but couldn't parse the response.";
      }

      const assistantMessage = {
        id: messages.length + 2,
        role: "assistant",
        content: aiResponse,
        timestamp: new Date().toLocaleTimeString(),
        type: chatMode
      };

      setMessages(prev => [...prev, assistantMessage]);
      setLoading(false);

    } catch (error) {
      console.error("Chat error:", error);
      
      const errorMessage = {
        id: messages.length + 2,
        role: "assistant",
        content: `Sorry, I encountered an error. Please try again.\n\nError: ${error.message}\n\nPlease ensure the backend is running at ${BACKEND_URL}`,
        timestamp: new Date().toLocaleTimeString(),
        type: "error"
      };

      setMessages(prev => [...prev, errorMessage]);
      setLoading(false);
    }
  };

  // Helper functions for enhanced mode
  const getModelForMode = (mode) => {
    switch (mode) {
      case "interview":
        return "openai/gpt-4";
      case "hr":
        return "anthropic/claude-3-haiku";
      case "movies":
        return "openai/gpt-4o";
      case "code":
        return "openai/gpt-4";
      default:
        return "openai/gpt-3.5-turbo";
    }
  };

  const getTemperatureForMode = (mode) => {
    switch (mode) {
      case "interview":
      case "hr":
      case "code":
        return 0.3; // More deterministic
      case "movies":
        return 0.9; // More creative
      default:
        return 0.7; // Balanced
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessageEnhanced(); // Use enhanced version
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        role: "assistant",
        content: "Hello! I'm your AI assistant. I can help you with interview preparation, HR queries, movie recommendations, and more. How can I assist you today?",
        timestamp: new Date().toLocaleTimeString(),
        type: "welcome"
      }
    ]);
  };

  const copyMessage = (content) => {
    navigator.clipboard.writeText(content);
    // Optional: Add toast notification
    alert("Message copied to clipboard!");
  };

  // Test backend connection
  const testBackendConnection = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/debug/ai-status`);
      const data = await response.json();
      console.log("Backend status:", data);
      return data.openrouter_health;
    } catch (error) {
      console.error("Backend connection test failed:", error);
      return false;
    }
  };

  // Test on component mount
  useEffect(() => {
    testBackendConnection();
  }, []);

  return (
    <div className="ai-chat-assistant">
      {/* Header */}
      <div className="chat-header">
        <div className="header-content">
          <div className="header-icon">
            <FaRobot />
          </div>
          <div>
            <h2>AI Chat Assistant</h2>
            <p>Powered by OpenRouter AI • Mode: {chatModes.find(m => m.id === chatMode)?.label}</p>
          </div>
        </div>
        <div className="header-actions">
          <button className="clear-chat-btn" onClick={clearChat}>
            <FaTrash /> Clear Chat
          </button>
        </div>
      </div>

      {/* Chat Mode Selector */}
      <div className="chat-mode-selector">
        {chatModes.map((mode) => (
          <button
            key={mode.id}
            className={`mode-btn ${chatMode === mode.id ? 'active' : ''}`}
            onClick={() => setChatMode(mode.id)}
            style={{ 
              background: chatMode === mode.id ? mode.color : '#f3f4f6',
              color: chatMode === mode.id ? 'white' : '#374151'
            }}
          >
            {mode.icon}
            <span>{mode.label}</span>
          </button>
        ))}
      </div>


      {/* Chat Messages */}
      <div className="chat-container">
        <div className="messages-area">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`message ${message.role} ${message.type}`}
            >
              <div className="message-avatar">
                {message.role === 'user' ? <FaUser /> : <FaRobot />}
              </div>
              <div className="message-content">
                <div className="message-header">
                  <span className="message-role">
                    {message.role === 'user' ? 'You' : 'AI Assistant'}
                    {message.role === 'assistant' && (
                      <span className="mode-badge">{message.type}</span>
                    )}
                  </span>
                  <span className="message-timestamp">{message.timestamp}</span>
                </div>
                <div className="message-text">
                  {message.content.split('\n').map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
                <div className="message-actions">
                  <button 
                    className="action-btn copy-btn"
                    onClick={() => copyMessage(message.content)}
                    title="Copy message"
                  >
                    <FaCopy />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="message assistant loading">
              <div className="message-avatar">
                <FaRobot />
              </div>
              <div className="message-content">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <div className="loading-text">
                  Connecting to AI backend...
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="chat-input-area">
        <div className="input-container">
          <div className="textarea-wrapper">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Type your ${chatMode} query here...`}
              rows="3"
              disabled={loading}
            />
          </div>
          <button
            onClick={sendMessageEnhanced}
            disabled={!inputMessage.trim() || loading}
            className="send-button"
          >
            {loading ? (
              <div className="loading-spinner"></div>
            ) : (
              <>
                <FaPaperPlane />
                Send
              </>
            )}
          </button>
        </div>
        <div className="input-hint">
          Press <kbd>Enter</kbd> to send • <kbd>Shift + Enter</kbd> for new line
        </div>
        <div className="backend-status">
          Backend: <span className="status-indicator active">● Connected</span>
        </div>
      </div>

      {/* Tips Section */}
      <div className="chat-tips">
        <div className="tips-header">
          <FaLightbulb className="tips-icon" />
          <h4>Chat Tips</h4>
        </div>
        <div className="tips-list">
          <div className="tip">
            <strong>Real AI:</strong> Responses come from OpenRouter AI models
          </div>
          <div className="tip">
            <strong>Switch modes:</strong> Different modes use different AI models
          </div>
          <div className="tip">
            <strong>Be specific:</strong> Clear questions get better answers
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChatAssistant;