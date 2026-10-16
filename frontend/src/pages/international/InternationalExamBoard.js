
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import BASE_URL from "../../api/api";

const styles = {
  page: {
    minHeight: "100vh",
    padding: "24px",
    background: "#f5f7fb",
    color: "#1f2937",
    fontFamily: "Arial, sans-serif",
  },
  container: {
    maxWidth: "1000px",
    margin: "0 auto",
  },
  card: {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "24px",
    marginBottom: "20px",
  },
  heading: {
    marginTop: 0,
    marginBottom: "12px",
  },
  muted: {
    color: "#64748b",
    lineHeight: 1.6,
  },
  button: {
    padding: "12px 18px",
    border: "none",
    borderRadius: "7px",
    background: "#1d4ed8",
    color: "#ffffff",
    fontWeight: 600,
    cursor: "pointer",
  },
  secondaryButton: {
    padding: "11px 16px",
    border: "1px solid #cbd5e1",
    borderRadius: "7px",
    background: "#ffffff",
    color: "#1f2937",
    cursor: "pointer",
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px",
    border: "1px solid #cbd5e1",
    borderRadius: "7px",
    fontSize: "15px",
  },
  question: {
    padding: "20px",
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    marginBottom: "16px",
    background: "#ffffff",
  },
  option: {
    display: "flex",
    alignItems: "flex-start",
    gap: "10px",
    padding: "12px",
    marginTop: "8px",
    border: "1px solid #e5e7eb",
    borderRadius: "7px",
    cursor: "pointer",
  },
  error: {
    color: "#b91c1c",
    background: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: "7px",
    padding: "12px",
    lineHeight: 1.6,
  },
  success: {
    color: "#166534",
    background: "#f0fdf4",
    border: "1px solid #bbf7d0",
    borderRadius: "7px",
    padding: "12px",
    lineHeight: 1.6,
  },
};

function getToken() {
  return localStorage.getItem("internationalToken");
}

async function apiRequest(path, options = {}) {
  const token = getToken();

  if (!token) {
    throw new Error(
      "Your login session has expired. Please sign in again."
    );
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });

  const text = await response.text();

  let data = {};

  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    throw new Error(
      "The server returned an invalid response."
    );
  }

  if (!response.ok || data.success === false) {
    throw new Error(
      data.message ||
        `The request failed with status ${response.status}.`
    );
  }

  return data;
}

function getErrorMessage(error) {
  return error?.message || "An unexpected error occurred.";
}

function formatTime(seconds) {
  const safeSeconds = Math.max(0, Number(seconds) || 0);

  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const remainingSeconds = safeSeconds % 60;

  if (hours > 0) {
    return [
      hours,
      String(minutes).padStart(2, "0"),
      String(remainingSeconds).padStart(2, "0"),
    ].join(":");
  }

  return [
    String(minutes).padStart(2, "0"),
    String(remainingSeconds).padStart(2, "0"),
  ].join(":");
}

function getOptionLabel(option, index) {
  if (typeof option === "string" || typeof option === "number") {
    return String(option);
  }

  if (!option || typeof option !== "object") {
    return `Option ${index + 1}`;
  }

  return (
    option.label ||
    option.text ||
    option.value ||
    option.option ||
    `Option ${index + 1}`
  );
}

