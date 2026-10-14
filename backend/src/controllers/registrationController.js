const Event = require('../models/Event');
const Registration = require('../models/Registration');
const Notification = require('../models/Notification');

const createRegistration = async (req, res) => {
  const { eventId } = req.body;

  if (!eventId) {
    return res.status(400).json({ message: 'Event ID is required.' });
  }

  const event = await Event.findById(eventId);
  if (!event) {
    return res.status(404).json({ message: 'Event not found.' });
  }
  if (event.status && !['PUBLISHED', 'published'].includes(event.status)) {
    return res.status(400).json({ message: 'This event is not open for registration.' });
  }

  const existingRegistration = await Registration.findOne({
    student: req.user._id,
    event: eventId,
    status: { $ne: 'cancelled' },
  });

  if (existingRegistration) {
    return res.status(400).json({ message: 'You are already registered for this event.' });
  }

  const totalRegistrations = await Registration.countDocuments({ event: eventId, status: 'registered' });
  if (totalRegistrations >= event.maxParticipants) {
    return res.status(400).json({ message: 'This event is full. No more seats available.' });
  }

  const registration = await Registration.create({
    student: req.user._id,
    event: eventId,
    status: 'registered',
  });

  await Notification.create({
    user: req.user._id,
    title: 'Registration Confirmed',
    message: `You have successfully registered for ${event.title}.`,
    type: 'registration-confirmation',
    isRead: false,
  });

  res.status(201).json({ message: 'Registration successful.', registration });
};

const getMyRegistrations = async (req, res) => {
  const registrations = await Registration.find({ student: req.user._id })
    .populate('event')
    .sort({ registrationDate: -1 });

  res.json(registrations);
};

const cancelRegistration = async (req, res) => {
  const registration = await Registration.findById(req.params.id);

  if (!registration) {
    return res.status(404).json({ message: 'Registration not found.' });
  }

  if (registration.student.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'You are not allowed to cancel this registration.' });
  }

  registration.status = 'cancelled';
  await registration.save();

  const event = await Event.findById(registration.event);
  await Notification.create({
    user: req.user._id,
    title: 'Registration Cancelled',
    message: `Your registration for ${event ? event.title : 'this event'} has been cancelled.`,
    type: 'event-cancellation',
    isRead: false,
  });

  res.json({ message: 'Registration cancelled successfully.' });
};

const getEventRegistrations = async (req, res) => {
  const registrations = await Registration.find({ event: req.params.id })
    .populate('student', 'name studentId email department')
    .populate('event', 'title');

  res.json(registrations);
};

module.exports = { createRegistration, getMyRegistrations, cancelRegistration, getEventRegistrations };
