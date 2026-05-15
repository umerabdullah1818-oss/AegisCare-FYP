const Admin = require('../models/admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};

// @desc    Register admin (Only for system initialization, not via regular signup)
// @route   POST /api/admin/register
// @access  Private (Should be restricted to super admin or system initialization only)
exports.adminRegister = async (req, res) => {
  try {
    console.log('Admin registration request received:', req.body);
    const { firstName, lastName, email, password, phone, permissions } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !password || !phone) {
      console.log('Missing required fields');
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: email.toLowerCase() });
    if (existingAdmin) {
      console.log('Admin already exists:', email);
      return res.status(400).json({
        success: false,
        message: 'Admin with this email already exists'
      });
    }

    // Validate password strength
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create admin
    const admin = await Admin.create({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password: hashedPassword,
      phone,
      permissions: permissions || ['manage_users', 'manage_system', 'view_analytics', 'manage_settings']
    });

    console.log('Admin created successfully:', admin._id);

    // Generate token
    const token = generateToken(admin._id);

    res.status(201).json({
      success: true,
      message: 'Admin registered successfully',
      token,
      admin: {
        id: admin._id,
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
        role: admin.role,
        phone: admin.phone,
        permissions: admin.permissions
      }
    });
  } catch (error) {
    console.error('Admin registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during admin registration',
      error: error.message
    });
  }
};

// @desc    Login admin
// @route   POST /api/admin/login
// @access  Public
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Check if admin exists
    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid admin credentials'
      });
    }

    // Check if admin is active
    if (!admin.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Admin account is inactive'
      });
    }

    // Check password
    const isPasswordMatch = await bcrypt.compare(password, admin.password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid admin credentials'
      });
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    // Generate token
    const token = generateToken(admin._id);

    res.status(200).json({
      success: true,
      message: 'Admin login successful',
      token,
      admin: {
        id: admin._id,
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
        role: admin.role,
        phone: admin.phone,
        permissions: admin.permissions
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during admin login',
      error: error.message
    });
  }
};

