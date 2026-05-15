import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AnimatedChart = ({ data, labels, colors = ['#10b981', '#f59e0b', '#3b82f6', '#8b5cf6'], height = 200, isDarkMode }) => {
  // Transform array of arrays into array of objects for Recharts
  const formattedData = labels.map((label, i) => ({
    name: label,
    'CPU Usage': data[0] ? data[0][i] : 0,
    'Memory': data[1] ? data[1][i] : 0,
    'Storage': data[2] ? data[2][i] : 0,
    'Network': data[3] ? data[3][i] : 0,
  }));

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={formattedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            {colors.map((color, idx) => (
              <linearGradient key={`color${idx}`} id={`color${idx}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: isDarkMode ? '#9ca3af' : '#6b7280' }} dy={10} />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: isDarkMode ? '#9ca3af' : '#6b7280' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
              borderRadius: '12px',
              border: isDarkMode ? '1px solid #374151' : '1px solid #f3f4f6',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              color: isDarkMode ? '#f9fafb' : '#111827'
            }}
            itemStyle={{ fontWeight: 600, padding: '2px 0' }}
          />
          {data[3] && <Area type="monotone" dataKey="Network" stroke={colors[3]} strokeWidth={3} fillOpacity={1} fill={`url(#color3)`} activeDot={{ r: 6, strokeWidth: 0 }} />}
          {data[2] && <Area type="monotone" dataKey="Storage" stroke={colors[2]} strokeWidth={3} fillOpacity={1} fill={`url(#color2)`} activeDot={{ r: 6, strokeWidth: 0 }} />}
          {data[1] && <Area type="monotone" dataKey="Memory" stroke={colors[1]} strokeWidth={3} fillOpacity={1} fill={`url(#color1)`} activeDot={{ r: 6, strokeWidth: 0 }} />}
          {data[0] && <Area type="monotone" dataKey="CPU Usage" stroke={colors[0]} strokeWidth={3} fillOpacity={1} fill={`url(#color0)`} activeDot={{ r: 6, strokeWidth: 0 }} />}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AnimatedChart;
