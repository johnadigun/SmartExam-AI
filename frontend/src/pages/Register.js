
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import BASE_URL from "../api/api";
import "./Register.css";

function Register() {
  const location = useLocation();

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

  /* ==========================================================
     PRESERVE THE REQUESTED DESTINATION
  ========================================================== */

  const queryParams = new URLSearchParams(location.search);

  const requestedDestination =
    location.state?.returnTo ||
    queryParams.get("returnTo") ||
    "";

  const isValidReturnDestination =
    typeof requestedDestination === "string" &&
    requestedDestination.startsWith("/") &&
    !requestedDestination.startsWith("//") &&
    !requestedDestination.startsWith("/login") &&
    !requestedDestination.startsWith("/register");

  const returnTo = isValidReturnDestination
    ? requestedDestination
    : "/dashboard";

  /* ==========================================================
     FORM CHANGE
  ========================================================== */

  const handleChange = (e) => {
    setForm((previousForm) => ({
      ...previousForm,
      [e.target.name]: e.target.value,
    }));
  };

  /* ==========================================================
     REGISTRATION
  ========================================================== */

  const submit = async (e) => {
    e.preventDefault();

    if (!form.email.trim() || !form.password) {
      alert("Email and password are required.");
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
        alert(data.message || "Registration failed.");
        return;
      }

      alert("Registration Successful");

      setForm(emptyForm);

      /* ======================================================
         RETURN TO LOGIN

         Registration does not assume that the API creates
         an authentication token.

         For an international examination, preserve the
         selected examination through the Login URL.
      ====================================================== */

      const loginUrl =
        returnTo === "/dashboard"
          ? "/"
          : `/?returnTo=${encodeURIComponent(returnTo)}`;

      window.location.href = loginUrl;
    } catch (err) {
      console.error("Registration error:", err);
      alert("Unable to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  /* ==========================================================
     LOGIN LINK
  ========================================================== */

  const loginUrl =
    returnTo === "/dashboard"
      ? "/"
      : `/?returnTo=${encodeURIComponent(returnTo)}`;

  /* ==========================================================
     UI
  ========================================================== */

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
          Already have an account?{" "}
          <a href={loginUrl}>
            Login Here
          </a>
        </p>

      </div>
    </div>
  );
}

export default Register;

