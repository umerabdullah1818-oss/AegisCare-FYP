const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import Admin model
const Admin = require('../models/admin');



const seedAdmins = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected successfully');

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

    console.log('\n🔍 Checking for existing admins...');
    
    for (const adminData of adminsToSeed) {
      // Check if admin already exists
      const existingAdmin = await Admin.findOne({ email: adminData.email });
      
      if (existingAdmin) {
        console.log(`⚠️  Admin with email "${adminData.email}" already exists. Skipping...`);
        continue;
      }

      try {
        // Hash password
        console.log(`\n🔐 Hashing password for ${adminData.email}...`);
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(adminData.password, salt);

        // Create admin
        console.log(`➕ Creating admin user: ${adminData.firstName} ${adminData.lastName}...`);
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

        console.log(`✅ Admin created successfully!`);
        console.log(`   📧 Email: ${admin.email}`);
        console.log(`   🔑 ID: ${admin._id}`);
        console.log(`   👤 Name: ${admin.firstName} ${admin.lastName}`);
        console.log(`   📱 Phone: ${admin.phone}`);
        console.log(`   🔐 Password (for testing): ${adminData.password}`);
        console.log(`   🎯 Permissions: ${admin.permissions.join(', ')}`);
      } catch (error) {
        console.error(`❌ Error creating admin ${adminData.email}:`, error.message);
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('✅ Admin seeding completed!');
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
    console.error('❌ Error during seeding:', error.message);
    console.error(error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

// Run the seed function
seedAdmins();
