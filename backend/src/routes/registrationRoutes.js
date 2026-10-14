const express = require('express');
const { createRegistration, getMyRegistrations, cancelRegistration } = require('../controllers/registrationController');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, createRegistration);
router.get('/my-events', authMiddleware, getMyRegistrations);
router.delete('/:id', authMiddleware, cancelRegistration);

module.exports = router;
