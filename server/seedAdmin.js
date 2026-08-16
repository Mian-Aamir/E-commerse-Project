require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const connectDB = require('./config/db');

const seedAdmin = async () => {
  try {
    await connectDB();

    const adminExists = await User.findOne({ email: 'admin@ecommerce.com' });
    if (adminExists) {
      console.log('Admin already exists');
      process.exit();
    }

    const admin = await User.create({
      name: 'Super Admin',
      email: 'admin@ecommerce.com',
      phone: '03000000000',
      password: 'Admin@12345', // change this after first login ideally
      role: 'admin',
    });

    console.log('Admin created successfully:', admin.email);
    process.exit();
  } catch (error) {
    console.error('Error seeding admin:', error.message);
    process.exit(1);
  }
};

seedAdmin();