// @desc    Get admin profile
// @route   GET /api/admin/profile/:id
// @access  Private
exports.getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id).select('-password');
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    res.status(200).json({
      success: true,
      admin
    });
  } catch (error) {
    console.error('Error fetching admin profile:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update admin profile
// @route   PUT /api/admin/profile/:id
// @access  Private
exports.updateAdminProfile = async (req, res) => {
  try {
    const { firstName, lastName, phone } = req.body;

    const admin = await Admin.findByIdAndUpdate(
      req.params.id,
      { firstName, lastName, phone, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).select('-password');

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Admin profile updated successfully',
      admin
    });
  } catch (error) {
    console.error('Error updating admin profile:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// --- Assignment Management APIs ---

const User = require('../models/user');
const Notification = require('../models/notification');

// @desc    Get all users grouped by role
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    
    const grouped = {
      elderly: users.filter(u => u.role === 'elderly'),
      caregivers: users.filter(u => u.role === 'caregiver'),
      doctors: users.filter(u => u.role === 'doctor'),
    };

    res.status(200).json({
      success: true,
      totalCount: users.length,
      data: grouped,
      all: users
    });
  } catch (error) {
    console.error('Error fetching all users:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Get all elderly with their assigned caregiver and doctor
// @route   GET /api/admin/assignments
// @access  Private/Admin
exports.getAssignments = async (req, res) => {
  try {
    const elderly = await User.find({ role: 'elderly' })
      .select('firstName lastName email phone address assignedCaregivers assignedDoctor')
      .populate('assignedCaregivers', 'firstName lastName email')
      .populate('assignedDoctor', 'firstName lastName email');

    res.status(200).json({ success: true, count: elderly.length, data: elderly });
  } catch (error) {
    console.error('Error fetching assignments:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Assign a caregiver to an elderly user
// @route   POST /api/admin/assign-caregiver
// @access  Private/Admin
exports.assignElderlyToCaregiver = async (req, res) => {
  try {
    const { elderlyId, caregiverId } = req.body;
    if (!elderlyId || !caregiverId) {
      return res.status(400).json({ success: false, message: 'elderlyId and caregiverId are required' });
    }

    const elderly = await User.findOne({ _id: elderlyId, role: 'elderly' });
    if (!elderly) return res.status(404).json({ success: false, message: 'Elderly user not found' });

    const caregiver = await User.findOne({ _id: caregiverId, role: 'caregiver' });
    if (!caregiver) return res.status(404).json({ success: false, message: 'Caregiver not found' });

    await User.findByIdAndUpdate(elderlyId, {
      $addToSet: { assignedCaregivers: caregiverId }
    });

    // Notify caregiver
    await Notification.create({
      recipientId: caregiverId,
      senderId: elderly._id,
      type: 'assignment',
      title: 'New Elderly Assigned',
      message: `You have been assigned to monitor ${elderly.firstName} ${elderly.lastName}.`
    });

    // Notify elderly
    await Notification.create({
      recipientId: elderlyId,
      senderId: caregiverId,
      type: 'assignment',
      title: 'Caregiver Assigned',
      message: `${caregiver.firstName} ${caregiver.lastName} has been assigned as your caregiver.`
    });

    res.status(200).json({ success: true, message: 'Caregiver assigned successfully' });
  } catch (error) {
    console.error('Error assigning caregiver:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Assign a doctor to an elderly user
// @route   POST /api/admin/assign-doctor
// @access  Private/Admin
exports.assignElderlyToDoctor = async (req, res) => {
  try {
    const { elderlyId, doctorId } = req.body;
    if (!elderlyId || !doctorId) {
      return res.status(400).json({ success: false, message: 'elderlyId and doctorId are required' });
    }

    const elderly = await User.findOne({ _id: elderlyId, role: 'elderly' });
    if (!elderly) return res.status(404).json({ success: false, message: 'Elderly user not found' });

    const doctor = await User.findOne({ _id: doctorId, role: 'doctor' });
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });

    await User.findByIdAndUpdate(elderlyId, { assignedDoctor: doctorId });

    // Notify doctor
    await Notification.create({
      recipientId: doctorId,
      senderId: elderly._id,
      type: 'assignment',
      title: 'New Patient Assigned',
      message: `You have been assigned as the doctor for ${elderly.firstName} ${elderly.lastName}.`
    });

    // Notify elderly
    await Notification.create({
      recipientId: elderlyId,
      senderId: doctorId,
      type: 'assignment',
      title: 'Doctor Assigned',
      message: `Dr. ${doctor.firstName} ${doctor.lastName} has been assigned as your doctor.`
    });

    res.status(200).json({ success: true, message: 'Doctor assigned successfully' });
  } catch (error) {
    console.error('Error assigning doctor:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Get system wide statistics for admin dashboard
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalDoctors = await User.countDocuments({ role: 'doctor' });
    const activeElderly = await User.countDocuments({ role: 'elderly' });
    
    const systemAlerts = await Notification.countDocuments({ isRead: false });

    // Simulate daily logs using today's activity + base factor
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const recentNotifs = await Notification.countDocuments({ createdAt: { $gte: today } });
    const recentUsers = await User.countDocuments({ createdAt: { $gte: today } });
    const dailyLogs = recentNotifs + recentUsers;

    const serverUptime = 99.9;

    const os = require('os');
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const memoryUsage = Math.round(((totalMem - freeMem) / totalMem) * 100);
    const cpuUsage = Math.floor(Math.random() * 20) + 30; // Mock 30-50%
    const storageUsage = Math.floor(Math.random() * 10) + 40; // Mock 40-50%
    const networkUsage = Math.floor(Math.random() * 15) + 15; // Mock 15-30%

    const recentUsersList = await User.find().sort({ createdAt: -1 }).limit(5);
    const recentNotifsList = await Notification.find().sort({ createdAt: -1 }).limit(5).populate('senderId recipientId');
    
    let activities = [];
    
    recentUsersList.forEach(u => {
      activities.push({
        user: `${u.firstName} ${u.lastName}`,
        action: `Registered as ${u.role}`,
        timeObj: u.createdAt,
        color: u.role === 'doctor' ? 'emerald' : u.role === 'caregiver' ? 'amber' : 'purple'
      });
    });

    recentNotifsList.forEach(n => {
      const senderName = n.senderId ? `${n.senderId.firstName} ${n.senderId.lastName}` : 'System';
      activities.push({
        user: senderName,
        action: n.title || 'Sent a notification',
        timeObj: n.createdAt,
        color: n.type === 'emergency' ? 'rose' : 'blue'
      });
    });

    activities.sort((a, b) => new Date(b.timeObj) - new Date(a.timeObj));
    activities = activities.slice(0, 5).map(a => {
      const diffMins = Math.round((new Date() - new Date(a.timeObj)) / 60000);
      const timeStr = diffMins < 60 ? `${diffMins} mins ago` : diffMins < 1440 ? `${Math.floor(diffMins/60)} hours ago` : `${Math.floor(diffMins/1440)} days ago`;
      return {
        user: a.user,
        action: a.action,
        time: timeStr,
        color: a.color
      };
    });

    const baseVal1 = Math.floor(totalUsers / 10);
    const baseVal2 = Math.floor(totalDoctors * 2);
    
    // Define 4 arrays of data representing CPU, Memory, Storage, and Network
    const chartData = {
      data: [
        Array.from({length: 12}, (_, i) => Math.min(100, Math.floor(Math.random() * 20) + 30 + (i * 2))), // CPU Trend
        Array.from({length: 12}, (_, i) => Math.min(100, Math.floor(Math.random() * 15) + 40 + (i * 1.5))), // Memory Trend
        Array.from({length: 12}, (_, i) => Math.min(100, Math.floor(Math.random() * 10) + 45 + (i * 1))), // Storage Trend
        Array.from({length: 12}, (_, i) => Math.min(100, Math.floor(Math.random() * 25) + 15 + (i * 2.5))) // Network Trend
      ],
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    };

    const systemMetrics = [
      { label: 'CPU Usage', value: `${cpuUsage}%`, color: 'emerald' },
      { label: 'Memory', value: `${memoryUsage}%`, color: 'amber' },
      { label: 'Storage', value: `${storageUsage}%`, color: 'blue' },
      { label: 'Network', value: `${networkUsage}%`, color: 'purple' }
    ];

    const alerts = recentNotifsList.map((n, idx) => ({
      id: n._id || idx,
      type: n.type === 'emergency' ? 'Security' : 'System',
      title: n.title || 'System Notification',
      description: n.message || 'Action required',
      timestamp: new Date(n.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
      severity: n.type === 'emergency' ? 'high' : 'medium'
    }));

    if (alerts.length === 0) {
      alerts.push({ id: 1, type: 'System', title: 'System Status', description: 'All systems running smoothly', timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), severity: 'low' });
    }

    const systemLogs = activities.map((a, i) => ({
      id: i,
      timestamp: a.time,
      user: a.user,
      action: a.action,
      status: a.color === 'rose' ? 'failed' : 'success',
      severity: a.color === 'rose' ? 'high' : a.color === 'amber' ? 'medium' : 'low'
    }));

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalDoctors,
        activeElderly,
        systemAlerts,
        dailyLogs,
        serverUptime,
        activities,
        systemMetrics,
        chartData,
        alerts,
        systemLogs
      }
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Add a new user
// @route   POST /api/admin/users
// @access  Private/Admin
exports.addUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role, phone, specialization, licenseNumber, dateOfBirth } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password || 'AegisCare123!', salt);

    const userData = {
      firstName,
      lastName,
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
      phone: phone || '',
      status: role === 'doctor' ? 'pending' : 'active'
    };

    if (role === 'doctor') {
      userData.specialization = specialization;
      userData.licenseNumber = licenseNumber;
    }
    if (role === 'elderly' && dateOfBirth) {
      userData.dateOfBirth = dateOfBirth;
    }

    const user = await User.create(userData);

    res.status(201).json({ success: true, message: 'User created successfully', data: user });
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Update user status
// @route   PUT /api/admin/users/:id/status
// @access  Private/Admin
exports.updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { status }, { new: true });
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Log activity
    await Notification.create({
      recipientId: req.user._id,
      recipientModel: 'Admin',
      type: 'general',
      title: `User ${status.charAt(0).toUpperCase() + status.slice(1)}`,
      message: `Admin changed status of ${user.firstName} ${user.lastName} (${user.role}) to ${status}.`
    });
    
    res.status(200).json({ success: true, message: `User status updated to ${status}`, data: user });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Log the deletion as an activity
    await Notification.create({
      recipientId: req.user._id,
      recipientModel: 'Admin',
      type: 'general',
      title: `Deleted ${user.role}`,
      message: `Admin deleted ${user.role} user: ${user.firstName} ${user.lastName} (${user.email}).`
    });

    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Bulk Verify Doctors
// @route   POST /api/admin/users/bulk-verify
// @access  Private/Admin
exports.bulkVerifyDoctors = async (req, res) => {
  try {
    const result = await User.updateMany(
      { role: 'doctor', status: 'pending' },
      { $set: { status: 'verified' } }
    );
    if (result.modifiedCount > 0) {
      await Notification.create({
        recipientId: req.user._id,
        recipientModel: 'Admin',
        type: 'general',
        title: 'Batch Verification',
        message: `Admin batch verified ${result.modifiedCount} pending doctors.`
      });
    }
    res.status(200).json({ success: true, message: `${result.modifiedCount} doctors verified`, count: result.modifiedCount });
  } catch (error) {
    console.error('Error in bulk verify:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Bulk Remove Inactive Users
// @route   DELETE /api/admin/users/bulk-remove
// @access  Private/Admin
exports.bulkRemoveInactive = async (req, res) => {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const result = await User.deleteMany({ 
      status: 'inactive', 
      $or: [
        { lastLogin: { $lte: thirtyDaysAgo } },
        { lastLogin: null, createdAt: { $lte: thirtyDaysAgo } }
      ]
    });

    if (result.deletedCount > 0) {
      await Notification.create({
        recipientId: req.user._id,
        recipientModel: 'Admin',
        type: 'general',
        title: 'System Cleanup',
        message: `System automatically pruned ${result.deletedCount} users inactive for > 30 days.`
      });
    }

    res.status(200).json({ success: true, message: `${result.deletedCount} inactive users removed`, count: result.deletedCount });
  } catch (error) {
    console.error('Error in bulk remove:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Log generic admin activity
// @route   POST /api/admin/system/activity-log
// @access  Private/Admin
exports.logActivity = async (req, res) => {
  try {
    const { title, message } = req.body;
    await Notification.create({
      recipientId: req.user._id,
      recipientModel: 'Admin',
      type: 'general',
      title: title || 'System Event',
      message: message || 'An administrative action was performed.'
    });
    res.status(200).json({ success: true, message: 'Activity logged successfully' });
  } catch (error) {
    console.error('Error logging activity:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Get all activities for Activity Log page
// @route   GET /api/admin/activities
// @access  Private/Admin
exports.getAllActivities = async (req, res) => {
  try {
    // Get all users sorted by creation date
    const allUsers = await User.find().sort({ createdAt: -1 }).limit(100);
    // Get all notifications sorted by creation date
    const allNotifs = await Notification.find().sort({ createdAt: -1 }).limit(200).populate('senderId recipientId');

    let activities = [];

    allUsers.forEach(u => {
      activities.push({
        id: u._id,
        user: `${u.firstName} ${u.lastName}`,
        action: `Registered as ${u.role}`,
        type: 'registration',
        role: u.role,
        email: u.email,
        timestamp: u.createdAt,
        color: u.role === 'doctor' ? 'emerald' : u.role === 'caregiver' ? 'amber' : 'purple'
      });
    });

    allNotifs.forEach(n => {
      const senderName = n.senderId ? `${n.senderId.firstName} ${n.senderId.lastName}` : 'System';
      const recipientName = n.recipientId ? `${n.recipientId.firstName || ''} ${n.recipientId.lastName || ''}`.trim() : 'N/A';
      activities.push({
        id: n._id,
        user: senderName,
        action: n.title || 'Sent a notification',
        description: n.message || '',
        type: n.type === 'emergency' ? 'emergency' : n.title && n.title.includes('Deleted') ? 'deletion' : n.title && n.title.includes('Batch') ? 'bulk_action' : n.title && n.title.includes('Cleanup') ? 'bulk_action' : n.title && n.title.includes('Export') ? 'export' : 'notification',
        recipient: recipientName,
        timestamp: n.createdAt,
        color: n.type === 'emergency' ? 'rose' : n.title && n.title.includes('Deleted') ? 'red' : n.title && n.title.includes('Batch') ? 'indigo' : 'blue'
      });
    });

    activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    res.status(200).json({
      success: true,
      data: activities,
      total: activities.length
    });
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
