import React, { useState, useEffect } from 'react';
import { 
  Heart, Stethoscope, UserCircle, ArrowLeft, AlertCircle,
  CheckCircle, Sparkles, Activity, Brain, ShieldCheck, Clock,
  HeartPulse, Globe, MapPin, Briefcase, Phone, Mail
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import Footer from '../components/Footer';
import api from '../services/api';

const GoogleRoleSelection = ({ isDarkMode = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedRole, setSelectedRole] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    phone: '',
    specialization: '',
    licenseNumber: ''
  });

  // Get user data from location state (passed from GoogleLogin)
  const userData = location.state?.userData || {};

  useEffect(() => {
    // Check if user data exists
    if (!userData.id) {
      console.error('No user data provided');
      navigate('/login');
    }
  }, [userData, navigate]);

  const roles = [
    { 
      id: 'elderly', 
      name: 'Elderly', 
      icon: <Heart className="w-8 h-8" />, 
      color: 'from-rose-500 to-pink-600',
      description: 'For elderly individuals needing care and monitoring',
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
      icon: <Stethoscope className="w-8 h-8" />, 
      color: 'from-emerald-500 to-teal-600',
      description: 'Medical professionals providing remote care',
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
      icon: <UserCircle className="w-8 h-8" />, 
      color: 'from-amber-500 to-orange-600',
      description: 'Professional caregivers & nurses',
      features: [
        'Daily care logs',
        'Medication tracking',
        'Activity monitoring',
        'Progress reports'
      ]
    }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!selectedRole) {
      newErrors.role = 'Please select a role';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[\d\s\-\+\(\)]{10,}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (selectedRole === 'doctor') {
      if (!formData.specialization.trim()) {
        newErrors.specialization = 'Specialization is required';
      }
      if (!formData.licenseNumber.trim()) {
        newErrors.licenseNumber = 'License number is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await api.post('auth/google/complete-registration', {
        userId: userData.id,
        role: selectedRole,
        phone: formData.phone,
        specialization: selectedRole === 'doctor' ? formData.specialization : undefined,
        licenseNumber: selectedRole === 'doctor' ? formData.licenseNumber : undefined
      });

      const data = response.data;

      // Store token and user info
      localStorage.setItem('token', data.token);
      localStorage.setItem('userRole', data.user.role);
      localStorage.setItem('userEmail', data.user.email);
      localStorage.setItem('userFirstName', data.user.firstName);
      localStorage.setItem('userId', data.user.id);
      localStorage.setItem('isGoogleAuth', 'true');

      console.log('Registration completed:', data.user);

      // Redirect to appropriate dashboard
      const dashboardMap = {
        elderly: '/elderly-dashboard',
        doctor: '/doctor-dashboard',
        caregiver: '/caregiver-dashboard'
      };

      const redirectPath = dashboardMap[selectedRole] || '/';
      navigate(redirectPath);
    } catch (error) {
      console.error('Registration error:', error);
      setErrors(prev => ({
        ...prev,
        submit: error.message || 'An error occurred. Please try again.'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col transition-all duration-500 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-950' 
        : 'bg-gradient-to-br from-blue-50 via-white to-indigo-50'
    }`}>
      {/* Back Button */}
      <div className="p-4 md:p-8">
        <button
          onClick={() => navigate('/login')}
          className={`flex items-center space-x-2 transition-all duration-300 ${
            isDarkMode 
              ? 'text-blue-400 hover:text-blue-300' 
              : 'text-blue-600 hover:text-blue-700'
          }`}
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Login</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className={`w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden ${
          isDarkMode ? 'bg-gray-800/50' : 'bg-white/95'
        }`}>
          {/* Header */}
          <div className={`p-8 text-center ${
            isDarkMode 
              ? 'bg-gradient-to-r from-blue-600/20 to-indigo-600/20 border-b border-gray-700' 
              : 'bg-gradient-to-r from-blue-100 to-indigo-100 border-b border-gray-200'
          }`}>
            <h1 className={`text-3xl md:text-4xl font-bold mb-3 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Welcome to AegisCare!
            </h1>
            <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Hi {userData.firstName}! Please select your role to continue
            </p>
          </div>

          {/* Content */}
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Role Selection */}
              <div>
                <h2 className={`text-xl font-semibold mb-6 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Select Your Role
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {roles.map(role => (
                    <div
                      key={role.id}
                      onClick={() => setSelectedRole(role.id)}
                      className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                        selectedRole === role.id
                          ? `border-transparent bg-gradient-to-br ${role.color} text-white shadow-lg transform scale-105`
                          : isDarkMode
                          ? 'border-gray-700 bg-gray-700/50 hover:border-gray-600'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <div className="flex flex-col items-center text-center">
                        <div className={`mb-3 p-3 rounded-full ${
                          selectedRole === role.id
                            ? 'bg-white/20'
                            : isDarkMode
                            ? 'bg-gray-600/50'
                            : 'bg-gray-100'
                        }`}>
                          {role.icon}
                        </div>
                        <h3 className="text-lg font-bold mb-2">{role.name}</h3>
                        <p className={`text-sm mb-4 ${
                          selectedRole === role.id
                            ? 'text-white/90'
                            : isDarkMode
                            ? 'text-gray-400'
                            : 'text-gray-600'
                        }`}>
                          {role.description}
                        </p>
                        <ul className={`text-xs space-y-1 ${
                          selectedRole === role.id
                            ? 'text-white/80'
                            : isDarkMode
                            ? 'text-gray-400'
                            : 'text-gray-600'
                        }`}>
                          {role.features.slice(0, 2).map((feature, idx) => (
                            <li key={idx}>✓ {feature}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>

                {errors.role && (
                  <div className="mt-3 flex items-center space-x-2 text-red-500">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm">{errors.role}</span>
                  </div>
                )}
              </div>

              {/* Additional Information */}
              {selectedRole && (
                <div className="space-y-6 pt-6 border-t border-gray-300">
                  <h2 className={`text-xl font-semibold ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Complete Your Profile
                  </h2>

                  {/* Phone Number */}
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
                      className={`w-full px-4 py-3 rounded-xl border
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

                  {/* Doctor-Specific Fields */}
                  {selectedRole === 'doctor' && (
                    <>
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
                          className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-offset-2 transition-all duration-300 ${
                            errors.specialization
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
                          License Number
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
                    </>
                  )}
                </div>
              )}

              {/* Error Message */}
              {errors.submit && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500 flex items-center space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <p className="text-red-600 dark:text-red-400">{errors.submit}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || !selectedRole}
                className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
                  isSubmitting || !selectedRole
                    ? isDarkMode
                      ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg transform hover:scale-105'
                }`}
              >
                <CheckCircle className="w-5 h-5" />
                <span>{isSubmitting ? 'Completing...' : 'Complete Registration'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default GoogleRoleSelection;
