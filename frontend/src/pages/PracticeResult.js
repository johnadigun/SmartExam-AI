
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PracticeResult.css";

function PracticeResult() {

  const navigate = useNavigate();
  const [result, setResult] = useState(null);

  /* ==========================================================
     LOAD RESULT
  ========================================================== */

  useEffect(() => {

    const saved =
      localStorage.getItem("practice_result");

    if (!saved) {
      navigate("/practice-mode");
      return;
    }

    try {

      setResult(JSON.parse(saved));

    } catch (err) {

      console.log(
        "Practice result loading error:",
        err
      );

      navigate("/practice-mode");

    }

  }, [navigate]);

  /* ==========================================================
     LOADING
  ========================================================== */

  if (!result) {

    return (

      <div className="practice-result-loading">

        <div className="practice-result-loading-card">

          <h2>
            Loading Practice Result...
          </h2>

        </div>

      </div>

    );

  }

  /* ==========================================================
     RESULT DATA
  ========================================================== */

  const {
    totalQuestions,
    answeredQuestions,
    score,
    percentage,
    grade,
  } = result;

  const wrongAnswers =
    answeredQuestions - score;

  const unansweredQuestions =
    totalQuestions - answeredQuestions;

  /* ==========================================================
     PERFORMANCE REMARK
  ========================================================== */

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

  /* ==========================================================
     PRACTICE AGAIN
  ========================================================== */

  const practiceAgain = () => {

    localStorage.removeItem(
      "practice_result"
    );

    localStorage.removeItem(
      "PRACTICE_PROGRESS"
    );

    navigate("/practice-mode");

  };

  /* ==========================================================
     REVIEW ANSWERS
  ========================================================== */

  const reviewAnswers = () => {

    navigate("/review-answers");

  };

  /* ==========================================================
     RETURN TO DASHBOARD
  ========================================================== */

  const dashboard = () => {

    localStorage.removeItem(
      "practice_result"
    );

    localStorage.removeItem(
      "PRACTICE_PROGRESS"
    );

    navigate("/dashboard");

  };

  /* ==========================================================
     RENDER
  ========================================================== */

  return (

    <div className="practice-result-container">

      <div className="practice-result-card">

        <div className="practice-result-header">

          <h1>
            SMARTEXAM PRACTICE RESULT
          </h1>

          <p>
            {remark}
          </p>

        </div>

        <div className="result-score">

          <strong>
            {percentage}%
          </strong>

          <span>
            Final Score
          </span>

        </div>

        <div className="result-summary">

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
            className="dashboard-btn"
            onClick={dashboard}
          >
            Return to Dashboard
          </button>

        </div>

      </div>

    </div>

  );

}

export default PracticeResult;