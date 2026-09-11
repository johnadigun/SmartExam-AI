
const User = require("../models/user");

const attachSchool = async (req, res, next) => {
  try {
    const user = req.user; // from auth middleware

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    req.schoolId = user.schoolId;

    next();
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "School middleware error",
    });
  }
};

module.exports = attachSchool;module.exports = (req, res, next) => {
  try {
    // school comes from login token OR user object
    req.schoolId = req.user?.schoolId;

    if (!req.schoolId) {
      return res.status(403).json({
        success: false,
        message: "No school context found",
      });
    }

    next();
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "School middleware error",
    });
  }
};