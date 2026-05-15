import React from 'react';
import { Heart, Activity, User, TrendingUp, TrendingDown, Bell, Pill, ActivitySquare, Wind, Utensils, ShieldAlert, Zap, BedDouble, Droplets, Calendar, AlertTriangle } from 'lucide-react';
import { getColorClass, getColorGradientDark, getColorGradientLight } from '../helpers';
import AnimatedGauge from './AnimatedGauge';
import AnimatedChart from './AnimatedChart';
import BeautifulFooter from './BeautifulFooter';

const DashboardHome = (props) => {
  const { isDarkMode, userName, healthMetrics, hr, sbp, dbp, gl, sp, bpStatus, hrStatus, glStatus, spStatus, healthRisk, medications, medHistory, setActiveModule, notifications, meals } = props;

  return (
          <>
            <div className="space-y-6">
              {/* Welcome Banner */}
              <div className={`rounded-2xl p-6 mb-6 backdrop-blur-lg border transition-all duration-500 overflow-hidden relative ${
                isDarkMode
                  ? 'bg-gradient-to-r from-gray-900/60 to-rose-950/40 border-gray-800/50 shadow-2xl shadow-rose-950/30'
                  : 'bg-gradient-to-r from-white/90 to-rose-50/90 border-rose-100 shadow-2xl shadow-rose-100'
              }`}>
                <div className="absolute top-0 right-0 w-64 h-64 -translate-y-32 translate-x-32 rounded-full bg-gradient-to-r from-rose-600/10 to-pink-600/10 blur-3xl"></div>
                
                <div className="relative z-10">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`p-3 rounded-2xl transition-all duration-300 hover:scale-110 ${
                          isDarkMode ? 'bg-rose-950/40' : 'bg-gradient-to-r from-rose-100 to-pink-100'
                        }`}>
                          <User className={`w-8 h-8 ${isDarkMode ? 'text-rose-400' : 'text-rose-600'}`} />
                        </div>
                        <div>
                          <h1 className={`text-2xl lg:text-3xl font-bold mb-1 bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent`}>
                            Welcome back, {userName}!
                          </h1>
                          <p className={`text-base ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Your health is being monitored 24/7 with AI-powered insights
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-3">
                      <div className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 hover:scale-105 ${
                        isDarkMode ? 'bg-emerald-950/40 border border-emerald-900/30' : 'bg-gradient-to-r from-emerald-100 to-teal-100 border border-emerald-200'
                      }`}>
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className={`text-sm font-medium ${isDarkMode ? 'text-emerald-300' : 'text-emerald-700'}`}>
                          System: Normal
                        </span>
                      </div>
                      <div className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 hover:scale-105 ${
                        isDarkMode ? 'bg-blue-950/40 border border-blue-900/30' : 'bg-gradient-to-r from-blue-100 to-indigo-100 border border-blue-200'
                      }`}>
                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                        <span className={`text-sm font-medium ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                          AI: Active
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Health Metrics with Gauges - FIXED */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(healthMetrics).slice(0, 4).map(([key, stat]) => (
                  <div key={key} className={`group rounded-2xl p-5 backdrop-blur-xl border-2 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl relative overflow-hidden ${
                    isDarkMode
                      ? 'bg-gradient-to-br from-gray-900/50 to-rose-950/30 border-gray-800/40'
                      : 'bg-gradient-to-br from-white/90 to-rose-50/90 border-gray-200/50'
                  }`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className={`p-3 rounded-xl transition-all duration-300 group-hover:scale-110 ${
                        isDarkMode ? getColorClass(stat.color, 'darkBg') : getColorClass(stat.color, 'bg')
                      }`}>
                        <div className={`${isDarkMode ? getColorClass(stat.color, 'darkText') : getColorClass(stat.color, 'text')}`}>
                          {stat.icon}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                          isDarkMode 
                            ? 'bg-gray-800/60 text-gray-300' 
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {stat.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        {/* FIXED: Health metrics values are now properly visible */}
                        <h3 className={`text-3xl font-bold mb-1 ${
                          isDarkMode 
                            ? getColorGradientDark(stat.color)
                            : getColorGradientLight(stat.color)
                        } bg-clip-text text-transparent`}>
                          {stat.value}
                        </h3>
                        <p className={`text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-800'}`}>
                          {stat.title}
                        </p>
                      </div>
                      <AnimatedGauge 
                        isDarkMode={isDarkMode}
                        value={stat.currentValue} 
                        max={stat.maxValue}
                        color={stat.color}
                        size={70}
                      />
                    </div>
                    
                    <div className={`flex items-center gap-1 mt-3 ${stat.trend.includes('↓') ? 'text-red-500' : 'text-emerald-500'}`}>
                      {stat.trend.includes('↓') ? 
                        <TrendingDown className="w-4 h-4" /> : 
                        <TrendingUp className="w-4 h-4" />
                      }
                      <span className="text-sm font-medium">{stat.trend}</span>
                    </div>
                    <p className={`text-xs mt-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                      {stat.description}
                    </p>
                  </div>
                ))}
              </div>

              {/* Beautiful Chart Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Live Health Trends Chart */}
                <div className={`lg:col-span-2 rounded-2xl p-6 backdrop-blur-xl border-2 ${
                  isDarkMode
                    ? 'bg-gradient-to-br from-gray-900/50 to-blue-950/30 border-gray-800/40'
                    : 'bg-gradient-to-br from-white/90 to-blue-50/90 border-gray-200/50'
                }`}>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className={`text-xl font-bold mb-1 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                         Live Health Trends
                      </h3>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                        Real-time vital signs monitoring over 24 hours
                      </p>
                    </div>
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300 hover:scale-105 ${
                      isDarkMode ? 'bg-blue-950/40 border border-blue-900/30' : 'bg-blue-100 border border-blue-200'
                    }`}>
                      <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                      <span className={`text-xs font-medium ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                        Live Streaming
                      </span>
                    </div>
                  </div>
                  
                  {/* Animated Chart */}
                  <AnimatedChart isDarkMode={isDarkMode} hr={hr} sbp={sbp} gl={gl} />
                  
                  {/* Mini Stats */}
                  <div className="grid grid-cols-3 gap-3 mt-6">
                    {[
                      { label: 'Avg Heart Rate', value: `${hr || '--'} BPM`, change: hrStatus === 'Normal' ? '-2' : `+${hr - 80}`, color: 'rose', isGood: hrStatus === 'Normal' },
                      { label: 'Avg BP', value: `${sbp || '--'}/${dbp || '--'}`, change: bpStatus === 'Normal' ? '0' : `+${sbp - 120}`, color: 'blue', isGood: bpStatus === 'Normal' },
                      { label: 'Avg Glucose', value: `${gl || '--'}`, change: glStatus === 'Normal' ? '-5' : `+${gl - 110}`, color: 'emerald', isGood: glStatus === 'Normal' }
                    ].map((item, idx) => (
                      <div key={idx} className={`p-3 rounded-xl border transition-all duration-300 hover:scale-105 ${
                        isDarkMode ? 'bg-gray-900/40 border-gray-800' : 'bg-white/50 border-gray-200'
                      }`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                              {item.label}
                            </div>
                            <div className={`text-lg font-bold ${
                              isDarkMode 
                                ? item.color === 'rose' ? 'text-rose-300' : 
                                  item.color === 'blue' ? 'text-blue-300' : 
                                  item.color === 'emerald' ? 'text-emerald-300' : 'text-gray-100'
                                : item.color === 'rose' ? 'text-rose-600' : 
                                  item.color === 'blue' ? 'text-blue-600' : 
                                  item.color === 'emerald' ? 'text-emerald-600' : 'text-gray-900'
                            }`}>
                              {item.value}
                            </div>
                          </div>
                          <div className={`text-xs px-2 py-0.5 rounded-full ${
                            item.isGood
                              ? isDarkMode ? 'bg-emerald-900/40 text-emerald-300' : 'bg-emerald-100 text-emerald-700'
                              : isDarkMode ? 'bg-red-900/40 text-red-300' : 'bg-red-100 text-red-700'
                          }`}>
                            {item.change}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Activities */}
                <div className={`rounded-2xl p-6 backdrop-blur-xl border-2 ${
                  isDarkMode
                    ? 'bg-gradient-to-br from-gray-900/50 to-purple-950/30 border-gray-800/40'
                    : 'bg-gradient-to-br from-white/90 to-purple-50/90 border-gray-200/50'
                }`}>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className={`text-xl font-bold mb-1 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                         Recent Activities
                      </h3>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                        Latest health events and notifications
                      </p>
                    </div>
                    <div className={`p-2 rounded-lg ${
                      isDarkMode ? 'bg-purple-950/40' : 'bg-purple-100'
                    }`}>
                      <Bell className={`w-5 h-5 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {(() => {
                      const iconMap = {
                        pill: <Pill className="w-4 h-4" />,
                        calendar: <Calendar className="w-4 h-4" />,
                        activity: <Activity className="w-4 h-4" />,
                        alert: <AlertTriangle className="w-4 h-4" />,
                        bell: <Bell className="w-4 h-4" />,
                        heart: <Heart className="w-4 h-4" />,
                      };
                      const colorToStatus = {
                        red: 'warning',
                        amber: 'warning',
                        emerald: 'success',
                        green: 'success',
                        teal: 'info',
                        cyan: 'info',
                        blue: 'info',
                      };

                      const allActivities = [];

                      // Add real notifications from backend
                      if (notifications && notifications.length > 0) {
                        notifications.forEach((n) => {
                          allActivities.push({
                            time: n.time,
                            activity: n.title || n.message,
                            status: colorToStatus[n.color] || 'info',
                            icon: iconMap[n.icon] || <Bell className="w-4 h-4" />,
                            sortDate: new Date(n.time),
                          });
                        });
                      }

                      // Add recent meals
                      if (meals && meals.length > 0) {
                        meals.slice(0, 3).forEach((m) => {
                          allActivities.push({
                            time: m.createdAt ? new Date(m.createdAt).toLocaleString() : 'Recently',
                            activity: `Meal logged: ${m.name || m.mealType || 'Meal'}`,
                            status: m.approvalStatus === 'approved' ? 'success' : m.approvalStatus === 'rejected' ? 'warning' : 'info',
                            icon: <Utensils className="w-4 h-4" />,
                            sortDate: m.createdAt ? new Date(m.createdAt) : new Date(),
                          });
                        });
                      }

                      // Add recent medications
                      if (medications && medications.length > 0) {
                        medications.slice(0, 3).forEach((med) => {
                          allActivities.push({
                            time: med.createdAt ? new Date(med.createdAt).toLocaleString() : 'Recently',
                            activity: `Medication added: ${med.name} (${med.dosage || ''})`,
                            status: med.approvalStatus === 'approved' ? 'success' : med.approvalStatus === 'rejected' ? 'warning' : 'info',
                            icon: <Pill className="w-4 h-4" />,
                            sortDate: med.createdAt ? new Date(med.createdAt) : new Date(),
                          });
                        });
                      }

                      // Add vitals-based activities
                      if (hrStatus !== 'Normal') {
                        allActivities.push({ time: 'Just now', activity: `Heart rate ${hr > 100 ? 'spiked' : 'dropped'} to ${hr} BPM`, status: 'warning', icon: <Heart className="w-4 h-4" />, sortDate: new Date() });
                      }
                      if (glStatus !== 'Normal') {
                        allActivities.push({ time: 'Just now', activity: `Blood glucose elevated at ${gl} mg/dL`, status: 'warning', icon: <ActivitySquare className="w-4 h-4" />, sortDate: new Date() });
                      }
                      if (bpStatus === 'High') {
                        allActivities.push({ time: 'Just now', activity: `Blood pressure high at ${sbp}/${dbp} mmHg`, status: 'warning', icon: <Activity className="w-4 h-4" />, sortDate: new Date() });
                      }

                      // Sort by date descending and limit to 6
                      allActivities.sort((a, b) => (b.sortDate || 0) - (a.sortDate || 0));
                      return allActivities.slice(0, 6);
                    })().map((activity, idx) => (
                      <div key={idx} className={`p-3 rounded-xl border transition-all duration-300 hover:scale-[1.02] ${
                        isDarkMode ? 'bg-gray-900/40 border-gray-800' : 'bg-white/50 border-gray-200'
                      }`}>
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${
                            activity.status === 'warning' 
                              ? isDarkMode ? 'bg-red-950/40' : 'bg-red-100'
                              : activity.status === 'success'
                              ? isDarkMode ? 'bg-emerald-950/40' : 'bg-emerald-100'
                              : isDarkMode ? 'bg-blue-950/40' : 'bg-blue-100'
                          }`}>
                            <div className={
                              activity.status === 'warning' 
                                ? isDarkMode ? 'text-red-400' : 'text-red-600'
                                : activity.status === 'success'
                                ? isDarkMode ? 'text-emerald-400' : 'text-emerald-600'
                                : isDarkMode ? 'text-blue-400' : 'text-blue-600'
                            }>
                              {activity.icon}
                            </div>
                          </div>
                          <div className="flex-1">
                            <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                              {activity.activity}
                            </p>
                            <div className="flex items-center justify-between mt-1">
                              <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                                {activity.time}
                              </span>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${
                                activity.status === 'warning'
                                  ? isDarkMode ? 'bg-red-900/40 text-red-300' : 'bg-red-100 text-red-700'
                                  : activity.status === 'success'
                                  ? isDarkMode ? 'bg-emerald-900/40 text-emerald-300' : 'bg-emerald-100 text-emerald-700'
                                  : isDarkMode ? 'bg-blue-900/40 text-blue-300' : 'bg-blue-100 text-blue-700'
                              }`}>
                                {activity.status === 'warning' ? 'Alert' : activity.status === 'success' ? 'Normal' : 'Info'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Daily Health Stats */}
                <div className={`lg:col-span-2 rounded-2xl p-6 backdrop-blur-xl border-2 ${
                  isDarkMode
                    ? 'bg-gradient-to-br from-gray-900/50 to-emerald-950/30 border-gray-800/40'
                    : 'bg-gradient-to-br from-white/90 to-emerald-50/90 border-gray-200/50'
                }`}>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className={`text-xl font-bold mb-1 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                        Daily Health Stats
                      </h3>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                        Track your daily health goals and achievements
                      </p>
                    </div>
                    <div className={`p-2 rounded-lg ${
                      isDarkMode ? 'bg-emerald-950/40' : 'bg-emerald-100'
                    }`}>
                      <Activity className={`w-5 h-5 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {(() => {
                      const stepsBase = healthRisk?.risk_level === 'High' ? 1200 : healthRisk?.risk_level === 'Medium' ? 2800 : 3456;
                      const sleepHrs = healthRisk?.risk_level === 'High' ? 5.2 : healthRisk?.risk_level === 'Medium' ? 6.3 : 7.5;
                      const waterL = healthRisk?.risk_level === 'High' ? 0.8 : healthRisk?.risk_level === 'Medium' ? 1.2 : 1.5;
                      const medsTaken = medHistory.filter(h => h.status === 'Taken').length;
                      const medsTotal = medications.length || 3;
                      return [
                        { label: 'Steps Taken', value: stepsBase.toLocaleString(), goal: '5,000', progress: Math.round((stepsBase / 5000) * 100), color: 'amber', icon: <Activity className="w-4 h-4" /> },
                        { label: 'Sleep Hours', value: sleepHrs.toString(), goal: '8', progress: Math.round((sleepHrs / 8) * 100), color: 'indigo', icon: <BedDouble className="w-4 h-4" /> },
                        { label: 'Water Intake', value: `${waterL}L`, goal: '2L', progress: Math.round((waterL / 2) * 100), color: 'blue', icon: <Droplets className="w-4 h-4" /> },
                        { label: 'Medications', value: `${medsTaken}/${medsTotal}`, goal: medsTotal.toString(), progress: medsTotal > 0 ? Math.round((medsTaken / medsTotal) * 100) : 0, color: 'emerald', icon: <Pill className="w-4 h-4" /> }
                      ];
                    })().map((stat, idx) => (
                      <div key={idx} className={`p-4 rounded-xl border transition-all duration-300 hover:scale-105 ${
                        isDarkMode ? 'bg-gray-900/40 border-gray-800' : 'bg-white/50 border-gray-200'
                      }`}>
                        <div className="flex items-center justify-between mb-2">
                          <div className={`p-1.5 rounded-lg ${
                            isDarkMode ? getColorClass(stat.color, 'darkBg') : getColorClass(stat.color, 'bg')
                          }`}>
                            <div className={`${isDarkMode ? getColorClass(stat.color, 'darkText') : getColorClass(stat.color, 'text')}`}>
                              {stat.icon}
                            </div>
                          </div>
                          <div className={`text-xs px-2 py-0.5 rounded-full ${
                            isDarkMode ? 'bg-gray-800/60' : 'bg-gray-200'
                          }`}>
                            {stat.progress}%
                          </div>
                        </div>
                        <div className={`text-lg font-bold mb-1 ${
                          isDarkMode 
                            ? stat.color === 'amber' ? 'text-amber-300' : 
                              stat.color === 'indigo' ? 'text-indigo-300' : 
                              stat.color === 'blue' ? 'text-blue-300' : 
                              stat.color === 'emerald' ? 'text-emerald-300' : 'text-gray-100'
                            : stat.color === 'amber' ? 'text-amber-600' : 
                              stat.color === 'indigo' ? 'text-indigo-600' : 
                              stat.color === 'blue' ? 'text-blue-600' : 
                              stat.color === 'emerald' ? 'text-emerald-600' : 'text-gray-900'
                        }`}>
                          {stat.value}
                        </div>
                        <div className="text-xs text-gray-500 mb-3">{stat.label}</div>
                        <div className={`h-1.5 rounded-full overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
                          <div 
                            className={`h-full rounded-full ${
                              isDarkMode 
                                ? stat.color === 'amber' ? 'bg-amber-500' : 
                                  stat.color === 'indigo' ? 'bg-indigo-500' : 
                                  stat.color === 'blue' ? 'bg-blue-500' : 
                                  stat.color === 'emerald' ? 'bg-emerald-500' : 'bg-rose-500'
                                : stat.color === 'amber' ? 'bg-amber-400' : 
                                  stat.color === 'indigo' ? 'bg-indigo-400' : 
                                  stat.color === 'blue' ? 'bg-blue-400' : 
                                  stat.color === 'emerald' ? 'bg-emerald-400' : 'bg-rose-400'
                            }`}
                            style={{ width: `${stat.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className={`rounded-2xl p-6 backdrop-blur-xl border-2 ${
                  isDarkMode
                    ? 'bg-gradient-to-br from-gray-900/50 to-amber-950/30 border-gray-800/40'
                    : 'bg-gradient-to-br from-white/90 to-amber-50/90 border-gray-200/50'
                }`}>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className={`text-xl font-bold mb-1 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                         Quick Actions
                      </h3>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                        Quick access to essential features
                      </p>
                    </div>
                    <div className={`p-2 rounded-lg ${
                      isDarkMode ? 'bg-amber-950/40' : 'bg-amber-100'
                    }`}>
                      <Zap className={`w-5 h-5 ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`} />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'Log Meal', icon: <Utensils className="w-5 h-5" />, color: 'emerald', module: 'diet' },
                      { label: 'Record BP', icon: <Activity className="w-5 h-5" />, color: 'blue', module: 'vitals' },
                      { label: 'Medication', icon: <Pill className="w-5 h-5" />, color: 'cyan', module: 'medication' },
                      { label: 'Emergency', icon: <ShieldAlert className="w-5 h-5" />, color: 'red', module: 'panic' },
                    ].map((action, idx) => (
                      <button key={idx} onClick={() => setActiveModule(action.module)} className={`p-4 rounded-xl border transition-all duration-300 hover:scale-105 flex flex-col items-center justify-center gap-2 ${
                        isDarkMode 
                          ? 'bg-gray-900/40 border-gray-800 hover:bg-gray-800/50'
                          : 'bg-white border-gray-200 hover:bg-gray-50'
                      }`}>
                        <div className={`p-2 rounded-lg ${
                          isDarkMode ? 'bg-gray-800/60' : 'bg-white'
                        }`}>
                          <div className={`${
                            action.color === 'emerald' ? (isDarkMode ? 'text-emerald-400' : 'text-emerald-600') :
                            action.color === 'blue' ? (isDarkMode ? 'text-blue-400' : 'text-blue-600') :
                            action.color === 'cyan' ? (isDarkMode ? 'text-cyan-400' : 'text-cyan-600') :
                            action.color === 'red' ? (isDarkMode ? 'text-red-400' : 'text-red-600') :
                            (isDarkMode ? 'text-gray-500' : 'text-gray-600')
                          }`}>
                            {action.icon}
                          </div>
                        </div>
                        <span className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>
                          {action.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Beautiful Footer */}
            <BeautifulFooter isDarkMode={isDarkMode} setActiveModule={setActiveModule} />
          </>
  );
};

export default DashboardHome;
