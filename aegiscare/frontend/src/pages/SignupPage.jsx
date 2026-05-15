// SignupPage.jsx
import React, { useState, useEffect } from 'react';
import { 
  UserPlus, Mail, Lock, User, Phone, Calendar, 
  Briefcase, Users, Shield, ArrowLeft, Eye, EyeOff,
  Heart, Stethoscope, UserCircle, Home, CheckCircle,
  Sparkles, Activity, Brain, ShieldCheck, HeartPulse,
  Clock, Star, BarChart3, Bell, Globe, Facebook, Twitter, Linkedin, Instagram, MapPin
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import { validateSignupForm, validateField, getPasswordStrength } from '../utils/validationUtils';
import api from '../services/api';

const SignupPage = ({ isDarkMode }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    role: 'elderly', // Changed default from 'family' to 'elderly'
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    dateOfBirth: '',
    specialization: '',
    relationship: '',
    licenseNumber: '',
    address: '',
    agreeToTerms: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeRole, setActiveRole] = useState('elderly');
  const [roleDescription, setRoleDescription] = useState('');

  // Updated Role configurations without Family option
  const roles = [
    { 
      id: 'elderly', 
      name: 'Elderly', 
      icon: <Heart className="w-6 h-6" />, 
      color: 'from-rose-500 to-pink-600',
      description: 'For elderly individuals needing care and monitoring',
      dashboard: '/elderly-dashboard',
      features: [
        '24/7 health monitoring',
        'Medication reminders',
        'Emergency alerts',
        'Care team notifications'
      ]
    },
    { 
      id: 'doctor', 
      name: 'Doctor', 
      icon: <Stethoscope className="w-6 h-6" />, 
      color: 'from-emerald-500 to-teal-600',
      description: 'Medical professionals providing remote care',
      dashboard: '/doctor-dashboard',
      features: [
        'Patient monitoring',
        'E-prescriptions',
        'Medical reports',
        'Teleconsultation'
      ]
    },
    { 
      id: 'caregiver', 
      name: 'Caregiver', 
      icon: <UserCircle className="w-6 h-6" />, 
      color: 'from-amber-500 to-orange-600',
      description: 'Professional caregivers & nurses',
      dashboard: '/caregiver-dashboard',
      features: [
        'Daily care logs',
        'Medication tracking',
        'Activity monitoring',
        'Progress reports'
      ]
    }
  ];

  // Set initial role description
  useEffect(() => {
    const selectedRole = roles.find(role => role.id === formData.role);
    if (selectedRole) {
      setRoleDescription(selectedRole.description);
      setActiveRole(formData.role);
    }
  }, [formData.role]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Real-time validation for all fields
    let fieldError = null;
    
    switch(name) {
      case 'firstName':
        if (value.trim()) {
          if (!/^[a-zA-Z\s\-']{2,50}$/.test(value.trim())) {
            fieldError = 'First name must be 2-50 characters (letters, spaces, hyphens only)';
          }
        }
        break;
      case 'lastName':
        if (value.trim()) {
          if (!/^[a-zA-Z\s\-']{2,50}$/.test(value.trim())) {
            fieldError = 'Last name must be 2-50 characters (letters, spaces, hyphens only)';
          }
        }
        break;
      case 'email':
        if (value.trim()) {
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            fieldError = 'Please enter a valid email address';
          }
        }
        break;
      case 'password':
        if (value) {
          if (value.length < 8) {
            fieldError = 'Password must be at least 8 characters';
          } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#\-_+=.])/.test(value)) {
            fieldError = 'Password must contain uppercase, lowercase, number, and special character (@$!%*?&#-_+=.)';
          }
        }
        break;
      case 'confirmPassword':
        if (value && formData.password !== value) {
          fieldError = 'Passwords do not match';
        }
        break;
      case 'phone':
        if (value.trim()) {
          const digitsOnly = value.replace(/\D/g, '');
          if (digitsOnly.length < 10) {
            fieldError = 'Phone must have at least 10 digits';
          }
        }
        break;
      case 'specialization':
        if (value.trim() && value.trim().length < 2) {
          fieldError = 'Specialization must be at least 2 characters';
        }
        break;
      case 'licenseNumber':
        if (value.trim()) {
          if (!/^[A-Z0-9\-]{3,20}$/.test(value.trim())) {
            fieldError = 'License number must be 3-20 alphanumeric characters';
          }
        }
        break;
      default:
        break;
    }
    
    // Update errors
    if (fieldError) {
      setErrors(prev => ({ ...prev, [name]: fieldError }));
    } else {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleRoleSelect = (roleId) => {
    setFormData(prev => ({ ...prev, role: roleId }));
    const selectedRole = roles.find(role => role.id === roleId);
    if (selectedRole) {
      setRoleDescription(selectedRole.description);
      setActiveRole(roleId);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('=== FORM SUBMISSION STARTED ===');
    console.log('Form data:', formData);
    
    // STEP 1: Basic validation first
    console.log('\n=== STEP 1: BASIC FIELD CHECK ===');
    const basicErrors = {};
    
    if (!formData.firstName.trim()) basicErrors.firstName = 'First name required';
    if (!formData.lastName.trim()) basicErrors.lastName = 'Last name required';
    if (!formData.email.trim()) basicErrors.email = 'Email required';
    if (!formData.password) basicErrors.password = 'Password required';
    if (!formData.confirmPassword) basicErrors.confirmPassword = 'Confirm password required';
    if (!formData.phone.trim()) basicErrors.phone = 'Phone required';
    if (!formData.agreeToTerms) basicErrors.agreeToTerms = 'Must agree to terms';
    
    if (formData.role === 'doctor') {
      if (!formData.specialization.trim()) basicErrors.specialization = 'Specialization required';
      if (!formData.licenseNumber.trim()) basicErrors.licenseNumber = 'License number required';
    }
    
    console.log('Basic errors:', basicErrors);
    
    if (Object.keys(basicErrors).length > 0) {
      console.error('Basic validation failed:', basicErrors);
      setErrors(basicErrors);
      alert('Please fill in all required fields');
      return;
    }
    
    console.log('✓ Basic validation passed');
    
    // STEP 2: Format validation
    console.log('\n=== STEP 2: FORMAT VALIDATION ===');
    const formatErrors = {};
    
    // Email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      formatErrors.email = 'Invalid email format';
    }
    
    // Password match
    if (formData.password !== formData.confirmPassword) {
      formatErrors.confirmPassword = 'Passwords do not match';
    }
    
    // Password strength
    if (formData.password.length < 8) {
      formatErrors.password = 'Password must be at least 8 characters';
    }
    
    // Phone - just check for at least 10 digits
    const digitsOnly = formData.phone.replace(/\D/g, '');
    if (digitsOnly.length < 10) {
      formatErrors.phone = 'Phone must have at least 10 digits';
    }
    
    console.log('Format errors:', formatErrors);
    
    if (Object.keys(formatErrors).length > 0) {
      console.error('Format validation failed:', formatErrors);
      setErrors(formatErrors);
      alert('Please fix the validation errors');
      return;
    }
    
    console.log('✓ Format validation passed');
    
    // STEP 3: Ready to submit
    console.log('\n=== STEP 3: SUBMITTING TO BACKEND ===');
    setIsSubmitting(true);
    
    try {
      const requestBody = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        phone: formData.phone.trim(),
        role: formData.role,
        dateOfBirth: formData.dateOfBirth || null,
        specialization: formData.specialization?.trim() || null,
        licenseNumber: formData.licenseNumber?.trim() || null,
        address: formData.address?.trim() || null
      };
      
      console.log('Request body:', requestBody);
      
      const response = await api.post('auth/register', requestBody);

      console.log('Response status:', response.status);
      const data = response.data;
      console.log('Response data:', data);

      console.log('\n=== REGISTRATION SUCCESSFUL ===');
      console.log('User created:', data.user);
      
      // Store token and user info in localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('userRole', data.user.role);
      localStorage.setItem('userEmail', data.user.email);
      localStorage.setItem('userFirstName', data.user.firstName);
      localStorage.setItem('userId', data.user.id);

      console.log('✓ User data stored in localStorage');
      console.log('Redirecting to login...');
      
      // Redirect to login page
      setTimeout(() => {
        navigate('/login');
      }, 1000);
      
    } catch (error) {
      console.error('\n=== ERROR OCCURRED ===');
      console.error('Error type:', error.constructor.name);
      console.error('Error message:', error.message);
      console.error('Full error:', error);
      
      setErrors(prev => ({ ...prev, submit: error.message }));
      alert('❌ Error: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRoleSpecificFields = () => {
    switch(formData.role) {
      case 'doctor':
        return (
          <>
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  <div className="flex items-center">
                    <Briefcase className="w-4 h-4 mr-2" />
                    Specialization
                  </div>
                </label>
                <input
                  type="text"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  placeholder="Specialization"
                  className={`w-full px-4 py-3 rounded-xl border
                      ? 'border-red-500 focus:ring-red-500'
                      : isDarkMode
                      ? 'bg-gray-800 border-gray-700 focus:border-blue-500 focus:ring-blue-500/30 text-gray-100'
                      : 'bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 text-gray-900'
                  }`}
                />
                {errors.specialization && (
                  <p className="mt-1 text-sm text-red-500">{errors.specialization}</p>
                )}
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  <div className="flex items-center">
                    <Shield className="w-4 h-4 mr-2" />
                    Medical License Number
                  </div>
                </label>
                <input
                  type="text"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleChange}
                  placeholder="License number"
                  className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-offset-2 transition-all duration-300 ${
                    errors.licenseNumber
                      ? 'border-red-500 focus:ring-red-500'
                      : isDarkMode
                      ? 'bg-gray-800 border-gray-700 focus:border-blue-500 focus:ring-blue-500/30 text-gray-100'
                      : 'bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 text-gray-900'
                  }`}
                />
                {errors.licenseNumber && (
                  <p className="mt-1 text-sm text-red-500">{errors.licenseNumber}</p>
                )}
              </div>
            </div>
          </>
        );

      case 'elderly':
        return (
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                Date of Birth
              </div>
            </label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-offset-2 transition-all duration-300 ${
                isDarkMode
                  ? 'bg-gray-800 border-gray-700 focus:border-blue-500 focus:ring-blue-500/30 text-gray-100'
                  : 'bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 text-gray-900'
              }`}
            />
          </div>
        );

      default:
        return null;
    }
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
        
        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-2 h-2 rounded-full animate-float-particle ${
              isDarkMode ? 'bg-blue-500/30' : 'bg-blue-400/20'
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.1}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          ></div>
        ))}
        
        {/* Animated Orbs */}
        <div className={`absolute top-1/4 left-1/4 w-64 h-64 rounded-full blur-3xl animate-pulse-slow ${
          isDarkMode
            ? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10'
            : 'bg-gradient-to-r from-blue-200/20 to-purple-200/20'
        }`}></div>
        
        <div className={`absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full blur-3xl animate-pulse-slower ${
          isDarkMode
            ? 'bg-gradient-to-r from-indigo-500/10 to-cyan-500/10'
            : 'bg-gradient-to-r from-indigo-200/20 to-cyan-200/20'
        }`}></div>
      </div>

      <div className="relative flex-1 container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          to="/"
          className={`inline-flex items-center space-x-2 px-6 py-3 rounded-xl backdrop-blur-lg transition-all duration-300 hover:scale-105 mb-8 group ${
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
                  <div className="absolute inset-0 rounded-full border-2 border-blue-400/30 animate-ring-expand-3-5s"></div>
                  <div className="absolute inset-0 rounded-full border-2 border-cyan-400/20 animate-ring-expand-delayed-3-5s"></div>
                </div>
              </div>
              
              <h2 className={`text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent ${
                isDarkMode ? 'brightness-125' : ''
              }`}>
                Join AegisCare Network
              </h2>
              <p className={`text-lg mb-6 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                AI-powered elderly care platform connecting patients, doctors, and caregivers
              </p>
            </div>

            {/* Role Info Card */}
            <div className={`rounded-2xl p-6 mb-8 transition-all duration-500 ${
              isDarkMode
                ? 'bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50'
                : 'bg-gradient-to-br from-white to-blue-50/50 border border-blue-100'
            }`}>
              <div className="flex items-center mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${
                  roles.find(r => r.id === activeRole)?.color || 'from-blue-500 to-indigo-600'
                } flex items-center justify-center mr-4`}>
                  {roles.find(r => r.id === activeRole)?.icon || <Heart className="w-6 h-6 text-white" />}
                </div>
                <div>
                  <h3 className={`text-xl font-bold ${
                    isDarkMode ? 'text-gray-100' : 'text-gray-900'
                  }`}>
                    {roles.find(r => r.id === activeRole)?.name || 'Elderly'}
                  </h3>
                  <p className={`text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {roleDescription}
                  </p>
                </div>
              </div>
              
              {/* Role Features */}
              <div className="space-y-3 mt-4">
                {roles.find(r => r.id === activeRole)?.features.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-3 ${
                      isDarkMode ? 'bg-blue-500' : 'bg-blue-400'
                    }`}></div>
                    <span className={`text-sm ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Platform Stats */}
            <div className={`rounded-2xl p-6 ${
              isDarkMode
                ? 'bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50'
                : 'bg-gradient-to-br from-white to-blue-50/50 border border-blue-100'
            }`}>
              <h3 className={`text-lg font-semibold mb-6 ${
                isDarkMode ? 'text-gray-100' : 'text-gray-900'
              }`}>
                Why Choose AegisCare
              </h3>
              
              <div className="space-y-4">
                {[
                  { icon: <Activity className="w-5 h-5" />, label: "Real-time Monitoring", value: "24/7" },
                  { icon: <Brain className="w-5 h-5" />, label: "AI Accuracy", value: "99.8%" },
                  { icon: <ShieldCheck className="w-5 h-5" />, label: "Security Compliant", value: "HIPAA" },
                  { icon: <Clock className="w-5 h-5" />, label: "Response Time", value: "< 2min" }
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
          </div>

          {/* Right Side - Form */}
          <div className={`rounded-3xl p-6 md:p-8 shadow-2xl ${
            isDarkMode
              ? 'bg-gradient-to-br from-gray-900/80 via-gray-800/80 to-gray-900/80 border border-gray-700/50 backdrop-blur-lg'
              : 'bg-white/90 border border-blue-100/50 backdrop-blur-lg'
          }`}>
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 mb-4">
                <UserPlus className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold mb-2">
                <span className={isDarkMode ? 'text-gray-100' : 'text-gray-900'}>
                  Create Your
                </span>
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {' Account'}
                </span>
              </h1>
              <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                Join AegisCare as a healthcare stakeholder
              </p>
            </div>

            {/* Enhanced Role Selection */}
            <div className="mb-8">
              <h3 className={`text-lg font-semibold mb-4 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Select Your Role
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {roles.map((role) => (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => handleRoleSelect(role.id)}
                    className={`group p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
                      formData.role === role.id
                        ? `border-transparent bg-gradient-to-br ${role.color}`
                        : isDarkMode
                        ? 'border-gray-700 hover:border-gray-600 bg-gray-800/50'
                        : 'border-gray-200 hover:border-gray-300 bg-gray-50'
                    }`}
                  >
                    <div className={`flex flex-col items-center space-y-2 ${
                      formData.role === role.id ? 'text-white' : isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      <div className={`p-2 rounded-lg ${
                        formData.role === role.id ? 'bg-white/20' : isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                      }`}>
                        {role.icon}
                      </div>
                      <span className="text-sm font-medium text-center">{role.name}</span>
                      {formData.role === role.id && (
                        <div className="absolute -top-2 -right-2">
                          <div className="w-5 h-5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
                            <CheckCircle className="w-3 h-3 text-white" />
                          </div>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      First Name
                    </div>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="First name"
                    className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-offset-2 transition-all duration-300 ${
                      errors.firstName
                        ? 'border-red-500 focus:ring-red-500'
                        : isDarkMode
                        ? 'bg-gray-800 border-gray-700 focus:border-blue-500 focus:ring-blue-500/30 text-gray-100'
                        : 'bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 text-gray-900'
                    }`}
                   
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>
                  )}
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Last name"
                    className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-offset-2 transition-all duration-300 ${
                      errors.lastName
                        ? 'border-red-500 focus:ring-red-500'
                        : isDarkMode
                        ? 'bg-gray-800 border-gray-700 focus:border-blue-500 focus:ring-blue-500/30 text-gray-100'
                        : 'bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 text-gray-900'
                    }`}
                   
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
                  )}
                </div>
              </div>

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
                  placeholder="Email"
                  className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-offset-2 transition-all duration-300 ${
                    errors.email
                      ? 'border-red-500 focus:ring-red-500'
                      : isDarkMode
                      ? 'bg-gray-800 border-gray-700 focus:border-blue-500 focus:ring-blue-500/30 text-gray-100'
                      : 'bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 text-gray-900'
                  }`}
                 
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-2" />
                    Phone Number
                  </div>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone number"
                  className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-offset-2 transition-all duration-300 ${
                    errors.phone
                      ? 'border-red-500 focus:ring-red-500'
                      : isDarkMode
                      ? 'bg-gray-800 border-gray-700 focus:border-blue-500 focus:ring-blue-500/30 text-gray-100'
                      : 'bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 text-gray-900'
                  }`}
                 
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                )}
              </div>

              {/* Role-specific fields */}
              {getRoleSpecificFields()}

              {/* Address */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  <div className="flex items-center">
                    <Home className="w-4 h-4 mr-2" />
                    Address
                  </div>
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Address"
                  className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-offset-2 transition-all duration-300 ${
                    isDarkMode
                      ? 'bg-gray-800 border-gray-700 focus:border-blue-500 focus:ring-blue-500/30 text-gray-100'
                      : 'bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 text-gray-900'
                  }`}
                />
              </div>

              {/* Password Fields */}
              <div className="grid md:grid-cols-2 gap-4">
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
                      placeholder="Password"
                      className={`w-full px-4 py-3 pr-12 rounded-xl border focus:ring-2 focus:ring-offset-2 transition-all duration-300 ${
                        errors.password
                          ? 'border-red-500 focus:ring-red-500'
                          : isDarkMode
                          ? 'bg-gray-800 border-gray-700 focus:border-blue-500 focus:ring-blue-500/30 text-gray-100'
                          : 'bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 text-gray-900'
                      }`}
                     
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
                  <p className={`mt-2 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Must be at least 8 characters long
                  </p>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm password"
                      className={`w-full px-4 py-3 pr-12 rounded-xl border focus:ring-2 focus:ring-offset-2 transition-all duration-300 ${
                        errors.confirmPassword
                          ? 'border-red-500 focus:ring-red-500'
                          : isDarkMode
                          ? 'bg-gray-800 border-gray-700 focus:border-blue-500 focus:ring-blue-500/30 text-gray-100'
                          : 'bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 text-gray-900'
                      }`}
                     
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 hover:scale-110 transition-transform duration-200"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      ) : (
                        <Eye className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
                  )}
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                errors.agreeToTerms
                  ? isDarkMode ? 'border-red-600 bg-red-900/20' : 'border-red-300 bg-red-50'
                  : isDarkMode ? 'border-gray-700 bg-gray-800/30' : 'border-gray-200 bg-gray-50/50'
              }`}>
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    id="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleChange}
                    className={`mt-1 rounded w-5 h-5 cursor-pointer ${
                      errors.agreeToTerms 
                        ? 'border-red-500 accent-red-600' 
                        : 'border-gray-300 accent-blue-600'
                    }`}
                  />
                  <label
                    htmlFor="agreeToTerms"
                    className={`text-sm font-medium cursor-pointer flex-1 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}
                  >
                    I agree to the{' '}
                    <Link to="/terms-of-service" className={`font-semibold transition-colors duration-300 ${
                      isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
                    }`}>
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link to="/privacy-policy" className={`font-semibold transition-colors duration-300 ${
                      isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
                    }`}>
                      Privacy Policy
                    </Link>
                  </label>
                </div>
                {errors.agreeToTerms && (
                  <p className="mt-3 text-sm font-medium text-red-600 flex items-start">
                    <span className="mr-2">⚠️</span>
                    {errors.agreeToTerms}
                  </p>
                )}
              </div>

              {errors.submit && (
                <div className={`p-4 rounded-xl ${
                  isDarkMode ? 'bg-red-900/30 border border-red-700/50' : 'bg-red-50 border border-red-200'
                }`}>
                  <p className="text-red-500 text-center">{errors.submit}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 px-6 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center ${
                  isSubmitting
                    ? 'opacity-70 cursor-not-allowed'
                    : 'hover:scale-105'
                } ${
                  isDarkMode
                    ? 'bg-gradient-to-r from-blue-700 to-indigo-700 text-white hover:from-blue-600 hover:to-indigo-600'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                    Creating Account...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5 mr-3" />
                    Create Account
                  </>
                )}
              </button>

              {/* Login Link */}
              <div className="text-center pt-4">
                <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                  Already have an account?{' '}
                  <Link
                    to="/login"
                    className={`font-medium transition-colors duration-300 ${
                      isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
                    }`}
                  >
                    Sign in here
                  </Link>
                </p>
              </div>
            </form>
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
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.3; }
        }
        @keyframes pulse-slower {
          0%, 100% { opacity: 0.05; }
          50% { opacity: 0.15; }
        }
        @keyframes logo-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes ring-expand-3-5s {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(1.2); opacity: 0; }
        }
        @keyframes ring-expand-delayed-3-5s {
          0% { transform: scale(1); opacity: 0.7; }
          100% { transform: scale(1.4); opacity: 0; }
        }
        @keyframes float-particle {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-100px) translateX(20px); opacity: 0; }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 7s ease-in-out infinite 1s;
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
        .animate-pulse-slower {
          animation: pulse-slower 4s ease-in-out infinite;
        }
        .animate-logo-pulse {
          animation: logo-pulse 3s ease-in-out infinite;
        }
        .animate-ring-expand-3-5s {
          animation: ring-expand-3-5s 3.5s ease-out infinite;
        }
        .animate-ring-expand-delayed-3-5s {
          animation: ring-expand-delayed-3-5s 3.5s ease-out infinite;
        }
        .animate-float-particle {
          animation: float-particle linear infinite;
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

export default SignupPage;