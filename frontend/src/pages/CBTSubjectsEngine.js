
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BASE_URL from "../api/api";
import CBTSubjectsUI from "./CBTSubjectsUI";

function CBTSubjectsEngine() {
  const navigate = useNavigate();
  const location = useLocation();

  const { category } = location.state || {};

  const [subjects, setSubjects] = useState([]);
  const [selectedReligion, setSelectedReligion] = useState("");
  const [loading, setLoading] = useState(true);

  /* ==========================================================
     LOAD SUBJECTS
  ========================================================== */

  useEffect(() => {
    if (!category) {
      navigate("/cbt-categories");
      return;
    }

    let list = [];

    switch (category) {
      case "Science":
        list = [
          "English Language",
          "Mathematics",
          "Physics",
          "Chemistry",
          "Biology",
          "Agricultural Science",
        ];
        break;

      case "Arts":
        list = [
          "English Language",
          "Literature in English",
          "History",
          "Government",
        ];
        break;

      case "Commercial":
        list = [
          "English Language",
          "Mathematics",
          "Economics",
          "Commerce",
          "Financial Accounting",
        ];
        break;

      case "Social Science":
        list = [
          "English Language",
          "Economics",
          "Government",
          "Geography",
          "Agricultural Science",
        ];
        break;

      default:
        list = [];
        break;
    }

    setSubjects(list);
    setLoading(false);
  }, [category, navigate]);

  /* ==========================================================
     CHECK CURRENT CBT ACCESS
  ========================================================== */

  const checkCBTAccess = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.log("NO LOGIN TOKEN FOUND");
      return false;
    }

    try {
      const response = await fetch(`${BASE_URL}/auth/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      console.log("CURRENT USER FROM DATABASE:", data);

      if (!response.ok || !data.user) {
        console.log("AUTH/ME REQUEST FAILED");
        return false;
      }

      const user = data.user;

      /* ======================================================
         CBT ACCESS
      ====================================================== */

      if (user.cbtAccess !== true) {
        console.log("CBT ACCESS FALSE");
        return false;
      }

      /* ======================================================
         CBT EXPIRY
      ====================================================== */

      if (!user.cbtExpiry) {
        console.log("CBT EXPIRY MISSING");
        return false;
      }

      const expiryTime = new Date(user.cbtExpiry).getTime();

      if (Number.isNaN(expiryTime)) {
        console.log("INVALID CBT EXPIRY:", user.cbtExpiry);
        return false;
      }

      if (Date.now() >= expiryTime) {
        console.log("CBT ACCESS EXPIRED:", user.cbtExpiry);
        return false;
      }

      /* ======================================================
         SAVE CURRENT DATABASE USER
      ====================================================== */

      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );

      console.log(
        "CBT ACCESS VALID UNTIL:",
        user.cbtExpiry
      );

      return true;

    } catch (err) {
      console.error(
        "CBT ACCESS CHECK ERROR:",
        err
      );

      return false;
    }
  };

  /* ==========================================================
     START EXAM
  ========================================================== */

  const startExam = async (subject) => {
    try {
      setLoading(true);

      console.log(
        "STARTING CBT SUBJECT:",
        subject
      );

      /* ======================================================
         CHECK CURRENT DATABASE ACCESS
      ====================================================== */

      const accessAllowed = await checkCBTAccess();

      if (!accessAllowed) {
        alert(
          "Your CBT access has expired or is not active. Please make a new payment."
        );

        navigate("/payment");
        return;
      }

      /* ======================================================
         GET TOKEN
      ====================================================== */

      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login again.");

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/");
        return;
      }

      /* ======================================================
         REQUEST SUBJECT EXAM
      ====================================================== */

      const examUrl =
        `${BASE_URL}/exams/subject/${encodeURIComponent(subject)}?mode=cbt`;

      console.log(
        "REQUESTING CBT EXAM:",
        examUrl
      );

      const response = await fetch(examUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      console.log(
        "CBT EXAM RESPONSE:",
        data
      );

      /* ======================================================
         SESSION INVALID
      ====================================================== */

      if (response.status === 401) {
        alert(
          data.message ||
            "Your session has expired. Please login again."
        );

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/");
        return;
      }

      /* ======================================================
         CBT ACCESS DENIED
      ====================================================== */

      if (response.status === 403) {
        alert(
          data.message ||
            "Your CBT access has expired or is not active."
        );

        navigate("/payment");
        return;
      }

      /* ======================================================
         OTHER SERVER ERROR
      ====================================================== */

      if (!response.ok) {
        alert(
          data.message ||
            `Unable to load ${subject} examination.`
        );

        return;
      }

      /* ======================================================
         SUCCESS CHECK
      ====================================================== */

      if (!data.success) {
        alert(
          data.message ||
            `Unable to load ${subject} examination.`
        );

        return;
      }

      /* ======================================================
         EXAM VALIDATION
      ====================================================== */

      if (
        !data.exam ||
        !Array.isArray(data.exam.questions) ||
        data.exam.questions.length === 0
      ) {
        alert(
          `No questions are available for ${subject}.`
        );

        console.log(
          "EMPTY CBT EXAM RESPONSE:",
          data
        );

        return;
      }

      /* ======================================================
         OPEN CBT EXAM
      ====================================================== */

      navigate("/cbt-exam", {
        state: {
          exam: data.exam,
          subject,
          category,
        },
      });

    } catch (err) {
      console.error(
        "START CBT ERROR:",
        err
      );

      alert(
        "Unable to load examination."
      );

    } finally {
      setLoading(false);
    }
  };

  /* ==========================================================
     BACK TO CATEGORIES
  ========================================================== */

  const backToCategories = () => {
    navigate("/cbt-categories");
  };

  /* ==========================================================
     USER INTERFACE
  ========================================================== */

  return (
    <CBTSubjectsUI
      loading={loading}
      category={category}
      subjects={subjects}
      selectedReligion={selectedReligion}
      setSelectedReligion={setSelectedReligion}
      startExam={startExam}
      backToCategories={backToCategories}
    />
  );
}

export default CBTSubjectsEngine;

