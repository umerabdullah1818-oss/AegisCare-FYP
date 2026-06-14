const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { getMyNotifications, markAsRead, markAllAsRead } = require('../controllers/notificationController');

const router = express.Router();

router.get('/', protect, getMyNotifications);
router.post('/', protect, require('../controllers/notificationController').createNotification);
router.put('/read-all', protect, markAllAsRead);
router.put('/:id/read', protect, markAsRead);

module.exports = router;
