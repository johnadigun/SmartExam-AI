

import React, { useState } from "react";
import BASE_URL from "../api/api";
import "./Login.css";

function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const login = async () => {
    if (!form.email || !form.password) {
      alert("Email and Password are required.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email.trim(),
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Login failed.");
        return;
      }

      if (data.token && data.user) {
        localStorage.setItem("token", data.token);

        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );

        setForm({
          email: "",
          password: "",
        });

        alert("Login Successful");

        window.location.href = "/dashboard";
      } else {
        alert("Invalid login response.");
      }
    } catch (err) {
      console.log(err);
      alert("Unable to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      <div className="login-card">

        <h1>SMART EXAM CBT</h1>

        <p className="login-subtitle">
          Computer Based Examination System
        </p>

        <form
          autoComplete="off"
          onSubmit={(e) => {
            e.preventDefault();
            login();
          }}
        >

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            autoComplete="off"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            autoComplete="new-password"
          />

          <button
            type="submit"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        <p className="register-link">
          Don't have an account?

          <a href="/register">
            Register Here
          </a>
        </p>

      </div>

    </div>
  );
}

export default Login;

