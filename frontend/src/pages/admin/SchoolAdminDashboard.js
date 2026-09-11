import React, { useEffect, useState } from "react";
import BASE_URL from "../../api/api";

function SchoolAdminDashboard() {

  const [stats, setStats] = useState({
    students: 0,
    admins: 0,
    exams: 0,
    results: 0,
  });

  const user =
    JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {

      const res = await fetch(
        `${BASE_URL}/school-admin/stats/${user.schoolId}`
      );

      const data = await res.json();

      if (data.success) {
        setStats(data);
      }

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div style={{ padding: 20 }}>

      <h1>🏫 SCHOOL ADMIN DASHBOARD</h1>

      <div style={{
        display: "flex",
        gap: 20,
        marginTop: 20,
      }}>

        <Card
          title="Students"
          value={stats.students}
        />

        <Card
          title="Admins"
          value={stats.admins}
        />

        <Card
          title="Exams"
          value={stats.exams}
        />

        <Card
          title="Results"
          value={stats.results}
        />

      </div>

      <div style={{ marginTop: 40 }}>

        <h2>⚡ Quick Actions</h2>

        <button style={btn}>
          ➕ Add Student
        </button>

        <button style={btn}>
          📚 Create Exam
        </button>

        <button style={btn}>
          📊 View Results
        </button>

        <button style={btn}>
          📤 Upload Questions
        </button>

      </div>

    </div>
  );
}

function Card({ title, value }) {
  return (
    <div
      style={{
        padding: 20,
        border: "1px solid #ddd",
        borderRadius: 10,
        width: 180,
        textAlign: "center",
      }}
    >
      <h3>{title}</h3>
      <h2>{value}</h2>
    </div>
  );
}

const btn = {
  padding: "10px 15px",
  marginRight: 10,
  marginTop: 10,
};

export default SchoolAdminDashboard;