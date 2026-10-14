const mongoose = require('mongoose');

const otpChallengeSchema = new mongoose.Schema({
  phone: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  purpose: { type: String, enum: ['password-reset', 'registration'], required: true },
  otpHash: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  attempts: { type: Number, default: 0 },
  requestCount: { type: Number, default: 0 },
  windowStartedAt: { type: Date, default: Date.now },
  lastSentAt: { type: Date, default: null },
  verifiedAt: { type: Date, default: null },
}, { timestamps: true });

otpChallengeSchema.index({ phone: 1, purpose: 1 }, { unique: true });
otpChallengeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('OtpChallenge', otpChallengeSchema);