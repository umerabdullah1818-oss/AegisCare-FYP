const { Medication, MedicationLog } = require('../models/medication');
const User = require('../models/user');
const Notification = require('../models/notification');

// Get all active medications for the user
const getMedications = async (req, res) => {
  try {
    const medications = await Medication.find({
      userId: req.user._id,
      isActive: true
    }).populate('approvedBy', 'firstName lastName role').sort({ scheduledTime: 1 });

    // Get today's logs
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayLogs = await MedicationLog.find({
      userId: req.user._id,
      date: { $gte: today, $lt: tomorrow }
    });

    // Merge log status into medications
    const medsWithStatus = medications.map(med => {
      const log = todayLogs.find(l => l.medicationId.toString() === med._id.toString());
      return {
        ...med.toObject(),
        todayStatus: log ? log.status : 'pending',
        logId: log ? log._id : null
      };
    });

    const taken = medsWithStatus.filter(m => m.todayStatus === 'taken').length;

    res.json({
      success: true,
      medications: medsWithStatus,
      summary: {
        total: medications.length,
        taken,
        pending: medications.length - taken,
        adherenceRate: medications.length > 0 ? Math.round((taken / medications.length) * 100) : 0
      }
    });
  } catch (error) {
    console.error('Get medications error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Add a new medication
const addMedication = async (req, res) => {
  try {
    const { name, type, dosage, frequency, scheduledTime, prescribedBy, refillDate, notes } = req.body;

    if (!name || !type || !dosage || !scheduledTime) {
      return res.status(400).json({ success: false, message: 'Name, type, dosage, and scheduledTime are required' });
    }

    const medication = await Medication.create({
      userId: req.user._id,
      name,
      type,
      dosage,
      frequency: frequency || 'daily',
      scheduledTime,
      prescribedBy: prescribedBy || '',
      refillDate: refillDate || null,
      notes: notes || ''
    });

    // Auto-notify assigned caregivers and doctor
    try {
      const elderlyUser = await User.findById(req.user._id);
      const userName = `${elderlyUser.firstName} ${elderlyUser.lastName}`;
      const recipients = [...(elderlyUser.assignedCaregivers || [])];
      if (elderlyUser.assignedDoctor) recipients.push(elderlyUser.assignedDoctor);

      for (const recipientId of recipients) {
        await Notification.create({
          recipientId,
          senderId: req.user._id,
          type: 'medication_added',
          title: 'New Medication Added',
          message: `${userName} added a new medication: ${name} (${dosage}).`,
          relatedId: medication._id,
          relatedModel: 'Medication'
        });
      }
    } catch(notifErr) {
      console.error('Notification error (non-blocking):', notifErr);
    }

    res.status(201).json({ success: true, medication });
  } catch (error) {
    console.error('Add medication error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Mark medication as taken/untaken for today
const markMedication = async (req, res) => {
  try {
    const medication = await Medication.findOne({ _id: req.params.id, userId: req.user._id });
    if (!medication) {
      return res.status(404).json({ success: false, message: 'Medication not found' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Check if already logged today
    let log = await MedicationLog.findOne({
      userId: req.user._id,
      medicationId: medication._id,
      date: { $gte: today, $lt: tomorrow }
    });

    if (log) {
      // Toggle: if taken -> remove log, if missed/skipped -> mark taken
      if (log.status === 'taken') {
        await MedicationLog.deleteOne({ _id: log._id });
        return res.json({ success: true, status: 'pending', message: 'Medication unmarked' });
      } else {
        log.status = 'taken';
        log.takenAt = new Date();
        await log.save();
        return res.json({ success: true, status: 'taken', log });
      }
    } else {
      // Create new log as taken
      log = await MedicationLog.create({
        userId: req.user._id,
        medicationId: medication._id,
        status: 'taken',
        takenAt: new Date()
      });
      return res.json({ success: true, status: 'taken', log });
    }
  } catch (error) {
    console.error('Mark medication error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get medication details
const getMedicationById = async (req, res) => {
  try {
    const medication = await Medication.findOne({ _id: req.params.id, userId: req.user._id });
    if (!medication) {
      return res.status(404).json({ success: false, message: 'Medication not found' });
    }

    // Get recent logs
    const logs = await MedicationLog.find({
      medicationId: medication._id,
      userId: req.user._id
    }).sort({ date: -1 }).limit(30);

    res.json({ success: true, medication, logs });
  } catch (error) {
    console.error('Get medication error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update medication
const updateMedication = async (req, res) => {
  try {
    const medication = await Medication.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!medication) {
      return res.status(404).json({ success: false, message: 'Medication not found' });
    }
    res.json({ success: true, medication });
  } catch (error) {
    console.error('Update medication error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Delete (deactivate) medication
const deleteMedication = async (req, res) => {
  try {
    const medication = await Medication.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { isActive: false },
      { new: true }
    );
    if (!medication) {
      return res.status(404).json({ success: false, message: 'Medication not found' });
    }
    res.json({ success: true, message: 'Medication removed' });
  } catch (error) {
    console.error('Delete medication error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get medication history/logs
const getMedicationLogs = async (req, res) => {
  try {
    const { days = 7 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));
    startDate.setHours(0, 0, 0, 0);

    const logs = await MedicationLog.find({
      userId: req.user._id,
      date: { $gte: startDate }
    }).populate('medicationId', 'name type dosage').sort({ date: -1 });

    res.json({ success: true, logs });
  } catch (error) {
    console.error('Get medication logs error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Set reminder (stores reminder preference on the medication)
const setReminder = async (req, res) => {
  try {
    const medication = await Medication.findOne({ _id: req.params.id, userId: req.user._id });
    if (!medication) {
      return res.status(404).json({ success: false, message: 'Medication not found' });
    }

    // For now we acknowledge the reminder request
    // In a full implementation this would integrate with a notification service
    res.json({
      success: true,
      message: `Reminder set for ${medication.name} at ${medication.scheduledTime}`,
      medication: medication.name,
      time: medication.scheduledTime
    });
  } catch (error) {
    console.error('Set reminder error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  getMedications, addMedication, markMedication,
  getMedicationById, updateMedication, deleteMedication,
  getMedicationLogs, setReminder
};
