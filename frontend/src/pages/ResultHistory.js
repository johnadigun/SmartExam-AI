import React, { useEffect, useState } from "react";
import BASE_URL from "../api/api";

function ResultHistory() {

  const [results, setResults] = useState([]);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await fetch(
          `${BASE_URL}/results/user/${user._id}`
        );

        const data = await res.json();

        setResults(data.results || []);
      } catch (err) {
        console.log(err);
      }
    };

    fetchResults();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>📊 My Results</h1>

      {results.length === 0 ? (
        <p>No results yet</p>
      ) : (
        results.map((r, i) => (
          <div key={i} style={{
            border: "1px solid #ddd",
            margin: 10,
            padding: 10
          }}>
            <h3>Exam ID: {r.examId}</h3>
            <p>Score: {r.score} / {r.total}</p>
            <p>Status: {r.status}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default ResultHistory;