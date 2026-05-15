import React, { useState, useEffect, useRef } from 'react';

const AnimatedChart = ({ isDarkMode, hr = 72, sbp = 120, gl = 110 }) => {
    const [chartData, setChartData] = useState({
      heartRate: Array(12).fill(hr),
      bloodPressure: Array(12).fill(sbp),
      glucose: Array(12).fill(gl)
    });
    const intervalRef = useRef(null);

    // Generate realistic variation around a base value
    const vary = (base, range) => Math.max(0, base + (Math.random() - 0.5) * range);

    useEffect(() => {
      // Initialize with slight variations around current vitals
      setChartData({
        heartRate: Array.from({ length: 12 }, () => Math.round(vary(hr, 12))),
        bloodPressure: Array.from({ length: 12 }, () => Math.round(vary(sbp, 16))),
        glucose: Array.from({ length: 12 }, () => Math.round(vary(gl, 20)))
      });

      // Simulate live updates every 5 seconds
      intervalRef.current = setInterval(() => {
        setChartData(prev => ({
          heartRate: [...prev.heartRate.slice(1), Math.round(vary(hr, 8))],
          bloodPressure: [...prev.bloodPressure.slice(1), Math.round(vary(sbp, 10))],
          glucose: [...prev.glucose.slice(1), Math.round(vary(gl, 12))]
        }));
      }, 5000);

      return () => clearInterval(intervalRef.current);
    }, [hr, sbp, gl]);

    const hours = ['6AM', '8AM', '10AM', '12PM', '2PM', '4PM', '6PM', '8PM', '10PM', '12AM', '2AM', '4AM'];

    // Normalize value to 10-90 range within SVG viewBox (leaving padding for labels)
    const normalize = (values) => {
      const allVals = values;
      const min = Math.min(...allVals);
      const max = Math.max(...allVals);
      const range = max - min || 1;
      return allVals.map(v => 90 - ((v - min) / range) * 70); // map to y: 20..90 (inverted)
    };

    const hrNorm = normalize(chartData.heartRate);
    const bpNorm = normalize(chartData.bloodPressure);
    const glNorm = normalize(chartData.glucose);

    // Build a smooth SVG path from normalized Y values
    const buildPath = (yValues) => {
      const points = yValues.map((y, i) => ({
        x: (i / (yValues.length - 1)) * 100,
        y
      }));
      let d = `M${points[0].x},${points[0].y}`;
      for (let i = 1; i < points.length; i++) {
        const cp1x = points[i - 1].x + (points[i].x - points[i - 1].x) / 3;
        const cp2x = points[i].x - (points[i].x - points[i - 1].x) / 3;
        d += ` C${cp1x},${points[i - 1].y} ${cp2x},${points[i].y} ${points[i].x},${points[i].y}`;
      }
      return d;
    };

    // Build fill area path (closes down to bottom)
    const buildAreaPath = (yValues) => {
      const linePath = buildPath(yValues);
      return `${linePath} L100,95 L0,95 Z`;
    };

    return (
      <div className="relative h-64">
        <div className="absolute inset-0">
          {/* Grid Lines */}
          <div className="absolute inset-0 flex flex-col justify-between pb-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className={`h-px w-full ${isDarkMode ? 'bg-gray-800/40' : 'bg-gray-200/80'}`}></div>
            ))}
          </div>
          
          {/* Chart Lines */}
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ transition: 'all 1.5s ease-in-out' }}>
            <defs>
              <linearGradient id="heartRateGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f472b6" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#db2777" stopOpacity="0.9" />
              </linearGradient>
              <linearGradient id="heartRateAreaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f472b6" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#f472b6" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="bpGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.9" />
              </linearGradient>
              <linearGradient id="bpAreaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="glucoseGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#059669" stopOpacity="0.9" />
              </linearGradient>
              <linearGradient id="glucoseAreaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Area fills */}
            <path d={buildAreaPath(hrNorm)} fill="url(#heartRateAreaGradient)" style={{ transition: 'd 1.5s ease-in-out' }} />
            <path d={buildAreaPath(bpNorm)} fill="url(#bpAreaGradient)" style={{ transition: 'd 1.5s ease-in-out' }} />
            <path d={buildAreaPath(glNorm)} fill="url(#glucoseAreaGradient)" style={{ transition: 'd 1.5s ease-in-out' }} />

            {/* Heart Rate Line */}
            <path
              d={buildPath(hrNorm)}
              fill="none"
              stroke="url(#heartRateGradient)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ transition: 'd 1.5s ease-in-out' }}
            />

            {/* Blood Pressure Line */}
            <path
              d={buildPath(bpNorm)}
              fill="none"
              stroke="url(#bpGradient)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ transition: 'd 1.5s ease-in-out' }}
            />

            {/* Glucose Line */}
            <path
              d={buildPath(glNorm)}
              fill="none"
              stroke="url(#glucoseGradient)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ transition: 'd 1.5s ease-in-out' }}
            />

            {/* Latest data point dots */}
            <circle cx={100} cy={hrNorm[hrNorm.length - 1]} r="1.5" fill="#db2777" className="animate-pulse" style={{ transition: 'cy 1.5s ease-in-out' }} />
            <circle cx={100} cy={bpNorm[bpNorm.length - 1]} r="1.5" fill="#3b82f6" className="animate-pulse" style={{ transition: 'cy 1.5s ease-in-out' }} />
            <circle cx={100} cy={glNorm[glNorm.length - 1]} r="1.5" fill="#10b981" className="animate-pulse" style={{ transition: 'cy 1.5s ease-in-out' }} />
          </svg>

          {/* Time Labels */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2">
            {hours.map((hour, i) => (
              <div key={i} className={`text-xs ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>
                {hour}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className={`absolute top-2 left-2 flex gap-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-0.5 rounded bg-rose-500"></div>
              <span className="text-xs">Heart Rate</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-0.5 rounded bg-blue-500"></div>
              <span className="text-xs">Blood Pressure</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-0.5 rounded bg-emerald-500"></div>
              <span className="text-xs">Glucose</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

export default AnimatedChart;
