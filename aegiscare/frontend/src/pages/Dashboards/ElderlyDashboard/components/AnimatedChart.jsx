import React, { useState } from 'react';

const AnimatedChart = ({ isDarkMode }) => {
    const [chartData] = useState({
      heartRate: [72, 74, 73, 72, 70, 68, 72, 75, 76, 74, 72, 71],
      bloodPressure: [120, 122, 118, 119, 121, 120, 118, 122, 124, 121, 120, 119],
      glucose: [110, 115, 112, 108, 105, 110, 115, 118, 116, 112, 110, 108]
    });

    const hours = ['6AM', '8AM', '10AM', '12PM', '2PM', '4PM', '6PM', '8PM', '10PM', '12AM', '2AM', '4AM'];

    return (
      <div className="relative h-64">
        <div className="absolute inset-0">
          {/* Grid Lines */}
          <div className="absolute inset-0 flex flex-col justify-between">
            {[...Array(6)].map((_, i) => (
              <div key={i} className={`h-px w-full ${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-200'}`}></div>
            ))}
          </div>
          
          {/* Chart Lines */}
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Heart Rate Line */}
            <defs>
              <linearGradient id="heartRateGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f472b6" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#db2777" stopOpacity="0.2" />
              </linearGradient>
              <linearGradient id="bpGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.2" />
              </linearGradient>
              <linearGradient id="glucoseGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#059669" stopOpacity="0.2" />
              </linearGradient>
            </defs>

            {/* Heart Rate Path */}
            <path
              d={`M0,${100 - chartData.heartRate[0]} ${chartData.heartRate.map((val, i) => `L${(i / (chartData.heartRate.length - 1)) * 100},${100 - val}`).join(' ')}`}
              fill="none"
              stroke="url(#heartRateGradient)"
              strokeWidth="2"
              strokeLinecap="round"
              className="animate-draw"
            >
              <animate
                attributeName="stroke-dasharray"
                from="0, 1000"
                to="1000, 0"
                dur="2s"
                fill="freeze"
              />
            </path>

            {/* Blood Pressure Path */}
            <path
              d={`M0,${100 - chartData.bloodPressure[0]/1.5} ${chartData.bloodPressure.map((val, i) => `L${(i / (chartData.bloodPressure.length - 1)) * 100},${100 - val/1.5}`).join(' ')}`}
              fill="none"
              stroke="url(#bpGradient)"
              strokeWidth="2"
              strokeLinecap="round"
              className="animate-draw"
              style={{ animationDelay: '0.5s' }}
            >
              <animate
                attributeName="stroke-dasharray"
                from="0, 1000"
                to="1000, 0"
                dur="2s"
                begin="0.5s"
                fill="freeze"
              />
            </path>

            {/* Glucose Path */}
            <path
              d={`M0,${100 - chartData.glucose[0]/1.2} ${chartData.glucose.map((val, i) => `L${(i / (chartData.glucose.length - 1)) * 100},${100 - val/1.2}`).join(' ')}`}
              fill="none"
              stroke="url(#glucoseGradient)"
              strokeWidth="2"
              strokeLinecap="round"
              className="animate-draw"
              style={{ animationDelay: '1s' }}
            >
              <animate
                attributeName="stroke-dasharray"
                from="0, 1000"
                to="1000, 0"
                dur="2s"
                begin="1s"
                fill="freeze"
              />
            </path>
          </svg>

          {/* Time Labels */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2">
            {hours.map((hour, i) => (
              <div key={i} className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                {hour}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className={`absolute top-2 left-2 flex gap-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>
            <div className="flex items-center gap-1">
              <div className="w-3 h-0.5 bg-rose-500"></div>
              <span className="text-xs">Heart Rate</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-0.5 bg-blue-500"></div>
              <span className="text-xs">Blood Pressure</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-0.5 bg-emerald-500"></div>
              <span className="text-xs">Glucose</span>
            </div>
          </div>

          {/* Animated Dots */}
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-rose-500 rounded-full animate-pulse"></div>
          <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-emerald-500 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
      </div>
    );
  };

export default AnimatedChart;
