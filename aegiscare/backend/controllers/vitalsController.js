/**
 * Vitals Controller — Manages Google Fit OAuth flow and vitals data syncing.
 */

const googleFitService = require('../services/googleFitService');
const User = require('../models/user');

/**
 * @desc    Get Google Fit OAuth authorization URL
 * @route   GET /api/vitals/google/connect
 * @access  Private
 */
const connectGoogleFit = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const authUrl = googleFitService.getAuthUrl(userId);
    res.json({ success: true, authUrl });
  } catch (error) {
    console.error('Error generating Google Fit auth URL:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Handle Google Fit OAuth callback
 * @route   GET /api/vitals/google/callback
 * @access  Public (redirect from Google)
 */
const googleFitCallback = async (req, res) => {
  try {
    const { code, state: userId } = req.query;

    if (!code || !userId) {
      return res.redirect(`${process.env.FRONTEND_URL}?googlefit=error&message=missing_params`);
    }

    await googleFitService.handleCallback(code, userId);

    // Redirect back to the frontend with success
    res.redirect(`${process.env.FRONTEND_URL}?googlefit=connected`);
  } catch (error) {
    console.error('Google Fit callback error:', error);
    res.redirect(`${process.env.FRONTEND_URL}?googlefit=error&message=${encodeURIComponent(error.message)}`);
  }
};

/**
 * @desc    Check if user has Google Fit connected
 * @route   GET /api/vitals/google/status
 * @access  Private
 */
const getGoogleFitStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('googleFitConnected lastVitalsSync');
    res.json({
      success: true,
      connected: user?.googleFitConnected || false,
      lastSync: user?.lastVitalsSync || null,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Disconnect Google Fit
 * @route   POST /api/vitals/google/disconnect
 * @access  Private
 */
const disconnectGoogleFit = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, {
      googleFitConnected: false,
      googleFitAccessToken: null,
      googleFitRefreshToken: null,
      googleFitTokenExpiry: null,
    });

    res.json({ success: true, message: 'Google Fit disconnected' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Sync vitals from Google Fit (fetch latest data)
 * @route   POST /api/vitals/sync
 * @access  Private
 */
const syncVitals = async (req, res) => {
  try {
    const hours = parseInt(req.query.hours) || 24;
    const vitals = await googleFitService.fetchAllVitals(req.user._id.toString(), hours);

    res.json({
      success: true,
      data: vitals,
      message: 'Vitals synced from Google Fit',
    });
  } catch (error) {
    console.error('Vitals sync error:', error);

    if (error.message.includes('not connected') || error.message.includes('reconnect')) {
      return res.status(403).json({
        success: false,
        message: 'Google Fit not connected. Please connect your account first.',
        requiresConnection: true,
      });
    }

    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get latest synced vitals (returns cached/synced data)
 * @route   GET /api/vitals/latest
 * @access  Private
 */
const getLatestVitals = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('googleFitConnected lastVitalsSync');

    if (!user?.googleFitConnected) {
      return res.json({
        success: true,
        data: null,
        connected: false,
        message: 'Google Fit not connected',
      });
    }

    // Fetch fresh data from Google Fit
    const hours = parseInt(req.query.hours) || 24;
    const vitals = await googleFitService.fetchAllVitals(req.user._id.toString(), hours);

    res.json({
      success: true,
      data: vitals,
      connected: true,
    });
  } catch (error) {
    console.error('Error getting latest vitals:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  connectGoogleFit,
  googleFitCallback,
  getGoogleFitStatus,
  disconnectGoogleFit,
  syncVitals,
  getLatestVitals,
};
