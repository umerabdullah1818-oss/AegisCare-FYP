const express = require('express');
const router = express.Router();
const {
  createConsultation,
  getConsultations,
  updateConsultation
} = require('../controllers/consultationController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .post(createConsultation)
  .get(getConsultations);

router.route('/:id')
  .put(updateConsultation);

module.exports = router;
