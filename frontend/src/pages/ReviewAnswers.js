
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ReviewAnswersEngine from "./ReviewAnswersEngine";

function ReviewAnswers() {
  const navigate = useNavigate();
  const location = useLocation();

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

  /*
    First use the result passed directly from
    the ResultPage.

    This guarantees that Normal CBT reviews
    the exact examination just completed.
  */

  let result =
    location.state?.result || null;

  /*
    Normal CBT fallback.
  */

  if (!result) {
    result = JSON.parse(
      localStorage.getItem("cbt_result") || "null"
    );
  }

  /*
    Practice Mode fallback.
  */

  if (!result) {
    result = JSON.parse(
      localStorage.getItem("practice_result") || "null"
    );
  }

  /* ==========================================
     NO RESULT
  ========================================== */

  if (!result) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f4f7fb",
          padding: "20px",
          fontFamily:
            '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "480px",
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
            padding: "35px 25px",
            textAlign: "center",
            boxShadow:
              "0 5px 18px rgba(15,23,42,.07)",
          }}
        >
          <h2
            style={{
              margin: "0 0 10px",
              color: "#1565c0",
            }}
          >
            No Result Found
          </h2>

          <p
            style={{
              margin: "0",
              color: "#64748b",
            }}
          >
            Please complete an examination first.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/dashboard")
            }
            style={{
              marginTop: "22px",
              padding: "11px 24px",
              border: "none",
              borderRadius: "7px",
              background: "#1565c0",
              color: "#ffffff",
              fontWeight: "700",
              cursor: "pointer",
            }}
          >
            Back to Dashboard
          </button>
        </div>
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

