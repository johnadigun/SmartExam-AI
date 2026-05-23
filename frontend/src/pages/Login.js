import { useState, useContext } from "react";
import { loginUser } from "../api/api";
import { AuthContext } from "../context/AuthContext";

export default function Login() {

  const { setUser, setToken } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {

    const data = await loginUser({ email, password });

    if (data.success) {
      setUser(data);
      setToken(data.token);
      localStorage.setItem("token", data.token);
    } else {
      alert(data.message);
    }
  };

  return (
    <div>
      <h2>Login</h2>

      <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input placeholder="Password" type="password" onChange={e => setPassword(e.target.value)} />

      <button onClick={login}>Login</button>
    </div>
  );
}