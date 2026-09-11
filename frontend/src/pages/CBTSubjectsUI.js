
import React from "react";
import "./CBTSubjects.css";

function CBTSubjectsUI({
  loading,
  category,
  subjects,
  selectedReligion,
  setSelectedReligion,
  startExam,
  backToCategories,
}) {

  /* ==========================================
     LOADING
  ========================================== */

  if (loading) {
    return (
      <div className="subjects-loading">
        <h2>Loading Subjects...</h2>
        <p>
          Please wait while your examination subjects are prepared.
        </p>
      </div>
    );
  }

  /* ==========================================
     PAGE
  ========================================== */

  return (
    <div className="subjects-container">

      {/* ================= HEADER ================= */}

      <div className="subjects-header">

        <h1>
          SMARTEXAM CBT SYSTEM
        </h1>

        <p>
          Select a subject to begin your examination.
        </p>

      </div>


      {/* ================= CATEGORY ================= */}

      <div className="subjects-category-card">

        <h2>
          Selected Examination Category
        </h2>

        <span>
          {category}
        </span>

      </div>


      {/* ================= SUBJECT SECTION HEADER ================= */}

      <div className="subjects-section-header">

        <div>
          <h2>
            Available Subjects
          </h2>

          <p>
            Select the subject you want to write.
          </p>
        </div>

      </div>


      {/* ================= SUBJECT GRID ================= */}

      <div className="subjects-grid">

        {subjects.map((subject) => (

          <button
            key={subject}
            type="button"
            className="subject-card"
            onClick={() => startExam(subject)}
          >

            {/* SUBJECT ICON */}

            <div className="subject-icon">
              📘
            </div>

            {/* SUBJECT CONTENT */}

            <div className="subject-card-content">

              <h3>
                {subject}
              </h3>

              <p>
                Start Examination →
              </p>

            </div>

          </button>

        ))}


        {/* ================= RELIGIOUS SUBJECT ================= */}

        {category === "Arts" && (

          <div className="subject-card religion-subject-card">

            {/* RELIGION ICON */}

            <div className="subject-icon">
              📖
            </div>

            {/* RELIGION CONTENT */}

            <div className="subject-card-content">

              <h3>
                Religious Subject
              </h3>

              <p className="religion-instruction">
                Choose one
              </p>

              <div className="religion-options">

                <label className="radio-item">

                  <input
                    type="radio"
                    name="religion"
                    value="CRS"
                    checked={selectedReligion === "CRS"}
                    onChange={(e) =>
                      setSelectedReligion(e.target.value)
                    }
                  />

                  <span>
                    CRS
                  </span>

                </label>


                <label className="radio-item">

                  <input
                    type="radio"
                    name="religion"
                    value="IRS"
                    checked={selectedReligion === "IRS"}
                    onChange={(e) =>
                      setSelectedReligion(e.target.value)
                    }
                  />

                  <span>
                    IRS
                  </span>

                </label>

              </div>


              <button
                type="button"
                className="religion-start-btn"
                disabled={!selectedReligion}
                onClick={() => startExam(selectedReligion)}
              >
                Start Examination
              </button>

            </div>

          </div>

        )}

      </div>


      {/* ================= FOOTER ================= */}

      <div className="subjects-footer">

        <button
          type="button"
          className="back-btn"
          onClick={backToCategories}
        >
          ← Back to Categories
        </button>

      </div>

    </div>
  );
}

export default CBTSubjectsUI;