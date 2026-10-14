const User = require('../models/User');
const Event = require('../models/Event');
const Notification = require('../models/Notification');

const createDailyEventNotifications = async () => {
  const now = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(now.getDate() + 7);

  const upcomingEvents = await Event.find({
    date: {
      $gte: now,
      $lte: nextWeek,
    },
  }).sort({ date: 1 });

  if (!upcomingEvents.length) {
    return 0;
  }

  const students = await User.find({ role: 'student', isActive: true });
  let createdCount = 0;

  for (const student of students) {
    for (const event of upcomingEvents) {
      const existingNotification = await Notification.findOne({
        user: student._id,
        title: 'Upcoming Event Reminder',
        message: new RegExp(`^${event.title}.*`, 'i'),
      });

      if (existingNotification) continue;

      await Notification.create({
        user: student._id,
        title: 'Upcoming Event Reminder',
        message: `${event.title} is coming up on ${new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}. Please review the event details and register if needed.`,
        type: 'event-reminder',
        isRead: false,
      });

      createdCount += 1;
    }
  }

  return createdCount;
};

const startDailyEventNotificationService = () => {
  const runService = async () => {
    try {
      const count = await createDailyEventNotifications();
      if (count > 0) {
        console.log(`Daily event reminder notifications created: ${count}`);
      }
    } catch (error) {
      console.error('Daily event reminder service error:', error.message);
    }
  };

  runService();

  setInterval(() => {
    runService();
  }, 24 * 60 * 60 * 1000);
};

module.exports = {
  createDailyEventNotifications,
  startDailyEventNotificationService,
};
