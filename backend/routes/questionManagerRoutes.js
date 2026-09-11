
const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");

const Question = require("../models/Question");
const adminAuth = require("../middleware/adminAuth");

console.log(
  "QUESTION MANAGER ROUTE LOADED"
);

/* ==========================================================
   QUESTION VALIDATION HELPER
========================================================== */

const normalizeQuestionData = (data) => {
  const {
    subject,
    category,
    question,
    options,
    answer,
    year,
    exam,
    difficulty = "medium",
  } = data;

  const normalizedSubject =
    String(subject || "").trim();

  const normalizedCategory =
    String(category || "").trim();

  const normalizedQuestion =
    String(question || "").trim();

  const normalizedAnswer =
    String(answer || "").trim();

  if (
    !normalizedSubject ||
    !normalizedQuestion ||
    !normalizedAnswer
  ) {
    throw new Error(
      "Subject, question and answer are required."
    );
  }

  if (
    !Array.isArray(options) ||
    options.length !== 4
  ) {
    throw new Error(
      "Exactly four options are required."
    );
  }

  const normalizedOptions =
    options.map((option) =>
      String(option || "").trim()
    );

  if (
    normalizedOptions.some(
      (option) => !option
    )
  ) {
    throw new Error(
      "All four options must contain text."
    );
  }

  const uniqueOptions =
    new Set(
      normalizedOptions.map(
        (option) =>
          option.toLowerCase()
      )
    );

  if (
    uniqueOptions.size !== 4
  ) {
    throw new Error(
      "The four options must be unique."
    );
  }

  if (
    !normalizedOptions.includes(
      normalizedAnswer
    )
  ) {
    throw new Error(
      "The answer must match one of the four options."
    );
  }

  return {
    subject:
      normalizedSubject,

    category:
      normalizedCategory,

    question:
      normalizedQuestion,

    options:
      normalizedOptions,

    answer:
      normalizedAnswer,

    year,

    exam,

    difficulty:
      String(
        difficulty || "medium"
      ).trim() || "medium",
  };
};

/* ==========================================================
   GET ALL QUESTIONS
   ADMINISTRATORS ONLY
========================================================== */

router.get(
  "/",
  adminAuth,
  async (req, res) => {
    try {
      console.log(
        ">>> GET /api/questions HIT <<<"
      );

      const questions =
        await Question.find()
          .sort({
            subject: 1,
            category: 1,
          });

      return res.status(200).json({
        success: true,
        total:
          questions.length,
        questions,
      });

    } catch (err) {
      console.error(
        "GET QUESTIONS ERROR:",
        err
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to fetch questions.",
      });
    }
  }
);

/* ==========================================================
   ADD QUESTION
   ADMINISTRATORS ONLY
========================================================== */

router.post(
  "/",
  adminAuth,
  async (req, res) => {
    try {
      const normalizedQuestion =
        normalizeQuestionData(
          req.body
        );

      const duplicate =
        await Question.findOne({
          subject:
            normalizedQuestion.subject,

          question:
            normalizedQuestion.question,
        });

      if (duplicate) {
        return res.status(409).json({
          success: false,
          message:
            "Question already exists.",
        });
      }

      const newQuestion =
        await Question.create(
          normalizedQuestion
        );

      return res.status(201).json({
        success: true,
        message:
          "Question added successfully.",
        question:
          newQuestion,
      });

    } catch (err) {
      console.error(
        "ADD QUESTION ERROR:",
        err
      );

      return res.status(400).json({
        success: false,
        message:
          err.message ||
          "Unable to add question.",
      });
    }
  }
);

/* ==========================================================
   UPDATE QUESTION
   ADMINISTRATORS ONLY
========================================================== */

router.put(
  "/:id",
  adminAuth,
  async (req, res) => {
    try {
      const {
        id,
      } = req.params;

      if (
        !mongoose.Types.ObjectId.isValid(
          id
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid question ID.",
        });
      }

      const existingQuestion =
        await Question.findById(id);

      if (!existingQuestion) {
        return res.status(404).json({
          success: false,
          message:
            "Question not found.",
        });
      }

      const normalizedQuestion =
        normalizeQuestionData(
          req.body
        );

      const duplicate =
        await Question.findOne({
          _id: {
            $ne: id,
          },

          subject:
            normalizedQuestion.subject,

          question:
            normalizedQuestion.question,
        });

      if (duplicate) {
        return res.status(409).json({
          success: false,
          message:
            "Another question with the same subject and question already exists.",
        });
      }

      const updated =
        await Question.findByIdAndUpdate(
          id,
          normalizedQuestion,
          {
            new: true,
            runValidators: true,
          }
        );

      return res.json({
        success: true,
        message:
          "Question updated successfully.",
        question:
          updated,
      });

    } catch (err) {
      console.error(
        "UPDATE QUESTION ERROR:",
        err
      );

      return res.status(400).json({
        success: false,
        message:
          err.message ||
          "Unable to update question.",
      });
    }
  }
);

/* ==========================================================
   DELETE QUESTION
   ADMINISTRATORS ONLY
========================================================== */

router.delete(
  "/:id",
  adminAuth,
  async (req, res) => {
    try {
      const {
        id,
      } = req.params;

      if (
        !mongoose.Types.ObjectId.isValid(
          id
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid question ID.",
        });
      }

      const deleted =
        await Question.findByIdAndDelete(
          id
        );

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message:
            "Question not found.",
        });
      }

      return res.json({
        success: true,
        message:
          "Question deleted successfully.",
      });

    } catch (err) {
      console.error(
        "DELETE QUESTION ERROR:",
        err
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to delete question.",
      });
    }
  }
);

module.exports =
  router;