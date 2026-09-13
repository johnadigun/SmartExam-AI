
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../api/api";
import PracticeUI from "./PracticeUI";

function PracticeEngine({
  onFinish,
}) {
  const navigate = useNavigate();

  /* ==========================================
     USER
  ========================================== */

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  /* ==========================================
     STORAGE
  ========================================== */

  const storageKey = "PRACTICE_PROGRESS";

  /* ==========================================
     STATES
  ========================================== */

  const [loading, setLoading] = useState(true);

  const [exam, setExam] = useState(null);

  const [started, setStarted] = useState(false);

  const [currentQuestion, setCurrentQuestion] =
    useState(0);

  const [answers, setAnswers] = useState({});

  const [submitted, setSubmitted] =
    useState(false);

  /* ==========================================
     SECURITY
  ========================================== */

  useEffect(() => {
    if (!user?.email) {
      navigate("/");
    }
  }, [navigate, user]);

  /* ==========================================
     LOAD RANDOM PRACTICE QUESTIONS
     FROM ENTIRE QUESTION BANK
  ========================================== */

  useEffect(() => {
    const loadPracticePaper = async () => {
      try {
        console.log(
          "Practice Mode: Loading random questions from entire question bank..."
        );

        console.log(
          "Request URL:",
          `${BASE_URL}/exams/practice`
        );

        const token =
          localStorage.getItem("token");

        const response = await fetch(
          `${BASE_URL}/exams/practice`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        console.log(
          "HTTP Status:",
          response.status
        );

        console.log(
          "Practice Response:",
          data
        );

        if (!response.ok || !data.success) {
          console.log(
            "Backend Error:",
            data.message
          );

          alert(
            data.message ||
              "Unable to load Practice questions."
          );

          setExam(null);

          return;
        }

        console.log(
          "Practice Exam Loaded:",
          data.exam
        );

        setExam(data.exam);

      } catch (err) {
        console.log(
          "Practice Loading Error:",
          err
        );

        setExam(null);

      } finally {
        setLoading(false);
      }
    };

    loadPracticePaper();

  }, []);

  /* ==========================================
     QUESTIONS
  ========================================== */

  const questions = useMemo(() => {
    if (!exam) return [];

    return exam.questions || [];

  }, [exam]);

  const totalQuestions =
    questions.length;

  const current =
    questions[currentQuestion];

  /* ==========================================
     SELECT ANSWER
  ========================================== */

  const selectAnswer = (option) => {
    if (submitted) return;

    setAnswers((prev) => ({
      ...prev,
      [currentQuestion]: option,
    }));
  };

  /* ==========================================
     NAVIGATION
  ========================================== */

  const nextQuestion = () => {
    if (
      currentQuestion <
      totalQuestions - 1
    ) {
      setCurrentQuestion(
        (prev) => prev + 1
      );
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(
        (prev) => prev - 1
      );
    }
  };

  const jumpToQuestion = (index) => {
    setCurrentQuestion(index);
  };

  /* ==========================================
     PRACTICE PROGRESS
  ========================================== */

  const answeredQuestions =
    Object.keys(answers).length;

  const remainingQuestions =
    totalQuestions -
    answeredQuestions;

  /* ==========================================
     SCORE CALCULATION
  ========================================== */

  const calculateResult = () => {
    let score = 0;

    questions.forEach((q, index) => {
      if (
        answers[index] ===
        q.answer
      ) {
        score++;
      }
    });

    const percentage =
      totalQuestions > 0
        ? Math.round(
            (score /
              totalQuestions) *
              100
          )
        : 0;

    let grade = "F";

    if (percentage >= 70)
      grade = "A";
    else if (percentage >= 60)
      grade = "B";
    else if (percentage >= 50)
      grade = "C";
    else if (percentage >= 45)
      grade = "D";
    else if (percentage >= 40)
      grade = "E";

    return {
      score,
      percentage,
      grade,
    };
  };

  /* ==========================================
     SUBMIT PRACTICE
  ========================================== */

  const submitPractice = () => {
    const confirmSubmit =
      window.confirm(
        "Submit Practice Test?"
      );

    if (!confirmSubmit) return;

    const result =
      calculateResult();

    const payload = {
      totalQuestions,
      answeredQuestions,
      score: result.score,
      percentage: result.percentage,
      grade: result.grade,
      answers,
      questions,
      completedAt:
        new Date(),
    };

    localStorage.setItem(
      "practice_result",
      JSON.stringify(payload)
    );

    localStorage.removeItem(
      storageKey
    );

    setSubmitted(true);

    if (onFinish) {
      onFinish(payload);
    } else {
      navigate(
        "/practice-result"
      );
    }
  };

  /* ==========================================
     PRACTICE AGAIN
  ========================================== */

  const restartPractice = () => {
    localStorage.removeItem(
      storageKey
    );

    localStorage.removeItem(
      "practice_result"
    );

    setAnswers({});

    setCurrentQuestion(0);

    setSubmitted(false);

    window.location.reload();
  };

  /* ==========================================
     SHOW CORRECT ANSWERS
  ========================================== */

  const isCorrect = (
    index,
    option
  ) => {
    return (
      questions[index]?.answer ===
      option
    );
  };

  const isWrongSelection = (
    index,
    option
  ) => {
    return (
      answers[index] ===
        option &&
      questions[index]?.answer !==
        option
    );
  };

  /* ==========================================
     SAVE PROGRESS
  ========================================== */

  useEffect(() => {
    if (loading || submitted)
      return;

    if (!questions.length)
      return;

    localStorage.setItem(
      storageKey,
      JSON.stringify({
        currentQuestion,
        answers,
      })
    );

  }, [
    answers,
    currentQuestion,
    loading,
    submitted,
    questions.length,
  ]);

  /* ==========================================
     RESTORE PROGRESS
  ========================================== */

  useEffect(() => {
    if (loading) return;

    const saved =
      localStorage.getItem(
        storageKey
      );

    if (!saved) return;

    try {
      const parsed =
        JSON.parse(saved);

      if (parsed.answers) {
        setAnswers(
          parsed.answers
        );
      }

      if (
        typeof parsed.currentQuestion ===
        "number"
      ) {
        setCurrentQuestion(
          parsed.currentQuestion
        );
      }

    } catch (err) {
      console.log(
        "Practice progress restore error:",
        err
      );
    }

  }, [loading]);

  /* ==========================================
     RENDER PRACTICE UI
  ========================================== */

  return (
    <PracticeUI
      exam={exam}

      loading={loading}

      started={started}
      setStarted={setStarted}

      current={current}
      questions={questions}

      currentQuestion={
        currentQuestion
      }

      totalQuestions={
        totalQuestions
      }

      answeredQuestions={
        answeredQuestions
      }

      remainingQuestions={
        remainingQuestions
      }

      answers={answers}

      submitted={submitted}

      nextQuestion={
        nextQuestion
      }

      previousQuestion={
        previousQuestion
      }

      jumpToQuestion={
        jumpToQuestion
      }

      selectAnswer={
        selectAnswer
      }

      submitPractice={
        submitPractice
      }

      restartPractice={
        restartPractice
      }

      isCorrect={
        isCorrect
      }

      isWrongSelection={
        isWrongSelection
      }
    />
  );
}

export default PracticeEngine;