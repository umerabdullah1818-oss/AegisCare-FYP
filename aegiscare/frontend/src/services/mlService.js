import api from './api';

/**
 * AegisCare ML Service — Frontend API calls to ML endpoints.
 * All endpoints go through the Express backend proxy (/api/ml/*).
 */

// Check if ML service is running
export const checkMLHealth = () => api.get('/ml/health');

// Detect vitals anomaly
export const detectAnomaly = (vitals) =>
  api.post('/ml/anomaly-detection', vitals);

// Predict health risk
export const predictHealthRisk = (patientData) =>
  api.post('/ml/health-risk', patientData);

// Get nutrition recommendations
export const recommendNutrition = (profile) =>
  api.post('/ml/nutrition-recommend', profile);

// Assess cognitive status
export const assessCognitive = (gameData) =>
  api.post('/ml/cognitive-assessment', gameData);
