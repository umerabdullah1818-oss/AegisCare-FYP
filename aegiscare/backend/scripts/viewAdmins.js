const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import Admin model
const Admin = require('../models/admin');

/**
 * View All Admins
 * This script displays all admin users in the database
 * Run: npm run view-admins
 */

const viewAdmins = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected successfully\n');

    // Fetch all admins
    const admins = await Admin.find({}).select('-password');
    
    if (admins.length === 0) {
      console.log('❌ No admin users found in the database.');
      console.log('Run "npm run seed-admin" to create admin users.\n');
    } else {
      console.log('='.repeat(100));
      console.log('👥 ADMIN USERS IN DATABASE');
      console.log('='.repeat(100));
      console.log(`Total: ${admins.length} admin(s)\n`);

      admins.forEach((admin, index) => {
        console.log(`${index + 1}. ${admin.firstName} ${admin.lastName}`);
        console.log(`   📧 Email: ${admin.email}`);
        console.log(`   📱 Phone: ${admin.phone}`);
        console.log(`   🔑 ID: ${admin._id}`);
        console.log(`   ✅ Active: ${admin.isActive ? 'Yes' : 'No'}`);
        console.log(`   🎯 Permissions: ${admin.permissions.join(', ')}`);
        console.log(`   📅 Created: ${new Date(admin.createdAt).toLocaleString()}`);
        console.log(`   🕐 Last Login: ${admin.lastLogin ? new Date(admin.lastLogin).toLocaleString() : 'Never'}`);
        console.log('');
      });

      console.log('='.repeat(100));
    }

    // Close connection
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

// Run the function
viewAdmins();
