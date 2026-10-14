const express = require('express');
const { getEvents, getEventById, createEvent, updateEvent, deleteEvent, syncDailyEventReminders } = require('../controllers/eventController');
const { getEventRegistrations } = require('../controllers/registrationController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getEvents);
router.post('/daily-reminders', authMiddleware, adminMiddleware, syncDailyEventReminders);
router.get('/:id/registrations', authMiddleware, adminMiddleware, getEventRegistrations);
router.get('/:id', getEventById);
router.post('/', authMiddleware, adminMiddleware, createEvent);
router.put('/:id', authMiddleware, adminMiddleware, updateEvent);
router.delete('/:id', authMiddleware, adminMiddleware, deleteEvent);

module.exports = router;
