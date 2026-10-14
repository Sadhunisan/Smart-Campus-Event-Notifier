const { normalizeRole } = require('./authMiddleware');

const adminMiddleware = (req, res, next) => {
  if (req.user && normalizeRole(req.user.role) === 'ADMIN') {
    return next();
  }

  return res.status(403).json({ message: 'Access denied. Admin only.' });
};

module.exports = { adminMiddleware };
