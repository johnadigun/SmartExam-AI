const mongoose = require("mongoose");

/* ==========================================================
   INTERNATIONAL SCORE REPORT SCHEMA
========================================================== */

/*
  This model represents the official result/score report
  generated after an International Examination attempt.

  It is intentionally flexible because different
  international examinations use different scoring systems.

  Examples:

  IELTS
    - Band scores
    - Overall Band

  SAT
    - Reading & Writing
    - Math
    - Total Score

  GRE
    - Verbal Reasoning
    - Quantitative Reasoning
    - Analytical Writing

  TOEFL
    - Section scores
    - Total score

  Professional examinations
    - May use percentage, grade, points, pass/fail, etc.
*/


/* ==========================================================
   SECTION SCORE SCHEMA
========================================================== */

const InternationalSectionScoreSchema =
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
        required: true,
        trim: true,
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

      band: {
        type: Number,
        default: null,
      },

      grade: {
        type: String,
        default: "",
        trim: true,
      },

      status: {
        type: String,
        default: "",
        trim: true,
        uppercase: true,
      },

      scoreType: {
        type: String,
        default: "",
        trim: true,
        uppercase: true,
      },
    },
    {
      _id: false,
    }
  );


/* ==========================================================
   INTERNATIONAL SCORE REPORT SCHEMA
========================================================== */

const InternationalScoreReportSchema =
  new mongoose.Schema(
    {
      /* ====================================================
         CANDIDATE
      ==================================================== */

      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
      },

      /* ====================================================
         ATTEMPT
      ==================================================== */

      attempt: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "InternationalAttempt",
        required: true,
        unique: true,
        index: true,
      },

      /* ====================================================
         EXAMINATION
      ==================================================== */

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

      /* ====================================================
         EXAMINATION NAME SNAPSHOT

         These values preserve what was displayed at the
         time the report was issued.
      ==================================================== */

      examName: {
        type: String,
        default: "",
        trim: true,
      },

      moduleName: {
        type: String,
        default: "",
        trim: true,
      },

      /* ====================================================
         SECTION SCORES
      ==================================================== */

      sections: {
        type: [InternationalSectionScoreSchema],
        default: [],
      },

      /* ====================================================
         OVERALL SCORE
      ==================================================== */

      overallScore: {
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
        required: true,
        trim: true,
        uppercase: true,
      },

      /* ====================================================
         PASS / FAIL
      ==================================================== */

      resultStatus: {
        type: String,

        enum: [
          "PASS",
          "FAIL",
          "COMPLETED",
          "INCOMPLETE",
          "PENDING",
        ],

        default: "PENDING",

        index: true,
      },

      /* ====================================================
         REPORT IDENTIFICATION
      ==================================================== */

      reportNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        index: true,
      },

      /* ====================================================
         ISSUE INFORMATION
      ==================================================== */

      issuedAt: {
        type: Date,
        default: Date.now,
      },

      validUntil: {
        type: Date,
        default: null,
      },

      /* ====================================================
         CERTIFICATE INFORMATION

         A score report is not automatically a certificate.
      ==================================================== */

      certificateEligible: {
        type: Boolean,
        default: false,
      },

      certificateIssued: {
        type: Boolean,
        default: false,
      },

      certificateNumber: {
        type: String,
        default: "",
        trim: true,
      },

      /* ====================================================
         ADDITIONAL METADATA
      ==================================================== */

      metadata: {
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

InternationalScoreReportSchema.index({
  user: 1,
  examCode: 1,
  moduleCode: 1,
});

InternationalScoreReportSchema.index({
  user: 1,
  resultStatus: 1,
});

InternationalScoreReportSchema.index({
  examCode: 1,
  moduleCode: 1,
  resultStatus: 1,
});

InternationalScoreReportSchema.index({
  issuedAt: -1,
});


/* ==========================================================
   MODEL
========================================================== */

const InternationalScoreReport =
  mongoose.models.InternationalScoreReport ||
  mongoose.model(
    "InternationalScoreReport",
    InternationalScoreReportSchema
  );


module.exports = InternationalScoreReport;