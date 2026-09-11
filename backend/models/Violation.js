const mongoose = require("mongoose");

const violationSchema = new mongoose.Schema({
  userId: String,
  examTitle: String,
  reason: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model(
  "Violation",
  violationSchema
);