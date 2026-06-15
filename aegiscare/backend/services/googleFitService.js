/**
 * Google Fit Service — Handles OAuth and data fetching from Google Fitness REST API.
 * This service bridges Huawei Watch data (synced via Health Sync → Google Fit) to AegisCare.
 */

const { google } = require('googleapis');
const User = require('../models/user');

// OAuth2 client for Google Fit
const createOAuth2Client = () => {
  return new google.auth.OAuth2(
    process.env.GOOGLE_FIT_CLIENT_ID,
    process.env.GOOGLE_FIT_CLIENT_SECRET,
    process.env.GOOGLE_FIT_REDIRECT_URI
  );
};

// Required scopes for reading health data
const SCOPES = [
  'https://www.googleapis.com/auth/fitness.heart_rate.read',
  'https://www.googleapis.com/auth/fitness.activity.read',
  'https://www.googleapis.com/auth/fitness.sleep.read',
  'https://www.googleapis.com/auth/fitness.oxygen_saturation.read',
  'https://www.googleapis.com/auth/fitness.body_temperature.read',
  'https://www.googleapis.com/auth/fitness.blood_pressure.read',
  'https://www.googleapis.com/auth/fitness.blood_glucose.read',
];

/**
 * Generate OAuth URL for user to authorize Google Fit access.
 */
const getAuthUrl = (userId) => {
  const oauth2Client = createOAuth2Client();
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent',
    state: userId, // Pass userId to identify user in callback
  });
};

/**
 * Exchange authorization code for tokens and save to user record.
 */
const handleCallback = async (code, userId) => {
  const oauth2Client = createOAuth2Client();
  const { tokens } = await oauth2Client.getToken(code);

  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  user.googleFitAccessToken = tokens.access_token;
  user.googleFitRefreshToken = tokens.refresh_token || user.googleFitRefreshToken;
  user.googleFitTokenExpiry = new Date(tokens.expiry_date);
  user.googleFitConnected = true;
  await user.save();

  return tokens;
};

/**
 * Get an authenticated OAuth2 client for a specific user.
 * Automatically refreshes expired tokens.
 */
const getAuthenticatedClient = async (userId) => {
  const user = await User.findById(userId);
  if (!user || !user.googleFitConnected) {
    throw new Error('Google Fit not connected for this user');
  }

  const oauth2Client = createOAuth2Client();
  oauth2Client.setCredentials({
    access_token: user.googleFitAccessToken,
    refresh_token: user.googleFitRefreshToken,
    expiry_date: user.googleFitTokenExpiry?.getTime(),
  });

  // Check if token needs refresh
  if (user.googleFitTokenExpiry && new Date() >= user.googleFitTokenExpiry) {
    try {
      const { credentials } = await oauth2Client.refreshAccessToken();
      user.googleFitAccessToken = credentials.access_token;
      user.googleFitTokenExpiry = new Date(credentials.expiry_date);
      await user.save();
      oauth2Client.setCredentials(credentials);
    } catch (error) {
      console.error('Failed to refresh Google Fit token:', error.message);
      user.googleFitConnected = false;
      await user.save();
      throw new Error('Google Fit token expired. Please reconnect.');
    }
  }

  return oauth2Client;
};

/**
 * Fetch heart rate data from Google Fit for the last N hours.
 */
