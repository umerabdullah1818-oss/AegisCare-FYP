const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getAppointments,
  bookAppointment,
  getAppointmentById,
  cancelAppointment,
  updateAppointment
} = require('../controllers/appointmentController');

router.use(protect);

router.get('/', getAppointments);
router.post('/', bookAppointment);
router.get('/:id', getAppointmentById);
router.put('/:id', updateAppointment);
router.put('/:id/cancel', cancelAppointment);

module.exports = router;
