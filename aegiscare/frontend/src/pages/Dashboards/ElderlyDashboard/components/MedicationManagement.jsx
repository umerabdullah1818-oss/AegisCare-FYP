import React from 'react';
import {
  Pill,
  ClipboardCheck,
  Clock,
  Calendar,
  Bell,
  Clock3,
  Syringe,
  History,
  AlertCircle
} from 'lucide-react';
import { getColorClass } from '../helpers';
import BeautifulFooter from './BeautifulFooter';

const MedicationManagement = (props) => {
  const {
    isDarkMode,
    medSummary,
    setShowAddMedModal,
    medications,
    medsLoading,
    getMedColor,
    handleMarkMedication,
    handleSetReminder,
    medRefills,
    setShowScheduleRefill,
    medHistory,
    setShowMedHistory,
    setActiveModule,
  } = props;

  return (
          <div className="space-y-6">
            {/* Modern Header with Animated Background */}
            <div className={`relative rounded-3xl p-6 overflow-hidden backdrop-blur-xl border transition-all duration-500 ${
              isDarkMode
                ? 'bg-gradient-to-br from-gray-950/80 via-cyan-950/30 to-blue-950/20 border-cyan-800/30 shadow-2xl shadow-cyan-950/30'
                : 'bg-gradient-to-br from-white/90 via-cyan-50/60 to-blue-50/40 border-cyan-200/50 shadow-2xl shadow-cyan-100/50'
            }`}>
              {/* Animated Background Elements */}
              <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-r from-sky-500/5 to-indigo-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
              </div>
              
              <div className="relative z-10">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
                  <div>
                    <h2 className={`text-3xl font-bold mb-3 bg-gradient-to-r from-cyan-500 via-blue-500 to-sky-500 bg-clip-text text-transparent animate-gradient`}>
                      Medication Management Hub
                    </h2>
                    <p className={`text-base ${isDarkMode ? 'text-cyan-200/80' : 'text-cyan-700/80'}`}>
                      Smart tracking, reminders, and adherence monitoring
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap gap-3">
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 hover:scale-105 ${
                      isDarkMode 
                        ? 'bg-cyan-950/40 border border-cyan-800/50 backdrop-blur-sm' 
                        : 'bg-cyan-100 border border-cyan-200 backdrop-blur-sm'
                    }`}>
                      <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></div>
                      <span className={`text-sm font-medium ${isDarkMode ? 'text-cyan-300' : 'text-cyan-700'}`}>
                        Adherence: {medSummary.adherenceRate}%
                      </span>
                    </div>
                    <button onClick={() => setShowAddMedModal(true)} className={`px-4 py-2 rounded-full font-medium transition-all duration-300 hover:scale-105 flex items-center gap-2 ${
                      isDarkMode
                        ? 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white'
                        : 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white'
                    }`}>
                      <Pill className="w-4 h-4" />
                      Add Medication
                    </button>
                  </div>
                </div>

                {/* Medication Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  {[
                    { label: 'Today\'s Medications', value: String(medSummary.total), icon: <Pill className="w-5 h-5" />, color: 'cyan', trend: medSummary.pending === 0 ? 'All Taken' : `${medSummary.pending} Pending` },
                    { label: 'Adherence Rate', value: `${medSummary.adherenceRate}%`, icon: <ClipboardCheck className="w-5 h-5" />, color: 'emerald', trend: medSummary.adherenceRate >= 80 ? 'Excellent' : 'Needs Improvement' },
                    { label: 'Taken Today', value: String(medSummary.taken), icon: <Clock className="w-5 h-5" />, color: 'blue', trend: `of ${medSummary.total}` },
                  ].map((stat, idx) => (
                    <div key={idx} className={`group rounded-2xl p-5 backdrop-blur-lg border transition-all duration-300 hover:scale-105 hover:shadow-xl relative overflow-hidden ${
                      isDarkMode
                        ? 'bg-gradient-to-br from-gray-900/40 to-gray-950/30 border-gray-800/30'
                        : 'bg-gradient-to-br from-white/80 to-gray-50/80 border-gray-200/40'
                    }`}>
                      {/* Card glow effect */}
                      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r ${
                        stat.color === 'cyan' ? 'from-cyan-500/5 via-blue-500/5 to-cyan-500/5' :
                        stat.color === 'emerald' ? 'from-emerald-500/5 via-green-500/5 to-emerald-500/5' :
                        'from-blue-500/5 via-indigo-500/5 to-blue-500/5'
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
                              ? stat.color === 'cyan' ? 'bg-cyan-900/30 text-cyan-300' : 
                                stat.color === 'emerald' ? 'bg-emerald-900/30 text-emerald-300' :
                                'bg-blue-900/30 text-blue-300'
                              : stat.color === 'cyan' ? 'bg-cyan-100 text-cyan-700' : 
                                stat.color === 'emerald' ? 'bg-emerald-100 text-emerald-700' :
                                'bg-blue-100 text-blue-700'
                          }`}>
                            {stat.trend}
                          </span>
                        </div>
                        <h3 className={`text-3xl font-bold mb-2 bg-gradient-to-r ${
                          isDarkMode
                            ? stat.color === 'cyan' ? 'from-cyan-300 to-blue-300' :
                              stat.color === 'emerald' ? 'from-emerald-300 to-green-300' :
                              'from-blue-300 to-indigo-300'
                            : stat.color === 'cyan' ? 'from-cyan-600 to-blue-600' :
                              stat.color === 'emerald' ? 'from-emerald-600 to-green-600' :
                              'from-blue-600 to-indigo-600'
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

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Today's Medication Schedule */}
              <div className={`lg:col-span-2 group relative rounded-3xl p-6 backdrop-blur-xl border-2 overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-xl ${
                isDarkMode
                  ? 'bg-gradient-to-br from-gray-950/40 via-gray-900/30 to-gray-950/40 border-cyan-800/30'
                  : 'bg-gradient-to-br from-white/90 via-white/80 to-white/90 border-cyan-200/50'
              }`}>
                {/* Animated Background */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className={`text-2xl font-bold mb-2 flex items-center gap-3 ${
                        isDarkMode ? 'text-cyan-300' : 'text-cyan-600'
                      }`}>
                        <Calendar className="w-7 h-7" />
                        Today's Medication Schedule
                      </h3>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Track and manage your daily medications
                      </p>
                    </div>
                    <div className={`p-2 rounded-lg ${
                      isDarkMode ? 'bg-cyan-950/40' : 'bg-cyan-100'
                    }`}>
                      <Bell className={`w-5 h-5 ${isDarkMode ? 'text-cyan-400' : 'text-cyan-600'}`} />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {medications.length === 0 && !medsLoading ? (
                      <div className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        <Pill className="w-10 h-10 mx-auto mb-3 opacity-40" />
                        <p className="text-lg font-medium">No medications yet</p>
                        <p className="text-sm mt-1">Click "Add Medication" to get started</p>
                      </div>
                    ) : medications.map((med, idx) => {
                      const medColor = getMedColor(med.type);
                      return (
                      <div key={med._id || idx} className={`group/med rounded-2xl p-5 backdrop-blur-sm border-2 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${
                        isDarkMode
                          ? 'bg-gradient-to-br from-gray-900/30 via-gray-800/20 to-gray-900/30 border-gray-800/30 hover:border-cyan-700/50'
                          : 'bg-gradient-to-br from-white/50 via-gray-50/40 to-white/50 border-gray-200/50 hover:border-cyan-300/50'
                      }`}>
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          {/* Left Section - Medication Info */}
                          <div className="flex items-start gap-4">
                            <div className={`p-4 rounded-xl transition-all duration-300 group-hover/med:rotate-12 ${
                              isDarkMode ? getColorClass(medColor, 'darkBg') : getColorClass(medColor, 'bg')
                            }`}>
                              <div className={isDarkMode ? getColorClass(medColor, 'darkText') : getColorClass(medColor, 'text')}>
                                <Pill className="w-6 h-6" />
                              </div>
                            </div>
                            
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className={`text-lg font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                                  {med.name}
                                </h4>
                                <span className={`text-xs px-2 py-1 rounded-full backdrop-blur-sm ${
                                  isDarkMode ? 'bg-gray-800/50' : getColorClass(medColor, 'bg')
                                }`}>
                                  <span className={isDarkMode ? getColorClass(medColor, 'darkText') : getColorClass(medColor, 'text')}>
                                    {med.type}
                                  </span>
                                </span>
                              </div>
                              {/* Approval Status */}
                              <span className={`text-xs px-2 py-1 rounded-full font-semibold backdrop-blur-sm ${
                                med.approvalStatus === 'approved'
                                  ? isDarkMode ? 'bg-emerald-900/40 text-emerald-300 border border-emerald-700/30' : 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                                  : med.approvalStatus === 'rejected'
                                  ? isDarkMode ? 'bg-rose-900/40 text-rose-300 border border-rose-700/30' : 'bg-rose-100 text-rose-700 border border-rose-300'
                                  : isDarkMode ? 'bg-amber-900/40 text-amber-300 border border-amber-700/30' : 'bg-amber-100 text-amber-700 border border-amber-300'
                              }`}>
                                {med.approvalStatus === 'approved' ? `✅ Approved${med.approvedBy ? ` by ${med.approvedBy.firstName || ''}` : ''}` 
                                  : med.approvalStatus === 'rejected' ? `❌ Rejected${med.approvedBy ? ` by ${med.approvedBy.firstName || ''}` : ''}` 
                                  : '⏳ Pending'}
                              </span>
                              
                              <div className="flex items-center gap-3 mb-3">
                                <div className={`flex items-center gap-1.5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                  <div className={`p-1 rounded ${
                                    isDarkMode ? 'bg-gray-800/50' : 'bg-gray-100'
                                  }`}>
                                    <Clock3 className="w-3 h-3" />
                                  </div>
                                  <span className="text-sm font-medium">{med.scheduledTime}</span>
                                </div>
                                
                                <div className={`flex items-center gap-1.5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                  <div className={`p-1 rounded ${
                                    isDarkMode ? 'bg-gray-800/50' : 'bg-gray-100'
                                  }`}>
                                    <Syringe className="w-3 h-3" />
                                  </div>
                                  <span className="text-sm font-medium">{med.dosage}</span>
                                </div>
                              </div>
                              
                              {/* Time Indicator */}
                              <div className="relative pt-1">
                                <div className="flex justify-between text-xs mb-1">
                                  <span className={isDarkMode ? 'text-gray-500' : 'text-gray-600'}>Next Dose</span>
                                  <span className={`font-medium ${isDarkMode ? 'text-cyan-300' : 'text-cyan-600'}`}>
                                    {med.todayStatus === 'taken' ? 'Completed' : 'Upcoming'}
                                  </span>
                                </div>
                                <div className={`h-1.5 rounded-full overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
                                  <div 
                                    className={`h-full rounded-full transition-all duration-1000 ease-out ${
                                      med.todayStatus === 'taken'
                                        ? isDarkMode ? 'bg-gradient-to-r from-emerald-500 to-green-500' : 'bg-gradient-to-r from-emerald-400 to-green-400'
                                        : isDarkMode ? 'bg-gradient-to-r from-cyan-500 to-blue-500' : 'bg-gradient-to-r from-cyan-400 to-blue-400'
                                    }`}
                                    style={{ width: med.todayStatus === 'taken' ? '100%' : '60%' }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Right Section - Action Buttons */}
                          <div className="flex flex-col sm:flex-row md:flex-col gap-2">
                            {med.approvalStatus === 'approved' ? (
                            <button onClick={() => handleMarkMedication(med._id)} className={`px-4 py-2.5 rounded-xl font-medium transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 ${
                              med.todayStatus === 'taken'
                                ? isDarkMode 
                                  ? 'bg-emerald-900/30 hover:bg-emerald-800/30 text-emerald-300 border border-emerald-800/30'
                                  : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-700 border border-emerald-200'
                                : isDarkMode 
                                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white'
                                  : 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                            }`}>
                              {med.todayStatus === 'taken' ? (
                                <>
                                  <ClipboardCheck className="w-4 h-4" />
                                  Taken
                                </>
                              ) : (
                                <>
                                  <Pill className="w-4 h-4" />
                                  Take Now
                                </>
                              )}
                            </button>
                            ) : med.approvalStatus === 'rejected' ? (
                              <div className={`px-4 py-2.5 rounded-xl font-semibold text-center ${
                                isDarkMode ? 'bg-rose-900/20 text-rose-400 border border-rose-800/30' : 'bg-rose-50 text-rose-600 border border-rose-200'
                              }`}>
                                ❌ Not Allowed
                              </div>
                            ) : (
                              <div className={`px-4 py-2.5 rounded-xl font-semibold text-center ${
                                isDarkMode ? 'bg-amber-900/20 text-amber-400 border border-amber-800/30' : 'bg-amber-50 text-amber-600 border border-amber-200'
                              }`}>
                                ⏳ Awaiting Approval
                              </div>
                            )}
                            
                            <button onClick={() => handleSetReminder(med._id)} className={`px-4 py-2.5 rounded-xl font-medium transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 ${
                              isDarkMode
                                ? 'bg-gray-800/30 hover:bg-gray-700/30 text-gray-400 border border-gray-700/30'
                                : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200'
                            }`}>
                              <Bell className="w-4 h-4" />
                              Remind Me
                            </button>
                          </div>
                        </div>
                        
                        {/* Additional Info (Hidden on small screens) */}
                        <div className="mt-4 pt-4 border-t border-gray-800/30 hidden md:block">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <div className={`p-2 rounded-lg backdrop-blur-sm ${
                              isDarkMode ? 'bg-gray-800/30' : 'bg-gray-100/50'
                            }`}>
                              <div className="text-xs text-gray-500 mb-1">Frequency</div>
                              <div className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{med.frequency || 'Daily'}</div>
                            </div>
                            <div className={`p-2 rounded-lg backdrop-blur-sm ${
                              isDarkMode ? 'bg-gray-800/30' : 'bg-gray-100/50'
                            }`}>
                              <div className="text-xs text-gray-500 mb-1">Last Taken</div>
                              <div className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                {med.todayStatus === 'taken' ? 'Today' : 'Pending'}
                              </div>
                            </div>
                            <div className={`p-2 rounded-lg backdrop-blur-sm ${
                              isDarkMode ? 'bg-gray-800/30' : 'bg-gray-100/50'
                            }`}>
                              <div className="text-xs text-gray-500 mb-1">Prescribed By</div>
                              <div className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{med.prescribedBy || 'N/A'}</div>
                            </div>
                            <div className={`p-2 rounded-lg backdrop-blur-sm ${
                              isDarkMode ? 'bg-gray-800/30' : 'bg-gray-100/50'
                            }`}>
                              <div className="text-xs text-gray-500 mb-1">Refill Date</div>
                              <div className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{med.refillDate ? new Date(med.refillDate).toLocaleDateString() : 'N/A'}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Sidebar - Upcoming & History */}
              <div className="space-y-6">
                {/* Upcoming Refills */}
                <div className={`group relative rounded-3xl p-5 backdrop-blur-xl border-2 overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-xl ${
                  isDarkMode
                    ? 'bg-gradient-to-br from-gray-950/40 via-gray-900/30 to-gray-950/40 border-blue-800/30'
                    : 'bg-gradient-to-br from-white/90 via-white/80 to-white/90 border-blue-200/50'
                }`}>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className={`text-xl font-bold flex items-center gap-2 ${
                        isDarkMode ? 'text-blue-300' : 'text-blue-600'
                      }`}>
                        <Calendar className="w-5 h-5" />
                        Upcoming Refills
                      </h3>
                      <span className={`text-xs px-2 py-1 rounded-full backdrop-blur-sm ${
                        isDarkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {medRefills.filter(r => r.status === 'Due Soon').length + medRefills.filter(r => r.status === 'Scheduled').length} Due
                      </span>
                    </div>
                    
                    <div className="space-y-3">
                      {medRefills.slice(0, 3).map((refill) => (
                        <div key={refill.id} className={`p-3 rounded-xl border transition-all duration-300 hover:scale-105 ${
                          isDarkMode
                            ? 'bg-gray-900/30 border-gray-800 hover:border-blue-700/30'
                            : 'bg-white/50 border-gray-200 hover:border-blue-300/50'
                        }`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${
                                refill.status === 'Due Soon' 
                                  ? 'bg-amber-500 animate-pulse' 
                                  : 'bg-blue-500'
                              }`}></div>
                              <div>
                                <div className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                                  {refill.name}
                                </div>
                                <div className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                                  Due: {refill.date}
                                </div>
                              </div>
                            </div>
                            <span className={`text-xs px-2 py-1 rounded-full backdrop-blur-sm ${
                              refill.status === 'Due Soon'
                                ? isDarkMode ? 'bg-amber-900/30 text-amber-300' : 'bg-amber-100 text-amber-700'
                                : isDarkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-700'
                            }`}>
                              {refill.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <button onClick={() => setShowScheduleRefill(true)} className={`w-full mt-4 py-2.5 rounded-xl font-medium transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 ${
                      isDarkMode
                        ? 'bg-gray-800/50 border-gray-700 hover:bg-gray-700/50 text-blue-400 border'
                        : 'bg-white border-gray-200 hover:bg-gray-50 text-blue-600 border'
                    }`}>
                      <Calendar className="w-4 h-4" />
                      Schedule Refill
                    </button>
                  </div>
                </div>

                {/* Medication History */}
                <div className={`group relative rounded-3xl p-5 backdrop-blur-xl border-2 overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-xl ${
                  isDarkMode
                    ? 'bg-gradient-to-br from-gray-950/40 via-gray-900/30 to-gray-950/40 border-emerald-800/30'
                    : 'bg-gradient-to-br from-white/90 via-white/80 to-white/90 border-emerald-200/50'
                }`}>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className={`text-xl font-bold flex items-center gap-2 ${
                        isDarkMode ? 'text-emerald-300' : 'text-emerald-600'
                      }`}>
                        <History className="w-5 h-5" />
                        Recent History
                      </h3>
                      <div className={`p-1.5 rounded-lg ${
                        isDarkMode ? 'bg-emerald-950/40' : 'bg-emerald-100'
                      }`}>
                        <ClipboardCheck className={`w-4 h-4 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {medHistory.slice(0, 4).map((history) => (
                        <div key={history.id} className={`p-3 rounded-xl ${
                          isDarkMode ? 'bg-gray-900/30' : 'bg-gray-100/50'
                        }`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className={`p-1 rounded ${
                                history.status === 'Taken'
                                  ? isDarkMode ? 'bg-emerald-900/30' : 'bg-emerald-100'
                                  : isDarkMode ? 'bg-red-900/30' : 'bg-red-100'
                              }`}>
                                <div className={
                                  history.status === 'Taken'
                                    ? isDarkMode ? 'text-emerald-400' : 'text-emerald-600'
                                    : isDarkMode ? 'text-red-400' : 'text-red-600'
                                }>
                                  {history.status === 'Taken' ? <Pill className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                                </div>
                              </div>
                              <div>
                                <div className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                                  {history.medication}
                                </div>
                                <div className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                                  {history.time}
                                </div>
                              </div>
                            </div>
                            <span className={`text-xs px-2 py-1 rounded-full backdrop-blur-sm ${
                              history.status === 'Taken'
                                ? isDarkMode ? 'bg-emerald-900/30 text-emerald-300' : 'bg-emerald-100 text-emerald-700'
                                : isDarkMode ? 'bg-red-900/30 text-red-300' : 'bg-red-100 text-red-700'
                            }`}>
                              {history.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <button onClick={() => setShowMedHistory(true)} className={`w-full mt-4 py-2.5 rounded-xl font-medium transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 ${
                      isDarkMode
                        ? 'bg-gray-800/50 border-gray-700 hover:bg-gray-700/50 text-emerald-400 border'
                        : 'bg-white border-gray-200 hover:bg-gray-50 text-emerald-600 border'
                    }`}>
                      <History className="w-4 h-4" />
                      View Full History
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <BeautifulFooter isDarkMode={isDarkMode} setActiveModule={setActiveModule} />
          </div>
  );
};

export default MedicationManagement;
