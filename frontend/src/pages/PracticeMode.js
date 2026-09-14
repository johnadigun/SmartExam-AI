
import React from "react";
import { useNavigate } from "react-router-dom";
import PracticeEngine from "./PracticeEngine";
import "./PracticeMode.css";

function PracticeMode() {

  const navigate = useNavigate();

  /* ==========================================================
     RETURN TO PRACTICE CATEGORIES
  ========================================================== */

  const returnToCategories = () => {

    localStorage.removeItem("practice_result");
    localStorage.removeItem("PRACTICE_PROGRESS");

    navigate("/practice-categories");

  };

  /* ==========================================================
     PRACTICE MODE
  ========================================================== */

  return (

    <div className="practice-page-wrapper">

      {/* ======================================================
          PRACTICE MODE TOP BAR
      ====================================================== */}

      <div className="practice-topbar">

        <div className="practice-topbar-title">

          <h1>
            SmartExam Practice Mode
          </h1>

          <p>
            Practice, improve, and prepare with confidence.
          </p>

        </div>

        <button
          type="button"
          className="practice-return-btn"
          onClick={returnToCategories}
        >
          Back to Categories
        </button>

      </div>

      {/* ======================================================
          PRACTICE ENGINE
      ====================================================== */}

      <PracticeEngine
        onFinish={() => {
          window.location.href = "/practice-result";
        }}
      />

    </div>

  );

}

export default PracticeMode;