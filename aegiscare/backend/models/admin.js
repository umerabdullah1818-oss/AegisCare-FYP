const mongoose = require('mongoose');
const { encrypt, decrypt } = require('../utils/encryption');

const AdminSchema = new mongoose.Schema({
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
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin'],
    default: 'admin'
  },
  permissions: {
    type: [String],
    default: ['manage_users', 'manage_system', 'view_analytics', 'manage_settings']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Encrypt phone before saving
AdminSchema.pre('save', async function () {
  if (this.isModified('phone') && this.phone && !this.phone.startsWith('enc:')) {
    this.phone = encrypt(this.phone);
  }
});

// Also encrypt on findOneAndUpdate
AdminSchema.pre('findOneAndUpdate', async function () {
  const update = this.getUpdate();
  if (update.phone && !update.phone.startsWith('enc:')) {
    update.phone = encrypt(update.phone);
  }
  if (update.$set && update.$set.phone && !update.$set.phone.startsWith('enc:')) {
    update.$set.phone = encrypt(update.$set.phone);
  }
});

// Decrypt phone after reading
AdminSchema.post('find', function (docs) {
  docs.forEach((doc) => {
    if (doc.phone) doc.phone = decrypt(doc.phone);
  });
});

AdminSchema.post('findOne', function (doc) {
  if (doc && doc.phone) doc.phone = decrypt(doc.phone);
});

module.exports = mongoose.model('Admin', AdminSchema);
