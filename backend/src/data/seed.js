require('dotenv').config();
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Event = require('../models/Event');
const Announcement = require('../models/Announcement');
const Notification = require('../models/Notification');

const sampleEvents = [
  {
    title: 'TCS Placement Drive',
    description: 'Campus recruitment drive for final-year students with opportunities in software engineering and data roles.',
    category: 'Placement',
    date: '2026-10-10T10:00:00.000Z',
    time: '10:00 AM - 1:00 PM',
    venue: 'Main Auditorium',
    organizer: 'Career Services Cell',
    eligibility: 'Open to final year students from CSE, IT, ECE, EEE',
    maxParticipants: 120,
    registrationDeadline: '2026-10-08T23:59:59.000Z',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80',
    contactEmail: 'careers@college.edu',
    contactPhone: '+91 9876543210',
  },
  {
    title: 'Python Workshop',
    description: 'Hands-on Python basics and data structures workshop with live coding exercises.',
    category: 'Workshop',
    date: '2026-10-02T11:00:00.000Z',
    time: '11:00 AM - 1:00 PM',
    venue: 'Innovation Lab',
    organizer: 'Department of Computer Science',
    eligibility: 'Open to all students',
    maxParticipants: 50,
    registrationDeadline: '2026-09-30T23:59:59.000Z',
    image: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=1200&q=80',
    contactEmail: 'csdept@college.edu',
    contactPhone: '+91 9123456780',
  },
  {
    title: 'AI & Machine Learning Seminar',
    description: 'Learn about modern AI trends, ML pipelines, and career paths through an expert-led seminar.',
    category: 'Seminar',
    date: '2026-10-05T14:00:00.000Z',
    time: '2:00 PM - 4:00 PM',
    venue: 'Seminar Hall A',
    organizer: 'Research & Innovation Club',
    eligibility: 'Students interested in AI and ML',
    maxParticipants: 80,
    registrationDeadline: '2026-10-03T23:59:59.000Z',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
    contactEmail: 'research@college.edu',
    contactPhone: '+91 9887654321',
  },
  {
    title: 'College Hackathon 2026',
    description: 'Build innovative prototypes in teams over a 24-hour challenge with mentors and evaluation.',
    category: 'Hackathon',
    date: '2026-11-02T09:00:00.000Z',
    time: '9:00 AM - Next Day 6:00 PM',
    venue: 'Tech Block',
    organizer: 'Student Innovation Council',
    eligibility: 'All students can participate in teams of 3-5',
    maxParticipants: 200,
    registrationDeadline: '2026-10-25T23:59:59.000Z',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
    contactEmail: 'hackathon@college.edu',
    contactPhone: '+91 9811122233',
  },
  {
    title: 'Cultural Fest',
    description: 'An annual celebration of music, dance, fashion, and creative talent from every department.',
    category: 'Cultural',
    date: '2026-11-12T17:00:00.000Z',
    time: '5:00 PM - 9:30 PM',
    venue: 'Open Air Amphitheatre',
    organizer: 'Cultural Committee',
    eligibility: 'Open to all students',
    maxParticipants: 250,
    registrationDeadline: '2026-11-08T23:59:59.000Z',
    image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80',
    contactEmail: 'cultural@college.edu',
    contactPhone: '+91 9765432109',
  },
  {
    title: 'Cyber Security Workshop',
    description: 'Hands-on workshop on ethical hacking, network security, and cyber defense essentials.',
    category: 'Technical',
    date: '2026-10-18T12:00:00.000Z',
    time: '12:00 PM - 3:00 PM',
    venue: 'Cyber Lab',
    organizer: 'Department of Information Security',
    eligibility: 'Students from CSE, IT, ECE and cybersecurity enthusiasts',
    maxParticipants: 60,
    registrationDeadline: '2026-10-15T23:59:59.000Z',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    contactEmail: 'security@college.edu',
    contactPhone: '+91 9955112233',
  },
  {
    title: 'Inter-Collegiate Sports Meet',
    description: 'Participate in football, volleyball, athletics, and team challenges with medals and trophies.',
    category: 'Sports',
    date: '2026-11-08T08:00:00.000Z',
    time: '8:00 AM - 5:00 PM',
    venue: 'Sports Complex',
    organizer: 'Physical Education Department',
    eligibility: 'Open to all students',
    maxParticipants: 180,
    registrationDeadline: '2026-11-04T23:59:59.000Z',
    image: 'https://images.unsplash.com/photo-1547347298-4074fc3086f0?auto=format&fit=crop&w=1200&q=80',
    contactEmail: 'sports@college.edu',
    contactPhone: '+91 9900112233',
  },
];

const seed = async () => {
  try {
    let mongoURI = process.env.MONGO_URI;
    if (!mongoURI) {
      const mongoServer = await MongoMemoryServer.create();
      mongoURI = mongoServer.getUri();
      process.env.MONGO_URI = mongoURI;
    }

    await mongoose.connect(mongoURI);

    await User.deleteMany({});
    await Event.deleteMany({});
    await Announcement.deleteMany({});
    await Notification.deleteMany({});

    const adminPassword = await bcrypt.hash('Admin@123', 10);
    const studentPassword = await bcrypt.hash('Student@123', 10);

    const admin = await User.create({
      name: 'Mahendran Sadhunisan',
      studentId: 'ADMIN-001',
      email: 'mahendransadhunisan@gmail.com',
      phone: '+91 9000000000',
      department: 'Administration',
      year: 'Admin',
      password: adminPassword,
      role: 'ADMIN',
      profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80',
      isActive: true,
    });

    const student = await User.create({
      name: 'Aarav Sharma',
      studentId: 'CS-2024-101',
      email: 'student@college.edu',
      phone: '+91 9876543211',
      department: 'Computer Science',
      year: '3rd Year',
      password: studentPassword,
      role: 'STUDENT',
      profileImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=500&q=80',
      isActive: true,
    });

    const createdEvents = await Event.insertMany(sampleEvents);

    await Announcement.insertMany([
      {
        title: 'Semester Exam Schedule Published',
        description: 'The semester exam timetable is now available on the portal. Students are advised to check the timetable and plan revision accordingly.',
        priority: 'Important',
        department: 'All Departments',
        attachment: '',
        createdBy: admin._id,
      },
      {
        title: 'Library Closure on Saturday',
        description: 'The central library will remain closed on Saturday for maintenance work. Digital resources remain accessible.',
        priority: 'Normal',
        department: 'Library',
        attachment: '',
        createdBy: admin._id,
      },
      {
        title: 'Important: Fee Submission Deadline',
        description: 'All students must submit the semester fee before 5:00 PM on the final date to avoid late penalties.',
        priority: 'Urgent',
        department: 'Finance',
        attachment: '',
        createdBy: admin._id,
      },
    ]);

    await Notification.insertMany([
      {
        user: student._id,
        title: 'Welcome to Smart Campus',
        message: 'Your student account is now active. Explore events and stay updated on campus activities.',
        type: 'new-event',
        isRead: false,
      },
      {
        user: student._id,
        title: 'New Workshop Available',
        message: 'Python Workshop has been added. Register before the deadline to reserve your seat.',
        type: 'new-event',
        isRead: false,
      },
    ]);

    console.log('Seed data created successfully');
    console.log('Admin email: mahendransadhunisan@gmail.com | password: Admin@123');
    console.log('Student email: student@college.edu | password: Student@123');
    console.log(`Created ${createdEvents.length} sample events`);
    await mongoose.disconnect();
  } catch (error) {
    console.error('Seed error:', error.message);
    process.exit(1);
  }
};

seed();
