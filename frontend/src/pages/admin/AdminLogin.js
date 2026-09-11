import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../../api/api";
import "./AdminLogin.css";

function AdminLogin() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

 const login = async (e) => {
  console.log("LOGIN FUNCTION STARTED");

  e.preventDefault();

  setError("");

  if (!form.email || !form.password) {
    console.log("Missing email or password");
    setError("Email and password are required");
    return;
  }

  setLoading(true);

  console.log("Sending request to:", `${BASE_URL}/auth/login`);

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

console.log("HTTP Status:", res.status);

const data = await res.json();

console.log("Response:", JSON.stringify(data, null, 2));
      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

   const allowedRoles = [
  "super-admin",
  "school-admin",
];

if (!allowedRoles.includes(data.user?.role)) {
  setError("Access denied. Admin only.");
  return;
}

      // Save admin session
      localStorage.setItem("token", data.token);
      localStorage.setItem(
  "admin",
  JSON.stringify({
    _id: data.user._id,
    schoolId: data.user.schoolId,
    email: data.user.email,
    role: data.user.role,
  })
);

      // Redirect to admin dashboard
     navigate("/admin");

    } catch (err) {
      console.error("ADMIN LOGIN ERROR:", err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">

        <h1>SmartExam Admin</h1>
        <p className="subtitle">Admin Panel Login</p>

        {error && <div className="error-box">{error}</div>}

        <form onSubmit={login}>

          <input
            type="email"
            name="email"
            placeholder="Admin Email"
            value={form.email}
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login as Admin"}
          </button>

        </form>

      </div>
    </div>
  );
}

export default AdminLogin;