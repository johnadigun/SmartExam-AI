const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      default: "",
    },

    question: {
      type: String,
      required: true,
    },

    options: {
      type: [String],
      required: true,
    },

    answer: {
      type: String,
      required: true,
    },

    year: {
      type: String,
      default: "",
    },

    exam: {
      type: String,
      default: "",
    },

    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Question ||
  mongoose.model("Question", questionSchema);