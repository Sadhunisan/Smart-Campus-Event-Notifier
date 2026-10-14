const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  category: {
    type: String,
    enum: ['Workshop', 'Seminar', 'Placement', 'Hackathon', 'Technical', 'Cultural', 'Sports', 'Other'],
    required: true,
  },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  venue: { type: String, required: true, trim: true },
  organizer: { type: String, required: true, trim: true },
  eligibility: { type: String, required: true, trim: true },
  maxParticipants: { type: Number, required: true, min: 1 },
  maxSeats: { type: Number, min: 1 },
  registrationDeadline: { type: Date, required: true },
  image: { type: String, default: '' },
  contactEmail: { type: String, required: true, trim: true },
  contactPhone: { type: String, required: true, trim: true },
  status: { type: String, enum: ['PUBLISHED', 'DRAFT', 'CANCELLED', 'published', 'draft', 'cancelled'], default: 'PUBLISHED' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Event', eventSchema);
