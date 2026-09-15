
import React, { useMemo, useState } from "react";
import ReviewAnswersUI from "./ReviewAnswersUI";

function ReviewAnswersEngine({ result }) {
  /* ==========================================
     QUESTIONS
  ========================================== */

  const questions = useMemo(() => {
    if (!result) return [];

    if (Array.isArray(result.questions)) {
      return result.questions;
    }

    if (Array.isArray(result.exam?.questions)) {
      return result.exam.questions;
    }

    return [];
  }, [result]);

  /* ==========================================
     STATES
  ========================================== */

  const [currentQuestion, setCurrentQuestion] =
    useState(0);

  const totalQuestions = questions.length;

  const current =
    questions[currentQuestion] || null;

  const answers = result?.answers || {};

  /* ==========================================
     ANSWER LOOKUP
     
     Normal CBT stores:
       answers[question._id]

     Practice Mode may store:
       answers[index]
  ========================================== */

  const getSelectedAnswer = (index) => {
    const question = questions[index];

    if (!question) {
      return undefined;
    }

    /* ------------------------------------------
       NORMAL CBT
       ------------------------------------------ */

    if (
      question._id &&
      Object.prototype.hasOwnProperty.call(
        answers,
        question._id
      )
    ) {
      return answers[question._id];
    }

    /* ------------------------------------------
       PRACTICE MODE / INDEX BASED
       ------------------------------------------ */

    if (
      Object.prototype.hasOwnProperty.call(
        answers,
        index
      )
    ) {
      return answers[index];
    }

    /* ------------------------------------------
       STRING INDEX FALLBACK
       ------------------------------------------ */

    const stringIndex = String(index);

    if (
      Object.prototype.hasOwnProperty.call(
        answers,
        stringIndex
      )
    ) {
      return answers[stringIndex];
    }

    return undefined;
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
        (previous) => previous + 1
      );
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(
        (previous) => previous - 1
      );
    }
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

  /* ==========================================
     ANSWER CHECK
  ========================================== */

  const isCorrect = (index, option) => {
    const question = questions[index];

    if (!question) {
      return false;
    }

    return question.answer === option;
  };

  const isWrongSelection = (
    index,
    option
  ) => {
    const selected = getSelectedAnswer(index);
    const question = questions[index];

    if (!question) {
      return false;
    }

    return (
      selected === option &&
      selected !== question.answer
    );
  };

  const selectedAnswer = (index) => {
    return getSelectedAnswer(index);
  };

  /* ==========================================
     QUESTION STATUS
  ========================================== */

  const getQuestionStatus = (index) => {
    const question = questions[index];

    if (!question) {
      return "unanswered";
    }

    const selected = getSelectedAnswer(index);

    if (
      selected === undefined ||
      selected === null ||
      selected === ""
    ) {
      return "unanswered";
    }

    if (selected === question.answer) {
      return "correct";
    }

    return "wrong";
  };

  /* ==========================================
     SUMMARY
  ========================================== */

  const total =
    Number(
      result?.totalQuestions
    ) ||
    Number(result?.total) ||
    questions.length;

  const score =
    Number(result?.score) || 0;

  const answeredCount = questions.reduce(
    (count, question, index) => {
      const selected =
        getSelectedAnswer(index);

      if (
        selected !== undefined &&
        selected !== null &&
        selected !== ""
      ) {
        return count + 1;
      }

      return count;
    },
    0
  );

  const wrong =
    Math.max(answeredCount - score, 0);

  const unanswered =
    Math.max(
      total - answeredCount,
      0
    );

  const summary = {
    category:
      result?.category ||
      result?.exam?.category ||
      "General",

    score,

    total,

    wrong,

    unanswered,

    answered: answeredCount,

    percentage:
      Number(result?.percentage) || 0,

    grade:
      result?.grade || "-",

    completedAt:
      result?.completedAt || null,
  };

  /* ==========================================
     PRINT
  ========================================== */

  const printResult = () => {
    window.print();
  };

  /* ==========================================
     RENDER
  ========================================== */

  return (
    <ReviewAnswersUI
      summary={summary}
      questions={questions}
      current={current}
      currentQuestion={currentQuestion}
      totalQuestions={totalQuestions}
      selectedAnswer={selectedAnswer}
      isCorrect={isCorrect}
      isWrongSelection={isWrongSelection}
      getQuestionStatus={getQuestionStatus}
      nextQuestion={nextQuestion}
      previousQuestion={previousQuestion}
      jumpToQuestion={jumpToQuestion}
      printResult={printResult}
    />
  );
}

export default ReviewAnswersEngine;