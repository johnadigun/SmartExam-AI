
import React, { useEffect, useState } from "react";

const EMPTY_FORM = {
subject: "",
category: "",
exam: "",
year: "",
question: "",
options: ["", "", "", ""],
answer: "",
difficulty: "medium",
};

function QuestionModal({
editing,
saving,
question,
onClose,
onSave,
}) {
const [form, setForm] =
useState(EMPTY_FORM);

useEffect(() => {
if (question) {
setForm({
subject: question.subject || "",
category: question.category || "",
exam: question.exam || "",
year: question.year || "",
question: question.question || "",
options:
Array.isArray(question.options) &&
question.options.length === 4
? question.options
: ["", "", "", ""],
answer: question.answer || "",
difficulty:
question.difficulty || "medium",
});
} else {
setForm(EMPTY_FORM);
}
}, [question]);

/* ==========================================================
TEXT INPUT
========================================================== */

const handleChange = (event) => {
const { name, value } = event.target;


setForm((previous) => ({
  ...previous,
  [name]: value,
}));


};

/* ==========================================================
OPTION INPUT
========================================================== */

const handleOptionChange = (
index,
value
) => {
setForm((previous) => {
const options = [
...previous.options,
];


  options[index] = value;

  return {
    ...previous,
    options,
  };
});


};

/* ==========================================================
SUBMIT
========================================================== */

const handleSubmit = () => {
const subject =
form.subject.trim();


const questionText =
  form.question.trim();

const options = form.options.map(
  (option) => option.trim()
);

const answer =
  form.answer.trim();

if (!subject) {
  alert("Please enter the subject.");
  return;
}

if (!questionText) {
  alert("Question cannot be empty.");
  return;
}

if (
  !Array.isArray(options) ||
  options.length !== 4
) {
  alert(
    "Exactly four options are required."
  );
  return;
}

if (
  options.some(
    (option) => !option
  )
) {
  alert(
    "All four options must be filled."
  );
  return;
}

if (!answer) {
  alert(
    "Please select the correct answer."
  );
  return;
}

if (!options.includes(answer)) {
  alert(
    "Correct answer must match one of the four options."
  );
  return;
}

onSave({
  subject,
  category: form.category.trim(),
  exam: form.exam.trim(),
  year: form.year.trim(),
  question: questionText,
  options,
  answer,
  difficulty: form.difficulty,
});


};

return (
<div
className="qm-modal-overlay"
onMouseDown={(event) => {
if (
event.target === event.currentTarget &&
!saving
) {
onClose();
}
}}
>


  <div
    className="qm-modal"
    role="dialog"
    aria-modal="true"
    aria-labelledby="question-modal-title"
  >

    {/* ======================================================
       MODAL HEADER
    ====================================================== */}

    <div className="qm-modal-header">

      <div>
        <h2 id="question-modal-title">
          {editing
            ? "Edit Question"
            : "Add New Question"}
        </h2>

        <p>
          Enter the question details below.
        </p>
      </div>

      <button
        type="button"
        className="modal-close-btn"
        onClick={onClose}
        disabled={saving}
        aria-label="Close"
      >
        ×
      </button>

    </div>

    {/* ======================================================
       FORM
    ====================================================== */}

    <div className="qm-modal-body">

      <div className="form-row">

        <div className="form-group">
          <label htmlFor="subject">
            Subject *
          </label>

          <input
            id="subject"
            name="subject"
            type="text"
            value={form.subject}
            placeholder="e.g. Mathematics"
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">
            Category
          </label>

          <input
            id="category"
            name="category"
            type="text"
            value={form.category}
            placeholder="e.g. Algebra"
            onChange={handleChange}
          />
        </div>

      </div>

      <div className="form-row">

        <div className="form-group">
          <label htmlFor="exam">
            Examination
          </label>

          <input
            id="exam"
            name="exam"
            type="text"
            value={form.exam}
            placeholder="e.g. WAEC"
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="year">
            Year
          </label>

          <input
            id="year"
            name="year"
            type="text"
            value={form.year}
            placeholder="e.g. 2026"
            onChange={handleChange}
          />
        </div>

      </div>

      <div className="form-group">
        <label htmlFor="question">
          Question *
        </label>

        <textarea
          id="question"
          name="question"
          rows="5"
          value={form.question}
          placeholder="Enter the complete question..."
          onChange={handleChange}
        />
      </div>

      {/* ====================================================
         OPTIONS
      ==================================================== */}

      <div className="options-section">

        <label className="section-label">
          Answer Options *
        </label>

        {form.options.map(
          (option, index) => (
            <div
              className="option-row"
              key={index}
            >

              <span className="option-label">
                {String.fromCharCode(
                  65 + index
                )}
              </span>

              <input
                type="text"
                value={option}
                placeholder={`Option ${String.fromCharCode(
                  65 + index
                )}`}
                onChange={(event) =>
                  handleOptionChange(
                    index,
                    event.target.value
                  )
                }
              />

            </div>
          )
        )}

      </div>

      {/* ====================================================
         ANSWER / DIFFICULTY
      ==================================================== */}

      <div className="form-row">

        <div className="form-group">
          <label htmlFor="answer">
            Correct Answer *
          </label>

          <select
            id="answer"
            name="answer"
            value={form.answer}
            onChange={handleChange}
          >
            <option value="">
              Select correct answer
            </option>

            {form.options.map(
              (option, index) => (
                <option
                  key={index}
                  value={option}
                  disabled={!option.trim()}
                >
                  {String.fromCharCode(
                    65 + index
                  )}
                  {option
                    ? ` — ${option}`
                    : " — Empty"}
                </option>
              )
            )}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="difficulty">
            Difficulty
          </label>

          <select
            id="difficulty"
            name="difficulty"
            value={form.difficulty}
            onChange={handleChange}
          >
            <option value="easy">
              Easy
            </option>

            <option value="medium">
              Medium
            </option>

            <option value="hard">
              Hard
            </option>
          </select>
        </div>

      </div>

    </div>

    {/* ======================================================
       FOOTER
    ====================================================== */}

    <div className="qm-modal-footer">

      <button
        type="button"
        className="cancel-btn"
        onClick={onClose}
        disabled={saving}
      >
        Cancel
      </button>

      <button
        type="button"
        className="save-btn"
        onClick={handleSubmit}
        disabled={saving}
      >
        {saving
          ? "Saving..."
          : editing
          ? "Update Question"
          : "Save Question"}
      </button>

    </div>

  </div>
</div>


);
}

export default QuestionModal;
