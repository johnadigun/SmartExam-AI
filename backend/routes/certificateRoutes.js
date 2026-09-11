const express = require("express");
const router = express.Router();

const Certificate = require("../models/certificate");
const generateCertificate = require("../utils/generateCertificate");

// ================= ISSUE CERTIFICATE =================
router.get("/generate/:resultId", async (req, res) => {
  try {
    const Result = require("../models/result");

    const result = await Result.findById(req.params.resultId)
      .populate("userId")
      .populate("schoolId");

    if (!result) {
      return res.status(404).json({ message: "Result not found" });
    }

    const certificateId =
      "CERT-" + Date.now();

    // SAVE CERTIFICATE
    const cert = await Certificate.create({
      certificateId,
      userId: result.userId._id,
      schoolId: result.schoolId,
      examTitle: result.examTitle,
      score: result.score,
      total: result.total,
      grade: result.grade,
    });

    // GENERATE PDF
    return generateCertificate(
      {
        certificateId: cert.certificateId,
        studentName: result.userId.name,
        schoolName: result.schoolId?.name || "SaaS School",
        examTitle: result.examTitle,
        score: result.score,
        total: result.total,
        grade: result.grade,
      },
      res
    );
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Certificate error" });
  }
});

module.exports = router;