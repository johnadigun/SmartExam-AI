
import React from "react";
import { useNavigate } from "react-router-dom";
import "./ResultsHistory.css";

function ResultsHistoryUI({

  /* ---------- Loading ---------- */

  loading,
  hasResults,

  /* ---------- Statistics ---------- */

  statistics,

  /* ---------- Table ---------- */

  columns,
  results,

  /* ---------- Search ---------- */

  search,
  setSearch,

  /* ---------- Filter ---------- */

  filter,
  setFilter,

  /* ---------- Actions ---------- */

  refreshHistory,
  printHistory,
  exportSummary,
  viewResult,
  deleteResult,
  clearHistory,

}) {

  const navigate = useNavigate();

  /* ==========================================
     LOADING
  ========================================== */

  if (loading) {

    return (

      <div className="history-loading">

        <h2>Loading Results History...</h2>

      </div>

    );

  }

  /* ==========================================
     EMPTY HISTORY
  ========================================== */

  if (!hasResults) {

    return (

      <div className="history-container">

        <div className="history-card">

          <h1>SMARTEXAM RESULTS HISTORY</h1>

          <div className="history-empty">

            <h2>No Results Available</h2>

            <p>

              You have not completed any
              Practice or CBT examination yet.

            </p>

            <button
              className="dashboard-btn"
              onClick={() => navigate("/dashboard")}
            >

              Back to Dashboard

            </button>

          </div>

        </div>

      </div>

    );

  }

  /* ==========================================
     MAIN PAGE
  ========================================== */

  return (

    <div className="history-container">

      <div className="history-card">

        {/* ======================================
            HEADER
        ====================================== */}

        <div className="history-header">

          <h1>SMARTEXAM RESULTS HISTORY</h1>

          <p>

            Review all your Practice and CBT
            examination attempts.

          </p>

        </div>

        {/* ======================================
            SUMMARY CARDS
        ====================================== */}

        <div className="history-summary">

          <div className="summary-box">

            <span>Total Attempts</span>

            <strong>

              {statistics.totalAttempts}

            </strong>

          </div>

          <div className="summary-box">

            <span>Highest Score</span>

            <strong>

              {statistics.highestScore}

            </strong>

          </div>

          <div className="summary-box">

            <span>Average</span>

            <strong>

              {statistics.averagePercentage}%

            </strong>

          </div>

          <div className="summary-box">

            <span>Best Grade</span>

            <strong>

              {statistics.bestGrade}

            </strong>

          </div>

        </div>

        {/* ======================================
            TOOLBAR
        ====================================== */}

        <div className="history-toolbar">

          {/* ---------- Search ---------- */}

          <div className="history-search">

            <input
              type="text"
              placeholder="Search Category, Subject, Grade..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>

          {/* ---------- Filter ---------- */}

          <div className="history-filter">

            <select
              value={filter}
              onChange={(e) =>
                setFilter(e.target.value)
              }
            >

              <option value="All">
                All Results
              </option>

              <option value="Practice">
                Practice
              </option>

              <option value="CBT">
                CBT
              </option>

            </select>

          </div>

        </div>

        {/* ======================================
            ACTION TOOLBAR
        ====================================== */}

        <div className="history-actions">

          <button
            className="refresh-btn"
            onClick={refreshHistory}
          >
            Refresh
          </button>

          <button
            className="print-btn"
            onClick={printHistory}
          >
            Print
          </button>

          <button
            className="export-btn"
            onClick={exportSummary}
          >
            Export
          </button>

          <button
            className="clear-btn"
            onClick={clearHistory}
          >
            Clear History
          </button>

        </div>

        {/* ======================================
            RESULTS TABLE
        ====================================== */}

        <div className="history-table-wrapper">

          <table className="history-table">

            <thead>

              <tr>

                {columns.map((column) => (

                  <th key={column}>

                    {column}

                  </th>

                ))}

              </tr>

            </thead>

            <tbody>

              {results.map((item, index) => {

                const completedDate =
                  item.completedAt
                    ? new Date(
                        item.completedAt
                      ).toLocaleString()
                    : "-";

                return (

                  <tr
                    key={
                      item.completedAt || index
                    }
                  >

                    {/* ==========================
                        SERIAL NUMBER
                    ========================== */}

                    <td>

                      {index + 1}

                    </td>

                    {/* ==========================
                        TYPE
                    ========================== */}

                    <td>

                      <span
                        className={
                          (item.type || "")
                            .toLowerCase() === "cbt"
                            ? "type-badge cbt"
                            : "type-badge practice"
                        }
                      >

                        {item.type || "Practice"}

                      </span>

                    </td>

                    {/* ==========================
                        CATEGORY
                    ========================== */}

                    <td>

                      {item.category || "-"}

                    </td>

                    {/* ==========================
                        SCORE
                    ========================== */}

                    <td>

                      {item.score}/
                      {item.totalQuestions ||
                        item.total ||
                        "-"}

                    </td>

                    {/* ==========================
                        PERCENTAGE
                    ========================== */}

                    <td>

                      {item.percentage}%

                    </td>

                    {/* ==========================
                        GRADE
                    ========================== */}

                    <td>

                      <span
                        className={`grade grade-${(
                          item.grade || "F"
                        ).toLowerCase()}`}
                      >

                        {item.grade || "F"}

                      </span>

                    </td>

                    {/* ==========================
                        COMPLETED DATE
                    ========================== */}

                    <td>

                      {completedDate}

                    </td>

                    {/* ==========================
                        ACTIONS
                    ========================== */}

                    <td>

                      <div className="table-actions">

                        <button
                          className="view-btn"
                          onClick={() =>
                            viewResult(item)
                          }
                        >

                          View

                        </button>

                        <button
                          className="delete-btn"
                          onClick={() =>
                            deleteResult(
                              item.completedAt
                            )
                          }
                        >

                          Delete

                        </button>

                      </div>

                    </td>

                  </tr>

                );

              })}

            </tbody>

          </table>

        </div>

        {/* ======================================
            FOOTER ACTIONS
        ====================================== */}

        <div className="history-footer">

          <button
            className="dashboard-btn"
            onClick={() =>
              navigate("/dashboard")
            }
          >

            Back to Dashboard

          </button>

        </div>

      </div>

    </div>

  );

}

/* ==========================================
   EXPORT
========================================== */

export default ResultsHistoryUI;

