const ProctorLog = require("../models/ProctorLog");

const detectSuspiciousActivity = async (req, res, next) => {

  const logs = await ProctorLog.find({ userId: req.body.userId });

  const violations = logs.length;

  if (violations >= 5) {
    return res.status(403).json({
      success: false,
      message: "Exam blocked due to AI proctor violation"
    });
  }

  next();
};

module.exports = detectSuspiciousActivity;