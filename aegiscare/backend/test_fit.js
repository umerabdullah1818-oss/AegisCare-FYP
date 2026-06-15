require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/user');
const googleFitService = require('./services/googleFitService');

async function test() {
  await mongoose.connect(process.env.MONGODB_URI);
  const user = await User.findOne({ email: 'umerabdullah1818@gmail.com' });
  if (!user) {
    console.log('User not found');
    process.exit(1);
  }

  console.log('Found user:', user.email);
  try {
    const vitals = await googleFitService.fetchAllVitals(user._id, 24);
    console.log('Fetched vitals:', JSON.stringify(vitals, null, 2));
  } catch (err) {
    console.error('Error:', err);
  }
  process.exit(0);
}

test();
