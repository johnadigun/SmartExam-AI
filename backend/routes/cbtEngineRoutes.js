const express = require("express");
const router = express.Router();
const Exam = require("../models/exam");

/* ================= START CBT ================= */
router.post("/start", async (req, res) => {
  try {
    console.log("CBT START HIT:", req.body);

    const { userId, subject } = req.body;

    if (!userId || !subject) {
      return res.status(400).json({
        success: false,
        message: "Missing userId or subject",
      });
    }

    // 🔥 NEW: find exam by subject instead of ID
    const exam = await Exam.findOne({ subject });

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "No exam found for this subject",
      });
    }

    return res.json({
      success: true,
      sessionId: "CBT_" + Date.now(),
      exam,
    });

  } catch (err) {
    console.log("CBT ERROR:", err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

/* ================= SAVE ANSWER ================= */
router.post("/save", async (req, res) => {
  try {
    return res.json({
      success: true,
      message: "Answer saved",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

/* ================= SUBMIT CBT ================= */
router.post("/submit", async (req, res) => {
  try {
    const { examId, userId, answers } = req.body;

    console.log("SUBMIT RECEIVED:", req.body);

    const exam = await Exam.findById(examId);

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found",
      });
    }

    let score = 0;

    exam.questions.forEach((q) => {
      if (answers?.[q._id] === q.answer) {
        score++;
      }
    });

    return res.json({
      success: true,
      score,
      total: exam.questions.length,
      grade:
        score >= 80 ? "A" :
        score >= 60 ? "B" :
        score >= 50 ? "C" : "F",
    });

  } catch (err) {
    console.log("SUBMIT ERROR:", err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = router;
