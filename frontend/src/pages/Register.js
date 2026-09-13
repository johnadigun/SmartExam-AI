
import React, { useState } from "react";
import BASE_URL from "../api/api";
import "./Register.css";

function Register() {
  const emptyForm = {
    firstName: "",
    middleName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
  };

  const [form, setForm] = useState(emptyForm);

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const submit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      alert("Email and password are required");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Registration failed");
        return;
      }

      alert("Registration Successful");

      // Clear the form before leaving the registration page
      setForm(emptyForm);

      window.location.href = "/";
    } catch (err) {
      console.log(err);
      alert("Unable to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <h1>SMART EXAM CBT</h1>

        <p className="register-subtitle">
          Student Registration
        </p>

        <form
          onSubmit={submit}
          autoComplete="off"
        >
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={form.firstName}
            onChange={handleChange}
            autoComplete="off"
          />

          <input
            type="text"
            name="middleName"
            placeholder="Middle Name"
            value={form.middleName}
            onChange={handleChange}
            autoComplete="off"
          />

          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={form.lastName}
            onChange={handleChange}
            autoComplete="off"
          />

          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            autoComplete="off"
          />

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
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="login-link">
          Already have an account?

          <a href="/">
            Login Here
          </a>
        </p>
      </div>
    </div>
  );
}

export default Register;