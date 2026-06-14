const Appointment = require('../models/appointment');
const User = require('../models/user');
const Notification = require('../models/notification');

// @desc    Get user's appointments
// @route   GET /api/appointments
const getAppointments = async (req, res) => {
  try {
    const { status, upcoming } = req.query;
    const filter = {};
    
    // Check if the requester is a doctor or a patient
    if (req.user.role === 'doctor') {
      filter.doctorId = req.user._id;
    } else {
      filter.userId = req.user._id;
    }

    if (status) filter.status = status;
    if (upcoming === 'true') {
      filter.date = { $gte: new Date(new Date().setHours(0, 0, 0, 0)) };
    }

    const appointments = await Appointment.find(filter)
      .populate('userId', 'firstName lastName profilePicture')
      .sort({ date: 1, timeSlot: 1 })
      .lean();

    res.json({ success: true, appointments });
  } catch (err) {
    console.error('Get appointments error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Book a new appointment
// @route   POST /api/appointments
const bookAppointment = async (req, res) => {
  try {
    let { doctorId, patientId, date, timeSlot, preferredPeriod, type, notes } = req.body;
    let userId = req.user._id;

    if (req.user.role === 'doctor') {
      doctorId = req.user._id;
      userId = patientId;
      if (!patientId) {
        return res.status(400).json({ success: false, message: 'Patient ID is required' });
      }
    }

    if (!doctorId || !date || !timeSlot) {
      return res.status(400).json({ success: false, message: 'Date, time slot, and doctor/patient details are required' });
    }

    // Verify doctor exists
    const doctor = await User.findOne({ _id: doctorId, role: 'doctor' }).select('firstName lastName');
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    // Check for conflicting appointment (same doctor, same date, same slot)
    const conflict = await Appointment.findOne({
      doctorId,
      date: new Date(date),
      timeSlot,
      status: { $nin: ['cancelled'] }
    });

    if (conflict) {
      return res.status(409).json({ success: false, message: 'This time slot is already booked. Please choose another.' });
    }

    const appointment = await Appointment.create({
      userId,
      doctorId,
      doctorName: `Dr. ${doctor.firstName} ${doctor.lastName}`,
      date: new Date(date),
      timeSlot,
      preferredPeriod: preferredPeriod || 'morning',
      type: type || 'video',
      notes: notes || '',
      status: 'scheduled'
    });

    // --- Notification Logic (non-blocking) ---
    try {
      const formattedDate = new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
      if (req.user.role === 'doctor') {
        // Doctor booked it. Notify the Patient.
        await Notification.create({
          recipientId: userId,
          recipientModel: 'User',
          type: 'appointment',
          title: 'New Appointment Scheduled',
          message: `Dr. ${doctor.firstName} ${doctor.lastName} has scheduled an appointment with you on ${formattedDate} at ${timeSlot}.`
        });
      } else {
        // Patient (Elderly) booked it. Notify the Doctor.
        await Notification.create({
          recipientId: doctorId,
          recipientModel: 'User',
          type: 'appointment',
          title: 'New Appointment Request',
          message: `${req.user.firstName || 'A patient'} ${req.user.lastName || ''} has booked an appointment with you for ${formattedDate} at ${timeSlot}.`
        });
      }
    } catch (notifErr) {
      console.error('Failed to create appointment notification (non-blocking):', notifErr.message);
    }

    res.status(201).json({ success: true, appointment, message: 'Appointment scheduled successfully!' });
  } catch (err) {
    console.error('Book appointment error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get single appointment
// @route   GET /api/appointments/:id
const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findOne({ _id: req.params.id, userId: req.user._id });
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }
    res.json({ success: true, appointment });
  } catch (err) {
    console.error('Get appointment error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Cancel an appointment
// @route   PUT /api/appointments/:id/cancel
const cancelAppointment = async (req, res) => {
  try {
    const filter = { _id: req.params.id };
    if (req.user.role === 'doctor') {
      filter.doctorId = req.user._id;
    } else {
      filter.userId = req.user._id;
    }

    const appointment = await Appointment.findOne(filter);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    if (appointment.status === 'cancelled') {
      return res.status(400).json({ success: false, message: 'Appointment is already cancelled' });
    }

    appointment.status = 'cancelled';
    await appointment.save();

    res.json({ success: true, appointment, message: 'Appointment cancelled' });
  } catch (err) {
    console.error('Cancel appointment error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Update an appointment
// @route   PUT /api/appointments/:id
const updateAppointment = async (req, res) => {
  try {
    const { date, timeSlot, type, status } = req.body;
    const filter = { _id: req.params.id };

    if (req.user.role === 'doctor') {
      filter.doctorId = req.user._id;
    } else {
      filter.userId = req.user._id;
    }

    const appointment = await Appointment.findOne(filter);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    if (appointment.status === 'cancelled') {
      return res.status(400).json({ success: false, message: 'Cannot update a cancelled appointment' });
    }

    if (date) appointment.date = new Date(date);
    if (timeSlot) appointment.timeSlot = timeSlot;
    if (type) appointment.type = type;
    if (status) appointment.status = status;

    await appointment.save();

    res.json({ success: true, appointment, message: 'Appointment updated successfully' });
  } catch (err) {
    console.error('Update appointment error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { getAppointments, bookAppointment, getAppointmentById, cancelAppointment, updateAppointment };
