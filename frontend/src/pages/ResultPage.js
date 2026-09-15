
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
     PRINT CERTIFICATE
  ====================================================== */

  const printCertificate = () => {
    if (!result) return;

    const win = window.open("", "_blank");

    if (!win) {
      alert("Please allow pop-ups to print the certificate.");
      return;
    }

    win.document.write(`
      <html>
        <head>
          <title>SMARTEXAM Certificate</title>

          <style>
            body {
              font-family: Arial, Helvetica, sans-serif;
              text-align: center;
              padding: 60px;
              color: #222222;
            }

            h1 {
              color: #222222;
              margin-bottom: 10px;
            }

            h2 {
              margin-top: 20px;
            }

            hr {
              margin: 30px 0;
              border: 0;
              border-top: 1px solid #cccccc;
            }

            .passed {
              color: #198754;
              font-weight: bold;
            }
          </style>
        </head>

        <body>

          <h1>SMARTEXAM</h1>

          <h2>Certificate of Achievement</h2>

          <hr>

          <h2>${result.exam?.title || "CBT Examination"}</h2>

          <h3>
            Candidate:
            ${result.candidate?.fullName || "Student"}
          </h3>

          <h3>
            Score:
            ${result.score}/${result.total}
          </h3>

          <h3>
            Percentage:
            ${result.percentage}%
          </h3>

          <h3>
            Grade:
            ${result.grade || "-"}
          </h3>

          <h3 class="passed">
            Status:
            ${result.percentage >= 50 ? "PASSED" : "FAILED"}
          </h3>

          <h3>
            Certificate No:
            ${result.certificateNumber || "-"}
          </h3>

        </body>
      </html>
    `);

    win.document.close();
    win.focus();
    win.print();
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

  const passed = result.percentage >= 50;

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
            <h1>SMARTEXAM CBT RESULT</h1>

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

            <h2>Candidate Information</h2>

          </div>

          <div className="candidate-details">

            <div className="candidate-row">
              <span className="label">Candidate</span>

              <span className="value">
                {result.candidate?.fullName || "Student"}
              </span>
            </div>

            <div className="candidate-row">
              <span className="label">Examination</span>

              <span className="value">
                {result.exam?.title || "N/A"}
              </span>
            </div>

            <div className="candidate-row">
              <span className="label">Subject</span>

              <span className="value">
                {result.subject ||
                  result.exam?.subject ||
                  "N/A"}
              </span>
            </div>

            <div className="candidate-row">
              <span className="label">Category</span>

              <span className="value">
                {result.category || "General"}
              </span>
            </div>

            <div className="candidate-row">
              <span className="label">Total Questions</span>

              <span className="value">
                {result.total}
              </span>
            </div>

            <div className="candidate-row">
              <span className="label">Completed</span>

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
          <span>Score</span>

          <strong>
            {result.score} / {result.total}
          </strong>
        </div>

        <div className="stat-card">
          <span>Percentage</span>

          <strong>
            {result.percentage}%
          </strong>
        </div>

        <div className="stat-card">
          <span>Grade</span>

          <strong>
            {result.grade || "-"}
          </strong>
        </div>

        <div className="stat-card">
          <span>Status</span>

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
          className="action-btn certificate-btn"
          onClick={printCertificate}
        >
          Print Certificate
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

          <h2>Question Review</h2>

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

