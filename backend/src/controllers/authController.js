const bcrypt = require('bcryptjs');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { normalizePhoneNumber } = require('../services/smsService');
const {
  createAndSendOtp,
  verifyOtpChallenge,
  getVerifiedOtpChallenge,
  consumeOtpChallenge,
} = require('../services/otpService');

const normalizeRole = (role) => (role ? String(role).toUpperCase() : 'STUDENT');

const getPhoneLookupPatterns = (value) => {
  const digits = String(value).replace(/\D/g, '');
  const candidates = new Set([digits]);

  if (digits.startsWith('91') && digits.length > 10) {
    candidates.add(digits.slice(2));
  }
  if (digits.startsWith('0') && digits.length > 10) {
    candidates.add(digits.slice(1));
  }

  for (const candidate of candidates) {
    if (candidate.length === 10) {
      candidates.add(`0${candidate}`);
      candidates.add(`91${candidate}`);
    }
  }

  return [...candidates]
    .filter(Boolean)
    .map((candidate) => new RegExp(`^\\D*${candidate.split('').join('\\D*')}\\D*$`));
};

const getUserByContact = async (identifier) => {
  if (!identifier) return null;

  const value = String(identifier).trim();
  if (!value) return null;

  const normalized = value.toLowerCase();
  const phonePatterns = getPhoneLookupPatterns(value);
  return User.findOne({
    $or: [
      { email: normalized },
      ...phonePatterns.map((pattern) => ({ phone: pattern })),
    ],
  });
};

const registerUser = async (req, res) => {
  const { name, studentId, email, phone, department, year, password, confirmPassword } = req.body;

  if (!name || !email || !phone || !department || !year || !password) {
    return res.status(400).json({ message: 'Please provide all required fields.' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match.' });
  }

  const duplicateConditions = [{ email: String(email).trim().toLowerCase() }];
  if (studentId?.trim()) duplicateConditions.push({ studentId: studentId.trim() });
  const existingUser = await User.findOne({ $or: duplicateConditions });
  if (existingUser) {
    return res.status(400).json({ message: 'User with this email or student ID already exists.' });
  }

  if (await getUserByContact(phone)) {
    return res.status(400).json({ message: 'A user with this phone number already exists.' });
  }

  let normalizedPhone;
  let registrationChallenge;
  try {
    normalizedPhone = normalizePhoneNumber(phone);
    registrationChallenge = await getVerifiedOtpChallenge({ phone: normalizedPhone, purpose: 'registration' });
  } catch (error) {
    return res.status(error.statusCode || 401).json({ message: error.message });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    studentId: studentId?.trim() || undefined,
    email,
    phone: normalizedPhone,
    department,
    year,
    password: hashedPassword,
    role: 'student',
    phoneVerified: true,
  });
  await consumeOtpChallenge(registrationChallenge);

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    studentId: user.studentId,
    role: normalizeRole(user.role),
    token: generateToken(user._id),
  });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  if (!user.isActive) {
    return res.status(403).json({ message: 'Your account has been deactivated.' });
  }

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    studentId: user.studentId,
    role: normalizeRole(user.role),
    department: user.department,
    year: user.year,
    profileImage: user.profileImage,
    token: generateToken(user._id),
  });
};

const forgotPassword = async (req, res) => {
  const { email, phone } = req.body;
  const identifier = email || phone;

  if (!identifier) {
    return res.status(400).json({ message: 'Email or phone number is required.' });
  }

  const user = await getUserByContact(identifier);
  if (!user) {
    return res.status(404).json({ message: 'No account was found with that email or phone number.' });
  }

  if (!user.phone) {
    return res.status(400).json({ message: 'This account does not have a phone number for SMS verification.' });
  }

  try {
    const result = await createAndSendOtp({ phone: user.phone, purpose: 'password-reset', user: user._id });
    return res.json({
      success: true,
      message: 'OTP sent by SMS. Use the code to verify your identity and reset your password.',
      destination: result.destination,
    });
  } catch (error) {
    console.error('Password reset SMS failed:', error.message);
    return res.status(error.statusCode || 503).json({ message: error.message });
  }
};

const sendRegistrationOtp = async (req, res) => {
  const { phone } = req.body;
  if (!phone) {
    return res.status(400).json({ message: 'Phone number is required.' });
  }

  if (await getUserByContact(phone)) {
    return res.status(409).json({ message: 'An account already uses this phone number.' });
  }

  try {
    const result = await createAndSendOtp({ phone, purpose: 'registration' });
    return res.json({
      success: true,
      message: 'OTP sent successfully.',
      destination: result.destination,
    });
  } catch (error) {
    console.error('Registration SMS failed:', error.message);
    return res.status(error.statusCode || 503).json({ message: error.message });
  }
};

const verifyOtp = async (req, res) => {
  const { email, phone, otp } = req.body;
  const purpose = req.body.purpose === 'registration' ? 'registration' : 'password-reset';
  const identifier = email || phone;

  if (!identifier || !otp) {
    return res.status(400).json({ message: 'Email or phone number and OTP are required.' });
  }

  let user = null;
  let normalizedPhone;
  try {
    if (purpose === 'registration') {
      if (!phone) return res.status(400).json({ message: 'Phone number is required for registration verification.' });
      normalizedPhone = normalizePhoneNumber(phone);
    } else {
      user = await getUserByContact(identifier);
      if (!user) {
        return res.status(404).json({ message: 'No account was found with that email or phone number.' });
      }
      if (!user.phone) {
        return res.status(400).json({ message: 'This account does not have a phone number for SMS verification.' });
      }
      normalizedPhone = normalizePhoneNumber(user.phone);
    }

    await verifyOtpChallenge({ phone: normalizedPhone, purpose, user: user?._id, otp });
  } catch (error) {
    return res.status(error.statusCode || 401).json({ message: error.message });
  }

  return res.json({
    success: true,
    message: purpose === 'registration' ? 'Phone number verified successfully.' : 'OTP verified successfully.',
    destination: `***${normalizedPhone.slice(-4)}`,
  });
};

const resetPassword = async (req, res) => {
  const { email, phone, otp, newPassword, confirmPassword } = req.body;
  const identifier = email || phone;

  if (!identifier || !otp || !newPassword || !confirmPassword) {
    return res.status(400).json({ message: 'Email or phone number, OTP, and new password are required.' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ message: 'New password must be at least 6 characters long.' });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ message: 'New password and confirmation do not match.' });
  }

  const user = await getUserByContact(identifier);
  if (!user) {
    return res.status(404).json({ message: 'No account was found with that email or phone number.' });
  }

  if (!user.phone) {
    return res.status(400).json({ message: 'This account does not have a phone number for SMS verification.' });
  }

  let challenge;
  try {
    challenge = await getVerifiedOtpChallenge({
      phone: normalizePhoneNumber(user.phone),
      purpose: 'password-reset',
      user: user._id,
      otp,
    });
  } catch (error) {
    return res.status(error.statusCode || 401).json({ message: error.message });
  }

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();
  await consumeOtpChallenge(challenge);

  res.json({
    success: true,
    message: 'Password reset successfully. You can now log in with your new password.',
    email: user.email,
  });
};

const getProfile = async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }
  res.json(user);
};

module.exports = { registerUser, loginUser, forgotPassword, sendRegistrationOtp, verifyOtp, resetPassword, getProfile };
