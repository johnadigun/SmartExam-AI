import { useEffect, useState } from "react";

export default function MockExamMode({ username }) {

  const [exams, setExams] = useState([]);
  const [started, setStarted] = useState(false);
  const [time, setTime] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  useEffect(() => {

    fetch("http://localhost:5000/api/exams")
      .then(res => res.json())
      .then(data => setExams(data));

  }, []);

  /* ANTI CHEAT */

  useEffect(() => {

    const warn = () => alert("⚠ No tab switching allowed");

    window.addEventListener("blur", warn);

    return () => window.removeEventListener("blur", warn);

  }, []);

  const startExam = (duration) => {

    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    }

    setTime(duration * 60);
    setStarted(true);
  };

  useEffect(() => {

    if (!started || time <= 0) return;

    const timer = setInterval(() => {
      setTime(t => t - 1);
    }, 1000);

    return () => clearInterval(timer);

  }, [started, time]);

  useEffect(() => {

    if (time === 0 && started) {
      submitExam(exams[0]);
    }

  }, [time]);

  const selectAnswer = (i, value) => {
    setAnswers({ ...answers, [i]: value });
  };

  const submitExam = async (exam) => {

    const res = await fetch("http://localhost:5000/api/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, answers, exam })
    });

    const data = await res.json();
    setResult(data);
  };

  if (result) {

    return (
      <div style={{ textAlign: "center", marginTop: 50 }}>

        <h1>RESULT</h1>

        <h2>{result.score} / {result.total}</h2>

        <h1 style={{ color: result.status === "PASS" ? "green" : "red" }}>
          {result.status}
        </h1>

        <button onClick={() => window.location.reload()}>
          Restart
        </button>

      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>

      <h1>CBT EXAM</h1>

      {!started && exams.map(exam => (
        <div key={exam.id}>
          <h2>{exam.title}</h2>
          <button onClick={() => startExam(exam.duration)}>
            Start Exam
          </button>
        </div>
      ))}

      {started && exams.map(exam => (
        <div key={exam.id}>

          <h2>{exam.title}</h2>

          <h3>Time: {time}s</h3>

          {exam.questions.map((q, i) => (
            <div key={i}>
              <p>{q.question}</p>

              {q.options.map((opt, j) => (
                <label key={j}>
                  <input
                    type="radio"
                    name={"q" + i}
                    onChange={() => selectAnswer(i, opt)}
                  />
                  {opt}
                </label>
              ))}

            </div>
          ))}

          <button onClick={() => submitExam(exam)}>
            Submit
          </button>

        </div>
      ))}

    </div>
  );
}