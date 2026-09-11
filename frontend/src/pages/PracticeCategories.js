
import React from "react";
import { useNavigate } from "react-router-dom";
import "./PracticeCategories.css";

function PracticeCategories() {
  const navigate = useNavigate();

  const categories = [
    {
      name: "Science",
      description: "Physics, Chemistry, Biology and related subjects",
      icon: "SC",
    },
    {
      name: "Arts",
      description: "Literature, Government, CRS, IRS and History",
      icon: "AR",
    },
    {
      name: "Commercial",
      description: "Economics, Commerce and Financial Accounting",
      icon: "CO",
    },
    {
      name: "Social Science",
      description: "Government, Economics, Geography and related subjects",
      icon: "SS",
    },
  ];

  /* ==========================================
     CHOOSE CATEGORY
  ========================================== */

  const chooseCategory = (category) => {
    localStorage.setItem("practiceCategory", category);

    // Always remove previous subject
    localStorage.removeItem("practiceSubject");

    // Continue to subject selection
    navigate("/practice-subjects");
  };

  /* ==========================================
     BACK TO DASHBOARD
  ========================================== */

  const backToDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <div className="practice-category-container">

      <div className="practice-category-card">

        {/* ======================================
            HEADER
        ====================================== */}

        <div className="practice-category-header">

          <div className="practice-category-brand">
            <div className="practice-category-logo">
              SE
            </div>

            <div>
              <h1>SmartExam</h1>
              <span>CBT Practice Centre</span>
            </div>
          </div>

        </div>


        {/* ======================================
            TITLE
        ====================================== */}

        <div className="practice-category-title">

          <span className="practice-category-label">
            PRACTICE MODE
          </span>

          <h2>
            Select Your Category
          </h2>

          <p>
            Choose an examination category to continue
            to subject selection.
          </p>

        </div>


        {/* ======================================
            CATEGORY GRID
        ====================================== */}

        <div className="category-grid">

          {categories.map((category) => (

            <button
              key={category.name}
              className="category-btn"
              onClick={() => chooseCategory(category.name)}
            >

              <span className="category-icon">
                {category.icon}
              </span>

              <span className="category-content">

                <strong>
                  {category.name}
                </strong>

                <small>
                  {category.description}
                </small>

              </span>

              <span className="category-arrow">
                →
              </span>

            </button>

          ))}

        </div>


        {/* ======================================
            INFORMATION
        ====================================== */}

        <div className="practice-category-info">

          <strong>
            How Practice Mode Works
          </strong>

          <p>
            Select a category, choose your preferred
            subject and begin your practice examination.
          </p>

        </div>


        {/* ======================================
            BACK BUTTON
        ====================================== */}

        <button
          className="back-btn"
          onClick={backToDashboard}
        >
          ← Back to Dashboard
        </button>

      </div>

    </div>
  );
}

export default PracticeCategories;

