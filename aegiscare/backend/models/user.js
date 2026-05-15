const mongoose = require('mongoose');
const { encryptUserFields, decryptUserFields } = require('../utils/encryption');

const UserSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['elderly', 'doctor', 'caregiver', 'admin'],
    required: function() {
      // Role is optional for Google OAuth users until they complete registration
      return !this.isGoogleAuth;
    }
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: function() {
      // Password is required only if not using Google OAuth
      return !this.isGoogleAuth;
    }
  },
  phone: {
    type: String,
    required: function() {
      // Phone is required only for non-Google OAuth users
      return !this.isGoogleAuth;
    }
  },
  dateOfBirth: Date,
  specialization: String,
  licenseNumber: String,
  address: String,
  // Link elderly to caregivers
  assignedCaregivers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  // Link elderly to a doctor
  assignedDoctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  // Google OAuth specific fields
  googleId: {
    type: String,
    sparse: true,
    unique: true
  },
  isGoogleAuth: {
    type: Boolean,
    default: false
  },
  profilePicture: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  lastLogin: {
    type: Date,
    default: null
  },
  status: {
    type: String,
    enum: ['active', 'pending', 'verified', 'inactive', 'suspended'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Encrypt sensitive fields before saving
UserSchema.pre('save', async function () {
  const { encrypt } = require('../utils/encryption');
  const fieldsToCheck = ['phone', 'address', 'licenseNumber'];
  fieldsToCheck.forEach((field) => {
    if (this.isModified(field) && this[field] && !this[field].startsWith('enc:')) {
      this[field] = encrypt(this[field]);
    }
  });
});

// Also encrypt on findOneAndUpdate
UserSchema.pre('findOneAndUpdate', async function () {
  const { encrypt } = require('../utils/encryption');
  const update = this.getUpdate();
  const fieldsToCheck = ['phone', 'address', 'licenseNumber'];
  fieldsToCheck.forEach((field) => {
    if (update[field] && !update[field].startsWith('enc:')) {
      update[field] = encrypt(update[field]);
    }
    if (update.$set && update.$set[field] && !update.$set[field].startsWith('enc:')) {
      update.$set[field] = encrypt(update.$set[field]);
    }
  });
});

// Decrypt sensitive fields after reading
UserSchema.post('find', function (docs) {
  docs.forEach((doc) => decryptUserFields(doc));
});

UserSchema.post('findOne', function (doc) {
  if (doc) decryptUserFields(doc);
});

module.exports = mongoose.model('User', UserSchema);