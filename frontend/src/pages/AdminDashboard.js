import { useState, useEffect } from "react";

export default function AdminDashboard() {

  const [title, setTitle] = useState("");
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [answer, setAnswer] = useState("");

  const [results, setResults] = useState([]);

  /* LOAD RESULTS */

  useEffect(() => {

    fetch("http://localhost:5000/api/results")
      .then(res => res.json())
      .then(data => setResults(data));

  }, []);

  /* CREATE EXAM */

  const createExam = async () => {

    const exam = {
      id: Date.now(),
      title,
      duration: 1,
      questions: [
        {
          question,
          options,
          answer
        }
      ]
    };

    await fetch("http://localhost:5000/api/admin/create-exam", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(exam)
    });

    alert("Exam Created!");
  };

  return (
    <div style={{ padding: 20 }}>

      <h1>🧑‍🏫 ADMIN DASHBOARD</h1>

      <h2>Create Exam</h2>

      <input placeholder="Title" onChange={e => setTitle(e.target.value)} />
      <br />

      <input placeholder="Question" onChange={e => setQuestion(e.target.value)} />
      <br />

      {options.map((opt, i) => (
        <input
          key={i}
          placeholder={`Option ${i + 1}`}
          onChange={e => {
            const newOpts = [...options];
            newOpts[i] = e.target.value;
            setOptions(newOpts);
          }}
        />
      ))}

      <br />

      <input placeholder="Correct Answer" onChange={e => setAnswer(e.target.value)} />

      <br />

      <button onClick={createExam}>
        Create Exam
      </button>

      <hr />

      <h2>📊 Student Results</h2>

      {results.map((r, i) => (
        <div key={i} style={{ border: "1px solid #ccc", margin: 5 }}>

          <p>User: {r.username}</p>
          <p>Score: {r.score}/{r.total}</p>
          <p>Status: {r.status}</p>

        </div>
      ))}

    </div>
  );
}