const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
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
  mealType: {
    type: String,
    enum: ['breakfast', 'lunch', 'snack', 'dinner'],
    required: true
  },
  scheduledTime: {
    type: String,
    required: true // e.g. "8:00 AM"
  },
  calories: {
    type: Number,
    default: 0
  },
  protein: {
    type: Number,
    default: 0 // grams
  },
  carbs: {
    type: Number,
    default: 0 // grams
  },
  fats: {
    type: Number,
    default: 0 // grams
  },
  status: {
    type: String,
    enum: ['upcoming', 'consumed', 'skipped'],
    default: 'upcoming'
  },
  consumedAt: {
    type: Date,
    default: null
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

// Index for efficient queries
mealSchema.index({ userId: 1, date: 1 });

module.exports = mongoose.model('Meal', mealSchema);
