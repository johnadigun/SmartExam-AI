
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../../api/api";
import * as XLSX from "xlsx";
import "./CreateExam.css";

/* ==========================================================
   SMARTEXAM CBT SYSTEM
   CREATE EXAM PAGE
   Manual | Upload | AI
========================================================== */

const SUBJECTS = [
  "Accounting",
  "Agricultural Science",
  "Biology",
  "Chemistry",
  "Christian Religious Studies",
  "Commerce",
  "Economics",
  "English",
  "Geography",
  "Government",
  "History",
  "Islamic Religious Studies",
  "Literature in English",
  "Mathematics",
  "Physics",
];

const CATEGORIES = [
  "Science",
  "Arts",
  "Social Science",
  "Commercial",
];

const DIFFICULTIES = [
  "Easy",
  "Medium",
  "Hard",
  "Mixed",
];

const QUESTION_TYPES = [
  "Standard Curriculum",
  "Current / Recent",
  "Mixed",
];

const EMPTY_QUESTION = {
  question: "",
  optionA: "",
  optionB: "",
  optionC: "",
  optionD: "",
  answer: "",
};

const DRAFT_KEY = "smartexam_create_exam_draft";

/* ==========================================================
   MAIN COMPONENT
========================================================== */

export default function CreateExam() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  /* ========================================================
     EXAM INFORMATION
  ======================================================== */

  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("");
  const [duration, setDuration] = useState(60);

  /* ========================================================
     QUESTIONS
  ======================================================== */

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState({
    ...EMPTY_QUESTION,
  });

  /* ========================================================
     CREATION METHOD
  ======================================================== */

  const [creationMethod, setCreationMethod] = useState("manual");

  /* ========================================================
     LOADING STATES
  ======================================================== */

  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);

  /* ========================================================
     DRAFT
  ======================================================== */

  const [draftSaved, setDraftSaved] = useState(false);
  const [restoredDraft, setRestoredDraft] = useState(false);

  /* ========================================================
     AI
  ======================================================== */

  const [aiTopic, setAiTopic] = useState("");
  const [aiNumber, setAiNumber] = useState(10);
  const [aiDifficulty, setAiDifficulty] = useState("Medium");
  const [aiQuestionType, setAiQuestionType] = useState(
    "Standard Curriculum"
  );

  /* ========================================================
     MESSAGES
  ======================================================== */

  const [uploadMessage, setUploadMessage] = useState("");
  const [aiMessage, setAiMessage] = useState("");

  /* ========================================================
     RESTORE DRAFT
  ======================================================== */

  useEffect(() => {
    try {
      const savedDraft = localStorage.getItem(DRAFT_KEY);

      if (!savedDraft) {
        return;
      }

      const parsed = JSON.parse(savedDraft);

      if (!parsed || typeof parsed !== "object") {
        return;
      }

      if (parsed.title !== undefined) {
        setTitle(parsed.title || "");
      }

      if (parsed.subject !== undefined) {
        setSubject(parsed.subject || "");
      }

      if (parsed.category !== undefined) {
        setCategory(parsed.category || "");
      }

      if (parsed.duration !== undefined) {
        setDuration(parsed.duration || 60);
      }

      if (Array.isArray(parsed.questions)) {
        setQuestions(parsed.questions);
      }

      if (parsed.currentIndex !== undefined) {
        setCurrentIndex(parsed.currentIndex || 0);
      }

      if (parsed.currentQuestion) {
        setCurrentQuestion({
          ...EMPTY_QUESTION,
          ...parsed.currentQuestion,
        });
      }

      if (parsed.creationMethod) {
        setCreationMethod(parsed.creationMethod);
      }

      if (parsed.aiTopic !== undefined) {
        setAiTopic(parsed.aiTopic || "");
      }

      if (parsed.aiNumber !== undefined) {
        const restoredNumber = Number(parsed.aiNumber);

        setAiNumber(
          Number.isInteger(restoredNumber) &&
            restoredNumber >= 1 &&
            restoredNumber <= 50
            ? restoredNumber
            : 10
        );
      }

      if (parsed.aiDifficulty) {
        setAiDifficulty(parsed.aiDifficulty);
      }

      if (parsed.aiQuestionType) {
        setAiQuestionType(parsed.aiQuestionType);
      }

      setRestoredDraft(true);
    } catch (error) {
      console.error(
        "Unable to restore Create Exam draft:",
        error
      );
    }
  }, []);

  /* ========================================================
     CURRENT QUESTION HELPERS
  ======================================================== */

  const hasCurrentQuestionContent = useMemo(() => {
    return Object.values(currentQuestion).some(
      (value) => String(value || "").trim() !== ""
    );
  }, [currentQuestion]);

  const isEditingExistingQuestion =
    currentIndex < questions.length;

  /* ========================================================
     UPDATE QUESTION
  ======================================================== */

  const updateQuestionField = (field, value) => {
    setCurrentQuestion((previous) => ({
      ...previous,
      [field]: value,
    }));

    setDraftSaved(false);
  };

  /* ========================================================
     CONVERT QUESTION TO EDITOR FORMAT
  ======================================================== */

  const questionToEditor = (question) => ({
    question: question?.question || "",
    optionA: question?.optionA || "",
    optionB: question?.optionB || "",
    optionC: question?.optionC || "",
    optionD: question?.optionD || "",
    answer: question?.answer || "",
  });

  /* ========================================================
     CONVERT QUESTION FOR BACKEND
  ======================================================== */

  const convertQuestionForBackend = (question) => ({
    question: String(question.question || "").trim(),
    optionA: String(question.optionA || "").trim(),
    optionB: String(question.optionB || "").trim(),
    optionC: String(question.optionC || "").trim(),
    optionD: String(question.optionD || "").trim(),
    answer: String(question.answer || "").trim(),
  });

  /* ========================================================
     VALIDATE EXAM INFORMATION
  ======================================================== */

  const validateExamInformation = () => {
    if (!title.trim()) {
      alert("Please enter the examination title.");
      return false;
    }

    if (!subject) {
      alert("Please select a subject.");
      return false;
    }

    if (!category) {
      alert("Please select an examination category.");
      return false;
    }

    if (!duration || Number(duration) <= 0) {
      alert("Please enter a valid examination duration.");
      return false;
    }

    return true;
  };

  /* ========================================================
     VALIDATE CURRENT QUESTION
  ======================================================== */

  const validateCurrentQuestion = () => {
    if (!currentQuestion.question.trim()) {
      alert("Please enter the question.");
      return false;
    }

    if (!currentQuestion.optionA.trim()) {
      alert("Please enter Option A.");
      return false;
    }

    if (!currentQuestion.optionB.trim()) {
      alert("Please enter Option B.");
      return false;
    }

    if (!currentQuestion.optionC.trim()) {
      alert("Please enter Option C.");
      return false;
    }

    if (!currentQuestion.optionD.trim()) {
      alert("Please enter Option D.");
      return false;
    }

    const options = [
      currentQuestion.optionA.trim(),
      currentQuestion.optionB.trim(),
      currentQuestion.optionC.trim(),
      currentQuestion.optionD.trim(),
    ];

    const uniqueOptions = new Set(
      options.map((option) => option.toLowerCase())
    );

    if (uniqueOptions.size !== 4) {
      alert("All four answer options must be different.");
      return false;
    }

    if (!currentQuestion.answer) {
      alert("Please select the correct answer.");
      return false;
    }

    if (!options.includes(currentQuestion.answer.trim())) {
      alert(
        "The selected correct answer must match one of the four options."
      );
      return false;
    }

    return true;
  };

  /* ========================================================
     SAVE QUESTION & NEXT
  ======================================================== */

  const handleSaveAndNext = () => {
    if (!validateExamInformation()) {
      return;
    }

    if (!validateCurrentQuestion()) {
      return;
    }

    const preparedQuestion =
      convertQuestionForBackend(currentQuestion);

    setQuestions((previousQuestions) => {
      const updatedQuestions = [...previousQuestions];

      if (currentIndex < updatedQuestions.length) {
        updatedQuestions[currentIndex] = preparedQuestion;
      } else {
        updatedQuestions.push(preparedQuestion);
      }

      return updatedQuestions;
    });

    setCurrentIndex((previousIndex) => previousIndex + 1);

    setCurrentQuestion({
      ...EMPTY_QUESTION,
    });

    setDraftSaved(false);
  };

  /* ========================================================
     PREVIOUS QUESTION
  ======================================================== */

  const handlePrevious = () => {
    if (currentIndex <= 0) {
      alert("You are already on the first question.");
      return;
    }

    if (
      hasCurrentQuestionContent &&
      !isEditingExistingQuestion
    ) {
      const proceed = window.confirm(
        "The current question has unsaved information. Go to the previous question and discard it?"
      );

      if (!proceed) {
        return;
      }
    }

    const previousIndex = currentIndex - 1;

    setCurrentIndex(previousIndex);

    if (questions[previousIndex]) {
      setCurrentQuestion(
        questionToEditor(questions[previousIndex])
      );
    } else {
      setCurrentQuestion({
        ...EMPTY_QUESTION,
      });
    }

    setDraftSaved(false);
  };

  /* ========================================================
     EDIT SAVED QUESTION
  ======================================================== */

  const handleEditQuestion = (index) => {
    if (!questions[index]) {
      return;
    }

    setCurrentIndex(index);

    setCurrentQuestion(
      questionToEditor(questions[index])
    );

    setCreationMethod("manual");
    setDraftSaved(false);
  };

  /* ========================================================
     REMOVE QUESTION
  ======================================================== */

  const handleRemoveQuestion = (index) => {
    const proceed = window.confirm(
      `Remove question ${index + 1}?`
    );

    if (!proceed) {
      return;
    }

    setQuestions((previousQuestions) =>
      previousQuestions.filter(
        (_, questionIndex) => questionIndex !== index
      )
    );

    if (index === currentIndex) {
      setCurrentQuestion({
        ...EMPTY_QUESTION,
      });
    }

    if (currentIndex > index) {
      setCurrentIndex(
        (previousIndex) => previousIndex - 1
      );
    }

    setDraftSaved(false);
  };

  /* ========================================================
     FILE UPLOAD
  ======================================================== */

  const handleUploadQuestions = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setUploadMessage("");
    setUploadLoading(true);

    try {
      const fileName = file.name.toLowerCase();
      let importedQuestions = [];

      if (fileName.endsWith(".json")) {
        const text = await file.text();
        const parsed = JSON.parse(text);

        const source = Array.isArray(parsed)
          ? parsed
          : Array.isArray(parsed.questions)
          ? parsed.questions
          : [];

        importedQuestions = source;
      } else {
        const arrayBuffer = await file.arrayBuffer();

        const workbook = XLSX.read(arrayBuffer, {
          type: "array",
        });

        const firstSheetName =
          workbook.SheetNames[0];

        if (!firstSheetName) {
          throw new Error(
            "The uploaded workbook does not contain a worksheet."
          );
        }

        const worksheet =
          workbook.Sheets[firstSheetName];

        const rows = XLSX.utils.sheet_to_json(
          worksheet,
          {
            defval: "",
          }
        );

        importedQuestions = rows;
      }

      const normalizedQuestions = importedQuestions
        .map((row) => {
          const getValue = (...keys) => {
            for (const key of keys) {
              if (
                row[key] !== undefined &&
                row[key] !== null &&
                String(row[key]).trim() !== ""
              ) {
                return String(row[key]).trim();
              }
            }

            return "";
          };

          return {
            question: getValue(
              "Question",
              "question",
              "QUESTION"
            ),

            optionA: getValue(
              "Option A",
              "optionA",
              "A",
              "OPTION A"
            ),

            optionB: getValue(
              "Option B",
              "optionB",
              "B",
              "OPTION B"
            ),

            optionC: getValue(
              "Option C",
              "optionC",
              "C",
              "OPTION C"
            ),

            optionD: getValue(
              "Option D",
              "optionD",
              "D",
              "OPTION D"
            ),

            answer: getValue(
              "Answer",
              "answer",
              "ANSWER",
              "Correct Answer",
              "correctAnswer"
            ),
          };
        })
        .filter(
          (question) =>
            question.question &&
            question.optionA &&
            question.optionB &&
            question.optionC &&
            question.optionD &&
            question.answer
        )
        .map(convertQuestionForBackend);

      if (!normalizedQuestions.length) {
        throw new Error(
          "No valid questions were found. Ensure your file contains Question, Option A, Option B, Option C, Option D and Answer."
        );
      }

      setQuestions((previousQuestions) => [
        ...previousQuestions,
        ...normalizedQuestions,
      ]);

      setCurrentIndex(
        (previousIndex) =>
          previousIndex + normalizedQuestions.length
      );

      setCurrentQuestion({
        ...EMPTY_QUESTION,
      });

      setUploadMessage(
        `${normalizedQuestions.length} question${
          normalizedQuestions.length === 1
            ? ""
            : "s"
        } imported successfully.`
      );

      setDraftSaved(false);
    } catch (error) {
      console.error(
        "Question upload error:",
        error
      );

      setUploadMessage(
        error?.message ||
          "Unable to import the questions."
      );
    } finally {
      setUploadLoading(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  /* ========================================================
     GENERATE AI QUESTIONS
  ======================================================== */

  const handleGenerateAIQuestions = async () => {
    if (!validateExamInformation()) {
      return;
    }

    if (!aiTopic.trim()) {
      alert(
        "Please enter a topic for AI question generation."
      );
      return;
    }

    const requestedNumber = Number(aiNumber);

    if (
      !Number.isInteger(requestedNumber) ||
      requestedNumber < 1 ||
      requestedNumber > 50
    ) {
      alert(
        "Please enter a valid number of AI questions between 1 and 50."
      );
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      alert(
        "Your login session could not be found. Please log in again."
      );
      return;
    }

    setAiLoading(true);
    setAiMessage("");

    try {
      const response = await fetch(
        `${BASE_URL}/ai/generate-questions`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            subject,
            category,
            topic: aiTopic.trim(),

            /* IMPORTANT:
               These names must match
               aiQuestionController.js
            */
            numberOfQuestions: requestedNumber,
            difficulty: aiDifficulty,
            questionType: aiQuestionType,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "The AI question generation request failed."
        );
      }

      const generated =
        Array.isArray(data?.questions)
          ? data.questions
          : Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data)
          ? data
          : [];

      if (!generated.length) {
        throw new Error(
          "The AI service did not return any questions."
        );
      }

      const normalizedQuestions = generated
        .map((question) => ({
          question:
            question.question ||
            question.Question ||
            "",

          optionA:
            question.optionA ||
            question["Option A"] ||
            question.A ||
            "",

          optionB:
            question.optionB ||
            question["Option B"] ||
            question.B ||
            "",

          optionC:
            question.optionC ||
            question["Option C"] ||
            question.C ||
            "",

          optionD:
            question.optionD ||
            question["Option D"] ||
            question.D ||
            "",

          answer:
            question.answer ||
            question.Answer ||
            question.correctAnswer ||
            "",
        }))
        .map(convertQuestionForBackend)
        .filter(
          (question) =>
            question.question &&
            question.optionA &&
            question.optionB &&
            question.optionC &&
            question.optionD &&
            question.answer
        );

      if (!normalizedQuestions.length) {
        throw new Error(
          "The AI response did not contain usable multiple-choice questions."
        );
      }

      setQuestions((previousQuestions) => [
        ...previousQuestions,
        ...normalizedQuestions,
      ]);

      setCurrentIndex(
        (previousIndex) =>
          previousIndex + normalizedQuestions.length
      );

      setCurrentQuestion({
        ...EMPTY_QUESTION,
      });

      setAiMessage(
        `${normalizedQuestions.length} AI-generated question${
          normalizedQuestions.length === 1
            ? ""
            : "s"
        } added successfully.`
      );

      setDraftSaved(false);
    } catch (error) {
      console.error(
        "AI question generation error:",
        error
      );

      setAiMessage(
        error?.message ||
          "Unable to generate AI questions."
      );
    } finally {
      setAiLoading(false);
    }
  };

  /* ========================================================
     SAVE DRAFT
  ======================================================== */

  const handleSaveDraft = () => {
    try {
      const draft = {
        title,
        subject,
        category,
        duration,
        questions,
        currentIndex,
        currentQuestion,
        creationMethod,
        aiTopic,
        aiNumber,
        aiDifficulty,
        aiQuestionType,
        savedAt: new Date().toISOString(),
      };

      localStorage.setItem(
        DRAFT_KEY,
        JSON.stringify(draft)
      );

      setDraftSaved(true);
      setRestoredDraft(false);
    } catch (error) {
      console.error(
        "Unable to save draft:",
        error
      );

      alert("Unable to save the draft.");
    }
  };

  /* ========================================================
     CLEAR DRAFT
  ======================================================== */

  const handleClearDraft = () => {
    const proceed = window.confirm(
      "Clear the saved draft? This will remove the locally saved version."
    );

    if (!proceed) {
      return;
    }

    localStorage.removeItem(DRAFT_KEY);

    setDraftSaved(false);
    setRestoredDraft(false);
  };

  /* ========================================================
     SUBMIT EXAM
  ======================================================== */

  const handleSubmitExam = async () => {
    if (!validateExamInformation()) {
      return;
    }

    let finalQuestions = [...questions];

    if (hasCurrentQuestionContent) {
      if (!validateCurrentQuestion()) {
        return;
      }

      const preparedQuestion =
        convertQuestionForBackend(
          currentQuestion
        );

      if (currentIndex < finalQuestions.length) {
        finalQuestions[currentIndex] =
          preparedQuestion;
      } else {
        finalQuestions.push(
          preparedQuestion
        );
      }
    }

    if (!finalQuestions.length) {
      alert(
        "Please add at least one question before submitting the examination."
      );
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      alert(
        "Your login session could not be found. Please log in again."
      );
      return;
    }

    const proceed = window.confirm(
      `Submit "${title}" with ${
        finalQuestions.length
      } question${
        finalQuestions.length === 1
          ? ""
          : "s"
      }?`
    );

    if (!proceed) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${BASE_URL}/exams/create`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            title: title.trim(),
            subject,
            category,
            duration: Number(duration),
            questions: finalQuestions,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Unable to create the examination."
        );
      }

      localStorage.removeItem(DRAFT_KEY);

      setDraftSaved(false);

      alert(
        data?.message ||
          "Examination created successfully."
      );

      navigate("/admin/exams");
    } catch (error) {
      console.error(
        "Create exam error:",
        error
      );

      alert(
        error?.message ||
          "Unable to create the examination."
      );
    } finally {
      setLoading(false);
    }
  };

  /* ========================================================
     RETURN TO EXAMS
  ======================================================== */

  const handleReturn = () => {
    const hasUnsavedWork =
      title.trim() ||
      subject ||
      category ||
      questions.length > 0 ||
      hasCurrentQuestionContent;

    if (hasUnsavedWork) {
      const proceed = window.confirm(
        "You have examination information that may not be saved. Return to Exams?"
      );

      if (!proceed) {
        return;
      }
    }

    navigate("/admin/exams");
  };

  /* ========================================================
     DISPLAYED QUESTION NUMBER
  ======================================================== */

  const displayedQuestionNumber =
    currentIndex + 1;

  /* ========================================================
     RENDER
  ======================================================== */

  return (
    <div className="create-exam-page">
      <div className="create-exam-shell">

        {/* ==================================================
            HEADER
        ================================================== */}

        <header className="create-exam-header">
          <div className="create-exam-header-content">
            <div>
              <h1>Create Exam</h1>

              <p>
                Create professional examinations using
                manual entry, uploaded questions or AI.
              </p>
            </div>

            <div className="create-exam-question-count">
              <span>Questions</span>
              <strong>{questions.length}</strong>
            </div>
          </div>
        </header>

        {/* ==================================================
            ACTION BAR
        ================================================== */}

        <div className="create-exam-action-area">

          <div className="action-bar">

            <div className="action-group action-group-left">

              <button
                type="button"
                className="secondary-button"
                onClick={handleReturn}
                disabled={loading}
              >
                Return to Exams
              </button>

              <button
                type="button"
                className="secondary-button"
                onClick={handlePrevious}
                disabled={
                  loading ||
                  currentIndex <= 0
                }
              >
                Previous
              </button>

              <button
                type="button"
                className="save-draft-button"
                onClick={handleSaveDraft}
                disabled={loading}
              >
                Save Draft
              </button>

              <button
                type="button"
                className="clear-draft-button"
                onClick={handleClearDraft}
                disabled={loading}
              >
                Clear Draft
              </button>

            </div>

            <div className="action-group action-group-right">

              {creationMethod === "manual" && (
                <button
                  type="button"
                  className="primary-button next-button"
                  onClick={handleSaveAndNext}
                  disabled={loading}
                >
                  Save Question &amp; Next
                </button>
              )}

              <button
                type="button"
                className="submit-button"
                onClick={handleSubmitExam}
                disabled={loading}
              >
                {loading
                  ? "Submitting..."
                  : "Submit Exam"}
              </button>

            </div>

          </div>

          <div className="action-status-bar">

            <span>
              Question {displayedQuestionNumber}
            </span>

            <span className="status-separator">
              •
            </span>

            <span>
              Saved {questions.length}
            </span>

            <span className="status-message">
              {draftSaved
                ? "Draft saved"
                : "Remember to save your draft regularly"}
            </span>

          </div>

        </div>

        {/* ==================================================
            MAIN CONTENT
        ================================================== */}

        <main className="create-exam-content">

          {/* ==================================================
              RESTORED DRAFT NOTICE
          ================================================== */}

          {restoredDraft && (
            <div className="create-exam-notice notice-info">
              <strong>Draft restored.</strong>

              <span>
                Your previous Create Exam work has been
                restored from this browser.
              </span>
            </div>
          )}

          {/* ==================================================
              EXAMINATION INFORMATION
          ================================================== */}

          <section className="create-exam-section">

            <div className="section-heading">
              <div>
                <h2>Examination Information</h2>

                <p>
                  Enter the basic information for this
                  examination.
                </p>
              </div>
            </div>

            <div className="exam-information-grid">

              <div className="form-group form-group-wide">

                <label htmlFor="exam-title">
                  Examination Title
                </label>

                <input
                  id="exam-title"
                  type="text"
                  value={title}
                  onChange={(event) => {
                    setTitle(event.target.value);
                    setDraftSaved(false);
                  }}
                  placeholder="Enter examination title"
                  className="form-control"
                />

              </div>

              <div className="form-group">

                <label htmlFor="exam-subject">
                  Subject
                </label>

                <select
                  id="exam-subject"
                  value={subject}
                  onChange={(event) => {
                    setSubject(event.target.value);
                    setDraftSaved(false);
                  }}
                  className="form-control"
                >
                  <option value="">
                    Select subject
                  </option>

                  {SUBJECTS.map((item) => (
                    <option
                      key={item}
                      value={item}
                    >
                      {item}
                    </option>
                  ))}
                </select>

              </div>

              <div className="form-group">

                <label htmlFor="exam-category">
                  Category
                </label>

                <select
                  id="exam-category"
                  value={category}
                  onChange={(event) => {
                    setCategory(event.target.value);
                    setDraftSaved(false);
                  }}
                  className="form-control"
                >
                  <option value="">
                    Select category
                  </option>

                  {CATEGORIES.map((item) => (
                    <option
                      key={item}
                      value={item}
                    >
                      {item}
                    </option>
                  ))}
                </select>

              </div>

              <div className="form-group">

                <label htmlFor="exam-duration">
                  Duration (Minutes)
                </label>

                <input
                  id="exam-duration"
                  type="number"
                  min="1"
                  value={duration}
                  onChange={(event) => {
                    setDuration(event.target.value);
                    setDraftSaved(false);
                  }}
                  className="form-control"
                />

              </div>

            </div>

          </section>

          {/* ==================================================
              CREATION METHOD
          ================================================== */}

          <section className="create-exam-section">

            <div className="section-heading">
              <div>

                <h2>Creation Method</h2>

                <p>
                  Choose how you want to add questions.
                </p>

              </div>
            </div>

            <div className="creation-method-buttons">

              <button
                type="button"
                className={`method-button ${
                  creationMethod === "manual"
                    ? "active"
                    : ""
                }`}
                onClick={() => {
                  setCreationMethod("manual");
                  setUploadMessage("");
                  setAiMessage("");
                }}
              >
                <span className="method-button-title">
                  Write Manually
                </span>

                <span className="method-button-description">
                  Enter questions one by one
                </span>
              </button>

              <button
                type="button"
                className={`method-button ${
                  creationMethod === "upload"
                    ? "active"
                    : ""
                }`}
                onClick={() => {
                  setCreationMethod("upload");
                  setUploadMessage("");
                  setAiMessage("");
                }}
              >
                <span className="method-button-title">
                  Upload Questions
                </span>

                <span className="method-button-description">
                  Import Excel, CSV or JSON
                </span>
              </button>

              <button
                type="button"
                className={`method-button ${
                  creationMethod === "ai"
                    ? "active"
                    : ""
                }`}
                onClick={() => {
                  setCreationMethod("ai");
                  setUploadMessage("");
                  setAiMessage("");
                }}
              >
                <span className="method-button-title">
                  Generate with AI
                </span>

                <span className="method-button-description">
                  Generate questions automatically
                </span>
              </button>

            </div>

          </section>

          {/* ==================================================
              UPLOAD PANEL
          ================================================== */}

          {creationMethod === "upload" && (
            <section className="create-exam-section method-panel">

              <div className="method-panel-header">

                <div>

                  <h2>Upload Questions</h2>

                  <p>
                    Upload an Excel, CSV or JSON file
                    containing your questions.
                  </p>

                </div>

              </div>

              <div className="upload-area">

                <div className="upload-instructions">

                  <strong>
                    Supported columns
                  </strong>

                  <span>
                    Question, Option A, Option B,
                    Option C, Option D and Answer
                  </span>

                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls,.csv,.json"
                  onChange={handleUploadQuestions}
                  disabled={uploadLoading}
                  className="file-input"
                />

                {uploadLoading && (
                  <div className="inline-status">
                    Importing questions...
                  </div>
                )}

                {uploadMessage && (
                  <div
                    className={`inline-status ${
                      uploadMessage
                        .toLowerCase()
                        .includes("successfully")
                        ? "success"
                        : "error"
                    }`}
                  >
                    {uploadMessage}
                  </div>
                )}

              </div>

            </section>
          )}

          {/* ==================================================
              AI PANEL
          ================================================== */}

          {creationMethod === "ai" && (
            <section className="create-exam-section method-panel">

              <div className="method-panel-header">

                <div>

                  <h2>
                    Generate Questions with AI
                  </h2>

                  <p>
                    Provide the topic and question
                    requirements.
                  </p>

                </div>

              </div>

              <div className="ai-form-grid">

                <div className="form-group ai-topic-field">

                  <label htmlFor="ai-topic">
                    Topic
                  </label>

                  <input
                    id="ai-topic"
                    type="text"
                    value={aiTopic}
                    onChange={(event) =>
                      setAiTopic(
                        event.target.value
                      )
                    }
                    placeholder="Example: Quadratic Equations"
                    className="form-control"
                  />

                </div>

                <div className="form-group">

                  <label htmlFor="ai-number">
                    Number of Questions
                  </label>

                  <input
                    id="ai-number"
                    type="number"
                    min="1"
                    max="50"
                    value={aiNumber}
                    onChange={(event) =>
                      setAiNumber(
                        event.target.value
                      )
                    }
                    className="form-control"
                  />

                </div>

                <div className="form-group">

                  <label htmlFor="ai-difficulty">
                    Difficulty
                  </label>

                  <select
                    id="ai-difficulty"
                    value={aiDifficulty}
                    onChange={(event) =>
                      setAiDifficulty(
                        event.target.value
                      )
                    }
                    className="form-control"
                  >
                    {DIFFICULTIES.map((item) => (
                      <option
                        key={item}
                        value={item}
                      >
                        {item}
                      </option>
                    ))}
                  </select>

                </div>

                <div className="form-group">

                  <label htmlFor="ai-type">
                    Question Type
                  </label>

                  <select
                    id="ai-type"
                    value={aiQuestionType}
                    onChange={(event) =>
                      setAiQuestionType(
                        event.target.value
                      )
                    }
                    className="form-control"
                  >
                    {QUESTION_TYPES.map((item) => (
                      <option
                        key={item}
                        value={item}
                      >
                        {item}
                      </option>
                    ))}
                  </select>

                </div>

              </div>

              <div className="ai-action-row">

                <button
                  type="button"
                  className="primary-button"
                  onClick={
                    handleGenerateAIQuestions
                  }
                  disabled={aiLoading}
                >
                  {aiLoading
                    ? "Generating..."
                    : "Generate Questions"}
                </button>

              </div>

              {aiMessage && (
                <div
                  className={`inline-status ${
                    aiMessage
                      .toLowerCase()
                      .includes("successfully")
                      ? "success"
                      : "error"
                  }`}
                >
                  {aiMessage}
                </div>
              )}

            </section>
          )}

          {/* ==================================================
              MANUAL QUESTION EDITOR
          ================================================== */}

          {creationMethod === "manual" && (
            <section className="create-exam-section question-editor-section">

              <div className="question-editor-header">

                <div>

                  <div className="question-title-row">

                    <h2>
                      Question {displayedQuestionNumber}
                    </h2>

                    {isEditingExistingQuestion && (
                      <span className="question-status-badge">
                        Editing
                      </span>
                    )}

                  </div>

                  <p>
                    Enter the question and four answer
                    options.
                  </p>

                </div>

                <div className="question-progress">
                  Saved: {questions.length}
                </div>

              </div>

              <div className="form-group">

                <label htmlFor="question-text">
                  Question
                </label>

                <textarea
                  id="question-text"
                  value={currentQuestion.question}
                  onChange={(event) =>
                    updateQuestionField(
                      "question",
                      event.target.value
                    )
                  }
                  placeholder="Enter the examination question..."
                  className="form-control question-textarea"
                  rows="5"
                />

              </div>

              <div className="options-grid">

                <div className="form-group">

                  <label htmlFor="option-a">
                    Option A
                  </label>

                  <textarea
                    id="option-a"
                    value={currentQuestion.optionA}
                    onChange={(event) =>
                      updateQuestionField(
                        "optionA",
                        event.target.value
                      )
                    }
                    placeholder="Enter option A"
                    className="form-control option-textarea"
                    rows="3"
                  />

                </div>

                <div className="form-group">

                  <label htmlFor="option-b">
                    Option B
                  </label>

                  <textarea
                    id="option-b"
                    value={currentQuestion.optionB}
                    onChange={(event) =>
                      updateQuestionField(
                        "optionB",
                        event.target.value
                      )
                    }
                    placeholder="Enter option B"
                    className="form-control option-textarea"
                    rows="3"
                  />

                </div>

                <div className="form-group">

                  <label htmlFor="option-c">
                    Option C
                  </label>

                  <textarea
                    id="option-c"
                    value={currentQuestion.optionC}
                    onChange={(event) =>
                      updateQuestionField(
                        "optionC",
                        event.target.value
                      )
                    }
                    placeholder="Enter option C"
                    className="form-control option-textarea"
                    rows="3"
                  />

                </div>

                <div className="form-group">

                  <label htmlFor="option-d">
                    Option D
                  </label>

                  <textarea
                    id="option-d"
                    value={currentQuestion.optionD}
                    onChange={(event) =>
                      updateQuestionField(
                        "optionD",
                        event.target.value
                      )
                    }
                    placeholder="Enter option D"
                    className="form-control option-textarea"
                    rows="3"
                  />

                </div>

              </div>

              <div className="correct-answer-area">

                <div className="form-group">

                  <label htmlFor="correct-answer">
                    Correct Answer
                  </label>

                  <select
                    id="correct-answer"
                    value={currentQuestion.answer}
                    onChange={(event) =>
                      updateQuestionField(
                        "answer",
                        event.target.value
                      )
                    }
                    className="form-control correct-answer-select"
                  >
                    <option value="">
                      Select the correct answer
                    </option>

                    {[
                      currentQuestion.optionA,
                      currentQuestion.optionB,
                      currentQuestion.optionC,
                      currentQuestion.optionD,
                    ]
                      .filter(
                        (option) =>
                          String(option || "").trim()
                      )
                      .map((option, index) => (
                        <option
                          key={`${index}-${option}`}
                          value={option}
                        >
                          {String.fromCharCode(
                            65 + index
                          )}
                          {" - "}
                          {option}
                        </option>
                      ))}

                  </select>

                </div>

              </div>

            </section>
          )}

          {/* ==================================================
              QUESTIONS ADDED
          ================================================== */}

          {questions.length > 0 && (
            <section className="create-exam-section questions-added-section">

              <div className="section-heading">

                <div>

                  <h2>Questions Added</h2>

                  <p>
                    Review, edit or remove questions before
                    submitting the examination.
                  </p>

                </div>

                <div className="questions-total">
                  {questions.length}{" "}
                  {questions.length === 1
                    ? "Question"
                    : "Questions"}
                </div>

              </div>

              <div className="question-list">

                {questions.map(
                  (question, index) => (
                    <div
                      className="question-list-item"
                      key={`question-${index}`}
                    >

                      <div className="question-list-number">
                        {index + 1}
                      </div>

                      <div className="question-list-content">

                        <div className="question-list-text">
                          {question.question}
                        </div>

                        <div className="question-list-answer">
                          Correct answer:{" "}
                          <strong>
                            {question.answer}
                          </strong>
                        </div>

                      </div>

                      <div className="question-list-actions">

                        <button
                          type="button"
                          className="small-button edit-button"
                          onClick={() =>
                            handleEditQuestion(index)
                          }
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="small-button remove-button"
                          onClick={() =>
                            handleRemoveQuestion(index)
                          }
                        >
                          Remove
                        </button>

                      </div>

                    </div>
                  )
                )}

              </div>

            </section>
          )}

        </main>

      </div>
    </div>
  );
}

