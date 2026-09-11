const mongoose = require("mongoose");

const schoolSchema = new mongoose.Schema(
  {
    name: String,
    code: { type: String, unique: true },

    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.school || mongoose.model("school", schoolSchema);