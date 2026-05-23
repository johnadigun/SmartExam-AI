const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema({

  userId: String,
  username: String,
  score: Number,
  total: Number,
  percent: Number,
  grade: String,
  status: String

});

module.exports = mongoose.model("Result", resultSchema);