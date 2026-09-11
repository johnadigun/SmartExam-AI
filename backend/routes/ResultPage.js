import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();

  /* ================= SAFE DATA ================= */
  const score = location.state?.score ?? 0;
  const total = location.state?.total ?? 0;
  const grade = location.state?.grade ?? "N/A";
  const examTitle = location.state?.examTitle ?? "CBT Result";
  const subject = location.state?.subject ?? "Unknown Subject";
  const category = location.state?.category ?? "General";

  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

  /* ================= STATUS ENGINE ================= */
  const getStatus = () => {
    if (percentage >= 70) return "DISTINCTION 🏆";
    if (percentage >= 60) return "CREDIT 👍";
    if (percentage >= 50) return "PASS ✔";
    return "FAIL ❌";
  };

  /* ================= PRINT ================= */
  const handlePrint = () => {
    window.print();
  };

  /* ================= NAVIGATION ================= */
  const handleRetry = () => {
    navigate("/dashboard");
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1>🎓 {examTitle}</h1>

        {/* SUBJECT INFO */}
        <h3>Subject: {subject}</h3>
        <h4>Category: {category}</h4>

        <hr />

        {/* SCORE SECTION */}
        <h2>
          Score: {score} / {total}
        </h2>

        <h2>Percentage: {percentage}%</h2>

        <h2>Grade: {grade}</h2>

        <h2>Status: {getStatus()}</h2>

        {/* BUTTONS */}
        <div style={styles.buttonGroup}>
          <button onClick={handlePrint} style={styles.printBtn}>
            🖨 Print Result
          </button>

          <button onClick={handleRetry} style={styles.backBtn}>
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */
const styles = {
  container: {
    padding: 20,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "#f4f6f8",
  },
  card: {
    background: "#fff",
    padding: 30,
    borderRadius: 10,
    width: "100%",
    maxWidth: 500,
    textAlign: "center",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  },
  buttonGroup: {
    marginTop: 20,
    display: "flex",
    justifyContent: "center",
    gap: 10,
  },
  printBtn: {
    padding: 10,
    background: "green",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
  backBtn: {
    padding: 10,
    background: "#333",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
};

export default ResultPage;