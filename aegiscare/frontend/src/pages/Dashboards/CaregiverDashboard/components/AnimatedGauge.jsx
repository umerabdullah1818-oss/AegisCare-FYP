import React from 'react';

const AnimatedGauge = ({ value, max = 100, color = 'blue', size = 80, label = '', showPulse = false, isDarkMode }) => {
  const percentage = (value / max) * 100;
  const radius = size / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  const colorMap = {
    blue: isDarkMode ? '#3b82f6' : '#2563eb',
    emerald: isDarkMode ? '#10b981' : '#059669',
    purple: isDarkMode ? '#8b5cf6' : '#7c3aed',
    amber: isDarkMode ? '#f59e0b' : '#d97706',
    rose: isDarkMode ? '#f472b6' : '#e11d48',
    indigo: isDarkMode ? '#6366f1' : '#4f46e5',
    cyan: isDarkMode ? '#06b6d4' : '#0891b2',
    green: isDarkMode ? '#22c55e' : '#16a34a',
    teal: isDarkMode ? '#14b8a6' : '#0d9488',
    violet: isDarkMode ? '#8b5cf6' : '#7c3aed',
    sky: isDarkMode ? '#0ea5e9' : '#0284c7',
    pink: isDarkMode ? '#ec4899' : '#db2777',
    fuchsia: isDarkMode ? '#d946ef' : '#c026d3',
    lime: isDarkMode ? '#84cc16' : '#65a30d',
    orange: isDarkMode ? '#f97316' : '#ea580c'
  };

  const getColor = () => colorMap[color] ? colorMap[color] : colorMap.blue;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          cx={radius}
          cy={radius}
          r={radius - 4}
          stroke="currentColor"
          strokeWidth="8"
          fill="none"
          className="text-gray-200 dark:text-gray-800 transition-all duration-300"
        />
        <circle
          cx={radius}
          cy={radius}
          r={radius - 4}
          stroke={getColor()}
          strokeWidth="8"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
          style={{ 
            animation: showPulse ? 'pulse 2s infinite' : 'none'
          }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className={`text-lg font-bold bg-gradient-to-r from-current to-current bg-clip-text text-transparent`}
               style={{ color: getColor() }}>
            {value}
          </div>
          {label && (
            <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {label}
            </div>
          )}
        </div>
      </div>
      {showPulse && (
        <div className="absolute inset-0 rounded-full animate-ping"
             style={{ backgroundColor: getColor(), opacity: 0.2 }}></div>
      )}
    </div>
  );
};

export default AnimatedGauge;
