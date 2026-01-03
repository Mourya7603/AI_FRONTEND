// src/components/MentalHealthSupport.js
import React, { useState } from 'react';
import './MentalHealthSupport.css';

const MentalHealthSupport = () => {
  const [activeTab, setActiveTab] = useState('chat');
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { id: 1, sender: 'ai', text: "Hello, I'm here to listen. How are you feeling today?" }
  ]);
  const [loading, setLoading] = useState(false);
  const [mood, setMood] = useState(5); // 1-10 scale

  const tabs = [
    { id: 'chat', label: 'AI Chat' },
    { id: 'tools', label: 'Quick Tools' },
    { id: 'resources', label: 'Resources' }
  ];

  const crisisLines = [
    { name: 'Suicide Prevention', number: '988', available: '24/7' },
    { name: 'Crisis Text Line', number: 'Text HOME to 741741', available: '24/7' },
    { name: 'Domestic Violence', number: '800-799-7233', available: '24/7' },
    { name: 'Substance Abuse', number: '800-662-4357', available: '24/7' }
  ];

  const wellnessTools = [
    { id: 'breathe', name: 'Breathe', time: '1 min', desc: 'Calm your mind' },
    { id: 'ground', name: 'Grounding', time: '2 min', desc: '5-4-3-2-1 technique' },
    { id: 'gratitude', name: 'Gratitude', time: '2 min', desc: 'Three good things' },
    { id: 'meditate', name: 'Meditate', time: '3 min', desc: 'Quick mindfulness' }
  ];

  const sendMessage = async () => {
    if (!message.trim() || loading) return;

    const userMsg = { id: chatHistory.length + 1, sender: 'user', text: message };
    setChatHistory(prev => [...prev, userMsg]);
    setMessage('');
    setLoading(true);

    try {
      // Call your backend AI
      const response = await fetch('https://ai-backend-orpin-three.vercel.app/api/mental-health/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          mood: mood,
          context: chatHistory.slice(-3).map(msg => msg.text) // Send last 3 messages as context
        })
      });

      const data = await response.json();
      
      if (data.success) {
        const aiMsg = { 
          id: chatHistory.length + 2, 
          sender: 'ai', 
          text: data.response 
        };
        setChatHistory(prev => [...prev, aiMsg]);
      } else {
        // Fallback if API fails
        const fallbackResponses = [
          "I hear you. Would you like to talk more about how you're feeling?",
          "That sounds challenging. Remember, it's okay to ask for help.",
          "Thank you for sharing. I'm here to listen.",
          "How has this been affecting your day-to-day life?"
        ];
        const aiMsg = { 
          id: chatHistory.length + 2, 
          sender: 'ai', 
          text: fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)] 
        };
        setChatHistory(prev => [...prev, aiMsg]);
      }
    } catch (error) {
      console.error('Error connecting to AI:', error);
      const errorMsg = { 
        id: chatHistory.length + 2, 
        sender: 'ai', 
        text: "I'm having trouble connecting right now. Please try again in a moment." 
      };
      setChatHistory(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const startTool = async (toolId) => {
    const tools = {
      breathe: {
        title: "Breathing Exercise",
        guide: "Follow the 4-7-8 breathing technique:\n\n1. Breathe IN through nose for 4 seconds\n2. Hold breath for 7 seconds\n3. Breathe OUT through mouth for 8 seconds\n\nRepeat 4 times."
      },
      ground: {
        title: "Grounding Exercise (5-4-3-2-1)",
        guide: "Name:\n5 things you can SEE\n4 things you can TOUCH\n3 things you can HEAR\n2 things you can SMELL\n1 thing you can TASTE"
      },
      gratitude: {
        title: "Gratitude Practice",
        guide: "Write down 3 things you're grateful for today:\n\n1. __________________\n2. __________________\n3. __________________\n\nNo matter how small!"
      },
      meditate: {
        title: "Quick Mindfulness",
        guide: "Close your eyes and focus on:\n1. Your breath for 1 minute\n2. Sounds around you for 1 minute\n3. Sensations in your body for 1 minute"
      }
    };

    const tool = tools[toolId];
    
    // Try to get AI guidance for the tool
    try {
      const response = await fetch('https://ai-backend-orpin-three.vercel.app/api/mental-health/tool', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tool: toolId,
          userMood: mood
        })
      });

      const data = await response.json();
      
      if (data.success) {
        alert(`${tool.title}\n\n${data.guidance || tool.guide}`);
      } else {
        alert(`${tool.title}\n\n${tool.guide}`);
      }
    } catch (error) {
      // Fallback to local guide
      alert(`${tool.title}\n\n${tool.guide}`);
    }
  };

  const checkMoodAndRespond = () => {
    if (mood <= 3) {
      setMessage("I'm really struggling today");
    } else if (mood <= 6) {
      setMessage("I'm feeling okay but could be better");
    } else {
      setMessage("I'm doing pretty well today");
    }
  };

  return (
    <div className="mental-health-container">
      {/* Header */}
      <div className="mh-header">
        <h1>🧠 Mental Health Support</h1>
        <p>Your compassionate AI companion for emotional wellbeing</p>
      </div>

      {/* Mood Check-in */}
      <div className="mood-checkin">
        <div className="mood-question">How are you feeling right now?</div>
        <div className="mood-slider-container">
          <input
            type="range"
            min="1"
            max="10"
            value={mood}
            onChange={(e) => setMood(parseInt(e.target.value))}
            className="mood-slider"
          />
          <div className="mood-scale">
            <span>😔 1</span>
            <span>😊 10</span>
          </div>
          <div className="current-mood">
            Current: <span className="mood-value">{mood}/10</span>
          </div>
        </div>
        <button className="mood-update-btn" onClick={checkMoodAndRespond}>
          Update Mood & Start Chat
        </button>
      </div>

      {/* Tabs */}
      <div className="mh-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="mh-content">
        {activeTab === 'chat' && (
          <div className="chat-container">
            <div className="chat-window">
              {chatHistory.map(msg => (
                <div key={msg.id} className={`message ${msg.sender}`}>
                  <div className="message-content">
                    {msg.text}
                  </div>
                  <div className="message-time">
                    {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="message ai">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              )}
            </div>
            
            <div className="chat-input">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="What's on your mind? I'm here to listen..."
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                disabled={loading}
              />
              <button onClick={sendMessage} disabled={!message.trim() || loading}>
                {loading ? '...' : 'Send'}
              </button>
            </div>
            
            <div className="quick-responses">
              <button onClick={() => setMessage("I'm feeling anxious right now")}>
                😟 Feeling Anxious
              </button>
              <button onClick={() => setMessage("I'm feeling overwhelmed")}>
                😰 Overwhelmed
              </button>
              <button onClick={() => setMessage("I'm having a hard day")}>
                😔 Hard Day
              </button>
              <button onClick={() => setMessage("I need some encouragement")}>
                💪 Need Support
              </button>
            </div>
          </div>
        )}

        {activeTab === 'tools' && (
          <div className="tools-container">
            <h3>Quick Wellness Tools</h3>
            <p className="tools-description">Evidence-based exercises to help in the moment</p>
            
            <div className="tools-grid">
              {wellnessTools.map(tool => (
                <div key={tool.id} className="tool-card" onClick={() => startTool(tool.id)}>
                  <div className="tool-icon">
                    {tool.id === 'breathe' && '🌬️'}
                    {tool.id === 'ground' && '🌍'}
                    {tool.id === 'gratitude' && '🙏'}
                    {tool.id === 'meditate' && '🧘‍♂️'}
                  </div>
                  <div className="tool-name">{tool.name}</div>
                  <div className="tool-time">⏱️ {tool.time}</div>
                  <div className="tool-desc">{tool.desc}</div>
                  <button className="start-tool-btn">Start</button>
                </div>
              ))}
            </div>
            
            <div className="breathing-exercise">
              <h4>🌬️ Live Breathing Exercise</h4>
              <div className="breathing-animation">
                <div className="breath-circle inhale">Breathe IN</div>
                <div className="breath-circle hold">Hold</div>
                <div className="breath-circle exhale">Breathe OUT</div>
              </div>
              <div className="breathing-timer">
                <span className="timer">00:00</span>
                <button className="timer-control">Start Timer</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'resources' && (
          <div className="resources-container">
            <h3>Crisis & Support Resources</h3>
            <p className="resources-subtitle">Immediate help available 24/7</p>
            
            <div className="crisis-list">
              {crisisLines.map((line, index) => (
                <div key={index} className="crisis-item">
                  <div className="resource-icon">📞</div>
                  <div className="resource-info">
                    <div className="resource-name">{line.name}</div>
                    <div className="resource-number">{line.number}</div>
                    <div className="resource-available">🕒 {line.available}</div>
                  </div>
                  <button 
                    className="call-btn"
                    onClick={() => {
                      if (line.number.includes('Text')) {
                        alert(`Text ${line.number.split('Text ')[1]} to connect with a crisis counselor`);
                      } else {
                        alert(`Calling ${line.name}: ${line.number}`);
                      }
                    }}
                  >
                    Connect
                  </button>
                </div>
              ))}
            </div>

            <div className="self-care-tips">
              <h4>💙 Self-Care Strategies</h4>
              <div className="tips-grid">
                <div className="tip-card">
                  <div className="tip-icon">💧</div>
                  <h5>Hydrate</h5>
                  <p>Drink water to help regulate emotions</p>
                </div>
                <div className="tip-card">
                  <div className="tip-icon">🏃‍♂️</div>
                  <h5>Move</h5>
                  <p>5-minute walk can boost mood</p>
                </div>
                <div className="tip-card">
                  <div className="tip-icon">📝</div>
                  <h5>Journal</h5>
                  <p>Write down thoughts and feelings</p>
                </div>
                <div className="tip-card">
                  <div className="tip-icon">🎵</div>
                  <h5>Music</h5>
                  <p>Listen to calming music</p>
                </div>
              </div>
            </div>

            <div className="disclaimer">
              <h4>⚠️ Important Notice</h4>
              <p>
                This AI assistant provides supportive listening and coping strategies 
                but is <strong>NOT a replacement for professional mental healthcare</strong>. 
                If you're experiencing a crisis, please contact emergency services or 
                a licensed professional immediately.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mh-footer">
        <p>🔒 Your conversations are private and encrypted</p>
        <p className="footer-note">
          AI responses powered by OpenRouter • Crisis resources from official hotlines
        </p>
      </div>
    </div>
  );
};

export default MentalHealthSupport;