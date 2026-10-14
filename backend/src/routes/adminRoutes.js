const express = require('express');
const {
  adminLogin,
  createAdminUser,
  getDashboardStats,
  getAdminEvents,
  createAdminEvent,
  updateAdminEvent,
  deleteAdminEvent,
  getAdminAnnouncements,
  createAdminAnnouncement,
  updateAdminAnnouncement,
  deleteAdminAnnouncement,
  getAdminStudents,
  toggleStudentStatus,
  getAdminRegistrations,
} = require('../controllers/adminController');
const { authMiddleware } = require('../middleware/authMiddleware');
const { adminMiddleware } = require('../middleware/adminMiddleware');

const router = express.Router();

router.post('/login', adminLogin);
router.post('/register', authMiddleware, adminMiddleware, createAdminUser);
router.get('/dashboard', authMiddleware, adminMiddleware, getDashboardStats);

router.get('/events', authMiddleware, adminMiddleware, getAdminEvents);
router.post('/events', authMiddleware, adminMiddleware, createAdminEvent);
router.put('/events/:id', authMiddleware, adminMiddleware, updateAdminEvent);
router.delete('/events/:id', authMiddleware, adminMiddleware, deleteAdminEvent);

router.get('/announcements', authMiddleware, adminMiddleware, getAdminAnnouncements);
router.post('/announcements', authMiddleware, adminMiddleware, createAdminAnnouncement);
router.put('/announcements/:id', authMiddleware, adminMiddleware, updateAdminAnnouncement);
router.delete('/announcements/:id', authMiddleware, adminMiddleware, deleteAdminAnnouncement);

router.get('/students', authMiddleware, adminMiddleware, getAdminStudents);
router.put('/students/:id/toggle-status', authMiddleware, adminMiddleware, toggleStudentStatus);

router.get('/registrations', authMiddleware, adminMiddleware, getAdminRegistrations);

module.exports = router;
