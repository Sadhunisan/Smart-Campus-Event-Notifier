require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');
const authRoutes = require('./src/routes/authRoutes');
const eventRoutes = require('./src/routes/eventRoutes');
const registrationRoutes = require('./src/routes/registrationRoutes');
const notificationRoutes = require('./src/routes/notificationRoutes');
const announcementRoutes = require('./src/routes/announcementRoutes');
const userRoutes = require('./src/routes/userRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const { errorHandler } = require('./src/middleware/errorMiddleware');
const { startDailyEventNotificationService } = require('./src/services/dailyEventService');
const { isSmsConfigured } = require('./src/services/smsService');

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'http://localhost:5173',
  'http://localhost:5174',
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    server: 'running',
    smsConfigured: isSmsConfigured(),
    message: 'Smart Campus Event Notifier API is running',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/users', userRoutes);

app.use(errorHandler);

startDailyEventNotificationService();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`SMS service: ${isSmsConfigured() ? 'Configured' : 'Not configured'}`);
});
