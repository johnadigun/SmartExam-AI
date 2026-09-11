import React, { useEffect, useState } from "react";
import BASE_URL from "../api/api";

function AdminAnalytics() {

  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      const res = await fetch(`${BASE_URL}/results/analytics`);
      const data = await res.json();
      setData(data);
    };

    fetchAnalytics();
  }, []);

  if (!data) return <h2>Loading analytics...</h2>;

  return (
    <div style={{ padding: 20 }}>
      <h1>📈 Admin Analytics</h1>

      <p>Total Users: {data.totalUsers}</p>
      <p>Total Exams Taken: {data.totalExams}</p>
      <p>Passed: {data.passed}</p>
      <p>Failed: {data.failed}</p>
      <p>Average Score: {data.avgScore}</p>
    </div>
  );
}

export default AdminAnalytics;