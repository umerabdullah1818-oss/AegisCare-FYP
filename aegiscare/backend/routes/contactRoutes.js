const express = require('express');
const { sendContactMessage } = require('../controllers/contactController');
const router = express.Router();

// Public route - no auth required
router.post('/', sendContactMessage);

module.exports = router;
