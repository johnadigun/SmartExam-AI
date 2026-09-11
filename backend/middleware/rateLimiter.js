const rateLimit = require("express-rate-limit");

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // limit each IP
  message: {
    success: false,
    message: "Too many requests, try again later.",
  },
});

module.exports = apiLimiter;