function InternationalExamBoard() {
  const navigate = useNavigate();
  const { examCode } = useParams();

  const normalizedExamCode = decodeURIComponent(
    examCode || ""
  ).trim().toUpperCase();

  const [examination, setExamination] = useState(null);
  const [selectedModuleCode, setSelectedModuleCode] =
    useState("");

  const [attempt, setAttempt] = useState(null);
  const [section, setSection] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});

  const [result, setResult] = useState(null);
  const [remainingSeconds, setRemainingSeconds] = useState(null);

  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [finishingSection, setFinishingSection] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const submittingRef = useRef(false);
  const sectionLoadingRef = useRef(false);
  const timerExpiredRef = useRef(false);

  /* ======================================================
     LOAD EXAMINATION DETAILS
  ====================================================== */

  useEffect(() => {
    let cancelled = false;

    async function loadExamination() {
      try {
        setLoading(true);
        setError("");

        if (!normalizedExamCode) {
          throw new Error("The examination code is missing.");
        }

        const response = await fetch(
          `${BASE_URL}/international/exams/${encodeURIComponent(
            normalizedExamCode
          )}`,
          {
            headers: {
              Accept: "application/json",
            },
          }
        );

        const data = await response.json();

        if (!response.ok || data.success === false) {
          throw new Error(
            data.message ||
              "Unable to load this examination."
          );
        }

        const details =
          data.exam ||
          data.examination ||
          data.data?.exam ||
          data.data?.examination ||
          data.data ||
          data;

        if (!details || typeof details !== "object") {
          throw new Error(
            "The examination information is invalid."
          );
        }

        const modules = Array.isArray(details.modules)
          ? details.modules.filter(
              (item) => item && typeof item === "object"
            )
          : [];

        if (!cancelled) {
          setExamination(details);

          const firstActiveModule = modules.find(
            (item) => item.active !== false
          );

          setSelectedModuleCode(
            firstActiveModule?.code || ""
          );
        }
      } catch (err) {
        if (!cancelled) {
          setError(getErrorMessage(err));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadExamination();

    return () => {
      cancelled = true;
    };
  }, [normalizedExamCode]);

  /* ======================================================
     LOAD AN ATTEMPT SECTION
  ====================================================== */

  const loadSection = useCallback(
    async (attemptId, sectionCode) => {
      if (sectionLoadingRef.current) return;

      sectionLoadingRef.current = true;
      timerExpiredRef.current = false;

      try {
        setLoading(true);
        setError("");
        setNotice("");

        const data = await apiRequest(
          `/international/attempts/${encodeURIComponent(
            attemptId
          )}/section/${encodeURIComponent(sectionCode)}`
        );

        if (!data.attempt || !data.section) {
          throw new Error(
            "The examination section response is incomplete."
          );
        }

        setAttempt(data.attempt);
        setSection(data.section);

        const loadedQuestions = Array.isArray(data.questions)
          ? data.questions
          : [];

        setQuestions(loadedQuestions);

        setAnswers((previous) => {
          const next = { ...previous };

          for (const question of loadedQuestions) {
            if (
              !Object.prototype.hasOwnProperty.call(
                next,
                question._id
              )
            ) {
              next[question._id] =
                question.candidateAnswer ?? null;
            }
          }

          return next;
        });
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
        sectionLoadingRef.current = false;
      }
    },
    []
  );

  /* ======================================================
     START OR RESUME ATTEMPT
  ====================================================== */

  const startAttempt = async () => {
    try {
      setStarting(true);
      setError("");
      setNotice("");

      if (!selectedModuleCode) {
        throw new Error(
          "Please select an available examination module."
        );
      }

      const data = await apiRequest(
        "/international/attempts/start",
        {
          method: "POST",
          body: JSON.stringify({
            examCode: normalizedExamCode,
            moduleCode: selectedModuleCode,
          }),
        }
      );

      if (!data.attempt?._id) {
        throw new Error(
          "The server did not return a valid examination attempt."
        );
      }

      const startedAttempt = data.attempt;

      setAttempt(startedAttempt);
      setResult(null);
      setAnswers({});

      const activeSection =
        startedAttempt.sections?.find(
          (item) => item.status === "IN_PROGRESS"
        ) ||
        startedAttempt.sections?.find(
          (item) => item.status === "NOT_STARTED"
        );

      if (!activeSection?.sectionCode) {
        throw new Error(
          "No available section was returned for this attempt."
        );
      }

      await loadSection(
        startedAttempt._id,
        activeSection.sectionCode
      );
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setStarting(false);
    }
  };

  /* ======================================================
     SAVE ANSWER
  ====================================================== */

  const saveAnswer = async (questionId, answer) => {
    if (!attempt?._id || !section?.sectionCode) {
      return false;
    }

    try {
      setSaving(true);
      setError("");

      await apiRequest(
        `/international/attempts/${encodeURIComponent(
          attempt._id
        )}/answers`,
        {
          method: "PUT",
          body: JSON.stringify({
            questionId,
            answer,
          }),
        }
      );

      return true;
    } catch (err) {
      setError(
        `Your answer could not be saved: ${getErrorMessage(err)}`
      );

      return false;
    } finally {
      setSaving(false);
    }
  };

  const changeAnswer = (questionId, answer) => {
    setAnswers((previous) => ({
      ...previous,
      [questionId]: answer,
    }));

    saveAnswer(questionId, answer);
  };

  /* ======================================================
     SUBMIT ATTEMPT
  ====================================================== */

  const submitAttempt = useCallback(async () => {
    if (!attempt?._id || submittingRef.current) {
      return;
    }

    submittingRef.current = true;

    try {
      setSubmitting(true);
      setError("");
      setNotice("Submitting your examination...");

      const data = await apiRequest(
        `/international/attempts/${encodeURIComponent(
          attempt._id
        )}/submit`,
        {
          method: "POST",
          body: JSON.stringify({}),
        }
      );

      let finalResult = data.result || null;

      if (!finalResult) {
        const resultData = await apiRequest(
          `/international/attempts/${encodeURIComponent(
            attempt._id
          )}/result`
        );

        finalResult =
          resultData.result ||
          resultData.report ||
          resultData.data ||
          resultData;
      }

      setResult(finalResult);
      setNotice("");
      setSection(null);
      setQuestions([]);
    } catch (err) {
      setError(getErrorMessage(err));
      setNotice("");
      submittingRef.current = false;
    } finally {
      setSubmitting(false);
    }
  }, [attempt]);

  /* ======================================================
     COMPLETE CURRENT SECTION
  ====================================================== */

  const completeSection = useCallback(async () => {
    if (
      !attempt?._id ||
      !section?.sectionCode ||
      finishingSection ||
      submittingRef.current
    ) {
      return;
    }

    try {
      setFinishingSection(true);
      setError("");
      setNotice("");

      const data = await apiRequest(
        `/international/attempts/${encodeURIComponent(
          attempt._id
        )}/sections/${encodeURIComponent(
          section.sectionCode
        )}/complete`,
        {
          method: "POST",
          body: JSON.stringify({}),
        }
      );

      if (data.attempt) {
        setAttempt(data.attempt);
      }

      if (data.allSectionsCompleted || !data.nextSectionCode) {
        await submitAttempt();
        return;
      }

      await loadSection(
        attempt._id,
        data.nextSectionCode
      );
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setFinishingSection(false);
    }
  }, [
    attempt,
    section,
    finishingSection,
    loadSection,
    submitAttempt,
  ]);

  /* ======================================================
     SECTION TIMER

     The backend remains authoritative for deadlines.
  ====================================================== */

  useEffect(() => {
    if (!section?.deadline) {
      setRemainingSeconds(null);
      return undefined;
    }

    const updateTimer = () => {
      const deadlineTime = new Date(
        section.deadline
      ).getTime();

      const remaining = Math.max(
        0,
        Math.ceil((deadlineTime - Date.now()) / 1000)
      );

      setRemainingSeconds(remaining);

      if (remaining === 0 && !timerExpiredRef.current) {
        timerExpiredRef.current = true;
        completeSection();
      }
    };

    updateTimer();

    const timerId = window.setInterval(
      updateTimer,
      1000
    );

    return () => {
      window.clearInterval(timerId);
    };
  }, [section, completeSection]);

  /* ======================================================
     QUESTION ANSWER CONTROL
  ====================================================== */

  const renderAnswerControl = (question) => {
    const questionId = question._id;
    const questionType = String(
      question.questionType || ""
    ).toUpperCase();

    const value = answers[questionId] ?? null;

    const options = Array.isArray(question.options)
      ? question.options
      : [];

    if (
      questionType.includes("MULTI_SELECT") ||
      questionType.includes("MULTIPLE_SELECT") ||
      questionType.includes("MULTI_CHOICE")
    ) {
      const selectedValues = Array.isArray(value)
        ? value
        : [];

      return (
        <div>
          {options.map((option, index) => {
            const label = getOptionLabel(option, index);
            const optionValue =
              typeof option === "object" && option !== null
                ? option.value ?? option.label ?? option.text
                : option;

            const checked = selectedValues.some(
              (item) => String(item) === String(optionValue)
            );

            return (
              <label
                key={`${questionId}-${index}`}
                style={styles.option}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  disabled={submitting}
                  onChange={(event) => {
                    const next = event.target.checked
                      ? [...selectedValues, optionValue]
                      : selectedValues.filter(
                          (item) =>
                            String(item) !== String(optionValue)
                        );

                    changeAnswer(questionId, next);
                  }}
                />

                <span>{label}</span>
              </label>
            );
          })}
        </div>
      );
    }

    if (options.length > 0) {
      return (
        <div>
          {options.map((option, index) => {
            const label = getOptionLabel(option, index);
            const optionValue =
              typeof option === "object" && option !== null
                ? option.value ?? option.label ?? option.text
                : option;

            return (
              <label
                key={`${questionId}-${index}`}
                style={styles.option}
              >
                <input
                  type="radio"
                  name={`question-${questionId}`}
                  value={String(optionValue)}
                  checked={String(value ?? "") === String(optionValue)}
                  disabled={submitting}
                  onChange={() =>
                    changeAnswer(questionId, optionValue)
                  }
                />

                <span>{label}</span>
              </label>
            );
          })}
        </div>
      );
    }

    if (
      questionType.includes("NUMERICAL") ||
      questionType.includes("NUMBER")
    ) {
      return (
        <input
          type="number"
          style={styles.input}
          value={value ?? ""}
          disabled={submitting}
          onChange={(event) =>
            changeAnswer(
              questionId,
              event.target.value
            )
          }
        />
      );
    }

    return (
      <textarea
        rows={questionType.includes("ESSAY") ? 8 : 4}
        style={styles.input}
        value={value ?? ""}
        disabled={submitting}
        placeholder="Enter your answer"
        onChange={(event) =>
          changeAnswer(questionId, event.target.value)
        }
      />
    );
  };

  /* ======================================================
     LOADING
  ====================================================== */

  if (loading && !examination && !attempt) {
    return (
      <main style={styles.page}>
        <div style={styles.container}>
          <section style={styles.card}>
            <h1 style={styles.heading}>
              International Examination
            </h1>

            <p style={styles.muted}>
              Loading examination information...
            </p>
          </section>
        </div>
      </main>
    );
  }

  /* ======================================================
     PAGE
  ====================================================== */

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <header style={styles.card}>
          <p
            style={{
              color: "#2563eb",
              fontWeight: 700,
              letterSpacing: "1px",
            }}
          >
            SMARTEXAM INTERNATIONAL
          </p>

          <h1 style={styles.heading}>
            {examination?.name ||
              examination?.fullName ||
              normalizedExamCode ||
              "International Examination"}
          </h1>

          <p style={styles.muted}>
            Examination code: {normalizedExamCode}
          </p>

          <button
            type="button"
            style={styles.secondaryButton}
            onClick={() => navigate("/international")}
          >
            Back to International Examinations
          </button>
        </header>

        {error && (
          <div role="alert" style={styles.error}>
            {error}
          </div>
        )}

        {notice && (
          <div role="status" style={styles.success}>
            {notice}
          </div>
        )}

        {/* MODULE SELECTION */}

        {!attempt && !result && (
          <section style={styles.card}>
            <h2 style={styles.heading}>
              Select an Examination Module
            </h2>

            <p style={styles.muted}>
              Your verified purchase and access period will be
              checked by the server before an attempt can start.
            </p>

            {examination?.modules?.filter(
              (module) => module?.active !== false
            ).length > 0 ? (
              <>
                <label
                  htmlFor="international-module"
                  style={{
                    display: "block",
                    marginBottom: "10px",
                    fontWeight: 600,
                  }}
                >
                  Available modules
                </label>

                <select
                  id="international-module"
                  style={styles.input}
                  value={selectedModuleCode}
                  onChange={(event) =>
                    setSelectedModuleCode(event.target.value)
                  }
                  disabled={starting}
                >
                  {examination.modules
                    .filter(
                      (module) => module?.active !== false
                    )
                    .map((module) => (
                      <option
                        key={module.code}
                        value={module.code}
                      >
                        {module.name || module.code}
                      </option>
                    ))}
                </select>

                <div style={{ marginTop: "20px" }}>
                  <button
                    type="button"
                    style={styles.button}
                    onClick={startAttempt}
                    disabled={starting || loading}
                  >
                    {starting
                      ? "Starting Examination..."
                      : "Start Examination"}
                  </button>
                </div>
              </>
            ) : (
              <p style={styles.muted}>
                No active modules are available for this
                examination yet.
              </p>
            )}
          </section>
        )}

        {/* ACTIVE EXAMINATION */}

        {attempt && !result && (
          <>
            <section style={styles.card}>
              <h2 style={styles.heading}>
                Examination in Progress
              </h2>

              <p>
                <strong>Module:</strong>{" "}
                {section?.sectionName ||
                  attempt.moduleCode ||
                  selectedModuleCode}
              </p>

              <p>
                <strong>Section:</strong>{" "}
                {section?.sectionName ||
                  section?.sectionCode ||
                  "Loading"}
              </p>

              {remainingSeconds !== null && (
                <p
                  style={{
                    fontSize: "24px",
                    fontWeight: 700,
                    color:
                      remainingSeconds <= 60
                        ? "#b91c1c"
                        : "#1d4ed8",
                  }}
                >
                  Time remaining:{" "}
                  {formatTime(remainingSeconds)}
                </p>
              )}

              <p style={styles.muted}>
                {saving
                  ? "Saving your answer..."
                  : "Your answers are saved as you work."}
              </p>
            </section>

            {loading ? (
              <section style={styles.card}>
                Loading examination questions...
              </section>
            ) : (
              <section style={styles.card}>
                <h2 style={styles.heading}>
                  Questions
                </h2>

                {section?.instructions && (
                  <p style={styles.muted}>
                    {section.instructions}
                  </p>
                )}

                {questions.length === 0 ? (
                  <p style={styles.muted}>
                    No questions were returned for this section.
                    Please contact support before continuing.
                  </p>
                ) : (
                  questions.map((question, index) => (
                    <article
                      key={question._id}
                      style={styles.question}
                    >
                      <h3>
                        Question{" "}
                        {question.questionNumber || index + 1}
                      </h3>

                      {question.passage && (
                        <div
                          style={{
                            whiteSpace: "pre-wrap",
                            marginBottom: "16px",
                          }}
                        >
                          {question.passage}
                        </div>
                      )}

                      {question.instructions && (
                        <p style={styles.muted}>
                          {question.instructions}
                        </p>
                      )}

                      <p
                        style={{
                          whiteSpace: "pre-wrap",
                          lineHeight: 1.7,
                        }}
                      >
                        {question.question}
                      </p>

                      {question.imageUrl && (
                        <img
                          src={question.imageUrl}
                          alt="Question illustration"
                          style={{
                            maxWidth: "100%",
                            height: "auto",
                            margin: "12px 0",
                          }}
                        />
                      )}

                      {question.audioUrl && (
                        <audio
                          controls
                          src={question.audioUrl}
                          style={{
                            display: "block",
                            maxWidth: "100%",
                            margin: "12px 0",
                          }}
                        >
                          Your browser does not support audio.
                        </audio>
                      )}

                      {renderAnswerControl(question)}
                    </article>
                  ))
                )}

                <button
                  type="button"
                  style={styles.button}
                  onClick={completeSection}
                  disabled={
                    loading ||
                    finishingSection ||
                    submitting ||
                    questions.length === 0
                  }
                >
                  {finishingSection
                    ? "Completing Section..."
                    : submitting
                      ? "Submitting..."
                      : "Complete Section"}
                </button>
              </section>
            )}
          </>
        )}

        {/* RESULT */}

        {result && (
          <section style={styles.card}>
            <h2 style={styles.heading}>
              Examination Result
            </h2>

            <p>
              <strong>Result number:</strong>{" "}
              {result.reportNumber || "Pending"}
            </p>

            <p>
              <strong>Score:</strong>{" "}
              {result.overallScore ?? result.score ?? "-"}
              {" / "}
              {result.maximumScore ?? "-"}
            </p>

            <p>
              <strong>Percentage:</strong>{" "}
              {Number.isFinite(Number(result.percentage))
                ? `${Number(result.percentage).toFixed(2)}%`
                : "Pending"}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              {result.resultStatus ||
                result.status ||
                "Pending"}
            </p>

            <p>
              <strong>Grade:</strong>{" "}
              {result.grade || "Pending"}
            </p>

            <p>
              <strong>Band:</strong>{" "}
              {result.band || "Pending"}
            </p>

            {result.certificateEligible && (
              <p style={styles.success}>
                This result is marked as certificate-eligible
                by the server.
              </p>
            )}

            <button
              type="button"
              style={styles.button}
              onClick={() => navigate("/international")}
            >
              Return to International Examinations
            </button>
          </section>
        )}
      </div>
    </main>
  );
}

export default InternationalExamBoard;
