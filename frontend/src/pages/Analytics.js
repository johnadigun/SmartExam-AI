import { useEffect, useState } from "react";

export default function Analytics() {

  const [logs, setLogs] = useState([]);

  useEffect(() => {

    fetch("http://localhost:5000/api/analytics/student123")
      .then(res => res.json())
      .then(data => setLogs(data));

  }, []);

  return (
    <div>
      <h2>Student Analytics</h2>

      {logs.map((log, i) => (
        <p key={i}>
          {log.event} - {log.timestamp}
        </p>
      ))}

    </div>
  );
}