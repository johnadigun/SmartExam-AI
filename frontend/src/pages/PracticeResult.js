
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PracticeResult.css";

function PracticeResult() {
  const navigate = useNavigate();
  const [result, setResult] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("practice_result");

    if (!saved) {
      navigate("/practice-categories");
      return;
    }

    try {
      setResult(JSON.parse(saved));
    } catch (err) {
      console.error("Unable to load practice result:", err);
      localStorage.removeItem("practice_result");
      navigate("/practice-categories");
    }
  }, [navigate]);

  if (!result) {
    return (
      <div className="practice-result-loading">
        <div className="practice-result-loading-card">
          <h2>Loading Practice Result...</h2>
        </div>
      </div>
    );
  }

  const {
    category = "Practice",
    totalQuestions = 0,
    answeredQuestions = 0,
    score = 0,
    percentage = 0,
    grade = "N/A",
  } = result;

  const wrongAnswers = Math.max(answeredQuestions - score, 0);
  const unansweredQuestions = Math.max(
    totalQuestions - answeredQuestions,
    0
  );

  let remark = "";

  if (percentage >= 70) {
    remark = "Excellent Performance";
  } else if (percentage >= 60) {
    remark = "Very Good Performance";
  } else if (percentage >= 50) {
    remark = "Good Performance";
  } else if (percentage >= 45) {
    remark = "Fair Performance";
  } else {
    remark = "Needs More Practice";
  }

  const practiceAgain = () => {
    localStorage.removeItem("practice_result");
    navigate("/practice-mode");
  };

  const chooseCategory = () => {
    localStorage.removeItem("practice_result");
    navigate("/practice-categories");
  };

  const reviewAnswers = () => {
    navigate("/review-answers");
  };

  const dashboard = () => {
    localStorage.removeItem("practice_result");
    navigate("/dashboard");
  };

  return (
    <div className="practice-result-container">
      <div className="practice-result-card">

        <div className="practice-result-header">
          <h1>SMARTEXAM PRACTICE RESULT</h1>
          <p>{remark}</p>
        </div>

        <div className="result-score">
          <strong>{percentage}%</strong>
          <span>Final Score</span>
        </div>

        <div className="result-summary">

          <div className="summary-row">
            <span>Category</span>
            <strong>{category}</strong>
          </div>

          <div className="summary-row">
            <span>Total Questions</span>
            <strong>{totalQuestions}</strong>
          </div>

          <div className="summary-row">
            <span>Answered</span>
            <strong>{answeredQuestions}</strong>
          </div>

          <div className="summary-row">
            <span>Correct Answers</span>
            <strong>{score}</strong>
          </div>

          <div className="summary-row">
            <span>Wrong Answers</span>
            <strong>{wrongAnswers}</strong>
          </div>

          <div className="summary-row">
            <span>Not Answered</span>
            <strong>{unansweredQuestions}</strong>
          </div>

          <div className="summary-row">
            <span>Percentage</span>
            <strong>{percentage}%</strong>
          </div>

          <div className="summary-row">
            <span>Grade</span>
            <strong>{grade}</strong>
          </div>

        </div>

        <div className="result-buttons">

          <button
            type="button"
            className="practice-btn"
            onClick={practiceAgain}
          >
            Practice Again
          </button>

          <button
            type="button"
            className="review-btn"
            onClick={reviewAnswers}
          >
            Review Answers
          </button>

          <button
            type="button"
            className="category-btn"
            onClick={chooseCategory}
          >
            Categories
          </button>

          <button
            type="button"
            className="dashboard-btn"
            onClick={dashboard}
          >
            Dashboard
          </button>

        </div>

      </div>
    </div>
  );
}

export default PracticeResult;

