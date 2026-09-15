
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ResultPage.css";

function ResultPage() {
  const navigate = useNavigate();

  const [result, setResult] = useState(null);

  /* ======================================================
     LOAD RESULT
  ====================================================== */

  useEffect(() => {
    const savedResult = localStorage.getItem("cbt_result");

    if (!savedResult) {
      navigate("/dashboard");
      return;
    }

    try {
      const parsed = JSON.parse(savedResult);

      console.log("Saved Result:", parsed);

      setResult(parsed);
    } catch (error) {
      console.error("Unable to load saved result:", error);
      navigate("/dashboard");
    }
  }, [navigate]);

  /* ======================================================
     PRINT RESULT
  ====================================================== */

  const printResult = () => {
    window.print();
  };

  /* ======================================================
     REVIEW ANSWERS
  ====================================================== */

  const reviewAnswers = () => {
    if (!result) return;

    navigate("/review-answers", {
      state: {
        result,
      },
    });
  };

  /* ======================================================
     CERTIFICATE

     Certificate is available only when the candidate
     has achieved the minimum passing score of 50%.
  ====================================================== */

  const openCertificate = () => {
    if (!result) return;

    const passed = Number(result.percentage) >= 50;

    if (!passed) {
      alert(
        "Certificate is not available because the minimum passing score of 50% was not achieved."
      );
      return;
    }

    navigate("/certificate");
  };

  /* ======================================================
     LOADING
  ====================================================== */

  if (!result) {
    return (
      <div className="exam-loading">

        <div className="loading-card">

          <div className="loading-spinner"></div>

          <h2>Loading Result...</h2>

          <p>Please wait...</p>

        </div>

      </div>
    );
  }

  const passed =
    Number(result.percentage) >= 50;

  /* ======================================================
     MAIN PAGE
  ====================================================== */

  return (
    <div className="result-container">

      {/* ==================================================
          HEADER
      ================================================== */}

      <header className="result-header">

        <div className="result-header-title">

          <div>

            <h1>
              SMARTEXAM CBT RESULT
            </h1>

            <p>
              {result.exam?.title || "CBT Examination"}
            </p>

          </div>

          <button
            type="button"
            className="return-btn"
            onClick={() => navigate("/dashboard")}
          >
            Return to Dashboard
          </button>

        </div>

      </header>

      {/* ==================================================
          RESULT OVERVIEW
      ================================================== */}

      <section className="result-overview">

        {/* Candidate Information */}

        <div className="candidate-card">

          <div className="section-heading">

            <h2>
              Candidate Information
            </h2>

          </div>

          <div className="candidate-details">

            <div className="candidate-row">

              <span className="label">
                Candidate
              </span>

              <span className="value">
                {result.candidate?.fullName || "Student"}
              </span>

            </div>

            <div className="candidate-row">

              <span className="label">
                Examination
              </span>

              <span className="value">
                {result.exam?.title || "N/A"}
              </span>

            </div>

            <div className="candidate-row">

              <span className="label">
                Subject
              </span>

              <span className="value">
                {result.subject ||
                  result.exam?.subject ||
                  "N/A"}
              </span>

            </div>

            <div className="candidate-row">

              <span className="label">
                Category
              </span>

              <span className="value">
                {result.category || "General"}
              </span>

            </div>

            <div className="candidate-row">

              <span className="label">
                Total Questions
              </span>

              <span className="value">
                {result.total}
              </span>

            </div>

            <div className="candidate-row">

              <span className="label">
                Completed
              </span>

              <span className="value">

                {result.completedAt
                  ? new Date(
                      result.completedAt
                    ).toLocaleString()
                  : "-"}

              </span>

            </div>

          </div>

        </div>

        {/* Score */}

        <div className="score-card">

          <div className="score-circle">
            {result.percentage}%
          </div>

          <div className="score-label">
            Final Score
          </div>

          <h2>
            Grade {result.grade || "-"}
          </h2>

          <span
            className={
              passed
                ? "status-badge status-pass"
                : "status-badge status-fail"
            }
          >
            {passed ? "PASSED" : "FAILED"}
          </span>

        </div>

      </section>

      {/* ==================================================
          PERFORMANCE SUMMARY
      ================================================== */}

      <section className="statistics-grid">

        <div className="stat-card">

          <span>
            Score
          </span>

          <strong>
            {result.score} / {result.total}
          </strong>

        </div>

        <div className="stat-card">

          <span>
            Percentage
          </span>

          <strong>
            {result.percentage}%
          </strong>

        </div>

        <div className="stat-card">

          <span>
            Grade
          </span>

          <strong>
            {result.grade || "-"}
          </strong>

        </div>

        <div className="stat-card">

          <span>
            Status
          </span>

          <strong
            className={
              passed
                ? "stat-pass"
                : "stat-fail"
            }
          >
            {passed ? "PASS" : "FAIL"}
          </strong>

        </div>

      </section>

      {/* ==================================================
          ACTIONS
      ================================================== */}

      <section className="action-panel">

        <button
          type="button"
          className="action-btn print-btn"
          onClick={printResult}
        >
          Print Result
        </button>

        <button
          type="button"
          className={
            `action-btn certificate-btn ${
              !passed
                ? "certificate-disabled"
                : ""
            }`
          }
          onClick={openCertificate}
          disabled={!passed}
          title={
            passed
              ? "Open Certificate"
              : "Certificate requires a passing score of 50% or above"
          }
        >
          {passed
            ? "Print Certificate"
            : "Certificate Not Available"}
        </button>

        <button
          type="button"
          className="action-btn review-btn"
          onClick={reviewAnswers}
        >
          Review Answers
        </button>

        <button
          type="button"
          className="action-btn dashboard-btn"
          onClick={() => navigate("/dashboard")}
        >
          Return to Dashboard
        </button>

      </section>

      {/* ==================================================
          QUESTION REVIEW
      ================================================== */}

      <section className="review-section">

        <div className="review-header">

          <h2>
            Question Review
          </h2>

          <p>
            Review your answers and compare them with the
            correct answers.
          </p>

        </div>

        {(result.questions || []).map(
          (question, index) => {

            /*
              Normal CBT stores answers using
              the question ID.
            */

            const userAnswer =
              result.answers?.[question._id] ??
              result.answers?.[index] ??
              result.answers?.[String(index)];

            const correct =
              userAnswer === question.answer;

            return (
              <div
                key={question._id || index}
                className={
                  correct
                    ? "review-card correct"
                    : "review-card wrong"
                }
              >

                <div className="review-top">

                  <span className="review-number">
                    Question {index + 1}
                  </span>

                  <span
                    className={
                      correct
                        ? "review-status pass"
                        : "review-status fail"
                    }
                  >
                    {correct
                      ? "✓ Correct"
                      : "✗ Incorrect"}
                  </span>

                </div>

                <div className="review-question">

                  {question.question}

                </div>

                <div className="review-answer">

                  <strong>
                    Your Answer
                  </strong>

                  <span>
                    {userAnswer || "Not Answered"}
                  </span>

                </div>

                <div className="review-answer">

                  <strong>
                    Correct Answer
                  </strong>

                  <span>
                    {question.answer || "-"}
                  </span>

                </div>

              </div>
            );
          }
        )}

      </section>

    </div>
  );
}

export default ResultPage;
