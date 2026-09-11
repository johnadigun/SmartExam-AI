
const User = require("../models/user");

/*
==========================================================

CBT GUARD MIDDLEWARE

Protects CBT examination routes.

Checks:

✓ Authenticated user
✓ User exists
✓ CBT access
✓ CBT expiry
✓ Remaining attempts
✓ Previous examination completion

IMPORTANT:

cbtExpiry is the single source of truth for the
5-hour CBT access period.

The calculation uses Date.now(), so expiry works
even when the server has been shut down.

==========================================================
*/

const cbtGuard = async (req, res, next) => {

  try {

    /* ======================================================
       AUTHENTICATED USER ID
    ====================================================== */

    const userId = req.user?.id;

    if (!userId) {

      return res.status(401).json({
        success: false,
        message:
          "User authentication required.",
      });

    }

    /* ======================================================
       FIND USER
    ====================================================== */

    const user =
      await User.findById(userId);

    if (!user) {

      return res.status(404).json({
        success: false,
        message:
          "User account not found.",
      });

    }

    /* ======================================================
       CHECK CBT ACCESS
    ====================================================== */

    if (!user.cbtAccess) {

      return res.status(403).json({
        success: false,
        message:
          "CBT access denied. Please complete payment.",
      });

    }

    /* ======================================================
       CHECK CBT EXPIRY
    ====================================================== */

    if (user.cbtExpiry) {

      const expiry =
        new Date(user.cbtExpiry).getTime();

      const now =
        Date.now();

      if (now >= expiry) {

        user.cbtAccess = false;

        user.isPaid = false;

        user.cbtExpiry = null;

        user.remainingAttempts = 0;

        await user.save();

        return res.status(403).json({
          success: false,
          message:
            "CBT session expired. Please make a new payment.",
        });

      }
    }

    /* ======================================================
       CHECK REMAINING ATTEMPT
    ====================================================== */

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

    /* ======================================================
       CHECK COMPLETED EXAM
    ====================================================== */

    if (user.examTaken) {

      return res.status(403).json({
        success: false,
        message:
          "CBT examination already completed.",
      });

    }

    /* ======================================================
       PASS USER TO NEXT ROUTE
    ====================================================== */

    req.user = user;

    next();

  } catch (err) {

    console.error(
      "CBT GUARD ERROR:",
      err
    );

    return res.status(500).json({
      success: false,
      message:
        "CBT access verification failed.",
    });

  }

};

module.exports = cbtGuard;