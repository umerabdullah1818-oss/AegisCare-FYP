const axios = require('axios');

const ML_API_URL = process.env.ML_API_URL || 'http://localhost:5001';

/**
 * Proxy helper — forwards requests to the Flask ML service.
 */
async function callML(endpoint, data) {
  try {
    const response = await axios.post(`${ML_API_URL}/ml/${endpoint}`, data, {
      timeout: 10000,
    });
    return response.data;
  } catch (error) {
    console.error(`ML API error (${endpoint}):`, error.message);
    return null;
  }
}

// @desc    Check ML service health
// @route   GET /api/ml/health
// @access  Private
const getMLHealth = async (req, res) => {
  try {
    const response = await axios.get(`${ML_API_URL}/ml/health`, { timeout: 5000 });
    res.json({ success: true, ml: response.data });
  } catch (error) {
    res.json({ success: false, message: 'ML service is not running', error: error.message });
  }
};

// @desc    Detect vitals anomaly
// @route   POST /api/ml/anomaly-detection
// @access  Private
const detectAnomaly = async (req, res) => {
  try {
    const result = await callML('anomaly-detection', req.body);
    if (!result) {
      return res.status(503).json({ success: false, message: 'ML service unavailable' });
    }
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Predict health risk
// @route   POST /api/ml/health-risk
// @access  Private
const predictHealthRisk = async (req, res) => {
  try {
    const result = await callML('health-risk', req.body);
    if (!result) {
      return res.status(503).json({ success: false, message: 'ML service unavailable' });
    }
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get nutrition recommendations
// @route   POST /api/ml/nutrition-recommend
// @access  Private
const recommendNutrition = async (req, res) => {
  try {
    const result = await callML('nutrition-recommend', req.body);
    if (!result) {
      return res.status(503).json({ success: false, message: 'ML service unavailable' });
    }
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Assess cognitive status
// @route   POST /api/ml/cognitive-assessment
// @access  Private
const assessCognitive = async (req, res) => {
  try {
    const result = await callML('cognitive-assessment', req.body);
    if (!result) {
      return res.status(503).json({ success: false, message: 'ML service unavailable' });
    }
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getMLHealth,
  detectAnomaly,
  predictHealthRisk,
  recommendNutrition,
  assessCognitive,
  callML,
};
