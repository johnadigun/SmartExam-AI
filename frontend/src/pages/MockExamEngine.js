
import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import BASE_URL from "../api/api";

import MockExamUI from "./MockExamUI";


/* ==========================================================
   SHUFFLE QUESTIONS
========================================================== */

const shuffleQuestions = (questions = []) => {
  const copied = [...questions];

  for (let i = copied.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [copied[i], copied[j]] = [
      copied[j],
      copied[i],
    ];
  }

  return copied;
};


/* ==========================================================
   REMOVE DUPLICATES
========================================================== */

const removeDuplicateQuestions = (questions = []) => {
  const unique = new Map();

  questions.forEach((question) => {
    if (!question?._id) return;

    if (!unique.has(question._id)) {
      unique.set(question._id, question);
    }
  });

  return Array.from(unique.values());
};


/* ==========================================================
   CBT ENGINE
========================================================== */

function MockExamEngine({
  exam,
  subject,
  category,
}) {

  const navigate = useNavigate();


  /* ======================================================
     STORAGE KEY
  ====================================================== */

  const storageKey = useMemo(() => {

    return `CBT_PROGRESS_${
      exam?._id || subject || "UNKNOWN"
    }`;

  }, [exam, subject]);


  /* ======================================================
     STATES
  ====================================================== */

  const [loading, setLoading] =
    useState(true);

  const [questions, setQuestions] =
    useState([]);

  const [answers, setAnswers] =
    useState({});

  const [currentQuestion, setCurrentQuestion] =
    useState(0);

  const [timeLeft, setTimeLeft] =
    useState(0);


  /* ======================================================
     REFS
  ====================================================== */

  const timerRef = useRef(null);

  const submittingRef = useRef(false);


  /* ======================================================
     TOTALS
  ====================================================== */

  const totalQuestions =
    questions.length;

  const answeredQuestions =
    Object.keys(answers).length;

  const remainingQuestions =
    Math.max(
      totalQuestions - answeredQuestions,
      0
    );


  const current =
    questions[currentQuestion] || null;


  /* ======================================================
     LOAD EXAM
  ====================================================== */

  useEffect(() => {

    if (!exam) {

      setLoading(false);

      return;

    }


    let loadedQuestions =
      exam.questions || [];


    /* ====================================================
       REMOVE DUPLICATES
    ==================================================== */

    loadedQuestions =
      removeDuplicateQuestions(
        loadedQuestions
      );


    /* ====================================================
       SHUFFLE QUESTIONS
    ==================================================== */

    loadedQuestions =
      shuffleQuestions(
        loadedQuestions
      );


    setQuestions(
      loadedQuestions
    );


    /* ====================================================
       RESTORE PREVIOUS PROGRESS
    ==================================================== */

    const saved =
      localStorage.getItem(
        storageKey
      );


    if (saved) {

      try {

        const progress =
          JSON.parse(saved);


        setAnswers(
          progress.answers || {}
        );


        const savedIndex =
          Number(
            progress.currentQuestion
          );


        const safeIndex =
          Number.isInteger(savedIndex) &&
          savedIndex >= 0 &&
          savedIndex < loadedQuestions.length
            ? savedIndex
            : 0;


        setCurrentQuestion(
          safeIndex
        );


        const savedTime =
          Number(
            progress.timeLeft
          );


        const defaultTime =
          (exam.duration || 60) * 60;


        setTimeLeft(

          Number.isFinite(savedTime) &&
          savedTime > 0

            ? savedTime

            : defaultTime

        );


      } catch (error) {

        console.error(
          "Unable to restore CBT progress:",
          error
        );


        setCurrentQuestion(0);


        setAnswers({});


        setTimeLeft(
          (exam.duration || 60) * 60
        );

      }


    } else {

      setCurrentQuestion(0);


      setAnswers({});


      setTimeLeft(
        (exam.duration || 60) * 60
      );

    }


    submittingRef.current =
      false;


    setLoading(false);

  }, [exam, storageKey]);


  /* ======================================================
     TIMER
  ====================================================== */

  useEffect(() => {

    if (loading) return;

    if (timeLeft <= 0) return;


    timerRef.current =
      setInterval(() => {

        setTimeLeft((previous) => {

          if (previous <= 1) {

            clearInterval(
              timerRef.current
            );

            return 0;

          }

          return previous - 1;

        });

      }, 1000);


    return () => {

      clearInterval(
        timerRef.current
      );

    };

  }, [loading, timeLeft]);


  /* ======================================================
     AUTO SAVE
  ====================================================== */

  useEffect(() => {

    if (loading) return;


    localStorage.setItem(

      storageKey,

      JSON.stringify({

        answers,

        currentQuestion,

        timeLeft,

      })

    );

  }, [

    answers,

    currentQuestion,

    timeLeft,

    storageKey,

    loading,

  ]);


  /* ======================================================
     FORMAT TIME
  ====================================================== */

  const formatTime = (seconds) => {

    const safeSeconds =
      Math.max(
        Number(seconds) || 0,
        0
      );


    const hours =
      Math.floor(
        safeSeconds / 3600
      );


    const minutes =
      Math.floor(
        (safeSeconds % 3600) / 60
      );


    const secs =
      safeSeconds % 60;


    return `${hours}:${String(
      minutes
    ).padStart(2, "0")}:${String(
      secs
    ).padStart(2, "0")}`;

  };


  /* ======================================================
     ANSWER SELECTION
  ====================================================== */

  const selectAnswer = (option) => {

    if (!current?._id) return;


    setAnswers((previous) => ({

      ...previous,

      [current._id]: option,

    }));

  };


  /* ======================================================
     NAVIGATION
  ====================================================== */

  const nextQuestion = () => {

    setCurrentQuestion((previous) => {

      if (
        previous <
        totalQuestions - 1
      ) {

        return previous + 1;

      }

      return previous;

    });

  };


  const previousQuestion = () => {

    setCurrentQuestion((previous) => {

      if (previous > 0) {

        return previous - 1;

      }

      return previous;

    });

  };


  const jumpToQuestion = (index) => {

    if (

      Number.isInteger(index) &&

      index >= 0 &&

      index < totalQuestions

    ) {

      setCurrentQuestion(index);

    }

  };


  /* ======================================================
     CALCULATE GRADE
  ====================================================== */

  const calculateGrade = (percentage) => {

    if (percentage >= 70)
      return "A";

    if (percentage >= 60)
      return "B";

    if (percentage >= 50)
      return "C";

    if (percentage >= 45)
      return "D";

    if (percentage >= 40)
      return "E";

    return "F";

  };


  /* ======================================================
     BUILD RESULT
  ====================================================== */

  const buildResult = () => {

    let score = 0;


    questions.forEach((question) => {

      if (

        answers[question._id] ===
        question.answer

      ) {

        score++;

      }

    });


    const total =
      questions.length;


    const percentage =
      total > 0

        ? Math.round(
            (score / total) * 100
          )

        : 0;


    const grade =
      calculateGrade(
        percentage
      );


    const user =

      JSON.parse(

        localStorage.getItem(
          "user"
        ) || "{}"

      );


    const candidate = {

      id:
        user?._id || null,

      fullName:
        user?.fullName ||
        user?.name ||
        "",

      email:
        user?.email || "",

      schoolId:
        user?.schoolId || null,

    };


    return {

      /* ==================================================
         RESULT TYPE
      ================================================== */

      type:
        "CBT",

      exam,

      subject,

      category,

      questions,

      answers,

      score,

      total,

      percentage,

      grade,

      candidate,

      duration:
        exam?.duration || 60,

      completedAt:
        new Date().toISOString(),

      certificateNumber:

        "CBT-" +

        new Date().getFullYear() +

        "-" +

        Date.now(),

    };

  };


  /* ======================================================
     SUBMIT EXAM
  ====================================================== */

  const submitExam = async (
    autoSubmit = false
  ) => {

    /* ====================================================
       PREVENT DOUBLE SUBMISSION
    ==================================================== */

    if (
      submittingRef.current
    ) {

      return;

    }


    submittingRef.current =
      true;


    /* ====================================================
       CONFIRM MANUAL SUBMISSION
    ==================================================== */

    if (!autoSubmit) {

      const confirmed =
        window.confirm(

          "Are you sure you want to submit this examination?"

        );


      if (!confirmed) {

        submittingRef.current =
          false;

        return;

      }

    }


    clearInterval(
      timerRef.current
    );


    /* ====================================================
       BUILD FRONTEND RESULT
    ==================================================== */

    const result =
      buildResult();


    const candidate =
      result.candidate;


    /* ====================================================
       GET AUTHENTICATION TOKEN
    ==================================================== */

    const token =
      localStorage.getItem(
        "token"
      );


    if (!token) {

      console.error(
        "CBT submission failed: authentication token is missing."
      );


      alert(
        "Your login session has expired. Please log in again."
      );


      submittingRef.current =
        false;

      return;

    }


    /* ====================================================
       BACKEND PAYLOAD

       IMPORTANT:
       userId is deliberately NOT taken from
       the request for authentication.

       The backend now obtains the authenticated
       user from the JWT token.
    ==================================================== */

    const backendPayload = {

      schoolId:
        candidate.schoolId,

      examTitle:
        exam?.title || "Mock Examination",

      score:
        result.score,

      total:
        result.total,

      percentage:
        result.percentage,

      grade:
        result.grade,

    };


    /* ====================================================
       SUBMIT TO BACKEND
    ==================================================== */

    try {

      const response =
        await fetch(

          `${BASE_URL}/results/submit`,

          {

            method: "POST",

            headers: {

              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,

            },

            body:
              JSON.stringify(
                backendPayload
              ),

          }

        );


      let data = null;


      try {

        data =
          await response.json();

      } catch (jsonError) {

        console.error(
          "Unable to read result response:",
          jsonError
        );

      }


      /* ==================================================
         CHECK SERVER RESPONSE
      ================================================== */

      if (!response.ok) {

        throw new Error(

          data?.message ||

          "The examination result could not be saved."

        );

      }


      /* ==================================================
         SAVE DETAILED FRONTEND RESULT

         Used by Result page / Review page
      ================================================== */

      const completeResult = {

        ...result,

        backendPayload,

        response: data,

      };


      localStorage.setItem(

        "cbt_result",

        JSON.stringify(
          completeResult
        )

      );


      /* ==================================================
         APPEND RESULT HISTORY
      ================================================== */

      const existingHistory =

        JSON.parse(

          localStorage.getItem(
            "results_history"
          ) || "[]"

        );


      const history = [

        completeResult,

        ...existingHistory,

      ];


      localStorage.setItem(

        "results_history",

        JSON.stringify(
          history
        )

      );


      /* ==================================================
         REMOVE ACTIVE CBT PROGRESS
      ================================================== */

      localStorage.removeItem(
        storageKey
      );


      /* ==================================================
         UPDATE LOCAL USER ACCESS

         Backend also performs this
         operation.
      ================================================== */

      const storedUser =

        JSON.parse(

          localStorage.getItem(
            "user"
          ) || "null"

        );


      if (
        storedUser &&
        storedUser._id
      ) {

        storedUser.cbtAccess =
          false;

        storedUser.examTaken =
          true;

        storedUser.remainingAttempts =
          0;

        storedUser.isPaid =
          false;

        storedUser.cbtExpiry =
          null;


        storedUser.score =
          result.score;

        storedUser.grade =
          result.grade;


        localStorage.setItem(

          "user",

          JSON.stringify(
            storedUser
          )

        );

      }


      /* ==================================================
         NAVIGATE TO RESULT PAGE
      ================================================== */

      navigate(

        "/result",

        {

          state: {

            result:
              completeResult,

          },

        }

      );


    } catch (error) {

      console.error(
        "Result submission failed:",
        error
      );


      submittingRef.current =
        false;


      alert(

        error?.message ||

        "Unable to submit examination. Please try again."

      );

    }

  };


  /* ======================================================
     AUTOMATIC SUBMISSION WHEN TIME EXPIRES
  ====================================================== */

  useEffect(() => {

    if (

      !loading &&

      exam &&

      questions.length > 0 &&

      timeLeft === 0 &&

      !submittingRef.current

    ) {

      submitExam(true);

    }

  }, [

    loading,

    exam,

    questions.length,

    timeLeft,

  ]);


  /* ======================================================
     PROTECT AGAINST PAGE REFRESH / CLOSING
  ====================================================== */

  useEffect(() => {

    if (loading) return;


    const beforeUnload =
      (event) => {

        event.preventDefault();

        event.returnValue =
          "Your examination progress may be lost.";

      };


    window.addEventListener(

      "beforeunload",

      beforeUnload

    );


    return () => {

      window.removeEventListener(

        "beforeunload",

        beforeUnload

      );

    };

  }, [loading]);


  /* ======================================================
     KEYBOARD NAVIGATION
  ====================================================== */

  useEffect(() => {

    if (loading) return;


    const keyHandler =
      (event) => {

        if (
          event.key ===
          "ArrowRight"
        ) {

          nextQuestion();

        }


        if (
          event.key ===
          "ArrowLeft"
        ) {

          previousQuestion();

        }

      };


    window.addEventListener(

      "keydown",

      keyHandler

    );


    return () => {

      window.removeEventListener(

        "keydown",

        keyHandler

      );

    };

  }, [

    loading,

    currentQuestion,

    totalQuestions,

  ]);


  /* ======================================================
     RENDER
  ====================================================== */

  return (

    <MockExamUI

      exam={exam}

      subject={subject}

      category={category}

      questions={questions}

      loading={loading}

      current={current}

      currentQuestion={currentQuestion}

      totalQuestions={totalQuestions}

      answeredQuestions={
        answeredQuestions
      }

      remainingQuestions={
        remainingQuestions
      }

      answers={answers}

      timeLeft={timeLeft}

      formatTime={formatTime}

      selectAnswer={selectAnswer}

      nextQuestion={nextQuestion}

      previousQuestion={
        previousQuestion
      }

      jumpToQuestion={
        jumpToQuestion
      }

      submitExam={submitExam}

    />

  );

}


export default MockExamEngine;

