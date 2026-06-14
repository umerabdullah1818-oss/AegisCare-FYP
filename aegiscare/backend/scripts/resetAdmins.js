const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import Admin model
const Admin = require('../models/admin');

/**
 * Reset Admin Collection
 * This script deletes all admins and re-seeds them with default values
 * ⚠️  WARNING: This will delete all existing admin users!
 * Run: npm run reset-admins
 */

const resetAdmins = async () => {
  try {
    console.log('⚠️  WARNING: This will delete ALL admin users from the database!');
    console.log('Proceeding in 3 seconds... (Press Ctrl+C to cancel)\n');
    
    // Wait 3 seconds before proceeding
    await new Promise(resolve => setTimeout(resolve, 3000));

    console.log('🔄 Connecting to MongoDB...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected successfully');

    // Delete all admins
    console.log('\n🗑️  Deleting all existing admin users...');
    const deleteResult = await Admin.deleteMany({});
    console.log(`✅ Deleted ${deleteResult.deletedCount} admin(s)`);

    // Admin users to seed
    const adminsToSeed = [
      {
        firstName: 'John',
        lastName: 'Admin',
        email: 'admin@aegiscare.com',
        password: 'Admin@123456',
        phone: '+1-800-123-4567',
        permissions: ['manage_users', 'manage_system', 'view_analytics', 'manage_settings']
      },
      {
        firstName: 'Sarah',
        lastName: 'Manager',
        email: 'manager@aegiscare.com',
        password: 'Manager@123456',
        phone: '+1-800-123-4568',
        permissions: ['manage_users', 'view_analytics']
      }
    ];

    console.log('\n➕ Creating new admin users...');
    
    for (const adminData of adminsToSeed) {
      try {
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(adminData.password, salt);

        // Create admin
        const admin = await Admin.create({
          firstName: adminData.firstName,
          lastName: adminData.lastName,
          email: adminData.email,
          password: hashedPassword,
          phone: adminData.phone,
          permissions: adminData.permissions,
          isActive: true,
          lastLogin: null
        });

        console.log(`✅ Created: ${admin.firstName} ${admin.lastName} (${admin.email})`);
      } catch (error) {
        console.error(`❌ Error creating admin ${adminData.email}:`, error.message);
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('✅ Admin reset completed!');
    console.log('='.repeat(60));
    
    // Fetch and display all admins
    const allAdmins = await Admin.find({}).select('-password');
    console.log(`\n📊 Total admins in database: ${allAdmins.length}`);
    
    if (allAdmins.length > 0) {
      console.log('\n👥 Admin List:');
      allAdmins.forEach((admin, index) => {
        console.log(`  ${index + 1}. ${admin.firstName} ${admin.lastName} (${admin.email})`);
      });
    }

    // Close connection
    await mongoose.connection.close();
    console.log('\n🔌 MongoDB connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during reset:', error.message);
    console.error(error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

// Run the reset function
resetAdmins();
