import React from "react";
import { useNavigate } from "react-router-dom";
import ResultsHistoryEngine from "./ResultsHistoryEngine";

function ResultsHistory() {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  /* ==========================================
     SECURITY
  ========================================== */

  if (!user?.email) {
    navigate("/");
    return null;
  }

  return (
    <ResultsHistoryEngine />
  );
}

export default ResultsHistory;