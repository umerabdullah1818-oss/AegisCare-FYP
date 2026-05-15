require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/user.js');

mongoose.connect('mongodb://127.0.0.1:27017/AegisCare').then(async () => {
  const caregiver = await User.findOne({role: 'caregiver'});
  if(caregiver) {
    await User.updateMany({role: 'elderly'}, { $addToSet: { assignedCaregivers: caregiver._id } });
    console.log('Assigned elderly to caregiver');
  } else {
    console.log('No caregiver found');
  }
  process.exit();
}).catch(err => {
  console.error(err);
  process.exit(1);
});
