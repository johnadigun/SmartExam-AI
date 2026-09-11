import React, { useState } from "react";
import BASE_URL from "../api/api";

function AdminExamBuilder() {

  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState("");
  const [questions, setQuestions] = useState([]);

  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [answer, setAnswer] = useState("");

  /* ================= ADD QUESTION ================= */
  const addQuestion = () => {
    if (!question || !answer) return;

    setQuestions([
      ...questions,
      {
        question,
        options,
        answer
      }
    ]);

    setQuestion("");
    setOptions(["", "", "", ""]);
    setAnswer("");
  };

  /* ================= SUBMIT EXAM ================= */
  const createExam = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      const res = await fetch(`${BASE_URL}/exams/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title,
          duration,
          questions,
          createdBy: user?.email
        })
      });

      const data = await res.json();

      alert(data.message);

      if (data.success) {
        setTitle("");
        setDuration("");
        setQuestions([]);
      }

    } catch (err) {
      console.log(err);
      alert("Failed to create exam");
    }
  };

  return (
    <div style={{ padding: 20 }}>

      <h1>🛠 Admin Exam Builder</h1>

      {/* EXAM INFO */}
      <input
        placeholder="Exam Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <br /><br />

      <input
        placeholder="Duration (minutes)"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
      />

      <hr />

      {/* QUESTION INPUT */}
      <h3>Add Question</h3>

      <input
        placeholder="Question"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />

      {options.map((opt, i) => (
        <input
          key={i}
          placeholder={`Option ${i + 1}`}
          value={opt}
          onChange={(e) => {
            const newOptions = [...options];
            newOptions[i] = e.target.value;
            setOptions(newOptions);
          }}
        />
      ))}

      <input
        placeholder="Correct Answer"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
      />

      <button onClick={addQuestion}>
        ➕ Add Question
      </button>

      <hr />

      {/* PREVIEW */}
      <h3>Questions Added: {questions.length}</h3>

      {questions.map((q, i) => (
        <div key={i}>
          <p>{i + 1}. {q.question}</p>
        </div>
      ))}

      <hr />

      {/* CREATE EXAM */}
      <button onClick={createExam}>
        🚀 Create Exam
      </button>

    </div>
  );
}

export default AdminExamBuilder;