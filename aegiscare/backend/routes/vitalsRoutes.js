const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  connectGoogleFit,
  googleFitCallback,
  getGoogleFitStatus,
  disconnectGoogleFit,
  syncVitals,
  getLatestVitals,
} = require('../controllers/vitalsController');

// Google Fit OAuth flow
router.get('/google/connect', protect, connectGoogleFit);
router.get('/google/callback', googleFitCallback); // Public — redirect from Google
router.get('/google/status', protect, getGoogleFitStatus);
router.post('/google/disconnect', protect, disconnectGoogleFit);

// Vitals data
router.post('/sync', protect, syncVitals);
router.get('/latest', protect, getLatestVitals);

module.exports = router;
