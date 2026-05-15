import React, { useState, useEffect, useMemo } from 'react';
import { Lock, Eye, EyeOff, ArrowLeft, AlertCircle, CheckCircle, Loader, ShieldAlert } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const ResetPasswordPage = ({ isDarkMode }) => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState(null); // null = loading, true = valid, false = invalid
  const [tokenError, setTokenError] = useState('');

  // Verify token on page load
  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await api.get(`auth/verify-reset-token/${token}`);
        if (response.data.success) {
          setTokenValid(true);
        } else {
          setTokenValid(false);
          setTokenError(response.data.message || 'Invalid or expired reset link.');
        }
      } catch (err) {
        setTokenValid(false);
        setTokenError(err.response?.data?.message || 'This reset link is invalid or has expired. Please request a new one.');
      }
    };
    verifyToken();
  }, [token]);

  // Password strength checks
  const passwordChecks = useMemo(() => ({
    minLength: password.length >= 8,
    hasUpper: /[A-Z]/.test(password),
    hasLower: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  }), [password]);

  const allChecksPassed = Object.values(passwordChecks).every(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!password || !confirmPassword) {
      setError('Please fill in both fields');
      return;
    }

    if (!allChecksPassed) {
      setError('Please meet all password requirements');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post(`auth/reset-password/${token}`, { password });
      if (response.data.success) {
        setSuccess(true);
      } else {
        setError(response.data.message || 'Something went wrong');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. The link may be invalid or expired.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 transition-all duration-500 ${
      isDarkMode
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-950'
        : 'bg-gradient-to-br from-blue-50 via-white to-indigo-50'
    }`}>
      <div className={`w-full max-w-md rounded-3xl p-8 shadow-2xl ${
        isDarkMode
          ? 'bg-gradient-to-br from-gray-900/80 via-gray-800/80 to-gray-900/80 border border-gray-700/50 backdrop-blur-lg'
          : 'bg-white/90 border border-blue-100/50 backdrop-blur-lg'
      }`}>
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
            Reset Password
          </h1>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Enter your new password below
          </p>
        </div>

        {/* Token verification loading */}
        {tokenValid === null && (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader className={`w-10 h-10 animate-spin mb-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Verifying your reset link...</p>
          </div>
        )}

        {/* Token invalid */}
        {tokenValid === false && (
          <div className={`p-6 rounded-2xl text-center ${
            isDarkMode ? 'bg-red-900/30 border border-red-700/50' : 'bg-red-50 border border-red-200'
          }`}>
            <ShieldAlert className={`w-12 h-12 mx-auto mb-4 ${isDarkMode ? 'text-red-400' : 'text-red-500'}`} />
            <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-red-300' : 'text-red-800'}`}>
              Invalid or Expired Link
            </h3>
            <p className={`text-sm mb-4 ${isDarkMode ? 'text-red-400' : 'text-red-700'}`}>
              {tokenError}
            </p>
            <Link
              to="/forgot-password"
              className={`inline-flex items-center px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 ${
                isDarkMode
                  ? 'bg-gradient-to-r from-blue-700 to-indigo-700 text-white'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
              }`}
            >
              Request New Link
            </Link>
          </div>
        )}

        {tokenValid === true && success ? (
          <div className={`p-6 rounded-2xl text-center ${
            isDarkMode ? 'bg-green-900/30 border border-green-700/50' : 'bg-green-50 border border-green-200'
          }`}>
            <CheckCircle className={`w-12 h-12 mx-auto mb-4 ${isDarkMode ? 'text-green-400' : 'text-green-500'}`} />
            <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-green-300' : 'text-green-800'}`}>
              Password Reset Successfully!
            </h3>
            <p className={`text-sm mb-4 ${isDarkMode ? 'text-green-400' : 'text-green-700'}`}>
              Your password has been updated. You can now sign in with your new password.
            </p>
            <button
              onClick={() => navigate('/login')}
              className={`inline-flex items-center px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 ${
                isDarkMode
                  ? 'bg-gradient-to-r from-blue-700 to-indigo-700 text-white'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
              }`}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go to Login
            </button>
          </div>
        ) : tokenValid === true ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <div className="flex items-center">
                  <Lock className="w-4 h-4 mr-2" />
                  New Password
                </div>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  placeholder="New password"
                  className={`w-full px-4 py-3 pr-12 rounded-xl border focus:ring-2 focus:ring-offset-2 transition-all duration-300 ${
                    error
                      ? 'border-red-500 focus:ring-red-500'
                      : isDarkMode
                      ? 'bg-gray-800 border-gray-700 focus:border-blue-500 focus:ring-blue-500/30 text-gray-100'
                      : 'bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 text-gray-900'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 hover:scale-110 transition-transform"
                >
                  {showPassword ? (
                    <EyeOff className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  ) : (
                    <Eye className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  )}
                </button>
              </div>
            </div>

            {/* Password strength requirements */}
            {password.length > 0 && (
              <div className={`p-3 rounded-xl text-xs space-y-1 ${
                isDarkMode ? 'bg-gray-800/50 border border-gray-700/50' : 'bg-gray-50 border border-gray-200'
              }`}>
                <p className={`font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Password must have:</p>
                {[
                  { key: 'minLength', label: 'At least 8 characters' },
                  { key: 'hasUpper', label: 'One uppercase letter (A-Z)' },
                  { key: 'hasLower', label: 'One lowercase letter (a-z)' },
                  { key: 'hasNumber', label: 'One number (0-9)' },
                  { key: 'hasSpecial', label: 'One special character (!@#$%...)' },
                ].map(({ key, label }) => (
                  <div key={key} className="flex items-center space-x-2">
                    {passwordChecks[key] ? (
                      <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                    ) : (
                      <AlertCircle className={`w-3.5 h-3.5 flex-shrink-0 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                    )}
                    <span className={passwordChecks[key]
                      ? 'text-green-500'
                      : isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }>{label}</span>
                  </div>
                ))}
              </div>
            )}

            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <div className="flex items-center">
                  <Lock className="w-4 h-4 mr-2" />
                  Confirm New Password
                </div>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
                  placeholder="Confirm password"
                  className={`w-full px-4 py-3 pr-12 rounded-xl border focus:ring-2 focus:ring-offset-2 transition-all duration-300 ${
                    error
                      ? 'border-red-500 focus:ring-red-500'
                      : isDarkMode
                      ? 'bg-gray-800 border-gray-700 focus:border-blue-500 focus:ring-blue-500/30 text-gray-100'
                      : 'bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 text-gray-900'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 hover:scale-110 transition-transform"
                >
                  {showConfirmPassword ? (
                    <EyeOff className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  ) : (
                    <Eye className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  )}
                </button>
              </div>
              {/* Match indicator */}
              {confirmPassword.length > 0 && (
                <p className={`text-xs mt-1 ${password === confirmPassword ? 'text-green-500' : 'text-red-500'}`}>
                  {password === confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                </p>
              )}
            </div>

            {error && (
              <div className={`p-4 rounded-xl ${
                isDarkMode ? 'bg-red-900/30 border border-red-700/50' : 'bg-red-50 border border-red-200'
              }`}>
                <div className="flex items-center space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <p className="text-red-500 text-sm">{error}</p>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 px-6 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center ${
                isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:scale-105'
              } ${
                isDarkMode
                  ? 'bg-gradient-to-r from-blue-700 to-indigo-700 text-white hover:from-blue-600 hover:to-indigo-600'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
              }`}
            >
              {isLoading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin mr-3" />
                  Resetting...
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5 mr-3" />
                  Reset Password
                </>
              )}
            </button>

            <div className="text-center">
              <Link
                to="/login"
                className={`inline-flex items-center text-sm font-medium transition-colors ${
                  isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
                }`}
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Login
              </Link>
            </div>
          </form>
        ) : null}
      </div>
    </div>
  );
};

export default ResetPasswordPage;
