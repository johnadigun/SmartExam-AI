import React from "react";
import { useNavigate } from "react-router-dom";

function ExamHome() {
  const navigate = useNavigate();

  const startCBT = () => {
    navigate("/cbt-categories");
  };

  return (
    <div style={{ padding: 30 }}>
      <h1>CBT EXAM PORTAL</h1>

      <button
        onClick={startCBT}
        style={{
          padding: 15,
          background: "blue",
          color: "#fff",
          marginTop: 20,
        }}
      >
        Start CBT Exam
      </button>

      <button
        onClick={() => navigate("/practice")}
        style={{
          padding: 15,
          background: "orange",
          color: "#fff",
          marginLeft: 10,
        }}
      >
        Practice Mode
      </button>
    </div>
  );
}

export default ExamHome;