const express = require("express");
const multer = require("multer");

const QuestionBank = require("../models/QuestionBank");

const router = express.Router();

/* ==========================================
   MULTER (MEMORY STORAGE)
========================================== */

const storage = multer.memoryStorage();

const upload = multer({
  storage,
});

/* ==========================================
   BULK QUESTION IMPORT
========================================== */

router.post(
  "/",
  upload.single("file"),
  async (req, res) => {

    try {

      const {
        subject,
        category,
        examBoard,
      } = req.body;

      if (!req.file) {

        return res.status(400).json({
          success: false,
          message: "No file uploaded.",
        });

      }

      if (!subject || !category) {

        return res.status(400).json({
          success: false,
          message:
            "Subject and Category are required.",
        });

      }

      const jsonText =
        req.file.buffer.toString("utf8");

      let questions;

      try {

        questions = JSON.parse(jsonText);

      } catch (err) {

        return res.status(400).json({
          success: false,
          message: "Invalid JSON file.",
        });

      }

      if (!Array.isArray(questions)) {

        return res.status(400).json({
          success: false,
          message:
            "JSON must contain an array.",
        });

      }

      let bank = await QuestionBank.findOne({
        subject,
        category,
        examBoard,
      });

      if (!bank) {

        bank = new QuestionBank({

          schoolId: null,

          subject,

          category,

          examBoard,

          questions: [],

        });

      /* ==========================================
         IMPORT QUESTIONS
      ========================================== */

      questions.forEach((item) => {

        if (
          !item.question ||
          !item.options ||
          !Array.isArray(item.options) ||
          !item.answer
        ) {

          skipped++;
          return;

        }

        const duplicate = bank.questions.find((q) => {

          return (
            q.question.trim().toLowerCase() ===
            item.question.trim().toLowerCase()
          );

        });

        if (duplicate) {

          skipped++;
          return;

        }

        bank.questions.push({

          question: item.question,

          options: item.options,

          answer: item.answer,

          difficulty:
            item.difficulty || "medium",

        });

        imported++;

      });

      /* ==========================================
         SAVE
      ========================================== */

      await bank.save();

      return res.json({

        success: true,

        message: "Bulk upload completed.",

        summary: {

          imported,

          skipped,

          total: questions.length,

          subject,

          category,

          examBoard,

        },

      });

    } catch (err) {

      console.error(err);

      return res.status(500).json({

        success: false,

        message: err.message,

      });

    }

  }
);

/* ==========================================
   EXPORT
========================================== */

module.exports = router;

      