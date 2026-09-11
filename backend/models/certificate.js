const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema(
  {
    certificateId: {
      type: String,
      unique: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
    },

    examTitle: String,
    score: Number,
    total: Number,
    grade: String,

    issuedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Certificate", certificateSchema);