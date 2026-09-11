
import React, { useEffect, useState } from "react";
import BASE_URL from "../../api/api";
import "./LiveMonitoring.css";

function LiveMonitoring() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const fetchLiveSessions = async () => {
    try {
      setError("");

      const response = await fetch(
        `${BASE_URL}/admin/live`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to load live monitoring."
        );
      }

      if (data.success) {
        setSessions(data.sessions || []);
      } else {
        setSessions([]);
        setError(
          data.message || "Unable to load live sessions."
        );
      }
    } catch (err) {
      console.error("LIVE MONITORING ERROR:", err);
      setError(
        err.message || "Unable to connect to server."
      );
      setSessions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveSessions();

    const interval = setInterval(() => {
      fetchLiveSessions();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const activeCount = sessions.length;

  return (
    <div className="live-monitoring-page">
      <div className="live-monitoring-header">
        <div>
          <h1>Live Monitoring</h1>
          <p>
            Monitor students currently taking CBT examinations.
          </p>
        </div>

        <div className="live-status">
          <span className="live-status-dot"></span>
          Live
        </div>
      </div>

      <div className="live-summary">
        <div className="live-summary-card">
          <span>Active Sessions</span>
          <strong>{activeCount}</strong>
        </div>
      </div>

      {loading ? (
        <div className="live-message">
          Loading live monitoring...
        </div>
      ) : error ? (
        <div className="live-message live-error">
          {error}
        </div>
      ) : sessions.length === 0 ? (
        <div className="live-message">
          <strong>No active CBT sessions.</strong>
          <p>
            Students currently taking an examination will
            appear here automatically.
          </p>
        </div>
      ) : (
        <div className="live-table-wrapper">
          <table className="live-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Exam</th>
                <th>Started</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {sessions.map((session, index) => {
                const student =
                  session.userId ||
                  session.user ||
                  {};

                const exam =
                  session.examId ||
                  session.exam ||
                  {};

                const studentName =
                  student.firstName ||
                  student.name ||
                  session.name ||
                  "Unknown Student";

                const studentEmail =
                  student.email ||
                  session.email ||
                  "-";

                const examName =
                  exam.title ||
                  exam.name ||
                  session.examName ||
                  "CBT Examination";

                const startedAt =
                  session.startedAt ||
                  session.createdAt;

                const status =
                  session.state ||
                  session.status ||
                  "IN_PROGRESS";

                return (
                  <tr
                    key={session._id || index}
                  >
                    <td>
                      <strong>{studentName}</strong>
                      <span className="live-email">
                        {studentEmail}
                      </span>
                    </td>

                    <td>{examName}</td>

                    <td>
                      {startedAt
                        ? new Date(
                            startedAt
                          ).toLocaleString()
                        : "-"}
                    </td>

                    <td>
                      <span className="session-status">
                        {status}
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

export default LiveMonitoring;