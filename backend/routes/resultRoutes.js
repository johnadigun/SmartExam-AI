const express = require("express");
const Result = require("../models/Result");

const router = express.Router();

/* SAVE RESULT */

router.post("/save", async (req, res) => {

  const result = await Result.create(req.body);

  res.json(result);

});

/* GET RESULTS */

router.get("/", async (req, res) => {

  const results = await Result.find();

  res.json(results);

});

module.exports = router;