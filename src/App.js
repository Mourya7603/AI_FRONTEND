// src/App.js (updated)
import React, { useState } from "react";
import { 
  FaGraduationCap, 
  FaUserTie, 
  FaFilm, 
  FaBars, 
  FaTimes,
  FaCode,
  FaHeart,
} from "react-icons/fa";
import InterviewCoach from "./components/InterviewCoach";
import HRAssistant from "./components/HRAssistant";
import MoviePlanner from "./components/MoviePlanner";
import SkillsPractice from "./components/SkillsPractice";
import AIAssistant from "./components/AIAssistant";
import MentalHealthSupport from "./components/MentalHealthSupport";
import { FaComments } from "react-icons/fa";
import "./App.css";

function App() {
  const [activeTab, setActiveTab] = useState("interview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const tabs = [
    {
      id: "interview",
      label: "Interview Coach",
      icon: <FaGraduationCap className="tab-icon" />,
      component: <InterviewCoach />
    },
    {
      id: "chat",
      label: "AI Chat",
      icon: <FaComments className="tab-icon" />,
      component: <AIAssistant />
    },
    { 
      id: "skills", 
      label: "Skills Practice", 
      icon: <FaCode className="tab-icon" />,
      component: <SkillsPractice /> 
    },
    { 
      id: "hr", 
      label: "HR Assistant", 
      icon: <FaUserTie className="tab-icon" />,
      component: <HRAssistant /> 
    },
    {
    id: "mental-health",
    label: "Mental Health",
    icon: <FaHeart className="tab-icon" />,
    component: <MentalHealthSupport />
   },
    { 
      id: "movies", 
      label: "Movie Planner", 
      icon: <FaFilm className="tab-icon" />,
      component: <MoviePlanner /> 
    }
  ];

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="header-main">
            <h1>🎯 AI Calling Platform</h1>
            <button 
              className="mobile-menu-toggle"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
          <p>
            Your intelligent assistant for interviews, HR queries, and entertainment
          </p>
        </div>

        {/* Desktop Navigation */}
        <nav className={`tab-nav ${mobileMenuOpen ? "mobile-open" : ""}`}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => handleTabClick(tab.id)}
            >
              {tab.icon}
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </nav>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div className="mobile-overlay" onClick={() => setMobileMenuOpen(false)} />
        )}
      </header>

      <main className="app-main">
        {tabs.find((tab) => tab.id === activeTab)?.component}
      </main>

      <footer className="app-footer">
        <p>Powered by AI • Built with React & Node.js</p>
      </footer>
    </div>
  );
}

export default App;