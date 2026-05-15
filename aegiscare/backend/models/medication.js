const mongoose = require('mongoose');

const medicationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    trim: true // e.g. "Diabetes", "Blood Pressure", "Cholesterol"
  },
  dosage: {
    type: String,
    required: true // e.g. "500mg"
  },
  frequency: {
    type: String,
    enum: ['daily', 'twice-daily', 'weekly', 'as-needed'],
    default: 'daily'
  },
  scheduledTime: {
    type: String,
    required: true // e.g. "8:00 AM"
  },
  prescribedBy: {
    type: String,
    default: ''
  },
  refillDate: {
    type: Date,
    default: null
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date,
    default: null
  },
  notes: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  },
  approvalStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }
}, {
  timestamps: true
});

// Sub-document for daily logs
const medicationLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  medicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Medication',
    required: true
  },
  status: {
    type: String,
    enum: ['taken', 'missed', 'skipped'],
    default: 'taken'
  },
  takenAt: {
    type: Date,
    default: Date.now
  },
  date: {
    type: Date,
    default: () => {
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      return now;
    }
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

medicationLogSchema.index({ userId: 1, date: 1 });
medicationSchema.index({ userId: 1, isActive: 1 });

const Medication = mongoose.model('Medication', medicationSchema);
const MedicationLog = mongoose.model('MedicationLog', medicationLogSchema);

module.exports = { Medication, MedicationLog };
