const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    reference: {
      type: String,
      required: true,
      unique: true,
    },

    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },

    purpose: {
      type: String,
      default: "cbt_access",
    },
  },
  {
    timestamps: true,
  }
);

/*
SAFE EXPORT
Prevents:
OverwriteModelError: Cannot overwrite `Payment` model once compiled
*/

module.exports =
  mongoose.models.Payment ||
  mongoose.model("Payment", paymentSchema);