const Meal = require('../models/meal');
const User = require('../models/user');
const Notification = require('../models/notification');

// Get meals for today (or a specific date)
const getMeals = async (req, res) => {
  try {
    const { date } = req.query;
    let queryDate;
    if (date) {
      queryDate = new Date(date);
    } else {
      queryDate = new Date();
    }
    queryDate.setHours(0, 0, 0, 0);
    const nextDay = new Date(queryDate);
    nextDay.setDate(nextDay.getDate() + 1);

    const meals = await Meal.find({
      userId: req.user._id,
      date: { $gte: queryDate, $lt: nextDay }
    }).populate('approvedBy', 'firstName lastName role').sort({ createdAt: 1 });

    // Calculate totals
    const totals = meals.reduce((acc, meal) => {
      acc.calories += meal.calories || 0;
      acc.protein += meal.protein || 0;
      acc.carbs += meal.carbs || 0;
      acc.fats += meal.fats || 0;
      return acc;
    }, { calories: 0, protein: 0, carbs: 0, fats: 0 });

    const consumed = meals.filter(m => m.status === 'consumed').length;

    res.json({
      success: true,
      meals,
      totals,
      summary: {
        total: meals.length,
        consumed,
        upcoming: meals.length - consumed
      }
    });
  } catch (error) {
    console.error('Get meals error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Add a new meal
const addMeal = async (req, res) => {
  try {
    const { name, mealType, scheduledTime, calories, protein, carbs, fats, notes } = req.body;

    if (!name || !mealType || !scheduledTime) {
      return res.status(400).json({ success: false, message: 'Name, mealType, and scheduledTime are required' });
    }

    const meal = await Meal.create({
      userId: req.user._id,
      name,
      mealType,
      scheduledTime,
      calories: calories || 0,
      protein: protein || 0,
      carbs: carbs || 0,
      fats: fats || 0,
      notes: notes || ''
    });

    // Auto-notify assigned caregivers and doctor
    try {
      const elderlyUser = await User.findById(req.user._id);
      const userName = `${elderlyUser.firstName} ${elderlyUser.lastName}`;
      const recipients = [...(elderlyUser.assignedCaregivers || [])];
      if (elderlyUser.assignedDoctor) recipients.push(elderlyUser.assignedDoctor);

      for (const recipientId of recipients) {
        await Notification.create({
          recipientId,
          senderId: req.user._id,
          type: 'meal_added',
          title: 'New Diet Plan Added',
          message: `${userName} added a new meal: ${name} (${mealType}).`,
          relatedId: meal._id,
          relatedModel: 'Meal'
        });
      }
    } catch(notifErr) {
      console.error('Notification error (non-blocking):', notifErr);
    }

    res.status(201).json({ success: true, meal });
  } catch (error) {
    console.error('Add meal error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Log a meal as consumed
const logMeal = async (req, res) => {
  try {
    const meal = await Meal.findOne({ _id: req.params.id, userId: req.user._id });
    if (!meal) {
      return res.status(404).json({ success: false, message: 'Meal not found' });
    }

    meal.status = meal.status === 'consumed' ? 'upcoming' : 'consumed';
    meal.consumedAt = meal.status === 'consumed' ? new Date() : null;
    await meal.save();

    res.json({ success: true, meal });
  } catch (error) {
    console.error('Log meal error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get meal details
const getMealById = async (req, res) => {
  try {
    const meal = await Meal.findOne({ _id: req.params.id, userId: req.user._id });
    if (!meal) {
      return res.status(404).json({ success: false, message: 'Meal not found' });
    }
    res.json({ success: true, meal });
  } catch (error) {
    console.error('Get meal error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update meal
const updateMeal = async (req, res) => {
  try {
    const meal = await Meal.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!meal) {
      return res.status(404).json({ success: false, message: 'Meal not found' });
    }
    res.json({ success: true, meal });
  } catch (error) {
    console.error('Update meal error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Delete meal
const deleteMeal = async (req, res) => {
  try {
    const meal = await Meal.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!meal) {
      return res.status(404).json({ success: false, message: 'Meal not found' });
    }
    res.json({ success: true, message: 'Meal deleted' });
  } catch (error) {
    console.error('Delete meal error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { getMeals, addMeal, logMeal, getMealById, updateMeal, deleteMeal };
