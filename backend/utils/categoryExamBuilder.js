const Question = require("../models/Question");
const CATEGORY_SUBJECTS = require("../config/categories");

/* ==========================================================
   SHUFFLE
========================================================== */

function shuffle(array) {
  const arr = [...array];

  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return arr;
}

/* ==========================================================
   BUILD CATEGORY EXAM
========================================================== */

async function buildCategoryExam(category, mode = "practice") {

  const subjects = CATEGORY_SUBJECTS[category];

  if (!subjects) {
    throw new Error(`Invalid category: ${category}`);
  }

  console.log("======================================");
  console.log("CATEGORY :", category);
  console.log("MODE     :", mode);
  console.log("======================================");

  let allQuestions = [];

  /* ==========================================
     LOAD ALL SUBJECTS
  ========================================== */

  for (const subject of subjects) {

    const questions = await Question.find({
      subject: subject,
    }).lean();

    console.log(
      subject.padEnd(25),
      questions.length
    );

    allQuestions.push(...questions);

  }

  console.log("--------------------------------------");
  console.log(
    "TOTAL QUESTIONS FOUND:",
    allQuestions.length
  );

  /* ==========================================
     REMOVE DUPLICATES
  ========================================== */

  const unique = [];

  const seen = new Set();

  for (const q of allQuestions) {

    const key =
      (q.question || "")
        .trim()
        .toLowerCase();

    if (!seen.has(key)) {

      seen.add(key);

      unique.push(q);

    }

  }

  console.log(
    "AFTER DUPLICATES:",
    unique.length
  );

  /* ==========================================
     SHUFFLE
  ========================================== */

  const shuffled = shuffle(unique);

  /* ==========================================
     LIMIT
  ========================================== */

  const limit =
    mode === "practice"
      ? 50
      : 100;

  const paper = shuffled.slice(0, limit);

  console.log(
    "FINAL PAPER:",
    paper.length
  );

  console.log("======================================");

  return {

    title:
      mode === "practice"
        ? `${category} Practice Test`
        : `${category} CBT Examination`,

    category,

    duration:
      mode === "practice"
        ? 30
        : 120,

    questions: paper,

  };

}

module.exports = buildCategoryExam;