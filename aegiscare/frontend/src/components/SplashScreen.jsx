// src/components/SplashScreen.jsx
import React, { useState, useEffect } from 'react';

const SplashScreen = ({ userRole, userName, onFinish, isDarkMode }) => {
  const [displayText, setDisplayText] = useState('');
  const [charIndex, setCharIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const [loadingDots, setLoadingDots] = useState(0);
  
  // Role display names with colors
  const roleConfig = {
    elderly: {
      title: 'Elderly Dashboard',
      textColor: 'from-rose-500 to-pink-600',
      loadingColor: 'bg-gradient-to-r from-rose-500 to-pink-600'
    },
    
    doctor: {
      title: 'Doctor Dashboard',
      textColor: 'from-emerald-500 to-teal-600',
      loadingColor: 'bg-gradient-to-r from-emerald-500 to-teal-600'
    },
    caregiver: {
      title: 'Caregiver Dashboard',
      textColor: 'from-amber-500 to-orange-600',
      loadingColor: 'bg-gradient-to-r from-amber-500 to-orange-600'
    },
    admin: {
      title: 'Admin Dashboard',
      textColor: 'from-purple-500 to-violet-600',
      loadingColor: 'bg-gradient-to-r from-purple-500 to-violet-600'
    }
  };

  const config = roleConfig[userRole] || roleConfig.elderly;
  const greeting = `Welcome${userRole === 'doctor' ? ', Dr.' : userName ? ', ' + userName : ''} to ${config.title}`;

  // Smooth typewriter effect
  useEffect(() => {
    if (charIndex < greeting.length) {
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + greeting[charIndex]);
        setCharIndex(prev => prev + 1);
      }, 80); // Adjust speed here (lower = faster)

      return () => clearTimeout(timer);
    }
  }, [charIndex, greeting]);

  // Cursor blink effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, []);

  // Loading dots animation
  useEffect(() => {
    const dotsInterval = setInterval(() => {
      setLoadingDots(prev => (prev + 1) % 4);
    }, 400);

    return () => clearInterval(dotsInterval);
  }, []);

  // Total splash screen duration: 4 seconds
  useEffect(() => {
    const splashTimer = setTimeout(() => {
      onFinish();
    }, 4000);

    return () => clearTimeout(splashTimer);
  }, [onFinish]);

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center overflow-hidden transition-all duration-500 ${
      isDarkMode
        ?  'bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-950'
              : 'bg-gradient-to-br from-blue-200 via-indigo-100 to-purple-200'
    }`}>
      {/* Animated Background Elements - Matching Landing Page */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated Grid */}
        <div className={`absolute inset-0 ${
          isDarkMode ? 'bg-grid-white/5' : 'bg-grid-blue-500/5'
        }`}></div>
        
        {/* Floating Particles - SLOWED DOWN */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-1.5 h-1.5 rounded-full animate-float-particle-very-slow ${
              isDarkMode ? 'bg-blue-500/20' : 'bg-blue-400/10'
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 1.5}s`, // Increased delay
              animationDuration: `${15 + Math.random() * 10}s` // Slower duration
            }}
          ></div>
        ))}
        
        {/* Animated Orbs */}
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

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center px-4">
        {/* Logo Container - Your original logo */}
        <div className="relative mb-12">
          <div className="relative w-48 h-48 rounded-3xl flex items-center justify-center animate-logo-pulse">
            <img 
              src="/assets/fulllogo.png" 
              alt="AegisCare Logo" 
              className="w-full h-full object-contain rounded-3xl" 
            />
            <div className="absolute inset-0 rounded-full border-2 border-blue-400/30 animate-ring-expand-4-5s"></div>
            <div className="absolute inset-0 rounded-full border-2 border-cyan-400/20 animate-ring-expand-delayed-4-5s"></div>
          </div>
        </div>
        
        {/* Greeting Text with Smooth Typewriter Effect */}
        <div className="text-center max-w-2xl mb-12">
          <div className="h-20 flex items-center justify-center mb-4">
            <h1 className={`text-3xl md:text-4xl font-bold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              <span className={`bg-gradient-to-r ${config.textColor} bg-clip-text text-transparent`}>
                {displayText}
              </span>
              <span className={`inline-block w-[2px] h-10 ml-1 ${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300 ${
                isDarkMode ? 'bg-white' : 'bg-blue-600'
              }`}></span>
            </h1>
          </div>
          
          {/* Subtitle */}
          <p className={`text-lg ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Multi AI Agentic Elderly Care Platform
          </p>
        </div>
        
        {/* Modern Loading Indicator - Fixed Height Container */}
        <div className="mt-8">
          <div className="flex flex-col items-center space-y-4">
           
            
            {/* Fixed Height Container for Loading Bars */}
            <div className="relative h-16 flex items-end justify-center space-x-2 px-4">
              {/* This container has fixed height so bars don't move other elements */}
              <div className="absolute bottom-0 flex items-end space-x-2">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="relative"
                  >
                    {/* Background bar (static) */}
                    <div className={`w-4 h-16 rounded-t-lg ${
                      isDarkMode ? 'bg-gray-800/30' : 'bg-gradient-to-br from-indigo-100 to-purple-200'
                    }`}></div>
                    
                    {/* Animated bar (within static container) */}
                    <div 
                      className={`absolute bottom-0 left-0 w-4 rounded-t-lg ${config.loadingColor} animate-wave-fixed`}
                      style={{
                        animationDelay: `${i * 0.15}s`,
                        height: '100%',
                        transformOrigin: 'bottom'
                      }}
                    ></div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Loading status */}
            <div className={`text-xs mt-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Secured Connection • AI Initialized
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes float-particle-very-slow {
          0%, 100% { 
            transform: translateY(0) translateX(0); 
            opacity: 0; 
          }
          10% { 
            opacity: 0.6; 
          }
          90% { 
            opacity: 0.6; 
          }
          100% { 
            transform: translateY(-60px) translateX(15px); 
            opacity: 0; 
          }
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
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.03); opacity: 0.95; }
        }
        @keyframes ring-expand-4-5s {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(1.2); opacity: 0; }
        }
        @keyframes ring-expand-delayed-4-5s {
          0% { transform: scale(1); opacity: 0.7; }
          100% { transform: scale(1.4); opacity: 0; }
        }
        @keyframes wave-fixed {
          0%, 100% { 
            height: 20%;
            opacity: 0.8;
          }
          50% { 
            height: 100%;
            opacity: 1;
          }
        }
        .animate-float-particle-very-slow {
          animation: float-particle-very-slow linear infinite;
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
        .animate-wave-fixed {
          animation: wave-fixed 1.2s ease-in-out infinite;
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

export default SplashScreen;