const superAdminOnly = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    if (req.user.role !== "super-admin") {
      return res.status(403).json({
        success: false,
        message: "Only the Super Administrator can perform this action.",
      });
    }

    next();

  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = superAdminOnly;