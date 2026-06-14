const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { getElderlyVitals } = require('../controllers/elderlyController');

const router = express.Router();

// GET /api/elderly/vitals — Generate simulated vitals + ML insights for logged-in elderly
router.get('/vitals', protect, getElderlyVitals);

module.exports = router;
