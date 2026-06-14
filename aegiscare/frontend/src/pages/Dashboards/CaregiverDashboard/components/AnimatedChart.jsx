import React from 'react';

const AnimatedChart = ({ data, labels, colors = ['#3b82f6', '#10b981', '#8b5cf6'], height = 200, type = 'line', isDarkMode }) => {
  const maxValue = Math.max(...data.flat());
  
  return (
    <div className="relative h-64">
      <div className="absolute inset-0">
        {/* Animated Grid Lines */}
        <div className="absolute inset-0 flex flex-col justify-between">
          {[...Array(6)].map((_, i) => (
            <div 
              key={i} 
              className={`h-px w-full ${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-200'} transition-all duration-1000`}
              style={{ animationDelay: `${i * 100}ms` }}
            ></div>
          ))}
        </div>
        
        {/* Chart Container */}
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            {colors.map((color, idx) => (
              <linearGradient key={idx} id={`gradient${idx}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={color} stopOpacity="0.8" />
                <stop offset="100%" stopColor={color} stopOpacity="0.2" />
              </linearGradient>
            ))}
          </defs>

          {data.map((dataset, idx) => {
            if (type === 'line') {
              return (
                <path
                  key={idx}
                  d={`M0,${100 - dataset[0]} ${dataset.map((val, i) => `L${(i / (dataset.length - 1)) * 100},${100 - val}`).join(' ')}`}
                  fill="none"
                  stroke={`url(#gradient${idx})`}
                  strokeWidth="2"
                  strokeLinecap="round"
                  className="animate-draw"
                  style={{ 
                    animationDelay: `${idx * 0.5}s`,
                  }}
                />
              );
            } else if (type === 'bar') {
              return dataset.map((val, i) => (
                <rect
                  key={`${idx}-${i}`}
                  x={`${(i / dataset.length) * 100 + 2}%`}
                  y={`${100 - val}%`}
                  width={`${80 / dataset.length}%`}
                  height={`${val}%`}
                  fill={`url(#gradient${idx})`}
                  className="animate-grow"
                  style={{ 
                    animationDelay: `${i * 0.1}s`,
                    animationDuration: '1s'
                  }}
                />
              ));
            }
          })}
        </svg>

        {/* Animated Dots */}
        {type === 'line' && data.map((dataset, idx) => (
          dataset.map((val, i) => (
            <div
              key={`dot-${idx}-${i}`}
              className="absolute w-3 h-3 rounded-full animate-pulse border-2 border-white dark:border-gray-900"
              style={{
                backgroundColor: colors[idx],
                animationDelay: `${(idx * 0.5 + i * 0.1)}s`,
                top: `${100 - val}%`,
                left: `${(i / (dataset.length - 1)) * 100}%`,
                transform: 'translate(-50%, -50%)',
                boxShadow: `0 0 20px ${colors[idx]}`
              }}
            ></div>
          ))
        ))}

        {/* Time Labels with Animation */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2">
          {labels.map((label, i) => (
            <div 
              key={i} 
              className={`text-xs transition-all duration-500 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}
              style={{ animationDelay: `${i * 0.2}s` }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnimatedChart;
