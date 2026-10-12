import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../api/api";
import "./CBTCategories.css";
import "./CBTSubjects.css";

function CBTSelection() {
  const navigate = useNavigate();

  /* ==========================================================
     USER
  ========================================================== */

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  /* ==========================================================
     STATE
  ========================================================== */

  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] =
    useState(null);

  const [selectedSubject, setSelectedSubject] =
    useState("");

  const [startingExam, setStartingExam] =
    useState(false);

  /* ==========================================================
     SELECTED COUNTRY
  ========================================================== */

  const selectedCountry =
    localStorage.getItem("selectedCountry") || "";

  const selectedCountryCode =
    localStorage.getItem("selectedCountryCode") || "";

  const countryFlagUrl = selectedCountryCode
    ? `https://flagcdn.com/w80/${selectedCountryCode.toLowerCase()}.png`
    : "";

  /* ==========================================================
     CBT CATEGORIES
  ========================================================== */

  const categories = [
    {
      id: 1,
      name: "Science",
      icon: "🔬",
      description:
        "Physics • Chemistry • Biology • Mathematics",
    },
    {
      id: 2,
      name: "Arts",
      icon: "📚",
      description:
        "Literature • Government • History",
    },
    {
      id: 3,
      name: "Commercial",
      icon: "💼",
      description:
        "Accounting • Commerce • Economics",
    },
    {
      id: 4,
      name: "Social Science",
      icon: "🌍",
      description:
        "Economics • Geography • Government",
    },
  ];

  /* ==========================================================
     SUBJECTS BY CATEGORY
  ========================================================== */

  const subjectsByCategory = {
    Science: [
      "English Language",
      "Mathematics",
      "Physics",
      "Chemistry",
      "Biology",
      "Agricultural Science",
    ],

    Arts: [
      "English Language",
      "Literature in English",
      "History",
      "Government",
      "CRS",
      "IRS",
    ],

    Commercial: [
      "English Language",
      "Mathematics",
      "Economics",
      "Commerce",
      "Financial Accounting",
    ],

    "Social Science": [
      "English Language",
      "Economics",
      "Government",
      "Geography",
      "Agricultural Science",
    ],
  };

  /* ==========================================================
     INITIAL CHECK
  ========================================================== */

  useEffect(() => {
    if (!user?.email) {
      navigate("/");
      return;
    }

    setLoading(false);
  }, [navigate, user]);

  /* ==========================================================
     SELECT CATEGORY
  ========================================================== */

  const handleCategoryChange = (event) => {
    const categoryName = event.target.value;

    if (!categoryName) {
      setSelectedCategory(null);
      setSelectedSubject("");
      return;
    }

    const category = categories.find(
      (item) => item.name === categoryName
    );

    if (!category) {
      setSelectedCategory(null);
      setSelectedSubject("");
      return;
    }

    setSelectedCategory(category);

    /*
      Changing category always resets the
      previously selected subject.
    */
    setSelectedSubject("");
  };

  /* ==========================================================
     SELECT SUBJECT
  ========================================================== */

  const handleSubjectChange = (event) => {
    setSelectedSubject(event.target.value);
  };

  /* ==========================================================
     CHECK CBT ACCESS
  ========================================================== */

  const checkCBTAccess = async () => {
    const token =
      localStorage.getItem("token");

    if (!token) {
      console.log(
        "NO LOGIN TOKEN FOUND"
      );

      return false;
    }

    try {
      const response = await fetch(
        `${BASE_URL}/auth/me`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data =
        await response.json();

      console.log(
        "CURRENT USER FROM DATABASE:",
        data
      );

      if (
        !response.ok ||
        !data.user
      ) {
        console.log(
          "AUTH/ME REQUEST FAILED"
        );

        return false;
      }

      const currentUser =
        data.user;

      /* ======================================================
         CBT ACCESS
      ====================================================== */

      if (
        currentUser.cbtAccess !== true
      ) {
        console.log(
          "CBT ACCESS FALSE"
        );

        return false;
      }

      /* ======================================================
         CBT EXPIRY
      ====================================================== */

      if (
        !currentUser.cbtExpiry
      ) {
        console.log(
          "CBT EXPIRY MISSING"
        );

        return false;
      }

      const expiryTime =
        new Date(
          currentUser.cbtExpiry
        ).getTime();

      if (
        Number.isNaN(expiryTime)
      ) {
        console.log(
          "INVALID CBT EXPIRY:",
          currentUser.cbtExpiry
        );

        return false;
      }

      if (
        Date.now() >= expiryTime
      ) {
        console.log(
          "CBT ACCESS EXPIRED:",
          currentUser.cbtExpiry
        );

        return false;
      }

      /* ======================================================
         SAVE CURRENT USER
      ====================================================== */

      localStorage.setItem(
        "user",
        JSON.stringify(currentUser)
      );

      console.log(
        "CBT ACCESS VALID UNTIL:",
        currentUser.cbtExpiry
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

  const startExam = async () => {
    if (
      !selectedCategory ||
      !selectedSubject
    ) {
      alert(
        "Please select an examination category and subject."
      );

      return;
    }

    try {
      setStartingExam(true);

      console.log(
        "STARTING CBT:",
        {
          category:
            selectedCategory.name,

          subject:
            selectedSubject,
        }
      );

      /* ======================================================
         CHECK DATABASE ACCESS
      ====================================================== */

      const accessAllowed =
        await checkCBTAccess();

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

      const token =
        localStorage.getItem("token");

      if (!token) {
        alert(
          "Please login again."
        );

        localStorage.removeItem(
          "token"
        );

        localStorage.removeItem(
          "user"
        );

        navigate("/");

        return;
      }

      /* ======================================================
         REQUEST EXAM BY SUBJECT
      ====================================================== */

      const examUrl =
        `${BASE_URL}/exams/subject/${encodeURIComponent(
          selectedSubject
        )}?mode=cbt`;

      console.log(
        "REQUESTING CBT EXAM:",
        examUrl
      );

      const response =
        await fetch(
          examUrl,
          {
            method: "GET",

            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      const data =
        await response.json();

      console.log(
        "CBT EXAM RESPONSE:",
        data
      );

      /* ======================================================
         SESSION INVALID
      ====================================================== */

      if (
        response.status === 401
      ) {
        alert(
          data.message ||
            "Your session has expired. Please login again."
        );

        localStorage.removeItem(
          "token"
        );

        localStorage.removeItem(
          "user"
        );

        navigate("/");

        return;
      }

      /* ======================================================
         ACCESS DENIED
      ====================================================== */

      if (
        response.status === 403
      ) {
        alert(
          data.message ||
            "Your CBT access has expired or is not active."
        );

        navigate("/payment");

        return;
      }

      /* ======================================================
         SERVER ERROR
      ====================================================== */

      if (!response.ok) {
        alert(
          data.message ||
            `Unable to load ${selectedSubject} examination.`
        );

        return;
      }

      /* ======================================================
         SUCCESS CHECK
      ====================================================== */

      if (!data.success) {
        alert(
          data.message ||
            `Unable to load ${selectedSubject} examination.`
        );

        return;
      }

      /* ======================================================
         EXAM VALIDATION
      ====================================================== */

      if (
        !data.exam ||
        !Array.isArray(
          data.exam.questions
        ) ||
        data.exam.questions.length === 0
      ) {
        alert(
          `No questions are available for ${selectedSubject}.`
        );

        console.log(
          "EMPTY CBT EXAM RESPONSE:",
          data
        );

        return;
      }

      /* ======================================================
         NORMALIZE EXAM INFORMATION
         
         The backend may return the category name
         such as "Science" in data.exam.subject.

         The candidate selected an actual subject,
         such as Physics.

         Therefore the selected subject is explicitly
         placed into the exam object.
      ====================================================== */

      const examForCBT = {
        ...data.exam,

        subject:
          selectedSubject,

        category:
          selectedCategory.name,
      };

      console.log(
        "FINAL EXAM SENT TO CBT:",
        examForCBT
      );

      /* ======================================================
         OPEN CBT EXAM
      ====================================================== */

      navigate(
        "/cbt-exam",
        {
          state: {
            exam:
              examForCBT,

            subject:
              selectedSubject,

            category:
              selectedCategory.name,

            country:
              selectedCountry,

            countryCode:
              selectedCountryCode,

            countryFlag:
              countryFlagUrl,
          },
        }
      );

    } catch (err) {
      console.error(
        "START CBT ERROR:",
        err
      );

      alert(
        "Unable to load examination."
      );

    } finally {
      setStartingExam(false);
    }
  };

  /* ==========================================================
     BACK TO DASHBOARD
  ========================================================== */

  const backToDashboard = () => {
    navigate("/dashboard");
  };

  /* ==========================================================
     LOADING
  ========================================================== */

  if (loading) {
    return (
      <div className="categories-loading">

        <h2>
          Loading CBT Selection...
        </h2>

      </div>
    );
  }

  /* ==========================================================
     PAGE
  ========================================================== */

  return (
    <div className="categories-container">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="categories-header">

        <h1>
          SMARTEXAM CBT SYSTEM
        </h1>

        <p>
          Select your examination category
          and subject to continue.
        </p>

        {/* ====================================================
            COUNTRY
        ==================================================== */}

        {selectedCountry &&
          selectedCountryCode && (
            <div
              className="categories-selected-country"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                marginTop: "16px",
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
                  border:
                    "1px solid #dbe2ea",
                  display: "block",
                }}
              />

              <div
                style={{
                  display: "flex",
                  flexDirection:
                    "column",
                  alignItems:
                    "flex-start",
                  lineHeight: "1.2",
                }}
              >

                <strong
                  style={{
                    color: "#0f172a",
                    fontSize: "14px",
                  }}
                >
                  {selectedCountry}
                </strong>

                <small
                  style={{
                    color: "#64748b",
                    fontSize: "11px",
                  }}
                >
                  Selected Country
                </small>

              </div>

            </div>
          )}

      </div>

      {/* ======================================================
          SELECTION AREA
      ====================================================== */}

      <section
        className="categories-selection-section"
        style={{
          width: "100%",
          maxWidth: "700px",
          margin: "0 auto",
          padding: "20px",
        }}
      >

        {/* ====================================================
            CATEGORY
        ==================================================== */}

        <div
          style={{
            marginBottom: "24px",
          }}
        >

          <label
            htmlFor="category-select"
            style={{
              display: "block",
              fontWeight: "700",
              fontSize: "16px",
              marginBottom: "8px",
              color: "#0f172a",
            }}
          >
            Select Examination Category
          </label>

          <select
            id="category-select"
            value={
              selectedCategory?.name || ""
            }
            onChange={
              handleCategoryChange
            }
            disabled={startingExam}
            style={{
              width: "100%",
              minHeight: "52px",
              padding: "10px 14px",
              fontSize: "16px",
              borderRadius: "8px",
              border:
                "1px solid #cbd5e1",
              backgroundColor:
                "#ffffff",
              color: "#0f172a",
              cursor:
                startingExam
                  ? "not-allowed"
                  : "pointer",
              outline: "none",
            }}
          >

            <option value="">
              -- Select Examination Category --
            </option>

            {categories.map(
              (category) => (
                <option
                  key={category.id}
                  value={category.name}
                >
                  {category.name}
                </option>
              )
            )}

          </select>

          {selectedCategory && (
            <p
              style={{
                marginTop: "10px",
                marginBottom: "0",
                color: "#64748b",
                fontSize: "14px",
              }}
            >
              {selectedCategory.icon}{" "}
              {selectedCategory.description}
            </p>
          )}

        </div>

        {/* ====================================================
            SUBJECT
        ==================================================== */}

        <div
          id="available-subjects"
          className="subjects-selection-section"
          style={{
            width: "100%",
          }}
        >

          <label
            htmlFor="subject-select"
            style={{
              display: "block",
              fontWeight: "700",
              fontSize: "16px",
              marginBottom: "8px",
              color: "#0f172a",
            }}
          >
            Select Subject
          </label>

          <select
            id="subject-select"
            value={selectedSubject}
            onChange={
              handleSubjectChange
            }
            disabled={
              !selectedCategory ||
              startingExam
            }
            style={{
              width: "100%",
              minHeight: "52px",
              padding: "10px 14px",
              fontSize: "16px",
              borderRadius: "8px",
              border:
                "1px solid #cbd5e1",
              backgroundColor:
                !selectedCategory
                  ? "#f1f5f9"
                  : "#ffffff",
              color:
                !selectedCategory
                  ? "#94a3b8"
                  : "#0f172a",
              cursor:
                !selectedCategory ||
                startingExam
                  ? "not-allowed"
                  : "pointer",
              outline: "none",
            }}
          >

            <option value="">
              {!selectedCategory
                ? "-- Select a category first --"
                : "-- Select Subject --"}
            </option>

            {selectedCategory &&
              (
                subjectsByCategory[
                  selectedCategory.name
                ] || []
              ).map(
                (subject) => (
                  <option
                    key={subject}
                    value={subject}
                  >
                    {subject}
                  </option>
                )
              )}

          </select>

          {/* ==================================================
              SELECTED SUBJECT
          ================================================== */}

          {selectedSubject && (
            <div
              style={{
                marginTop: "18px",
                padding:
                  "14px 16px",
                borderRadius: "8px",
                backgroundColor:
                  "#f8fafc",
                border:
                  "1px solid #e2e8f0",
              }}
            >

              <strong
                style={{
                  color: "#0f172a",
                  fontSize: "15px",
                }}
              >
                Selected:
              </strong>

              <span
                style={{
                  marginLeft: "8px",
                  color: "#334155",
                  fontSize: "15px",
                }}
              >
                {selectedSubject}
              </span>

            </div>
          )}

          {/* ==================================================
              START EXAMINATION
          ================================================== */}

          <button
            type="button"
            onClick={startExam}
            disabled={
              !selectedCategory ||
              !selectedSubject ||
              startingExam
            }
            style={{
              width: "100%",
              minHeight: "52px",
              marginTop: "18px",
              padding:
                "10px 18px",
              fontSize: "16px",
              fontWeight: "700",
              borderRadius: "8px",
              border: "none",
              backgroundColor:
                !selectedCategory ||
                !selectedSubject ||
                startingExam
                  ? "#cbd5e1"
                  : "#0f766e",
              color: "#ffffff",
              cursor:
                !selectedCategory ||
                !selectedSubject ||
                startingExam
                  ? "not-allowed"
                  : "pointer",
            }}
          >
            {startingExam
              ? "Loading Examination..."
              : "Start Examination →"}
          </button>

        </div>

      </section>

      {/* ======================================================
          FOOTER
      ====================================================== */}

      <div className="categories-footer">

        <button
          className="back-btn"
          onClick={
            backToDashboard
          }
          type="button"
        >
          {"\u2190 Back to Dashboard"}
        </button>

      </div>

    </div>
  );
}

export default CBTSelection;