const fetchHeartRate = async (oauth2Client, hours = 24) => {
  const fitness = google.fitness({ version: 'v1', auth: oauth2Client });
  const endTimeMillis = Date.now();
  const startTimeMillis = endTimeMillis - hours * 60 * 60 * 1000;

  try {
    const res = await fitness.users.dataset.aggregate({
      userId: 'me',
      requestBody: {
        aggregateBy: [{
          dataTypeName: 'com.google.heart_rate.bpm',
        }],
        bucketByTime: { durationMillis: hours * 60 * 60 * 1000 },
        startTimeMillis: startTimeMillis.toString(),
        endTimeMillis: endTimeMillis.toString(),
      },
    });

    const buckets = res.data.bucket || [];
    const points = [];
    for (const bucket of buckets) {
      for (const dataset of bucket.dataset || []) {
        for (const point of dataset.point || []) {
          for (const val of point.value || []) {
            if (val.fpVal) points.push(val.fpVal);
          }
        }
      }
    }

    if (points.length === 0) return null;
    return {
      avg: Math.round(points.reduce((a, b) => a + b, 0) / points.length),
      min: Math.round(Math.min(...points)),
      max: Math.round(Math.max(...points)),
      latest: Math.round(points[points.length - 1]),
      count: points.length,
    };
  } catch (error) {
    console.error('Error fetching heart rate:', error.message);
    return null;
  }
};

/**
 * Fetch SpO2 (oxygen saturation) data from Google Fit.
 */
const fetchSpO2 = async (oauth2Client, hours = 24) => {
  const fitness = google.fitness({ version: 'v1', auth: oauth2Client });
  const endTimeMillis = Date.now();
  const startTimeMillis = endTimeMillis - hours * 60 * 60 * 1000;

  try {
    const res = await fitness.users.dataset.aggregate({
      userId: 'me',
      requestBody: {
        aggregateBy: [{
          dataTypeName: 'com.google.oxygen_saturation',
        }],
        bucketByTime: { durationMillis: hours * 60 * 60 * 1000 },
        startTimeMillis: startTimeMillis.toString(),
        endTimeMillis: endTimeMillis.toString(),
      },
    });

    const buckets = res.data.bucket || [];
    const points = [];
    for (const bucket of buckets) {
      for (const dataset of bucket.dataset || []) {
        for (const point of dataset.point || []) {
          for (const val of point.value || []) {
            if (val.fpVal) points.push(val.fpVal);
          }
        }
      }
    }

    if (points.length === 0) return null;
    return {
      avg: Math.round(points.reduce((a, b) => a + b, 0) / points.length),
      latest: Math.round(points[points.length - 1]),
    };
  } catch (error) {
    console.error('Error fetching SpO2:', error.message);
    return null;
  }
};

/**
 * Fetch blood pressure data from Google Fit.
 */
const fetchBloodPressure = async (oauth2Client, hours = 24) => {
  const fitness = google.fitness({ version: 'v1', auth: oauth2Client });
  const endTimeMillis = Date.now();
  const startTimeMillis = endTimeMillis - hours * 60 * 60 * 1000;

  try {
    const res = await fitness.users.dataset.aggregate({
      userId: 'me',
      requestBody: {
        aggregateBy: [{
          dataTypeName: 'com.google.blood_pressure',
        }],
        bucketByTime: { durationMillis: hours * 60 * 60 * 1000 },
        startTimeMillis: startTimeMillis.toString(),
        endTimeMillis: endTimeMillis.toString(),
      },
    });

    const buckets = res.data.bucket || [];
    let systolic = null, diastolic = null;
    for (const bucket of buckets) {
      for (const dataset of bucket.dataset || []) {
        for (const point of dataset.point || []) {
          if (point.value && point.value.length >= 2) {
            systolic = point.value[0].fpVal;
            diastolic = point.value[1].fpVal;
          }
        }
      }
    }

    if (systolic === null) return null;
    return {
      systolic: Math.round(systolic),
      diastolic: Math.round(diastolic),
    };
  } catch (error) {
    console.error('Error fetching blood pressure:', error.message);
    return null;
  }
};

/**
 * Fetch blood glucose data from Google Fit.
 */
