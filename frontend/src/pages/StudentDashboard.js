import { useState } from "react";
import CBTExam from "./CBTExam";
import PracticeMode from "./PracticeMode";
import ResultPage from "./ResultPage";

export default function StudentDashboard({ user }) {

  const [mode, setMode] = useState(null);

  return (
    <div>
      <h1>Welcome {user.name}</h1>

      <button onClick={() => setMode("practice")}>Practice Mode</button>
      <button onClick={() => setMode("cbt")}>CBT Mode (Paid)</button>

      {mode === "practice" && <PracticeMode user={user} />}
      {mode === "cbt" && <CBTExam user={user} />}
    </div>
  );
}