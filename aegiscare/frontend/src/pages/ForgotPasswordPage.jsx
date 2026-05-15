import React, { useState } from 'react';
import { Mail, ArrowLeft, AlertCircle, CheckCircle, Loader, UserX } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const ForgotPasswordPage = ({ isDarkMode }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [errorType, setErrorType] = useState(''); // 'not-found', 'google', 'rate-limit', 'server', 'general'
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setErrorType('');

    if (!email) {
      setError('Please enter your email address');
      setErrorType('general');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      setErrorType('general');
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post('auth/forgot-password', { email });
      if (response.data.success) {
        setSuccess(true);
      } else {
        setError(response.data.message || 'Something went wrong');
        setErrorType('general');
      }
    } catch (err) {
      const status = err.response?.status;
      const message = err.response?.data?.message || 'Failed to send reset email. Please try again.';
      setError(message);

      if (status === 404) {
        setErrorType('not-found');
      } else if (status === 400 && message.includes('Google')) {
        setErrorType('google');
      } else if (status === 429) {
        setErrorType('rate-limit');
      } else if (status === 500) {
        setErrorType('server');
      } else {
        setErrorType('general');
      }
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
        <Link
          to="/login"
          className={`inline-flex items-center space-x-2 mb-6 group text-sm font-medium transition-colors ${
            isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
          }`}
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Login</span>
        </Link>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 mb-4">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h1 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
            Forgot Password?
          </h1>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Enter your email and we'll send you a reset link
          </p>
        </div>

        {success ? (
          <div className={`p-6 rounded-2xl text-center ${
            isDarkMode ? 'bg-green-900/30 border border-green-700/50' : 'bg-green-50 border border-green-200'
          }`}>
            <CheckCircle className={`w-12 h-12 mx-auto mb-4 ${isDarkMode ? 'text-green-400' : 'text-green-500'}`} />
            <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-green-300' : 'text-green-800'}`}>
              Check Your Email
            </h3>
            <p className={`text-sm mb-4 ${isDarkMode ? 'text-green-400' : 'text-green-700'}`}>
              We've sent a password reset link to <strong>{email}</strong>. Please check your inbox and spam folder.
            </p>
            <Link
              to="/login"
              className={`inline-flex items-center text-sm font-medium transition-colors ${
                isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
              }`}
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Return to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  Email Address
                </div>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); setErrorType(''); }}
                className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-offset-2 transition-all duration-300 ${
                  error
                    ? 'border-red-500 focus:ring-red-500'
                    : isDarkMode
                    ? 'bg-gray-800 border-gray-700 focus:border-blue-500 focus:ring-blue-500/30 text-gray-100'
                    : 'bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 text-gray-900'
                }`}
                placeholder="Email"
              />
            </div>

            {error && (
              <div className={`p-4 rounded-xl ${
                errorType === 'not-found'
                  ? isDarkMode ? 'bg-amber-900/30 border border-amber-700/50' : 'bg-amber-50 border border-amber-200'
                  : isDarkMode ? 'bg-red-900/30 border border-red-700/50' : 'bg-red-50 border border-red-200'
              }`}>
                <div className="flex items-start space-x-3">
                  {errorType === 'not-found' ? (
                    <UserX className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`} />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className={`text-sm font-medium ${
                      errorType === 'not-found'
                        ? isDarkMode ? 'text-amber-300' : 'text-amber-800'
                        : 'text-red-500'
                    }`}>{error}</p>
                    {errorType === 'not-found' && (
                      <Link
                        to="/signup"
                        className={`inline-flex items-center text-sm font-medium mt-2 transition-colors ${
                          isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
                        }`}
                      >
                        Create an account &rarr;
                      </Link>
                    )}
                    {errorType === 'google' && (
                      <Link
                        to="/login"
                        className={`inline-flex items-center text-sm font-medium mt-2 transition-colors ${
                          isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
                        }`}
                      >
                        Go to Login &rarr;
                      </Link>
                    )}
                  </div>
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
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="w-5 h-5 mr-3" />
                  Send Reset Link
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
