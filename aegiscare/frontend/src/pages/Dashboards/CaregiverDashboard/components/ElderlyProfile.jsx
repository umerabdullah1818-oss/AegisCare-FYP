import React, { useState } from 'react';
import { 
  Activity, ActivitySquare, Heart, Thermometer, Wind, MapPin, Phone, 
  ChevronRight, Edit, CheckCircle, History, Pill, Utensils, Flame,
  Brain as BrainIcon
} from 'lucide-react';
import { getColorClass } from '../helpers';
import GlassCard from './GlassCard';
import GlowingButton from './GlowingButton';
import AnimatedCard from './AnimatedCard';
import AnimatedGauge from './AnimatedGauge';
import BeautifulFooter from './BeautifulFooter';

const ElderlyProfile = ({ 
  elderly, 
  onBack, 
  isDarkMode, 
  medicationSchedule, 
  emergencyContacts, 
  healthHistory, 
  setActiveModule 
}) => {
  const [activeTab, setActiveTab] = useState('vitals');
  const [showLocation, setShowLocation] = useState(false);

  const healthData = {
    heartRate: Array.from({length: 12}, (_, i) => (elderly.vitals?.heartRate || 72) + Math.floor(Math.random() * 6 - 3)),
    bloodPressure: Array.from({length: 12}, (_, i) => parseInt((elderly.vitals?.bp || '120/80').split('/')[0]) + Math.floor(Math.random() * 6 - 3)),
    glucose: Array.from({length: 12}, (_, i) => (elderly.vitals?.glucose || 110) + Math.floor(Math.random() * 10 - 5))
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <GlassCard color="emerald" hoverable={false} darkMode={isDarkMode} className="relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 -translate-y-32 translate-x-32 rounded-full bg-gradient-to-r from-emerald-600/10 to-teal-600/10 blur-3xl animate-pulse-slow"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className={`p-2 rounded-lg transition-all duration-300 hover:scale-105 group ${
                  isDarkMode ? 'bg-emerald-950/40 hover:bg-emerald-900/40' : 'bg-emerald-100 hover:bg-emerald-200'
                }`}
              >
                <ChevronRight className={`w-5 h-5 transform rotate-180 group-hover:-translate-x-1 transition-transform duration-300 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
              </button>
              <div>
                <h2 className={`text-3xl font-bold mb-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 bg-clip-text text-transparent animate-gradient`}>
                  {elderly.name} - Elderly Profile
                </h2>
                <p className={`text-base ${isDarkMode ? 'text-emerald-200/80' : 'text-emerald-700/80'}`}>
                  {elderly.age} years • {elderly.relationship} • Location: {elderly.location}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <GlowingButton 
                icon={<Phone size={20} />}
                color="emerald"
                onClick={() => window.location.href = 'tel:'}
              >
                Call Now
              </GlowingButton>
              <button 
                onClick={() => setShowLocation(true)}
                className={`px-4 py-2.5 rounded-xl font-medium transition-all duration-300 hover:scale-105 flex items-center gap-2 ${
                  isDarkMode
                    ? 'bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 border border-gray-700'
                    : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200'
                }`}>
                <MapPin className="w-4 h-4" />
                Show Location
              </button>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {['vitals', 'medication', 'diet', 'history', 'location'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 whitespace-nowrap ${
              activeTab === tab
                ? isDarkMode
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-500 text-white'
                : isDarkMode
                ? 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Main Content */}
      {activeTab === 'vitals' && (
        <div>
          {/* Vitals Dashboard */}
          <GlassCard color="emerald" darkMode={isDarkMode}>
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-xl font-bold flex items-center gap-2 ${
                isDarkMode ? 'text-emerald-300' : 'text-emerald-600'
              }`}>
                <Activity className="w-6 h-6 animate-pulse" />
                Real-time Vitals
              </h3>
              <span className={`text-sm px-3 py-1 rounded-full animate-pulse ${
                elderly.status === 'Needs Attention' 
                  ? isDarkMode ? 'bg-rose-900/30 text-rose-300' : 'bg-rose-100 text-rose-700'
                  : elderly.status === 'Stable'
                  ? isDarkMode ? 'bg-emerald-900/30 text-emerald-300' : 'bg-emerald-100 text-emerald-700'
                  : isDarkMode ? 'bg-amber-900/30 text-amber-300' : 'bg-amber-100 text-amber-700'
              }`}>
                Status: {elderly.status}
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { label: 'Heart Rate', value: elderly.vitals.heartRate, unit: 'BPM', color: 'rose', icon: <Heart className="w-5 h-5 animate-pulse" /> },
                { label: 'Blood Pressure', value: elderly.vitals.bp, unit: '', color: 'blue', icon: <Activity className="w-5 h-5 animate-pulse" /> },
                { label: 'Glucose', value: elderly.vitals.glucose, unit: 'mg/dL', color: 'emerald', icon: <ActivitySquare className="w-5 h-5 animate-pulse" /> },
                { label: 'Temperature', value: elderly.vitals.tempF || elderly.vitals.temp, unit: '°F', color: 'amber', icon: <Thermometer className="w-5 h-5 animate-pulse" /> },
                { label: 'SpO2', value: elderly.vitals.spo2, unit: '%', color: 'purple', icon: <Wind className="w-5 h-5 animate-pulse" /> },
                { label: 'Respiration', value: elderly.vitals.respRate || 18, unit: 'br/min', color: 'cyan', icon: <Wind className="w-5 h-5 animate-pulse" /> },
              ].map((vital, idx) => (
                <AnimatedCard key={idx} delay={idx}>
                  <div className={`group rounded-2xl p-4 backdrop-blur-sm border transition-all duration-300 hover:scale-105 ${
                    isDarkMode
                      ? 'bg-gray-900/30 border-gray-800 hover:border-emerald-700/30'
                      : 'bg-white/50 border-gray-200 hover:border-emerald-300/50'
                  }`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className={`p-2 rounded-lg ${
                        isDarkMode ? getColorClass(vital.color, 'darkBg') : getColorClass(vital.color, 'bg')
                      } group-hover:scale-110 transition-transform duration-300`}>
                        <div className={isDarkMode ? getColorClass(vital.color, 'darkText') : getColorClass(vital.color, 'text')}>
                          {vital.icon}
                        </div>
                      </div>
                      <AnimatedGauge 
                        value={typeof vital.value === 'number' ? vital.value : parseInt(vital.value)} 
                        max={vital.label === 'Heart Rate' ? 150 : vital.label === 'Glucose' ? 200 : vital.label === 'Respiration' ? 40 : 100}
                        color={vital.color}
                        size={50}
                        showPulse={elderly.status === 'Needs Attention'}
                        isDarkMode={isDarkMode}
                      />
                    </div>
                    <div>
                      <div className={`text-2xl font-bold mb-1 ${
                        isDarkMode 
                          ? vital.color === 'rose' ? 'text-rose-300' :
                            vital.color === 'blue' ? 'text-blue-300' :
                            vital.color === 'emerald' ? 'text-emerald-300' :
                            vital.color === 'amber' ? 'text-amber-300' :
                            vital.color === 'purple' ? 'text-purple-300' :
                            vital.color === 'cyan' ? 'text-cyan-300' : 'text-gray-100'
                          : vital.color === 'rose' ? 'text-rose-600' :
                            vital.color === 'blue' ? 'text-blue-600' :
                            vital.color === 'emerald' ? 'text-emerald-600' :
                            vital.color === 'amber' ? 'text-amber-600' :
                            vital.color === 'purple' ? 'text-purple-600' :
                            vital.color === 'cyan' ? 'text-cyan-600' : 'text-gray-900'
                      }`}>
                        {vital.value} {vital.unit}
                      </div>
                      <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {vital.label}
                      </div>
                    </div>
                  </div>
                </AnimatedCard>
              ))}
            </div>
          </GlassCard>

          {/* ML Insights */}
          {elderly.mlInsights && (
            <GlassCard color="indigo" darkMode={isDarkMode}>
              <h3 className={`text-xl font-bold mb-4 flex items-center gap-2 ${
                isDarkMode ? 'text-indigo-300' : 'text-indigo-600'
              }`}>
                <BrainIcon className="w-6 h-6" />
                ML Health Insights
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {elderly.mlInsights.anomaly && (
                  <div className={`rounded-2xl p-4 border ${
                    !elderly.mlInsights.anomaly.is_anomaly
                      ? isDarkMode ? 'bg-emerald-900/20 border-emerald-800/40' : 'bg-emerald-50 border-emerald-200'
                      : isDarkMode ? 'bg-red-900/20 border-red-800/40' : 'bg-red-50 border-red-200'
                  }`}>
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className={`w-5 h-5 ${!elderly.mlInsights.anomaly.is_anomaly ? 'text-emerald-500' : 'text-red-500'}`} />
                      <span className={`text-sm font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Anomaly Detection</span>
                    </div>
                    <p className={`text-xs mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {elderly.mlInsights.anomaly.is_anomaly
                        ? `Anomaly detected (${elderly.mlInsights.anomaly.severity})`
                        : 'All vitals within normal patterns'}
                    </p>
                    {elderly.mlInsights.anomaly.alerts?.length > 0 && (
                      <div className="space-y-1">
                        {elderly.mlInsights.anomaly.alerts.map((a, i) => (
                          <p key={i} className={`text-xs ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>• {a.message}</p>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </GlassCard>
          )}
        </div>
      )}

      {activeTab === 'medication' && (
        <GlassCard color="blue" darkMode={isDarkMode}>
          <h3 className={`text-xl font-bold mb-6 flex items-center gap-2 ${
            isDarkMode ? 'text-blue-300' : 'text-blue-600'
          }`}>
            <Pill className="w-6 h-6 animate-pulse" />
            Medication Schedule
          </h3>
          <div className="space-y-4">
            {medicationSchedule.filter(m => m.elderly === elderly.name).map((med, idx) => (
              <AnimatedCard key={med.id} delay={idx}>
                <div className={`p-4 rounded-xl border transition-all duration-300 hover:scale-105 ${
                  isDarkMode ? 'bg-gray-800/40 border-gray-700' : 'bg-white/50 border-gray-200'
                }`}>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className={`font-bold text-lg mb-1 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                        {med.medication}
                      </h4>
                      <div className="flex items-center gap-3">
                        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          💊 {med.dosage} • ⏰ {med.time}
                        </span>
                      </div>
                    </div>
                    <span className={`text-sm px-3 py-1 rounded-full ${
                      med.status === 'Taken' 
                        ? isDarkMode ? 'bg-emerald-900/30 text-emerald-300' : 'bg-emerald-100 text-emerald-700'
                        : med.status === 'Missed'
                        ? isDarkMode ? 'bg-rose-900/30 text-rose-300' : 'bg-rose-100 text-rose-700'
                        : isDarkMode ? 'bg-amber-900/30 text-amber-300' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {med.status}
                    </span>
                  </div>
                  {med.timeTaken && (
                    <div className={`flex items-center gap-2 text-sm ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                      <CheckCircle className="w-4 h-4" />
                      Taken at: {med.timeTaken}
                    </div>
                  )}
                </div>
              </AnimatedCard>
            ))}
          </div>
        </GlassCard>
      )}

      {activeTab === 'diet' && (
        <div className="space-y-6">
          <GlassCard color="amber" darkMode={isDarkMode}>
            <h3 className={`text-xl font-bold mb-6 flex items-center gap-2 ${
              isDarkMode ? 'text-amber-300' : 'text-amber-600'
            }`}>
              <Utensils className="w-6 h-6 animate-pulse" />
              Today's Diet Plan
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { meal: 'Breakfast', time: '08:00 AM', items: 'Oatmeal, Fruits, Orange Juice', calories: 350 },
                { meal: 'Lunch', time: '12:30 PM', items: 'Grilled Chicken, Salad, Brown Rice', calories: 450 },
                { meal: 'Dinner', time: '06:00 PM', items: 'Fish, Vegetables, Soup', calories: 400 },
              ].map((meal, idx) => (
                <AnimatedCard key={idx} delay={idx}>
                  <div className={`p-4 rounded-xl border transition-all duration-300 hover:scale-105 ${
                    isDarkMode ? 'bg-gray-800/40 border-gray-700' : 'bg-white/50 border-gray-200'
                  }`}>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className={`font-bold text-lg ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                        {meal.meal}
                      </h4>
                      <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        ⏰ {meal.time}
                      </span>
                    </div>
                    <p className={`text-sm mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {meal.items}
                    </p>
                    <div className={`flex items-center gap-2 ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`}>
                      <Flame className="w-4 h-4" />
                      {meal.calories} calories
                    </div>
                  </div>
                </AnimatedCard>
              ))}
            </div>
          </GlassCard>

          <GlassCard color="green" darkMode={isDarkMode}>
            <h3 className={`text-xl font-bold mb-6 flex items-center gap-2 ${
              isDarkMode ? 'text-green-300' : 'text-green-600'
            }`}>
              <CheckCircle className="w-6 h-6 animate-pulse" />
              Diet Plan Status
            </h3>
            <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10">
              <div>
                <div className={`text-lg font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                  {elderly.dietPlan}
                </div>
                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Last reviewed: Today
                </div>
              </div>
              <GlowingButton 
                icon={<Edit className="w-4 h-4" />}
                color="emerald"
                onClick={() => setActiveModule('diet-plan-review')}
              >
                Review Plan
              </GlowingButton>
            </div>
          </GlassCard>
        </div>
      )}

      {activeTab === 'history' && (
        <GlassCard color="purple" darkMode={isDarkMode}>
          <h3 className={`text-xl font-bold mb-6 flex items-center gap-2 ${
            isDarkMode ? 'text-purple-300' : 'text-purple-600'
          }`}>
            <History className="w-6 h-6 animate-pulse" />
            Health History
          </h3>
          <div className="space-y-4">
            {healthHistory.map((record, idx) => (
              <AnimatedCard key={idx} delay={idx}>
                <div className={`p-4 rounded-xl border-l-4 transition-all duration-300 hover:scale-105 ${
                  record.type === 'checkup' ? 'border-emerald-500' :
                  record.type === 'lab' ? 'border-blue-500' :
                  record.type === 'medication' ? 'border-purple-500' :
                  'border-amber-500'
                } ${isDarkMode ? 'bg-gray-800/40' : 'bg-white/50'}`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className={`font-bold text-lg mb-1 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                        {record.event}
                      </h4>
                      <div className="flex items-center gap-3">
                        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          📅 {record.date}
                        </span>
                        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          👨‍⚕️ {record.doctor}
                        </span>
                      </div>
                    </div>
                    <button className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 ${
                      isDarkMode
                        ? 'bg-purple-900/30 hover:bg-purple-800/30 text-purple-300'
                        : 'bg-purple-100 hover:bg-purple-200 text-purple-700'
                    }`}>
                      View Details
                    </button>
                  </div>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </GlassCard>
      )}

      {activeTab === 'location' && (
        <GlassCard color="indigo" darkMode={isDarkMode} className="relative overflow-hidden">
          {/* Animated Background */}
          <div className="absolute top-0 right-0 w-64 h-64 -translate-y-32 translate-x-32 rounded-full bg-gradient-to-r from-indigo-600/10 to-purple-600/10 blur-3xl animate-pulse-slow"></div>
          
          <div className="relative z-10">
            <h3 className={`text-xl font-bold mb-6 flex items-center gap-2 ${
              isDarkMode ? 'text-indigo-300' : 'text-indigo-600'
            }`}>
              <MapPin className="w-6 h-6 animate-pulse" />
              Live Location Tracking
            </h3>
            
            <div className={`rounded-2xl overflow-hidden border-2 ${isDarkMode ? 'border-indigo-800' : 'border-indigo-200'} mb-6`}>
              {/* Map Simulation */}
              <div className={`h-64 relative ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'} flex items-center justify-center`}>
                <div className="absolute inset-0">
                  {/* Grid Pattern */}
                  <div className="absolute inset-0 opacity-20">
                    {Array.from({ length: 20 }).map((_, i) => (
                      <div key={i} className={`absolute h-px w-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`}
                           style={{ top: `${i * 10}%` }}></div>
                    ))}
                    {Array.from({ length: 20 }).map((_, i) => (
                      <div key={i} className={`absolute w-px h-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`}
                           style={{ left: `${i * 10}%` }}></div>
                    ))}
                  </div>
                  
                  {/* Location Pin */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-bounce">
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-white" />
                      </div>
                      <div className="absolute inset-0 rounded-full bg-rose-500 animate-ping opacity-20"></div>
                    </div>
                  </div>
                  
                  {/* Location Info */}
                  <div className="absolute bottom-4 left-4">
                    <div className={`p-3 rounded-xl backdrop-blur-sm ${isDarkMode ? 'bg-gray-900/80' : 'bg-white/80'}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className={`font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                          Current Location
                        </span>
                      </div>
                      <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {elderly.location}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Emergency Contacts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {emergencyContacts.map((contact, idx) => (
                <AnimatedCard key={contact.id} delay={idx}>
                  <div className={`p-4 rounded-xl border transition-all duration-300 hover:scale-105 ${
                    isDarkMode ? 'bg-gray-800/40 border-gray-700' : 'bg-white/50 border-gray-200'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className={`font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                          {contact.name}
                        </h4>
                        <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {contact.role}
                        </div>
                      </div>
                      <button className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 ${
                        isDarkMode
                          ? 'bg-indigo-600 hover:bg-indigo-500 text-white'
                          : 'bg-indigo-500 hover:bg-indigo-600 text-white'
                      }`}>
                        Call
                      </button>
                    </div>
                    <div className={`text-sm ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                      📞 {contact.phone}
                    </div>
                  </div>
                </AnimatedCard>
              ))}
            </div>
          </div>
        </GlassCard>
      )}

      <BeautifulFooter isDarkMode={isDarkMode} setActiveModule={setActiveModule} />
    </div>
  );
};

export default ElderlyProfile;
