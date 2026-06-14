const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { getAssignedElderly, prescribeForPatient, updatePrescription, scheduleFollowUp } = require('../controllers/doctorController');

const router = express.Router();

router.get('/elderly', protect, getAssignedElderly);
router.post('/prescribe', protect, prescribeForPatient);
router.put('/prescribe/:id', protect, updatePrescription);
router.post('/schedule-followup', protect, scheduleFollowUp);

module.exports = router;
