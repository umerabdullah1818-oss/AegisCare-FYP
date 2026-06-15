const User = require('../models/user');
const { Medication } = require('../models/medication');
const { callML } = require('./mlController');

// ─── Realistic Random-Walk Vitals Simulator ─────────────────────────────────
// Stores a baseline per user that drifts by tiny amounts each tick,
// so the dashboard looks like a real live watch feed.
// ─────────────────────────────────────────────────────────────────────────────

const userVitalsCache = new Map(); // userId -> { vitals, lastUpdated }

// Clamp a value between min and max
const clamp = (val, min, max) => Math.min(max, Math.max(min, val));

// Small random drift: returns a value between -maxDelta and +maxDelta
const drift = (maxDelta) => (Math.random() - 0.5) * 2 * maxDelta;

// Profiles: baseline values + drift ranges + safe min/max for each health tier
const PROFILES = {
  healthy: {
    heartRate:   { base: 72,  drift: 2,   min: 58,  max: 88  },
    systolicBP:  { base: 118, drift: 2,   min: 105, max: 130 },
    diastolicBP: { base: 76,  drift: 1.5, min: 65,  max: 85  },
    glucose:     { base: 95,  drift: 3,   min: 78,  max: 115 },
    temp:        { base: 36.6,drift: 0.1, min: 36.1,max: 37.0},
    spo2:        { base: 98,  drift: 0.5, min: 96,  max: 100 },
    steps:       { base: 3800,drift: 120, min: 2200,max: 6500},
    sleepHours:  { base: 7.2, drift: 0.2, min: 5.5, max: 9.0 },
    calories:    { base: 320, drift: 25,  min: 150, max: 550 },
  },
  moderate: {
    heartRate:   { base: 92,  drift: 2,   min: 82,  max: 105 },
    systolicBP:  { base: 145, drift: 2,   min: 135, max: 158 },
    diastolicBP: { base: 90,  drift: 1.5, min: 82,  max: 98  },
    glucose:     { base: 148, drift: 4,   min: 130, max: 170 },
    temp:        { base: 37.1,drift: 0.1, min: 36.7,max: 37.4},
    spo2:        { base: 94,  drift: 0.5, min: 92,  max: 97  },
    steps:       { base: 2400,drift: 100, min: 1000,max: 4000},
    sleepHours:  { base: 6.0, drift: 0.2, min: 4.5, max: 7.5 },
    calories:    { base: 220, drift: 20,  min: 100, max: 400 },
  },
  severe: {
    heartRate:   { base: 108, drift: 3,   min: 95,  max: 125 },
    systolicBP:  { base: 172, drift: 3,   min: 158, max: 188 },
    diastolicBP: { base: 102, drift: 2,   min: 94,  max: 112 },
    glucose:     { base: 195, drift: 5,   min: 175, max: 230 },
    temp:        { base: 37.9,drift: 0.15,min: 37.4,max: 38.5},
    spo2:        { base: 90,  drift: 1,   min: 86,  max: 93  },
    steps:       { base: 1100,drift: 80,  min: 400, max: 2200},
    sleepHours:  { base: 5.0, drift: 0.3, min: 3.5, max: 6.5 },
    calories:    { base: 150, drift: 15,  min: 60,  max: 280 },
  },
};

// Initialize baseline for a user (only on first request)
function initBaseline(profile) {
  const v = {};
  for (const [key, cfg] of Object.entries(profile)) {
    // Start near the base with a tiny random offset
    v[key] = cfg.base + drift(cfg.drift);
  }
  return v;
}

// Walk the vitals: each value drifts slightly from its previous value
function walkVitals(prev, profile) {
  const v = {};
  for (const [key, cfg] of Object.entries(profile)) {
    // Keep daily metrics constant
    if (['steps', 'sleepHours', 'calories'].includes(key)) {
      v[key] = prev[key];
    } else {
      const raw = prev[key] + drift(cfg.drift);
      v[key] = clamp(raw, cfg.min, cfg.max);
    }
  }
  return v;
}

// Round vitals for display (integers for most, 1 decimal for temp)
function roundVitals(v) {
  return {
    heartRate:   Math.round(v.heartRate),
    systolicBP:  Math.round(v.systolicBP),
    diastolicBP: Math.round(v.diastolicBP),
    glucose:     Math.round(v.glucose),
    temp:        Math.round(v.temp * 10) / 10,
    spo2:        Math.round(v.spo2),
    steps:       Math.round(v.steps),
    sleepHours:  Math.round(v.sleepHours * 10) / 10,
    calories:    Math.round(v.calories),
  };
}

// @desc    Get realistic simulated vitals + ML insights for the logged-in elderly user
// @route   GET /api/elderly/vitals
// @access  Private/Elderly
const getElderlyVitals = async (req, res) => {
  try {
    if (req.user.role !== 'elderly') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const user = req.user;
    const userId = user._id.toString();
    const medications = await Medication.find({ userId: user._id, isActive: true });

    // Age calculation
    const age = user.dateOfBirth
      ? Math.floor((Date.now() - new Date(user.dateOfBirth).getTime()) / 31557600000)
      : 75;

    // Pick profile tier based on medication count
    const medCount = medications.length;
    const profileKey = medCount >= 5 ? 'severe' : medCount >= 3 ? 'moderate' : 'healthy';
    const profile = PROFILES[profileKey];

    // Get or create the cached vitals for this user
    let cached = userVitalsCache.get(userId);
    if (!cached) {
      cached = { raw: initBaseline(profile), lastUpdated: Date.now() };
      userVitalsCache.set(userId, cached);
    } else {
      cached.raw = walkVitals(cached.raw, profile);
      cached.lastUpdated = Date.now();
    }

    const vitals = roundVitals(cached.raw);

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
