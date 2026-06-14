const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

// Initialize Google OAuth client
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};

/**
 * @desc    Handle Google OAuth login/registration
 * @route   POST /api/auth/google
 * @access  Public
 */
exports.googleLogin = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Google token is required'
      });
    }

    // Verify Google token
    let ticket;
    try {
      ticket = await googleClient.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID
      });
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Invalid Google token'
      });
    }

    const payload = ticket.getPayload();
    const googleId = payload['sub'];
    const email = payload['email'];
    const firstName = payload['given_name'] || '';
    const lastName = payload['family_name'] || '';
    const profilePicture = payload['picture'] || '';

    console.log('Google Auth Payload:', { email, firstName, lastName, googleId });

    // Check if user exists
    let user = await User.findOne({ email: email.toLowerCase() });

    if (user) {
      // User exists - update Google info if not already set
      if (!user.googleId) {
        user.googleId = googleId;
        user.isGoogleAuth = true;
        user.profilePicture = profilePicture;
      }
      user.lastLogin = new Date();
      await user.save();

      // Google users cannot have admin role
      // If user has admin role, force them to select a different role
      if (user.role === 'admin' || !user.role) {
        return res.status(200).json({
          success: true,
          message: 'Role selection required',
          requiresRoleSelection: true,
          userId: user._id,
          email: user.email,
          firstName: user.firstName,
          profilePicture: user.profilePicture
        });
      }

      // If user has non-admin role, login immediately
      if (user.role && ['elderly', 'doctor', 'caregiver'].includes(user.role)) {
        const jwtToken = generateToken(user._id);
        return res.status(200).json({
          success: true,
          message: 'Login successful',
          token: jwtToken,
          user: {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            phone: user.phone,
            profilePicture: user.profilePicture
          }
        });
      }
    } else {
      // User doesn't exist - create new user without role
      try {
        const newUser = await User.create({
          googleId,
          email: email.toLowerCase(),
          firstName,
          lastName,
          profilePicture,
          isGoogleAuth: true,
          // Don't set a default role - let user select during role selection
          role: null,
          phone: '', // Will be filled during role selection
          password: 'google_oauth_user' // Placeholder, not used for Google auth
        });

        console.log('New Google user created:', newUser._id);

        return res.status(201).json({
          success: true,
          message: 'Role selection required',
          requiresRoleSelection: true,
          userId: newUser._id,
          email: newUser.email,
          firstName: newUser.firstName,
          profilePicture: newUser.profilePicture
        });
      } catch (error) {
        console.error('Error creating new Google user:', error);
        return res.status(500).json({
          success: false,
          message: 'Error creating user account',
          error: error.message
        });
      }
    }
  } catch (error) {
    console.error('Google login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during Google login',
      error: error.message
    });
  }
};

/**
 * @desc    Complete Google registration by selecting role
 * @route   POST /api/auth/google/complete-registration
 * @access  Public
 */
exports.completeGoogleRegistration = async (req, res) => {
  try {
    const { userId, role, phone, specialization, licenseNumber } = req.body;

    // Validate required fields
    if (!userId || !role) {
      return res.status(400).json({
        success: false,
        message: 'User ID and role are required'
      });
    }

    // Validate role
    const validRoles = ['elderly', 'doctor', 'caregiver'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role selected'
      });
    }

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user is Google auth user
    if (!user.isGoogleAuth) {
      return res.status(403).json({
        success: false,
        message: 'Only Google OAuth users can use this endpoint'
      });
    }

    // Update user with role and additional info
    user.role = role;
    if (phone) user.phone = phone;
    if (specialization && role === 'doctor') user.specialization = specialization;
    if (licenseNumber && role === 'doctor') user.licenseNumber = licenseNumber;

    // Validate required fields based on role
    if (!user.phone) {
      return res.status(400).json({
        success: false,
        message: 'Phone number is required'
      });
    }

    if (role === 'doctor' && (!user.specialization || !user.licenseNumber)) {
      return res.status(400).json({
        success: false,
        message: 'Specialization and license number are required for doctors'
      });
    }

    await user.save();
    console.log('User role completed:', userId, role);

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Registration completed successfully',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        phone: user.phone,
        profilePicture: user.profilePicture
      }
    });
  } catch (error) {
    console.error('Complete registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration completion',
      error: error.message
    });
  }
};

/**
 * @desc    Get user profile
 * @route   GET /api/auth/google/profile/:userId
 * @access  Private
 */
exports.getGoogleUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
