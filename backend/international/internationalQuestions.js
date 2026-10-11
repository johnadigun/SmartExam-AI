
const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const InternationalQuestion =
  require("./InternationalQuestion");

const InternationalPurchase =
  require("./InternationalPurchase");

/* ==========================================================
   GET INTERNATIONAL QUESTIONS

   GET /api/international/questions/:examCode/:moduleCode/:sectionCode

   Requires authentication and valid purchased access.

   Access is granted only when:
   - The candidate owns the purchase.
   - The purchase has been verified as successful.
   - The access period is currently valid.
   - The requested examination is included in the purchase.

   Supports SINGLE and BUNDLE_3 purchases.
========================================================== */

router.get(
  "/questions/:examCode/:moduleCode/:sectionCode",
  authMiddleware,
  async (req, res) => {
    try {
      const examCode = String(
        req.params.examCode || ""
      )
        .trim()
        .toUpperCase();

      const moduleCode = String(
        req.params.moduleCode || ""
      )
        .trim()
        .toUpperCase();

      const sectionCode = String(
        req.params.sectionCode || ""
      )
        .trim()
        .toUpperCase();

      if (!examCode || !moduleCode || !sectionCode) {
        return res.status(400).json({
          success: false,
          message:
            "Exam code, module code and section code are required.",
        });
      }

      const userId =
        req.user?.id || req.user?._id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Authentication required.",
        });
      }

      /* --------------------------------------------------
         VERIFY PURCHASE AND ACCESS PERIOD
      -------------------------------------------------- */

      const now = new Date();

      const validPurchase =
        await InternationalPurchase.findOne({
          userId,
          status: "success",
          examCodes: examCode,
          accessStartsAt: { $lte: now },
          accessExpiresAt: { $gt: now },
        })
          .select("_id")
          .lean();

      if (!validPurchase) {
        return res.status(403).json({
          success: false,
          message:
            "You do not have valid access to this international examination. Please purchase access or check your access period.",
          examCode,
        });
      }

      /* --------------------------------------------------
         LOAD QUESTIONS AFTER ACCESS IS CONFIRMED
      -------------------------------------------------- */

      const questions =
        await InternationalQuestion.find({
          examCode,
          moduleCode,
          sectionCode,
          active: true,
        })
          .sort({
            questionNumber: 1,
          })
          .lean();

      return res.status(200).json(questions);
    } catch (error) {
      console.error(
        "Error loading International questions:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to load International questions.",
      });
    }
  }
);

/* ==========================================================
   EXPORT ROUTER
========================================================== */

module.exports = router;