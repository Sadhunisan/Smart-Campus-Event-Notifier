const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Event = require('../models/Event');
const Announcement = require('../models/Announcement');
const Registration = require('../models/Registration');

const normalizeRole = (value) => (value ? String(value).toUpperCase() : 'STUDENT');

const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  const user = await User.findOne({ email: String(email).toLowerCase() });
  if (!user || normalizeRole(user.role) !== 'ADMIN') {
    return res.status(401).json({ message: 'Invalid admin credentials.' });
  }
  if (!user.isActive) {
    return res.status(403).json({ message: 'This admin account is inactive.' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid admin credentials.' });
  }

  const token = jwt.sign({ id: user._id, role: 'ADMIN' }, process.env.JWT_SECRET || 'smartcampussecret', {
    expiresIn: '7d',
  });

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: 'ADMIN',
    token,
  });
};

const createAdminUser = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  if (!name || !email || !password || !confirmPassword) {
    return res.status(400).json({ message: 'Name, email, password, and confirmation are required.' });
  }
  if (password.length < 8) {
    return res.status(400).json({ message: 'Admin passwords must be at least 8 characters long.' });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match.' });
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    return res.status(409).json({ message: 'An account with this email already exists.' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    name: String(name).trim(),
    email: normalizedEmail,
    password: hashedPassword,
    role: 'ADMIN',
  });

  res.status(201).json({
    message: 'Admin account created successfully.',
    user: { _id: user._id, name: user.name, email: user.email, role: 'ADMIN' },
  });
};

const getDashboardStats = async (req, res) => {
  const [students, events, announcements, registrations] = await Promise.all([
    User.countDocuments({ role: { $in: ['STUDENT', 'student'] } }),
    Event.countDocuments(),
    Announcement.countDocuments(),
    Registration.countDocuments(),
  ]);

  const upcomingEvents = await Event.countDocuments({
    date: { $gte: new Date() },
    status: { $nin: ['CANCELLED', 'cancelled'] },
  });

  const recentEvents = await Event.find({}).sort({ createdAt: -1 }).limit(5);
  const recentAnnouncements = await Announcement.find({}).sort({ createdAt: -1 }).limit(5);
  const recentRegistrations = await Registration.find({})
    .populate('student', 'name email department')
    .populate('event', 'title date')
    .populate('userId', 'name email department')
    .populate('eventId', 'title date')
    .sort({ registeredAt: -1, registrationDate: -1 })
    .limit(5);

  res.json({
    students,
    events,
    upcomingEvents,
    registrations,
    announcements,
    recentEvents,
    recentAnnouncements,
    recentRegistrations,
  });
};

const getAdminEvents = async (req, res) => {
  const events = await Event.find({}).sort({ createdAt: -1 });
  res.json(events);
};

const createAdminEvent = async (req, res) => {
  const payload = req.body;
  const title = payload.title?.trim();
  const description = payload.description?.trim();
  const category = payload.category;
  const date = payload.date;
  const time = payload.time?.trim();
  const venue = payload.venue?.trim();
  const organizer = payload.organizer?.trim();
  const eligibility = payload.eligibility?.trim();
  const registrationDeadline = payload.registrationDeadline;

  if (!title || !description || !category || !date || !time || !venue || !organizer || !eligibility || !registrationDeadline) {
    return res.status(400).json({ message: 'Please provide all required event fields.' });
  }

  const maxParticipants = Number(payload.maxSeats ?? payload.maxParticipants ?? 50);
  const event = await Event.create({
    ...payload,
    contactEmail: payload.contactEmail || req.user.email,
    contactPhone: payload.contactPhone || req.user.phone || 'N/A',
    maxParticipants,
    maxSeats: maxParticipants,
    status: payload.status || 'PUBLISHED',
    image: payload.image || '',
  });

  res.status(201).json(event);
};

const updateAdminEvent = async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) {
    return res.status(404).json({ message: 'Event not found.' });
  }

  const maxParticipants = Number(req.body.maxSeats ?? req.body.maxParticipants ?? event.maxParticipants ?? 50);
  const updatedEvent = await Event.findByIdAndUpdate(
    req.params.id,
    {
      ...req.body,
      contactEmail: req.body.contactEmail || event.contactEmail || req.user.email,
      contactPhone: req.body.contactPhone || event.contactPhone || req.user.phone || 'N/A',
      maxParticipants,
      maxSeats: maxParticipants,
    },
    { new: true, runValidators: true }
  );

  res.json(updatedEvent);
};

const deleteAdminEvent = async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) {
    return res.status(404).json({ message: 'Event not found.' });
  }

  await Registration.deleteMany({ $or: [{ event: req.params.id }, { eventId: req.params.id }] });
  await Event.findByIdAndDelete(req.params.id);
  res.json({ message: 'Event deleted successfully.' });
};

const getAdminAnnouncements = async (req, res) => {
  const announcements = await Announcement.find({}).sort({ createdAt: -1 });
  res.json(announcements);
};

const createAdminAnnouncement = async (req, res) => {
  const { title, description, department, priority, status } = req.body;

  if (!title || !description || !department) {
    return res.status(400).json({ message: 'Please provide title, description, and department.' });
  }

  const announcement = await Announcement.create({
    title: title.trim(),
    description: description.trim(),
    department: department.trim(),
    priority: priority || 'Normal',
    status: status || 'PUBLISHED',
    createdBy: req.user._id,
  });

  res.status(201).json(announcement);
};

const updateAdminAnnouncement = async (req, res) => {
  const announcement = await Announcement.findById(req.params.id);
  if (!announcement) {
    return res.status(404).json({ message: 'Announcement not found.' });
  }

  const updatedAnnouncement = await Announcement.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.json(updatedAnnouncement);
};

const deleteAdminAnnouncement = async (req, res) => {
  const announcement = await Announcement.findById(req.params.id);
  if (!announcement) {
    return res.status(404).json({ message: 'Announcement not found.' });
  }

  await Announcement.findByIdAndDelete(req.params.id);
  res.json({ message: 'Announcement deleted successfully.' });
};

const getAdminStudents = async (req, res) => {
  const students = await User.find({ role: { $in: ['STUDENT', 'student'] } }).sort({ createdAt: -1 }).select('-password');
  res.json(students);
};

const toggleStudentStatus = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user || normalizeRole(user.role) !== 'STUDENT') {
    return res.status(404).json({ message: 'Student not found.' });
  }

  user.isActive = !user.isActive;
  await user.save();

  res.json({ message: `Student ${user.isActive ? 'enabled' : 'disabled'} successfully.`, user: { ...user.toObject(), password: undefined } });
};

const getAdminRegistrations = async (req, res) => {
  const registrations = await Registration.find({})
    .populate('student', 'name studentId email phone department year')
    .populate('event', 'title date venue')
    .populate('userId', 'name studentId email phone department year')
    .populate('eventId', 'title date venue')
    .sort({ registeredAt: -1, registrationDate: -1 });

  res.json(registrations);
};

module.exports = {
  adminLogin,
  createAdminUser,
  getDashboardStats,
  getAdminEvents,
  createAdminEvent,
  updateAdminEvent,
  deleteAdminEvent,
  getAdminAnnouncements,
  createAdminAnnouncement,
  updateAdminAnnouncement,
  deleteAdminAnnouncement,
  getAdminStudents,
  toggleStudentStatus,
  getAdminRegistrations,
};
