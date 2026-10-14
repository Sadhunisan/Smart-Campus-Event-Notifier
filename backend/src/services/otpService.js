const crypto = require('crypto');
const OtpChallenge = require('../models/OtpChallenge');
const { normalizePhoneNumber, sendSms } = require('./smsService');

const OTP_TTL_MS = 5 * 60 * 1000;
const RESEND_DELAY_MS = 30 * 1000;
const REQUEST_WINDOW_MS = 60 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 5;
const MAX_ATTEMPTS = 5;

const makeOtpHash = (phone, purpose, otp) => {
  const secret = process.env.OTP_SECRET || process.env.JWT_SECRET;
  if (!secret) {
    const error = new Error('OTP security is not configured on the server.');
    error.statusCode = 500;
    throw error;
  }

  return crypto.createHmac('sha256', secret).update(`${phone}:${purpose}:${otp}`).digest('hex');
};

const matchesOtp = (challenge, otp) => {
  const expected = Buffer.from(challenge.otpHash, 'hex');
  const actual = Buffer.from(makeOtpHash(challenge.phone, challenge.purpose, String(otp)), 'hex');
  return expected.length === actual.length && crypto.timingSafeEqual(expected, actual);
};

const createAndSendOtp = async ({ phone, purpose, user }) => {
  const normalizedPhone = normalizePhoneNumber(phone);
  const now = new Date();
  let challenge = await OtpChallenge.findOne({ phone: normalizedPhone, purpose });

  if (challenge?.lastSentAt && now - challenge.lastSentAt < RESEND_DELAY_MS) {
    const error = new Error('Please wait 30 seconds before requesting another OTP.');
    error.statusCode = 429;
    throw error;
  }

  const windowIsCurrent = challenge?.windowStartedAt && now - challenge.windowStartedAt < REQUEST_WINDOW_MS;
  const requestCount = windowIsCurrent ? challenge.requestCount : 0;
  if (requestCount >= MAX_REQUESTS_PER_WINDOW) {
    const error = new Error('OTP request limit reached. Try again in an hour.');
    error.statusCode = 429;
    throw error;
  }

  const otp = crypto.randomInt(100000, 1000000).toString();
  await sendSms(
    normalizedPhone,
    `Your Smart Campus Event Notifier verification OTP is ${otp}. It is valid for 5 minutes. Do not share it with anyone.`
  );

  if (!challenge) challenge = new OtpChallenge({ phone: normalizedPhone, purpose });
  challenge.user = user || null;
  challenge.otpHash = makeOtpHash(normalizedPhone, purpose, otp);
  challenge.expiresAt = new Date(now.getTime() + OTP_TTL_MS);
  challenge.attempts = 0;
  challenge.requestCount = requestCount + 1;
  challenge.windowStartedAt = windowIsCurrent ? challenge.windowStartedAt : now;
  challenge.lastSentAt = now;
  challenge.verifiedAt = null;
  await challenge.save();

  return { destination: `***${normalizedPhone.slice(-4)}` };
};

const findChallenge = ({ phone, purpose, user }) => {
  const query = { phone: normalizePhoneNumber(phone), purpose };
  if (user) query.user = user;
  return OtpChallenge.findOne(query);
};

const verifyOtpChallenge = async ({ phone, purpose, user, otp }) => {
  const challenge = await findChallenge({ phone, purpose, user });
  if (!challenge || challenge.expiresAt <= new Date()) {
    const error = new Error('OTP has expired. Please request a new one.');
    error.statusCode = 401;
    throw error;
  }

  if (challenge.attempts >= MAX_ATTEMPTS) {
    const error = new Error('Too many incorrect OTP attempts. Request a new code.');
    error.statusCode = 429;
    throw error;
  }

  if (!matchesOtp(challenge, otp)) {
    challenge.attempts += 1;
    if (challenge.attempts >= MAX_ATTEMPTS) challenge.expiresAt = new Date(0);
    await challenge.save();
    const error = new Error(challenge.attempts >= MAX_ATTEMPTS ? 'Too many incorrect OTP attempts. Request a new code.' : 'Invalid OTP.');
    error.statusCode = challenge.attempts >= MAX_ATTEMPTS ? 429 : 401;
    throw error;
  }

  challenge.verifiedAt = new Date();
  await challenge.save();
  return challenge;
};

const getVerifiedOtpChallenge = async ({ phone, purpose, user, otp }) => {
  const challenge = await findChallenge({ phone, purpose, user });
  if (!challenge || challenge.expiresAt <= new Date() || !challenge.verifiedAt) {
    const error = new Error('Verify a current OTP before continuing.');
    error.statusCode = 401;
    throw error;
  }
  if (otp && !matchesOtp(challenge, otp)) {
    const error = new Error('Invalid OTP.');
    error.statusCode = 401;
    throw error;
  }
  return challenge;
};

const consumeOtpChallenge = (challenge) => OtpChallenge.deleteOne({ _id: challenge._id });

module.exports = {
  createAndSendOtp,
  verifyOtpChallenge,
  getVerifiedOtpChallenge,
  consumeOtpChallenge,
};