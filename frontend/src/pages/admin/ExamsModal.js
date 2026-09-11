
import React, {
  useEffect,
  useState,
} from "react";

function ExamsModal({
  exam,
  saving,
  onSave,
  onClose,
}) {
  const [form, setForm] = useState({
    ...exam,
    questions: Array.isArray(exam.questions)
      ? exam.questions
      : [],
  });

  useEffect(() => {
    setForm({
      ...exam,
      questions: Array.isArray(exam.questions)
        ? exam.questions
        : [],
    });
  }, [exam]);


  /* =====================================================
     BASIC FORM CHANGES
  ====================================================== */

  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        name === "duration"
          ? Number(value)
          : value,
    }));
  };


  /* =====================================================
     PUBLISHED STATUS
  ====================================================== */

  const handlePublished = (e) => {
    setForm((prev) => ({
      ...prev,
      published:
        e.target.checked,
    }));
  };


  /* =====================================================
     UPDATE QUESTION
  ====================================================== */

  const updateQuestion = (
    questionIndex,
    field,
    value
  ) => {
    setForm((prev) => {
      const questions = [
        ...prev.questions,
      ];

      questions[
        questionIndex
      ] = {
        ...questions[
          questionIndex
        ],
        [field]: value,
      };

      return {
        ...prev,
        questions,
      };
    });
  };


  /* =====================================================
     UPDATE OPTION
  ====================================================== */

  const updateOption = (
    questionIndex,
    optionIndex,
    value
  ) => {
    setForm((prev) => {
      const questions = [
        ...prev.questions,
      ];

      const options =
        Array.isArray(
          questions[
            questionIndex
          ].options
        )
          ? [
              ...questions[
                questionIndex
              ].options,
            ]
          : [
              "",
              "",
              "",
              "",
            ];

      options[
        optionIndex
      ] = value;

      questions[
        questionIndex
      ] = {
        ...questions[
          questionIndex
        ],
        options,
      };

      return {
        ...prev,
        questions,
      };
    });
  };


  /* =====================================================
     ADD QUESTION
  ====================================================== */

  const addQuestion = () => {
    setForm((prev) => ({
      ...prev,

      questions: [
        ...prev.questions,

        {
          question: "",
          options: [
            "",
            "",
            "",
            "",
          ],
          answer: "",
        },
      ],
    }));
  };


  /* =====================================================
     REMOVE QUESTION
  ====================================================== */

  const removeQuestion = (
    questionIndex
  ) => {
    if (
      !window.confirm(
        "Remove this question from the exam?"
      )
    ) {
      return;
    }

    setForm((prev) => ({
      ...prev,

      questions:
        prev.questions.filter(
          (_, index) =>
            index !==
            questionIndex
        ),
    }));
  };


  /* =====================================================
     VALIDATE AND SAVE
  ====================================================== */

  const handleSubmit = () => {
    if (!form.title?.trim()) {
      alert(
        "Exam title is required."
      );
      return;
    }

    if (!form.subject?.trim()) {
      alert(
        "Subject is required."
      );
      return;
    }

    if (!form.category?.trim()) {
      alert(
        "Category is required."
      );
      return;
    }

    if (
      !form.duration ||
      Number(form.duration) <= 0
    ) {
      alert(
        "Duration must be greater than zero."
      );
      return;
    }

    if (
      !Array.isArray(
        form.questions
      ) ||
      form.questions.length === 0
    ) {
      alert(
        "The exam must contain at least one question."
      );
      return;
    }


    for (
      let i = 0;
      i < form.questions.length;
      i += 1
    ) {
      const question =
        form.questions[i];


      /* -------------------------
         QUESTION TEXT
      ------------------------- */

      if (
        !question.question?.trim()
      ) {
        alert(
          `Question ${i + 1} is empty.`
        );
        return;
      }


      /* -------------------------
         EXACTLY FOUR OPTIONS
      ------------------------- */

      const options =
        Array.isArray(
          question.options
        )
          ? question.options.map(
              (option) =>
                String(
                  option || ""
                ).trim()
            )
          : [];


      if (
        options.length !== 4
      ) {
        alert(
          `Question ${i + 1} must have exactly four options.`
        );
        return;
      }


      if (
        options.some(
          (option) => !option
        )
      ) {
        alert(
          `All four options for Question ${i + 1} must be filled.`
        );
        return;
      }


      /* -------------------------
         DUPLICATE OPTIONS
      ------------------------- */

      const uniqueOptions =
        new Set(
          options.map(
            (option) =>
              option.toLowerCase()
          )
        );

      if (
        uniqueOptions.size !== 4
      ) {
        alert(
          `Question ${i + 1} contains duplicate options.`
        );
        return;
      }


      /* -------------------------
         CORRECT ANSWER
      ------------------------- */

      const answer =
        String(
          question.answer || ""
        ).trim();

      if (!answer) {
        alert(
          `Please provide the correct answer for Question ${
            i + 1
          }.`
        );
        return;
      }


      if (
        !options.includes(
          answer
        )
      ) {
        alert(
          `The correct answer for Question ${
            i + 1
          } must match one of its four options.`
        );
        return;
      }
    }


    /* -------------------------
       SAVE ONLY THE REQUIRED
       EXAM DATA
       ------------------------- */

    const cleanedQuestions =
      form.questions.map(
        (question) => ({
          question:
            question.question.trim(),

          options:
            question.options.map(
              (option) =>
                option.trim()
            ),

          answer:
            question.answer.trim(),
        })
      );


    const cleanedExam = {
      _id: form._id,

      title:
        form.title.trim(),

      subject:
        form.subject.trim(),

      category:
        form.category,

      duration:
        Number(form.duration),

      published:
        form.published === true,

      questions:
        cleanedQuestions,
    };


    onSave(cleanedExam);
  };


  return (
    <div className="modal-overlay">

      <div className="modal exam-edit-modal">

        {/* =================================================
            MODAL HEADER
        ================================================== */}

        <div className="modal-header">

          <div>
            <h2>
              Edit Examination
            </h2>

            <p>
              Update exam information
              and manage its questions.
            </p>
          </div>


          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            disabled={saving}
          >
            ×
          </button>

        </div>


        {/* =================================================
            BASIC INFORMATION
        ================================================== */}

        <div className="modal-section">

          <div className="modal-section-title">

            <h3>
              Examination Information
            </h3>

            <span>
              Basic settings
            </span>

          </div>


          <div className="modal-form-grid">

            <div className="modal-field full-width">

              <label>
                Exam Title
              </label>

              <input
                type="text"
                name="title"
                value={
                  form.title || ""
                }
                onChange={
                  handleChange
                }
                placeholder="Enter examination title"
              />

            </div>


            <div className="modal-field">

              <label>
                Subject
              </label>

              <input
                type="text"
                name="subject"
                value={
                  form.subject || ""
                }
                onChange={
                  handleChange
                }
                placeholder="Subject"
              />

            </div>


            <div className="modal-field">

              <label>
                Category
              </label>

              <select
                name="category"
                value={
                  form.category || ""
                }
                onChange={
                  handleChange
                }
              >

                <option value="">
                  Select Category
                </option>

                <option value="Science">
                  Science
                </option>

                <option value="Arts">
                  Arts
                </option>

                <option value="Social Science">
                  Social Science
                </option>

                <option value="Commercial">
                  Commercial
                </option>

              </select>

            </div>


            <div className="modal-field">

              <label>
                Duration (Minutes)
              </label>

              <input
                type="number"
                min="1"
                name="duration"
                value={
                  form.duration || ""
                }
                onChange={
                  handleChange
                }
              />

            </div>


            <div className="modal-field">

              <label>
                Total Questions
              </label>

              <input
                type="text"
                value={
                  form.questions.length
                }
                readOnly
              />

            </div>

          </div>


          <label className="publish-switch">

            <input
              type="checkbox"
              checked={
                form.published === true
              }
              onChange={
                handlePublished
              }
            />

            <span className="switch-track">
              <span className="switch-thumb"></span>
            </span>

            <span>

              <strong>
                Published
              </strong>

              <small>
                Make this examination
                available as published
                content.
              </small>

            </span>

          </label>

        </div>


        {/* =================================================
            QUESTIONS
        ================================================== */}

        <div className="modal-section questions-section">

          <div className="modal-section-title questions-heading">

            <div>

              <h3>
                Examination Questions
              </h3>

              <span>
                {
                  form.questions.length
                }{" "}
                question
                {
                  form.questions.length ===
                  1
                    ? ""
                    : "s"
                }
              </span>

            </div>


            <button
              type="button"
              className="add-question-btn"
              onClick={
                addQuestion
              }
              disabled={saving}
            >
              + Add Question
            </button>

          </div>


          <div className="questions-editor">

            {form.questions.map(
              (
                question,
                questionIndex
              ) => {

                const options =
                  Array.isArray(
                    question.options
                  )
                    ? question.options
                    : [
                        "",
                        "",
                        "",
                        "",
                      ];

                return (
                  <div
                    className="question-editor-card"
                    key={
                      question._id ||
                      `question-${questionIndex}`
                    }
                  >

                    <div className="question-editor-header">

                      <strong>
                        Question{" "}
                        {questionIndex + 1}
                      </strong>


                      <button
                        type="button"
                        className="remove-question-btn"
                        onClick={() =>
                          removeQuestion(
                            questionIndex
                          )
                        }
                        disabled={
                          saving
                        }
                      >
                        Remove
                      </button>

                    </div>


                    <textarea
                      value={
                        question.question ||
                        ""
                      }
                      onChange={(e) =>
                        updateQuestion(
                          questionIndex,
                          "question",
                          e.target.value
                        )
                      }
                      placeholder="Enter the question..."
                      rows="3"
                    />


                    <div className="options-grid">

                      {options.map(
                        (
                          option,
                          optionIndex
                        ) => (

                          <div
                            className="option-editor"
                            key={`${questionIndex}-${optionIndex}`}
                          >

                            <span>
                              {String.fromCharCode(
                                65 +
                                  optionIndex
                              )}
                            </span>


                            <input
                              type="text"
                              value={
                                option || ""
                              }
                              onChange={(e) =>
                                updateOption(
                                  questionIndex,
                                  optionIndex,
                                  e.target.value
                                )
                              }
                              placeholder={`Option ${String.fromCharCode(
                                65 +
                                  optionIndex
                              )}`}
                            />

                          </div>

                        )
                      )}

                    </div>


                    <div className="answer-editor">

                      <label>
                        Correct Answer
                      </label>


                      <select
                        value={
                          question.answer ||
                          ""
                        }
                        onChange={(e) =>
                          updateQuestion(
                            questionIndex,
                            "answer",
                            e.target.value
                          )
                        }
                      >

                        <option value="">
                          Select correct answer
                        </option>


                        {options.map(
                          (
                            option,
                            optionIndex
                          ) => (

                            <option
                              key={`${questionIndex}-answer-${optionIndex}`}
                              value={
                                option
                              }
                            >
                              {String.fromCharCode(
                                65 +
                                  optionIndex
                              )}
                              {" — "}
                              {option ||
                                `Option ${String.fromCharCode(
                                  65 +
                                    optionIndex
                                )}`}
                            </option>

                          )
                        )}

                      </select>

                    </div>

                  </div>
                );
              }
            )}

          </div>

        </div>


        {/* =================================================
            FOOTER
        ================================================== */}

        <div className="modal-buttons">

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
            disabled={saving}
            onClick={
              handleSubmit
            }
          >
            {saving
              ? "Saving Changes..."
              : "Save Changes"}
          </button>

        </div>

      </div>

    </div>
  );
}

export default ExamsModal;