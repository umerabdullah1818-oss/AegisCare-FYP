const User = require('../models/user');
const { Medication } = require('../models/medication');
const Meal = require('../models/meal');
const Appointment = require('../models/appointment');
const Consultation = require('../models/consultation');
const { callML } = require('./mlController');

// Get all doctors (public info only) for appointment booking
const getDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: 'doctor' })
      .select('firstName lastName specialization')
      .sort({ firstName: 1 });

    res.json({
      success: true,
      doctors: doctors.map(doc => ({
        _id: doc._id,
        name: `Dr. ${doc.firstName} ${doc.lastName}`,
        specialization: doc.specialization || 'General Physician'
      }))
    });
  } catch (error) {
    console.error('Get doctors error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get elderly patients assigned to the logged-in doctor
// @route   GET /api/doctor/elderly
// @access  Private/Doctor
const getAssignedElderly = async (req, res) => {
  try {
    if (req.user.role !== 'doctor') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const elderlyUsers = await User.find({
      role: 'elderly',
      assignedDoctor: req.user._id
    }).select('-password');

    const enrichedElderly = await Promise.all(elderlyUsers.map(async (elderly) => {
      const medications = await Medication.find({ userId: elderly._id, isActive: true });
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const meals = await Meal.find({ userId: elderly._id, date: { $gte: today } }).sort({ createdAt: -1 });

      // Fetch appointments for this elderly (all time, sorted newest first)
      const appointments = await Appointment.find({ userId: elderly._id })
        .sort({ date: -1 })
        .limit(20)
        .lean();

      // Fetch consultations for this elderly (sorted newest first)
      const consultations = await Consultation.find({ userId: elderly._id })
        .sort({ requestedAt: -1 })
        .limit(20)
        .lean();

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

      // Parse BP for ML
      const [sbp, dbp] = vitals.bp.split('/').map(Number);
      const age = elderly.dateOfBirth
        ? Math.floor((Date.now() - new Date(elderly.dateOfBirth).getTime()) / 31557600000)
        : 75;

      // ML: Anomaly Detection on vitals
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

      // ML: Health Risk Assessment (enriched input for better predictions)
      const hasDiabetesMed = medications.some(m => /diabetes|insulin|metformin|glargine|lispro/i.test(m.type + ' ' + m.name));
      const hasBPMed = medications.some(m => /blood pressure|hypertension|lisinopril|losartan|amlodipine/i.test(m.type + ' ' + m.name));
      const hasHeartMed = medications.some(m => /heart|metoprolol|nitroglycerin/i.test(m.type + ' ' + m.name));
      const hasCOPDMed = medications.some(m => /copd|albuterol|inhaler/i.test(m.type + ' ' + m.name));
      const numConditions = [hasDiabetesMed, hasBPMed, hasHeartMed, hasCOPDMed].filter(Boolean).length;

      let mlRiskResult = null;
      const riskResult = await callML('health-risk', {
        age,
        gender: elderly.gender === 'male' ? 1 : 0,
        bmi: medCount >= 5 ? 31 : medCount >= 3 ? 28 : 23,
        has_diabetes: hasDiabetesMed ? 1 : 0,
        has_hypertension: hasBPMed ? 1 : 0,
        has_heart_disease: hasHeartMed ? 1 : 0,
        has_copd: hasCOPDMed ? 1 : 0,
        num_conditions: numConditions,
        num_medications: medications.length,
        adherence_rate_30d: medCount >= 5 ? 0.6 : medCount >= 3 ? 0.8 : 0.95,
        avg_hr_7d: vitals.heartRate,
        avg_sbp_7d: sbp,
        avg_dbp_7d: dbp,
        avg_glucose_7d: vitals.glucose,
        avg_spo2_7d: vitals.spo2,
        avg_temp_7d: vitals.temp,
        anomaly_count_30d: anomalyResult?.is_anomaly ? (medCount >= 5 ? 10 : 3) : 0,
        er_visits_180d: medCount >= 5 ? 2 : 0,
        cognitive_score: medCount >= 5 ? 55 : medCount >= 3 ? 72 : 90,
      });
      if (riskResult) {
        mlRiskResult = riskResult;
      }

      return {
        ...elderly.toObject(),
        medications,
        dietPlans: meals,
        appointments,
        consultations,
        vitals,
        alerts,
        mlInsights: {
          anomaly: mlAnomalyResult,
          risk: mlRiskResult,
        },
      };
    }));

    res.status(200).json({ success: true, count: enrichedElderly.length, data: enrichedElderly });
  } catch (error) {
    console.error('Error fetching assigned elderly:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Doctor prescribes medication for a patient
// @route   POST /api/doctor/prescribe
// @access  Private/Doctor
const prescribeForPatient = async (req, res) => {
  try {
    if (req.user.role !== 'doctor') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const { patientId, name, type, dosage, frequency, scheduledTime, notes } = req.body;

    if (!patientId || !name || !type || !dosage || !scheduledTime) {
      return res.status(400).json({ success: false, message: 'Patient, name, type, dosage, and scheduledTime are required' });
    }

    // Verify patient is assigned to this doctor
    const patient = await User.findOne({ _id: patientId, role: 'elderly', assignedDoctor: req.user._id });
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found or not assigned to you' });
    }

    const doctorUser = await User.findById(req.user._id);
    const doctorName = `Dr. ${doctorUser.firstName} ${doctorUser.lastName}`;

    const medication = await Medication.create({
      userId: patientId,
      name,
      type,
      dosage,
      frequency: frequency || 'daily',
      scheduledTime,
      prescribedBy: doctorName,
      notes: notes || '',
      approvalStatus: 'approved',
      approvedBy: req.user._id
    });

    // Notify patient
    const Notification = require('../models/notification');
    await Notification.create({
      recipientId: patientId,
      senderId: req.user._id,
      type: 'medication_added',
      title: 'New Prescription',
      message: `${doctorName} prescribed ${name} (${dosage}) for you.`,
      relatedId: medication._id,
      relatedModel: 'Medication'
    });

    // Notify assigned caregivers
    if (patient.assignedCaregivers && patient.assignedCaregivers.length > 0) {
      for (const caregiverId of patient.assignedCaregivers) {
        await Notification.create({
          recipientId: caregiverId,
          senderId: req.user._id,
          type: 'medication_added',
          title: 'New Prescription for Patient',
          message: `${doctorName} prescribed ${name} (${dosage}) for ${patient.firstName} ${patient.lastName}.`,
          relatedId: medication._id,
          relatedModel: 'Medication'
        });
      }
    }

    res.status(201).json({ success: true, medication, message: 'Prescription created successfully' });
  } catch (error) {
    console.error('Prescribe error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Doctor updates medication for a patient
// @route   PUT /api/doctor/prescribe/:id
// @access  Private/Doctor
const updatePrescription = async (req, res) => {
  try {
    if (req.user.role !== 'doctor') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const medicationId = req.params.id;
    const { name, type, dosage, frequency, scheduledTime, notes } = req.body;

    const Medication = require('../models/medication').Medication;
    const medication = await Medication.findById(medicationId);
    if (!medication) {
       return res.status(404).json({ success: false, message: 'Prescription not found' });
    }
    
    // Check if the doctor has access to the patient
    const User = require('../models/user');
    const patient = await User.findOne({ _id: medication.userId, role: 'elderly', assignedDoctor: req.user._id });
    if (!patient) {
       return res.status(403).json({ success: false, message: 'Patient not assigned to you' });
    }

    const doctorUser = await User.findById(req.user._id);
    const doctorName = `Dr. ${doctorUser.firstName} ${doctorUser.lastName}`;

    if (name) medication.name = name;
    if (type) medication.type = type;
    if (dosage) medication.dosage = dosage;
    if (frequency) medication.frequency = frequency;
    if (scheduledTime) medication.scheduledTime = scheduledTime;
    if (notes !== undefined) medication.notes = notes;
    await medication.save();

    // Notify patient
    const Notification = require('../models/notification');
    await Notification.create({
      recipientId: patient._id,
      senderId: req.user._id,
      type: 'medication_added',
      title: 'Prescription Updated',
      message: `${doctorName} updated your prescription for ${medication.name}.`,
      relatedId: medication._id,
      relatedModel: 'Medication'
    });

    res.status(200).json({ success: true, medication, message: 'Prescription updated successfully' });
  } catch (error) {
    console.error('Update prescription error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Doctor schedules a follow-up appointment for a patient
// @route   POST /api/doctor/schedule-followup
// @access  Private/Doctor
const scheduleFollowUp = async (req, res) => {
  try {
    if (req.user.role !== 'doctor') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const { patientId, date, timeSlot, preferredPeriod, type, notes } = req.body;

    if (!patientId || !date || !timeSlot) {
      return res.status(400).json({ success: false, message: 'Patient, date, and time slot are required' });
    }

    // Verify patient is assigned to this doctor
    const patient = await User.findOne({ _id: patientId, role: 'elderly', assignedDoctor: req.user._id });
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found or not assigned to you' });
    }

    const doctorUser = await User.findById(req.user._id);
    const doctorName = `Dr. ${doctorUser.firstName} ${doctorUser.lastName}`;

    // Check for conflicting appointment
    const conflict = await Appointment.findOne({
      doctorId: req.user._id,
      date: new Date(date),
      timeSlot,
      status: { $nin: ['cancelled'] }
    });

    if (conflict) {
      return res.status(409).json({ success: false, message: 'This time slot is already booked' });
    }

    const appointment = await Appointment.create({
      userId: patientId,
      doctorId: req.user._id,
      doctorName,
      date: new Date(date),
      timeSlot,
      preferredPeriod: preferredPeriod || 'morning',
      type: type || 'video',
      notes: notes || '',
      status: 'scheduled'
    });

    // Notify patient
    const Notification = require('../models/notification');
    await Notification.create({
      recipientId: patientId,
      senderId: req.user._id,
      type: 'appointment_scheduled',
      title: 'Follow-up Appointment Scheduled',
      message: `${doctorName} scheduled a follow-up on ${new Date(date).toLocaleDateString()} at ${timeSlot}.`,
      relatedId: appointment._id,
      relatedModel: 'Appointment'
    });

    res.status(201).json({ success: true, appointment, message: 'Follow-up scheduled successfully' });
  } catch (error) {
    console.error('Schedule follow-up error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { getDoctors, getAssignedElderly, prescribeForPatient, updatePrescription, scheduleFollowUp };

