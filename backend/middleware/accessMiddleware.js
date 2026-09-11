
const User = require("../models/user");

/**
 * ==========================================================
 * CBT ACCESS + ROLE + EXPIRY CONTROL
 * ==========================================================
 *
 * Uses cbtExpiry as the single source of truth.
 *
 * CBT ACCESS PERIOD:
 * 5 HOURS
 *
 * The expiry is stored in MongoDB, so it continues to work
 * even if the Node.js server is shut down.
 *
 * ==========================================================
 */

const accessMiddleware = async (req, res, next) => {
  try {

    // ======================================================
    // GET USER ID
    // ======================================================

    const userId =
      req.body?.userId ||
      req.params?.userId ||
      req.query?.userId ||
      req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User ID missing",
      });
    }

    // ======================================================
    // FIND USER
    // ======================================================

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ======================================================
    // CHECK CBT ACCESS
    // ======================================================

    if (!user.cbtAccess) {
      return res.status(403).json({
        success: false,
        message:
          "CBT access not activated. Please complete payment.",
      });
    }

    // ======================================================
    // CHECK CBT EXPIRY
    // ======================================================

    if (user.cbtExpiry) {

      const expiryTime =
        new Date(user.cbtExpiry).getTime();

      const currentTime =
        Date.now();

      // ====================================================
      // ACCESS HAS EXPIRED
      // ====================================================

      if (currentTime >= expiryTime) {

        user.cbtAccess = false;

        user.isPaid = false;

        user.cbtExpiry = null;

        user.remainingAttempts = 0;

        await user.save();

        return res.status(403).json({
          success: false,
          message:
            "CBT access expired. Please make a new payment.",
        });
      }
    }

    // ======================================================
    // CHECK REMAINING ATTEMPT
    // ======================================================

    if (
      user.remainingAttempts !== undefined &&
      user.remainingAttempts <= 0
    ) {

      user.cbtAccess = false;

      user.isPaid = false;

      user.cbtExpiry = null;

      await user.save();

      return res.status(403).json({
        success: false,
        message:
          "No CBT attempts remaining.",
      });
    }

    // ======================================================
    // CHECK COMPLETED EXAM
    // ======================================================

    if (user.examTaken) {
      return res.status(403).json({
        success: false,
        message:
          "CBT examination already completed.",
      });
    }

    // ======================================================
    // ATTACH USER
    // ======================================================

    req.user = user;

    next();

  } catch (err) {

    console.error(
      "ACCESS MIDDLEWARE ERROR:",
      err
    );

    return res.status(500).json({
      success: false,
      message:
        "CBT access verification failed.",
    });
  }
};

module.exports = accessMiddleware;