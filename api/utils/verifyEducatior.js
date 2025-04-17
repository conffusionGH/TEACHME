// middleware/verifyEducator.js
export const verifyEducator = (req, res, next) => {
    const allowedRoles = ['admin', 'teacher', 'manager'];
    if (!allowedRoles.includes(req.user.roles)) {
      return next(errorHandler(403, 'Only admin, teacher, or manager can perform this action'));
    }
    next();
  };