// src/components/MoviePlanner.js
import React, { useState, useRef, useEffect } from "react";
import './MoviePlanner.css';

const MoviePlanner = () => {
  const [userQuery, setUserQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [executionSteps, setExecutionSteps] = useState([]);
  const [activeTab, setActiveTab] = useState("results");
  const textareaRef = useRef(null);
  const resultsEndRef = useRef(null);

  // Auto-scroll to bottom of results
  useEffect(() => {
    resultsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [results]);

  const executeMoviePlan = async () => {
    if (!userQuery.trim()) return;

    setLoading(true);
    setExecutionSteps([]);
    setActiveTab("steps");

    try {
      const response = await fetch("https://ai-backend-orpin-three.vercel.app/api/tools/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userQuery: userQuery.trim() }),
      });

      if (!response.ok) throw new Error('Network response was not ok');

      const result = await response.json();

      const newResult = {
        id: Date.now(),
        query: userQuery.trim(),
        result: result.final_result,
        steps: result.execution_steps,
        timestamp: new Date().toLocaleTimeString(),
        success: result.success
      };

      setResults((prev) => [newResult, ...prev]);
      setExecutionSteps(result.execution_steps || []);
      setUserQuery("");
      setActiveTab("results");
    } catch (error) {
      console.error("Failed to execute plan:", error);
      
      const errorResult = {
        id: Date.now(),
        query: userQuery.trim(),
        result: { message: "Failed to execute command. Please make sure the backend server is running on port 5000." },
        steps: [],
        timestamp: new Date().toLocaleTimeString(),
        success: false
      };
      
      setResults((prev) => [errorResult, ...prev]);
    } finally {
      setLoading(false);
    }
  };

  const sampleQueries = [
    "Find sci-fi movies and add Inception to watchlist",
    "Get movie recommendations for romance genre",
    "Search for Christopher Nolan movies",
    "Show me my watchlist",
    "What action movies are available?",
    "Find movies with Leonardo DiCaprio",
    "Add Interstellar to watchlist and show recommendations"
  ];

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      executeMoviePlan();
    }
  };

  const clearHistory = () => {
    setResults([]);
    setExecutionSteps([]);
  };

  const renderMovieCard = (movie) => (
    <div key={movie.id} className="movie-card">
      <div className="movie-header">
        <h5>{movie.title}</h5>
        <span className="movie-year">{movie.year}</span>
      </div>
      <div className="movie-details">
        <span className="genre-tag">{movie.genre}</span>
        <div className="rating">
          ⭐ {movie.rating}/10
        </div>
      </div>
    </div>
  );

  const renderStepResult = (result) => {
    if (!result) return null;

    return (
      <div className="step-result-content">
        {result.message && (
          <div className="result-message">
            {result.message}
          </div>
        )}
        
        {result.results && result.results.length > 0 && (
          <div className="search-results">
            <div className="results-count">
              Found {result.total} movies
            </div>
            <div className="movies-grid">
              {result.results.slice(0, 5).map(renderMovieCard)}
            </div>
          </div>
        )}
        
        {result.recommendations && result.recommendations.length > 0 && (
          <div className="recommendations">
            <div className="section-title">
              Recommendations
            </div>
            <div className="movies-grid">
              {result.recommendations.map(renderMovieCard)}
            </div>
          </div>
        )}
        
        {result.watchlist && (
          <div className="watchlist-result">
            <div className="section-title">
              Your Watchlist
            </div>
            <div className="movies-grid">
              {result.watchlist.map(renderMovieCard)}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="movie-planner">
      {/* Header */}
      <div className="planner-header">
        <div className="header-content">
          <div className="header-icon">🎬</div>
          <div>
            <h2>AI Movie Planner</h2>
            <p>Use natural language to search movies and manage watchlist</p>
          </div>
        </div>
        {results.length > 0 && (
          <div className="header-stats">
            <button className="clear-btn" onClick={clearHistory}>
              Clear History
            </button>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h4>Quick Commands</h4>
        <div className="action-chips">
          {sampleQueries.map((query, index) => (
            <button
              key={index}
              className="action-chip"
              onClick={() => setUserQuery(query)}
            >
              {query}
            </button>
          ))}
        </div>
      </div>

      {/* Input Section */}
      <div className="planner-input">
        <div className="input-container">
          <div className="textarea-wrapper">
            <textarea
              ref={textareaRef}
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="What would you like to do? (e.g., 'Find action movies and add one to watchlist')"
              rows="2"
              disabled={loading}
            />
          </div>
          <button
            onClick={executeMoviePlan}
            disabled={!userQuery.trim() || loading}
            className="execute-button"
          >
            {loading ? (
              <div className="button-loading">
                <div className="loading-spinner"></div>
                Processing...
              </div>
            ) : (
              <div className="button-ready">
                <span>🚀</span>
                Execute
              </div>
            )}
          </button>
        </div>
        <div className="input-hint">
          Press Enter to execute • Describe what you want in natural language
        </div>
      </div>

      {/* Tabs */}
      {results.length > 0 && (
        <div className="results-tabs">
          <button
            className={`tab ${activeTab === "results" ? "active" : ""}`}
            onClick={() => setActiveTab("results")}
          >
            📋 Results ({results.length})
          </button>
          <button
            className={`tab ${activeTab === "steps" ? "active" : ""}`}
            onClick={() => setActiveTab("steps")}
          >
            🔧 Execution Steps
          </button>
        </div>
      )}

      {/* Execution Steps */}
      {activeTab === "steps" && executionSteps.length > 0 && (
        <div className="execution-steps">
          {executionSteps.map((step, index) => (
            <div
              key={index}
              className={`step ${step.success ? "success" : "error"}`}
            >
              <div className="step-header">
                <div className="step-info">
                  <span className="step-number">Step {index + 1}</span>
                  <span className="step-purpose">{step.purpose}</span>
                </div>
                <span
                  className={`step-status ${step.success ? "success" : "error"}`}
                >
                  {step.success ? "✅ Success" : "❌ Failed"}
                </span>
              </div>
              
              <div className="step-details">
                {step.result && (
                  <div className="step-result">
                    {renderStepResult(step.result)}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Results History */}
      {activeTab === "results" && (
        <div className="results-history">
          {results.map((item) => (
            <div key={item.id} className={`result-card ${item.success === false ? 'error' : ''}`}>
              <div className="result-header">
                <div className="query-info">
                  <div className="query-text">"{item.query}"</div>
                  <span className="timestamp">{item.timestamp}</span>
                </div>
              </div>

              <div className="result-content">
                {typeof item.result === 'string' ? (
                  <div className="text-result">
                    {item.result}
                  </div>
                ) : (
                  renderStepResult(item.result)
                )}
              </div>
            </div>
          ))}
          <div ref={resultsEndRef} />
        </div>
      )}

      {/* Empty State */}
      {results.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🎭</div>
          <h4>Ready to Assist!</h4>
          <p>Use natural language to interact with movies</p>
          <div className="capabilities-grid">
            <div className="capability">
              <div className="capability-icon">🔍</div>
              <h5>Search Movies</h5>
              <p>Find by title, genre, director, or actor</p>
            </div>
            <div className="capability">
              <div className="capability-icon">⭐</div>
              <h5>Manage Watchlist</h5>
              <p>Add, remove, and view your favorite movies</p>
            </div>
            <div className="capability">
              <div className="capability-icon">💡</div>
              <h5>Get Recommendations</h5>
              <p>Discover new movies based on your interests</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MoviePlanner;