const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { getMonitoredElderly, searchElderly, assignElderly } = require('../controllers/caregiverController');

const router = express.Router();

router.get('/elderly', protect, getMonitoredElderly);
router.get('/search-elderly', protect, searchElderly);
router.post('/assign-elderly', protect, assignElderly);

module.exports = router;
