const mongoose = require("mongoose");

/* ==========================================================
   INTERNATIONAL EXAMINATION ATTEMPT SCHEMA
========================================================== */

/*
  One document represents one candidate's attempt at one
  international examination.

  This model is intentionally flexible enough to support:

  - IELTS
  - TOEFL
  - SAT
  - GRE
  - GMAT
  - Cambridge English
  - PTE Academic
  - Professional examinations

  It does NOT modify the permanent question bank.
*/


/* ==========================================================
   ANSWER SCHEMA
========================================================== */

const InternationalAnswerSchema = new mongoose.Schema(
  {
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InternationalQuestion",
      required: true,
    },

    answer: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    isAnswered: {
      type: Boolean,
      default: false,
    },

    isCorrect: {
      type: Boolean,
      default: null,
    },

    marksAwarded: {
      type: Number,
      default: 0,
    },

    submittedAt: {
      type: Date,
      default: null,
    },
  },
  {
    _id: false,
  }
);


/* ==========================================================
   SECTION ATTEMPT SCHEMA
========================================================== */

const InternationalSectionAttemptSchema =
  new mongoose.Schema(
    {
      sectionCode: {
        type: String,
        required: true,
        trim: true,
        uppercase: true,
      },

      sectionName: {
        type: String,
        default: "",
        trim: true,
      },

      startedAt: {
        type: Date,
        default: null,
      },

      completedAt: {
        type: Date,
        default: null,
      },

      duration: {
        type: Number,
        default: 0,
        min: 0,
      },

      questionCount: {
        type: Number,
        default: 0,
        min: 0,
      },

      status: {
        type: String,

        enum: [
          "NOT_STARTED",
          "IN_PROGRESS",
          "COMPLETED",
          "EXPIRED",
          "ABANDONED",
        ],

        default: "NOT_STARTED",
      },

      score: {
        type: Number,
        default: null,
      },

      maximumScore: {
        type: Number,
        default: null,
      },

      percentage: {
        type: Number,
        default: null,
        min: 0,
        max: 100,
      },
    },
    {
      _id: false,
    }
  );


/* ==========================================================
   INTERNATIONAL ATTEMPT SCHEMA
========================================================== */

const InternationalAttemptSchema = new mongoose.Schema(
  {
    /* ======================================================
       CANDIDATE
    ====================================================== */

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    /* ======================================================
       EXAMINATION
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

    /* ======================================================
       ATTEMPT NUMBER
    ====================================================== */

    attemptNumber: {
      type: Number,
      default: 1,
      min: 1,
    },

    /* ======================================================
       SECTIONS
    ====================================================== */

    sections: {
      type: [InternationalSectionAttemptSchema],
      default: [],
    },

    /* ======================================================
       ANSWERS
    ====================================================== */

    answers: {
      type: [InternationalAnswerSchema],
      default: [],
    },

    /* ======================================================
       OVERALL SCORING
    ====================================================== */

    scoring: {
      score: {
        type: Number,
        default: null,
      },

      maximumScore: {
        type: Number,
        default: null,
      },

      percentage: {
        type: Number,
        default: null,
        min: 0,
        max: 100,
      },

      band: {
        type: Number,
        default: null,
      },

      grade: {
        type: String,
        default: "",
        trim: true,
      },

      scoreType: {
        type: String,
        default: "",
        trim: true,
        uppercase: true,
      },
    },

    /* ======================================================
       ATTEMPT STATUS
    ====================================================== */

    status: {
      type: String,

      enum: [
        "NOT_STARTED",
        "IN_PROGRESS",
        "PAUSED",
        "SUBMITTED",
        "COMPLETED",
        "ABANDONED",
        "EXPIRED",
      ],

      default: "NOT_STARTED",

      index: true,
    },

    /* ======================================================
       TIMING
    ====================================================== */

    startedAt: {
      type: Date,
      default: null,
    },

    submittedAt: {
      type: Date,
      default: null,
    },

    completedAt: {
      type: Date,
      default: null,
    },

    expiresAt: {
      type: Date,
      default: null,
    },

    totalDuration: {
      type: Number,
      default: 0,
      min: 0,
    },

    /* ======================================================
       PAYMENT REFERENCE
    ====================================================== */

    paymentReference: {
      type: String,
      default: "",
      trim: true,
      index: true,
    },

    /* ======================================================
       SCORE REPORT
    ====================================================== */

    scoreReportIssued: {
      type: Boolean,
      default: false,
    },

    scoreReportId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InternationalScoreReport",
      default: null,
    },

    /* ======================================================
       ADDITIONAL METADATA
    ====================================================== */

    attemptMetadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },

  {
    timestamps: true,
  }
);


/* ==========================================================
   INDEXES
========================================================== */

InternationalAttemptSchema.index({
  user: 1,
  examCode: 1,
  moduleCode: 1,
});

InternationalAttemptSchema.index({
  user: 1,
  status: 1,
});

InternationalAttemptSchema.index({
  examCode: 1,
  moduleCode: 1,
  status: 1,
});

InternationalAttemptSchema.index({
  expiresAt: 1,
});


/* ==========================================================
   MODEL
========================================================== */

const InternationalAttempt =
  mongoose.models.InternationalAttempt ||
  mongoose.model(
    "InternationalAttempt",
    InternationalAttemptSchema
  );


module.exports = InternationalAttempt;