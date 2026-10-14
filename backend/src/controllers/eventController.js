const Event = require('../models/Event');
const Registration = require('../models/Registration');
const Notification = require('../models/Notification');
const { createDailyEventNotifications } = require('../services/dailyEventService');

const getEvents = async (req, res) => {
  const { category, search, date, department } = req.query;

  const query = {
    $and: [{ $or: [{ status: { $in: ['PUBLISHED', 'published'] } }, { status: { $exists: false } }] }],
  };
  if (category && category !== 'All') query.category = category;
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { organizer: { $regex: search, $options: 'i' } },
    ];
  }
  if (date) {
    const targetDate = new Date(date);
    const nextDay = new Date(targetDate);
    nextDay.setDate(targetDate.getDate() + 1);
    query.date = { $gte: targetDate, $lt: nextDay };
  }

  let events = await Event.find(query).sort({ date: 1 });

  if (department && department !== 'All') {
    events = events.filter((event) => event.eligibility.toLowerCase().includes(department.toLowerCase()) || event.organizer.toLowerCase().includes(department.toLowerCase()));
  }

  const mappedEvents = await Promise.all(
    events.map(async (event) => {
      const totalRegistrations = await Registration.countDocuments({ event: event._id, status: 'registered' });
      return {
        ...event.toObject(),
        status: event.status || 'PUBLISHED',
        availableSeats: Math.max(event.maxParticipants - totalRegistrations, 0),
      };
    })
  );

  res.json(mappedEvents);
};

const getEventById = async (req, res) => {
  const event = await Event.findOne({
    _id: req.params.id,
    $or: [{ status: { $in: ['PUBLISHED', 'published'] } }, { status: { $exists: false } }],
  });
  if (!event) {
    return res.status(404).json({ message: 'Event not found.' });
  }

  const registrations = await Registration.find({ event: event._id, status: 'registered' }).populate('student', 'name studentId department email');
  const totalRegistrations = registrations.length;

  res.json({
    ...event.toObject(),
    status: event.status || 'PUBLISHED',
    availableSeats: Math.max(event.maxParticipants - totalRegistrations, 0),
    registrations,
  });
};

const createEvent = async (req, res) => {
  const { title, description, category, date, time, venue, organizer, eligibility, maxParticipants, registrationDeadline, image, contactEmail, contactPhone } = req.body;

  if (!title || !description || !category || !date || !time || !venue || !organizer || !eligibility || !maxParticipants || !registrationDeadline || !contactEmail || !contactPhone) {
    return res.status(400).json({ message: 'Please provide all event details.' });
  }

  const event = await Event.create({
    title,
    description,
    category,
    date,
    time,
    venue,
    organizer,
    eligibility,
    maxParticipants,
    registrationDeadline,
    image,
    contactEmail,
    contactPhone,
  });

  const users = await require('../models/User').find({ role: 'student' });
  for (const user of users) {
    await Notification.create({
      user: user._id,
      title: 'New Event Added',
      message: `${event.title} is now live. Check it out and register before the deadline.`,
      type: 'new-event',
      isRead: false,
    });
  }

  res.status(201).json(event);
};

const updateEvent = async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) {
    return res.status(404).json({ message: 'Event not found' });
  }

  const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

  const users = await require('../models/User').find({ role: 'student' });
  for (const user of users) {
    await Notification.create({
      user: user._id,
      title: 'Event Updated',
      message: `${updatedEvent.title} has been updated. Please review the latest event details.`,
      type: 'event-update',
      isRead: false,
    });
  }

  res.json(updatedEvent);
};

const deleteEvent = async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) {
    return res.status(404).json({ message: 'Event not found' });
  }

  await Registration.deleteMany({ event: req.params.id });
  await Event.findByIdAndDelete(req.params.id);

  res.json({ message: 'Event deleted successfully.' });
};

const syncDailyEventReminders = async (req, res) => {
  const notificationsCreated = await createDailyEventNotifications();
  res.json({
    message: notificationsCreated > 0 ? `Daily reminders synced for ${notificationsCreated} notifications.` : 'No new reminders were needed today.',
    notificationsCreated,
  });
};

module.exports = { getEvents, getEventById, createEvent, updateEvent, deleteEvent, syncDailyEventReminders };
