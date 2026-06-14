import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  HeartPulse, Users, Shield, Target, Globe, Star, 
  TrendingUp, Award, Clock, Zap, ChevronRight,
  Heart, Activity, Brain, Cpu, Sparkles, Gem,
  BarChart3, CheckCircle, ArrowRight
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const AboutUs = ({ isDarkMode, onToggleDarkMode }) => {
  const [visible, setVisible] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setVisible(true);
  }, []);

  // Stats Data
  const stats = [
    { value: '5,000+', label: 'Families Protected', icon: <Heart className="w-4 h-4" /> },
    { value: '99.8%', label: 'Accuracy Rate', icon: <CheckCircle className="w-4 h-4" /> },
    { value: '24/7', label: 'Monitoring', icon: <Clock className="w-4 h-4" /> },
    { value: '<2min', label: 'Response Time', icon: <Zap className="w-4 h-4" /> },
  ];

  // Team Members
  const team = [
 
  {
    name: 'Dr. Ammar Rafiq',
    role: 'FYP Supervisor & Associate Professor',
    image: '/assets/lecturer.jpg',
    bio: 'Associate Professor in Computer Science Department, FAST NUCES. Specializes in AI, Machine Learning, and Software Engineering.',
    color: 'from-indigo-500 to-purple-500'
  },
  {
    name: 'Umer Abdullah Shah',
    role: 'FYP Member - Web Developer',
    image: '/assets/umer.jpg',
    bio: 'Bachelors in Computer Science student at FAST NUCES. Specializes in full-stack development and AI integration.',
    color: 'from-green-500 to-emerald-500'
  },
  {
    name: 'Abu Bakar Waseem',
    role: 'FYP Member - AI Specialist',
    image: '/assets/bakar.jpg',
    bio: 'Bachelors in Computer Science student at FAST NUCES. Expert in machine learning models and data analytics.',
    color: 'from-red-500 to-rose-500'
  },
  {
    name: 'Ayesha Ashfaq',
    role: 'FYP Member - Software Engineer',
    image: '/assets/ayesha.jpg',
    bio: 'Bachelors in Computer Science student at FAST NUCES. Focuses on UI/UX design and frontend technologies.',
    color: 'from-pink-500 to-fuchsia-500'
  }
];

  // Values
  const values = [
    {
      icon: <HeartPulse className="w-8 h-8" />,
      title: 'Compassionate Care',
      description: 'Treating every elderly individual with dignity, respect, and personalized attention.',
      color: 'from-red-500 to-pink-600'
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: 'AI with Ethics',
      description: 'Responsible AI development prioritizing safety, privacy, and human oversight.',
      color: 'from-blue-500 to-indigo-600'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Uncompromising Security',
      description: 'Military-grade encryption and HIPAA compliance for all health data.',
      color: 'from-emerald-500 to-green-600'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Family First',
      description: 'Empowering families with tools and insights for better care decisions.',
      color: 'from-purple-500 to-violet-600'
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
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className={`absolute inset-0 ${
            isDarkMode ? 'bg-grid-white/5' : 'bg-grid-blue-500/5'
          }`}></div>
          <div className={`absolute top-0 left-0 w-64 h-64 md:w-96 md:h-96 rounded-full blur-3xl animate-pulse-slow ${
            isDarkMode ? 'bg-blue-500/10' : 'bg-blue-500/20'
          }`}></div>
          <div className={`absolute bottom-0 right-0 w-64 h-64 md:w-96 md:h-96 rounded-full blur-3xl animate-pulse-slower ${
            isDarkMode ? 'bg-purple-500/10' : 'bg-purple-500/20'
          }`}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 relative z-10">
          <div className={`text-center mb-12 md:mb-16 transition-all duration-700 transform ${
            visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
              <span className={isDarkMode ? 'text-gray-100' : 'text-gray-900'}>
                Revolutionizing Elderly Care
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                with AI Compassion
              </span>
            </h1>
            
            <p className={`text-lg sm:text-xl max-w-3xl mx-auto mb-8 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Founded in 2023, AegisCare combines cutting-edge AI technology with deep human understanding to transform how we care for our elderly loved ones.
            </p>
          </div>

          {/* Stats Grid */}
          <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-16 transition-all duration-700 delay-300 transform ${
            visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            {stats.map((stat, index) => (
              <div 
                key={index}
                className={`group rounded-2xl border p-6 backdrop-blur-lg hover:scale-105 transform transition-all duration-300 ${
                  isDarkMode
                    ? 'bg-gray-900/50 border-gray-700/50 hover:shadow-blue-900/30'
                    : 'bg-white/80 border-blue-100 hover:shadow-blue-200/50'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    isDarkMode 
                      ? 'bg-gradient-to-br from-blue-900/30 to-purple-900/30'
                      : 'bg-gradient-to-br from-blue-100 to-purple-100'
                  }`}>
                    <div className={isDarkMode ? 'text-blue-400' : 'text-blue-600'}>
                      {stat.icon}
                    </div>
                  </div>
                  <div className={`text-2xl md:text-3xl font-bold ${
                    isDarkMode ? 'text-gray-100' : 'text-gray-900'
                  }`}>
                    {stat.value}
                  </div>
                </div>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-12 md:gap-16 items-center">
            {/* Left Content */}
            <div className={`space-y-6 transition-all duration-700 delay-100 transform ${
              visible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
            }`}>
             
              
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">
                <span className={isDarkMode ? 'text-gray-100' : 'text-gray-900'}>
                  Empowering Families,
                </span>
                <br />
                <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Protecting Elders
                </span>
              </h2>
              
              <p className={`text-lg leading-relaxed ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                We believe every elderly individual deserves dignity, safety, and the best possible care. 
                Our AI-driven platform bridges the gap between families and healthcare providers, 
                offering peace of mind through continuous monitoring and intelligent insights.
              </p>
              
              <div className="space-y-4 pt-4">
                {[
                  'Real-time health monitoring for 50+ biomarkers',
                  'Predictive AI for early risk detection',
                  'Unified dashboard for families and doctors',
                  '24/7 emergency alert system'
                ].map((item, index) => (
                  <div key={index} className="flex items-center">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                      isDarkMode 
                        ? 'bg-emerald-900/30 border border-emerald-800/30'
                        : 'bg-emerald-100 border border-emerald-200'
                    }`}>
                      <CheckCircle className={`w-3 h-3 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
                    </div>
                    <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - Animated Visualization */}
            <div className={`relative transition-all duration-700 delay-300 transform ${
              visible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
            }`}>
              <div className="relative w-full h-64 sm:h-80 md:h-96 rounded-3xl overflow-hidden">
                {/* Animated Circles */}
                <div className="absolute inset-0">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className={`absolute inset-0 border-2 rounded-full animate-spin-slow ${
                        isDarkMode ? 'border-blue-500/20' : 'border-blue-300/30'
                      }`}
                      style={{
                        transform: `scale(${0.7 + i * 0.3})`,
                        animationDuration: `${20 + i * 5}s`,
                        animationDirection: i % 2 === 0 ? 'normal' : 'reverse'
                      }}
                    ></div>
                  ))}
                </div>
                
                {/* Central Icon */}
                <div className={`absolute inset-0 flex items-center justify-center ${
                  isDarkMode ? 'bg-gradient-to-br from-gray-900/50 to-gray-800/50' : 'bg-white/50'
                } backdrop-blur-lg rounded-3xl border ${
                  isDarkMode ? 'border-gray-700/50' : 'border-blue-100'
                }`}>
                  <div className={`w-32 h-32 md:w-40 md:h-40 rounded-full flex items-center justify-center shadow-2xl animate-pulse ${
                    isDarkMode
                      ? 'bg-gradient-to-br from-emerald-700 to-teal-800'
                      : 'bg-gradient-to-br from-emerald-500 to-teal-600'
                  }`}>
                    <Heart className="w-16 h-16 md:w-20 md:h-20 text-white" />
                  </div>
                </div>

                {/* Floating Elements */}
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className={`absolute w-12 h-12 md:w-16 md:h-16 rounded-xl flex items-center justify-center shadow-lg animate-float ${
                      isDarkMode ? 'text-white bg-gray-800/80 border border-gray-700/50' : 'bg-white border border-blue-100'
                    }`}
                    style={{
                      top: `${20 + i * 20}%`,
                      left: `${10 + i * 20}%`,
                      animationDelay: `${i * 0.5}s`
                    }}
                  >
                    {[<Activity />, <Brain />, <Cpu />, <BarChart3 />][i]}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
              <span className={isDarkMode ? 'text-gray-100' : 'text-gray-900'}>
                Our Core
              </span>
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {' '}Values
              </span>
            </h2>
            <p className={`text-lg sm:text-xl max-w-3xl mx-auto ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Guiding principles that shape every feature, every decision, and every interaction
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {values.map((value, index) => (
              <div 
                key={index}
                className={`group rounded-2xl border p-6 md:p-8 hover:scale-105 transform transition-all duration-500 ${
                  isDarkMode
                    ? 'bg-gradient-to-br from-gray-900/50 via-gray-800/50 to-gray-900/50 border-gray-700/50 hover:shadow-xl hover:shadow-blue-900/20'
                    : 'bg-gradient-to-br from-white via-white to-blue-50/30 border-blue-100 hover:shadow-xl hover:shadow-blue-200/30'
                }`}
              >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 bg-gradient-to-br ${value.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <div className="text-white">
                    {value.icon}
                  </div>
                </div>
                
                <h3 className={`text-xl font-bold mb-3 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                  {value.title}
                </h3>
                
                <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="text-center mb-12 md:mb-16">
            
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
              <span className={isDarkMode ? 'text-gray-100' : 'text-gray-900'}>
                World-Class
              </span>
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {' '}Leadership
              </span>
            </h2>
            
            <p className={`text-lg sm:text-xl max-w-3xl mx-auto ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Experts in healthcare, AI, and technology united by a common mission
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {team.map((member, index) => (
              <div 
                key={index}
                className="group relative"
              >
                <div className={`absolute -inset-0.5 bg-gradient-to-r ${member.color} rounded-3xl blur opacity-70 group-hover:opacity-100 transition-all duration-500`}></div>
                <div className={`relative rounded-3xl overflow-hidden border backdrop-blur-lg ${
                  isDarkMode
                    ? 'bg-gray-900/80 border-gray-700/50'
                    : 'bg-white border-blue-100'
                }`}>
                  {/* Image */}
                  <div className="relative h-48 md:h-56 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent z-10"></div>
                    <div className={`absolute inset-0 bg-gradient-to-br ${member.color} opacity-20`}></div>
                    {/* Placeholder for image - in real app, use actual images */}
                    <div className={`w-full h-full flex items-center justify-center ${
                      isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
                    }`}>
                      <div className={`w-20 h-20 rounded-full flex items-center justify-center bg-gradient-to-br ${member.color}`}>
                        <Users className="w-10 h-10 text-white" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-6">
                    <h3 className={`text-lg font-bold mb-1 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                      {member.name}
                    </h3>
                    <p className={`text-sm font-medium mb-3 bg-gradient-to-r ${member.color} bg-clip-text text-transparent`}>
                      {member.role}
                    </p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {member.bio}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          <div className={`rounded-3xl overflow-hidden border ${
            isDarkMode
              ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-blue-800/20'
              : 'bg-gradient-to-br from-white via-blue-50/30 to-white border-blue-200'
          }`}>
            <div className="relative p-8 md:p-12 lg:p-16">
              {/* Animated Background */}
              <div className="absolute inset-0">
                <div className={`absolute inset-0 ${
                  isDarkMode ? 'bg-grid-white/5' : 'bg-grid-blue-500/5'
                }`}></div>
                <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl animate-pulse-slow ${
                  isDarkMode ? 'bg-blue-500/10' : 'bg-blue-500/20'
                }`}></div>
              </div>
              
              <div className="relative z-10 text-center">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
                  <span className={isDarkMode ? 'text-gray-100' : 'text-gray-900'}>
                    Join Our Mission
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Transform Elderly Care
                  </span>
                </h2>
                
                <p className={`text-lg sm:text-xl max-w-3xl mx-auto mb-8 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Be part of the revolution in elderly care. Whether you're a family member, 
                  caregiver, or healthcare provider, we're here to help.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button onClick={() => navigate('/login')} className={`group px-8 py-4 rounded-full font-semibold shadow-xl hover:shadow-2xl hover:scale-105 transform transition-all duration-300 flex items-center justify-center ${
                    isDarkMode
                      ? 'bg-gradient-to-r from-blue-700 to-indigo-700 text-white hover:from-blue-600 hover:to-indigo-600'
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                  }`}>
                    Get Started Free
                    <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
                  </button>
                  
                  <button onClick={() => navigate('/contact-us')} className={`px-8 py-4 rounded-full border-2 font-semibold hover:scale-105 transform transition-all duration-300 ${
                    isDarkMode
                      ? 'border-blue-800/30 bg-gray-800/50 text-blue-300 hover:bg-gray-800/80'
                      : 'border-blue-200 bg-white text-blue-700 hover:bg-blue-50'
                  }`}>
                    Contact Here
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer isDarkMode={isDarkMode} />
    </div>
  );
};

export default AboutUs;