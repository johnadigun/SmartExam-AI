const mongoose = require("mongoose");

/*
 * INTERNATIONAL CANDIDATE MODEL
 *
 * This model uses a dedicated MongoDB connection supplied
 * by the International authentication routes.
 *
 * It must not use the default Local CBT connection.
 */

const internationalCandidateSchema = new mongoose.Schema(
  {
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
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      default: "student",
      enum: ["student"],
    },
  },
  {
    timestamps: true,
    collection: "candidates",
  }
);

/*
 * Return the model belonging to the supplied connection.
 * Each connection keeps its models separate.
 */

function getInternationalCandidateModel(connection) {
  if (!connection) {
    throw new Error(
      "International MongoDB connection is required."
    );
  }

  return (
    connection.models.InternationalCandidate ||
    connection.model(
      "InternationalCandidate",
      internationalCandidateSchema
    )
  );
}

module.exports = getInternationalCandidateModel;