
const Question = require("../models/question");
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
   NORMALIZE DIFFICULTY
========================================================== */

function normalizeDifficulty(value) {
  if (!value) {
    return "medium";
  }

  const difficulty = String(value).trim().toLowerCase();

  if (
    difficulty === "easy" ||
    difficulty === "beginner" ||
    difficulty === "basic"
  ) {
    return "easy";
  }

  if (
    difficulty === "hard" ||
    difficulty === "difficult" ||
    difficulty === "advanced"
  ) {
    return "hard";
  }

  return "medium";
}

/* ==========================================================
   NORMALIZE QUESTION TEXT
   Used for stronger duplicate detection.
========================================================== */

function normalizeQuestionText(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[“”"‘’']/g, "")
    .trim();
}

/* ==========================================================
   REMOVE DUPLICATES
========================================================== */

function removeDuplicates(questions) {
  const unique = [];
  const seen = new Set();

  for (const question of questions) {
    const key = normalizeQuestionText(question.question);

    if (!key) {
      continue;
    }

    if (!seen.has(key)) {
      seen.add(key);
      unique.push(question);
    }
  }

  return unique;
}

/* ==========================================================
   TAKE QUESTIONS FROM A POOL
========================================================== */

function takeQuestions(pool, amount) {
  if (amount <= 0 || pool.length === 0) {
    return [];
  }

  return shuffle(pool).slice(0, amount);
}

/* ==========================================================
   BUILD BALANCED PAPER
==========================================================

   Target distribution:

   EASY   = 20%
   MEDIUM = 50%
   HARD   = 30%

   Practice:
   50 questions
   10 Easy
   25 Medium
   15 Hard

   CBT category:
   100 questions
   20 Easy
   50 Medium
   30 Hard

   If there are not enough questions in one difficulty,
   the remaining spaces are filled from the other available
   difficulty pools.
========================================================== */

function buildBalancedPaper(questions, limit) {
  const easy = [];
  const medium = [];
  const hard = [];

  for (const question of questions) {
    const difficulty = normalizeDifficulty(
      question.difficulty
    );

    if (difficulty === "easy") {
      easy.push(question);
    } else if (difficulty === "hard") {
      hard.push(question);
    } else {
      medium.push(question);
    }
  }

  const easyTarget = Math.round(limit * 0.20);
  const mediumTarget = Math.round(limit * 0.50);
  const hardTarget =
    limit - easyTarget - mediumTarget;

  console.log("--------------------------------------");
  console.log("DIFFICULTY POOL");
  console.log("EASY   :", easy.length);
  console.log("MEDIUM :", medium.length);
  console.log("HARD   :", hard.length);

  console.log("--------------------------------------");
  console.log("DIFFICULTY TARGET");
  console.log("EASY   :", easyTarget);
  console.log("MEDIUM :", mediumTarget);
  console.log("HARD   :", hardTarget);

  const selected = [];

  const easySelected = takeQuestions(
    easy,
    easyTarget
  );

  const mediumSelected = takeQuestions(
    medium,
    mediumTarget
  );

  const hardSelected = takeQuestions(
    hard,
    hardTarget
  );

  selected.push(...easySelected);
  selected.push(...mediumSelected);
  selected.push(...hardSelected);

  /* ========================================================
     FALLBACK FILL
     If a difficulty pool does not contain enough questions,
     fill the remaining spaces from unused questions.
  ======================================================== */

  if (selected.length < limit) {
    const selectedKeys = new Set(
      selected.map((question) =>
        normalizeQuestionText(question.question)
      )
    );

    const remaining = questions.filter(
      (question) =>
        !selectedKeys.has(
          normalizeQuestionText(question.question)
        )
    );

    const needed = limit - selected.length;

    const additional = takeQuestions(
      remaining,
      needed
    );

    selected.push(...additional);
  }

  /* ========================================================
     FINAL SAFETY LIMIT
  ======================================================== */

  return shuffle(selected).slice(0, limit);
}

/* ==========================================================
   BUILD CATEGORY EXAM
========================================================== */

async function buildCategoryExam(
  category,
  mode = "practice"
) {
  const subjects = CATEGORY_SUBJECTS[category];

  if (!subjects) {
    throw new Error(
      `Invalid category: ${category}`
    );
  }

  console.log("======================================");
  console.log("CATEGORY :", category);
  console.log("MODE     :", mode);
  console.log("======================================");

  let allQuestions = [];

  /* ========================================================
     LOAD ALL SUBJECTS IN CATEGORY
  ======================================================== */

  for (const subject of subjects) {
    const questions = await Question.find({
      subject: subject,
    }).lean();

    console.log(
      String(subject).padEnd(25),
      questions.length
    );

    allQuestions.push(...questions);
  }

  console.log("--------------------------------------");
  console.log(
    "TOTAL QUESTIONS FOUND:",
    allQuestions.length
  );

  /* ========================================================
     REMOVE DUPLICATES
  ======================================================== */

  const uniqueQuestions =
    removeDuplicates(allQuestions);

  console.log(
    "AFTER DUPLICATES:",
    uniqueQuestions.length
  );

  /* ========================================================
     LIMIT
  ======================================================== */

  const limit =
    mode === "practice"
      ? 50
      : 100;

  /* ========================================================
     BUILD BALANCED PAPER
  ======================================================== */

  const paper = buildBalancedPaper(
    uniqueQuestions,
    limit
  );

  /* ========================================================
     FINAL REPORT
  ======================================================== */

  console.log("--------------------------------------");
  console.log(
    "FINAL PAPER:",
    paper.length
  );

  console.log("======================================");

  /* ========================================================
     RETURN EXAM
  ======================================================== */

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

/* ==========================================================
   EXPORT
========================================================== */

module.exports = buildCategoryExam;