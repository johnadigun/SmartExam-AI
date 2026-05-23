const mongoose = require("mongoose");

const examSchema = new mongoose.Schema({

  title: String,
  type: String, // science | arts | social
  duration: Number,
  questions: [
    {
      question: String,
      options: [String],
      answer: String
    }
  ]

});

module.exports = mongoose.model("Exam", examSchema);