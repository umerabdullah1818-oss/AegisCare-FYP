// test-connection.js - UPDATED FOR MONGOOSE 7+
const mongoose = require('mongoose');
require('dotenv').config();

async function testConnection() {
  try {
    console.log('🔌 Testing MongoDB Atlas connection...');
    console.log('Using Mongoose version:', mongoose.version);
    
    // ⚠️ REMOVE the deprecated options for Mongoose 7+
    await mongoose.connect(process.env.MONGODB_URI);
    
    console.log('✅ SUCCESS: Connected to MongoDB Atlas!');
    console.log(`📊 Database: ${mongoose.connection.name}`);
    console.log(`📍 Host: ${mongoose.connection.host}`);
    console.log(`👤 User: ${mongoose.connection.user}`);
    console.log(`🚀 Ready State: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);
    
    // Test a simple operation
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`📂 Collections found: ${collections.length}`);
    
    collections.forEach(col => {
      console.log(`   - ${col.name}`);
    });
    
    mongoose.connection.close();
    console.log('🔌 Connection closed. Test passed!');
    
  } catch (error) {
    console.error('❌ FAILED to connect:', error.message);
    console.log('\n🔍 Debug info:');
    console.log('- Mongoose version:', mongoose.version);
    console.log('- Node.js version:', process.version);
    
    // Get partial connection string (hide password)
    const connStr = process.env.MONGODB_URI || '';
    const maskedStr = connStr.replace(/:[^@]*@/, ':****@');
    console.log('- Connection string:', maskedStr);
    
    console.log('\n💡 Troubleshooting tips:');
    console.log('1. Remove useNewUrlParser and useUnifiedTopology options');
    console.log('2. Check if password needs URL encoding');
    console.log('3. Verify IP whitelist in MongoDB Atlas');
    console.log('4. Check internet connection');
  }
}

testConnection();