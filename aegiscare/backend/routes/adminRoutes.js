const express = require('express');
const { 
  adminRegister, adminLogin, getAdminProfile, updateAdminProfile, 
  getAllUsers, getAssignments, assignElderlyToCaregiver, assignElderlyToDoctor, getAdminStats,
  addUser, updateUserStatus, deleteUser, bulkVerifyDoctors, bulkRemoveInactive, logActivity, getAllActivities
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// Admin authentication routes (public)
router.post('/register', adminRegister);
router.post('/login', adminLogin);

// Admin profile routes (protected with JWT)
router.get('/profile/:id', protect, getAdminProfile);
router.put('/profile/:id', protect, updateAdminProfile);

// Admin assignment management routes
router.get('/users', protect, getAllUsers);
router.post('/users', protect, addUser);
router.put('/users/:id/status', protect, updateUserStatus);
router.delete('/users/:id', protect, deleteUser);
router.post('/users/bulk-verify', protect, bulkVerifyDoctors);
router.delete('/users/bulk-remove', protect, bulkRemoveInactive);
router.post('/system/activity-log', protect, logActivity);

router.get('/assignments', protect, getAssignments);
router.post('/assign-caregiver', protect, assignElderlyToCaregiver);
router.post('/assign-doctor', protect, assignElderlyToDoctor);

// Admin dashboard statistics
router.get('/stats', protect, getAdminStats);
router.get('/activities', protect, getAllActivities);

module.exports = router;
