import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Exam() {
  const navigate = useNavigate();

  const [category, setCategory] = useState("");

  const categories = [
    "Science",
    "Arts",
    "Social Science",
    "Commercial",
  ];

  const subjects = {
    Science: [
      "English Language",
      "Mathematics",
      "Physics",
      "Chemistry",
      "Biology",
    ],

    Arts: [
      "English Language",
      "Literature in English",
      "History",
      "Government",
      "CRS",
      "IRS",
    ],

    "Social Science": [
      "English Language",
      "Economics",
      "Government",
      "Geography",
      "Agricultural Science",
    ],

    Commercial: [
      "English Language",
      "Mathematics",
      "Economics",
      "Commerce",
      "Accounting",
    ],
  };

  const openSubject = (subject) => {
    navigate("/cbt-subjects", {
      state: {
        category,
        subject,
      },
    });
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>CBT EXAM</h1>

      {!category ? (
        <>
          <h2>Select Category</h2>

          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              style={{
                display: "block",
                marginTop: 20,
                padding: 12,
                width: 280,
                cursor: "pointer",
              }}
            >
              {cat}
            </button>
          ))}
        </>
      ) : (
        <>
          <h2>{category}</h2>

          <h3>Available Subjects</h3>

          {subjects[category].map((subject) => (
            <button
              key={subject}
              onClick={() => openSubject(subject)}
              style={{
                display: "block",
                marginTop: 15,
                padding: 12,
                width: 320,
                cursor: "pointer",
              }}
            >
              {subject}
            </button>
          ))}

          <button
            onClick={() => setCategory("")}
            style={{
              marginTop: 30,
              padding: 12,
              width: 200,
            }}
          >
            Back
          </button>
        </>
      )}
    </div>
  );
}

export default Exam;