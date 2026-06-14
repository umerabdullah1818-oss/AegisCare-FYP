const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getMLHealth,
  detectAnomaly,
  predictHealthRisk,
  recommendNutrition,
  assessCognitive,
} = require('../controllers/mlController');

router.get('/health', protect, getMLHealth);
router.post('/anomaly-detection', protect, detectAnomaly);
router.post('/health-risk', protect, predictHealthRisk);
router.post('/nutrition-recommend', protect, recommendNutrition);
router.post('/cognitive-assessment', protect, assessCognitive);

module.exports = router;
