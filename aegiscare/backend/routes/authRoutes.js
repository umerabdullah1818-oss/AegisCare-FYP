const express = require('express');
const { register, login, getUserProfile, updateUserProfile, changePassword, deleteUser, updateEmail, forgotPassword, resetPassword, verifyResetToken } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.get('/verify-reset-token/:token', verifyResetToken);
router.post('/reset-password/:token', resetPassword);

// Protected routes (require JWT)
router.get('/profile', protect, getUserProfile);        // Read - Get profile
router.put('/profile', protect, updateUserProfile);      // Update - Edit profile
router.put('/change-password', protect, changePassword); // Update - Change password
router.put('/update-email', protect, updateEmail);       // Update - Change email
router.delete('/profile', protect, deleteUser);          // Delete - Remove account

module.exports = router;