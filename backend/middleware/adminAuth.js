const jwt = require("jsonwebtoken");
const User = require("../models/user");

/* ==========================================================
   ADMIN AUTHENTICATION MIDDLEWARE

   Allowed administrator roles:
   - super-admin
   - school-admin
========================================================== */

const adminAuth = async (req, res, next) => {
  try {
    /* ========================================================
       CHECK AUTHORIZATION HEADER
    ======================================================== */

    const authHeader =
      req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message:
          "Access denied. No token provided.",
      });
    }

    /* ========================================================
       VALIDATE BEARER TOKEN FORMAT
    ======================================================== */

    const parts =
      authHeader.split(" ");

    if (
      parts.length !== 2 ||
      parts[0] !== "Bearer" ||
      !parts[1]
    ) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid authorization format.",
      });
    }

    const token =
      parts[1];

    /* ========================================================
       JWT SECRET
    ======================================================== */

    const jwtSecret =
      process.env.JWT_SECRET;

    if (!jwtSecret) {
      console.error(
        "ADMIN AUTH ERROR: JWT_SECRET is not configured."
      );

      return res.status(500).json({
        success: false,
        message:
          "Server authentication configuration error.",
      });
    }

    /* ========================================================
       VERIFY JWT
    ======================================================== */

    const decoded =
      jwt.verify(
        token,
        jwtSecret
      );

    /* ========================================================
       FIND USER
    ======================================================== */

    const user =
      await User.findById(
        decoded.id
      );

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "User not found.",
      });
    }

    /* ========================================================
       VERIFY ADMINISTRATOR ROLE
    ======================================================== */

    const allowedRoles = [
      "super-admin",
      "school-admin",
    ];

    if (
      !allowedRoles.includes(
        user.role
      )
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Access denied. Administrator only.",
      });
    }

    /* ========================================================
       DEVELOPMENT DEBUGGING
       Disabled automatically in production.
    ======================================================== */

    if (
      process.env.NODE_ENV !==
      "production"
    ) {
      console.log(
        "===== ADMIN AUTH ====="
      );

      console.log(
        "User:",
        user.email
      );

      console.log(
        "Role:",
        user.role
      );
    }

    /* ========================================================
       ATTACH AUTHENTICATED ADMIN USER
    ======================================================== */

    req.user =
      user;

    next();

  } catch (err) {
    console.error(
      "ADMIN AUTH ERROR:",
      err.message
    );

    return res.status(401).json({
      success: false,
      message:
        "Authentication failed.",
    });
  }
};

module.exports =
  adminAuth;
