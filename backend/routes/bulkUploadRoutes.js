const express = require("express");
const multer = require("multer");

const QuestionBank = require("../models/QuestionBank");

const router = express.Router();

/* =====================================================
   MULTER CONFIGURATION
===================================================== */

const storage = multer.memoryStorage();

const upload = multer({
  storage,
});

/* =====================================================
   BULK QUESTION UPLOAD
===================================================== */

router.post(
  "/",
  upload.single("file"),
  async (req, res) => {
    try {
      const {
        subject,
        category,
        examBoard = "SCHOOL",
      } = req.body;

      /* -----------------------------
         VALIDATION
      ------------------------------ */

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No JSON file uploaded.",
        });
      }

      if (!subject) {
        return res.status(400).json({
          success: false,
          message: "Subject is required.",
        });
      }

      if (!category) {
        return res.status(400).json({
          success: false,
          message: "Category is required.",
        });
      }

      /* -----------------------------
         PARSE JSON
      ------------------------------ */

      let questions = [];

      try {
        questions = JSON.parse(
          req.file.buffer.toString("utf8")
        );
      } catch (err) {
        return res.status(400).json({
          success: false,
          message: "Invalid JSON format.",
        });
      }

      if (!Array.isArray(questions)) {
        return res.status(400).json({
          success: false,
          message:
            "JSON root must be an array of questions.",
        });
      }

      /* -----------------------------
         FIND OR CREATE QUESTION BANK
      ------------------------------ */

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
      }

      /* -----------------------------
         IMPORT COUNTERS
      ------------------------------ */

      let imported = 0;
      let skipped = 0;

      /* -----------------------------
         START IMPORT
      ------------------------------ */

      for (const item of questions) {
        if (
          !item.question ||
          !Array.isArray(item.options) ||
          item.options.length < 2 ||
          !item.answer
        ) {
          skipped++;
          continue;
        }

        const duplicate = bank.questions.find(
          (q) =>
            q.question.trim().toLowerCase() ===
            item.question.trim().toLowerCase()
        );

        if (duplicate) {
          skipped++;
          continue;
        }

        bank.questions.push({
          question: item.question,
          options: item.options,
          answer: item.answer,
          difficulty:
            item.difficulty || "medium",
        });

        imported++;
      }
      /* -----------------------------
         SAVE QUESTION BANK
      ------------------------------ */

      await bank.save();

      /* -----------------------------
         RESPONSE
      ------------------------------ */

      return res.status(200).json({
        success: true,
        message: "Bulk upload completed successfully.",
        summary: {
          subject,
          category,
          examBoard,
          total: questions.length,
          imported,
          skipped,
        },
      });

    } catch (err) {

      console.error("Bulk Upload Error:", err);

      return res.status(500).json({
        success: false,
        message: err.message || "Internal Server Error",
      });

    }
  }
);

/* =====================================================
   EXPORT ROUTER
===================================================== */

module.exports = router;