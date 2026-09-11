import React, { useEffect, useState } from "react";
import BASE_URL from "../api/api";

function Leaderboard() {
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`${BASE_URL}/results/leaderboard`);
      const data = await res.json();

      setLeaders(data?.leaders || []);
    };

    fetchData();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>🏆 CBT LEADERBOARD</h2>

      {leaders.map((user, index) => (
        <div
          key={index}
          style={{
            padding: 10,
            marginBottom: 10,
            border: "1px solid #ccc",
          }}
        >
          <h3>
            {index + 1}. {user.name}
          </h3>
          <p>Score: {user.score}</p>
          <p>Grade: {user.grade}</p>
        </div>
      ))}
    </div>
  );
}

export default Leaderboard;