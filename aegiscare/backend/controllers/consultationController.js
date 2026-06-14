const Consultation = require('../models/consultation');
const User = require('../models/user');

// @desc    Create a new consultation request
// @route   POST /api/consultations
// @access  Private (Elderly, Caregiver)
exports.createConsultation = async (req, res) => {
  try {
    const { doctorId, caregiverId, type, priority, notes } = req.body;
    let userId = req.user._id;
    
    // If caregiver requests on behalf of elderly
    if (req.user.role === 'caretaker' && req.body.userId) {
       userId = req.body.userId;
    }

    const consultation = await Consultation.create({
      userId,
      doctorId,
      caregiverId: req.user.role === 'caretaker' ? req.user._id : (caregiverId || null),
      type,
      priority,
      notes,
      status: priority === 'Critical' ? 'emergency' : (priority === 'High' ? 'urgent' : 'pending')
    });

    res.status(201).json({ success: true, data: consultation });
  } catch (error) {
    console.error('Error creating consultation:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Get consultations based on role
// @route   GET /api/consultations
// @access  Private
exports.getConsultations = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'doctor') {
      query.doctorId = req.user._id;
    } else if (req.user.role === 'elderly') {
      query.userId = req.user._id;
    } else if (req.user.role === 'caretaker') {
      query.caregiverId = req.user._id;
      // Also potentially search by elderly userIds this caretaker manages
    } else if (req.user.role === 'admin') {
      // Admins see all
    }

    // Default to sorting by most recent
    const consultations = await Consultation.find(query)
      .populate('userId', 'firstName lastName profilePicture')
      .populate('doctorId', 'firstName lastName')
      .sort({ requestedAt: -1 });

    res.status(200).json({ success: true, data: consultations });
  } catch (error) {
    console.error('Error fetching consultations:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Update consultation status or notes (e.g. Doctor reviewing)
// @route   PUT /api/consultations/:id
// @access  Private (Doctor)
exports.updateConsultation = async (req, res) => {
  try {
    let consultation = await Consultation.findById(req.params.id);

    if (!consultation) {
      return res.status(404).json({ success: false, message: 'Consultation not found' });
    }

    // Ensure authorized (mostly doctors will review)
    if (req.user.role !== 'admin' && req.user.role !== 'doctor') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const { status, notes } = req.body;
    
    if (status) consultation.status = status;
    if (notes) consultation.notes = notes;

    await consultation.save();

    res.status(200).json({ success: true, data: consultation });
  } catch (error) {
    console.error('Error updating consultation:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
