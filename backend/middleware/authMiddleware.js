const jwt = require("jsonwebtoken");
const User = require("../models/User");

/* ================= AUTHENTICATE USER ================= */

const protect = async (req, res, next) => {
  let token;

  try {

    /* CHECK HEADER */
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, no token"
      });
    }

    /* VERIFY TOKEN */
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    /* GET USER */
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not found"
      });
    }

    next();

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Token failed or expired"
    });
  }
};

/* ================= ADMIN ONLY ================= */

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: "Admin access only"
    });
  }
};

/* ================= PAID CBT ACCESS ONLY ================= */

const paidCBTOnly = (req, res, next) => {
  if (req.user && req.user.hasPaid === true) {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: "CBT access denied. Payment required (₦500)"
    });
  }
};

module.exports = {
  protect,
  adminOnly,
  paidCBTOnly
};