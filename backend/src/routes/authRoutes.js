const express = require('express');
const { registerUser, loginUser, forgotPassword, sendRegistrationOtp, verifyOtp, resetPassword, getProfile } = require('../controllers/authController');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/send-otp', sendRegistrationOtp);
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', resetPassword);
router.get('/profile', authMiddleware, getProfile);

module.exports = router;
