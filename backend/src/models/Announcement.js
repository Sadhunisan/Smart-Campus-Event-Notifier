const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  priority: { type: String, enum: ['Normal', 'Important', 'Urgent'], default: 'Normal' },
  department: { type: String, required: true, trim: true },
  attachment: { type: String, default: '' },
  status: { type: String, enum: ['PUBLISHED', 'DRAFT', 'CANCELLED', 'published', 'draft', 'cancelled'], default: 'PUBLISHED' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Announcement', announcementSchema);
