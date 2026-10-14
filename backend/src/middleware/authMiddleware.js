const jwt = require('jsonwebtoken');
const User = require('../models/User');

const normalizeRole = (value) => {
  if (!value) return 'STUDENT';
  return String(value).toUpperCase();
};

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization token missing' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'smartcampussecret');
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: 'Your account is inactive. Contact admin.' });
    }

    req.user = { ...user.toObject(), role: normalizeRole(user.role) };
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

const adminMiddleware = (req, res, next) => {
  if (req.user && normalizeRole(req.user.role) === 'ADMIN') {
    return next();
  }
  return res.status(403).json({ message: 'Access denied. Admin only.' });
};

module.exports = { authMiddleware, adminMiddleware, normalizeRole };
