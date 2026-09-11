const express = require("express");
const router = express.Router();

const {
  addQuestion,
} = require("../controllers/questionBankController");

// ADD SINGLE QUESTION
router.post("/add", addQuestion);

module.exports = router;