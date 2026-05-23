const express = require("express");
const Exam = require("../models/Exam");

const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

/* 🧑‍🏫 CREATE EXAM (ADMIN ONLY) */

router.post("/create", protect, adminOnly, async (req, res) => {

  const exam = await Exam.create(req.body);

  res.json({ success: true, exam });

});

module.exports = router;