const express = require("express");

const router = express.Router();

const InternationalExam = require("./InternationalExam");

/* ==========================================================
   GET ACTIVE INTERNATIONAL EXAMINATIONS

   GET /api/international/exams

   Returns all active International examinations.
========================================================== */

router.get("/exams", async (req, res) => {
  try {
    const exams = await InternationalExam.find({
      active: true,
    })
      .select(
        "code name fullName description provider examType"
      )
      .sort({
        name: 1,
      })
      .lean();

    res.status(200).json(exams);

  } catch (error) {
    console.error(
      "Error loading International examinations:",
      error
    );

    res.status(500).json({
      message:
        "Unable to load International examinations.",
      error: error.message,
    });
  }
});

/* ==========================================================
   GET ONE INTERNATIONAL EXAMINATION

   GET /api/international/exams/:examCode

   Returns the selected International examination,
   including its modules and sections.
========================================================== */

router.get(
  "/exams/:examCode",
  async (req, res) => {
    try {
      const examCode =
        String(req.params.examCode || "")
          .trim()
          .toUpperCase();

      if (!examCode) {
        return res.status(400).json({
          message:
            "International examination code is required.",
        });
      }

      const exam =
        await InternationalExam.findOne({
          code: examCode,
          active: true,
        })
          .lean();

      if (!exam) {
        return res.status(404).json({
          message:
            "International examination not found.",
        });
      }

      res.status(200).json(exam);

    } catch (error) {
      console.error(
        "Error loading International examination:",
        error
      );

      res.status(500).json({
        message:
          "Unable to load the International examination.",
        error: error.message,
      });
    }
  }
);

/* ==========================================================
   EXPORT ROUTER
========================================================== */

module.exports = router;