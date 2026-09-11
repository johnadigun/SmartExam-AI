const mongoose = require("mongoose");

const cbtSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    examId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
    },

    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
    },

    answers: {
      type: Map,
      of: String,
      default: {},
    },

    state: {
      type: String,
      enum: ["STARTED", "IN_PROGRESS", "SUBMITTED", "LOCKED"],
      default: "STARTED",
    },

    startTime: {
      type: Date,
      default: Date.now,
    },

    endTime: Date,

    duration: {
      type: Number,
      default: 60,
    },

    tabSwitchCount: {
      type: Number,
      default: 0,
    },

    score: {
      type: Number,
      default: 0,
    },

    grade: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// SAFE EXPORT (prevents overwrite bugs in dev mode)
module.exports =
  mongoose.models.CbtSession ||
  mongoose.model("CbtSession", cbtSessionSchema);