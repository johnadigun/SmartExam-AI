
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BASE_URL from "../api/api";
import MockExamEngine from "./MockExamEngine";
import "./MockExamMode.css";

function MockExamMode() {
  const navigate = useNavigate();
  const location = useLocation();

  const { exam, subject, category } =
    location.state || {};

  useEffect(() => {
    const verifyAccess = async () => {
      try {
        const token =
          localStorage.getItem("token");

        if (!token) {
          navigate("/");
          return;
        }

        /*
          Get the current user from the database.
          Do not trust stale localStorage access.
        */

        const response = await fetch(
          `${BASE_URL}/auth/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data =
          await response.json();

        if (!response.ok || !data.user) {
          navigate("/");
          return;
        }

        const user = data.user;

        /*
          Refresh localStorage.
        */

        localStorage.setItem(
          "user",
          JSON.stringify(user)
        );

        /*
          Check CBT access.
        */

        if (!user.cbtAccess) {
          alert(
            "Your CBT access is not active. Please complete payment."
          );

          navigate("/payment");
          return;
        }

        /*
          Check actual expiry.
        */

        if (!user.cbtExpiry) {
          alert(
            "Your CBT access has no valid expiry time. Please make a new payment."
          );

          navigate("/payment");
          return;
        }

        const expiry =
          new Date(user.cbtExpiry).getTime();

        if (Date.now() >= expiry) {
          alert(
            "Your CBT access has expired. Please make a new payment."
          );

          navigate("/payment");
          return;
        }

        /*
          CBT requires a category and exam.
        */

        if (!category || !exam) {
          navigate("/cbt-categories");
          return;
        }

      } catch (err) {
        console.log(
          "CBT MODE ACCESS ERROR:",
          err
        );

        alert(
          "Unable to verify CBT access."
        );

        navigate("/dashboard");
      }
    };

    verifyAccess();

  }, [category, exam, navigate]);

  if (!category || !exam) {
    return (
      <div className="mock-exam-mode-container">
        <div className="mock-exam-card">

          <h2>No CBT Category Selected</h2>

          <p>
            Please return and select a CBT Category.
          </p>

          <button
            className="back-btn"
            onClick={() =>
              navigate("/cbt-categories")
            }
          >
            Back to Categories
          </button>

        </div>
      </div>
    );
  }

  return (
    <MockExamEngine
      exam={exam}
      subject={subject}
      category={category}
    />
  );
}

export default MockExamMode;