const fs = require('fs');
const file = 'c:/Users/Umer/Desktop/fyp development/aegiscare/backend/controllers/adminController.js';
let content = fs.readFileSync(file, 'utf8');

const target = `    const user = await User.create({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
      phone: phone || '',
      status: role === 'doctor' ? 'pending' : 'active'
    });`;

const replacement = `    const userData = {
      firstName,
      lastName,
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
      phone: phone || '',
      status: role === 'doctor' ? 'pending' : 'active'
    };

    if (role === 'doctor') {
      userData.specialization = specialization;
      userData.licenseNumber = licenseNumber;
    }
    if (role === 'elderly' && dateOfBirth) {
      userData.dateOfBirth = dateOfBirth;
    }

    const user = await User.create(userData);`;

// Normalize endings
content = content.replace(target.replace(/\n/g, '\r\n'), replacement.replace(/\n/g, '\r\n'));
content = content.replace(target, replacement); // fallback

fs.writeFileSync(file, content, 'utf8');
console.log('Update complete');
