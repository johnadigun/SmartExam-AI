
import React from "react";
import PracticeEngine from "./PracticeEngine";
import "./PracticeMode.css";

function PracticeMode() {

  /* ===========================
     LOAD PRACTICE ENGINE
     PRACTICE MODE IS CATEGORY-FREE
  =========================== */

  return (
    <PracticeEngine
      onFinish={() => {
        window.location.href = "/practice-result";
      }}
    />
  );
}

export default PracticeMode;