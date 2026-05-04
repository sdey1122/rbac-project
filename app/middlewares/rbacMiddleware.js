const roles = require("../config/roles.json");

const checkPermission = (action) => {
  return (req, res, next) => {
    try {
      const userRole = req.user.role;

      const roleData = roles.roles.find((r) => r.name === userRole);

      if (!roleData || !roleData.permissions.includes(action)) {
        return res.status(403).json({
          success: false,
          message: "Access Denied",
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "RBAC Middleware Error",
      });
    }
  };
};

module.exports = { checkPermission };
