import React, { useState } from 'react';
import { Activity, TrendingUp } from 'lucide-react';
import { toast } from 'react-toastify';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getColorClass } from '../helpers';
import GlassCard from './GlassCard';
import AnimatedCard from './AnimatedCard';
import BeautifulFooter from './BeautifulFooter';

const HealthAlerts = ({ isDarkMode, elderlyList, setActiveModule }) => {
  const [activeFilter, setActiveFilter] = useState('all');

  const baseAlertsData = (() => {
    const dynamicAlerts = [];
    elderlyList.forEach(e => {
      const v = e.vitals || {};
      const bpParts = (v.bp || '120/80').split('/').map(Number);
      const tempF = v.tempF || (v.temp < 45 ? Math.round((v.temp * 9 / 5 + 32) * 10) / 10 : v.temp) || 98.6;
      if (v.heartRate && (v.heartRate > 90 || v.heartRate < 60)) {
        dynamicAlerts.push({ id: `${e._id}-hr`, vital: 'Heart Rate', value: `${v.heartRate} BPM`, threshold: v.heartRate > 90 ? '90 BPM' : '60 BPM', time: 'Just now', severity: v.heartRate > 100 || v.heartRate < 50 ? 'high' : 'medium', elderly: e.name });
      }
      if (bpParts[0] > 140 || bpParts[1] > 90) {
        dynamicAlerts.push({ id: `${e._id}-bp`, vital: 'Blood Pressure', value: v.bp, threshold: '140/90', time: 'Just now', severity: bpParts[0] > 160 ? 'high' : 'medium', elderly: e.name });
      }
      if (v.glucose && v.glucose > 140) {
        dynamicAlerts.push({ id: `${e._id}-gl`, vital: 'Glucose', value: `${v.glucose} mg/dL`, threshold: '140 mg/dL', time: 'Just now', severity: v.glucose > 180 ? 'high' : 'medium', elderly: e.name });
      }
      if (v.spo2 && v.spo2 < 95) {
        dynamicAlerts.push({ id: `${e._id}-sp`, vital: 'SpO2', value: `${v.spo2}%`, threshold: '95%', time: 'Just now', severity: v.spo2 < 90 ? 'high' : 'medium', elderly: e.name });
      }
      if (tempF > 100.4 || tempF < 96.8) {
        dynamicAlerts.push({ id: `${e._id}-tp`, vital: 'Temperature', value: `${tempF}°F`, threshold: tempF > 100.4 ? '100.4°F' : '96.8°F', time: 'Just now', severity: tempF > 103 ? 'high' : 'medium', elderly: e.name });
      }
    });
    return dynamicAlerts.length > 0 ? dynamicAlerts : [
      { id: 0, vital: 'All Clear', value: 'Normal', threshold: '-', time: 'Now', severity: 'low', elderly: 'All Patients' }
    ];
  })();

  const vitalAlertsData = baseAlertsData;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <GlassCard color="indigo" hoverable={false} darkMode={isDarkMode}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex-1">
            <h1 className={`text-3xl font-bold mb-2 bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent`}>
              Health Alerts
            </h1>
            <p className={`text-lg ${isDarkMode ? 'text-indigo-200/80' : 'text-indigo-700/80'}`}>
              Monitor abnormal vital signs and health alerts
            </p>
          </div>
          <div className="flex gap-3">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
              isDarkMode ? 'bg-indigo-950/40 border border-indigo-900/30' : 'bg-gradient-to-r from-indigo-100 to-violet-100 border border-indigo-200'
            }`}>
              <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
              <span className={`text-sm font-medium ${isDarkMode ? 'text-indigo-300' : 'text-indigo-700'}`}>
                Active: {vitalAlertsData.length} alerts
              </span>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Vital Alerts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {vitalAlertsData.map((alert, idx) => (
          <AnimatedCard key={alert.id} delay={idx}>
            <div className={`rounded-3xl p-6 backdrop-blur-sm border-2 transition-all duration-300 hover:scale-[1.02] ${
              isDarkMode
                ? 'bg-gradient-to-br from-gray-900/40 to-gray-950/40 border-gray-800'
                : 'bg-gradient-to-br from-white/90 to-gray-50/90 border-gray-200'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl ${
                    isDarkMode ? getColorClass('indigo', 'darkBg') : getColorClass('indigo', 'bg')
                  }`}>
                    <Activity className={isDarkMode ? getColorClass('indigo', 'darkText') : getColorClass('indigo', 'text')} />
                  </div>
                  <div>
                    <h3 className={`text-lg font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                      {alert.elderly}
                    </h3>
                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      ⏰ {alert.time}
                    </span>
                  </div>
                </div>
                <span className={`text-sm px-3 py-1 rounded-full ${
                  alert.severity === 'high' 
                    ? isDarkMode ? 'bg-rose-900/30 text-rose-300' : 'bg-rose-100 text-rose-700'
                    : isDarkMode ? 'bg-amber-900/30 text-amber-300' : 'bg-amber-100 text-amber-700'
                }`}>
                  {alert.severity}
                </span>
              </div>

              {/* Vital Information */}
              <div className="space-y-3 mb-4">
                <div className={`p-3 rounded-lg ${
                  isDarkMode ? 'bg-gray-800/40' : 'bg-gray-100/50'
                }`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {alert.vital}
                    </span>
                    <span className={`text-lg font-bold ${
                      alert.severity === 'high' ? 'text-rose-500' : 'text-amber-500'
                    }`}>
                      {alert.value}
                    </span>
                  </div>
                  <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Threshold: {alert.threshold}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button 
                  onClick={() => toast.info(`Contacting doctor for ${alert.elderly}...`)}
                  className={`flex-1 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 ${
                  isDarkMode
                    ? 'bg-indigo-900/30 hover:bg-indigo-800/30 text-indigo-300'
                    : 'bg-indigo-100 hover:bg-indigo-200 text-indigo-700'
                }`}>
                  Contact Doctor
                </button>
                <button 
                  onClick={() => toast.error(`Emergency call initiated for ${alert.elderly}!`)}
                  className={`flex-1 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 ${
                  isDarkMode
                    ? 'bg-rose-900/30 hover:bg-rose-800/30 text-rose-300'
                    : 'bg-rose-100 hover:bg-rose-200 text-rose-700'
                }`}>
                  Emergency Call
                </button>
              </div>
            </div>
          </AnimatedCard>
        ))}
      </div>

      {/* Health Trends */}
      <GlassCard color="indigo" darkMode={isDarkMode}>
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <h3 className={`text-xl font-bold flex items-center gap-2 ${
            isDarkMode ? 'text-indigo-300' : 'text-indigo-600'
          }`}>
            <TrendingUp className="w-6 h-6 animate-pulse" />
            Vital Trends - Last 7 Days
          </h3>
          <div className="flex gap-4 text-sm font-medium">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.6)]"></div>
              <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Blood Pressure</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500 shadow-[0_0_10px_rgba(244,114,182,0.6)]"></div>
              <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Heart Rate</span>
            </div>
          </div>
        </div>
        
        <div className="h-[300px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={[
                { day: 'Mon', bp: 120, hr: 65 },
                { day: 'Tue', bp: 122, hr: 70 },
                { day: 'Wed', bp: 118, hr: 68 },
                { day: 'Thu', bp: 115, hr: 72 },
                { day: 'Fri', bp: 119, hr: 75 },
                { day: 'Sat', bp: 121, hr: 78 },
                { day: 'Sun', bp: 118, hr: 80 }
              ]}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorBp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={isDarkMode ? "#3b82f6" : "#2563eb"} stopOpacity={0.4}/>
                  <stop offset="95%" stopColor={isDarkMode ? "#3b82f6" : "#2563eb"} stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorHr" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={isDarkMode ? "#f472b6" : "#e11d48"} stopOpacity={0.4}/>
                  <stop offset="95%" stopColor={isDarkMode ? "#f472b6" : "#e11d48"} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} />
              <XAxis 
                dataKey="day" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: isDarkMode ? '#9ca3af' : '#6b7280', fontSize: 13 }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: isDarkMode ? '#9ca3af' : '#6b7280', fontSize: 13 }}
                domain={['dataMin - 10', 'dataMax + 10']}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: isDarkMode ? 'rgba(17, 24, 39, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                  borderRadius: '12px',
                  border: isDarkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                  padding: '12px'
                }}
                itemStyle={{ fontWeight: 600 }}
              />
              <Area 
                type="monotone" 
                dataKey="bp" 
                name="Avg BP (Sys)"
                stroke={isDarkMode ? "#3b82f6" : "#2563eb"} 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorBp)" 
                animationDuration={1500}
              />
              <Area 
                type="monotone" 
                dataKey="hr" 
                name="Avg Heart Rate"
                stroke={isDarkMode ? "#f472b6" : "#e11d48"} 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorHr)" 
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      <BeautifulFooter isDarkMode={isDarkMode} setActiveModule={setActiveModule} />
    </div>
  );
};

export default HealthAlerts;
