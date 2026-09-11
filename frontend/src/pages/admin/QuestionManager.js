
import React, { useEffect, useMemo, useState } from "react";
import BASE_URL from "../../api/api";
import "./QuestionManager.css";

import QuestionFilters from "./QuestionFilters";
import QuestionTable from "./QuestionTable";
import QuestionModal from "./QuestionModal";

const EMPTY_QUESTION = {
subject: "",
category: "",
exam: "",
year: "",
question: "",
options: ["", "", "", ""],
answer: "",
difficulty: "medium",
};

function QuestionManager() {
const token = localStorage.getItem("token");

const [questions, setQuestions] = useState([]);
const [loading, setLoading] = useState(true);
const [saving, setSaving] = useState(false);

const [search, setSearch] = useState("");
const [subject, setSubject] = useState("");
const [category, setCategory] = useState("");

const [modalOpen, setModalOpen] = useState(false);
const [editingQuestion, setEditingQuestion] = useState(null);

/* ==========================================================
LOAD QUESTIONS
========================================================== */

const loadQuestions = async () => {
try {
setLoading(true);


  const response = await fetch(`${BASE_URL}/questions`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    alert(data.message || "Unable to load questions.");
    return;
  }

  setQuestions(data.questions || []);
} catch (err) {
  console.error("LOAD QUESTIONS ERROR:", err);
  alert("Unable to connect to the server.");
} finally {
  setLoading(false);
}


};

useEffect(() => {
loadQuestions();
}, []);

/* ==========================================================
SUBJECTS
========================================================== */

const subjects = useMemo(() => {
return [
...new Set(
questions
.map((q) => q.subject)
.filter(Boolean)
),
];
}, [questions]);

/* ==========================================================
CATEGORIES
========================================================== */

const categories = useMemo(() => {
return [
...new Set(
questions
.map((q) => q.category)
.filter(Boolean)
),
];
}, [questions]);

/* ==========================================================
FILTER QUESTIONS
========================================================== */

const filteredQuestions = useMemo(() => {
const keyword = search.trim().toLowerCase();


return questions.filter((q) => {
  const matchesSubject =
    !subject || q.subject === subject;

  const matchesCategory =
    !category || q.category === category;

  const matchesSearch =
    !keyword ||
    q.question?.toLowerCase().includes(keyword) ||
    q.subject?.toLowerCase().includes(keyword) ||
    q.category?.toLowerCase().includes(keyword) ||
    q.exam?.toLowerCase().includes(keyword);

  return (
    matchesSubject &&
    matchesCategory &&
    matchesSearch
  );
});


}, [
questions,
search,
subject,
category,
]);

/* ==========================================================
ADD QUESTION
========================================================== */

const openAddModal = () => {
setEditingQuestion(null);
setModalOpen(true);
};

/* ==========================================================
EDIT QUESTION
========================================================== */

const openEditModal = (question) => {
setEditingQuestion(question);
setModalOpen(true);
};

/* ==========================================================
CLOSE MODAL
========================================================== */

const closeModal = () => {
setEditingQuestion(null);
setModalOpen(false);
};

/* ==========================================================
SAVE QUESTION
========================================================== */

const saveQuestion = async (form) => {
try {
setSaving(true);


  const isEditing = Boolean(editingQuestion);

  const url = isEditing
    ? `${BASE_URL}/questions/${editingQuestion._id}`
    : `${BASE_URL}/questions`;

  const response = await fetch(url, {
    method: isEditing ? "PUT" : "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(form),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    alert(
      data.message ||
        "Unable to save question."
    );
    return;
  }

  alert(
    isEditing
      ? "Question updated successfully."
      : "Question added successfully."
  );

  closeModal();

  await loadQuestions();
} catch (err) {
  console.error("SAVE QUESTION ERROR:", err);
  alert("Unable to save question.");
} finally {
  setSaving(false);
}


};

/* ==========================================================
DELETE QUESTION
========================================================== */

const deleteQuestion = async (questionId) => {
const confirmed = window.confirm(
"Delete this question permanently?"
);


if (!confirmed) {
  return;
}

try {
  const response = await fetch(
    `${BASE_URL}/questions/${questionId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok || !data.success) {
    alert(
      data.message ||
        "Unable to delete question."
    );
    return;
  }

  alert("Question deleted successfully.");

  await loadQuestions();
} catch (err) {
  console.error("DELETE QUESTION ERROR:", err);
  alert("Unable to delete question.");
}


};

/* ==========================================================
RETURN TO DASHBOARD
========================================================== */

const returnToDashboard = () => {
window.location.href = "/admin/dashboard";
};

/* ==========================================================
PAGE
========================================================== */

return ( <div className="question-page">


  <div className="question-manager">

    {/* ======================================================
       HEADER
    ====================================================== */}

    <div className="question-manager-header">

      <div className="question-title-area">

        <button
          type="button"
          className="return-btn"
          onClick={returnToDashboard}
        >
          ← Return to Dashboard
        </button>

        <h1>Question Manager</h1>

        <p>
          Manage the SmartExam CBT question bank.
        </p>

      </div>

      <button
        type="button"
        className="primary-btn"
        onClick={openAddModal}
      >
        + Add Question
      </button>

    </div>

    {/* ======================================================
       SUMMARY
    ====================================================== */}

    <div className="question-summary">

      <div className="summary-card">
        <span>Total Questions</span>
        <strong>{questions.length}</strong>
      </div>

      <div className="summary-card">
        <span>Subjects</span>
        <strong>{subjects.length}</strong>
      </div>

      <div className="summary-card">
        <span>Categories</span>
        <strong>{categories.length}</strong>
      </div>

      <div className="summary-card">
        <span>Showing</span>
        <strong>
          {filteredQuestions.length}
        </strong>
      </div>

    </div>

    {/* ======================================================
       FILTERS
    ====================================================== */}

    <QuestionFilters
      search={search}
      setSearch={setSearch}
      subjectFilter={subject}
      setSubjectFilter={setSubject}
      categoryFilter={category}
      setCategoryFilter={setCategory}
      subjects={subjects}
      categories={categories}
      onAddQuestion={openAddModal}
    />

    {/* ======================================================
       TABLE / LOADING
    ====================================================== */}

    {loading ? (
      <div className="loading-box">
        Loading questions...
      </div>
    ) : (
      <QuestionTable
        questions={filteredQuestions}
        onEdit={openEditModal}
        onDelete={deleteQuestion}
      />
    )}

  </div>

  {/* ========================================================
     QUESTION MODAL
  ======================================================== */}

  {modalOpen && (
    <QuestionModal
      editing={Boolean(editingQuestion)}
      saving={saving}
      question={
        editingQuestion || EMPTY_QUESTION
      }
      onClose={closeModal}
      onSave={saveQuestion}
    />
  )}

</div>


);
}

export default QuestionManager;
