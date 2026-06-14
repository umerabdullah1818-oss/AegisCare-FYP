const mongoose = require('mongoose');

const consultationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  caregiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  type: {
    type: String,
    enum: ['Lab Review', 'Medication Review', 'Emergency Review', 'General Consult'],
    default: 'General Consult'
  },
  priority: {
    type: String,
    enum: ['Normal', 'High', 'Critical'],
    default: 'Normal'
  },
  status: {
    type: String,
    enum: ['pending', 'urgent', 'emergency', 'reviewed', 'completed'],
    default: 'pending'
  },
  notes: {
    type: String,
    default: ''
  },
  requestedAt: {
    type: Date,
    default: Date.now
  }
});

consultationSchema.index({ userId: 1, requestedAt: -1 });
consultationSchema.index({ doctorId: 1, status: 1 });

module.exports = mongoose.model('Consultation', consultationSchema);
