const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('../models/User');

const ensureDefaultAdmin = async () => {
  try {
    const adminEmail = 'mahendransadhunisan@gmail.com';
    const adminExists = await User.exists({ email: adminEmail.toLowerCase() });
    if (adminExists) {
      return;
    }

    const adminPassword = await bcrypt.hash('Admin@123', 10);
    await User.create({
      name: 'Mahendran Sadhunisan',
      studentId: 'ADMIN-001',
      email: adminEmail.toLowerCase(),
      phone: '+91 9000000000',
      department: 'Administration',
      year: 'Admin',
      password: adminPassword,
      role: 'ADMIN',
      profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80',
      isActive: true,
    });

    console.log(`Default admin created: ${adminEmail.toLowerCase()} / Admin@123`);
  } catch (error) {
    console.error('Failed to create default admin:', error.message);
  }
};

const connectDB = async () => {
  let mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/smart_campus';

  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`MongoDB connected: ${conn.connection.host}`);
    await ensureDefaultAdmin();
    return conn;
  } catch (error) {
    console.warn('Configured MongoDB not available. Starting temporary in-memory MongoDB instance...');
  }

  try {
    const memoryServer = await MongoMemoryServer.create();
    mongoURI = memoryServer.getUri();
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 15000,
    });

    console.log(`MongoDB connected via in-memory server: ${conn.connection.host}`);
    await ensureDefaultAdmin();
    return conn;
  } catch (memoryError) {
    console.error('MongoDB connection error:', memoryError.message);
    process.exit(1);
  }
};

module.exports = connectDB;
