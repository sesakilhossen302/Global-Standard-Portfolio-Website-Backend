require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { Admin } = require('./models');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/portfolio';
const NEW_PASSWORD = 'Sakil@302';

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB database');
    const passwordHash = bcrypt.hashSync(NEW_PASSWORD, 10);
    
    let admin = await Admin.findOne();
    if (admin) {
      admin.passwordHash = passwordHash;
      await admin.save();
      console.log('Admin password updated successfully in database.');
    } else {
      admin = await Admin.create({ passwordHash });
      console.log('Admin created successfully with new password.');
    }
    
    mongoose.connection.close();
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
