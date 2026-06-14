import React, { useState, useEffect } from 'react';
import { 
  Activity, HeartPulse, Brain, Shield, Users, 
  Smartphone, Bell, BarChart3, Download, Zap,
  Clock, CheckCircle, ArrowRight, Sparkles, Gem,
  TrendingUp, Target, Cpu, Wifi, Battery,
  Thermometer, Wind, Eye, Lock, Globe,
  MessageCircle, Video, FileText, PieChart
} from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Services = ({ isDarkMode, onToggleDarkMode }) => {
  const [activeTab, setActiveTab] = useState('ai-monitoring');
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate(); // Declare navigate function

  useEffect(() => {
    setVisible(true);
  }, []);

  // Handle button clicks
  const handleStartTrialClick = () => {
    navigate('/login');
  };

  const handleContactClick = () => {
    navigate('/contact-us');
  };

  const handleGetStartedClick = () => {
    navigate('/login');
  };

  // Main Services
  const mainServices = [
    {
      id: 'ai-monitoring',
      title: 'AI Health Monitoring',
      description: '24/7 real-time tracking of vital signs and biomarkers with predictive analytics',
      icon: <Brain className="w-6 h-6" />,
      color: 'from-blue-600 to-cyan-600',
      features: [
        'Continuous vital sign monitoring',
        'Predictive health risk detection',
        '50+ biomarker tracking',
        'Anomaly detection algorithms'
      ],
      stats: [
        { label: 'Accuracy', value: '99.8%' },
        { label: 'Detection Speed', value: '<2s' },
        { label: 'Uptime', value: '99.99%' }
      ]
    },
    {
      id: 'family-dashboard',
      title: 'Family Dashboard',
      description: 'Unified platform for families to monitor and coordinate elderly care',
      icon: <Users className="w-6 h-6" />,
      color: 'from-purple-600 to-pink-600',
      features: [
        'Real-time health updates',
        'Family chat & coordination',
        'Medication tracking',
        'Appointment scheduling'
      ],
      stats: [
        { label: 'Family Members', value: 'Unlimited' },
        { label: 'Response Rate', value: '95%' },
        { label: 'Satisfaction', value: '4.9/5' }
      ]
    },
    {
      id: 'doctor-portal',
      title: 'Doctor Portal',
      description: 'Professional tools for healthcare providers to monitor patients remotely',
      icon: <Activity className="w-6 h-6" />,
      color: 'from-emerald-600 to-teal-600',
      features: [
        'Professional health analytics',
        'EHR integration',
        'Remote consultation',
        'Automated reporting'
      ],
      stats: [
        { label: 'Hospitals', value: '500+' },
        { label: 'Doctors', value: '5K+' },
        { label: 'Integration', value: '50+' }
      ]
    },
    {
      id: 'emergency-response',
      title: 'Emergency Response',
      description: 'Instant alert system with automated emergency services coordination',
      icon: <Bell className="w-6 h-6" />,
      color: 'from-amber-600 to-orange-600',
      features: [
        'Automatic fall detection',
        'One-touch emergency call',
        'GPS location sharing',
        'Medical history dispatch'
      ],
      stats: [
        { label: 'Response Time', value: '<2min' },
        { label: 'Accuracy', value: '98.5%' },
        { label: 'Coverage', value: '24/7' }
      ]
    }
  ];

  // Features Grid
  const features = [
    {
      icon: <HeartPulse className="w-5 h-5" />,
      title: 'Vital Signs Monitoring',
      description: 'Track heart rate, blood pressure, oxygen levels in real-time',
      color: 'from-red-500 to-pink-600'
    },
    {
      icon: <Thermometer className="w-5 h-5" />,
      title: 'Biomarker Analysis',
      description: 'Monitor glucose, cholesterol, hormones, and 50+ biomarkers',
      color: 'from-orange-500 to-amber-600'
    },
    {
      icon: <Brain className="w-5 h-5" />,
      title: 'Predictive Analytics',
      description: 'AI-powered early warning for potential health risks',
      color: 'from-blue-500 to-indigo-600'
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: 'Security & Privacy',
      description: 'HIPAA-compliant, end-to-end encrypted data protection',
      color: 'from-emerald-500 to-green-600'
    },
    {
      icon: <Smartphone className="w-5 h-5" />,
      title: 'Mobile App',
      description: 'iOS & Android apps with push notifications',
      color: 'from-purple-500 to-violet-600'
    },
    {
      icon: <BarChart3 className="w-5 h-5" />,
      title: 'Smart Reports',
      description: 'Automated PDF/CSV reports with trend analysis',
      color: 'from-cyan-500 to-teal-600'
    }
  ];

  // Pricing Plans
  const plans = [
    {
      name: 'Basic',
      price: '$49',
      period: '/month',
      description: 'For individual family monitoring',
      color: 'from-blue-500 to-cyan-500',
      features: [
        '2 elderly profiles',
        'Basic health monitoring',
        'Mobile app access',
        'Email support',
        'Weekly reports'
      ]
    },
    {
      name: 'Professional',
      price: '$99',
      period: '/month',
      description: 'For families with multiple elders',
      color: 'from-purple-500 to-pink-500',
      popular: true,
      features: [
        '5 elderly profiles',
        'Advanced AI monitoring',
        'Family dashboard',
        'Priority support',
        'Daily reports',
        'Emergency alerts'
      ]
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      description: 'For clinics & care facilities',
      color: 'from-emerald-500 to-teal-500',
      features: [
        'Unlimited profiles',
        'Full AI suite',
        'Doctor portal',
        '24/7 support',
        'Custom integrations',
        'API access',
        'White-label option'
      ]
    }
  ];

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
            isDarkMode ? 'bg-purple-500/10' : 'bg-purple-500/20'
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
                Complete Elderly Care
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent">
                Powered by AI
              </span>
            </h1>
            
            <p className={`text-lg sm:text-xl max-w-3xl mx-auto mb-8 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              From real-time monitoring to emergency response, our integrated platform provides everything 
              needed for modern elderly care
            </p>
          </div>
        </div>
      </section>

      {/* Services Tabs */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          {/* Tabs Navigation */}
          <div className={`flex flex-wrap gap-2 justify-center mb-8 md:mb-12 backdrop-blur-lg rounded-2xl p-2 max-w-4xl mx-auto ${
            isDarkMode ? 'bg-gray-900/50 border border-gray-700/50' : 'bg-white/80 border border-blue-100'
          }`}>
            {mainServices.map((service) => (
              <button
                key={service.id}
                onClick={() => setActiveTab(service.id)}
                className={`px-4 py-3 sm:px-6 sm:py-4 rounded-xl font-medium transition-all duration-300 flex-1 min-w-[200px] ${
                  activeTab === service.id
                    ? `bg-gradient-to-r ${service.color} text-white shadow-lg scale-105`
                    : isDarkMode
                      ? 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-blue-50'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  {service.icon}
                  <span>{service.title}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Active Service Content */}
          <div className={`rounded-3xl overflow-hidden border shadow-2xl mb-12 md:mb-16 transition-all duration-500 ${
            isDarkMode
              ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-gray-700/50'
              : 'bg-gradient-to-br from-white via-white to-blue-50/30 border-blue-100'
          }`}>
            {mainServices.map((service) => (
              activeTab === service.id && (
                <div key={service.id} className="p-6 sm:p-8 md:p-12">
                  <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
                    {/* Left Content */}
                    <div className="space-y-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${service.color} shadow-lg`}>
                          <div className="text-white">
                            {service.icon}
                          </div>
                        </div>
                        <div>
                          <h2 className={`text-2xl sm:text-3xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                            {service.title}
                          </h2>
                          <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                            {service.description}
                          </p>
                        </div>
                      </div>

                      {/* Features List */}
                      <div className="space-y-4">
                        {service.features.map((feature, index) => (
                          <div key={index} className="flex items-center">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 bg-gradient-to-br ${service.color}`}>
                              <CheckCircle className="w-3 h-3 text-white" />
                            </div>
                            <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                              {feature}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-700/30">
                        {service.stats.map((stat, index) => (
                          <div key={index} className="text-center">
                            <div className={`text-xl sm:text-2xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                              {stat.value}
                            </div>
                            <div className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              {stat.label}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Right - Animated Visualization */}
                    <div className="relative h-64 sm:h-80 md:h-96 rounded-2xl overflow-hidden">
                      <div className={`absolute inset-0 ${
                        isDarkMode ? 'bg-gray-800/50' : 'bg-blue-100/30'
                      } backdrop-blur-lg border ${
                        isDarkMode ? 'border-gray-700/50' : 'border-blue-200'
                      }`}>
                        {/* Animated Elements */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          {/* Pulse Animation */}
                          <div className="relative">
                            <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${service.color} animate-ping opacity-20`}></div>
                            <div className={`relative w-32 h-32 rounded-full flex items-center justify-center bg-gradient-to-br ${service.color} shadow-2xl`}>
                              {service.icon}
                            </div>
                          </div>
                          
                          {/* Floating Icons */}
                          {[...Array(3)].map((_, i) => (
                            <div
                              key={i}
                              className={`absolute w-10 h-10 rounded-full flex items-center justify-center shadow-lg animate-float ${
                                isDarkMode ? 'bg-gray-700/80' : 'bg-white'
                              }`}
                              style={{
                                top: `${20 + i * 20}%`,
                                left: `${10 + i * 25}%`,
                                animationDelay: `${i * 0.3}s`
                              }}
                            >
                              <Zap className={`w-4 h-4 ${
                                isDarkMode ? 'text-blue-400' : 'text-blue-600'
                              }`} />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
              <span className={isDarkMode ? 'text-gray-100' : 'text-gray-900'}>
                Comprehensive
              </span>
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                {' '}Features
              </span>
            </h2>
            <p className={`text-lg sm:text-xl max-w-3xl mx-auto ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Everything you need for complete elderly care in one integrated platform
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className={`group rounded-2xl border p-6 md:p-8 hover:scale-105 transform transition-all duration-500 ${
                  isDarkMode
                    ? 'bg-gradient-to-br from-gray-900/50 via-gray-800/50 to-gray-900/50 border-gray-700/50 hover:shadow-xl hover:shadow-blue-900/20'
                    : 'bg-gradient-to-br from-white via-white to-blue-50/30 border-blue-100 hover:shadow-xl hover:shadow-blue-200/30'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 bg-gradient-to-br ${feature.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <div className="text-white">
                    {feature.icon}
                  </div>
                </div>
                
                <h3 className={`text-xl font-bold mb-3 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                  {feature.title}
                </h3>
                
                <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="text-center mb-12 md:mb-16">
            
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
              <span className={isDarkMode ? 'text-gray-100' : 'text-gray-900'}>
                Choose Your
              </span>
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                {' '}Plan
              </span>
            </h2>
            
            <p className={`text-lg sm:text-xl max-w-3xl mx-auto ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Flexible plans for families, caregivers, and healthcare organizations
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {plans.map((plan, index) => (
              <div 
                key={index}
                className={`group relative ${
                  plan.popular ? 'md:-translate-y-4' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="px-4 py-1 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold shadow-lg">
                      MOST POPULAR
                    </div>
                  </div>
                )}
                
                <div className={`rounded-3xl border overflow-hidden h-full ${
                  isDarkMode
                    ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-gray-700/50'
                    : 'bg-gradient-to-br from-white via-white to-blue-50/30 border-blue-100'
                }`}>
                  <div className="p-6 md:p-8">
                    <h3 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                      {plan.name}
                    </h3>
                    <div className="flex items-baseline mb-4">
                      <span className={`text-3xl md:text-4xl font-bold bg-gradient-to-r ${plan.color} bg-clip-text text-transparent`}>
                        {plan.price}
                      </span>
                      <span className={`ml-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {plan.period}
                      </span>
                    </div>
                    <p className={`mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {plan.description}
                    </p>
                    
                    <div className="space-y-4 mb-8">
                      {plan.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center">
                          <CheckCircle className={`w-5 h-5 mr-3 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
                          <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                    
                    <button 
                      onClick={handleGetStartedClick}
                      className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
                        plan.popular
                          ? `bg-gradient-to-r ${plan.color} text-white hover:shadow-xl hover:scale-105`
                          : isDarkMode
                            ? 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                            : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                      }`}
                    >
                      Get Started
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - CORRECTED BUTTONS */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          <div className={`rounded-3xl overflow-hidden border ${
            isDarkMode
              ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-blue-800/20'
              : 'bg-gradient-to-br from-white via-blue-50/30 to-white border-blue-200'
          }`}>
            <div className="relative p-8 md:p-12 lg:p-16">
              <div className="absolute inset-0">
                <div className={`absolute inset-0 ${
                  isDarkMode ? 'bg-grid-white/5' : 'bg-grid-blue-500/5'
                }`}></div>
              </div>
              
              <div className="relative z-10 text-center">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
                  <span className={isDarkMode ? 'text-gray-100' : 'text-gray-900'}>
                    Ready to Transform
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Elderly Care?
                  </span>
                </h2>
                
                <p className={`text-lg sm:text-xl max-w-3xl mx-auto mb-8 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Start your free trial today and experience the future of elderly care monitoring
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  {/* CORRECTED: Start Free Trial Button */}
                  <button 
                    onClick={handleStartTrialClick}
                    className={`group px-8 py-4 rounded-full font-semibold shadow-xl hover:shadow-2xl hover:scale-105 transform transition-all duration-300 flex items-center justify-center ${
                      isDarkMode
                        ? 'bg-gradient-to-r from-purple-700 to-pink-700 text-white hover:from-purple-600 hover:to-pink-600'
                        : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                    }`}
                  >
                    Start Free Trial
                    <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
                  </button>
                  
                  {/* CORRECTED: Contact Here Button */}
                  <button 
                    onClick={handleContactClick}
                    className={`px-8 py-4 rounded-full border-2 font-semibold hover:scale-105 transform transition-all duration-300 ${
                      isDarkMode
                        ? 'border-blue-800/30 bg-gray-800/50 text-blue-300 hover:bg-gray-800/80'
                        : 'border-blue-200 bg-white text-blue-700 hover:bg-blue-50'
                    }`}
                  >
                    Contact Here
                  </button>
                </div>
                
                <p className={`mt-6 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  No credit card required • 14-day free trial • Cancel anytime
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer isDarkMode={isDarkMode} onLoginClick={handleStartTrialClick} />
    </div>
  );
};

export default Services;