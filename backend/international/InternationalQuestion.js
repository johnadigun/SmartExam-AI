const mongoose = require("mongoose");

/* ==========================================================
   INTERNATIONAL QUESTION SCHEMA
========================================================== */

/*
  This model is intentionally flexible.

  It supports different international examination formats
  without requiring a separate question model for each exam.

  Examples:
  - IELTS
  - TOEFL
  - SAT
  - GRE
  - GMAT
  - Cambridge English
  - PTE Academic
  - International Professional Examinations
*/


const InternationalQuestionSchema = new mongoose.Schema(
  {
    /* ======================================================
       EXAMINATION IDENTIFICATION
    ====================================================== */

    examCode: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      index: true,
    },

    moduleCode: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      index: true,
    },

    sectionCode: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      index: true,
    },

    /* ======================================================
       QUESTION TYPE
    ====================================================== */

    questionType: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,

      enum: [
        "MULTIPLE_CHOICE",
        "MULTIPLE_RESPONSE",
        "TRUE_FALSE",
        "MATCHING",
        "FILL_IN_THE_BLANK",
        "NUMERICAL_ENTRY",
        "SHORT_ANSWER",
        "ESSAY",
        "LISTENING",
        "READING",
      ],

      index: true,
    },

    /* ======================================================
       QUESTION CONTENT
    ====================================================== */

    question: {
      type: String,
      required: true,
      trim: true,
    },

    instructions: {
      type: String,
      default: "",
      trim: true,
    },

    passage: {
      type: String,
      default: "",
      trim: true,
    },

    audioUrl: {
      type: String,
      default: "",
      trim: true,
    },

    imageUrl: {
      type: String,
      default: "",
      trim: true,
    },

    /* ======================================================
       OPTIONS
    ====================================================== */

    options: [
      {
        id: {
          type: String,
          trim: true,
        },

        text: {
          type: String,
          trim: true,
        },
      },
    ],

    /* ======================================================
       CORRECT ANSWER
    ====================================================== */

    answer: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    /* ======================================================
       ANSWER VALIDATION / TOLERANCE
    ====================================================== */

    answerConfiguration: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    /*
      Examples:

      Numerical entry:
      {
        value: 42,
        tolerance: 0
      }

      Multiple response:
      {
        minimumSelections: 2,
        maximumSelections: 2
      }

      Matching:
      {
        pairs: [...]
      }
    */

    /* ======================================================
       EXPLANATION
    ====================================================== */

    explanation: {
      type: String,
      default: "",
      trim: true,
    },

    /* ======================================================
       DIFFICULTY
    ====================================================== */

    difficulty: {
      type: String,

      enum: [
        "EASY",
        "MEDIUM",
        "HARD",
      ],

      default: "MEDIUM",

      index: true,
    },

    /* ======================================================
       MARKS / SCORING
    ====================================================== */

    marks: {
      type: Number,
      default: 1,
      min: 0,
    },

    negativeMarks: {
      type: Number,
      default: 0,
      min: 0,
    },

    scoringType: {
      type: String,

      enum: [
        "EXACT",
        "PARTIAL",
        "MANUAL",
        "BAND",
        "RUBRIC",
      ],

      default: "EXACT",
    },

    /* ======================================================
       QUESTION ORDER
    ====================================================== */

    questionNumber: {
      type: Number,
      default: null,
      min: 1,
    },

    /* ======================================================
       STATUS
    ====================================================== */

    active: {
      type: Boolean,
      default: true,
      index: true,
    },

    /* ======================================================
       METADATA
    ====================================================== */

    tags: {
      type: [String],
      default: [],
    },

    source: {
      type: String,
      default: "",
      trim: true,
    },

    version: {
      type: Number,
      default: 1,
      min: 1,
    },
  },

  {
    timestamps: true,
  }
);


/* ==========================================================
   INDEXES
========================================================== */

/*
  Main question retrieval pattern:

  Exam
    → Module
    → Section
    → Active Questions
*/

InternationalQuestionSchema.index({
  examCode: 1,
  moduleCode: 1,
  sectionCode: 1,
  active: 1,
});


/*
  Useful for question ordering.
*/

InternationalQuestionSchema.index({
  examCode: 1,
  moduleCode: 1,
  sectionCode: 1,
  questionNumber: 1,
});


/*
  Useful when filtering by question type.
*/

InternationalQuestionSchema.index({
  examCode: 1,
  moduleCode: 1,
  questionType: 1,
});


/* ==========================================================
   MODEL
========================================================== */

const InternationalQuestion =
  mongoose.models.InternationalQuestion ||
  mongoose.model(
    "InternationalQuestion",
    InternationalQuestionSchema
  );


module.exports = InternationalQuestion;