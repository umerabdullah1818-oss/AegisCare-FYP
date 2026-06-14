const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getMeals, addMeal, logMeal, getMealById, updateMeal, deleteMeal } = require('../controllers/mealController');
const { approveMeal, rejectMeal } = require('../controllers/approvalController');

// All routes require authentication
router.use(protect);

router.get('/', getMeals);            // GET /api/meals?date=2026-03-01
router.post('/', addMeal);            // POST /api/meals
router.get('/:id', getMealById);      // GET /api/meals/:id
router.put('/:id', updateMeal);       // PUT /api/meals/:id
router.put('/:id/log', logMeal);      // PUT /api/meals/:id/log
router.put('/:id/approve', approveMeal);   // PUT /api/meals/:id/approve
router.put('/:id/reject', rejectMeal);     // PUT /api/meals/:id/reject
router.delete('/:id', deleteMeal);    // DELETE /api/meals/:id

module.exports = router;
