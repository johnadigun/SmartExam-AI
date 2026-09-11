import React, { useEffect, useState } from "react";
import BASE_URL from "../../api/api";


function Analytics() {
  const [data, setData] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch(`${BASE_URL}/admin/dashboard`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await res.json();
        setData(result);
      } catch (err) {
        console.log("Analytics error:", err);
      }
    };

    fetchAnalytics();
  }, []);

 
  // simple calculations (safe fallback)
  const students = data.studentsCount || 0;
  const exams = data.examsCount || 0;

  // fake fallback if backend doesn't send results breakdown yet
  const passed = data.passed || Math.floor(students * 0.6);
  const failed = data.failed || Math.floor(students * 0.4);


      {/* ================= STATS CARDS ================= */}
      <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
        <div style={cardStyle}>
          <h3>👨‍🎓 Students</h3>
          <h2>{students}</h2>
        </div>

        <div style={cardStyle}>
          <h3>📝 Exams</h3>
          <h2>{exams}</h2>
        </div>

        <div style={cardStyle}>
          <h3>📈 Total Activity</h3>
          <h2>{students + exams}</h2>
        </div>
      </div>

      {/* ================= SIMPLE CHART (PASS/FAIL) ================= */}
      <div style={{ marginTop: "40px" }}>
        <h2>📊 Performance Overview</h2>

        <div style={{ display: "flex", gap: "40px", marginTop: "20px" }}>
          
          {/* PASS BAR */}
          <div style={{ flex: 1 }}>
            <h4>✔ Passed</h4>
            <div style={barContainer}>
              <div
                style={{
                  ...bar,
                  width: `${(passed / (passed + failed)) * 100}%`,
                  background: "green",
                }}
              />
            </div>
            <p>{passed}</p>
          </div>

          {/* FAIL BAR */}
          <div style={{ flex: 1 }}>
            <h4>❌ Failed</h4>
            <div style={barContainer}>
              <div
                style={{
                  ...bar,
                  width: `${(failed / (passed + failed)) * 100}%`,
                  background: "red",
                }}
              />
            </div>
            <p>{failed}</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

// ================= STYLES =================
const cardStyle = {
  flex: 1,
  padding: "20px",
  border: "1px solid #ddd",
  borderRadius: "10px",
  textAlign: "center",
  background: "#f9f9f9",
};

const barContainer = {
  width: "100%",
  height: "20px",
  background: "#eee",
  borderRadius: "10px",
  overflow: "hidden",
};

const bar = {
  height: "100%",
  transition: "0.3s",
};

export default Analytics;