const ActivityLog = require("../models/ActivityLog");

const antiCheat = async (req, res, next) => {

  const { userId, event } = req.body;

  if (event) {
    await ActivityLog.create({
      userId,
      event,
      timestamp: new Date()
    });
  }

  next();
};

module.exports = antiCheat;