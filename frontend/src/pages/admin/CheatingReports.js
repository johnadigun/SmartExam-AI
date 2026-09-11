
import React, { useEffect, useState } from "react";
import BASE_URL from "../../api/api";
import "./CheatingReports.css";

function CheatingReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const fetchReports = async () => {
    try {
      setError("");

      const response = await fetch(
        `${BASE_URL}/admin/cheating`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to load cheating reports."
        );
      }

      if (data.success) {
        setReports(data.flagged || []);
      } else {
        setReports([]);
        setError(
          data.message ||
            "Unable to load cheating reports."
        );
      }
    } catch (err) {
      console.error(
        "CHEATING REPORTS ERROR:",
        err
      );

      setError(
        err.message ||
          "Unable to connect to server."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <div className="cheating-reports-page">
      <div className="cheating-reports-header">
        <div>
          <h1>Cheating Reports</h1>

          <p>
            Review CBT sessions flagged for
            excessive tab switching.
          </p>
        </div>

        <div className="cheating-summary">
          <span>Flagged Sessions</span>

          <strong>
            {reports.length}
          </strong>
        </div>
      </div>

      {loading ? (
        <div className="cheating-message">
          Loading cheating reports...
        </div>
      ) : error ? (
        <div className="cheating-message cheating-error">
          {error}
        </div>
      ) : reports.length === 0 ? (
        <div className="cheating-message">
          <strong>
            No cheating detected
          </strong>

          <p>
            No CBT session has reached the
            current cheating-report threshold.
          </p>
        </div>
      ) : (
        <div className="cheating-table-wrapper">
          <table className="cheating-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Email</th>
                <th>Exam</th>
                <th>Tab Switches</th>
                <th>Score</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {reports.map((report) => {
                const user =
                  report.userId || {};

                const exam =
                  report.examId || {};

                const studentName = [
                  user.firstName,
                  user.middleName,
                  user.lastName,
                ]
                  .filter(Boolean)
                  .join(" ") ||
                  "Unknown Student";

                const examName =
                  exam.title ||
                  exam.name ||
                  "Unknown Exam";

                return (
                  <tr key={report._id}>
                    <td>
                      <strong>
                        {studentName}
                      </strong>
                    </td>

                    <td>
                      {user.email || "-"}
                    </td>

                    <td>
                      {examName}
                    </td>

                    <td>
                      <span className="switch-count">
                        {report.tabSwitchCount}
                      </span>
                    </td>

                    <td>
                      {typeof report.score ===
                      "number"
                        ? report.score
                        : "-"}
                    </td>

                    <td>
                      <span className="cheating-status">
                        Flagged
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default CheatingReports;