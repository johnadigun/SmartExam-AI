
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import BASE_URL from "../api/api";
import "./Login.css";

function Login() {
  const location = useLocation();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

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
     SELECTED COUNTRY CONTEXT
  ========================================================== */

  const selectedCountry =
    localStorage.getItem("selectedCountry") || "";

  const selectedCountryCode =
    localStorage.getItem("selectedCountryCode") || "";

  /* ==========================================================
     COUNTRY FLAG
  ========================================================== */

  const countryFlagUrl = selectedCountryCode
    ? `https://flagcdn.com/w80/${selectedCountryCode.toLowerCase()}.png`
    : "";

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
     LOGIN
  ========================================================== */

  const login = async () => {
    if (!form.email.trim() || !form.password) {
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

      if (!data.token || !data.user) {
        alert("Invalid login response.");
        return;
      }

      /* ======================================================
         SAVE AUTHENTICATION DATA
      ====================================================== */

      localStorage.setItem("token", data.token);

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      /* ======================================================
         PRESERVE LOCAL CBT COUNTRY CONTEXT
      ====================================================== */

      if (selectedCountry) {
        localStorage.setItem(
          "selectedCountry",
          selectedCountry
        );
      }

      if (selectedCountryCode) {
        localStorage.setItem(
          "selectedCountryCode",
          selectedCountryCode
        );
      }

      setForm({
        email: "",
        password: "",
      });

      alert("Login Successful");

      /* ======================================================
         RETURN TO THE REQUESTED PAGE

         International candidates return to their selected
         examination. Ordinary logins continue to Dashboard.
      ====================================================== */

      window.location.href = returnTo;
    } catch (err) {
      console.error("Login error:", err);
      alert("Unable to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  /* ==========================================================
     REGISTER LINK

     Carry the destination through registration when needed.
  ========================================================== */

  const registerUrl =
    returnTo === "/dashboard"
      ? "/register"
      : `/register?returnTo=${encodeURIComponent(returnTo)}`;

  /* ==========================================================
     UI
  ========================================================== */

  return (
    <div className="login-page">
      <div className="login-card">

        {/* SELECTED COUNTRY */}

        {selectedCountry && selectedCountryCode && (
          <div
            className="selected-country-login"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              marginBottom: "18px",
            }}
          >
            <img
              src={countryFlagUrl}
              alt={`${selectedCountry} flag`}
              style={{
                width: "42px",
                height: "28px",
                objectFit: "cover",
                borderRadius: "5px",
                border: "1px solid #e2e8f0",
              }}
            />

            <span
              style={{
                fontWeight: "600",
                color: "#0f172a",
              }}
            >
              {selectedCountry}
            </span>
          </div>
        )}

        {/* TITLE */}

        <h1>SMART EXAM CBT</h1>

        <p className="login-subtitle">
          Computer Based Examination System
        </p>

        {/* LOGIN FORM */}

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

        {/* REGISTER */}

        <p className="register-link">
          Don't have an account?{" "}
          <a href={registerUrl}>
            Register Here
          </a>
        </p>

      </div>
    </div>
  );
}

export default Login;

