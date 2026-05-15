// LoginPage.jsx
import React, { useState, useEffect } from 'react';
import { 
  LogIn, Mail, Lock, Eye, EyeOff, ArrowLeft,
  Shield, Key, AlertCircle,
  CheckCircle, Heart, Stethoscope, Users, Sparkles,
  Activity, Brain, ShieldCheck, Clock,
  HeartPulse, UserCircle, Bell,
  Loader
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import Footer from '../components/Footer';
import { validateLoginForm, validateField } from '../utils/validationUtils';
import api from '../services/api';

const LoginPage = ({ onToggleDarkMode, isDarkMode }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [twoFactorRequired, setTwoFactorRequired] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const loginMethod = 'email';
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(100);
  const [selectedDemoAccount, setSelectedDemoAccount] = useState(null);

  // Typewriter effect texts
  const typewriterTexts = [
    "Secure Login for Elderly Care",
    "AI-Powered Health Monitoring",
    "Professional Healthcare Platform",
    "24/7 Emergency Response System",
    "HIPAA Compliant & Secure"
  ];

  // Typewriter effect
  useEffect(() => {
    const current = typewriterTexts[currentTextIndex];
    
    const timer = setTimeout(() => {
      if (!isDeleting) {
        setCurrentText(current.substring(0, currentText.length + 1));
        if (currentText === current) {
          setIsDeleting(true);
          setTypingSpeed(1500);
          return;
        }
      } else {
        setCurrentText(current.substring(0, currentText.length - 1));
        if (currentText === '') {
          setIsDeleting(false);
          setCurrentTextIndex((prev) => (prev + 1) % typewriterTexts.length);
          setTypingSpeed(100);
          return;
        }
      }
      setTypingSpeed(isDeleting ? 50 : 100);
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [currentText, currentTextIndex, isDeleting, typingSpeed, typewriterTexts]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Real-time validation
    if (errors[name]) {
      const fieldError = validateField(name, value, formData);
      if (fieldError) {
        setErrors(prev => ({ ...prev, [name]: fieldError }));
      } else {
        setErrors(prev => ({ ...prev, [name]: '' }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = validateLoginForm(formData, loginMethod);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // Admin credentials from seedAdmin.js
      const adminEmails = ['admin@aegiscare.com', 'manager@aegiscare.com'];
      const isAdminLogin = adminEmails.includes(formData.email.toLowerCase());
      
      // Determine which endpoint to use
      const endpoint = isAdminLogin ? 'admin/login' : 'auth/login';
      
      // Use API service which automatically sets Authorization header
      const response = await api.post(endpoint, {
        email: formData.email,
        password: formData.password
      });

      const data = response.data;

      // Store token and user info
      localStorage.setItem('token', data.token);
      
      // Clear any stale Google OAuth flag from previous sessions
      localStorage.removeItem('isGoogleAuth');

      // Handle both regular user and admin responses
      const userInfo = data.user || data.admin;
      localStorage.setItem('userRole', userInfo.role);
      localStorage.setItem('userEmail', userInfo.email);
      localStorage.setItem('userFirstName', userInfo.firstName);
      localStorage.setItem('userId', userInfo.id);

      console.log('Login successful:', userInfo);

      // Redirect based on role
      const dashboardMap = {
        admin: '/admin-dashboard',
        elderly: '/elderly-dashboard',
        doctor: '/doctor-dashboard',
        caregiver: '/caregiver-dashboard'
      };

      const redirectPath = dashboardMap[userInfo.role] || '/';
      navigate(redirectPath);
      
    } catch (error) {
      console.error('Login error:', error);
      setErrors(prev => ({ 
        ...prev, 
        submit: error.response?.data?.message || error.message || 'Invalid credentials. Please try again.' 
      }));
    } finally {
      setIsLoading(false);
    }
  };

  // Google OAuth handler
  const handleGoogleSuccess = async (credentialResponse) => {
    setIsGoogleLoading(true);
    setErrors({});

    try {
      const token = credentialResponse.credential;

      // Send token to backend for verification using API service
      const response = await api.post(
        'auth/google/login',
        { token }
      );

      const data = response.data;

      if (data.requiresRoleSelection) {
        // User needs to select a role - redirect to role selection page
        navigate('/google-role-selection', {
          state: {
            userData: {
              id: data.userId,
              email: data.email,
              firstName: data.firstName || data.email.split('@')[0],
              profilePicture: data.profilePicture
            }
          }
        });
      } else {
        // User has role - proceed to dashboard
        const userInfo = data.user || data;

        // Google users cannot access admin dashboard
        if (userInfo.role === 'admin') {
          setErrors(prev => ({
            ...prev,
            google: 'Google OAuth is not available for admin accounts. Please use email login.'
          }));
          return;
        }

        localStorage.setItem('token', data.token);
        localStorage.setItem('userRole', userInfo.role);
        localStorage.setItem('userEmail', userInfo.email);
        localStorage.setItem('userFirstName', userInfo.firstName);
        localStorage.setItem('userId', userInfo.id || userInfo._id);
        localStorage.setItem('profilePicture', userInfo.profilePicture || '');
        localStorage.setItem('isGoogleAuth', 'true');

        console.log('Google login successful:', userInfo);

        // Redirect based on role
        const dashboardMap = {
          elderly: '/elderly-dashboard',
          doctor: '/doctor-dashboard',
          caregiver: '/caregiver-dashboard'
        };

        const redirectPath = dashboardMap[userInfo.role] || '/';
        navigate(redirectPath);
      }
    } catch (error) {
      console.error('Google login error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Google login failed';
      setErrors(prev => ({
        ...prev,
        google: errorMessage
      }));
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // Google OAuth error handler
  const handleGoogleError = () => {
    console.log('Google login failed');
    setErrors(prev => ({
      ...prev,
      google: 'Google login failed. Please try again.'
    }));
  };

  const handleTwoFactorVerify = async () => {
    if (!twoFactorCode || twoFactorCode.length !== 6) {
      setErrors(prev => ({ ...prev, twoFactor: 'Please enter a valid 6-digit code' }));
      return;
    }

    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (twoFactorCode === '123456') {
        // Store admin user info
        localStorage.setItem('userRole', 'admin');
        localStorage.setItem('userEmail', formData.email);
        localStorage.setItem('userFirstName', 'Admin');
        
        navigate('/admin-dashboard');
      } else {
        setErrors(prev => ({ ...prev, twoFactor: 'Invalid verification code' }));
      }
    } catch (error) {
      setErrors(prev => ({ ...prev, twoFactor: 'Verification failed. Please try again.' }));
    } finally {
      setIsLoading(false);
    }
  };

  // Demo accounts without Family option
  const demoAccounts = [
    { 
      role: 'Doctor', 
      email: 'doctor@demo.com', 
      password: 'demo123', 
      color: 'from-emerald-500 to-teal-600',
      icon: <Stethoscope className="w-5 h-5" />,
      dashboard: '/doctor-dashboard'
    },
    { 
      role: 'Caregiver', 
      email: 'caregiver@demo.com', 
      password: 'demo123', 
      color: 'from-amber-500 to-orange-600',
      icon: <UserCircle className="w-5 h-5" />,
      dashboard: '/caregiver-dashboard'
    },
    { 
      role: 'Elderly', 
      email: 'elderly@demo.com', 
      password: 'demo123', 
      color: 'from-rose-500 to-pink-600',
      icon: <Heart className="w-5 h-5" />,
      dashboard: '/elderly-dashboard'
    }
  ];

  const handleDemoAccountSelect = (account) => {
    setFormData({
      email: account.email,
      password: account.password,
      rememberMe: false
    });
    setSelectedDemoAccount(account);
    setErrors({}); // Clear any previous errors
  };

  return (
    <div className={`min-h-screen flex flex-col transition-all duration-500 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-950' 
        : 'bg-gradient-to-br from-blue-50 via-white to-indigo-50'
    }`}>
      {/* Enhanced Background Elements */}
      <div className="fixed inset-0 overflow-hidden">
        {/* Animated Grid */}
        <div className={`absolute inset-0 ${
          isDarkMode ? 'bg-grid-white/5' : 'bg-grid-blue-500/5'
        }`}></div>
        
        {/* Floating Particles - Slowed down */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-2 h-2 rounded-full animate-float-particle-slow ${
              isDarkMode ? 'bg-blue-500/20' : 'bg-blue-400/10'
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${8 + Math.random() * 6}s`
            }}
          ></div>
        ))}
        
        {/* Animated Orbs - Slowed down */}
        <div className={`absolute top-1/4 left-1/4 w-64 h-64 rounded-full blur-3xl animate-pulse-slower ${
          isDarkMode
            ? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10'
            : 'bg-gradient-to-r from-blue-200/20 to-purple-200/20'
        }`}></div>
        
        <div className={`absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full blur-3xl animate-pulse-slowest ${
          isDarkMode
            ? 'bg-gradient-to-r from-indigo-500/10 to-cyan-500/10'
            : 'bg-gradient-to-r from-indigo-200/20 to-cyan-200/20'
        }`}></div>
      </div>

      <div className="relative flex-1 container mx-auto px-4 py-8">
        {/* Go Back Button - Blue color scheme like Signup */}
        <Link
          to="/"
          className={`inline-flex items-center space-x-2 px-6 py-3 rounded-xl backdrop-blur-lg transition-all hover:scale-105 mb-8 group ${
            isDarkMode
              ? 'bg-gray-800/50 border border-gray-700/50 text-blue-300 hover:text-blue-400 hover:border-blue-500/30'
              : 'bg-white/50 border border-blue-200 text-blue-600 hover:text-blue-700 hover:border-blue-300'
          }`}
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Home</span>
        </Link>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Side - Interactive Illustration */}
          <div className={`rounded-3xl p-8 shadow-2xl backdrop-blur-xl ${
            isDarkMode
              ? 'bg-gradient-to-br from-gray-900/70 via-gray-800/70 to-gray-900/70 border border-gray-700/50 shadow-blue-900/20'
              : 'bg-gradient-to-br from-white/80 via-blue-50/80 to-white/80 border border-blue-100/50 shadow-blue-100/20'
          }`}>
            {/* Logo and Title */}
            <div className="text-center mb-8">
              <div className="relative inline-flex items-center justify-center w-48 h-48 mb-6">
                <div className="relative w-48 h-48 rounded-3xl flex items-center justify-center animate-logo-pulse">
                  <img src="/assets/fulllogo.png" alt="AegisCare Logo" className="w-full h-full object-contain rounded-3xl" />
                  <div className="absolute inset-0 rounded-full border-2 border-blue-400/30 animate-ring-expand-4-5s"></div>
                  <div className="absolute inset-0 rounded-full border-2 border-cyan-400/20 animate-ring-expand-delayed-4-5s"></div>
                </div>
              </div>
              
              <h2 className={`text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent ${
                isDarkMode ? 'brightness-125' : ''
              }`}>
                Welcome Back
              </h2>
              
              {/* Typewriter Effect */}
              <div className={`h-12 mb-6 flex items-center justify-center ${
                isDarkMode ? 'text-blue-300' : 'text-blue-600'
              }`}>
                <div className="relative">
                  <span className="text-2xl font-semibold">{currentText}</span>
                  <span className={`absolute right-[-10px] top-1/2 transform -translate-y-1/2 w-1 h-8 ${
                    isDarkMode ? 'bg-blue-400' : 'bg-blue-500'
                  } animate-pulse`}></span>
                </div>
              </div>
              
              <p className={`text-lg mb-6 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Secure access to your elderly care dashboard
              </p>
            </div>

            {/* Security Stats */}
            <div className={`rounded-2xl p-6 mb-8 ${
              isDarkMode
                ? 'bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50'
                : 'bg-gradient-to-br from-white to-blue-50/50 border border-blue-100'
            }`}>
              <h3 className={`text-lg font-semibold mb-6 ${
                isDarkMode ? 'text-gray-100' : 'text-gray-900'
              }`}>
                <Shield className="w-5 h-5 inline mr-2" />
                Secure Login Features
              </h3>
              
              <div className="space-y-4">
                {[
                  { icon: <ShieldCheck className="w-5 h-5" />, label: "2FA Protection", value: "Enabled" },
                  { icon: <Bell className="w-5 h-5" />, label: "Login Alerts", value: "Active" },
                  { icon: <Clock className="w-5 h-5" />, label: "Session Timeout", value: "15 min" }
                ].map((stat, idx) => (
                  <div key={idx} className={`flex items-center justify-between p-3 rounded-xl ${
                    isDarkMode ? 'bg-gray-800/30' : 'bg-blue-50/50'
                  }`}>
                    <div className="flex items-center">
                      <div className={`p-2 rounded-lg mr-3 ${
                        isDarkMode ? 'bg-gray-700/50' : 'bg-white/80'
                      }`}>
                        <div className={isDarkMode ? 'text-blue-400' : 'text-blue-600'}>
                          {stat.icon}
                        </div>
                      </div>
                      <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                        {stat.label}
                      </span>
                    </div>
                    <span className={`font-bold ${
                      isDarkMode ? 'text-blue-400' : 'text-blue-600'
                    }`}>
                      {stat.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Platform Benefits */}
            <div className={`rounded-2xl p-6 ${
              isDarkMode
                ? 'bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50'
                : 'bg-gradient-to-br from-white to-blue-50/50 border border-blue-100'
            }`}>
              <h3 className={`text-lg font-semibold mb-6 ${
                isDarkMode ? 'text-gray-100' : 'text-gray-900'
              }`}>
                <Sparkles className="w-5 h-5 inline mr-2" />
                What Awaits You
              </h3>
              
              <div className="space-y-4">
                {[
                  { icon: <Activity className="w-5 h-5" />, text: "Real-time health monitoring dashboard" },
                  { icon: <HeartPulse className="w-5 h-5" />, text: "Medication & appointment schedules" },
                  { icon: <Users className="w-5 h-5" />, text: "Care team collaboration tools" },
                  { icon: <Brain className="w-5 h-5" />, text: "AI-powered health insights" }
                ].map((benefit, idx) => (
                  <div key={idx} className={`flex items-start p-3 rounded-xl ${
                    isDarkMode ? 'bg-gray-800/30' : 'bg-blue-50/50'
                  }`}>
                    <div className={`p-2 rounded-lg mr-3 mt-1 ${
                      isDarkMode ? 'bg-blue-900/30' : 'bg-blue-100'
                    }`}>
                      <div className={isDarkMode ? 'text-blue-400' : 'text-blue-600'}>
                        {benefit.icon}
                      </div>
                    </div>
                    <span className={`text-sm ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {benefit.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className={`rounded-3xl p-6 md:p-8 shadow-2xl ${
            isDarkMode
              ? 'bg-gradient-to-br from-gray-900/80 via-gray-800/80 to-gray-900/80 border border-gray-700/50 backdrop-blur-lg'
              : 'bg-white/90 border border-blue-100/50 backdrop-blur-lg'
          }`}>
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 mb-4">
                <LogIn className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold mb-2">
                <span className={isDarkMode ? 'text-gray-100' : 'text-gray-900'}>
                  Secure
                </span>
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {' Login'}
                </span>
              </h1>
              <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                Access your AegisCare dashboard
              </p>
            </div>

            

            {/* Login Form */}
            {!twoFactorRequired ? (
              <form onSubmit={handleLogin} className="space-y-6">


                {/* Email Input */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-2" />
                      Email Address
                    </div>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-offset-2 transition-all duration-300 ${
                      errors.email
                        ? 'border-red-500 focus:ring-red-500'
                        : isDarkMode
                        ? 'bg-gray-800 border-gray-700 focus:border-blue-500 focus:ring-blue-500/30'
                        : 'bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500/20'
                    } ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}
                    placeholder="Email"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                  )}
                </div>

                {/* Password Input */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    <div className="flex items-center">
                      <Lock className="w-4 h-4 mr-2" />
                      Password
                    </div>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 pr-12 rounded-xl border focus:ring-2 focus:ring-offset-2 transition-all duration-300 ${
                        errors.password
                          ? 'border-red-500 focus:ring-red-500'
                          : isDarkMode
                          ? 'bg-gray-800 border-gray-700 focus:border-blue-500 focus:ring-blue-500/30 text-gray-100'
                          : 'bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 text-gray-900'
                      }`}
                      placeholder="Password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 hover:scale-110 transition-transform duration-200"
                    >
                      {showPassword ? (
                        <EyeOff className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      ) : (
                        <Eye className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                  )}
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <input
                        type="checkbox"
                        name="rememberMe"
                        id="rememberMe"
                        checked={formData.rememberMe}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <label
                        htmlFor="rememberMe"
                        className={`flex items-center cursor-pointer ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded border mr-2 flex items-center justify-center transition-all duration-300 ${
                          formData.rememberMe
                            ? 'bg-blue-500 border-blue-500'
                            : isDarkMode
                            ? 'border-gray-600 hover:border-gray-500'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}>
                          {formData.rememberMe && (
                            <CheckCircle className="w-3 h-3 text-white" />
                          )}
                        </div>
                        <span className="text-sm">Remember me</span>
                      </label>
                    </div>
                  </div>
                  <Link
                    to="/forgot-password"
                    className={`text-sm font-medium transition-colors duration-300 ${
                      isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
                    }`}
                  >
                    Forgot password?
                  </Link>
                </div>

                {errors.submit && (
                  <div className={`p-4 rounded-xl ${
                    isDarkMode ? 'bg-red-900/30 border border-red-700/50' : 'bg-red-50 border border-red-200'
                  }`}>
                    <div className="flex items-center space-x-3">
                      <AlertCircle className="w-5 h-5 text-red-500" />
                      <p className="text-red-500">{errors.submit}</p>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-4 px-6 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center ${
                    isLoading
                      ? 'opacity-70 cursor-not-allowed'
                      : 'hover:scale-105'
                  } ${
                    isDarkMode
                      ? 'bg-gradient-to-r from-blue-700 to-indigo-700 text-white hover:from-blue-600 hover:to-indigo-600'
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                      Signing in...
                    </>
                  ) : (
                    <>
                      <LogIn className="w-5 h-5 mr-3" />
                      Sign In
                    </>
                  )}
                </button>

                {/* Divider */}
                <div className="relative">
                  <div className={`absolute inset-0 flex items-center ${
                    isDarkMode ? 'border-gray-700' : 'border-gray-200'
                  }`}>
                    <div className="w-full border-t"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className={`px-2 ${
                      isDarkMode ? 'bg-gray-900 text-gray-400' : 'bg-white text-gray-500'
                    }`}>
                      Or continue with
                    </span>
                  </div>
                </div>

                {/* Google Login */}
                <div className="flex justify-center">
                  {isGoogleLoading ? (
                    <div className={`py-3 rounded-xl border w-full flex items-center justify-center space-x-2 ${
                      isDarkMode
                        ? 'border-gray-700 bg-gray-800/50'
                        : 'border-gray-200 bg-white'
                    }`}>
                      <Loader className="w-5 h-5 animate-spin text-blue-500" />
                      <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Signing in...
                      </span>
                    </div>
                  ) : (
                    <div className={`rounded-xl overflow-hidden w-full ${
                      isDarkMode ? 'bg-gray-800/50' : 'bg-white'
                    }`}>
                      <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={handleGoogleError}
                        theme={isDarkMode ? 'filled_black' : 'outline'}
                        size="large"
                        width="100%"
                      />
                    </div>
                  )}
                </div>

                {/* Google Error Message */}
                {errors.google && (
                  <div className="p-4 rounded-lg bg-red-100 border border-red-300 flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-red-800">{errors.google}</p>
                    </div>
                  </div>
                )}

                {/* Signup Link */}
                <div className="text-center pt-4">
                  <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                    Don't have an account?{' '}
                    <Link
                      to="/signup"
                      className={`font-medium transition-colors duration-300 ${
                        isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
                      }`}
                    >
                      Sign up here
                    </Link>
                  </p>
                </div>
              </form>
            ) : (
              /* Two-Factor Authentication */
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 mb-4">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <h2 className={`text-2xl font-bold mb-2 ${
                    isDarkMode ? 'text-gray-100' : 'text-gray-900'
                  }`}>
                    Two-Factor Authentication
                  </h2>
                  <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                    Enter the 6-digit code sent to your device
                  </p>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    <div className="flex items-center">
                      <Key className="w-4 h-4 mr-2" />
                      Verification Code
                    </div>
                  </label>
                  <div className="flex space-x-2">
                    {[...Array(6)].map((_, index) => (
                      <input
                        key={index}
                        type="text"
                        maxLength="1"
                        value={twoFactorCode[index] || ''}
                        onChange={(e) => {
                          const newCode = twoFactorCode.split('');
                          newCode[index] = e.target.value;
                          const code = newCode.join('');
                          setTwoFactorCode(code);
                          if (e.target.value && index < 5) {
                            document.getElementById(`code-${index + 1}`)?.focus();
                          }
                        }}
                        id={`code-${index}`}
                        className={`flex-1 h-16 text-2xl text-center rounded-xl border focus:ring-2 focus:ring-offset-2 transition-all duration-300 ${
                          errors.twoFactor
                            ? 'border-red-500 focus:ring-red-500'
                            : isDarkMode
                            ? 'bg-gray-800 border-gray-700 focus:border-blue-500 focus:ring-blue-500/30 text-gray-100'
                            : 'bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 text-gray-900'
                        }`}
                      />
                    ))}
                  </div>
                  {errors.twoFactor && (
                    <p className="mt-2 text-sm text-red-500">{errors.twoFactor}</p>
                  )}
                  <p className={`mt-3 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    For demo, use code: <span className={`font-mono font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>123456</span>
                  </p>
                </div>

                <div className="space-y-4">
                  <button
                    type="button"
                    onClick={handleTwoFactorVerify}
                    disabled={isLoading}
                    className={`w-full py-4 px-6 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center ${
                      isLoading
                        ? 'opacity-70 cursor-not-allowed'
                        : 'hover:scale-105'
                    } ${
                      isDarkMode
                        ? 'bg-gradient-to-r from-blue-700 to-indigo-700 text-white hover:from-blue-600 hover:to-indigo-600'
                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                        Verifying...
                      </>
                    ) : (
                      <>
                        <Shield className="w-5 h-5 mr-3" />
                        Verify & Continue
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setTwoFactorRequired(false)}
                    className={`w-full py-3 px-6 rounded-xl border font-medium transition-all duration-300 hover:scale-105 ${
                      isDarkMode
                        ? 'border-gray-700 text-gray-300 hover:border-gray-600 hover:text-gray-200'
                        : 'border-gray-300 text-gray-700 hover:border-gray-400 hover:text-gray-900'
                    }`}
                  >
                    Go Back
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <Footer isDarkMode={isDarkMode} />

      {/* Enhanced Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(5deg); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-25px) scale(1.05); }
        }
        @keyframes float-particle-slow {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-80px) translateX(10px); opacity: 0; }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.3; }
        }
        @keyframes pulse-slower {
          0%, 100% { opacity: 0.05; }
          50% { opacity: 0.15; }
        }
        @keyframes pulse-slowest {
          0%, 100% { opacity: 0.02; }
          50% { opacity: 0.08; }
        }
        @keyframes logo-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.03); }
        }
        @keyframes ring-expand-4-5s {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(1.2); opacity: 0; }
        }
        @keyframes ring-expand-delayed-4-5s {
          0% { transform: scale(1); opacity: 0.7; }
          100% { transform: scale(1.4); opacity: 0; }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        .animate-float-slow {
          animation: float-slow 10s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 9s ease-in-out infinite 1s;
        }
        .animate-float-particle-slow {
          animation: float-particle-slow linear infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        .animate-pulse-slower {
          animation: pulse-slower 5s ease-in-out infinite;
        }
        .animate-pulse-slowest {
          animation: pulse-slowest 6s ease-in-out infinite;
        }
        .animate-logo-pulse {
          animation: logo-pulse 4s ease-in-out infinite;
        }
        .animate-ring-expand-4-5s {
          animation: ring-expand-4-5s 4.5s ease-out infinite;
        }
        .animate-ring-expand-delayed-4-5s {
          animation: ring-expand-delayed-4-5s 4.5s ease-out infinite;
        }
        .bg-grid-white\/5 {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(255 255 255 / 0.05)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e");
        }
        .bg-grid-blue-500\/5 {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(59 130 246 / 0.05)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e");
        }
      `}</style>
    </div>
  );
};

export default LoginPage;