
const mongoose = require("mongoose");

/* ==========================================================
   SMARTEXAM INTERNATIONAL — PURCHASE SCHEMA

   Separate from the existing Local CBT payment system.

   The pricing snapshot preserves the USD reference price
   and exchange rate used when the purchase was initialized.
========================================================== */

const InternationalPurchaseSchema = new mongoose.Schema(
  {
    /* ======================================================
       CANDIDATE
    ====================================================== */

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    /* ======================================================
       PURCHASED EXAMINATIONS
    ====================================================== */

    examCodes: {
      type: [
        {
          type: String,
          required: true,
          trim: true,
          uppercase: true,
        },
      ],
      required: true,
      validate: {
        validator: function (codes) {
          if (!Array.isArray(codes) || codes.length === 0) {
            return false;
          }

          const normalizedCodes = codes.map((code) =>
            String(code).trim().toUpperCase()
          );

          return (
            normalizedCodes.every(Boolean) &&
            new Set(normalizedCodes).size ===
              normalizedCodes.length
          );
        },
        message:
          "At least one unique examination code is required.",
      },
    },

    /* ======================================================
       PAYMENT DETAILS

       amount: amount charged by Paystack.
       currency: NGN for the international checkout.
    ====================================================== */

    amount: {
      type: Number,
      required: true,
      min: 1,
    },

    currency: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      enum: ["USD", "NGN"],
      default: "NGN",
    },

    reference: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
      index: true,
    },

    /* ======================================================
       PRICING SNAPSHOT

       These values record the pricing used for this
       particular purchase. Later rate changes must not
       alter the original purchase record.
    ====================================================== */

    packageCode: {
      type: String,
      trim: true,
      uppercase: true,
      enum: ["SINGLE", "BUNDLE_3"],
      required: true,
    },

    usdReferencePrice: {
      type: Number,
      required: true,
      min: 0.01,
    },

    exchangeRate: {
      type: Number,
      required: true,
      min: 0.000001,
    },

    exchangeRateDate: {
      type: String,
      required: true,
      match: /^\d{4}-\d{2}-\d{2}$/,
    },

    exchangeRateProvider: {
      type: String,
      required: true,
      trim: true,
    },

    accessDays: {
      type: Number,
      required: true,
      min: 1,
      validate: {
        validator: Number.isInteger,
        message:
          "Access duration must be a whole number of days.",
      },
    },

    examCount: {
      type: Number,
      required: true,
      min: 1,
      validate: {
        validator: Number.isInteger,
        message:
          "Examination count must be a whole number.",
      },
    },

    /* ======================================================
       PURCHASE AND ACCESS PERIOD
    ====================================================== */

    purchasedAt: {
      type: Date,
      default: null,
    },

    accessStartsAt: {
      type: Date,
      default: null,
    },

    accessExpiresAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

/* ==========================================================
   INDEXES
========================================================== */

InternationalPurchaseSchema.index({
  userId: 1,
  status: 1,
});

InternationalPurchaseSchema.index({
  userId: 1,
  examCodes: 1,
  status: 1,
});

/* ==========================================================
   MODEL
========================================================== */

const InternationalPurchase =
  mongoose.models.InternationalPurchase ||
  mongoose.model(
    "InternationalPurchase",
    InternationalPurchaseSchema
  );

module.exports = InternationalPurchase;

