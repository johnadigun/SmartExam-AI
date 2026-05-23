import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import CBTExam from "./CBTExam";

export default function Dashboard() {

  const { user } = useContext(AuthContext);
  const [mode, setMode] = useState(null);

  return (
    <div>
      <h1>Welcome {user.email}</h1>

      <button onClick={() => setMode("practice")}>
        Practice Mode
      </button>

      <button onClick={() => setMode("cbt")}>
        CBT Mode (Paid)
      </button>

      {mode === "cbt" && <CBTExam />}
    </div>
  );
}