const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  studentId: { type: String, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, trim: true },
  department: { type: String, trim: true },
  year: { type: String, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['STUDENT', 'ADMIN', 'student', 'admin'], default: 'STUDENT' },
  phoneVerified: { type: Boolean, default: false },
  profileImage: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
  otpCode: { type: String, default: '' },
  otpExpiresAt: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);
