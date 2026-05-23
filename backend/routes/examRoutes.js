const express = require("express");
const Exam = require("../models/Exam");

const { protect, paidCBTOnly } = require("../middleware/authMiddleware");

const router = express.Router();

/* 🔐 PROTECTED CBT EXAMS */

router.get("/cbt/:type", protect, paidCBTOnly, async (req, res) => {

  const exams = await Exam.find({ type: req.params.type });

  res.json(exams);

});

module.exports = router;