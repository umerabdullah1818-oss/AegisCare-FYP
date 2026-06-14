import React from 'react';
import {
  Brain,
  FileText,
  Shield,
  FileHeart,
  Calendar,
  Database,
  ClipboardCheck,
  Stethoscope,
  Check,
  Download,
  BrainCircuit,
  Sparkles,
  Heart,
  Activity,
  Droplets,
  ChevronRight,
  History,
} from 'lucide-react';
import { getColorClass } from '../helpers';
import BeautifulFooter from './BeautifulFooter';

const HealthReports = (props) => {
  const {
    isDarkMode,
    setShowHealthTrends,
    allReportsData,
    reportStartDate,
    setReportStartDate,
    reportEndDate,
    setReportEndDate,
    selectedReportType,
    setSelectedReportType,
    generateHealthReport,
    healthRisk,
    anomalyResult,
    cognitiveAssessment,
    healthRiskLoading,
    hr,
    hrStatus,
    sbp,
    dbp,
    bpStatus,
    gl,
    glStatus,
    setShowAIInsights,
    setShowAllReports,
    getReportIcon,
    setViewingReport,
    downloadSingleReport,
    setActiveModule,
  } = props;

  return (
          <div className="space-y-6">
            {/* Modern Header with Animated Background */}
            <div className={`relative rounded-3xl p-6 overflow-hidden backdrop-blur-xl border transition-all duration-500 ${
              isDarkMode
                ? 'bg-gradient-to-br from-gray-950/80 via-blue-950/30 to-indigo-950/20 border-blue-800/30 shadow-2xl shadow-blue-950/30'
                : 'bg-gradient-to-br from-white/90 via-blue-50/60 to-indigo-50/40 border-blue-200/50 shadow-2xl shadow-blue-100/50'
            }`}>
              {/* Animated Background Elements */}
              <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-r from-cyan-500/5 to-sky-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
              </div>
              
              <div className="relative z-10">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
                  <div>
                    <h2 className={`text-3xl font-bold mb-3 bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-500 bg-clip-text text-transparent animate-gradient`}>
                      Health Intelligence Hub
                    </h2>
                    <p className={`text-base ${isDarkMode ? 'text-blue-200/80' : 'text-blue-700/80'}`}>
                      AI-powered insights and comprehensive health analysis with predictive analytics
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap gap-3">
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 hover:scale-105 ${
                      isDarkMode 
                        ? 'bg-blue-950/40 border border-blue-800/50 backdrop-blur-sm' 
                        : 'bg-blue-100 border border-blue-200 backdrop-blur-sm'
                    }`}>
                      <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                      <span className={`text-sm font-medium ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                        AI Analysis Active
                      </span>
                    </div>
                    <button onClick={() => setShowHealthTrends(true)} className={`px-4 py-2 rounded-full font-medium transition-all duration-300 hover:scale-105 flex items-center gap-2 ${
                      isDarkMode
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white'
                        : 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white'
                    }`}>
                      <Brain className="w-4 h-4" />
                      View Trends
                    </button>
                  </div>
                </div>

                {/* Reports Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  {(() => {
                    const aiScore = Math.round([92, 95, 88, 90, 97, 72].reduce((a, b) => a + b, 0) / 6);
                    const riskCount = allReportsData.filter(r => r.category === 'Lab Results' && r.metrics && Object.values(r.metrics).some(v => typeof v === 'string' && v.toLowerCase().includes('high'))).length;
                    return [
                      { label: 'Generated Reports', value: String(allReportsData.length), icon: <FileText className="w-5 h-5" />, color: 'blue', trend: `+${allReportsData.filter(r => r.fullDate >= '2024-11-01').length} this month` },
                      { label: 'AI Predictions', value: `${aiScore}%`, icon: <Brain className="w-5 h-5" />, color: 'indigo', trend: 'Accuracy' },
                      { label: 'Risk Detections', value: String(riskCount), icon: <Shield className="w-5 h-5" />, color: 'emerald', trend: riskCount === 0 ? 'All Clear' : `${riskCount} Found` },
                    ];
                  })().map((stat, idx) => (
                    <div key={idx} className={`group rounded-2xl p-5 backdrop-blur-lg border transition-all duration-300 hover:scale-105 hover:shadow-xl relative overflow-hidden ${
                      isDarkMode
                        ? 'bg-gradient-to-br from-gray-900/40 to-gray-950/30 border-gray-800/30'
                        : 'bg-gradient-to-br from-white/80 to-gray-50/80 border-gray-200/40'
                    }`}>
                      {/* Card glow effect */}
                      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r ${
                        stat.color === 'blue' ? 'from-blue-500/5 via-indigo-500/5 to-blue-500/5' :
                        stat.color === 'indigo' ? 'from-indigo-500/5 via-purple-500/5 to-indigo-500/5' :
                        'from-emerald-500/5 via-teal-500/5 to-emerald-500/5'
                      }`}></div>
                      
                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-3">
                          <div className={`p-3 rounded-xl transition-all duration-300 group-hover:rotate-12 ${
                            isDarkMode ? getColorClass(stat.color, 'darkBg') : getColorClass(stat.color, 'bg')
                          }`}>
                            <div className={isDarkMode ? getColorClass(stat.color, 'darkText') : getColorClass(stat.color, 'text')}>
                              {stat.icon}
                            </div>
                          </div>
                          <span className={`text-xs font-semibold px-2 py-1 rounded-full backdrop-blur-sm ${
                            isDarkMode 
                              ? stat.color === 'blue' ? 'bg-blue-900/30 text-blue-300' : 
                                stat.color === 'indigo' ? 'bg-indigo-900/30 text-indigo-300' :
                                'bg-emerald-900/30 text-emerald-300'
                              : stat.color === 'blue' ? 'bg-blue-100 text-blue-700' : 
                                stat.color === 'indigo' ? 'bg-indigo-100 text-indigo-700' :
                                'bg-emerald-100 text-emerald-700'
                          }`}>
                            {stat.trend}
                          </span>
                        </div>
                        <h3 className={`text-3xl font-bold mb-2 bg-gradient-to-r ${
                          isDarkMode
                            ? stat.color === 'blue' ? 'from-blue-300 to-cyan-300' :
                              stat.color === 'indigo' ? 'from-indigo-300 to-purple-300' :
                              'from-emerald-300 to-teal-300'
                            : stat.color === 'blue' ? 'from-blue-600 to-cyan-600' :
                              stat.color === 'indigo' ? 'from-indigo-600 to-purple-600' :
                              'from-emerald-600 to-teal-600'
                        } bg-clip-text text-transparent animate-gradient`}>
                          {stat.value}
                        </h3>
                        <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {stat.label}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Report Generation Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Generate Report Card */}
              <div className={`group relative rounded-3xl p-6 backdrop-blur-xl border-2 overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-xl ${
                isDarkMode
                  ? 'bg-gradient-to-br from-gray-950/40 via-gray-900/30 to-gray-950/40 border-blue-800/30'
                  : 'bg-gradient-to-br from-white/90 via-white/80 to-white/90 border-blue-200/50'
              }`}>
                {/* Animated Background */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className={`text-2xl font-bold mb-2 flex items-center gap-3 ${
                        isDarkMode ? 'text-blue-300' : 'text-blue-600'
                      }`}>
                        <FileHeart className="w-7 h-7" />
                        Generate Comprehensive Report
                      </h3>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Create detailed health analysis with AI-powered insights
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-5">
                    {/* Date Range Selector with Animation */}
                    <div className="space-y-3">
                      <label className={`block text-sm font-semibold flex items-center gap-2 ${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`}>
                        <Calendar className="w-4 h-4" />
                        Date Range Selection
                      </label>
                      <div className="flex gap-3">
                        <div className="flex-1 relative group/date">
                          <input type="date" value={reportStartDate} onChange={e => setReportStartDate(e.target.value)} className={`w-full px-4 py-3.5 rounded-2xl text-sm backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] ${
                            isDarkMode
                              ? 'bg-gray-900/50 border-blue-800/30 text-gray-300 hover:bg-gray-800/50 focus:ring-2 focus:ring-blue-500'
                              : 'bg-white/80 border-blue-200 text-gray-700 hover:bg-white focus:ring-2 focus:ring-blue-400'
                          } border`} />
                          <span className={`absolute -top-2 left-3 px-2 text-xs font-medium ${
                            isDarkMode ? 'bg-gray-900 text-blue-400' : 'bg-white text-blue-600'
                          }`}>
                            Start Date
                          </span>
                        </div>
                        <div className="self-center">
                          <span className={`text-lg font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`}>
                            →
                          </span>
                        </div>
                        <div className="flex-1 relative group/date">
                          <input type="date" value={reportEndDate} onChange={e => setReportEndDate(e.target.value)} className={`w-full px-4 py-3.5 rounded-2xl text-sm backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] ${
                            isDarkMode
                              ? 'bg-gray-900/50 border-blue-800/30 text-gray-300 hover:bg-gray-800/50 focus:ring-2 focus:ring-blue-500'
                              : 'bg-white/80 border-blue-200 text-gray-700 hover:bg-white focus:ring-2 focus:ring-blue-400'
                          } border`} />
                          <span className={`absolute -top-2 left-3 px-2 text-xs font-medium ${
                            isDarkMode ? 'bg-gray-900 text-blue-400' : 'bg-white text-blue-600'
                          }`}>
                            End Date
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Report Type Selection */}
                    <div className="space-y-3">
                      <label className={`block text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Report Type
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { label: 'PDF Report', icon: <FileText className="w-4 h-4" />, color: 'blue' },
                          { label: 'Excel Data', icon: <Database className="w-4 h-4" />, color: 'emerald' },
                          { label: 'Summary', icon: <ClipboardCheck className="w-4 h-4" />, color: 'purple' },
                          { label: 'Doctor View', icon: <Stethoscope className="w-4 h-4" />, color: 'indigo' },
                        ].map((type, idx) => (
                          <label key={idx} onClick={() => setSelectedReportType(type.label)} className={`relative rounded-xl p-3 border-2 cursor-pointer transition-all duration-300 hover:scale-105 ${
                            selectedReportType === type.label
                              ? isDarkMode
                                ? 'bg-blue-950/40 border-blue-500 ring-2 ring-blue-500/30'
                                : 'bg-blue-50 border-blue-500 ring-2 ring-blue-500/20'
                              : isDarkMode
                              ? 'bg-gray-900/30 border-gray-800 hover:border-blue-600/50'
                              : 'bg-white/50 border-gray-200 hover:border-blue-400/50'
                          }`}>
                            <input type="radio" name="reportType" value={type.label} checked={selectedReportType === type.label} onChange={() => setSelectedReportType(type.label)} className="sr-only" />
                            <div className="flex items-center gap-2">
                              <div className={`p-2 rounded-lg ${
                                selectedReportType === type.label
                                  ? isDarkMode ? 'bg-blue-900/50' : 'bg-blue-100'
                                  : isDarkMode ? getColorClass(type.color, 'darkBg') : getColorClass(type.color, 'bg')
                              }`}>
                                <div className={selectedReportType === type.label
                                  ? isDarkMode ? 'text-blue-300' : 'text-blue-600'
                                  : isDarkMode ? getColorClass(type.color, 'darkText') : getColorClass(type.color, 'text')
                                }>
                                  {type.icon}
                                </div>
                              </div>
                              <span className={`text-sm font-medium ${
                                selectedReportType === type.label
                                  ? isDarkMode ? 'text-blue-300' : 'text-blue-700'
                                  : isDarkMode ? 'text-gray-300' : 'text-gray-700'
                              }`}>
                                {type.label}
                              </span>
                              {selectedReportType === type.label && (
                                <Check className={`w-4 h-4 ml-auto ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                              )}
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    {/* Generate Button with Animation */}
                    <button onClick={generateHealthReport} className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all duration-300 
                      hover:scale-105 active:scale-95 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl 
                      relative overflow-hidden group/btn ${
                      isDarkMode
                        ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:via-indigo-500 hover:to-blue-600 text-white'
                        : 'bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600 hover:from-blue-600 hover:via-indigo-600 hover:to-blue-700 text-white'
                    }`}>
                      {/* Button shine effect */}
                      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent 
                        -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 ease-out"></span>
                      
                      <Download className="w-5 h-5 relative z-10" />
                      <span className="relative z-10 font-medium">Generate {selectedReportType}</span>
                      
                      {/* Glow effect */}
                      <div className={`absolute -inset-1 rounded-2xl blur opacity-30 group-hover/btn:opacity-50 transition-opacity duration-300 ${
                        isDarkMode 
                          ? 'bg-gradient-to-r from-blue-500 to-indigo-500' 
                          : 'bg-gradient-to-r from-blue-400 to-indigo-400'
                      }`}></div>
                    </button>
                  </div>
                </div>
              </div>

              {/* AI Insights Card */}
              <div className={`group relative rounded-3xl p-6 backdrop-blur-xl border-2 overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-xl ${
                isDarkMode
                  ? 'bg-gradient-to-br from-gray-950/40 via-gray-900/30 to-gray-950/40 border-indigo-800/30'
                  : 'bg-gradient-to-br from-white/90 via-white/80 to-white/90 border-indigo-200/50'
              }`}>
                {/* Animated Background */}
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className={`text-2xl font-bold mb-2 flex items-center gap-3 ${
                        isDarkMode ? 'text-indigo-300' : 'text-indigo-600'
                      }`}>
                        <BrainCircuit className="w-7 h-7" />
                        AI Health Insights
                      </h3>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Based on your recent health data analysis:
                      </p>
                    </div>
                    <div className={`p-2 rounded-lg ${
                      isDarkMode ? 'bg-indigo-950/40' : 'bg-indigo-100'
                    }`}>
                      <Sparkles className={`w-5 h-5 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {/* ML-Powered Health Risk Insight */}
                    {healthRisk && (
                      <div className={`group/insight rounded-2xl p-4 backdrop-blur-sm border transition-all duration-300 hover:scale-[1.02] ${
                        isDarkMode
                          ? 'bg-gray-900/30 border-gray-800 hover:border-indigo-700/30'
                          : 'bg-white/50 border-gray-200 hover:border-indigo-300/50'
                      }`}>
                        <div className="flex items-start gap-3">
                          <div className={`p-2.5 rounded-xl ${
                            healthRisk.risk_level === 'Low'
                              ? isDarkMode ? 'bg-emerald-900/40' : 'bg-emerald-100'
                              : healthRisk.risk_level === 'Medium'
                              ? isDarkMode ? 'bg-amber-900/40' : 'bg-amber-100'
                              : isDarkMode ? 'bg-red-900/40' : 'bg-red-100'
                          }`}>
                            <Shield className={`w-4 h-4 ${
                              healthRisk.risk_level === 'Low' ? 'text-emerald-500' : healthRisk.risk_level === 'Medium' ? 'text-amber-500' : 'text-red-500'
                            }`} />
                          </div>
                          <div className="flex-1">
                            <p className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                              ML Health Risk: <span className="font-bold">{healthRisk.risk_level}</span>
                              {healthRisk.risk_factors?.length > 0 && ` — ${healthRisk.risk_factors.join(', ')}`}
                            </p>
                            <div className="flex items-center justify-between">
                              <div className={`flex items-center gap-2 text-xs font-medium ${
                                healthRisk.risk_level === 'Low' ? 'text-emerald-500' : healthRisk.risk_level === 'Medium' ? 'text-amber-500' : 'text-red-500'
                              }`}>
                                <div className="w-2 h-2 rounded-full bg-current"></div>
                                Confidence: {Math.round((healthRisk.probabilities?.[healthRisk.risk_level.toLowerCase()] || 0) * 100)}%
                              </div>
                              <div className={`text-xs px-2 py-1 rounded-full ${
                                healthRisk.risk_level === 'Low'
                                  ? isDarkMode ? 'bg-emerald-900/30 text-emerald-300' : 'bg-emerald-100 text-emerald-700'
                                  : healthRisk.risk_level === 'Medium'
                                  ? isDarkMode ? 'bg-amber-900/30 text-amber-300' : 'bg-amber-100 text-amber-700'
                                  : isDarkMode ? 'bg-red-900/30 text-red-300' : 'bg-red-100 text-red-700'
                              }`}>{healthRisk.risk_level === 'Low' ? 'Healthy' : healthRisk.risk_level === 'Medium' ? 'Monitor' : 'Alert'}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {/* ML Anomaly Detection */}
                    {anomalyResult && (
                      <div className={`group/insight rounded-2xl p-4 backdrop-blur-sm border transition-all duration-300 hover:scale-[1.02] ${
                        isDarkMode
                          ? 'bg-gray-900/30 border-gray-800 hover:border-indigo-700/30'
                          : 'bg-white/50 border-gray-200 hover:border-indigo-300/50'
                      }`}>
                        <div className="flex items-start gap-3">
                          <div className={`p-2.5 rounded-xl ${
                            !anomalyResult.is_anomaly ? isDarkMode ? 'bg-emerald-900/40' : 'bg-emerald-100' : isDarkMode ? 'bg-red-900/40' : 'bg-red-100'
                          }`}>
                            <Activity className={`w-4 h-4 ${!anomalyResult.is_anomaly ? 'text-emerald-500' : 'text-red-500'}`} />
                          </div>
                          <div className="flex-1">
                            <p className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                              {anomalyResult.is_anomaly
                                ? `Vitals anomaly (${anomalyResult.severity}): ${anomalyResult.alerts?.map(a => a.message).join(', ') || 'Unusual pattern'}`
                                : 'All vitals normal — no anomalies detected'}
                            </p>
                            <div className="flex items-center justify-between">
                              <div className={`flex items-center gap-2 text-xs font-medium ${!anomalyResult.is_anomaly ? 'text-emerald-500' : 'text-red-500'}`}>
                                <div className="w-2 h-2 rounded-full bg-current"></div>
                                Anomaly Detection
                              </div>
                              <div className={`text-xs px-2 py-1 rounded-full ${
                                !anomalyResult.is_anomaly
                                  ? isDarkMode ? 'bg-emerald-900/30 text-emerald-300' : 'bg-emerald-100 text-emerald-700'
                                  : isDarkMode ? 'bg-red-900/30 text-red-300' : 'bg-red-100 text-red-700'
                              }`}>{anomalyResult.is_anomaly ? 'Anomaly' : 'Normal'}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {/* Cognitive Assessment */}
                    {cognitiveAssessment && (
                      <div className={`group/insight rounded-2xl p-4 backdrop-blur-sm border transition-all duration-300 hover:scale-[1.02] ${
                        isDarkMode
                          ? 'bg-gray-900/30 border-gray-800 hover:border-indigo-700/30'
                          : 'bg-white/50 border-gray-200 hover:border-indigo-300/50'
                      }`}>
                        <div className="flex items-start gap-3">
                          <div className={`p-2.5 rounded-xl ${
                            cognitiveAssessment.status_code === 0
                              ? isDarkMode ? 'bg-emerald-900/40' : 'bg-emerald-100'
                              : cognitiveAssessment.status_code === 1
                              ? isDarkMode ? 'bg-amber-900/40' : 'bg-amber-100'
                              : isDarkMode ? 'bg-red-900/40' : 'bg-red-100'
                          }`}>
                            <Brain className={`w-4 h-4 ${
                              cognitiveAssessment.status_code === 0 ? 'text-emerald-500' : cognitiveAssessment.status_code === 1 ? 'text-amber-500' : 'text-red-500'
                            }`} />
                          </div>
                          <div className="flex-1">
                            <p className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                              Cognitive: {cognitiveAssessment.status} — {cognitiveAssessment.recommendation}
                            </p>
                            <div className="flex items-center justify-between">
                              <div className={`flex items-center gap-2 text-xs font-medium ${
                                cognitiveAssessment.status_code === 0 ? 'text-emerald-500' : cognitiveAssessment.status_code === 1 ? 'text-amber-500' : 'text-red-500'
                              }`}>
                                <div className="w-2 h-2 rounded-full bg-current"></div>
                                Cognitive Assessment
                              </div>
                              <div className={`text-xs px-2 py-1 rounded-full ${
                                cognitiveAssessment.status_code === 0
                                  ? isDarkMode ? 'bg-emerald-900/30 text-emerald-300' : 'bg-emerald-100 text-emerald-700'
                                  : cognitiveAssessment.status_code === 1
                                  ? isDarkMode ? 'bg-amber-900/30 text-amber-300' : 'bg-amber-100 text-amber-700'
                                  : isDarkMode ? 'bg-red-900/30 text-red-300' : 'bg-red-100 text-red-700'
                              }`}>{cognitiveAssessment.status}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {healthRiskLoading && (
                      <div className={`rounded-2xl p-4 text-center ${isDarkMode ? 'bg-gray-900/30' : 'bg-white/50'}`}>
                        <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Loading ML health insights...</p>
                      </div>
                    )}
                    {/* Fallback static insights */}
                    {[
                      { icon: <Heart className="w-4 h-4" />, insight: `Heart rate ${hrStatus === 'Normal' ? 'stable' : hrStatus === 'Elevated' ? 'elevated' : 'abnormal'} at ${hr || '--'} BPM — ${hrStatus === 'Normal' ? 'within healthy range.' : 'monitor closely.'}`, status: hrStatus === 'Normal' ? 'positive' : 'monitor', confidence: '94%', color: hrStatus === 'Normal' ? 'emerald' : 'amber' },
                      { icon: <Activity className="w-4 h-4" />, insight: `Blood pressure ${sbp || '--'}/${dbp || '--'} mmHg — ${bpStatus === 'Normal' ? 'optimal reading.' : bpStatus === 'Elevated' ? 'elevated, monitor closely.' : 'high, consult your doctor.'}`, status: bpStatus === 'Normal' ? 'positive' : 'monitor', confidence: '91%', color: bpStatus === 'Normal' ? 'blue' : 'amber' },
                      { icon: <Droplets className="w-4 h-4" />, insight: `Blood glucose at ${gl || '--'} mg/dL — ${glStatus === 'Normal' ? 'well-controlled.' : 'needs attention, review meal plan.'}`, status: glStatus === 'Normal' ? 'positive' : 'monitor', confidence: '87%', color: glStatus === 'Normal' ? 'emerald' : 'amber' },
                    ].map((insight, idx) => (
                      <div key={idx} className={`group/insight rounded-2xl p-4 backdrop-blur-sm border transition-all duration-300 hover:scale-[1.02] ${
                        isDarkMode
                          ? 'bg-gray-900/30 border-gray-800 hover:border-indigo-700/30'
                          : 'bg-white/50 border-gray-200 hover:border-indigo-300/50'
                      }`}>
                        <div className="flex items-start gap-3">
                          <div className={`p-2.5 rounded-xl transition-all duration-300 group-hover/insight:rotate-12 ${
                            isDarkMode ? getColorClass(insight.color, 'darkBg') : getColorClass(insight.color, 'bg')
                          }`}>
                            <div className={isDarkMode ? getColorClass(insight.color, 'darkText') : getColorClass(insight.color, 'text')}>
                              {insight.icon}
                            </div>
                          </div>
                          <div className="flex-1">
                            <p className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                              {insight.insight}
                            </p>
                            <div className="flex items-center justify-between">
                              <div className={`flex items-center gap-2 text-xs font-medium ${
                                insight.status === 'positive' 
                                  ? isDarkMode ? 'text-emerald-400' : 'text-emerald-600'
                                  : isDarkMode ? 'text-amber-400' : 'text-amber-600'
                              }`}>
                                <div className="w-2 h-2 rounded-full bg-current"></div>
                                AI Confidence: {insight.confidence}
                              </div>
                              <div className={`text-xs px-2 py-1 rounded-full backdrop-blur-sm ${
                                insight.status === 'positive'
                                  ? isDarkMode ? 'bg-emerald-900/30 text-emerald-300' : 'bg-emerald-100 text-emerald-700'
                                  : isDarkMode ? 'bg-amber-900/30 text-amber-300' : 'bg-amber-100 text-amber-700'
                              }`}>
                                {insight.status === 'positive' ? 'Positive' : 'Monitor'}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* View All Insights Button */}
                  <button onClick={() => setShowAIInsights(true)} className={`w-full mt-6 py-3 rounded-xl font-medium transition-all duration-300 
                    hover:scale-105 active:scale-95 flex items-center justify-center gap-2 ${
                    isDarkMode
                      ? 'bg-gray-800/50 border-gray-700 hover:bg-gray-700/50 text-gray-300 border'
                      : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-700 border'
                  }`}>
                    <span>View All Insights</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Reports Section */}
            <div className={`rounded-3xl p-6 backdrop-blur-xl border-2 transition-all duration-500 ${
              isDarkMode
                ? 'bg-gradient-to-br from-gray-950/40 via-gray-900/30 to-gray-950/40 border-cyan-800/30'
                : 'bg-gradient-to-br from-white/90 via-white/80 to-white/90 border-cyan-200/50'
            }`}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className={`text-2xl font-bold mb-2 flex items-center gap-3 ${
                    isDarkMode ? 'text-cyan-300' : 'text-cyan-600'
                  }`}>
                    <History className="w-6 h-6" />
                    Recent Reports
                  </h3>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Your last 4 generated health reports
                  </p>
                </div>
                <button onClick={() => setShowAllReports(true)} className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 hover:scale-105 flex items-center gap-2 ${
                  isDarkMode
                    ? 'bg-gray-800/50 border-gray-700 hover:bg-gray-700/50 text-cyan-400 border'
                    : 'bg-white border-gray-200 hover:bg-gray-50 text-cyan-600 border'
                }`}>
                  View All
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {allReportsData.slice(0, 4).map((report, idx) => (
                  <div key={idx} className={`group relative rounded-2xl p-4 backdrop-blur-sm border transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                    isDarkMode
                      ? 'bg-gray-900/30 border-gray-800 hover:border-cyan-700/30'
                      : 'bg-white/50 border-gray-200 hover:border-cyan-300/50'
                  }`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className={`p-2 rounded-lg ${
                        isDarkMode ? 'bg-cyan-950/40' : 'bg-cyan-100'
                      }`}>
                        <div className={isDarkMode ? 'text-cyan-400' : 'text-cyan-600'}>
                          {getReportIcon(report.icon)}
                        </div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full backdrop-blur-sm ${
                        report.type === 'PDF' 
                          ? isDarkMode ? 'bg-red-900/30 text-red-300' : 'bg-red-100 text-red-700'
                          : isDarkMode ? 'bg-emerald-900/30 text-emerald-300' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {report.type}
                      </span>
                    </div>
                    <h4 className={`font-bold text-sm mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                      {report.name}
                    </h4>
                    <p className={`text-xs mb-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                      {report.date} • {report.size}
                    </p>
                    <div className="flex gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button onClick={() => setViewingReport(report)} className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 hover:scale-105 ${
                        isDarkMode
                          ? 'bg-gray-800/50 hover:bg-gray-700/50 text-gray-300'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}>
                        View
                      </button>
                      <button onClick={() => downloadSingleReport(report)} className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 hover:scale-105 ${
                        isDarkMode
                          ? 'bg-cyan-900/30 hover:bg-cyan-800/30 text-cyan-300'
                          : 'bg-cyan-100 hover:bg-cyan-200 text-cyan-700'
                      }`}>
                        Download
                      </button>
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

export default HealthReports;
