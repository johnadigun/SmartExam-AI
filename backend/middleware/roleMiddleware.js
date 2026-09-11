const roleMiddleware = (allowedRoles = []) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized - no user found",
        });
      }

      const userRole = req.user.role;

      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({
          success: false,
          message: "Access denied - insufficient permissions",
        });
      }

      next();
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Role verification failed",
      });
    }
  };
};

module.exports = roleMiddleware;