import { useEffect, useState } from "react";

export default function Leaderboard() {

  const [data, setData] = useState([]);

  useEffect(() => {

    fetch("http://localhost:5000/api/leaderboard")
      .then(res => res.json())
      .then(setData);

  }, []);

  return (
    <div>
      <h2>🏆 Leaderboard</h2>

      {data.map((user, i) => (
        <p key={i}>
          #{i + 1} {user.username} - {user.score}
        </p>
      ))}

    </div>
  );
}