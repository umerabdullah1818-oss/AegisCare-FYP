const User = require('../models/user');
const { Medication } = require('../models/medication');
const Meal = require('../models/meal');
const Appointment = require('../models/appointment');
const { callML } = require('./mlController');

// @desc    Get monitored elderly users for logged-in caregiver
// @route   GET /api/caregiver/elderly
// @access  Private/Caregiver
exports.getMonitoredElderly = async (req, res) => {
  try {
    if (req.user.role !== 'caregiver') {
      return res.status(403).json({ success: false, message: 'Not authorized for this route' });
    }

    const { Medication, MedicationLog } = require('../models/medication');
    const elderlyUsers = await User.find({
      role: 'elderly',
      assignedCaregivers: req.user._id
    }).select('-password');

    const enrichedElderly = await Promise.all(elderlyUsers.map(async (elderly) => {
      const medications = await Medication.find({ userId: elderly._id, isActive: true });
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const todayLogs = await MedicationLog.find({
        userId: elderly._id,
        date: { $gte: today, $lt: tomorrow }
      });
      
      const medsWithStatus = medications.map(med => {
        const log = todayLogs.find(l => l.medicationId.toString() === med._id.toString());
        return {
          ...med.toObject(),
          todayStatus: log ? log.status : 'pending',
          logId: log ? log._id : null
        };
      });
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      sevenDaysAgo.setHours(0, 0, 0, 0);
      const meals = await Meal.find({ userId: elderly._id, date: { $gte: sevenDaysAgo } }).sort({ createdAt: -1 });
      const appointments = await Appointment.find({ userId: elderly._id }).sort({ date: -1 });

      // Generate vitals based on patient health profile (medication count as proxy)
      const medCount = medications.length;
      let vitals;
      if (medCount >= 5) {
        // Critical patient: concerning vitals → ML will flag anomalies
        vitals = {
          heartRate: 105 + Math.floor(Math.random() * 15),
          bp: (168 + Math.floor(Math.random() * 12)) + '/' + (100 + Math.floor(Math.random() * 8)),
          glucose: 185 + Math.floor(Math.random() * 40),
          temp: 37.8 + Math.random() * 0.8,
          spo2: 88 + Math.floor(Math.random() * 4)
        };
      } else if (medCount >= 3) {
        // Moderate patient: borderline vitals → ML may flag some alerts
        vitals = {
          heartRate: 88 + Math.floor(Math.random() * 12),
          bp: (142 + Math.floor(Math.random() * 8)) + '/' + (88 + Math.floor(Math.random() * 6)),
          glucose: 140 + Math.floor(Math.random() * 25),
          temp: 37.0 + Math.random() * 0.3,
          spo2: 93 + Math.floor(Math.random() * 3)
        };
      } else {
        // Healthy patient: normal vitals → ML says all clear
        vitals = {
          heartRate: 65 + Math.floor(Math.random() * 13),
          bp: (112 + Math.floor(Math.random() * 10)) + '/' + (72 + Math.floor(Math.random() * 8)),
          glucose: 85 + Math.floor(Math.random() * 18),
          temp: 36.4 + Math.random() * 0.4,
          spo2: 97 + Math.floor(Math.random() * 3)
        };
      }
      // Round temperature for display and convert to Fahrenheit
      vitals.temp = Math.round(vitals.temp * 10) / 10;
      vitals.tempF = Math.round((vitals.temp * 9 / 5 + 32) * 10) / 10;

      const [sbp, dbp] = vitals.bp.split('/').map(Number);
      const age = elderly.dateOfBirth
        ? Math.floor((Date.now() - new Date(elderly.dateOfBirth).getTime()) / 31557600000)
        : 75;

      // ML: Anomaly Detection
      let alerts = [];
      let mlAnomalyResult = null;
      const anomalyResult = await callML('anomaly-detection', {
        heart_rate: vitals.heartRate,
        systolic_bp: sbp,
        diastolic_bp: dbp,
        glucose: vitals.glucose,
        spo2: vitals.spo2,
        temperature: vitals.temp,
        age,
      });
      if (anomalyResult) {
        mlAnomalyResult = anomalyResult;
        if (anomalyResult.is_anomaly) {
          alerts = anomalyResult.alerts.map(a => ({
            type: 'vital_anomaly',
            severity: anomalyResult.severity,
            vital: a.vital,
            value: a.value,
            message: a.message,
          }));
        }
      }

      return {
        ...elderly.toObject(),
        medications: medsWithStatus,
        dietPlans: meals,
        appointments,
        vitals,
        alerts,
        mlInsights: {
          anomaly: mlAnomalyResult,
        },
      };
    }));

    res.status(200).json({ success: true, count: enrichedElderly.length, data: enrichedElderly });
  } catch (error) {
    console.error('Error fetching monitored elderly:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Search for an elderly user by name
// @route   GET /api/caregiver/search-elderly?name=xxx
// @access  Private/Caregiver
exports.searchElderly = async (req, res) => {
  try {
    if (req.user.role !== 'caregiver') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const searchRegex = new RegExp(req.query.name, 'i');
    const elderlyUsers = await User.find({
      role: 'elderly',
      $or: [
        { firstName: searchRegex },
        { lastName: searchRegex }
      ]
    }).select('firstName lastName phone email _id address');

    res.status(200).json({ success: true, count: elderlyUsers.length, data: elderlyUsers });
  } catch (error) {
    console.error('Error searching elderly:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Assign an elderly user to the current caregiver
// @route   POST /api/caregiver/assign-elderly
// @access  Private/Caregiver
exports.assignElderly = async (req, res) => {
  try {
    if (req.user.role !== 'caregiver') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const { elderlyId } = req.body;
    if(!elderlyId) return res.status(400).json({ success: false, message: 'Elderly ID is required' });

    const elderly = await User.findOne({ _id: elderlyId, role: 'elderly' });
    if(!elderly) return res.status(404).json({ success: false, message: 'Elderly not found' });

    if(elderly.assignedCaregivers && elderly.assignedCaregivers.includes(req.user._id)){
      return res.status(400).json({ success: false, message: 'Already assigned to this elderly user' });
    }

    await User.findByIdAndUpdate(elderlyId, {
      $addToSet: { assignedCaregivers: req.user._id }
    });

    res.status(200).json({ success: true, message: 'Successfully assigned elderly user.' });
  } catch (error) {
    console.error('Error assigning elderly:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
