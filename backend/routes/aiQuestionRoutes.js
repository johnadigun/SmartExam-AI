
const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  generateQuestions,
} = require("../controllers/aiQuestionController");

/*
==========================================================
SMARTEXAM CBT SYSTEM
ADMIN AI QUESTION ROUTES
==========================================================
*/

router.post(
  "/generate-questions",
  authMiddleware,
  generateQuestions
);

module.exports = router;