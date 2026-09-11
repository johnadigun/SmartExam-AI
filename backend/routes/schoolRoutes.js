const express = require("express");
const router = express.Router();

const School = require("../models/school");

// ================= CREATE SCHOOL =================
router.post("/register", async (req, res) => {
  try {
    const { name, email } = req.body;

    const school = await School.create({
      name,
      email,
    });

    res.json({
      success: true,
      school,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "School creation failed",
    });
  }
});

module.exports = router;