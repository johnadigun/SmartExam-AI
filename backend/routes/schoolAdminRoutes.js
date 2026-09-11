const express = require("express");
const router = express.Router();

const Exam = require("../models/exam");
const User = require("../models/user");

/* ================= CREATE EXAM ================= */
router.post("/exam/create", async (req, res) => {
  try {
    const { title, duration, schoolId, questions } = req.body;

    const exam = await Exam.create({
      title,
      duration,
      schoolId,
      questions,
    });

    res.json({
      success: true,
      exam,
    });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

/* ================= GET SCHOOL EXAMS ================= */
router.get("/exams/:schoolId", async (req, res) => {
  const exams = await Exam.find({
    schoolId: req.params.schoolId,
  });

  res.json({ success: true, exams });
});

module.exports = router;