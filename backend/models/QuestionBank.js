const mongoose = require("mongoose");

const questionBankSchema = new mongoose.Schema({
  schoolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "School",
    required: true,
  },

  examBoard: {
    type: String,
    enum: ["JAMB", "WAEC", "NECO", "SCHOOL"],
    default: "SCHOOL",
  },

  subject: {
    type: String,
    required: true,
  },

  category: {
    type: String,
    enum: ["Science", "Arts", "SocialScience", "General"],
    required: true,
  },

  year: {
    type: Number,
    default: null,
  },

  questions: [
    {
      question: String,
      options: [String],
      answer: String,

      difficulty: {
        type: String,
        default: "medium",
      },
    },
  ],

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports =
  mongoose.models.QuestionBank ||
  mongoose.model("QuestionBank", questionBankSchema);