const fetchBloodGlucose = async (oauth2Client, hours = 24) => {
  const fitness = google.fitness({ version: 'v1', auth: oauth2Client });
  const endTimeMillis = Date.now();
  const startTimeMillis = endTimeMillis - hours * 60 * 60 * 1000;

  try {
    const res = await fitness.users.dataset.aggregate({
      userId: 'me',
      requestBody: {
        aggregateBy: [{
          dataTypeName: 'com.google.blood_glucose',
        }],
        bucketByTime: { durationMillis: hours * 60 * 60 * 1000 },
        startTimeMillis: startTimeMillis.toString(),
        endTimeMillis: endTimeMillis.toString(),
      },
    });

    const buckets = res.data.bucket || [];
    const points = [];
    for (const bucket of buckets) {
      for (const dataset of bucket.dataset || []) {
        for (const point of dataset.point || []) {
          for (const val of point.value || []) {
            if (val.fpVal) points.push(val.fpVal);
          }
        }
      }
    }

    if (points.length === 0) return null;
    // Google Fit stores glucose in mmol/L, convert to mg/dL
    const latestMmol = points[points.length - 1];
    const latestMgDl = latestMmol * 18.0182; // conversion factor

    return {
      latest: Math.round(latestMgDl),
      avg: Math.round((points.reduce((a, b) => a + b, 0) / points.length) * 18.0182),
    };
  } catch (error) {
    console.error('Error fetching blood glucose:', error.message);
    return null;
  }
};

/**
 * Fetch body temperature data from Google Fit.
 */
const fetchBodyTemperature = async (oauth2Client, hours = 24) => {
  const fitness = google.fitness({ version: 'v1', auth: oauth2Client });
  const endTimeMillis = Date.now();
  const startTimeMillis = endTimeMillis - hours * 60 * 60 * 1000;

  try {
    const res = await fitness.users.dataset.aggregate({
      userId: 'me',
      requestBody: {
        aggregateBy: [{
          dataTypeName: 'com.google.body.temperature',
        }],
        bucketByTime: { durationMillis: hours * 60 * 60 * 1000 },
        startTimeMillis: startTimeMillis.toString(),
        endTimeMillis: endTimeMillis.toString(),
      },
    });

    const buckets = res.data.bucket || [];
    const points = [];
    for (const bucket of buckets) {
      for (const dataset of bucket.dataset || []) {
        for (const point of dataset.point || []) {
          for (const val of point.value || []) {
            if (val.fpVal) points.push(val.fpVal);
          }
        }
      }
    }

    if (points.length === 0) return null;
    return {
      latest: Math.round(points[points.length - 1] * 10) / 10,
      avg: Math.round((points.reduce((a, b) => a + b, 0) / points.length) * 10) / 10,
    };
  } catch (error) {
    console.error('Error fetching body temperature:', error.message);
    return null;
  }
};

/**
 * Fetch all vitals in one call for a user.
 */
const fetchAllVitals = async (userId, hours = 24) => {
  const oauth2Client = await getAuthenticatedClient(userId);

  const [heartRate, spo2, bloodPressure, glucose, temperature] = await Promise.all([
    fetchHeartRate(oauth2Client, hours),
    fetchSpO2(oauth2Client, hours),
    fetchBloodPressure(oauth2Client, hours),
    fetchBloodGlucose(oauth2Client, hours),
    fetchBodyTemperature(oauth2Client, hours),
  ]);

  // Update last sync timestamp
  await User.findByIdAndUpdate(userId, { lastVitalsSync: new Date() });

  return {
    heartRate: heartRate?.latest || heartRate?.avg || null,
    heartRateDetails: heartRate,
    spo2: spo2?.latest || spo2?.avg || null,
    spo2Details: spo2,
    systolicBP: bloodPressure?.systolic || null,
    diastolicBP: bloodPressure?.diastolic || null,
    glucose: glucose?.latest || glucose?.avg || null,
    glucoseDetails: glucose,
    temp: temperature?.latest || temperature?.avg || null,
    temperatureDetails: temperature,
    syncedAt: new Date().toISOString(),
    source: 'google_fit',
  };
};

module.exports = {
  getAuthUrl,
  handleCallback,
  fetchAllVitals,
  getAuthenticatedClient,
};
