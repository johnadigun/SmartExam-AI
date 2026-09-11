
import React from "react";
import { useNavigate } from "react-router-dom";
import "./PracticeSubjects.css";

function PracticeSubjects() {
  const navigate = useNavigate();

  const category =
    localStorage.getItem("practiceCategory") || "";

  /* ==========================================================
     SUBJECTS
  ========================================================== */

  const subjects = {
    Science: [
      "English",
      "Mathematics",
      "Physics",
      "Chemistry",
      "Biology",
      "Agricultural Science",
    ],

    Arts: [
      "English",
      "Literature",
      "Government",
      "CRS",
      "IRS",
      "History",
    ],

    Commercial: [
      "English",
      "Mathematics",
      "Economics",
      "Commerce",
      "Financial Accounting",
    ],

    "Social Science": [
      "English",
      "Mathematics",
      "Government",
      "Economics",
      "Geography",
    ],
  };

  const currentSubjects =
    subjects[category] || [];

  /* ==========================================================
     VALIDATION
  ========================================================== */

  if (!category) {
    return (
      <div className="practice-subject-container">
        <div className="practice-subject-card">

          <div className="practice-subject-error">
            <div className="error-icon">
              !
            </div>

            <h2>
              No Practice Category Selected
            </h2>

            <p>
              Please return to the practice categories
              and select a category first.
            </p>

            <button
              className="back-btn"
              onClick={() =>
                navigate("/practice-categories")
              }
            >
              ← Back to Categories
            </button>
          </div>

        </div>
      </div>
    );
  }

  /* ==========================================================
     CHOOSE SUBJECT
  ========================================================== */

  const chooseSubject = (subject) => {
    localStorage.setItem(
      "practiceSubject",
      subject
    );

    navigate("/practice-mode");
  };

  /* ==========================================================
     BACK
  ========================================================== */

  const goBack = () => {
    localStorage.removeItem("practiceSubject");

    navigate("/practice-categories");
  };

  return (
    <div className="practice-subject-container">

      <div className="practice-subject-card">

        {/* ====================================================
            HEADER
        ==================================================== */}

        <div className="practice-subject-header">

          <div className="practice-subject-brand">

            <div className="practice-subject-logo">
              SE
            </div>

            <div>
              <h1>
                SmartExam
              </h1>

              <span>
                CBT Practice Centre
              </span>
            </div>

          </div>

        </div>


        {/* ====================================================
            CATEGORY INDICATOR
        ==================================================== */}

        <div className="practice-subject-breadcrumb">

          <span>
            PRACTICE MODE
          </span>

          <strong>
            {category}
          </strong>

        </div>


        {/* ====================================================
            TITLE
        ==================================================== */}

        <div className="practice-subject-title">

          <span className="practice-subject-label">
            STEP 2 OF 3
          </span>

          <h2>
            Select Your Subject
          </h2>

          <p>
            Choose the subject you want to practise
            from the <strong>{category}</strong> category.
          </p>

        </div>


        {/* ====================================================
            SUBJECT GRID
        ==================================================== */}

        <div className="subject-grid">

          {currentSubjects.map((subject, index) => (

            <button
              key={subject}
              className="subject-btn"
              onClick={() => chooseSubject(subject)}
            >

              <span className="subject-number">
                {String(index + 1).padStart(2, "0")}
              </span>

              <span className="subject-content">

                <strong>
                  {subject}
                </strong>

                <small>
                  Practice {subject} questions
                </small>

              </span>

              <span className="subject-arrow">
                →
              </span>

            </button>

          ))}

        </div>


        {/* ====================================================
            INFORMATION
        ==================================================== */}

        <div className="practice-subject-info">

          <strong>
            Ready to practise?
          </strong>

          <p>
            Select a subject above to load the available
            practice questions.
          </p>

        </div>


        {/* ====================================================
            BACK BUTTON
        ==================================================== */}

        <button
          className="back-btn"
          onClick={goBack}
        >
          ← Back to Categories
        </button>

      </div>

    </div>
  );
}

export default PracticeSubjects;

