const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(

  {

    /* ======================================================
       BASIC DETAILS
    ====================================================== */

    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    middleName: {
      type: String,
      default: "",
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      default: "",
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    /* ======================================================
       ROLE
    ====================================================== */

    role: {
      type: String,
      enum: [
        "student",
        "school-admin",
        "super-admin",
      ],
      default: "student",
    },

    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      default: null,
    },

    /* ======================================================
       PAYMENT
    ====================================================== */

    isPaid: {
      type: Boolean,
      default: false,
    },

    /* ======================================================
       CBT ACCESS
    ====================================================== */

    cbtAccess: {
      type: Boolean,
      default: false,
    },

    cbtExpiry: {
      type: Date,
      default: null,
    },

    remainingAttempts: {
      type: Number,
      default: 0,
    },

    /* ======================================================
       CBT RECORD
    ====================================================== */

    examTaken: {
      type: Boolean,
      default: false,
    },

    certificateIssued: {
      type: Boolean,
      default: false,
    },

    score: {
      type: Number,
      default: 0,
    },

    grade: {
      type: String,
      default: "",
    },

  },

  {
    timestamps: true,
  }

);

/* ==========================================================
   SAFE EXPORT
========================================================== */

module.exports =
  mongoose.models.User ||
  mongoose.model("User", userSchema);