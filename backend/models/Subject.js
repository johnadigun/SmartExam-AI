const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },

    code: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Subject ||
  mongoose.model("Subject", subjectSchema);