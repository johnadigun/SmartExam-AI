const express = require("express");
const router = express.Router();

const Violation = require("../models/Violation");

router.post("/", async (req, res) => {
  try {
    const violation = await Violation.create(req.body);

    res.json({
      success: true,
      violation,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
    });
  }
});

module.exports = router;