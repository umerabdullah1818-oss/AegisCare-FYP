const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    
    // Connect to MongoDB (local or Atlas)
    await mongoose.connect(process.env.MONGODB_URI);
    
    console.log('✅ MongoDB Connected!');
    console.log(`📊 Database: ${mongoose.connection.name}`);
    console.log(`📍 Host: ${mongoose.connection.host}`);
    
    // Connection event listeners
    mongoose.connection.on('connected', () => {
      console.log('🔗 Mongoose connected to MongoDB');
    });
    
    mongoose.connection.on('error', (err) => {
      console.error('❌ Mongoose connection error:', err.message);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('🔌 Mongoose disconnected from MongoDB');
    });
    
  } catch (error) {
    console.error('❌ MongoDB Connection Failed:', error.message);
    console.log('💡 Check:');
    console.log('  1. .env file has correct MONGODB_URI');
    console.log('  2. MongoDB is running locally (mongod service)');
    console.log('  3. Connection string is correct');
    process.exit(1);
  }
};

module.exports = connectDB;