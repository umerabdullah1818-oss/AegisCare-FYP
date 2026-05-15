const Meal = require('../models/meal');
const { Medication } = require('../models/medication');
const User = require('../models/user');
const Notification = require('../models/notification');

// @desc    Approve a meal
// @route   PUT /api/meals/:id/approve
// @access  Private (Caregiver/Doctor)
exports.approveMeal = async (req, res) => {
  try {
    const meal = await Meal.findById(req.params.id);
    if (!meal) return res.status(404).json({ success: false, message: 'Meal not found' });

    meal.approvalStatus = 'approved';
    meal.approvedBy = req.user._id;
    await meal.save();

    // Notify elderly
    const approver = await User.findById(req.user._id);
    await Notification.create({
      recipientId: meal.userId,
      senderId: req.user._id,
      type: 'meal_approved',
      title: 'Diet Plan Approved',
      message: `${approver.firstName} ${approver.lastName} approved your meal: ${meal.name}.`,
      relatedId: meal._id,
      relatedModel: 'Meal'
    });

    res.status(200).json({ success: true, message: 'Meal approved', meal });
  } catch (error) {
    console.error('Error approving meal:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Reject a meal
// @route   PUT /api/meals/:id/reject
// @access  Private (Caregiver/Doctor)
exports.rejectMeal = async (req, res) => {
  try {
    const meal = await Meal.findById(req.params.id);
    if (!meal) return res.status(404).json({ success: false, message: 'Meal not found' });

    meal.approvalStatus = 'rejected';
    meal.approvedBy = req.user._id;
    await meal.save();

    const approver = await User.findById(req.user._id);
    await Notification.create({
      recipientId: meal.userId,
      senderId: req.user._id,
      type: 'meal_rejected',
      title: 'Diet Plan Rejected',
      message: `${approver.firstName} ${approver.lastName} rejected your meal: ${meal.name}. Please update it.`,
      relatedId: meal._id,
      relatedModel: 'Meal'
    });

    res.status(200).json({ success: true, message: 'Meal rejected', meal });
  } catch (error) {
    console.error('Error rejecting meal:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Approve a medication
// @route   PUT /api/medications/:id/approve
// @access  Private (Caregiver/Doctor)
exports.approveMedication = async (req, res) => {
  try {
    const medication = await Medication.findById(req.params.id);
    if (!medication) return res.status(404).json({ success: false, message: 'Medication not found' });

    medication.approvalStatus = 'approved';
    medication.approvedBy = req.user._id;
    await medication.save();

    const approver = await User.findById(req.user._id);
    await Notification.create({
      recipientId: medication.userId,
      senderId: req.user._id,
      type: 'medication_approved',
      title: 'Medication Approved',
      message: `${approver.firstName} ${approver.lastName} approved your medication: ${medication.name}.`,
      relatedId: medication._id,
      relatedModel: 'Medication'
    });

    res.status(200).json({ success: true, message: 'Medication approved', medication });
  } catch (error) {
    console.error('Error approving medication:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Reject a medication
// @route   PUT /api/medications/:id/reject
// @access  Private (Caregiver/Doctor)
exports.rejectMedication = async (req, res) => {
  try {
    const medication = await Medication.findById(req.params.id);
    if (!medication) return res.status(404).json({ success: false, message: 'Medication not found' });

    medication.approvalStatus = 'rejected';
    medication.approvedBy = req.user._id;
    await medication.save();

    const approver = await User.findById(req.user._id);
    await Notification.create({
      recipientId: medication.userId,
      senderId: req.user._id,
      type: 'medication_rejected',
      title: 'Medication Rejected',
      message: `${approver.firstName} ${approver.lastName} rejected your medication: ${medication.name}. Please consult.`,
      relatedId: medication._id,
      relatedModel: 'Medication'
    });

    res.status(200).json({ success: true, message: 'Medication rejected', medication });
  } catch (error) {
    console.error('Error rejecting medication:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
