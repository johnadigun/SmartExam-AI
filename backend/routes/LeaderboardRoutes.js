const express = require("express");
const Result = require("../models/Result");

const router = express.Router();

/* TOP STUDENTS */

router.get("/", async (req, res) => {

  const leaderboard = await Result.find()
    .sort({ score: -1 })
    .limit(10);

  res.json(leaderboard);

});

module.exports = router;