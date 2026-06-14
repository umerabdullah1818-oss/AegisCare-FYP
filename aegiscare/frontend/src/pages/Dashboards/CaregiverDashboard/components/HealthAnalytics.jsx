import React, { useState } from 'react';
import { 
  BarChart3, Activity, TrendingUp, Users, AlertCircle, ChevronDown, CheckCircle 
} from 'lucide-react';
import { 
  BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import GlassCard from './GlassCard';
import BeautifulFooter from './BeautifulFooter';

const HealthAnalytics = ({ isDarkMode, elderlyList, alerts, setActiveModule }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState('Last 3 Months');
  const ranges = ['Last 7 Days', 'Last 30 Days', 'Last 3 Months'];

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <GlassCard color="violet" darkMode={isDarkMode} className="relative !overflow-visible z-20">
        <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
          <div className="absolute top-0 right-0 w-64 h-64 -translate-y-32 translate-x-32 rounded-full bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 blur-3xl animate-pulse"></div>
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h2 className={`text-3xl font-bold mb-2 flex items-center gap-3 ${isDarkMode ? 'text-violet-400' : 'text-violet-600'}`}>
              <BarChart3 className="w-8 h-8" />
              Advanced Health Analytics
            </h2>
            <p className={`text-lg font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Comprehensive overview of population health metrics and trends.
            </p>
          </div>
          <div className="relative">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`flex items-center justify-between gap-3 px-5 py-2.5 rounded-xl border-2 font-bold transition-all ${
                isDarkMode 
                  ? 'bg-gray-800/80 border-violet-500/30 text-violet-300 hover:border-violet-500/60 shadow-[0_0_15px_rgba(139,92,246,0.1)]' 
                  : 'bg-white border-violet-200 text-violet-700 hover:border-violet-400 shadow-sm hover:shadow-[0_0_15px_rgba(139,92,246,0.15)]'
              } ${isDropdownOpen ? (isDarkMode ? 'border-violet-500 shadow-[0_0_20px_rgba(139,92,246,0.2)] bg-gray-800' : 'border-violet-500 shadow-[0_0_20px_rgba(139,92,246,0.2)] bg-violet-50') : ''}`}
            >
              <span>{selectedRange}</span>
              <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isDropdownOpen && (
              <div className={`absolute top-full mt-2 w-48 right-0 rounded-2xl border-2 z-50 overflow-hidden backdrop-blur-2xl animate-scale-in shadow-2xl ${
                isDarkMode 
                  ? 'bg-gray-900/95 border-violet-500/30 shadow-[0_15px_40px_rgba(0,0,0,0.6)]' 
                  : 'bg-white/95 border-violet-200 shadow-[0_15px_40px_rgba(139,92,246,0.2)]'
              }`}>
                <div className="p-1">
                  {ranges.map((range) => (
                    <button
                      key={range}
                      onClick={() => { setSelectedRange(range); setIsDropdownOpen(false); }}
                      className={`w-full text-left px-4 py-3 font-bold text-sm rounded-xl transition-all flex items-center justify-between group ${
                        selectedRange === range 
                          ? (isDarkMode ? 'bg-violet-900/50 text-violet-300' : 'bg-violet-100 text-violet-700')
                          : (isDarkMode ? 'text-gray-300 hover:bg-gray-800/80 hover:text-violet-200' : 'text-gray-600 hover:bg-violet-50 hover:text-violet-600')
                      }`}
                    >
                      {range}
                      {selectedRange === range && <CheckCircle className={`w-[18px] h-[18px] ${isDarkMode ? 'text-violet-400' : 'text-violet-600'} animate-scale-in`} />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Activity Level - Bar Chart */}
        <GlassCard color="violet" darkMode={isDarkMode} className="h-full flex flex-col">
          <h3 className={`text-xl font-bold mb-6 flex items-center gap-2 ${isDarkMode ? 'text-violet-300' : 'text-violet-600'}`}>
            <Activity className="w-6 h-6" />
            Population Activity Levels
          </h3>
          
          <div className="h-[300px] w-full mt-auto">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { day: 'Mon', active: 45, resting: 30 },
                  { day: 'Tue', active: 52, resting: 25 },
                  { day: 'Wed', active: 38, resting: 35 },
                  { day: 'Thu', active: 65, resting: 20 },
                  { day: 'Fri', active: 48, resting: 28 },
                  { day: 'Sat', active: 70, resting: 15 },
                  { day: 'Sun', active: 60, resting: 22 }
                ]}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={isDarkMode ? "#8b5cf6" : "#7c3aed"} stopOpacity={1}/>
                    <stop offset="100%" stopColor={isDarkMode ? "#6d28d9" : "#5b21b6"} stopOpacity={0.8}/>
                  </linearGradient>
                  <linearGradient id="colorResting" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={isDarkMode ? "#3b82f6" : "#2563eb"} stopOpacity={1}/>
                    <stop offset="100%" stopColor={isDarkMode ? "#1d4ed8" : "#1e40af"} stopOpacity={0.8}/>
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
                />
                <Tooltip 
                  cursor={{ fill: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
                  contentStyle={{ 
                    backgroundColor: isDarkMode ? 'rgba(17, 24, 39, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '12px',
                    border: isDarkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                    padding: '12px'
                  }}
                  itemStyle={{ fontWeight: 600 }}
                />
                <Bar dataKey="active" name="Active Time (mins)" fill="url(#colorActive)" radius={[6, 6, 0, 0]} barSize={20} />
                <Bar dataKey="resting" name="Resting Time (mins)" fill="url(#colorResting)" radius={[6, 6, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Overall Health Score - Area Chart */}
        <GlassCard color="emerald" darkMode={isDarkMode} className="h-full flex flex-col">
          <h3 className={`text-xl font-bold mb-6 flex items-center gap-2 ${isDarkMode ? 'text-emerald-300' : 'text-emerald-600'}`}>
            <TrendingUp className="w-6 h-6" />
            Overall Wellness Score
          </h3>
          
          <div className="h-[300px] w-full mt-auto">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={[
                  { week: 'W1', score: 75 },
                  { week: 'W2', score: 78 },
                  { week: 'W3', score: 74 },
                  { week: 'W4', score: 82 },
                  { week: 'W5', score: 85 },
                  { week: 'W6', score: 88 },
                  { week: 'W7', score: 92 }
                ]}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={isDarkMode ? "#10b981" : "#059669"} stopOpacity={0.5}/>
                    <stop offset="95%" stopColor={isDarkMode ? "#10b981" : "#059669"} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} />
                <XAxis 
                  dataKey="week" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: isDarkMode ? '#9ca3af' : '#6b7280', fontSize: 13 }}
                  dy={10}
                />
                <YAxis 
                  domain={[60, 100]}
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: isDarkMode ? '#9ca3af' : '#6b7280', fontSize: 13 }}
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
                  dataKey="score" 
                  name="Avg Score"
                  stroke={isDarkMode ? "#10b981" : "#059669"} 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorScore)" 
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard color="blue" darkMode={isDarkMode}>
          <div className="flex items-center gap-4">
             <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${isDarkMode ? 'bg-blue-900/40 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
               <Users className="w-7 h-7" />
             </div>
             <div>
               <div className={`text-3xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>{elderlyList.length}</div>
               <div className={`font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Patients</div>
             </div>
          </div>
        </GlassCard>
        <GlassCard color="emerald" darkMode={isDarkMode}>
          <div className="flex items-center gap-4">
             <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${isDarkMode ? 'bg-emerald-900/40 text-emerald-400' : 'bg-emerald-100 text-emerald-600'}`}>
               <Activity className="w-7 h-7" />
             </div>
             <div>
               <div className={`text-3xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>92%</div>
               <div className={`font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Avg Adherence</div>
             </div>
          </div>
        </GlassCard>
        <GlassCard color="amber" darkMode={isDarkMode}>
          <div className="flex items-center gap-4">
             <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${isDarkMode ? 'bg-amber-900/40 text-amber-400' : 'bg-amber-100 text-amber-600'}`}>
               <AlertCircle className="w-7 h-7" />
             </div>
             <div>
               <div className={`text-3xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>{alerts.length}</div>
               <div className={`font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Incidents</div>
             </div>
          </div>
        </GlassCard>
      </div>
      <BeautifulFooter isDarkMode={isDarkMode} setActiveModule={setActiveModule} />
    </div>
  );
};

export default HealthAnalytics;
