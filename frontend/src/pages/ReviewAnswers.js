
import React from "react";
import { useNavigate } from "react-router-dom";
import ReviewAnswersEngine from "./ReviewAnswersEngine";

function ReviewAnswers() {
  const navigate = useNavigate();

  /* ==========================================
     SECURITY
  ========================================== */

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  if (!user?.email) {
    navigate("/");
    return null;
  }

  /* ==========================================
     LOAD RESULT
  ========================================== */

  const result =
    JSON.parse(
      localStorage.getItem("practice_result") || "null"
    ) ||
    JSON.parse(
      localStorage.getItem("cbt_result") || "null"
    );

  /* ==========================================
     NO RESULT
  ========================================== */

  if (!result) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "80px",
        }}
      >
        <h2>No Result Found</h2>

        <p>
          Please complete an examination first.
        </p>

        <button
          onClick={() => navigate("/dashboard")}
          style={{
            marginTop: "20px",
            padding: "12px 25px",
            cursor: "pointer",
          }}
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  /* ==========================================
     REVIEW ENGINE
  ========================================== */

  return (
    <ReviewAnswersEngine
      result={result}
    />
  );
}

export default ReviewAnswers;

