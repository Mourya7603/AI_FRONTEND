// src/components/InterviewCoach.js
import React, { useState } from "react";
import { 
  FaGraduationCap, 
  FaUserTie, 
  FaLightbulb, 
  FaClock,
  FaStar,
  FaPlus,
  FaTimes,
  FaCheckCircle,
  FaRocket,
  FaChartLine,
  FaAward
} from "react-icons/fa";
import './InterviewCoach.css';

const InterviewCoach = () => {
  const [profile, setProfile] = useState({
    job_role: "Frontend Developer",
    years_experience: 2,
    technical_keywords: ["React", "JavaScript", "CSS"],
    company_type: "startup",
    interview_round: "technical",
    focus_area: "",
  });

  const [currentSession, setCurrentSession] = useState(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [newKeyword, setNewKeyword] = useState("");

  const startInterview = async () => {
    setLoading(true);
    try {
      console.log("🔄 Starting interview request...");

      // Test basic connectivity first
      try {
        const testResponse = await fetch("https://ai-backend-orpin-three.vercel.app/health");
        console.log("✅ Backend health check:", testResponse.status);
      } catch (testError) {
        console.error("❌ Backend health check failed:", testError);
        throw new Error(`Cannot connect to backend: ${testError.message}`);
      }

      const response = await fetch(
        "https://ai-backend-orpin-three.vercel.app/api/interview/question",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(profile),
        }
      );

      console.log("📡 Interview API response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ API Error response:", errorText);
        throw new Error(`Server returned ${response.status}: ${errorText}`);
      }

      const questions = await response.json();
      console.log("✅ Interview questions received:", questions);

      setCurrentSession({
        questions: questions.questions,
        currentQuestionIndex: 0,
        feedbackRubric: questions.feedback_rubric,
        userAnswers: [],
      });
    } catch (error) {
      console.error("❌ Failed to start interview:", error);

      // Provide specific error messages
      if (
        error.message.includes("Failed to fetch") ||
        error.message.includes("NetworkError")
      ) {
        alert(
          "🌐 Network Connection Error:\n\n" +
            "Cannot connect to the backend server. Possible reasons:\n" +
            "• Backend not running on port 5000\n" +
            "• CORS blocking the request\n" +
            "• Running in browser sandbox (CodeSandbox)\n" +
            "• Firewall/network restrictions\n\n" +
            "Check the browser console for details."
        );
      } else {
        alert("Failed to start interview: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!userAnswer.trim() || !currentSession) return;

    setLoading(true);
    try {
      const currentQuestion =
        currentSession.questions[currentSession.currentQuestionIndex];

      const feedbackResponse = await fetch(
        "https://ai-backend-orpin-three.vercel.app/api/interview/feedback",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question: currentQuestion,
            userAnswer,
            profile,
          }),
        }
      );

      const feedback = await feedbackResponse.json();

      setCurrentSession((prev) => ({
        ...prev,
        userAnswers: [
          ...prev.userAnswers,
          {
            question: currentQuestion,
            answer: userAnswer,
            feedback,
          },
        ],
        currentQuestionIndex: prev.currentQuestionIndex + 1,
      }));

      setUserAnswer("");
    } catch (error) {
      console.error("Failed to submit answer:", error);
      alert("Failed to submit answer. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const addTechnicalKeyword = () => {
    if (
      newKeyword.trim() &&
      !profile.technical_keywords.includes(newKeyword.trim())
    ) {
      setProfile((prev) => ({
        ...prev,
        technical_keywords: [...prev.technical_keywords, newKeyword.trim()],
      }));
      setNewKeyword("");
    }
  };

  const removeTechnicalKeyword = (keywordToRemove) => {
    setProfile((prev) => ({
      ...prev,
      technical_keywords: prev.technical_keywords.filter(
        (kw) => kw !== keywordToRemove
      ),
    }));
  };

  const currentQuestion =
    currentSession?.questions?.[currentSession.currentQuestionIndex];

  return (
    <div className="interview-coach">
      {/* Profile Setup */}
      <div className="profile-section">
        <div className="section-header">
          <FaUserTie className="section-icon" />
          <h2>Candidate Profile</h2>
        </div>
        <div className="profile-form">
          <div className="form-row">
            <div className="form-group">
              <label>
                <FaGraduationCap className="input-icon" />
                Job Role
              </label>
              <input
                value={profile.job_role}
                onChange={(e) =>
                  setProfile((prev) => ({ ...prev, job_role: e.target.value }))
                }
                placeholder="e.g., Frontend Developer"
              />
            </div>

            <div className="form-group">
              <label>
                <FaChartLine className="input-icon" />
                Years of Experience
              </label>
              <input
                type="number"
                value={profile.years_experience}
                onChange={(e) =>
                  setProfile((prev) => ({
                    ...prev,
                    years_experience: parseInt(e.target.value) || 0,
                  }))
                }
                min="0"
                max="50"
              />
            </div>
          </div>

          <div className="form-group">
            <label>
              <FaAward className="input-icon" />
              Technical Skills
            </label>
            <div className="keywords-input">
              <div className="input-with-button">
                <input
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  placeholder="Add a skill and press Enter"
                  onKeyPress={(e) => e.key === "Enter" && addTechnicalKeyword()}
                />
                <button onClick={addTechnicalKeyword} className="add-button">
                  <FaPlus className="button-icon" />
                  Add
                </button>
              </div>
              <div className="keywords-list">
                {profile.technical_keywords.map((keyword, index) => (
                  <span key={index} className="keyword-tag">
                    {keyword}
                    <button onClick={() => removeTechnicalKeyword(keyword)}>
                      <FaTimes />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Company Type</label>
              <select
                value={profile.company_type}
                onChange={(e) =>
                  setProfile((prev) => ({
                    ...prev,
                    company_type: e.target.value,
                  }))
                }
              >
                <option value="startup">Startup</option>
                <option value="big_tech">Big Tech</option>
                <option value="mnc">MNC</option>
                <option value="consulting">Consulting</option>
              </select>
            </div>

            <div className="form-group">
              <label>Interview Round</label>
              <select
                value={profile.interview_round}
                onChange={(e) =>
                  setProfile((prev) => ({
                    ...prev,
                    interview_round: e.target.value,
                  }))
                }
              >
                <option value="technical">Technical</option>
                <option value="behavioral">Behavioral</option>
                <option value="system_design">System Design</option>
                <option value="hr">HR</option>
              </select>
            </div>
          </div>

          <button
            onClick={startInterview}
            disabled={loading}
            className="primary-button"
          >
            {loading ? (
              <>
                <div className="loading-spinner"></div>
                Starting Interview...
              </>
            ) : (
              <>
                <FaRocket className="button-icon" />
                Start Interview Session
              </>
            )}
          </button>
        </div>
      </div>

      {/* Current Question */}
      {currentQuestion && (
        <div className="question-section">
          <div className="section-header">
            <FaGraduationCap className="section-icon" />
            <h3>
              Question {currentSession.currentQuestionIndex + 1} of{" "}
              {currentSession.questions.length}
            </h3>
          </div>
          
          <div className="question-meta">
            <span className="timer">
              <FaClock className="meta-icon" />
              {currentQuestion.time_limit_minutes} min
            </span>
            <span
              className={`difficulty-badge ${currentQuestion.difficulty}`}
            >
              <FaStar className="meta-icon" />
              {currentQuestion.difficulty}
            </span>
            <span className="category">
              {currentQuestion.category}
            </span>
          </div>

          <div className="question-card">
            <p className="question-text">{currentQuestion.question}</p>

            {currentQuestion.hint && (
              <div className="hint-box">
                <FaLightbulb className="hint-icon" />
                <div>
                  <strong>Hint</strong>
                  <p>{currentQuestion.hint}</p>
                </div>
              </div>
            )}

            {currentQuestion.expected_keywords && (
              <div className="keywords-box">
                <strong>Expected Topics</strong>
                <div className="expected-keywords">
                  {currentQuestion.expected_keywords.map((keyword, idx) => (
                    <span key={idx} className="expected-keyword">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="answer-section">
              <label>Your Answer</label>
              <textarea
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Type your detailed answer here... Try to cover the expected topics mentioned above."
                rows={6}
                disabled={loading}
              />

              <button
                onClick={submitAnswer}
                disabled={!userAnswer.trim() || loading}
                className="submit-button"
              >
                {loading ? (
                  <>
                    <div className="loading-spinner"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <FaCheckCircle className="button-icon" />
                    Submit Answer
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Previous Feedback */}
      {currentSession?.userAnswers?.map((item, index) => (
        <div key={index} className="feedback-section">
          <div className="section-header">
            <FaStar className="section-icon" />
            <h4>Question {index + 1} Feedback</h4>
          </div>
          
          <div className="question-preview">
            "{item.question.question}"
          </div>

          <div className="feedback-card">
            <div className="feedback-item">
              <strong>Your Answer</strong>
              <p className="user-answer">{item.answer}</p>
            </div>

            <div className="feedback-grid">
              <div className="feedback-score">
                <FaStar className="score-icon" />
                <div>
                  <strong>Score</strong>
                  <span className="score-value">{item.feedback.score}/10</span>
                </div>
              </div>

              <div className="feedback-keywords">
                <FaCheckCircle className="keyword-icon" />
                <div>
                  <strong>Keyword Match</strong>
                  <span className="keyword-match">
                    {item.feedback.keyword_match}%
                  </span>
                </div>
              </div>
            </div>

            <div className="feedback-item">
              <strong>Assessment</strong>
              <p className="assessment">{item.feedback.assessment}</p>
            </div>

            <div className="feedback-item">
              <strong>Improvement Suggestion</strong>
              <p className="improvement">
                {item.feedback.improvement_suggestion}
              </p>
            </div>

            {item.feedback.strengths && item.feedback.strengths.length > 0 && (
              <div className="feedback-item">
                <strong>Strengths</strong>
                <ul className="strengths-list">
                  {item.feedback.strengths.map((strength, i) => (
                    <li key={i}>
                      <FaCheckCircle className="strength-icon" />
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Session Complete */}
      {currentSession &&
        currentSession.currentQuestionIndex >=
          currentSession.questions.length && (
          <div className="session-complete">
            <div className="completion-card">
              <FaAward className="completion-icon" />
              <h3>Interview Session Complete!</h3>
              <p>
                You've successfully answered all questions. Review your feedback
                above to improve your interview skills.
              </p>
              <button onClick={startInterview} className="primary-button">
                <FaRocket className="button-icon" />
                Start New Session
              </button>
            </div>
          </div>
        )}

      {/* No Session Started */}
      {!currentSession && (
        <div className="welcome-section">
          <div className="welcome-card">
            <FaGraduationCap className="welcome-icon" />
            <h3>Ready to Practice?</h3>
            <p>
              Set up your candidate profile above and start your mock interview
              session.
            </p>
            <div className="features-list">
              <div className="feature">
                <FaUserTie className="feature-icon" />
                <span>Personalized questions based on your profile</span>
              </div>
              <div className="feature">
                <FaStar className="feature-icon" />
                <span>Real-time feedback and suggestions</span>
              </div>
              <div className="feature">
                <FaClock className="feature-icon" />
                <span>Timed sessions to simulate real interviews</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewCoach;