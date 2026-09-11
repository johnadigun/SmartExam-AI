
import React from "react";
import "./CBTCategories.css";

function CBTCategoriesUI({
  loading,
  categories,
  selectCategory,
  backToDashboard,
}) {
  /* ==========================================
     LOADING
  ========================================== */

  if (loading) {
    return (
      <div className="categories-loading">
        <h2>Loading Categories...</h2>
      </div>
    );
  }

  /* ==========================================
     PAGE
  ========================================== */

  return (
    <div className="categories-container">

      {/* ================= HEADER ================= */}

      <div className="categories-header">

        <h1>
          SMARTEXAM CBT SYSTEM
        </h1>

        <p>
          Choose your examination category to continue.
        </p>

      </div>


      {/* ================= CATEGORY GRID ================= */}

      <div className="categories-grid">

        {categories.map((category) => (

          <button
            key={category.id}
            className="category-card"
            onClick={() => selectCategory(category)}
            type="button"
          >

            {/* CATEGORY ICON */}

            <div className="category-icon">
              {category.icon}
            </div>


            {/* CATEGORY NAME */}

            <h2>
              {category.name}
            </h2>


            {/* SUBJECTS */}

            <p className="category-subjects">
              {category.description}
            </p>


            {/* ACTION */}

            <span className="category-action">
              Click to Continue →
            </span>

          </button>

        ))}

      </div>


      {/* ================= FOOTER ================= */}

      <div className="categories-footer">

        <button
          className="back-btn"
          onClick={backToDashboard}
          type="button"
        >
          ← Back to Dashboard
        </button>

      </div>

    </div>
  );
}

export default CBTCategoriesUI;