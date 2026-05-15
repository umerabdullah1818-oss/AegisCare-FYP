import React, { useState, useEffect, useRef } from 'react';
import { 
  Mail, Phone, MapPin, MessageCircle, Send,
  Clock, Users, Globe, Sparkles, ArrowRight,
  CheckCircle, Shield, Zap, Heart, TrendingUp,
  ChevronDown, AlertCircle
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../services/api';

const ContactUs = ({ isDarkMode, onToggleDarkMode }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [visible, setVisible] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setVisible(true);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const subjectOptions = [
    { value: 'General Inquiry', label: 'General Inquiry', icon: <Mail className="w-4 h-4" /> },
    { value: 'Technical Support', label: 'Technical Support', icon: <Zap className="w-4 h-4" /> },
    { value: 'Billing Question', label: 'Billing Question', icon: <Shield className="w-4 h-4" /> },
    { value: 'Partnership', label: 'Partnership', icon: <Users className="w-4 h-4" /> },
    { value: 'Feedback', label: 'Feedback', icon: <Heart className="w-4 h-4" /> },
    { value: 'Other', label: 'Other', icon: <MessageCircle className="w-4 h-4" /> },
  ];

  // Contact Methods
  const contactMethods = [
    {
      icon: <Mail className="w-5 h-5" />,
      title: 'Email',
      details: 'support@aegiscare.com',
      subtitle: 'We reply within 2 hours',
      color: 'from-blue-600 to-cyan-600'
    },
    {
      icon: <Phone className="w-5 h-5" />,
      title: 'Phone',
      details: '+92 324 4519323',
      subtitle: 'Mon-Fri, 9AM-6PM EST',
      color: 'from-purple-600 to-pink-600'
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      title: 'Office',
      details: '123 Model Town Lahore, Pakistan',
      subtitle: 'Visit by appointment',
      color: 'from-emerald-600 to-teal-600'
    },
    {
      icon: <MessageCircle className="w-5 h-5" />,
      title: 'Live Chat',
      details: 'Chat with our team',
      subtitle: 'Available 24/7',
      color: 'from-amber-600 to-orange-600'
    }
  ];

  // FAQ Items
  const faqs = [
    {
      question: 'How quickly can I get started with AegisCare?',
      answer: 'You can start your free trial immediately after signup. Full setup with device integration typically takes 1-2 business days.',
      icon: <Zap className="w-4 h-4" />
    },
    {
      question: 'Is my health data secure and private?',
      answer: 'Yes, we use military-grade encryption and are HIPAA compliant. Your data is never shared without explicit consent.',
      icon: <Shield className="w-4 h-4" />
    },
    {
      question: 'Can multiple family members access the dashboard?',
      answer: 'Yes, you can invite unlimited family members to view and monitor your elderly loved one\'s health data.',
      icon: <Users className="w-4 h-4" />
    },
    {
      question: 'Do you integrate with existing health devices?',
      answer: 'We support 50+ health devices including Fitbit, Apple Watch, and most medical-grade monitoring equipment.',
      icon: <Globe className="w-4 h-4" />
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitSuccess(false);

    if (!formData.subject) {
      setSubmitError('Please select a subject');
      return;
    }
    if (formData.message.trim().length < 10) {
      setSubmitError('Message must be at least 10 characters');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await api.post('contact', {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        subject: formData.subject,
        message: formData.message.trim()
      });

      if (response.data.success) {
        setSubmitSuccess(true);
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
        setTimeout(() => setSubmitSuccess(false), 8000);
      }
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Failed to send message. Please try again.');
      setTimeout(() => setSubmitError(''), 6000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      isDarkMode 
        ? 'bg-gradient-to-b from-gray-900 via-gray-800 to-indigo-950'
        : 'bg-gradient-to-b from-blue-50 via-white to-indigo-50'
    }`}>
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16 md:pt-24 md:pb-20">
        <div className="absolute inset-0">
          <div className={`absolute inset-0 ${
            isDarkMode ? 'bg-grid-white/5' : 'bg-grid-blue-500/5'
          }`}></div>
          <div className={`absolute top-0 left-0 w-64 h-64 md:w-96 md:h-96 rounded-full blur-3xl animate-pulse-slow ${
            isDarkMode ? 'bg-cyan-500/10' : 'bg-cyan-500/20'
          }`}></div>
          <div className={`absolute bottom-0 right-0 w-64 h-64 md:w-96 md:h-96 rounded-full blur-3xl animate-pulse-slower ${
            isDarkMode ? 'bg-blue-500/10' : 'bg-blue-500/20'
          }`}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 relative z-10">
          <div className={`text-center mb-12 md:mb-16 transition-all duration-700 transform ${
            visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
              <span className={isDarkMode ? 'text-gray-100' : 'text-gray-900'}>
                Get in Touch
              </span>
              <br />
              <span className="bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Let's Connect
              </span>
            </h1>
            
            <p className={`text-lg sm:text-xl max-w-3xl mx-auto mb-8 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Have questions about our platform? Need assistance with setup? Our team is here to help you 
              provide the best care for your elderly loved ones.
            </p>
          </div>

          {/* Contact Methods */}
          <div className={`grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-16 transition-all duration-700 delay-300 transform ${
            visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            {contactMethods.map((method, index) => (
              <div 
                key={index}
                className={`group rounded-2xl border p-6 backdrop-blur-lg hover:scale-105 transform transition-all duration-300 ${
                  isDarkMode
                    ? 'bg-gray-900/50 border-gray-700/50 hover:shadow-cyan-900/30'
                    : 'bg-white/80 border-blue-100 hover:shadow-blue-200/50'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-br ${method.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <div className="text-white">
                    {method.icon}
                  </div>
                </div>
                
                <h3 className={`text-lg font-bold mb-1 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                  {method.title}
                </h3>
                
                <p className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {method.details}
                </p>
                
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {method.subtitle}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12">
            {/* Contact Form */}
            <div className={`rounded-3xl border p-6 sm:p-8 md:p-10 ${
              isDarkMode
                ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-gray-700/50'
                : 'bg-gradient-to-br from-white via-white to-blue-50/30 border-blue-100'
            }`}>
              <div className="mb-8">
                <h2 className={`text-2xl sm:text-3xl font-bold mb-3 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                  Send us a Message
                </h2>
                <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                  Fill out the form below and our team will get back to you within 2 hours.
                </p>
              </div>

              {submitSuccess && (
                <div className={`mb-6 p-4 rounded-xl border ${
                  isDarkMode
                    ? 'bg-emerald-900/30 border-emerald-800/30'
                    : 'bg-emerald-50 border-emerald-200'
                }`}>
                  <div className="flex items-center">
                    <CheckCircle className={`w-5 h-5 mr-3 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
                    <div>
                      <p className={`font-medium ${isDarkMode ? 'text-emerald-300' : 'text-emerald-700'}`}>
                        Message sent successfully!
                      </p>
                      <p className={`text-sm ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                        We'll get back to you within 2 hours.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {submitError && (
                <div className={`mb-6 p-4 rounded-xl border ${
                  isDarkMode
                    ? 'bg-red-900/30 border-red-800/30'
                    : 'bg-red-50 border-red-200'
                }`}>
                  <div className="flex items-center">
                    <AlertCircle className={`w-5 h-5 mr-3 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`} />
                    <p className={`font-medium ${isDarkMode ? 'text-red-300' : 'text-red-700'}`}>
                      {submitError}
                    </p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Name"
                      className={`w-full px-4 py-3 rounded-xl border transition-colors ${
                        isDarkMode
                          ? 'bg-gray-800/50 border-gray-700 text-gray-100 placeholder-gray-500 focus:border-cyan-500 focus:ring-cyan-500'
                          : 'bg-white border-blue-100 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500'
                      }`}
                     
                    />
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="Email"
                      className={`w-full px-4 py-3 rounded-xl border transition-colors ${
                        isDarkMode
                          ? 'bg-gray-800/50 border-gray-700 text-gray-100 placeholder-gray-500 focus:border-cyan-500 focus:ring-cyan-500'
                          : 'bg-white border-blue-100 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500'
                      }`}
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Phone number"
                      className={`w-full px-4 py-3 rounded-xl border transition-colors ${
                        isDarkMode
                          ? 'bg-gray-800/50 border-gray-700 text-gray-100 placeholder-gray-500 focus:border-cyan-500 focus:ring-cyan-500'
                          : 'bg-white border-blue-100 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500'
                      }`}
                    />
                  </div>
                  
                  <div ref={dropdownRef} className="relative">
                    <label className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Subject *
                    </label>
                    <button
                      type="button"
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 flex items-center justify-between text-left ${
                        dropdownOpen
                          ? isDarkMode
                            ? 'bg-gray-800/50 border-cyan-500 ring-2 ring-cyan-500/30 text-gray-100'
                            : 'bg-white border-blue-500 ring-2 ring-blue-500/20 text-gray-900'
                          : isDarkMode
                            ? 'bg-gray-800/50 border-gray-700 text-gray-100 hover:border-gray-600'
                            : 'bg-white border-blue-100 text-gray-900 hover:border-blue-200'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        {formData.subject ? (
                          <>
                            <span className={isDarkMode ? 'text-cyan-400' : 'text-blue-500'}>
                              {subjectOptions.find(o => o.value === formData.subject)?.icon}
                            </span>
                            {formData.subject}
                          </>
                        ) : (
                          <span className={isDarkMode ? 'text-gray-500' : 'text-gray-400'}>Select a subject</span>
                        )}
                      </span>
                      <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''} ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    </button>

                    {dropdownOpen && (
                      <div className={`absolute z-50 w-full mt-2 rounded-xl border shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 ${
                        isDarkMode
                          ? 'bg-gray-800 border-gray-700'
                          : 'bg-white border-gray-200'
                      }`}>
                        {subjectOptions.map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => {
                              setFormData({ ...formData, subject: option.value });
                              setDropdownOpen(false);
                            }}
                            className={`w-full px-4 py-3 flex items-center gap-3 text-left transition-colors duration-150 ${
                              formData.subject === option.value
                                ? isDarkMode
                                  ? 'bg-cyan-900/30 text-cyan-300'
                                  : 'bg-blue-50 text-blue-700'
                                : isDarkMode
                                  ? 'text-gray-200 hover:bg-gray-700/50'
                                  : 'text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            <span className={
                              formData.subject === option.value
                                ? isDarkMode ? 'text-cyan-400' : 'text-blue-500'
                                : isDarkMode ? 'text-gray-400' : 'text-gray-400'
                            }>
                              {option.icon}
                            </span>
                            <span className="font-medium text-sm">{option.label}</span>
                            {formData.subject === option.value && (
                              <CheckCircle className={`w-4 h-4 ml-auto ${isDarkMode ? 'text-cyan-400' : 'text-blue-500'}`} />
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    placeholder="Your message"
                    className={`w-full px-4 py-3 rounded-xl border transition-colors ${
                      isDarkMode
                        ? 'bg-gray-800/50 border-gray-700 text-gray-100 placeholder-gray-500 focus:border-cyan-500 focus:ring-cyan-500'
                        : 'bg-white border-blue-100 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500'
                    }`}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transform transition-all duration-300 flex items-center justify-center ${
                    isSubmitting
                      ? 'opacity-75 cursor-not-allowed'
                      : ''
                  } ${
                    isDarkMode
                      ? 'bg-gradient-to-r from-cyan-700 to-blue-700 text-white hover:from-cyan-600 hover:to-blue-600'
                      : 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send className="ml-2" />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Info & FAQ */}
            <div className="space-y-8">
              {/* Business Hours */}
              <div className={`rounded-3xl border p-6 md:p-8 ${
                isDarkMode
                  ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-gray-700/50'
                  : 'bg-gradient-to-br from-white via-white to-blue-50/30 border-blue-100'
              }`}>
                <div className="flex items-center mb-6">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 bg-gradient-to-br from-amber-600 to-orange-600 shadow-lg`}>
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className={`text-xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                      Business Hours
                    </h3>
                    <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                      We're here when you need us
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {[
                    { day: 'Monday - Friday', hours: '9:00 AM - 6:00 PM EST', status: 'Open' },
                    { day: 'Saturday', hours: '10:00 AM - 4:00 PM EST', status: 'Limited' },
                    { day: 'Sunday', hours: 'Emergency Support Only', status: 'On Call' }
                  ].map((schedule, index) => (
                    <div key={index} className="flex justify-between items-center py-3 border-b border-gray-700/30 last:border-0">
                      <div>
                        <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                          {schedule.day}
                        </p>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {schedule.hours}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        schedule.status === 'Open'
                          ? isDarkMode ? 'bg-emerald-900/30 text-emerald-300' : 'bg-emerald-100 text-emerald-700'
                          : schedule.status === 'Limited'
                          ? isDarkMode ? 'bg-amber-900/30 text-amber-300' : 'bg-amber-100 text-amber-700'
                          : isDarkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {schedule.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* FAQ */}
              <div className={`rounded-3xl border p-6 md:p-8 ${
                isDarkMode
                  ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-gray-700/50'
                  : 'bg-gradient-to-br from-white via-white to-blue-50/30 border-blue-100'
              }`}>
                <div className="flex items-center mb-6">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 bg-gradient-to-br from-purple-600 to-pink-600 shadow-lg`}>
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className={`text-xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                      Frequently Asked Questions
                    </h3>
                    <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                      Quick answers to common questions
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <div 
                      key={index}
                      className={`p-4 rounded-xl border transition-colors ${
                        isDarkMode
                          ? 'bg-gray-800/30 border-gray-700/50 hover:bg-gray-800/50'
                          : 'bg-blue-50/30 border-blue-100 hover:bg-blue-50/50'
                      }`}
                    >
                      <div className="flex items-start">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 mt-0.5 ${
                          isDarkMode ? 'bg-purple-900/30' : 'bg-purple-100'
                        }`}>
                          <div className={isDarkMode ? 'text-purple-400' : 'text-purple-600'}>
                            {faq.icon}
                          </div>
                        </div>
                        <div>
                          <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                            {faq.question}
                          </h4>
                          <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className={`rounded-3xl border p-6 md:p-8 ${
                isDarkMode
                  ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-gray-700/50'
                  : 'bg-gradient-to-br from-white via-white to-blue-50/30 border-blue-100'
              }`}>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: 'Response Time', value: '<2min', icon: <Zap className="w-4 h-4" /> },
                    { label: 'Support Score', value: '4.9/5', icon: <Heart className="w-4 h-4" /> },
                    { label: 'Resolution Rate', value: '98%', icon: <TrendingUp className="w-4 h-4" /> }
                  ].map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2 ${
                        isDarkMode ? 'bg-gray-800' : 'bg-blue-100'
                      }`}>
                        <div className={isDarkMode ? 'text-cyan-400' : 'text-cyan-600'}>
                          {stat.icon}
                        </div>
                      </div>
                      <div className={`text-xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                        {stat.value}
                      </div>
                      <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          <div className={`rounded-3xl overflow-hidden border ${
            isDarkMode
              ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-gray-700/50'
              : 'bg-gradient-to-br from-white via-white to-blue-50/30 border-blue-100'
          }`}>
            <div className="p-6 md:p-8">
              <div className="flex items-center mb-6">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 bg-gradient-to-br from-emerald-600 to-teal-600 shadow-lg`}>
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className={`text-xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                    Our Headquarters
                  </h3>
                  <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                    Lahore , Pakistan
                  </p>
                </div>
              </div>
              
              {/* Map Placeholder */}
              <div className={`relative h-64 md:h-80 rounded-2xl overflow-hidden ${
                isDarkMode ? 'bg-gray-800' : 'bg-blue-100'
              }`}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
                      isDarkMode ? 'bg-gray-700' : 'bg-white'
                    }`}>
                      <MapPin className={`w-10 h-10 ${isDarkMode ? 'text-cyan-400' : 'text-cyan-600'}`} />
                    </div>
                    <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                      Interactive map would display here
                    </p>
                  </div>
                </div>
                
                {/* Map Animated Elements */}
                <div className="absolute top-1/4 left-1/4 w-4 h-4 rounded-full bg-cyan-500 animate-ping"></div>
                <div className="absolute top-3/4 right-1/4 w-3 h-3 rounded-full bg-blue-500 animate-ping" style={{ animationDelay: '0.5s' }}></div>
                <div className="absolute bottom-1/3 left-1/3 w-2 h-2 rounded-full bg-emerald-500 animate-ping" style={{ animationDelay: '1s' }}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer isDarkMode={isDarkMode} />
    </div>
  );
};

export default ContactUs;