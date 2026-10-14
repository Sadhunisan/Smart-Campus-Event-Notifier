const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
  registrationDate: { type: Date, default: Date.now },
  registeredAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['registered', 'cancelled', 'attended', 'pending'], default: 'registered' },
});

module.exports = mongoose.model('Registration', registrationSchema);
