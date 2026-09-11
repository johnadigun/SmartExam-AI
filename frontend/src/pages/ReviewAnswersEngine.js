import React, { useMemo, useState } from "react";
import ReviewAnswersUI from "./ReviewAnswersUI";

function ReviewAnswersEngine({ result }) {
  /* ==========================================
     QUESTIONS
  ========================================== */

  const questions = useMemo(() => {
    if (!result) return [];

    if (result.questions) {
      return result.questions;
    }

    if (result.exam?.questions) {
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

  const current = questions[currentQuestion];

  const answers = result.answers || {};

  /* ==========================================
     NAVIGATION
  ========================================== */

  const nextQuestion = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const jumpToQuestion = (index) => {
    setCurrentQuestion(index);
  };

  /* ==========================================
     ANSWER CHECK
  ========================================== */

  const isCorrect = (index, option) => {
    return questions[index]?.answer === option;
  };

  const isWrongSelection = (index, option) => {
    return (
      answers[index] === option &&
      questions[index]?.answer !== option
    );
  };

  const selectedAnswer = (index) => {
    return answers[index];
  };

  /* ==========================================
     PRINT
  ========================================== */

  const printResult = () => {
    window.print();
  };

  /* ==========================================
     SUMMARY
  ========================================== */

 const total =
  result.totalQuestions ||
  questions.length;

const summary = {
  category: result.category,
  score: result.score,
  total,
  wrong: total - result.score,
  percentage: result.percentage,
  grade: result.grade,
  completedAt: result.completedAt,
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
      nextQuestion={nextQuestion}
      previousQuestion={previousQuestion}
      jumpToQuestion={jumpToQuestion}
      printResult={printResult}
    />
  );
}

export default ReviewAnswersEngine;