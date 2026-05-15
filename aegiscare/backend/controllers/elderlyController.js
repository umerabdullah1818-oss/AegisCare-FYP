const User = require('../models/user');
const { Medication } = require('../models/medication');
const { callML } = require('./mlController');

// @desc    Get simulated vitals + ML insights for the logged-in elderly user
// @route   GET /api/elderly/vitals
// @access  Private/Elderly
const getElderlyVitals = async (req, res) => {
  try {
    if (req.user.role !== 'elderly') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const user = req.user;
    const medications = await Medication.find({ userId: user._id, isActive: true });

    // Age calculation
    const age = user.dateOfBirth
      ? Math.floor((Date.now() - new Date(user.dateOfBirth).getTime()) / 31557600000)
      : 75;

    // Generate vitals based on health profile (medication count as proxy for severity)
    const medCount = medications.length;
    let vitals;
    if (medCount >= 5) {
      vitals = {
        heartRate: 105 + Math.floor(Math.random() * 15),
        systolicBP: 168 + Math.floor(Math.random() * 12),
        diastolicBP: 100 + Math.floor(Math.random() * 8),
        glucose: 185 + Math.floor(Math.random() * 40),
        temp: Math.round((37.8 + Math.random() * 0.8) * 10) / 10,
        spo2: 88 + Math.floor(Math.random() * 4),
      };
    } else if (medCount >= 3) {
      vitals = {
        heartRate: 88 + Math.floor(Math.random() * 12),
        systolicBP: 142 + Math.floor(Math.random() * 8),
        diastolicBP: 88 + Math.floor(Math.random() * 6),
        glucose: 140 + Math.floor(Math.random() * 25),
        temp: Math.round((37.0 + Math.random() * 0.3) * 10) / 10,
        spo2: 93 + Math.floor(Math.random() * 3),
      };
    } else {
      vitals = {
        heartRate: 65 + Math.floor(Math.random() * 13),
        systolicBP: 112 + Math.floor(Math.random() * 10),
        diastolicBP: 72 + Math.floor(Math.random() * 8),
        glucose: 85 + Math.floor(Math.random() * 18),
        temp: Math.round((36.4 + Math.random() * 0.4) * 10) / 10,
        spo2: 97 + Math.floor(Math.random() * 3),
      };
    }

    // ML: Anomaly Detection
    let anomaly = null;
    try {
      anomaly = await callML('anomaly-detection', {
        heart_rate: vitals.heartRate,
        systolic_bp: vitals.systolicBP,
        diastolic_bp: vitals.diastolicBP,
        glucose: vitals.glucose,
        spo2: vitals.spo2,
        temperature: vitals.temp,
        age,
      });
    } catch (err) {
      console.error('ML anomaly error:', err.message);
    }

    // ML: Health Risk Assessment
    const hasDiabetesMed = medications.some(m => /diabetes|insulin|metformin|glargine|lispro/i.test(m.type + ' ' + m.name));
    const hasBPMed = medications.some(m => /blood pressure|hypertension|lisinopril|losartan|amlodipine/i.test(m.type + ' ' + m.name));
    const hasHeartMed = medications.some(m => /heart|metoprolol|nitroglycerin/i.test(m.type + ' ' + m.name));
    const hasCOPDMed = medications.some(m => /copd|albuterol|inhaler/i.test(m.type + ' ' + m.name));
    const numConditions = [hasDiabetesMed, hasBPMed, hasHeartMed, hasCOPDMed].filter(Boolean).length;

    let risk = null;
    try {
      risk = await callML('health-risk', {
        age,
        gender: user.gender === 'male' ? 1 : 0,
        bmi: medCount >= 5 ? 31 : medCount >= 3 ? 28 : 23,
        has_diabetes: hasDiabetesMed ? 1 : 0,
        has_hypertension: hasBPMed ? 1 : 0,
        has_heart_disease: hasHeartMed ? 1 : 0,
        has_copd: hasCOPDMed ? 1 : 0,
        num_conditions: numConditions,
        num_medications: medCount,
        adherence_rate_30d: medCount >= 5 ? 0.6 : medCount >= 3 ? 0.8 : 0.95,
        avg_hr_7d: vitals.heartRate,
        avg_sbp_7d: vitals.systolicBP,
        avg_dbp_7d: vitals.diastolicBP,
        avg_glucose_7d: vitals.glucose,
        avg_spo2_7d: vitals.spo2,
        avg_temp_7d: vitals.temp,
        anomaly_count_30d: anomaly?.is_anomaly ? (medCount >= 5 ? 10 : 3) : 0,
        er_visits_180d: medCount >= 5 ? 2 : 0,
        cognitive_score: medCount >= 5 ? 55 : medCount >= 3 ? 72 : 90,
      });
    } catch (err) {
      console.error('ML risk error:', err.message);
    }

    res.json({
      success: true,
      data: {
        vitals,
        age,
        medCount,
        conditions: { hasDiabetesMed, hasBPMed, hasHeartMed, hasCOPDMed },
        mlInsights: {
          anomaly,
          risk,
        },
      },
    });
  } catch (error) {
    console.error('Elderly vitals error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { getElderlyVitals };
