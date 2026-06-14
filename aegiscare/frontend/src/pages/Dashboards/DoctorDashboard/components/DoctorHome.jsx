import React from 'react';
import { User, Users, Calendar, MessageCircle, AlertCircle, Clock, TrendingUp, Sparkles, CheckCircle } from 'lucide-react';
import { getColorGradientDark, getColorGradientLight, getColorClass } from '../helpers';
import GlassCard from './GlassCard';
import GlowingButton from './GlowingButton';
import AnimatedCard from './AnimatedCard';
import BeautifulFooter from './BeautifulFooter';

const DoctorHome = ({ isDarkMode, userName, specialty, patients, appointments, pendingConsultations, vitalAlerts, setSelectedPatient, setActiveModule, setIsVideoCallActive, showToast }) => {
    return (
      <>
        <div className="space-y-6">
          {/* Welcome Banner */}
          <GlassCard color="blue" hoverable={false} darkMode={isDarkMode}>
            <div className="absolute top-0 right-0 w-64 h-64 -translate-y-32 translate-x-32 rounded-full bg-gradient-to-r from-blue-600/10 to-cyan-600/10 blur-3xl animate-pulse-slow"></div>
            
            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-3 rounded-2xl transition-all duration-300 hover:scale-110 ${
                      isDarkMode ? 'bg-blue-950/40' : 'bg-gradient-to-r from-blue-100 to-cyan-100'
                    }`}>
                      <User className={`w-8 h-8 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                    </div>
                    <div>
                      <h1 className={`text-2xl lg:text-3xl font-bold mb-1 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent`}>
                        Welcome, {userName}!
                      </h1>
                      <p className={`text-base ${isDarkMode ? 'text-blue-200/80' : 'text-blue-700/80'}`}>
                        {specialty} • Today's Schedule: {appointments.filter(a => new Date(a.dateObj).toDateString() === new Date().toDateString()).length} appointments, {pendingConsultations.length} pending consultations
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
                      Online: {Math.max(1, Math.floor(patients.length / 3))} patients
                    </span>
                  </div>
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 hover:scale-105 ${
                    isDarkMode ? 'bg-blue-950/40 border border-blue-900/30' : 'bg-gradient-to-r from-blue-100 to-indigo-100 border border-blue-200'
                  }`}>
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                    <span className={`text-sm font-medium ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                      Alerts: {vitalAlerts.filter(a => a.severity === 'High').length} critical
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Active Patients', value: patients.length.toString(), icon: <Users className="w-6 h-6" />, color: 'blue', change: 'updated' },
              { label: 'Today\'s Appointments', value: appointments.filter(a => new Date(a.dateObj).toDateString() === new Date().toDateString()).length.toString(), icon: <Calendar className="w-6 h-6" />, color: 'emerald', change: `${appointments.filter(a => a.status === 'Pending' && new Date(a.dateObj).toDateString() === new Date().toDateString()).length} pending` },
              { label: 'Pending Consultations', value: pendingConsultations.length.toString(), icon: <MessageCircle className="w-6 h-6" />, color: 'purple', change: `${pendingConsultations.filter(c => c.priority === 'Critical').length} critical` },
              { label: 'Vital Alerts', value: vitalAlerts.length.toString(), icon: <AlertCircle className="w-6 h-6" />, color: 'rose', change: `${vitalAlerts.filter(a => a.severity === 'High').length} high priority` },
            ].map((stat, idx) => (
              <AnimatedCard key={idx} delay={idx}>
                <div className={`group rounded-2xl p-5 backdrop-blur-xl border-2 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl relative overflow-hidden ${
                  isDarkMode
                    ? 'bg-gradient-to-br from-gray-900/50 to-blue-950/30 border-gray-800/40'
                    : 'bg-gradient-to-br from-white/90 to-blue-50/90 border-gray-200/50'
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
                        {stat.change}
                      </span>
                    </div>
                  </div>
                  
                  <h3 className={`text-3xl font-bold mb-1 ${
                    isDarkMode 
                      ? getColorGradientDark(stat.color)
                      : getColorGradientLight(stat.color)
                  } bg-clip-text text-transparent`}>
                    {stat.value}
                  </h3>
                  <p className={`text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-800'}`}>
                    {stat.label}
                  </p>
                  
                  <div className={`flex items-center gap-1 mt-3 ${
                    stat.color === 'rose' ? 'text-rose-500' : 
                    stat.color === 'emerald' ? 'text-emerald-500' : 
                    'text-blue-500'
                  }`}>
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm font-medium">Monitor</span>
                  </div>
                </div>
              </AnimatedCard>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Patients List */}
            <GlassCard color="blue" darkMode={isDarkMode} className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className={`text-xl font-bold mb-1 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                    My Patients ({patients.length})
                  </h3>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                    Recently active patients requiring attention
                  </p>
                </div>
              </div>
              
              <div className="space-y-3">
                {patients.map((patient, idx) => (
                  <AnimatedCard key={patient.id} delay={idx}>
                    <div 
                      onClick={() => {
                        setSelectedPatient(patient);
                        setActiveModule('patient-profile');
                      }}
                      className={`group cursor-pointer rounded-2xl p-4 backdrop-blur-sm border transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${
                        isDarkMode
                          ? 'bg-gray-900/30 border-gray-800 hover:border-blue-700/30'
                          : 'bg-white/50 border-gray-200 hover:border-blue-300/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-3 rounded-xl ${
                            isDarkMode ? getColorClass(patient.color, 'darkBg') : getColorClass(patient.color, 'bg')
                          }`}>
                            <User className={isDarkMode ? getColorClass(patient.color, 'darkText') : getColorClass(patient.color, 'text')} />
                          </div>
                          <div>
                            <h4 className={`font-bold text-sm mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                              {patient.name}
                            </h4>
                            <div className="flex items-center gap-2">
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                patient.status === 'Critical' 
                                  ? isDarkMode ? 'bg-rose-900/30 text-rose-300' : 'bg-rose-100 text-rose-700'
                                  : patient.status === 'Stable'
                                  ? isDarkMode ? 'bg-emerald-900/30 text-emerald-300' : 'bg-emerald-100 text-emerald-700'
                                  : isDarkMode ? 'bg-amber-900/30 text-amber-300' : 'bg-amber-100 text-amber-700'
                              }`}>
                                {patient.status}
                              </span>
                              <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                                {patient.condition} • {patient.age} yrs
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Last visit: {patient.lastVisit}
                          </div>
                          <div className="flex items-center gap-2">
                            <button className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-300 hover:scale-105 ${
                              isDarkMode
                                ? 'bg-blue-900/30 hover:bg-blue-800/30 text-blue-300'
                                : 'bg-blue-100 hover:bg-blue-200 text-blue-700'
                            }`}>
                              View Profile
                            </button>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedPatient(patient);
                                setIsVideoCallActive(true);
                              }}
                              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-300 hover:scale-105 ${
                                isDarkMode
                                  ? 'bg-emerald-900/30 hover:bg-emerald-800/30 text-emerald-300'
                                  : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-700'
                              }`}
                            >
                              Video Call
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </AnimatedCard>
                ))}
              </div>
            </GlassCard>

            {/* Right Sidebar - Appointments & Alerts */}
            <div className="space-y-6">
              {/* Today's Appointments */}
              <GlassCard color="purple" darkMode={isDarkMode}>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className={`text-xl font-bold mb-1 flex items-center gap-2 ${
                      isDarkMode ? 'text-purple-300' : 'text-purple-600'
                    }`}>
                      <Clock className="w-5 h-5" />
                      Today's Schedule
                    </h3>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                      {appointments.filter(a => new Date(a.dateObj).toDateString() === new Date().toDateString()).length} appointments
                    </p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {appointments.filter(a => new Date(a.dateObj).toDateString() === new Date().toDateString()).map((appt, idx) => (
                    <AnimatedCard key={appt.id} delay={idx}>
                      <div className={`p-3 rounded-xl border transition-all duration-300 hover:scale-105 ${
                        isDarkMode ? 'bg-gray-900/30 border-gray-800' : 'bg-white/50 border-gray-200'
                      }`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className={`text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                              {appt.patient}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                                ⏰ {appt.time} • {appt.duration}
                              </span>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                appt.status === 'Confirmed' 
                                  ? isDarkMode ? 'bg-emerald-900/30 text-emerald-300' : 'bg-emerald-100 text-emerald-700'
                                  : isDarkMode ? 'bg-amber-900/30 text-amber-300' : 'bg-amber-100 text-amber-700'
                              }`}>
                                {appt.status}
                              </span>
                            </div>
                          </div>
                          <button className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-300 hover:scale-105 ${
                            isDarkMode
                              ? 'bg-purple-900/30 hover:bg-purple-800/30 text-purple-300'
                              : 'bg-purple-100 hover:bg-purple-200 text-purple-700'
                          }`}>
                            Join
                          </button>
                        </div>
                      </div>
                    </AnimatedCard>
                  ))}
                </div>
              </GlassCard>

              {/* Vital Alerts */}
              <GlassCard color="rose" darkMode={isDarkMode}>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className={`text-xl font-bold mb-1 flex items-center gap-2 ${
                      isDarkMode ? 'text-rose-300' : 'text-rose-600'
                    }`}>
                      <AlertCircle className="w-5 h-5" />
                      Vital Alerts
                    </h3>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                      {vitalAlerts.length} critical alerts
                    </p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {vitalAlerts.map((alert, idx) => (
                    <AnimatedCard key={alert.id} delay={idx}>
                      <div className={`p-3 rounded-xl border transition-all duration-300 hover:scale-105 ${
                        isDarkMode ? 'bg-gray-900/30 border-gray-800' : 'bg-white/50 border-gray-200'
                      }`}>
                        <div className="flex items-center justify-between mb-2">
                          <div className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                            {alert.patient}
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            alert.severity === 'High' 
                              ? isDarkMode ? 'bg-rose-900/30 text-rose-300' : 'bg-rose-100 text-rose-700'
                              : isDarkMode ? 'bg-amber-900/30 text-amber-300' : 'bg-amber-100 text-amber-700'
                          }`}>
                            {alert.severity}
                          </span>
                        </div>
                        <div className={`text-sm mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {alert.vital}: {alert.value} (Threshold: {alert.threshold})
                        </div>
                        <div className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                          ⏰ {alert.time}
                        </div>
                      </div>
                    </AnimatedCard>
                  ))}
                </div>
              </GlassCard>
            </div>
          </div>

          {/* Pending Consultations */}
          <GlassCard color="amber" darkMode={isDarkMode}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className={`text-xl font-bold mb-1 flex items-center gap-2 ${
                  isDarkMode ? 'text-amber-300' : 'text-amber-600'
                }`}>
                  <MessageCircle className="w-5 h-5" />
                  Pending Consultations
                </h3>
                <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                  {pendingConsultations.length} consultations awaiting review
                </p>
              </div>
              <GlowingButton 
                icon={<CheckCircle className="w-4 h-4" />}
                color="amber"
                size="md"
              >
                Review All
              </GlowingButton>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {pendingConsultations.map((consult, idx) => (
                <AnimatedCard key={consult.id} delay={idx}>
                  <div className={`rounded-2xl p-4 border transition-all duration-300 hover:scale-105 ${
                    isDarkMode ? 'bg-gray-900/30 border-gray-800' : 'bg-white/50 border-gray-200'
                  }`}>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className={`font-bold text-sm mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                          {consult.patient}
                        </h4>
                        <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                          {consult.type}
                        </p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        consult.priority === 'Critical' 
                          ? isDarkMode ? 'bg-rose-900/30 text-rose-300' : 'bg-rose-100 text-rose-700'
                          : consult.priority === 'High'
                          ? isDarkMode ? 'bg-amber-900/30 text-amber-300' : 'bg-amber-100 text-amber-700'
                          : isDarkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {consult.priority}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                        Requested: {consult.requested}
                      </span>
                      <button className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-300 hover:scale-105 ${
                        isDarkMode
                          ? 'bg-amber-900/30 hover:bg-amber-800/30 text-amber-300'
                          : 'bg-amber-100 hover:bg-amber-200 text-amber-700'
                      }`}>
                        Review Now
                      </button>
                    </div>
                  </div>
                </AnimatedCard>
              ))}
            </div>
          </GlassCard>
        </div>
        
        {/* Footer */}
        <BeautifulFooter isDarkMode={isDarkMode} setActiveModule={setActiveModule} />
      </>
    );
};

export default DoctorHome;
