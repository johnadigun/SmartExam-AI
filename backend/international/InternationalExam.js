const mongoose = require("mongoose");

/* ==========================================================
   INTERNATIONAL EXAMINATION SCHEMA
========================================================== */

const InternationalModuleSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    active: {
      type: Boolean,
      default: true,
    },

    /* ======================================================
       MODULE-SPECIFIC SECTIONS
    ====================================================== */

    sections: [
      {
        code: {
          type: String,
          required: true,
          trim: true,
          uppercase: true,
        },

        name: {
          type: String,
          required: true,
          trim: true,
        },

        description: {
          type: String,
          default: "",
          trim: true,
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

        active: {
          type: Boolean,
          default: true,
        },
      },
    ],
  },
  {
    _id: false,
  }
);


/* ==========================================================
   INTERNATIONAL EXAMINATION
========================================================== */

const InternationalExamSchema = new mongoose.Schema(
  {
    /* ======================================================
       BASIC INFORMATION
    ====================================================== */

    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    provider: {
      type: String,
      default: "",
      trim: true,
    },

    /* ======================================================
       EXAMINATION TYPE
    ====================================================== */

    examType: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },

    /* ======================================================
       STATUS
    ====================================================== */

    active: {
      type: Boolean,
      default: true,
    },

    /* ======================================================
       MODULES / TEST TYPES
    ====================================================== */

    modules: {
      type: [InternationalModuleSchema],
      default: [],
    },

    /* ======================================================
       SCORING CONFIGURATION
    ====================================================== */

    scoring: {
      type: {
        type: String,
        required: true,
        trim: true,
        uppercase: true,
      },

      passingScore: {
        type: Number,
        default: null,
      },

      maximumScore: {
        type: Number,
        default: null,
      },

      minimumScore: {
        type: Number,
        default: null,
      },

      description: {
        type: String,
        default: "",
        trim: true,
      },
    },
  },
  {
    timestamps: true,
  }
);


/* ==========================================================
   INDEXES
========================================================== */

InternationalExamSchema.index({
  code: 1,
});

InternationalExamSchema.index({
  active: 1,
});

InternationalExamSchema.index({
  examType: 1,
  active: 1,
});


/* ==========================================================
   MODEL
========================================================== */

const InternationalExam =
  mongoose.models.InternationalExam ||
  mongoose.model(
    "InternationalExam",
    InternationalExamSchema
  );


module.exports = InternationalExam;