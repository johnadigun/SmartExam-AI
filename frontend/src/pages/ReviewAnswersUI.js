
import React from "react";
import { useNavigate } from "react-router-dom";
import "./ReviewAnswers.css";

function ReviewAnswersUI({
  summary,
  questions,
  current,
  currentQuestion,
  totalQuestions,
  selectedAnswer,
  isCorrect,
  isWrongSelection,
  nextQuestion,
  previousQuestion,
  jumpToQuestion,
  printResult,
}) {
  const navigate = useNavigate();

  if (!questions || questions.length === 0) {
    return (
      <div className="review-empty">
        <div className="review-empty-card">
          <h2>No Questions Available</h2>

          <p>
            There are no questions available to review
            for this examination.
          </p>

          <button
            className="dashboard-btn"
            onClick={() => navigate("/dashboard")}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="review-page">

      {/* ==================================================
          MAIN HEADER
      ================================================== */}

      <header className="review-header">

        <div className="review-header-content">

          <h1>SMARTEXAM REVIEW ANSWERS</h1>

          <p>
            Review your answers, correct answers, and
            explanations below.
          </p>

        </div>

        {/* ==================================================
            RESULT SUMMARY
        ================================================== */}

        <div className="review-summary">

          <div className="review-summary-card">
            <span>Category</span>
            <strong>{summary.category || "N/A"}</strong>
          </div>

          <div className="review-summary-card">
            <span>Score</span>
            <strong>
              {summary.score}/{summary.total}
            </strong>
          </div>

          <div className="review-summary-card">
            <span>Percentage</span>
            <strong>
              {summary.percentage}%
            </strong>
          </div>

          <div className="review-summary-card">
            <span>Grade</span>
            <strong>
              {summary.grade || "N/A"}
            </strong>
          </div>

        </div>

      </header>


      {/* ==================================================
          WORKSPACE
      ================================================== */}

      <main className="review-layout">

        {/* ==================================================
            QUESTION AREA
        ================================================== */}

        <section className="review-main">

          {current && (

            <article className="review-question-card">

              {/* QUESTION NUMBER */}

              <div className="review-question-heading">

                <span className="review-question-label">
                  QUESTION
                </span>

                <strong>
                  {currentQuestion + 1}
                  {" "}
                  of
                  {" "}
                  {totalQuestions}
                </strong>

              </div>


              {/* QUESTION TEXT */}

              <div className="review-question">

                {current.question}

              </div>


              {/* OPTIONS */}

              <div className="review-options">

                {Array.isArray(current.options) &&
                  current.options.map((option, index) => {

                    let className =
                      "review-option";

                    const correct =
                      isCorrect(
                        currentQuestion,
                        option
                      );

                    const wrong =
                      isWrongSelection(
                        currentQuestion,
                        option
                      );

                    if (correct) {
                      className += " correct";
                    }

                    if (wrong) {
                      className += " wrong";
                    }

                    return (

                      <div
                        key={index}
                        className={className}
                      >

                        <span className="review-option-letter">
                          {String.fromCharCode(
                            65 + index
                          )}
                        </span>

                        <span className="review-option-text">
                          {option}
                        </span>

                        {correct && (
                          <span className="review-option-status">
                            Correct Answer
                          </span>
                        )}

                        {wrong && (
                          <span className="review-option-status">
                            Your Answer
                          </span>
                        )}

                      </div>

                    );

                  })}

              </div>


              {/* ==================================================
                  ANSWER SUMMARY
              ================================================== */}

              <div className="answer-summary">

                <div className="answer-summary-row">

                  <span>
                    Your Answer
                  </span>

                  <strong
                    className={
                      selectedAnswer(currentQuestion)
                        ? isCorrect(
                            currentQuestion,
                            selectedAnswer(
                              currentQuestion
                            )
                          )
                          ? "answer-correct"
                          : "answer-wrong"
                        : "answer-unanswered"
                    }
                  >
                    {selectedAnswer(
                      currentQuestion
                    ) || "Not Answered"}
                  </strong>

                </div>


                <div className="answer-summary-row">

                  <span>
                    Correct Answer
                  </span>

                  <strong className="answer-correct">
                    {current.answer}
                  </strong>

                </div>

              </div>


              {/* ==================================================
                  EXPLANATION
              ================================================== */}

              {current.explanation && (

                <div className="answer-explanation">

                  <h3>
                    Explanation
                  </h3>

                  <p>
                    {current.explanation}
                  </p>

                </div>

              )}

            </article>

          )}


          {/* ==================================================
              NAVIGATION
          ================================================== */}

          <div className="review-navigation">

            <button
              className="review-prev-btn"
              onClick={previousQuestion}
              disabled={currentQuestion === 0}
            >
              ← Previous
            </button>

            <button
              className="review-next-btn"
              onClick={nextQuestion}
              disabled={
                currentQuestion ===
                totalQuestions - 1
              }
            >
              Next →
            </button>

            <button
              className="print-btn"
              onClick={printResult}
            >
              🖨 Print
            </button>

            <button
              className="result-btn"
              onClick={() =>
                navigate("/practice-result")
              }
            >
              Back to Result
            </button>

            <button
              className="dashboard-btn"
              onClick={() =>
                navigate("/dashboard")
              }
            >
              Dashboard
            </button>

          </div>

        </section>


        {/* ==================================================
            QUESTION PALETTE
        ================================================== */}

        <aside className="review-sidebar">

          <div className="review-sidebar-header">

            <h3>
              Question Palette
            </h3>

            <p>
              Select a question to review
            </p>

          </div>


          <div className="palette-grid">

            {questions.map((question, index) => {

              const answer =
                selectedAnswer(index);

              let className =
                "palette-btn";

              if (
                answer &&
                answer === question.answer
              ) {
                className +=
                  " palette-correct";
              }
              else if (answer) {
                className +=
                  " palette-wrong";
              }
              else {
                className +=
                  " palette-unanswered";
              }

              if (
                index === currentQuestion
              ) {
                className +=
                  " palette-active";
              }

              return (

                <button
                  key={
                    question._id || index
                  }
                  className={className}
                  onClick={() =>
                    jumpToQuestion(index)
                  }
                  title={`Review Question ${
                    index + 1
                  }`}
                >
                  {index + 1}
                </button>

              );

            })}

          </div>


          {/* ==================================================
              LEGEND
          ================================================== */}

          <div className="palette-legend">

            <h4>
              Answer Status
            </h4>

            <div className="legend-item">

              <span className="legend-box active"></span>

              <span>
                Current
              </span>

            </div>

            <div className="legend-item">

              <span className="legend-box correct"></span>

              <span>
                Correct
              </span>

            </div>

            <div className="legend-item">

              <span className="legend-box wrong"></span>

              <span>
                Wrong
              </span>

            </div>

            <div className="legend-item">

              <span className="legend-box unanswered"></span>

              <span>
                Not Answered
              </span>

            </div>

          </div>

        </aside>

      </main>

    </div>
  );
}

export default ReviewAnswersUI;