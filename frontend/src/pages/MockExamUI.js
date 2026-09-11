import React from "react";
import "./MockExamUI.css";

function MockExamUI({

    exam,
    subject,
    category,

    questions,

    loading,

    current,

    currentQuestion,

    totalQuestions,

    answeredQuestions,

    remainingQuestions,

    answers,

    timeLeft,

    formatTime,

    selectAnswer,

    previousQuestion,

    nextQuestion,

    jumpToQuestion,

    submitExam,

}) {

    /* ======================================================
       LOADING
    ====================================================== */

    if (loading) {

        return (

            <div className="exam-loading">

                <div className="loading-card">

                    <div className="loading-spinner"></div>

                    <h2>Loading Examination...</h2>

                    <p>Please wait while SMARTEXAM prepares your examination.</p>

                </div>

            </div>

        );

    }

    /* ======================================================
       NO EXAM
    ====================================================== */

    if (!exam || !current) {

        return (

            <div className="exam-loading">

                <div className="loading-card">

                    <h2>No Examination Available</h2>

                    <p>Unable to load this examination.</p>

                </div>

            </div>

        );

    }

    console.log("Answers:", answers);
    console.log("Questions:", questions);

    /* ======================================================
       MAIN PAGE
    ====================================================== */

    return (

        <div className="exam-container">

            {/* =====================================
                HEADER
            ===================================== */}

            <header className="exam-header">

                <div className="exam-title">

                    <h1>{exam.title}</h1>

                    <p>

                        Subject: <strong>{subject}</strong>

                        {" | "}

                        Category: <strong>{category}</strong>

                    </p>

                </div>

                <div className="timer-panel">

                    <span>Time Remaining</span>

                    <h2>{formatTime(timeLeft)}</h2>

                </div>

            </header>

            {/* =====================================
                DASHBOARD
            ===================================== */}

            <section className="exam-dashboard">

                <div className="dashboard-card">

                    <span>Current</span>

                    <h3>

                        {currentQuestion + 1}

                        {" / "}

                        {totalQuestions}

                    </h3>

                </div>

                <div className="dashboard-card">

                    <span>Answered</span>

                    <h3>{answeredQuestions}</h3>

                </div>

                <div className="dashboard-card">

                    <span>Remaining</span>

                    <h3>{remainingQuestions}</h3>

                </div>

            </section>

            {/* =====================================
                WORKSPACE
            ===================================== */}

            <div className="exam-workspace">
{/* =====================================
    QUESTION PANEL
===================================== */}

<main className="question-panel">

    {/* ==============================
        QUESTION
    ============================== */}

    <div className="question-card">

        <div className="question-number">

            Question {currentQuestion + 1} of {totalQuestions}

        </div>

        <div className="question-text">

            {current?.question}

        </div>

    </div>

    {/* ==============================
        OPTIONS
    ============================== */}

    <div className="options-container">

        {(current?.options || []).map((option, index) => (

            <label

                key={index}

                className={`option-card ${
                    answers[current?._id] === option
                        ? "selected"
                        : ""
                }`}

            >

                <input

                    type="radio"

                    name={`question-${currentQuestion}`}

                    checked={
                        answers[current?._id] === option
                    }

                    onChange={() =>
                        selectAnswer(option)
                    }

                />

                <span className="option-letter">

                    {String.fromCharCode(65 + index)}

                </span>

                <span className="option-text">

                    {option}

                </span>

            </label>

        ))}

    </div>

    {/* ==============================
        NAVIGATION
    ============================== */}

    <div className="navigation-buttons">

        <button

            type="button"

            className="previous-btn"

            onClick={previousQuestion}

            disabled={currentQuestion === 0}

        >

            ◀ Previous

        </button>

        <button

            type="button"

            className="next-btn"

            onClick={nextQuestion}

            disabled={
                currentQuestion === totalQuestions - 1
            }

        >

            Save & Next ▶

        </button>

        <button

            type="button"

            className="submit-btn"

            onClick={() => submitExam(false)}

        >

            Submit Examination

        </button>

    </div>

</main>
{/* =====================================
    QUESTION PALETTE
===================================== */}

<aside className="question-sidebar">

    <div className="palette-header">

        <h3>Question Palette</h3>

        <p>

            Click any question number to jump directly.

        </p>

    </div>

    <div className="palette-grid">

        {(questions || []).map((question, index) => {

            const answered =
                !!answers[question._id];

            let className =
                "palette-btn";

            if (answered)
                className += " answered";

            if (index === currentQuestion)
                className += " active";

            return (

                <button

                    key={question._id}

                    type="button"

                    className={className}

                    onClick={() =>
                        jumpToQuestion(index)
                    }

                    title={`Question ${index + 1}`}

                >

                    {index + 1}

                </button>

            );

        })}

    </div>

    <div className="palette-summary">

        <div className="summary-item">

            <span className="summary-color current"></span>

            <span>Current Question</span>

        </div>

        <div className="summary-item">

            <span className="summary-color answered"></span>

            <span>Answered</span>

        </div>

        <div className="summary-item">

            <span className="summary-color unanswered"></span>

            <span>Not Answered</span>

        </div>

    </div>

</aside>

</div>
{/* =====================================
    FOOTER
===================================== */}

<footer className="exam-footer">

    <div className="footer-left">

        <span>

            SMARTEXAM CBT Examination System

        </span>

    </div>

    <div className="footer-right">

        <span>

            Question {currentQuestion + 1}

            {" of "}

            {totalQuestions}

        </span>

    </div>

</footer>

</div>

);

}

export default MockExamUI;