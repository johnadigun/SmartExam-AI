import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PracticeEngine from "./PracticeEngine";
import "./PracticeMode.css";

function PracticeMode() {
 const navigate = useNavigate();

const category =
  localStorage.getItem("practiceCategory") || "";

  /* ===========================
     VALIDATION
  =========================== */

  if (!category) {
    return (
      <div className="practice-loading">

        <h2>No Practice Category Selected</h2>

        <p>
          Please return and choose a Practice Category.
        </p>

        <button
  onClick={() => navigate("/practice-categories")}
  className="back-btn"
>
  Back to Practice Categories
</button>
      </div>
    );
  }

  /* ===========================
     LOAD ENGINE
  =========================== */

  return (
  <PracticeEngine
  category={category}
  onFinish={() => {
    navigate("/practice-result");
  }}
/>
  );
}

export default PracticeMode;