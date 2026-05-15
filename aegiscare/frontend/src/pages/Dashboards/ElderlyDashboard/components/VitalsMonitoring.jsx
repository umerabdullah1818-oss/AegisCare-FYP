import React from 'react';
import { Activity, Bell, Clock, TrendingUp, TrendingDown, Sparkles, Download, Check, ChevronRight, Clock3, CalendarDays, Calendar, Database } from 'lucide-react';
import { getColorClass } from '../helpers';
import BeautifulFooter from './BeautifulFooter';

const VitalsMonitoring = (props) => {
  const { isDarkMode, healthMetrics, healthRisk, anomalyResult, liveVitals, hr, sbp, dbp, gl, bpStatus, hrStatus, glStatus, spStatus, setShowAIInsights, setVitalCardModal, reportPeriod, setReportPeriod, downloadVitalsReport, reportDropdownOpen, setReportDropdownOpen, setActiveModule } = props;

  return (
    <div className="space-y-6">
      {/* Modern Header with Animated Background */}
      <div className={`relative rounded-3xl p-6 overflow-hidden backdrop-blur-xl border transition-all duration-500 ${
        isDarkMode
          ? 'bg-gradient-to-br from-gray-900/80 via-emerald-900/20 to-teal-900/10 border-emerald-800/30 shadow-2xl shadow-emerald-900/20'
          : 'bg-gradient-to-br from-white/90 via-emerald-50/60 to-teal-50/40 border-emerald-200/50 shadow-2xl shadow-emerald-100/50'
      }`}>
        {/* Animated Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className={`text-3xl font-bold mb-3 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 bg-clip-text text-transparent animate-gradient`}>
                Live Vitals Dashboard
              </h2>
              <p className={`text-base ${isDarkMode ? 'text-emerald-200/80' : 'text-emerald-700/80'}`}>
                Real-time health monitoring with AI-powered predictive analytics
              </p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 hover:scale-105 ${
                isDarkMode 
                  ? 'bg-emerald-900/40 border border-emerald-800/50 backdrop-blur-sm' 
                  : 'bg-emerald-100 border border-emerald-200 backdrop-blur-sm'
              }`}>
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className={`text-sm font-medium ${isDarkMode ? 'text-emerald-300' : 'text-emerald-700'}`}>
                  Live Tracking
                </span>
              </div>
              <button onClick={() => setShowAIInsights(true)} className={`px-4 py-2 rounded-full font-medium transition-all duration-300 hover:scale-105 flex items-center gap-2 ${
                isDarkMode
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white'
              }`}>
                <Sparkles size={16} />
                AI Insights
              </button>
            </div>
          </div>

          {/* Stats Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Overall Health Score', value: `${healthRisk ? (healthRisk.risk_level === 'Low' ? '92' : healthRisk.risk_level === 'Medium' ? '68' : '42') : '--'}%`, icon: <Activity className="w-5 h-5" />, color: healthRisk ? (healthRisk.risk_level === 'Low' ? 'emerald' : healthRisk.risk_level === 'Medium' ? 'amber' : 'red') : 'emerald', trend: healthRisk ? (healthRisk.risk_level === 'Low' ? '+2%' : healthRisk.risk_level === 'Medium' ? '-8%' : '-25%') : '...' },
              { label: 'Vital Alerts', value: anomalyResult ? `${anomalyResult.alerts?.length || 0}` : '...', icon: <Bell className="w-5 h-5" />, color: anomalyResult?.is_anomaly ? 'red' : 'green', trend: anomalyResult ? (anomalyResult.is_anomaly ? anomalyResult.severity : 'Normal') : '...' },
              { label: 'Data Points', value: '2.4K', icon: <Database className="w-5 h-5" />, color: 'blue', trend: 'Today' },
              { label: 'Last Updated', value: liveVitals ? 'Just now' : '...', icon: <Clock className="w-5 h-5" />, color: 'purple', trend: liveVitals ? 'Live' : '...' },
            ].map((stat, idx) => (
              <div key={idx} className={`group rounded-2xl p-4 backdrop-blur-lg border transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                isDarkMode
                  ? 'bg-gradient-to-br from-gray-800/40 to-gray-900/30 border-gray-700/30'
                  : 'bg-gradient-to-br from-white/80 to-gray-50/80 border-gray-200/40'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-lg transition-all duration-300 group-hover:rotate-12 ${
                    isDarkMode ? getColorClass(stat.color, 'darkBg') : getColorClass(stat.color, 'bg')
                  }`}>
                    <div className={isDarkMode ? getColorClass(stat.color, 'darkText') : getColorClass(stat.color, 'text')}>
                      {stat.icon}
                    </div>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    isDarkMode 
                      ? stat.trend.includes('+') ? 'bg-emerald-900/30 text-emerald-300' : 'bg-gray-700/50 text-gray-300'
                      : stat.trend.includes('+') ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {stat.trend}
                  </span>
                </div>
                <h3 className={`text-2xl font-bold mb-1 ${
                  isDarkMode 
                    ? stat.color === 'emerald' ? 'text-emerald-300' : 
                      stat.color === 'green' ? 'text-green-300' : 
                      stat.color === 'blue' ? 'text-blue-300' : 
                      stat.color === 'purple' ? 'text-purple-300' : 'text-white'
                    : stat.color === 'emerald' ? 'text-emerald-600' : 
                      stat.color === 'green' ? 'text-green-600' : 
                      stat.color === 'blue' ? 'text-blue-600' : 
                      stat.color === 'purple' ? 'text-purple-600' : 'text-gray-900'
                }`}>
                  {stat.value}
                </h3>
                <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Vitals Grid with Enhanced Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {Object.entries(healthMetrics).map(([key, stat], index) => (
          <div key={key} className={`group relative rounded-2xl p-5 backdrop-blur-xl border-2 overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-xl ${
            isDarkMode
              ? 'bg-gradient-to-br from-gray-900/40 via-gray-800/30 to-gray-900/40 border-gray-700/30'
              : 'bg-gradient-to-br from-white/90 via-white/80 to-white/90 border-gray-200/50'
          }`}>
            {/* Animated Background Glow */}
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r ${
              stat.color === 'rose' ? 'from-rose-500/5 via-pink-500/5 to-rose-500/5' :
              stat.color === 'emerald' ? 'from-emerald-500/5 via-teal-500/5 to-emerald-500/5' :
              stat.color === 'blue' ? 'from-blue-500/5 via-cyan-500/5 to-blue-500/5' :
              stat.color === 'purple' ? 'from-purple-500/5 via-violet-500/5 to-purple-500/5' :
              'from-gray-500/5 via-gray-400/5 to-gray-500/5'
            }`}></div>
            
            {/* Floating Icon Animation */}
            <div className="absolute top-4 right-4">
              <div className={`p-3 rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 ${
                isDarkMode ? getColorClass(stat.color, 'darkBg') : getColorClass(stat.color, 'bg')
              }`}>
                <div className={`${isDarkMode ? getColorClass(stat.color, 'darkText') : getColorClass(stat.color, 'text')} transition-transform duration-300 group-hover:scale-110`}>
                  {React.cloneElement(stat.icon, { size: 24 })}
                </div>
              </div>
            </div>
            
            <div className="relative z-10">
              {/* Status Badge with Pulse Animation */}
              <div className="flex items-center gap-2 mb-6">
                <div className={`relative inline-flex items-center justify-center`}>
                  <div className={`absolute animate-ping w-3 h-3 rounded-full ${
                    stat.status === 'Alert' ? 'bg-red-500/80' :
                    stat.status === 'Warning' ? 'bg-amber-500/80' :
                    'bg-emerald-500/80'
                  }`}></div>
                  <div className={`relative w-2 h-2 rounded-full ${
                    stat.status === 'Alert' ? 'bg-red-500' :
                    stat.status === 'Warning' ? 'bg-amber-500' :
                    'bg-emerald-500'
                  }`}></div>
                </div>
                <span className={`text-sm font-semibold px-3 py-1 rounded-full backdrop-blur-sm ${
                  stat.status === 'Alert' 
                    ? isDarkMode ? 'bg-red-900/30 text-red-300 border border-red-800/30' : 'bg-red-100 text-red-700 border border-red-200'
                    : stat.status === 'Warning'
                    ? isDarkMode ? 'bg-amber-900/30 text-amber-300 border border-amber-800/30' : 'bg-amber-100 text-amber-700 border border-amber-200'
                    : isDarkMode ? 'bg-emerald-900/30 text-emerald-300 border border-emerald-800/30' : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                }`}>
                  {stat.status}
                </span>
              </div>
              
              {/* Vital Value with Animated Typography */}
              <div className="mb-3">
                <h3 className={`text-4xl font-bold mb-2 bg-gradient-to-r ${
                  isDarkMode
                    ? stat.color === 'rose' ? 'from-rose-300 to-pink-300' :
                      stat.color === 'emerald' ? 'from-emerald-300 to-teal-300' :
                      stat.color === 'blue' ? 'from-blue-300 to-cyan-300' :
                      stat.color === 'purple' ? 'from-purple-300 to-violet-300' :
                      'from-gray-300 to-gray-400'
                    : stat.color === 'rose' ? 'from-rose-600 to-pink-600' :
                      stat.color === 'emerald' ? 'from-emerald-600 to-teal-600' :
                      stat.color === 'blue' ? 'from-blue-600 to-cyan-600' :
                      stat.color === 'purple' ? 'from-purple-600 to-violet-600' :
                      'from-gray-700 to-gray-800'
                } bg-clip-text text-transparent animate-gradient`}>
                  {stat.value}
                </h3>
                <p className={`text-lg font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                  {stat.title}
                </p>
              </div>
              
              {/* Trend Indicator */}
              <div className="flex items-center gap-2 mb-4">
                {stat.trend.includes('↓') ? (
                  <>
                    <TrendingDown className={`w-4 h-4 ${isDarkMode ? 'text-red-400' : 'text-red-500'}`} />
                    <span className={`text-sm font-medium ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>
                      {stat.trend}
                    </span>
                  </>
                ) : stat.trend.includes('↑') ? (
                  <>
                    <TrendingUp className={`w-4 h-4 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-500'}`} />
                    <span className={`text-sm font-medium ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                      {stat.trend}
                    </span>
                  </>
                ) : (
                  <>
                    <Activity className={`w-4 h-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`} />
                    <span className={`text-sm font-medium ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                      {stat.trend}
                    </span>
                  </>
                )}
                <span className={`text-xs ml-auto ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                  vs yesterday
                </span>
              </div>
              
              {/* Description with Fade-in Animation */}
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-5 transition-opacity duration-300 group-hover:opacity-100 opacity-90`}>
                {stat.description}
              </p>
              
              {/* Progress Bar with Animation */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                    Current: {stat.currentValue}
                  </span>
                  <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                    Range: {stat.minValue}-{stat.maxValue}
                  </span>
                </div>
                <div className={`h-2 rounded-full overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ease-out ${
                      isDarkMode
                        ? stat.color === 'rose' ? 'bg-gradient-to-r from-rose-500 to-pink-500' :
                          stat.color === 'emerald' ? 'bg-gradient-to-r from-emerald-500 to-teal-500' :
                          stat.color === 'blue' ? 'bg-gradient-to-r from-blue-500 to-cyan-500' :
                          stat.color === 'purple' ? 'bg-gradient-to-r from-purple-500 to-violet-500' :
                          'bg-gradient-to-r from-gray-500 to-gray-400'
                        : stat.color === 'rose' ? 'bg-gradient-to-r from-rose-400 to-pink-400' :
                          stat.color === 'emerald' ? 'bg-gradient-to-r from-emerald-400 to-teal-400' :
                          stat.color === 'blue' ? 'bg-gradient-to-r from-blue-400 to-cyan-400' :
                          stat.color === 'purple' ? 'bg-gradient-to-r from-purple-400 to-violet-400' :
                          'bg-gradient-to-r from-gray-400 to-gray-300'
                    }`}
                    style={{ 
                      width: `${((stat.currentValue - stat.minValue) / (stat.maxValue - stat.minValue)) * 100}%` 
                    }}
                  ></div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button onClick={() => setVitalCardModal({ open: true, key, tab: 'details' })} className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all duration-300 hover:scale-105 ${
                  isDarkMode
                    ? 'bg-gray-800/50 hover:bg-gray-700/50 text-gray-300'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}>
                  Details
                </button>
                <button onClick={() => setVitalCardModal({ open: true, key, tab: 'history' })} className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all duration-300 hover:scale-105 ${
                  isDarkMode
                    ? 'bg-blue-900/30 hover:bg-blue-800/30 text-blue-300'
                    : 'bg-blue-100 hover:bg-blue-200 text-blue-700'
                }`}>
                  History
                </button>
              </div>
            </div>
            
            {/* Decorative Corner */}
            <div className={`absolute -bottom-6 -right-6 w-20 h-20 rounded-full blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-500 ${
              stat.color === 'rose' ? 'bg-rose-500' :
              stat.color === 'emerald' ? 'bg-emerald-500' :
              stat.color === 'blue' ? 'bg-blue-500' :
              stat.color === 'purple' ? 'bg-purple-500' :
              'bg-gray-500'
            }`}></div>
          </div>
        ))}
      </div>

      {/* Controls and Actions Section */}
      <div className={`rounded-2xl p-6 backdrop-blur-xl border transition-all duration-500 ${
        isDarkMode
          ? 'bg-gradient-to-br from-gray-900/40 via-gray-800/30 to-gray-900/40 border-gray-700/30'
          : 'bg-gradient-to-br from-white/90 via-white/80 to-white/90 border-gray-200/50'
      }`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex-1">
            <h3 className={`text-xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Vitals Analytics & Reporting
            </h3>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Generate detailed reports and customize monitoring settings
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <button
                onClick={() => setReportDropdownOpen(!reportDropdownOpen)}
                className={`px-5 py-3 rounded-xl text-sm font-medium cursor-pointer transition-all duration-300 flex items-center gap-3 min-w-[180px] justify-between ${
                  isDarkMode
                    ? 'bg-gray-800/80 border-gray-700 text-gray-200 hover:bg-gray-700/80'
                    : 'bg-white border-gray-200 text-gray-700 hover:border-rose-300 hover:shadow-md hover:shadow-rose-100'
                } border shadow-sm`}
              >
                <span>{{ '24h': 'Last 24 hours', '7d': 'Last 7 days', '30d': 'Last 30 days' }[reportPeriod]}</span>
                <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${reportDropdownOpen ? 'rotate-90' : 'rotate-0'} ${isDarkMode ? 'text-gray-400' : 'text-rose-400'}`} />
              </button>
              {reportDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setReportDropdownOpen(false)} />
                  <div className={`absolute top-full left-0 mt-2 w-full rounded-xl border shadow-xl z-50 overflow-hidden ${
                    isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                  }`}>
                    {[
                      { value: '24h', label: 'Last 24 hours', icon: <Clock3 size={14} /> },
                      { value: '7d', label: 'Last 7 days', icon: <CalendarDays size={14} /> },
                      { value: '30d', label: 'Last 30 days', icon: <Calendar size={14} /> },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => { setReportPeriod(opt.value); setReportDropdownOpen(false); }}
                        className={`w-full px-4 py-2.5 text-sm text-left flex items-center gap-2.5 transition-all duration-200 ${
                          reportPeriod === opt.value
                            ? isDarkMode
                              ? 'bg-rose-900/30 text-rose-300 font-semibold'
                              : 'bg-rose-50 text-rose-600 font-semibold'
                            : isDarkMode
                            ? 'text-gray-300 hover:bg-gray-700/60'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <span className={reportPeriod === opt.value ? (isDarkMode ? 'text-rose-400' : 'text-rose-500') : (isDarkMode ? 'text-gray-500' : 'text-gray-400')}>{opt.icon}</span>
                        {opt.label}
                        {reportPeriod === opt.value && (
                          <Check size={14} className={`ml-auto ${isDarkMode ? 'text-rose-400' : 'text-rose-500'}`} />
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
            
            <button onClick={downloadVitalsReport} className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 flex items-center gap-2 ${
              isDarkMode
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white'
                : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white'
            }`}>
              <Download size={16} />
              Download Report
            </button>
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {[
            { label: 'Avg Heart Rate', value: `${hr || '--'} BPM`, change: hrStatus === 'Normal' ? '-2 BPM' : `+${hr - 80} BPM`, color: 'rose', isGood: hrStatus === 'Normal' },
            { label: 'Blood Pressure', value: `${sbp || '--'}/${dbp || '--'}`, change: bpStatus === 'Normal' ? 'Optimal' : bpStatus === 'Elevated' ? 'Elevated' : 'High', color: 'blue', isGood: bpStatus === 'Normal' },
            { label: 'Glucose Level', value: `${gl || '--'} mg/dL`, change: glStatus === 'Normal' ? '-5 mg/dL' : `+${gl - 110} mg/dL`, color: 'emerald', isGood: glStatus === 'Normal' },
            { label: 'Sleep Quality', value: healthRisk?.risk_level === 'High' ? '38%' : healthRisk?.risk_level === 'Medium' ? '62%' : '92%', change: healthRisk?.risk_level === 'High' ? '-15%' : healthRisk?.risk_level === 'Medium' ? '-5%' : '+3%', color: 'purple', isGood: healthRisk?.risk_level !== 'High' },
          ].map((stat, idx) => (
            <div key={idx} className={`p-4 rounded-xl backdrop-blur-sm border transition-all duration-300 hover:scale-105 ${
              isDarkMode
                ? 'bg-gray-800/30 border-gray-700/30 hover:bg-gray-700/30'
                : 'bg-white/50 border-gray-200/50 hover:bg-white/80'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <div className={`text-xs font-medium px-2 py-1 rounded-full ${
                  stat.isGood
                    ? isDarkMode ? 'bg-emerald-900/30 text-emerald-300' : 'bg-emerald-100 text-emerald-700'
                    : isDarkMode ? 'bg-red-900/30 text-red-300' : 'bg-red-100 text-red-700'
                }`}>
                  {stat.change}
                </div>
              </div>
              <div className={`text-lg font-bold mb-1 ${
                isDarkMode
                  ? stat.color === 'rose' ? 'text-rose-300' :
                    stat.color === 'blue' ? 'text-blue-300' :
                    stat.color === 'emerald' ? 'text-emerald-300' :
                    stat.color === 'purple' ? 'text-purple-300' : 'text-white'
                  : stat.color === 'rose' ? 'text-rose-600' :
                    stat.color === 'blue' ? 'text-blue-600' :
                    stat.color === 'emerald' ? 'text-emerald-600' :
                    stat.color === 'purple' ? 'text-purple-600' : 'text-gray-900'
              }`}>
                {stat.value}
              </div>
              <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Footer */}
      <BeautifulFooter isDarkMode={isDarkMode} setActiveModule={setActiveModule} />
    </div>
  );
};

export default VitalsMonitoring;
