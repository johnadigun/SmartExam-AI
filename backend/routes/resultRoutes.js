
const express = require("express");
const router = express.Router();

const Result = require("../models/result");
const User = require("../models/user");

const authMiddleware = require("../middleware/authMiddleware");
const adminAuth = require("../middleware/adminAuth");

/* ==========================================================
   SUBMIT CBT RESULT
   POST /api/results/submit
========================================================== */

router.post(
  "/submit",
  authMiddleware,
  async (req, res) => {
    try {
      const {
        examTitle,
        score,
        total,
        percentage,
        schoolId,
        grade,
      } = req.body;

      /* ======================================================
         AUTHENTICATED USER
      ====================================================== */

      const authenticatedUserId = req.user?.id;

      if (!authenticatedUserId) {
        return res.status(401).json({
          success: false,
          message: "Authenticated user not found.",
        });
      }

      /* ======================================================
         BASIC VALIDATION
      ====================================================== */

      if (!examTitle || !examTitle.trim()) {
        return res.status(400).json({
          success: false,
          message: "Exam title is required.",
        });
      }

      const numericScore = Number(score);
      const numericTotal = Number(total);
      const numericPercentage = Number(percentage);

      if (
        !Number.isFinite(numericScore) ||
        !Number.isFinite(numericTotal) ||
        !Number.isFinite(numericPercentage)
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid result values.",
        });
      }

      if (
        numericTotal < 0 ||
        numericScore < 0 ||
        numericScore > numericTotal
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid score or total.",
        });
      }

      if (
        numericPercentage < 0 ||
        numericPercentage > 100
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid percentage.",
        });
      }

      /* ======================================================
         VERIFY USER
      ====================================================== */

      const user = await User.findById(
        authenticatedUserId
      );

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found.",
        });
      }

      /* ======================================================
         PREVENT DUPLICATE FINAL SUBMISSION
      ====================================================== */

      if (user.examTaken) {
        return res.status(409).json({
          success: false,
          message:
            "This CBT examination has already been completed.",
        });
      }

      /* ======================================================
         CALCULATE SERVER-SIDE PERCENTAGE
      ====================================================== */

      const calculatedPercentage =
        numericTotal > 0
          ? Math.round(
              (numericScore / numericTotal) * 100
            )
          : 0;

      if (
        numericPercentage !==
        calculatedPercentage
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Result percentage does not match the score.",
        });
      }

      /* ======================================================
         DETERMINE CERTIFICATE ELIGIBILITY

         PASS = 50% OR ABOVE
         FAIL = BELOW 50%
      ====================================================== */

      const certificateIssued =
        calculatedPercentage >= 50;

      /* ======================================================
         SAVE RESULT
      ====================================================== */

      const result = await Result.create({
        userId: authenticatedUserId,
        examTitle: examTitle.trim(),
        score: numericScore,
        total: numericTotal,
        percentage: calculatedPercentage,
        grade: grade || "",
        schoolId:
          schoolId ||
          user.schoolId ||
          null,
      });

      /* ======================================================
         END CBT SESSION
      ====================================================== */

      user.examTaken = true;
      user.remainingAttempts = 0;
      user.cbtAccess = false;
      user.isPaid = false;
      user.cbtExpiry = null;

      user.score = numericScore;
      user.grade = grade || "";

      /* ======================================================
         CERTIFICATE STATUS

         Passed CBT  -> Certificate Available
         Failed CBT  -> Certificate Not Available
      ====================================================== */

      user.certificateIssued = certificateIssued;

      await user.save();

      /* ======================================================
         SUCCESS
      ====================================================== */

      return res.status(201).json({
        success: true,
        message: "Result saved successfully.",
        result,
        certificateIssued,
      });

    } catch (err) {
      console.error(
        "SUBMIT RESULT ERROR:",
        err
      );

      return res.status(500).json({
        success: false,
        message: "Failed to save result.",
      });
    }
  }
);


/* ==========================================================
   USER RESULTS
   GET /api/results/my-results/:userId
========================================================== */

router.get(
  "/my-results/:userId",
  authMiddleware,
  async (req, res) => {
    try {
      const authenticatedUserId =
        req.user?.id;

      const requestedUserId =
        req.params.userId;

      if (!authenticatedUserId) {
        return res.status(401).json({
          success: false,
          message: "Authentication required.",
        });
      }

      /*
       * A student may only access their own
       * result history.
       *
       * Administrators are handled separately
       * through the protected admin endpoint.
       */

      if (
        String(authenticatedUserId) !==
        String(requestedUserId)
      ) {
        return res.status(403).json({
          success: false,
          message:
            "Access denied. You can only view your own results.",
        });
      }

      const results = await Result.find({
        userId: authenticatedUserId,
      }).sort({
        createdAt: -1,
      });

      return res.json({
        success: true,
        results,
      });

    } catch (err) {
      console.error(
        "MY RESULTS ERROR:",
        err
      );

      return res.status(500).json({
        success: false,
        message: "Failed to fetch user results.",
      });
    }
  }
);


/* ==========================================================
   ADMIN RESULTS
   GET /api/results/admin/all

   Protected by adminAuth.
========================================================== */

router.get(
  "/admin/all",
  adminAuth,
  async (req, res) => {
    try {
      const results = await Result.find()
        .populate(
          "userId",
          "email firstName lastName"
        )
        .sort({
          createdAt: -1,
        });

      return res.json({
        success: true,
        results,
      });

    } catch (err) {
      console.error(
        "ADMIN RESULTS ERROR:",
        err
      );

      return res.status(500).json({
        success: false,
        message: "Failed to fetch results.",
      });
    }
  }
);


module.exports = router;
