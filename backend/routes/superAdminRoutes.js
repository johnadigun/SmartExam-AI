const express = require("express");
const router = express.Router();

const School = require("../models/school");
const User = require("../models/user");

/* ================= CREATE SCHOOL ================= */
router.post("/school/create", async (req, res) => {
  try {
    const { name, code } = req.body;

    const school = await School.create({
      name,
      code,
    });

    res.json({
      success: true,
      school,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ================= ASSIGN ADMIN ================= */
router.post("/school/assign-admin", async (req, res) => {
  try {
    const { schoolId, adminId } = req.body;

    const school = await School.findByIdAndUpdate(schoolId, {
      adminId,
    });

    await User.findByIdAndUpdate(adminId, {
      role: "school-admin",
      schoolId,
    });

    res.json({
      success: true,
      message: "Admin assigned",
    });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

/* ================= GET ALL SCHOOLS ================= */
router.get("/schools", async (req, res) => {
  const schools = await School.find();
  res.json({ success: true, schools });
});

module.exports = router;