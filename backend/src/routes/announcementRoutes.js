const express = require('express');
const { getAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement } = require('../controllers/announcementController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getAnnouncements);
router.post('/', authMiddleware, adminMiddleware, createAnnouncement);
router.put('/:id', authMiddleware, adminMiddleware, updateAnnouncement);
router.delete('/:id', authMiddleware, adminMiddleware, deleteAnnouncement);

module.exports = router;
