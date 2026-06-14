import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, ChevronRight, Sparkles, Shield, Activity, Users, Smartphone, 
  Bell, TrendingUp, Zap, Target, Heart, ShieldCheck, Cpu, ActivitySquare, 
  Droplets, Gem, Pill, BarChart3, AlertCircle, FileText, PieChart, 
  LineChart, Download, Eye, Clock, CheckCircle, HeartPulse, Thermometer, 
  Wind, Activity as ActivityIcon, Star, Quote, ChevronLeft, ChevronRight as ChevronRightIcon,
  Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin, Heart as HeartIcon,
  Shield as ShieldIcon, Users as UsersIcon, Globe, ArrowRight,
  Moon, Sun
} from 'lucide-react';

const LandingPage = ({ isDarkMode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [currentReview, setCurrentReview] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Prevent scrolling when splash screen is showing
    if (showSplash) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    // Show splash screen for 3 seconds
    const splashTimer = setTimeout(() => {
      setShowSplash(false);
      setIsVisible(true);
      document.body.style.overflow = 'auto';
    }, 3000);

    // Auto slide reviews
    const reviewInterval = setInterval(() => {
      setCurrentReview((prev) => (prev + 1) % 3);
    }, 5000);

    return () => {
      clearTimeout(splashTimer);
      clearInterval(reviewInterval);
      document.body.style.overflow = 'auto';
    };
  }, [showSplash]);

  // Health tracking cards data - simple and modern
  const healthCards = [
    {
      id: 1,
      title: "Oxygen Levels",
      value: "98%",
      status: "Normal",
      icon: <Gem className="w-4 h-4 sm:w-5 sm:h-5" />,
      color: "border-l-4 border-l-rose-500",
      bgColor: "bg-gradient-to-r from-rose-50 to-rose-50/50",
      bgColorDark: "bg-gradient-to-r from-gray-800 to-gray-800/50",
      trend: "Stable"
    },
    {
      id: 2,
      title: "  Heart Rate",
      value: "72 BPM",
      status: "Optimal",
      icon: <Droplets className="w-4 h-4 sm:w-5 sm:h-5" />,
      color: "border-l-4 border-l-emerald-500",
      bgColor: "bg-gradient-to-r from-emerald-50 to-emerald-50/50",
      bgColorDark: "bg-gradient-to-r from-gray-800 to-gray-800/50",
      trend: "Improving"
    },
    {
      id: 3,
      title: "Blood Pressure",
      value: "120/80",
      status: "Balanced",
      icon: <ActivitySquare className="w-4 h-4 sm:w-5 sm:h-5" />,
      color: "border-l-4 border-l-violet-500",
      bgColor: "bg-gradient-to-r from-violet-50 to-violet-50/50",
      bgColorDark: "bg-gradient-to-r from-gray-800 to-gray-800/50",
      trend: "Stable"
    },
    {
      id: 4,
      title: "Glucose Levels",
      value: "450 pg/mL",
      status: "Optimal",
      icon: <Pill className="w-4 h-4 sm:w-5 sm:h-5" />,
      color: "border-l-4 border-l-amber-500",
      bgColor: "bg-gradient-to-r from-amber-50 to-amber-50/50",
      bgColorDark: "bg-gradient-to-r from-gray-800 to-gray-800/50",
      trend: "Optimal"
    }
  ];

  // Dashboard metrics data with lucide icons
  const dashboardMetrics = [
    {
      id: 1,
      name: "Heart Rate",
      value: "72 BPM",
      icon: <HeartPulse className="w-3 h-3 sm:w-4 sm:h-4" />,
      color: "from-green-500 to-emerald-600",
      width: "75%",
      status: "Normal"
    },
    {
      id: 2,
      name: "Blood Pressure",
      value: "120/80",
      icon: <ActivityIcon className="w-3 h-3 sm:w-4 sm:h-4" />,
      color: "from-blue-500 to-cyan-600",
      width: "67%",
      status: "Optimal"
    },
    {
      id: 3,
      name: "Glucose Level",
      value: "92 mg/dL",
      icon: <Thermometer className="w-3 h-3 sm:w-4 sm:h-4" />,
      color: "from-amber-500 to-orange-600",
      width: "83%",
      status: "Good"
    },
    {
      id: 4,
      name: "Oxygen Level",
      value: "98%",
      icon: <Wind className="w-3 h-3 sm:w-4 sm:h-4" />,
      color: "from-indigo-500 to-purple-600",
      width: "98%",
      status: "Excellent"
    }
  ];

  // Elderly Family Reviews Data
  const familyReviews = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Daughter & Caregiver",
      image: "/assets/daughter1.jpg",
      review: "AegisCare gave me peace of mind while caring for my 78-year-old father. The AI alerts helped us catch a potential health issue before it became serious.",
      rating: 5,
      color: "from-blue-500 to-cyan-500",
      icon: <HeartIcon className="w-5 h-5 sm:w-6 sm:h-6" />,
      tags: ["Peace of Mind", "Early Detection", "24/7 Monitoring"]
    },
    {
      id: 2,
      name: "Robert Chen",
      role: "Son & Family Manager",
      image: "/assets/son.jpg",
      review: "The dashboard made it easy for our whole family to stay updated on mom's health. The real-time notifications are a game-changer for busy families.",
      rating: 5,
      color: "from-purple-500 to-pink-500",
      icon: <UsersIcon className="w-5 h-5 sm:w-6 sm:h-6" />,
      tags: ["Family Access", "Real-time Updates", "Easy Monitoring"]
    },
    {
      id: 3,
      name: "Maria Garcia",
      role: "Daughter & Healthcare Pro",
      image: "/assets/daughter2.jpg",
      review: "As a nurse, I'm impressed by the accuracy of the health predictions. It's like having a medical professional monitoring 24/7.",
      rating: 5,
      color: "from-emerald-500 to-teal-500",
      icon: <ShieldIcon className="w-5 h-5 sm:w-6 sm:h-6" />,
      tags: ["Medical Grade", "Accurate Predictions", "Professional Trust"]
    }
  ];

  // Footer data
  const footerLinks = {
    product: ["Dashboard", "AI Analytics", "Health Monitoring", "Reports", "Mobile App"],
    company: ["About Us", "Careers", "Press", "Blog", "Contact"],
    resources: ["Documentation", "API", "Help Center", "Privacy", "Terms"],
    support: ["24/7 Support", "Health Tips", "Caregiver Guide", "FAQ", "Community"]
  };

  const socialLinks = [
    { icon: <Facebook className="w-4 h-4 sm:w-5 sm:h-5" />, href: "#", label: "Facebook" },
    { icon: <Twitter className="w-4 h-4 sm:w-5 sm:h-5" />, href: "#", label: "Twitter" },
    { icon: <Linkedin className="w-4 h-4 sm:w-5 sm:h-5" />, href: "#", label: "LinkedIn" },
    { icon: <Instagram className="w-4 h-4 sm:w-5 sm:h-5" />, href: "#", label: "Instagram" }
  ];

  const nextReview = () => {
    setCurrentReview((prev) => (prev + 1) % 3);
  };

  const prevReview = () => {
    setCurrentReview((prev) => (prev - 1 + 3) % 3);
  };

  return (
    <>
      {/* Splash Screen */}
      {showSplash && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center overflow-hidden transition-all duration-500 ${
            isDarkMode
              ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-950'
              : 'bg-gradient-to-br from-blue-200 via-indigo-100 to-purple-200'
          }`}
        >
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Floating Particles */}
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-white/30 rounded-full animate-float-particle"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: `${3 + Math.random() * 4}s`
                }}
              ></div>
            ))}
          </div>

          {/* Logo Container with Glow Effect */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="absolute -inset-30 rounded-full blur-3xl"></div>
            <div className="relative">
              {/* Logo with Pulse Animation */}
              <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-3xl flex items-center justify-center animate-logo-pulse">
                <img src="/assets/fulllogo.png" alt="AegisCare Logo" className="w-full h-full object-contain rounded-3xl" />
                <div className="absolute inset-0 rounded-full border-2 border-blue-400/30 animate-ring-expand-3-5s"></div>
                <div className="absolute inset-0 rounded-full border-2 border-cyan-400/20 animate-ring-expand-delayed-3-5s"></div>
              </div>
            </div>
            
            {/* Loading Text */}
            <div className="mt-8 sm:mt-12 text-center">
              <div className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent mb-2 animate-fade-in-up">
                Multi AI Agentic Elderly Care Platform
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div
        className={`min-h-screen overflow-hidden transition-all duration-500 ${
          showSplash ? 'opacity-0' : 'opacity-100'
        } ${
          isDarkMode
            ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-950'
            : 'bg-gradient-to-br from-blue-50 via-white to-indigo-50'
        }`}
      >
        {/* Hero Section */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-8 md:py-12 lg:py-16">
          {/* Hero Content */}
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 lg:gap-20 items-center">
            {/* Left Side - Text Content */}
            <div className={`space-y-6 md:space-y-8 transition-all duration-700 transform ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
              
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                <span className={`bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent ${
                  isDarkMode ? 'brightness-125' : ''
                }`}>
                  Your Health Data, Decoded by AI
                </span>
                <br />
                <span className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                  Next-Gen Elderly Care with AI Precision
                </span>
              </h1>
              
              <p className={`text-base sm:text-lg md:text-xl leading-relaxed ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                AegisCare helps caregivers, doctors, and families track, understand, and act on elderly health data with smart AI insights and unified dashboards for proactive healthcare management.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                <button onClick={() => navigate('/login')} className={`group px-6 py-3 sm:px-8 sm:py-4 rounded-xl font-semibold text-base sm:text-lg shadow-xl hover:shadow-2xl hover:scale-105 transform transition-all duration-300 flex items-center justify-center ${
                  isDarkMode
                    ? 'bg-gradient-to-r from-blue-700 to-indigo-700 text-white hover:from-blue-600 hover:to-indigo-600'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                }`}>
                  See Dashboard
                  <ChevronRight className="ml-2 sm:ml-3 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-2 transition-transform" />
                </button>
                <button onClick={() => navigate('/signup')} className={`px-6 py-3 sm:px-8 sm:py-4 rounded-xl border-2 font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl transition-all duration-300 ${
                  isDarkMode
                    ? 'border-blue-800/30 bg-gray-800/50 text-blue-300 hover:bg-gray-800/80'
                    : 'border-blue-200 bg-white text-blue-700 hover:bg-blue-50'
                }`}>
                  Get Started
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 sm:gap-6 pt-6 sm:pt-8">
                {[
                  { value: "99.8%", label: "Accuracy Rate" },
                  { value: "24/7", label: "Real-time Monitoring" },
                  { value: "50k+", label: "Biomarkers Tracked" }
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className={`text-xl sm:text-2xl md:text-3xl font-bold ${
                      isDarkMode ? 'text-blue-400' : 'text-blue-700'
                    }`}>
                      {stat.value}
                    </div>
                    <div className={`text-xs sm:text-sm ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side - 3D Animated Image */}
            <div className={`relative  transition-all duration-1000 transform ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
              <div className="relative my-20 w-full h-[300px] sm:h-[400px] md:h-[500px]">
                {/* Floating 3D Sphere */}
                <div className={`absolute top-1/4 left-1/4 w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full opacity-80 animate-float shadow-2xl ${
                  isDarkMode
                    ? 'bg-gradient-to-br from-blue-700/50 to-blue-900'
                    : 'bg-gradient-to-br from-blue-400 to-blue-600'
                }`}>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/20 to-transparent"></div>
                </div>
                
                {/* DNA Helix Animation */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64">
                    {[...Array(20)].map((_, i) => (
                      <div
                        key={i}
                        className={`absolute left-1/2 top-0 w-0.5 sm:w-1 h-48 sm:h-56 md:h-64 transform origin-top ${
                          isDarkMode
                            ? 'bg-gradient-to-b from-blue-500/70 to-indigo-500/70'
                            : 'bg-gradient-to-b from-blue-400 to-indigo-400'
                        }`}
                        style={{
                          transform: `translateX(-50%) rotate(${i * 18}deg)`,
                          animation: `dnaSpin 3s linear infinite`,
                          animationDelay: `${i * 0.15}s`,
                          opacity: 0.7
                        }}
                      >
                        <div className={`absolute -top-2 left-1/2 transform -translate-x-1/2 w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 rounded-full shadow-lg ${
                          isDarkMode ? 'bg-blue-600' : 'bg-blue-500'
                        }`}></div>
                        <div className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 rounded-full shadow-lg ${
                          isDarkMode ? 'bg-indigo-600' : 'bg-indigo-500'
                        }`}></div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Dashboard Preview */}
                <div className={`absolute bottom-0 right-0 w-48 h-32 sm:w-56 sm:h-40 md:w-64 md:h-48 rounded-2xl shadow-2xl transform rotate-3 animate-float-slow border ${
                  isDarkMode
                    ? 'bg-gray-800/90 border-gray-700/50 backdrop-blur-xl'
                    : 'bg-white border-blue-100'
                }`}>
                  <div className="p-3 sm:p-4">
                    <div className="flex items-center mb-3 sm:mb-4">
                      <Activity className={`h-4 w-4 sm:h-5 sm:w-5 mr-2 ${
                        isDarkMode ? 'text-green-400' : 'text-green-500'
                      }`} />
                      <div className={`text-xs sm:text-sm font-semibold ${
                        isDarkMode ? 'text-gray-200' : 'text-gray-800'
                      }`}>
                        Live Biomarker Dashboard
                      </div>
                    </div>
                    <div className="space-y-2 sm:space-y-3">
                      {[
                        { label: "Glucose", value: "92 mg/dL", color: "text-green-600" },
                        { label: "Cholesterol", value: "185 mg/dL", color: "text-yellow-600" },
                        { label: "Hemoglobin", value: "14.2 g/dL", color: "text-blue-600" }
                      ].map((item, index) => (
                        <div key={index} className="flex justify-between">
                          <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {item.label}
                          </span>
                          <span className={`text-xs font-bold ${item.color}`}>
                            {item.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className={`absolute top-0 right-4 sm:right-8 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-xl opacity-70 animate-float-delayed shadow-xl ${
                  isDarkMode
                    ? 'bg-gradient-to-br from-purple-700/50 to-pink-700/50'
                    : 'bg-gradient-to-br from-purple-400 to-pink-400'
                }`}></div>
                <div className={`absolute bottom-4 sm:bottom-8 left-0 w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-full opacity-60 animate-float-slower shadow-lg ${
                  isDarkMode
                    ? 'bg-gradient-to-br from-green-700/50 to-teal-700/50'
                    : 'bg-gradient-to-br from-green-400 to-teal-400'
                }`}></div>
              </div>
            </div>
          </div>
        </main>

        {/* Modern Features Section */}
        <section className="relative py-12 md:py-20 lg:py-24 overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute top-0 left-0 w-full h-full">
            <div className={`absolute top-1/4 left-1/4 w-48 h-48 sm:w-64 sm:h-64 md:w-96 md:h-96 rounded-full blur-3xl animate-pulse-slow ${
              isDarkMode
                ? 'bg-gradient-to-r from-blue-500/5 to-purple-500/5'
                : 'bg-gradient-to-r from-blue-500/5 to-purple-500/5'
            }`}></div>
            <div className={`absolute bottom-1/4 right-1/4 w-48 h-48 sm:w-64 sm:h-64 md:w-96 md:h-96 rounded-full blur-3xl animate-pulse-slower ${
              isDarkMode
                ? 'bg-gradient-to-r from-indigo-500/5 to-cyan-500/5'
                : 'bg-gradient-to-r from-indigo-500/5 to-cyan-500/5'
            }`}></div>
            <div className={`absolute inset-0 ${
              isDarkMode ? 'bg-grid-white/5' : 'bg-grid-blue-500/5'
            }`}></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 relative z-10">
            {/* Section Header with Glow Effect */}
            <div className="text-center mb-12 md:mb-16 lg:mb-20">
              <div className={`inline-flex items-center px-4 py-2 sm:px-6 sm:py-3 rounded-full backdrop-blur-lg border shadow-lg mb-6 sm:mb-8 ${
                isDarkMode
                  ? 'bg-gradient-to-r from-blue-900/20 to-indigo-900/20 border-blue-800/30 shadow-blue-500/10'
                  : 'bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border-white/20 shadow-blue-500/10'
              }`}>
                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center mr-2 sm:mr-3 shadow-lg ${
                  isDarkMode
                    ? 'bg-gradient-to-br from-blue-700 to-indigo-800'
                    : 'bg-gradient-to-br from-blue-500 to-indigo-600'
                }`}>
                  <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <span className={`text-xs sm:text-sm font-semibold tracking-wider ${
                  isDarkMode ? 'text-blue-300' : 'text-blue-700'
                }`}>
                  DESIGNED FOR CLARITY & TRUST
                </span>
              </div>
              
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 sm:mb-8">
                <span className={isDarkMode ? 'text-gray-100' : 'text-gray-900'}>
                  Redefining Elderly Care with
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Intelligent Monitoring
                </span>
              </h2>
              
              <p className={`text-lg sm:text-xl max-w-3xl mx-auto ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Trusted by clinics, labs, and healthcare professionals worldwide for proactive elderly monitoring
              </p>
            </div>

            {/* Card 1 - Glassmorphism with Hover 3D Effect */}
            <div className="max-w-6xl mx-auto mb-12 md:mb-16">
              <div className="group relative">
                {/* Background Glow */}
                <div className="absolute -inset-0.5 sm:-inset-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl sm:rounded-3xl blur-xl opacity-70 group-hover:opacity-100 transition-all duration-700"></div>
                
                {/* Main Card */}
                <div className={`relative backdrop-blur-xl rounded-2xl sm:rounded-3xl border p-6 sm:p-8 md:p-10 shadow-2xl transition-all duration-500 group-hover:-translate-y-2 ${
                  isDarkMode
                    ? 'bg-gradient-to-br from-gray-900/90 via-gray-800/95 to-gray-900/90 border-gray-700/40 shadow-blue-900/30 hover:shadow-blue-800/50'
                    : 'bg-gradient-to-br from-white/90 via-white/95 to-white/90 border-white/40 shadow-blue-100/30 hover:shadow-blue-200/50'
                }`}>
                  <div className="flex flex-col lg:flex-row items-center gap-6 sm:gap-8 md:gap-10">
                    {/* Icon with Floating Animation */}
                    <div className="relative flex-shrink-0">
                      <div className={`absolute -inset-4 sm:-inset-6 rounded-full blur-2xl animate-pulse-slow ${
                        isDarkMode
                          ? 'bg-gradient-to-r from-blue-500/10 to-indigo-600/10'
                          : 'bg-gradient-to-r from-blue-500/20 to-indigo-600/20'
                      }`}></div>
                      <div className={`relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-500 animate-float ${
                        isDarkMode
                          ? 'bg-gradient-to-br from-blue-700 to-indigo-800'
                          : 'bg-gradient-to-br from-blue-500 to-indigo-600'
                      }`}>
                        <Zap className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-white" />
                        <div className={`absolute inset-0 rounded-2xl border-2 ${
                          isDarkMode ? 'border-white/10' : 'border-white/20'
                        }`}></div>
                      </div>
                      <div className={`absolute -bottom-3 -right-3 sm:-bottom-4 sm:-right-4 px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2 rounded-full shadow-lg ${
                        isDarkMode
                          ? 'bg-gradient-to-br from-cyan-600 to-blue-700 text-white'
                          : 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white'
                      }`}>
                        <span className="text-xs sm:text-sm font-bold">99.8%</span>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1">
                      <h3 className={`text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 group-hover:text-blue-700 transition-colors ${
                        isDarkMode ? 'text-gray-100 group-hover:text-blue-400' : 'text-gray-900'
                      }`}>
                        Early Detection of Health Risks
                      </h3>
                      
                      <p className={`text-base sm:text-lg mb-4 sm:mb-6 leading-relaxed ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        Spot issues before they become serious with predictive AI analytics that monitor vital signs 24/7
                      </p>
                      
                      {/* Interactive Progress Bars */}
                      <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                        <div className="group/item">
                          <div className="flex justify-between mb-1">
                            <span className={`text-xs sm:text-sm font-medium ${
                              isDarkMode ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                              Anomaly Detection
                            </span>
                            <span className={`text-xs sm:text-sm font-bold ${
                              isDarkMode ? 'text-blue-400' : 'text-blue-600'
                            }`}>
                              99.8%
                            </span>
                          </div>
                          <div className={`w-full h-1.5 sm:h-2 rounded-full overflow-hidden ${
                            isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                          }`}>
                            <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-1000 group-hover/item:w-full" style={{ width: '99.8%' }}></div>
                          </div>
                        </div>
                        
                        <div className="group/item">
                          <div className="flex justify-between mb-1">
                            <span className={`text-xs sm:text-sm font-medium ${
                              isDarkMode ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                              Response Time
                            </span>
                            <span className={`text-xs sm:text-sm font-bold ${
                              isDarkMode ? 'text-emerald-400' : 'text-emerald-600'
                            }`}>
                              &lt;2 minutes
                            </span>
                          </div>
                          <div className={`w-full h-1.5 sm:h-2 rounded-full overflow-hidden ${
                            isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                          }`}>
                            <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full transition-all duration-1000 group-hover/item:w-full" style={{ width: '95%' }}></div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Feature Chips */}
                      <div className="flex flex-wrap gap-2 sm:gap-3">
                        {["48-72h Early Warning", "Continuous Monitoring", "Pattern Recognition", "Risk Assessment"].map((feature, idx) => (
                          <div key={idx} className="group/chip">
                            <div className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 group-hover/chip:scale-105 group-hover/chip:shadow-lg ${
                              isDarkMode
                                ? 'bg-gradient-to-r from-blue-900/30 to-indigo-900/30 border border-blue-800/30 text-blue-300'
                                : 'bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-blue-700'
                            }`}>
                              {feature}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SIMPLE AND MODERN HEALTH CARDS SECTION */}
            <div className="max-w-6xl mx-auto mb-12 md:mb-16">
              <div className="relative">
                <div className={`rounded-2xl sm:rounded-3xl border p-6 sm:p-8 md:p-10 shadow-2xl ${
                  isDarkMode
                    ? 'bg-gray-900/80 border-gray-700/50 shadow-blue-900/20 backdrop-blur-sm'
                    : 'bg-white border-blue-100 shadow-blue-100/20'
                }`}>
                  {/* Section Header */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 sm:mb-12">
                    <div>
                      <h3 className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3 ${
                        isDarkMode ? 'text-gray-100' : 'text-gray-900'
                      }`}>
                        Track Your HR , BP , Oxygen level & more
                      </h3>
                      <p className={`text-base sm:text-lg md:text-xl ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        Stay on top of your health with comprehensive biomarker tracking
                      </p>
                    </div>
                    <div className="mt-4 md:mt-0">
                      
                    </div>
                  </div>

                  {/* Simple Health Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    {healthCards.map((card) => (
                      <div 
                        key={card.id} 
                        className={`group relative rounded-xl sm:rounded-2xl border p-4 sm:p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 ${
                          isDarkMode
                            ? 'bg-gray-800/50 border-gray-700 hover:shadow-blue-900/30'
                            : 'bg-white border-gray-200'
                        } ${card.color}`}
                      >
                        {/* Icon */}
                        <div className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center mb-4 sm:mb-5 ${
                          isDarkMode ? card.bgColorDark : card.bgColor
                        }`}>
                          <div className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                            {card.icon}
                          </div>
                        </div>
                        
                        {/* Content */}
                        <h4 className={`text-lg sm:text-xl font-bold mb-2 sm:mb-3 ${
                          isDarkMode ? 'text-gray-100' : 'text-gray-900'
                        }`}>
                          {card.title}
                        </h4>
                        
                        <div className={`text-xl sm:text-2xl font-bold mb-3 sm:mb-4 ${
                          isDarkMode ? 'text-gray-100' : 'text-gray-900'
                        }`}>
                          {card.value}
                        </div>
                        
                        {/* Status */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full mr-1.5 sm:mr-2 ${
                              card.status === 'Optimal' ? 'bg-emerald-500' :
                              card.status === 'Normal' ? 'bg-blue-500' :
                              card.status === 'Balanced' ? 'bg-violet-500' : 'bg-amber-500'
                            }`}></div>
                            <span className={`text-xs sm:text-sm font-medium ${
                              isDarkMode ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                              {card.status}
                            </span>
                          </div>
                          <span className={`text-xs sm:text-sm ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            {card.trend}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <div className={`mt-8 sm:mt-12 pt-6 sm:pt-8 border-t ${
                    isDarkMode ? 'border-gray-700' : 'border-blue-100'
                  }`}>
                    <div className="flex flex-col md:flex-row items-center justify-between">
                      <div className="text-center md:text-left mb-4 md:mb-0">
                        <h4 className={`text-base sm:text-lg font-semibold mb-1 sm:mb-2 ${
                          isDarkMode ? 'text-gray-100' : 'text-gray-900'
                        }`}>
                          Comprehensive Health Tracking
                        </h4>
                        <p className={`max-w-lg text-sm sm:text-base ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          Monitor 50+ biomarkers including cholesterol, glucose, kidney function, and more with real-time updates.
                        </p>
                      </div>
                      <button onClick={() => navigate('/login')} className={`px-6 py-2.5 sm:px-8 sm:py-3 rounded-full font-semibold shadow-lg hover:shadow-xl hover:scale-105 transform transition-all duration-300 ${
                        isDarkMode
                          ? 'bg-gradient-to-r from-blue-700 to-indigo-700 text-white hover:from-blue-600 hover:to-indigo-600'
                          : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                      }`}>
                        View All Metrics
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* UPDATED: Card 3 - Visual Dashboards & Smart Reports */}
            <div className="max-w-6xl mx-auto">
              <div className="group relative">
                {/* Multi-color Background Glow */}
                <div className="absolute -inset-0.5 sm:-inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl sm:rounded-4xl blur-2xl opacity-30 group-hover:opacity-50 transition-all duration-1000"></div>
                
                <div className={`relative rounded-3xl sm:rounded-4xl overflow-hidden border shadow-2xl ${
                  isDarkMode
                    ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-blue-800/20'
                    : 'bg-gradient-to-br from-gray-900 via-indigo-900/90 to-gray-900 border-indigo-500/20'
                }`}>
                  {/* Animated Grid Background */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0 bg-grid-white/10"></div>
                  </div>
                  
                  <div className="relative p-6 sm:p-8 md:p-10 lg:p-12">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8 md:gap-12">
                      <div className="flex-1">
                        <div className="inline-flex items-center px-4 py-2 sm:px-6 sm:py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6 sm:mb-8">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mr-2 sm:mr-3">
                            <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                          </div>
                          <span className="text-xs sm:text-sm font-semibold text-white tracking-wider">VISUAL DASHBOARDS</span>
                        </div>
                        
                        <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6">
                          <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
                            Visual Dashboards & Smart Reports
                          </span>
                        </h3>
                        
                        <p className="text-base sm:text-lg md:text-xl text-gray-300 leading-relaxed mb-6 sm:mb-8">
                          Beautiful, intuitive interfaces with real-time health metrics, automated alerts, and smart reporting for all stakeholders.
                        </p>
                        
                        {/* Feature Grid with Rounded Borders */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                          {[
                            { icon: <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />, title: "Real-time Alerts", desc: "Instant notifications for critical changes", color: "from-blue-500/20 to-blue-600/20" },
                            { icon: <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />, title: "Smart Reports", desc: "Automated PDF/CSV reports with trends", color: "from-cyan-500/20 to-cyan-600/20" },
                            { icon: <PieChart className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400" />, title: "Visual Analytics", desc: "Interactive charts and graphs", color: "from-emerald-500/20 to-emerald-600/20" },
                            { icon: <Download className="w-5 h-5 sm:w-6 sm:h-6 text-violet-400" />, title: "Data Export", desc: "Export health data in multiple formats", color: "from-violet-500/20 to-violet-600/20" }
                          ].map((feature, idx) => (
                            <div key={idx} className="group/feature">
                              <div className="flex items-center p-3 sm:p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300">
                                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mr-3 sm:mr-4 group-hover/feature:scale-110 transition-transform duration-300`}>
                                  {feature.icon}
                                </div>
                                <div>
                                  <h4 className="text-base sm:text-lg font-semibold text-white">{feature.title}</h4>
                                  <p className="text-xs sm:text-sm text-gray-400">{feature.desc}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Interactive Dashboard Preview with Rounded Borders */}
                      <div className="flex-1 relative">
                        <div className="absolute -inset-4 sm:-inset-8 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl sm:rounded-3xl blur-2xl"></div>
                        <div className="relative bg-gray-800/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-gray-700/50 p-4 sm:p-6 md:p-8">
                          {/* Dashboard Header */}
                          <div className="flex items-center justify-between mb-4 sm:mb-6 md:mb-8">
                            <div className="flex items-center">
                              <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500 mr-2 sm:mr-3 animate-pulse"></div>
                              <h4 className="text-sm sm:text-base md:text-lg font-semibold text-white">Live Health Dashboard</h4>
                            </div>
                            <div className="px-2 py-0.5 sm:px-3 sm:py-1 rounded-full bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border border-blue-500/30">
                              <span className="text-xs font-medium text-blue-300">Active</span>
                            </div>
                          </div>
                          
                          {/* Vital Signs with Proper Icons and Rounded Borders */}
                          <div className="space-y-4 sm:space-y-6">
                            {dashboardMetrics.map((item) => (
                              <div key={item.id} className="group/metric">
                                <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                                  <div className="flex items-center">
                                    <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-gray-700/50 to-gray-800/50 flex items-center justify-center mr-2 sm:mr-3">
                                      <div className="text-white">
                                        {item.icon}
                                      </div>
                                    </div>
                                    <span className="text-xs sm:text-sm text-gray-300">{item.name}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <span className="text-xs sm:text-sm font-bold text-white group-hover/metric:scale-110 transition-transform mr-2 sm:mr-3">{item.value}</span>
                                    <div className={`px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-lg text-xs font-medium ${
                                      item.status === 'Excellent' ? 'bg-emerald-500/20 text-emerald-300' :
                                      item.status === 'Good' ? 'bg-amber-500/20 text-amber-300' :
                                      item.status === 'Optimal' ? 'bg-blue-500/20 text-blue-300' :
                                      'bg-green-500/20 text-green-300'
                                    }`}>
                                      {item.status}
                                    </div>
                                  </div>
                                </div>
                                <div className="w-full h-2 sm:h-3 bg-gray-700/50 rounded-full overflow-hidden">
                                  <div 
                                    className={`h-full bg-gradient-to-r ${item.color} rounded-full transition-all duration-1000 group-hover/metric:w-full group-hover/metric:shadow-lg`}
                                    style={{ width: item.width }}
                                  ></div>
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          {/* Floating Elements with Rounded Borders */}
                          <div className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 md:-top-6 md:-right-6 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl sm:rounded-2xl p-2 sm:p-3 md:p-4 shadow-2xl animate-float-delayed border border-blue-400/30">
                            <div className="flex items-center">
                              <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 text-white mr-1 sm:mr-2" />
                              <span className="text-xs font-bold text-white">3 Alerts</span>
                            </div>
                          </div>
                          
                          <div className="absolute -bottom-3 -left-3 sm:-bottom-4 sm:-left-4 md:-bottom-6 md:-left-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl sm:rounded-2xl p-2 sm:p-3 md:p-4 shadow-2xl animate-float border border-purple-400/30">
                            <div className="flex items-center">
                              <LineChart className="w-3 h-3 sm:w-4 sm:h-4 text-white mr-1 sm:mr-2" />
                              <span className="text-xs font-bold text-white">Weekly Trends</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ELDERLY FAMILY REVIEWS SECTION */}
        <section className={`relative py-12 md:py-20 lg:py-24 overflow-hidden ${
          isDarkMode
            ? 'bg-gradient-to-b from-gray-900 to-blue-900/20'
            : 'bg-gradient-to-b from-white to-blue-50/30'
        }`}>
          {/* Animated Background */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-full h-full">
              <div className={`absolute top-20 left-10 w-48 h-48 sm:w-60 sm:h-60 md:w-72 md:h-72 rounded-full blur-3xl animate-pulse-slow ${
                isDarkMode
                  ? 'bg-gradient-to-r from-blue-500/10 to-indigo-500/10'
                  : 'bg-gradient-to-r from-blue-200/20 to-indigo-200/20'
              }`}></div>
              <div className={`absolute bottom-20 right-10 w-48 h-48 sm:w-60 sm:h-60 md:w-80 md:h-80 rounded-full blur-3xl animate-pulse-slower ${
                isDarkMode
                  ? 'bg-gradient-to-r from-purple-500/10 to-pink-500/10'
                  : 'bg-gradient-to-r from-purple-200/20 to-pink-200/20'
              }`}></div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 relative z-10">
            {/* Section Header */}
            <div className="text-center mb-12 md:mb-16">
             
              
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
                <span className={isDarkMode ? 'text-gray-100' : 'text-gray-900'}>
                  What Families Are
                </span>
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Saying</span>
              </h2>
              
              <p className={`text-lg sm:text-xl max-w-2xl mx-auto ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Hear from families who have found peace of mind through our AI-powered elderly care platform
              </p>
            </div>

            {/* Reviews Carousel */}
            <div className="max-w-6xl mx-auto">
              <div className="relative">
                {/* Main Carousel Container */}
                <div className={`relative overflow-hidden rounded-2xl sm:rounded-3xl border shadow-2xl ${
                  isDarkMode
                    ? 'bg-gradient-to-br from-gray-900/80 via-gray-800/80 to-gray-900/80 border-gray-700/50 shadow-blue-900/30 backdrop-blur-sm'
                    : 'bg-gradient-to-br from-white via-white to-blue-50/30 border-blue-100 shadow-blue-100/30'
                }`}>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 p-6 sm:p-8 md:p-12">
                    {/* Left Side - Review Content */}
                    <div className="space-y-6 sm:space-y-8">
                      {/* Review Header */}
                      <div className="flex items-start justify-between">
                        <div>
                          <div className={`inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br ${familyReviews[currentReview].color} mb-3 sm:mb-4`}>
                            {familyReviews[currentReview].icon}
                          </div>
                          <h3 className={`text-xl sm:text-2xl font-bold ${
                            isDarkMode ? 'text-gray-100' : 'text-gray-900'
                          }`}>
                            {familyReviews[currentReview].name}
                          </h3>
                          <p className={`text-sm sm:text-base ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {familyReviews[currentReview].role}
                          </p>
                        </div>
                        
                        {/* Rating Stars */}
                        <div className="flex items-center space-x-0.5 sm:space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 ${i < familyReviews[currentReview].rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-400 text-gray-400'}`}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Review Text */}
                      <div className="relative">
                        <Quote className={`absolute -top-3 -left-3 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 ${
                          isDarkMode ? 'text-blue-900/30' : 'text-blue-100/50'
                        }`} />
                        <p className={`text-base sm:text-lg md:text-xl leading-relaxed pl-2 sm:pl-4 ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          "{familyReviews[currentReview].review}"
                        </p>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 sm:gap-3 pt-2 sm:pt-4">
                        {familyReviews[currentReview].tags.map((tag, index) => (
                          <span 
                            key={index}
                            className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium hover:scale-105 transform transition-all duration-300 ${
                              isDarkMode
                                ? 'bg-gradient-to-r from-blue-900/30 to-indigo-900/30 border border-blue-800/30 text-blue-300'
                                : 'bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-blue-700'
                            }`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Navigation Dots */}
                      <div className="flex items-center space-x-2 sm:space-x-3 pt-4 sm:pt-6 md:pt-8">
                        {familyReviews.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentReview(index)}
                            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                              index === currentReview 
                                ? 'w-6 sm:w-8 bg-gradient-to-r from-blue-500 to-indigo-500' 
                                : isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-300 hover:bg-gray-400'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Right Side - Profile Images */}
                    <div className="relative">
                      {/* Main Profile Image */}
                      <div className="relative w-full aspect-square rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl">
                        <img 
                          src={familyReviews[currentReview].image} 
                          alt={familyReviews[currentReview].name}
                          className="w-full h-full object-cover transform scale-110 transition-transform duration-700"
                        />
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                        
                        {/* Floating Info Card */}
                        <div className={`absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg animate-float backdrop-blur-lg ${
                          isDarkMode
                            ? 'bg-gray-900/90 border border-gray-700/50'
                            : 'bg-white/90'
                        }`}>
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className={`text-sm sm:text-base font-bold ${
                                isDarkMode ? 'text-gray-100' : 'text-gray-900'
                              }`}>
                                Family Member
                              </h4>
                              <p className={`text-xs sm:text-sm ${
                                isDarkMode ? 'text-gray-400' : 'text-gray-600'
                              }`}>
                                Monitored for 8+ months
                              </p>
                            </div>
                            <div className="px-2 py-1 sm:px-3 sm:py-1 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs sm:text-sm font-semibold">
                              Active
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Floating Avatars */}
                      <div className={`absolute -top-2 -right-2 sm:-top-3 sm:-right-3 md:-top-4 md:-right-4 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-xl sm:rounded-2xl overflow-hidden border-4 shadow-lg animate-float-slow ${
                        isDarkMode ? 'border-gray-800' : 'border-white'
                      }`}>
                        <img 
                          src={familyReviews[(currentReview + 1) % 3].image} 
                          alt="Next review"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className={`absolute -bottom-2 -left-2 sm:-bottom-3 sm:-left-3 md:-bottom-4 md:-left-4 w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-lg sm:rounded-xl overflow-hidden border-4 shadow-lg animate-float-delayed ${
                        isDarkMode ? 'border-gray-800' : 'border-white'
                      }`}>
                        <img 
                          src={familyReviews[(currentReview + 2) % 3].image} 
                          alt="Previous review"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Navigation Buttons */}
                  <div className="absolute top-1/2 left-2 right-2 sm:left-4 sm:right-4 transform -translate-y-1/2 flex justify-between z-20">
                    <button
                      onClick={prevReview}
                      className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full backdrop-blur-lg border shadow-lg flex items-center justify-center hover:scale-110 transform transition-all duration-300 ${
                        isDarkMode
                          ? 'bg-gray-900/90 border-gray-700/50 hover:bg-gray-800'
                          : 'bg-white/90 border-blue-200 hover:bg-blue-50'
                      }`}
                    >
                      <ChevronLeft className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 ${
                        isDarkMode ? 'text-blue-400' : 'text-blue-600'
                      }`} />
                    </button>
                    <button
                      onClick={nextReview}
                      className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full backdrop-blur-lg border shadow-lg flex items-center justify-center hover:scale-110 transform transition-all duration-300 ${
                        isDarkMode
                          ? 'bg-gray-900/90 border-gray-700/50 hover:bg-gray-800'
                          : 'bg-white/90 border-blue-200 hover:bg-blue-50'
                      }`}
                    >
                      <ChevronRightIcon className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 ${
                        isDarkMode ? 'text-blue-400' : 'text-blue-600'
                      }`} />
                    </button>
                  </div>
                </div>

                {/* Stats Bar */}
                <div className="mt-8 sm:mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                  {[
                    { label: "Families Trusting AegisCare", value: "5,000+", icon: <Users className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />, bgLight: "from-blue-100 to-blue-200", bgDark: "from-gray-800 to-gray-900", colorLight: "text-blue-600", colorDark: "text-blue-400" },
                    { label: "Average Rating", value: "4.9/5", icon: <Star className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />, bgLight: "from-amber-100 to-amber-200", bgDark: "from-gray-800 to-gray-900", colorLight: "text-amber-600", colorDark: "text-amber-400" },
                    { label: "Response Time", value: "< 2min", icon: <Clock className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />, bgLight: "from-emerald-100 to-emerald-200", bgDark: "from-gray-800 to-gray-900", colorLight: "text-emerald-600", colorDark: "text-emerald-400" }
                  ].map((stat, index) => (
                    <div 
                      key={index}
                      className={`group rounded-xl sm:rounded-2xl border p-4 sm:p-6 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${
                        isDarkMode
                          ? 'bg-gray-800/50 border-gray-700 hover:shadow-blue-900/30'
                          : 'bg-white border-blue-100'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3 sm:mb-4">
                        <div className={`w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-xl bg-gradient-to-br flex items-center justify-center ${
                          isDarkMode ? stat.bgDark : stat.bgLight
                        }`}>
                          <div className={isDarkMode ? stat.colorDark : stat.colorLight}>
                            {stat.icon}
                          </div>
                        </div>
                        <div className={`text-2xl sm:text-3xl font-bold group-hover:scale-110 transition-transform ${
                          isDarkMode ? 'text-gray-100' : 'text-gray-900'
                        }`}>
                          {stat.value}
                        </div>
                      </div>
                      <p className={`text-sm sm:text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* MODERN DARK THEME FOOTER */}
        <footer className="relative bg-gradient-to-br from-gray-900 via-gray-900 to-indigo-950 overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-full h-full">
              <div className="absolute top-1/4 left-1/4 w-48 h-48 sm:w-64 sm:h-64 md:w-96 md:h-96 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-3xl"></div>
              <div className="absolute bottom-1/4 right-1/4 w-48 h-48 sm:w-64 sm:h-64 md:w-96 md:h-96 bg-gradient-to-r from-indigo-500/5 to-cyan-500/5 rounded-full blur-3xl"></div>
            </div>
            <div className="absolute inset-0 bg-grid-white/5"></div>
          </div>

          <div className="relative z-10">
            {/* Main Footer Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-12 md:py-16">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 sm:gap-10 md:gap-12">
                {/* Brand Column */}
                <div className="lg:col-span-2 space-y-6 sm:space-y-8">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <img src="/assets/logo.png" alt="AegisCare Logo" className="w-16 h-12 sm:w-20 sm:h-14 md:w-22 md:h-16" />
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-white">AegisCare</h2>
                      <p className="text-gray-400 text-sm sm:text-base">Multi AI Agentic Elderly Care Platform</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-400 text-sm sm:text-base max-w-md">
                    Empowering families and caregivers with AI-powered health monitoring for elderly loved ones. Trusted by thousands worldwide.
                  </p>
                  
                  {/* Social Links */}
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    {socialLinks.map((social, index) => (
                      <a
                        key={index}
                        href={social.href}
                        className="group w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-xl bg-gray-800/50 backdrop-blur-lg border border-gray-700 flex items-center justify-center hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:scale-110 transform transition-all duration-300"
                        aria-label={social.label}
                      >
                        <div className="text-gray-400 group-hover:text-white transition-colors">
                          {social.icon}
                        </div>
                      </a>
                    ))}
                  </div>
                </div>

                {/* Links Columns */}
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:col-span-3 gap-4 sm:gap-6 md:gap-8">
                  {Object.entries(footerLinks).map(([category, links]) => (
                    <div key={category} className="space-y-3 sm:space-y-4">
                      <h3 className="text-base sm:text-lg font-semibold text-white capitalize">
                        {category}
                      </h3>
                      <ul className="space-y-2 sm:space-y-3">
                        {links.map((link, index) => (
                          <li key={index}>
                            <a
                              href="#"
                              className="text-gray-400 hover:text-white flex items-center group transition-all duration-300 text-sm sm:text-base"
                            >
                              <ArrowRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-all" />
                              <span className="group-hover:translate-x-1 transition-transform">
                                {link}
                              </span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className="my-8 sm:my-10 md:my-12 border-t border-gray-800"></div>

              {/* Bottom Bar */}
              <div className="flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6">
                {/* Contact Info */}
                <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 md:gap-6 lg:gap-8">
                  <div className="flex items-center space-x-2 sm:space-x-3 text-gray-400 text-sm sm:text-base">
                    <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>+923244519323</span>
                  </div>
                  <div className="flex items-center space-x-2 sm:space-x-3 text-gray-400 text-sm sm:text-base">
                    <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>support@aegiscare.com</span>
                  </div>
                  <div className="flex items-center space-x-2 sm:space-x-3 text-gray-400 text-sm sm:text-base">
                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Lahore,Pakistan</span>
                  </div>
                </div>

                {/* Copyright & Additional Links */}
                <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 md:gap-6">
                  <div className="text-gray-500 text-xs sm:text-sm">
                    © 2025 AegisCare. All rights reserved.
                  </div>
                  
                </div>
              </div>

              {/* Trust Badges */}
              <div className="mt-8 sm:mt-10 md:mt-12 flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6 lg:gap-8">
                {[
                  { label: "HIPAA Compliant", icon: <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" /> },
                  { label: "ISO 27001 Certified", icon: <Shield className="w-5 h-5 sm:w-6 sm:h-6" /> },
                  { label: "GDPR Ready", icon: <Globe className="w-5 h-5 sm:w-6 sm:h-6" /> }
                ].map((badge, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-full bg-gray-800/50 backdrop-blur-lg border border-gray-700 group hover:bg-gradient-to-r hover:from-blue-900/30 hover:to-purple-900/30 transition-all duration-300"
                  >
                    <div className="text-blue-400 group-hover:text-white">
                      {badge.icon}
                    </div>
                    <span className="text-gray-300 group-hover:text-white text-xs sm:text-sm font-medium">
                      {badge.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTA Banner */}
              <div className="mt-12 md:mt-16 relative rounded-xl sm:rounded-2xl md:rounded-3xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-indigo-600/20"></div>
                <div className="relative bg-gradient-to-r from-gray-800/50 via-gray-900/50 to-gray-800/50 backdrop-blur-lg border border-gray-700/50 p-6 sm:p-8 md:p-10 lg:p-12">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6 md:gap-8">
                    <div className="space-y-3 sm:space-y-4">
                      <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white">
                        Start Your Care Journey Today
                      </h3>
                      <p className="text-gray-300 text-sm sm:text-base max-w-2xl">
                        Join thousands of families who trust AegisCare for their elderly loved ones' health monitoring.
                      </p>
                    </div>
                    <button onClick={() => navigate('/login')} className="group px-6 py-3 sm:px-7 sm:py-3.5 md:px-8 md:py-4 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-xl hover:shadow-2xl hover:scale-105 transform transition-all duration-300 flex items-center space-x-2 sm:space-x-3">
                      <span className="text-sm sm:text-base">Get Started Free</span>
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-2 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </footer>

        {/* Add custom animations */}
        <style jsx>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
          @keyframes float-slow {
            0%, 100% { transform: translateY(0px) rotate(3deg); }
            50% { transform: translateY(-15px) rotate(3deg); }
          }
          @keyframes float-delayed {
            0%, 100% { transform: translateY(0px) scale(1); }
            50% { transform: translateY(-25px) scale(1.05); }
          }
          @keyframes float-slower {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
          @keyframes float-delayed-2 {
            0%, 100% { transform: translateY(0px) scale(1); }
            50% { transform: translateY(-20px) scale(1.03); }
          }
          @keyframes dnaSpin {
            0% { opacity: 0.3; }
            50% { opacity: 0.8; }
            100% { opacity: 0.3; }
          }
          @keyframes pulse-slow {
            0%, 100% { opacity: 0.1; }
            50% { opacity: 0.3; }
          }
          @keyframes pulse-slower {
            0%, 100% { opacity: 0.05; }
            50% { opacity: 0.15; }
          }
          @keyframes typing {
            from { width: 0; }
            to { width: 100%; }
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
          @keyframes pulse-glow {
            0%, 100% { box-shadow: 0 0 20px rgba(255, 255, 255, 0.1); }
            50% { box-shadow: 0 0 40px rgba(255, 255, 255, 0.3); }
          }
          @keyframes pulse-glow-slow {
            0%, 100% { box-shadow: 0 0 40px rgba(255, 255, 255, 0.05); }
            50% { box-shadow: 0 0 80px rgba(255, 255, 255, 0.15); }
          }
          @keyframes float-particle {
            0%, 100% { transform: translateY(0) translateX(0); opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { transform: translateY(-100px) translateX(20px); opacity: 0; }
          }
          @keyframes ping-pulse {
            0%, 100% { transform: scale(1); opacity: 0.6; }
            50% { transform: scale(1.5); opacity: 1; }
          }
          @keyframes fade-in-up {
            0% { opacity: 0; transform: translateY(10px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes spin-slower {
            from { transform: rotate(0deg); }
            to { transform: rotate(-360deg); }
          }
          @keyframes slideDown {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
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
          .animate-float-delayed-2 {
            animation: float-delayed-2 6s ease-in-out infinite 0.5s;
          }
          .animate-float-slower {
            animation: float-slower 9s ease-in-out infinite;
          }
          .animate-pulse-slow {
            animation: pulse-slow 3s ease-in-out infinite;
          }
          .animate-pulse-slower {
            animation: pulse-slower 4s ease-in-out infinite;
          }
          .animate-typing {
            overflow: hidden;
            border-right: 2px solid;
            white-space: nowrap;
            animation: typing 3.5s steps(40, end), blink-caret 0.75s step-end infinite;
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
          .bg-grid-white\/10 {
            background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(255, 255, 255 / 0.1)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e");
          }
          .bg-grid-white\/5 {
            background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(255, 255, 255 / 0.05)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e");
          }
          .bg-grid-blue-500\/5 {
            background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(59 130 246 / 0.05)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e");
          }
        `}</style>
      </div>
    </>
  );
};

export default LandingPage;