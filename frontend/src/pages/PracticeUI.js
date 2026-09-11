import React from "react";
import "./PracticeMode.css";

function PracticeUI({
  exam,
  category,
  loading,

  started,
  setStarted,

  current,
  questions,

  currentQuestion,

  totalQuestions,

  answeredQuestions,

  remainingQuestions,

  answers,

  submitted,

  nextQuestion,

  previousQuestion,

  jumpToQuestion,

  selectAnswer,

  submitPractice,

  restartPractice,

  isCorrect,

  isWrongSelection,
}) {

  /* ==========================================
     LOADING
  ========================================== */

  if (loading) {
    return (
      <div className="practice-loading">
        <h2>Loading Practice Questions...</h2>
      </div>
    );
  }

  /* ==========================================
     NO QUESTIONS
  ========================================== */

  if (!exam || !questions || questions.length === 0) {
    return (
      <div className="practice-loading">

        <h2>No Practice Questions Found</h2>

        <p>
          Please return and choose another category.
        </p>

      </div>
    );
  }

  /* ==========================================
     START SCREEN
  ========================================== */

  if (!started) {
    return (
      <div className="practice-start-container">

        <div className="practice-start-card">

          <h2>SMARTEXAM PRACTICE MODE</h2>

          <h3>{category}</h3>

          <div className="practice-summary">

            <div className="summary-box">
              <h2>{totalQuestions}</h2>
              <span>Questions</span>
            </div>

            <div className="summary-box">
              <h2>30</h2>
              <span>Minutes</span>
            </div>

            <div className="summary-box">
              <h2>MCQ</h2>
              <span>Question Type</span>
            </div>

          </div>

          <p>
            This practice examination contains questions
            selected from the
            <strong> {category}</strong> category.
          </p>

          <p>
            Answer every question carefully before
            submitting your practice.
          </p>

          <button
            className="start-practice-btn"
            onClick={() => setStarted(true)}
          >
            Start Practice
          </button>

        </div>

      </div>
    );
  }

  /* ==========================================
     MAIN PAGE
  ========================================== */

  return (

    <div className="practice-container">

      {/* ================= HEADER ================= */}

      <div className="practice-header">

        <h2>{category} Practice Examination</h2>

        <div className="practice-header-info">

          <span>
            Question {currentQuestion + 1} of {totalQuestions}
          </span>

          <span>
            Answered : {answeredQuestions}
          </span>

          <span>
            Remaining : {remainingQuestions}
          </span>

        </div>

      </div>

      {/* ================= PROGRESS ================= */}

      <div className="practice-progress">

        <div className="progress-card">
          <h3>{currentQuestion + 1}</h3>
          <span>Current</span>
        </div>

        <div className="progress-card">
          <h3>{answeredQuestions}</h3>
          <span>Answered</span>
        </div>

        <div className="progress-card">
          <h3>{remainingQuestions}</h3>
          <span>Remaining</span>
        </div>

      </div>

      {/* ================= MAIN WORKSPACE ================= */}

      <div className="practice-layout">
        {/* ================= QUESTION SECTION ================= */}

        <div className="question-section">

          {current && (

            <div className="practice-question-card">

              <div className="question-number">
                QUESTION {currentQuestion + 1}
              </div>

              <div className="practice-question">
                {current.question}
              </div>

              <div className="practice-options">

                {current.options.map((option, index) => {

                  let className = "practice-option";

                  if (submitted) {

                    if (isCorrect(currentQuestion, option)) {
                      className += " correct";
                    }
                    else if (
                      isWrongSelection(currentQuestion, option)
                    ) {
                      className += " wrong";
                    }

                  }

                  return (

                    <label
                      key={index}
                      className={className}
                    >

                      <input
                        type="radio"
                        name={`question-${currentQuestion}`}
                        checked={
                          answers[currentQuestion] === option
                        }
                        disabled={submitted}
                        onChange={() => selectAnswer(option)}
                      />

                      <span>{option}</span>

                    </label>

                  );

                })}

              </div>

            </div>

          )}

          {/* ================= NAVIGATION ================= */}

          <div className="practice-navigation">

            <button
              className="practice-btn"
              disabled={currentQuestion === 0}
              onClick={previousQuestion}
            >
              Previous
            </button>

            <button
              className="practice-btn"
              disabled={currentQuestion === totalQuestions - 1}
              onClick={nextQuestion}
            >
              Next
            </button>

            <button
              className="submit-practice-btn"
              disabled={submitted}
              onClick={submitPractice}
            >
              Submit Practice
            </button>

          </div>

        </div>

        {/* ================= RIGHT PALETTE ================= */}

        <aside className="practice-palette">

          <h3>Question Palette</h3>

          <div className="palette-grid">
            {questions.map((question, index) => {

              let className = "palette-btn";

              if (answers[index]) {
                className += " answered";
              }

              if (index === currentQuestion) {
                className += " active";
              }

              return (

                <button
                  key={question._id || index}
                  className={className}
                  onClick={() => jumpToQuestion(index)}
                >
                  {index + 1}
                </button>

              );

            })}

          </div>

          <div className="palette-legend">

            <div className="legend-item">

              <span className="legend-box current"></span>

              <span>Current</span>

            </div>

            <div className="legend-item">

              <span className="legend-box answered"></span>

              <span>Answered</span>

            </div>

            <div className="legend-item">

              <span className="legend-box unanswered"></span>

              <span>Unanswered</span>

            </div>

          </div>

        </aside>

      </div>

      {/* ================= RESULT PANEL ================= */}

      {submitted && (

        <div className="practice-result-panel">

          <h2>
            Practice Submitted Successfully
          </h2>

          <p>
            Your answers have been saved.
          </p>

          <div className="practice-result-actions">

            <button
              className="start-practice-btn"
              onClick={restartPractice}
            >
              Practice Again
            </button>

          </div>

        </div>

      )}
    </div>

  );

}

export default PracticeUI;