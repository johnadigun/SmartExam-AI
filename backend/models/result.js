const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      default: null,
    },

    examTitle: {
      type: String,
      required: true,
    },

    score: {
      type: Number,
      default: 0,
    },

    total: {
      type: Number,
      default: 0,
    },

    grade: {
      type: String,
      default: "",
    },

    percentage: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.models.Result ||
  mongoose.model("Result", resultSchema);