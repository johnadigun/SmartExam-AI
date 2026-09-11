
const mongoose = require("mongoose");

const examQuestionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },

    options: {
      type: [String],
      required: true,
      validate: {
        validator: function (value) {
          return (
            Array.isArray(value) &&
            value.length === 4 &&
            value.every(
              (option) =>
                typeof option === "string" &&
                option.trim().length > 0
            )
          );
        },
        message:
          "Each question must contain exactly four options.",
      },
    },

    answer: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    _id: true,
  }
);


const examSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    duration: {
      type: Number,
      required: true,
      min: 1,
    },

    category: {
      type: String,
      enum: [
        "Science",
        "Arts",
        "Social Science",
        "Commercial",
      ],
      required: true,
    },

    subject: {
      type: String,
      required: true,
      trim: true,
    },

    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      default: null,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    published: {
      type: Boolean,
      default: false,
    },

    questions: {
      type: [examQuestionSchema],
      required: true,
      validate: {
        validator: function (value) {
          return (
            Array.isArray(value) &&
            value.length > 0
          );
        },
        message:
          "An exam must contain at least one question.",
      },
    },
  },
  {
    timestamps: true,
  }
);


module.exports =
  mongoose.models.Exam ||
  mongoose.model("Exam", examSchema);