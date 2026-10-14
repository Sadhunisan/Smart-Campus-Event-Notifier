const Notification = require('../models/Notification');

const getNotifications = async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(notifications);
};

const markNotificationAsRead = async (req, res) => {
  const notification = await Notification.findById(req.params.id);
  if (!notification) {
    return res.status(404).json({ message: 'Notification not found.' });
  }

  if (notification.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized.' });
  }

  notification.isRead = true;
  await notification.save();
  res.json({ message: 'Notification marked as read.' });
};

const markAllNotificationsAsRead = async (req, res) => {
  await Notification.updateMany({ user: req.user._id }, { isRead: true });
  res.json({ message: 'All notifications marked as read.' });
};

module.exports = { getNotifications, markNotificationAsRead, markAllNotificationsAsRead };
