import React from 'react';

const AnimatedGauge = ({ value, max = 100, color = 'rose', size = 80, isDarkMode }) => {
    const percentage = (value / max) * 100;
    const radius = size / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;
    
    const colorMap = {
      rose: isDarkMode ? '#f472b6' : '#e11d48',
      emerald: isDarkMode ? '#10b981' : '#059669',
      blue: isDarkMode ? '#3b82f6' : '#2563eb',
      amber: isDarkMode ? '#f59e0b' : '#d97706',
      purple: isDarkMode ? '#8b5cf6' : '#7c3aed',
      indigo: isDarkMode ? '#6366f1' : '#4f46e5',
      orange: isDarkMode ? '#f97316' : '#ea580c'
    };

    return (
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size}>
          {/* Background circle */}
          <circle
            cx={radius}
            cy={radius}
            r={radius - 4}
            stroke={isDarkMode ? '#1f2937' : '#e5e7eb'}
            strokeWidth="8"
            fill="none"
            className="transition-all duration-300"
          />
          {/* Progress circle */}
          <circle
            cx={radius}
            cy={radius}
            r={radius - 4}
            stroke={colorMap[color]}
            strokeWidth="8"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className={`text-lg font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
              {value}
            </div>
          </div>
        </div>
      </div>
    );
  };

export default AnimatedGauge;
