const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('./src/models/User');

async function connectDatabase() {
  const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/smart_campus';

  try {
    await mongoose.connect(mongoURI, { serverSelectionTimeoutMS: 5000 });
    return 'MongoDB';
  } catch (error) {
    const memoryServer = await MongoMemoryServer.create();
    await mongoose.connect(memoryServer.getUri(), { serverSelectionTimeoutMS: 15000 });
    return 'In-memory MongoDB';
  }
}

(async () => {
  const email = 'mahendransadhunisan@gmail.com';
  const password = 'Admin@123';

  try {
    const mode = await connectDatabase();
    console.log(`Connected via ${mode}`);

    const hashed = await bcrypt.hash(password, 10);
    const existing = await User.findOne({ email: email.toLowerCase() });

    if (existing) {
      await User.updateOne(
        { _id: existing._id },
        { $set: { password: hashed, role: 'ADMIN', isActive: true, name: 'Mahendran Sadhunisan', department: 'Administration', year: 'Admin' } }
      );
      console.log('Updated existing admin user');
    } else {
      await User.create({
        name: 'Mahendran Sadhunisan',
        email: email.toLowerCase(),
        password: hashed,
        role: 'ADMIN',
        isActive: true,
        department: 'Administration',
        year: 'Admin',
      });
      console.log('Created new admin user');
    }

    console.log('EMAIL=' + email.toLowerCase());
    console.log('PASSWORD=' + password);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('ERROR: ' + error.message);
    process.exit(1);
  }
})();
