const Result = require("../models/Result");

/* ================= SUBMIT EXAM ================= */
exports.submitResult = async (req, res) => {
  try {
    const { examId, userId, answers, score, total } = req.body;

    if (!examId || !userId) {
      return res.status(400).json({
        message: "Missing examId or userId",
      });
    }

    const result = await Result.create({
      examId,
      userId,
      answers,
      score,
      total,
      submittedAt: new Date(),
    });

    return res.status(201).json({
      message: "Result submitted successfully",
      result,
    });
  } catch (error) {
    console.log("Submit Error:", error.message);
    return res.status(500).json({
      message: "Server error submitting result",
    });
  }
};

/* ================= GET USER RESULTS ================= */
exports.getUserResults = async (req, res) => {
  try {
    const results = await Result.find({
      userId: req.params.userId,
    }).sort({ createdAt: -1 });

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: "Error fetching results" });
  }
};

/* ================= GET ALL RESULTS (ADMIN) ================= */
exports.getAllResults = async (req, res) => {
  try {
    const results = await Result.find()
      .populate("userId")
      .populate("examId")
      .sort({ createdAt: -1 });

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: "Error fetching all results" });
  }
};