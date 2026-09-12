const express = require("express");
const router = express.Router();

const User = require("../models/user");
const Exam = require("../models/exam");
const CbtSession = require("../models/cbtSession");

// ================= SUPER ADMIN DASHBOARD =================
router.get("/dashboard", async (req, res) => {
  try {
    const users = await User.countDocuments();
    const exams = await Exam.countDocuments();
    const sessions = await CbtSession.countDocuments();

    const activeSessions = await CbtSession.countDocuments({
      state: "IN_PROGRESS",
    });

    return res.json({
      success: true,
      stats: {
        users,
        exams,
        sessions,
        activeSessions,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false });
  }
});

// ================= SCHOOL ANALYTICS =================
router.get("/school/:schoolId", async (req, res) => {
  try {
    const { schoolId } = req.params;

    const users = await User.countDocuments({ schoolId });
    const exams = await Exam.countDocuments({ schoolId });
    const sessions = await CbtSession.countDocuments({ schoolId });

    const passed = await CbtSession.countDocuments({
      schoolId,
      state: "SUBMITTED",
      score: { $gte: 50 },
    });

    const failed = await CbtSession.countDocuments({
      schoolId,
      state: "SUBMITTED",
      score: { $lt: 50 },
    });

    return res.json({
      success: true,
      stats: {
        users,
        exams,
        sessions,
        passed,
        failed,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false });
  }
});

// ================= CHEATING REPORTS =================
router.get("/cheating", async (req, res) => {
  try {
    const flagged = await CbtSession.find({
      tabSwitchCount: { $gte: 3 },
    }).populate("userId examId");

    return res.json({
      success: true,
      flagged,
    });
  } catch (err) {
    return res.status(500).json({ success: false });
  }
});

// ================= USER MANAGEMENT =================
router.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("-password");

    return res.json({
      success: true,
      users,
    });
  } catch (err) {
    return res.status(500).json({ success: false });
  }
});

// ================= EXAM MANAGEMENT =================
router.get("/exams", async (req, res) => {
  try {
    const exams = await Exam.find();

    return res.json({
      success: true,
      exams,
    });
  } catch (err) {
    return res.status(500).json({ success: false });
  }
});

module.exports = router;
