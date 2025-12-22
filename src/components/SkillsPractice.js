// src/components/SkillsPractice.js
import React, { useState } from "react";
import { 
  FaCode, 
  FaDatabase, 
  FaCloud, 
  FaMobile, 
  FaShieldAlt,
  FaCheckCircle,
  FaClock,
  FaSpinner
} from "react-icons/fa";
import './SkillsPractice.css';

const SkillsPractice = () => {
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [practiceSession, setPracticeSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);

  const skillCategories = [
    {
      id: "frontend",
      name: "Frontend Development",
      icon: <FaCode />,
      skills: ["React", "Vue", "Angular", "JavaScript", "TypeScript", "CSS"],
      color: "#667eea"
    },
    {
      id: "backend",
      name: "Backend Development",
      icon: <FaDatabase />,
      skills: ["Node.js", "Python", "Java", "SQL", "API Design", "Microservices"],
      color: "#10b981"
    },
    {
      id: "cloud",
      name: "Cloud & DevOps",
      icon: <FaCloud />,
      skills: ["AWS", "Docker", "Kubernetes", "CI/CD", "Terraform", "Monitoring"],
      color: "#f59e0b"
    },
    {
      id: "mobile",
      name: "Mobile Development",
      icon: <FaMobile />,
      skills: ["React Native", "Flutter", "iOS", "Android", "Mobile UI/UX"],
      color: "#ef4444"
    },
    {
      id: "security",
      name: "Cybersecurity",
      icon: <FaShieldAlt />,
      skills: ["OWASP", "Encryption", "Network Security", "Pen Testing"],
      color: "#8b5cf6"
    }
  ];

  const generateQuestions = async (skill) => {
    setLoading(true);
    try {
      const profile = {
        job_role: "Software Developer",
        years_experience: "2-5",
        technical_keywords: [skill, ...getRelatedSkills(skill)],
        company_type: "Tech Company",
        interview_round: "Technical",
        focus_area: skill
      };

      const response = await fetch("https://ai-backend-orpin-three.vercel.app/api/interview/question", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profile),
      });

      if (!response.ok) {
        throw new Error('Failed to generate questions');
      }

      const data = await response.json();
      
      setPracticeSession({
        skill: skill,
        questions: data.questions || getFallbackQuestions(skill),
        currentQuestionIndex: 0,
        feedbackRubric: data.feedback_rubric
      });
    } catch (error) {
      console.error("Error generating questions:", error);
      // Fallback to mock questions if AI fails
      setPracticeSession({
        skill: skill,
        questions: getFallbackQuestions(skill),
        currentQuestionIndex: 0,
        feedbackRubric: getFallbackRubric()
      });
    } finally {
      setLoading(false);
    }
  };

  const getRelatedSkills = (skill) => {
    const relatedSkills = {
      "React": ["JavaScript", "TypeScript", "CSS", "HTML"],
      "Vue": ["JavaScript", "TypeScript", "CSS", "HTML"],
      "Angular": ["TypeScript", "JavaScript", "CSS", "HTML"],
      "JavaScript": ["ES6", "TypeScript", "DOM", "Async"],
      "TypeScript": ["JavaScript", "Interfaces", "Types"],
      "CSS": ["HTML", "Responsive Design", "CSS3"],
      "Node.js": ["JavaScript", "Express", "API", "Backend"],
      "Python": ["Django", "Flask", "Backend", "API"],
      "Java": ["Spring", "OOP", "Backend"],
      "SQL": ["Database", "Queries", "Relations"],
      "API Design": ["REST", "GraphQL", "Endpoints"],
      "Microservices": ["Architecture", "Docker", "Kubernetes"],
      "AWS": ["Cloud", "EC2", "S3", "Lambda"],
      "Docker": ["Containers", "DevOps", "Deployment"],
      "Kubernetes": ["Orchestration", "Containers", "DevOps"],
      "CI/CD": ["Automation", "Testing", "Deployment"],
      "Terraform": ["Infrastructure", "IaC", "Cloud"],
      "Monitoring": ["Observability", "Logging", "Metrics"],
      "React Native": ["JavaScript", "Mobile", "iOS", "Android"],
      "Flutter": ["Dart", "Mobile", "UI"],
      "iOS": ["Swift", "Mobile", "Apple"],
      "Android": ["Kotlin", "Mobile", "Java"],
      "Mobile UI/UX": ["Design", "User Experience", "Responsive"],
      "OWASP": ["Security", "Web", "Vulnerabilities"],
      "Encryption": ["Security", "Cryptography", "Data Protection"],
      "Network Security": ["Firewalls", "VPN", "Security"],
      "Pen Testing": ["Security", "Testing", "Vulnerabilities"]
    };
    
    return relatedSkills[skill] || ["Programming", "Development", "Best Practices"];
  };

  const getFallbackQuestions = (skill) => [
    {
      id: "1",
      question: `Explain the key concepts of ${skill} and its main advantages in modern development.`,
      hint: "Focus on core principles, architecture, and real-world benefits",
      time_limit_minutes: 5,
      difficulty: "medium",
      category: "Technical",
      expected_keywords: getRelatedSkills(skill).slice(0, 4)
    },
    {
      id: "2",
      question: `Describe a real-world scenario where you would use ${skill} and explain your implementation approach.`,
      hint: "Think about scalability, performance, and maintainability",
      time_limit_minutes: 7,
      difficulty: "medium",
      category: "Scenario",
      expected_keywords: getRelatedSkills(skill).slice(0, 4)
    },
    {
      id: "3",
      question: `What are the common challenges or best practices when working with ${skill} in a production environment?`,
      hint: "Consider debugging, optimization, and team collaboration aspects",
      time_limit_minutes: 6,
      difficulty: "hard",
      category: "Best Practices",
      expected_keywords: getRelatedSkills(skill).slice(0, 4)
    }
  ];

  const getFallbackRubric = () => ({
    excellent: "Comprehensive answer covering all key concepts with practical examples",
    good: "Good understanding with some examples but missing depth in certain areas",
    needs_improvement: "Basic understanding but lacks depth, examples, or clarity"
  });

  const submitAnswer = async () => {
    if (!userAnswer.trim()) return;

    setLoading(true);
    try {
      const currentQuestion = practiceSession.questions[practiceSession.currentQuestionIndex];
      
      const response = await fetch("https://ai-backend-orpin-three.vercel.app/api/interview/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: currentQuestion,
          userAnswer: userAnswer,
          profile: {
            job_role: "Software Developer",
            years_experience: "2-5",
            technical_keywords: [practiceSession.skill, ...getRelatedSkills(practiceSession.skill)]
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get feedback');
      }

      const feedbackData = await response.json();
      setFeedback(feedbackData);
      
    } catch (error) {
      console.error("Error getting feedback:", error);
      // Fallback feedback
      setFeedback({
        assessment: "Thanks for your answer! While we couldn't generate AI feedback at the moment, remember to focus on clear explanations with practical examples.",
        strengths: ["Completed the answer", "Engaged with the question"],
        improvement_suggestion: "Try to include more specific examples and cover the key concepts mentioned in the question.",
        score: 7,
        keyword_match: 70
      });
    } finally {
      setLoading(false);
    }
  };

  const nextQuestion = () => {
    if (practiceSession.currentQuestionIndex < practiceSession.questions.length - 1) {
      setPracticeSession(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1
      }));
      setUserAnswer("");
      setFeedback(null);
    } else {
      // Session completed
      setPracticeSession(null);
      setUserAnswer("");
      setFeedback(null);
    }
  };

  const skipQuestion = () => {
    if (practiceSession.currentQuestionIndex < practiceSession.questions.length - 1) {
      setPracticeSession(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1
      }));
      setUserAnswer("");
      setFeedback(null);
    }
  };

  const getCurrentQuestion = () => {
    return practiceSession?.questions[practiceSession.currentQuestionIndex];
  };

  return (
    <div className="skills-practice">
      <div className="skills-header">
        <h1>🛠️ Skills Practice</h1>
        <p>Practice specific technical skills with AI-generated interview questions</p>
      </div>

      {loading && (
        <div className="loading-overlay">
          <div className="loading-content">
            <FaSpinner className="spinner" />
            <p>Generating AI-powered questions...</p>
          </div>
        </div>
      )}

      {!practiceSession ? (
        <>
          {/* Skill Categories */}
          <div className="skill-categories">
            <h2>Choose a Skill Category</h2>
            <div className="categories-grid">
              {skillCategories.map((category) => (
                <div 
                  key={category.id}
                  className="category-card"
                  onClick={() => setSelectedSkill(category.id)}
                >
                  <div 
                    className="category-icon"
                    style={{ background: category.color }}
                  >
                    {category.icon}
                  </div>
                  <h3>{category.name}</h3>
                  <div className="skills-list">
                    {category.skills.map((skill, index) => (
                      <span key={index} className="skill-tag">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Specific Skills */}
          {selectedSkill && (
            <div className="specific-skills">
              <h2>
                {skillCategories.find(cat => cat.id === selectedSkill)?.name} Skills
              </h2>
              <div className="skills-grid">
                {skillCategories
                  .find(cat => cat.id === selectedSkill)
                  ?.skills.map((skill, index) => (
                    <div 
                      key={index}
                      className="skill-card"
                      onClick={() => generateQuestions(skill)}
                    >
                      <h4>{skill}</h4>
                      <p>Practice AI-generated interview questions for {skill}</p>
                      <button className="practice-button">
                        Start AI Practice
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </>
      ) : (
        /* Practice Session */
        <div className="practice-session">
          <div className="session-header">
            <h2>Practicing: {practiceSession.skill}</h2>
            <button 
              className="end-session-btn"
              onClick={() => {
                setPracticeSession(null);
                setFeedback(null);
                setUserAnswer("");
              }}
            >
              End Session
            </button>
          </div>

          <div className="progress-indicator">
            Question {practiceSession.currentQuestionIndex + 1} of{' '}
            {practiceSession.questions.length}
          </div>

          {!feedback ? (
            <div className="question-card">
              <div className="question-meta">
                <span className="question-type">
                  {getCurrentQuestion()?.category} • {getCurrentQuestion()?.difficulty}
                </span>
                <span className="question-timer">
                  <FaClock /> {getCurrentQuestion()?.time_limit_minutes} min
                </span>
              </div>

              <h3 className="question-text">
                {getCurrentQuestion()?.question}
              </h3>

              {getCurrentQuestion()?.hint && (
                <div className="question-hint">
                  <strong>💡 Hint:</strong> {getCurrentQuestion()?.hint}
                </div>
              )}

              <div className="expected-keywords">
                <strong>Key concepts to cover:</strong>
                <div className="keywords-list">
                  {getCurrentQuestion()?.expected_keywords.map((keyword, idx) => (
                    <span key={idx} className="keyword-tag">{keyword}</span>
                  ))}
                </div>
              </div>

              <div className="answer-section">
                <textarea
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Type your answer here... Focus on clear explanations and examples."
                  rows={8}
                  disabled={loading}
                />
                
                <div className="session-actions">
                  <button 
                    className="skip-btn"
                    onClick={skipQuestion}
                    disabled={loading}
                  >
                    Skip Question
                  </button>
                  <button 
                    className="submit-btn"
                    onClick={submitAnswer}
                    disabled={!userAnswer.trim() || loading}
                  >
                    {loading ? <FaSpinner className="spinner" /> : <FaCheckCircle />}
                    {loading ? "Getting AI Feedback..." : "Submit Answer"}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Feedback Section */
            <div className="feedback-section">
              <div className="feedback-header">
                <h3>AI Feedback</h3>
                <div className="score-display">
                  Score: <span className="score-value">{feedback.score}/10</span>
                  <div className="keyword-match">
                    Keyword Match: {feedback.keyword_match}%
                  </div>
                </div>
              </div>

              <div className="feedback-content">
                <div className="assessment">
                  <h4>Overall Assessment</h4>
                  <p>{feedback.assessment}</p>
                </div>

                <div className="strengths">
                  <h4>✅ Strengths</h4>
                  <ul>
                    {feedback.strengths.map((strength, idx) => (
                      <li key={idx}>{strength}</li>
                    ))}
                  </ul>
                </div>

                <div className="improvements">
                  <h4>📈 Areas for Improvement</h4>
                  <p>{feedback.improvement_suggestion}</p>
                </div>

                <div className="feedback-actions">
                  <button 
                    className="next-question-btn"
                    onClick={nextQuestion}
                  >
                    {practiceSession.currentQuestionIndex < practiceSession.questions.length - 1 
                      ? "Next Question" 
                      : "Complete Session"}
                  </button>
                </div>
              </div>
            </div>
          )}

         
        </div>
      )}
    </div>
  );
};

export default SkillsPractice;