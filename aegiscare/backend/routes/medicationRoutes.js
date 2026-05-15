const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getMedications, addMedication, markMedication,
  getMedicationById, updateMedication, deleteMedication,
  getMedicationLogs, setReminder
} = require('../controllers/medicationController');
const { approveMedication, rejectMedication } = require('../controllers/approvalController');

// All routes require authentication
router.use(protect);

router.get('/', getMedications);                  // GET /api/medications
router.post('/', addMedication);                  // POST /api/medications
router.get('/logs', getMedicationLogs);            // GET /api/medications/logs?days=7
router.get('/:id', getMedicationById);             // GET /api/medications/:id
router.put('/:id', updateMedication);              // PUT /api/medications/:id
router.put('/:id/mark', markMedication);           // PUT /api/medications/:id/mark
router.put('/:id/approve', approveMedication);     // PUT /api/medications/:id/approve
router.put('/:id/reject', rejectMedication);       // PUT /api/medications/:id/reject
router.put('/:id/reminder', setReminder);          // PUT /api/medications/:id/reminder
router.delete('/:id', deleteMedication);           // DELETE /api/medications/:id

module.exports = router;
