const express = require('express');
const { 
  googleLogin, 
  completeGoogleRegistration,
  getGoogleUserProfile 
} = require('../controllers/googleAuthController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// Google OAuth routes
// Handle Google login/token verification (public)
router.post('/login', googleLogin);

// Complete registration by selecting role (public - uses Google token)
router.post('/complete-registration', completeGoogleRegistration);

// Get user profile (protected - requires JWT)
router.get('/profile/:userId', protect, getGoogleUserProfile);

module.exports = router;
