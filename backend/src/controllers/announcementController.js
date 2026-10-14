const Announcement = require('../models/Announcement');
const Notification = require('../models/Notification');

const getAnnouncements = async (req, res) => {
  const announcements = await Announcement.find({
    $or: [{ status: { $in: ['PUBLISHED', 'published'] } }, { status: { $exists: false } }],
  }).sort({ createdAt: -1 });
  res.json(announcements.map((announcement) => ({ ...announcement.toObject(), status: announcement.status || 'PUBLISHED' })));
};

const createAnnouncement = async (req, res) => {
  const { title, description, priority, department, attachment } = req.body;

  if (!title || !description || !priority || !department) {
    return res.status(400).json({ message: 'Please provide all announcement details.' });
  }

  const announcement = await Announcement.create({
    title,
    description,
    priority,
    department,
    attachment,
    createdBy: req.user._id,
  });

  const users = await require('../models/User').find({ role: 'student' });
  for (const user of users) {
    await Notification.create({
      user: user._id,
      title: 'Important Announcement',
      message: `${announcement.title}: ${announcement.description}`,
      type: 'announcement',
      isRead: false,
    });
  }

  res.status(201).json(announcement);
};

const updateAnnouncement = async (req, res) => {
  const announcement = await Announcement.findById(req.params.id);
  if (!announcement) {
    return res.status(404).json({ message: 'Announcement not found.' });
  }

  const updatedAnnouncement = await Announcement.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  res.json(updatedAnnouncement);
};

const deleteAnnouncement = async (req, res) => {
  const announcement = await Announcement.findById(req.params.id);
  if (!announcement) {
    return res.status(404).json({ message: 'Announcement not found.' });
  }

  await Announcement.findByIdAndDelete(req.params.id);
  res.json({ message: 'Announcement deleted successfully.' });
};

module.exports = { getAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement };
