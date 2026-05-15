import React from 'react';
import { 
  User, Users, ClipboardList, Pill, AlertCircle, Bell, Eye, TrendingUp, CheckCircle 
} from 'lucide-react';
import { getColorGradientDark, getColorGradientLight, getColorClass } from '../helpers';
import GlassCard from './GlassCard';
import AnimatedCard from './AnimatedCard';
import GlowingButton from './GlowingButton';
import BeautifulFooter from './BeautifulFooter';

const CaregiverHome = ({ 
  isDarkMode, 
  userName, 
  elderlyList, 
  alerts, 
  dietPlans, 
  medicationSchedule, 
  setActiveModule, 
  setSelectedElderly, 
  setTargetMedId 
}) => {
  return (
    <>
      <div className="space-y-6 overflow-hidden">
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
                      Caregiver Dashboard • Monitoring {elderlyList.length} elderly persons
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
                    Stable: {elderlyList.filter(e => e.status === 'Stable').length} elderly
                  </span>
                </div>
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 hover:scale-105 ${
                  isDarkMode ? 'bg-amber-950/40 border border-amber-900/30' : 'bg-gradient-to-r from-amber-100 to-orange-100 border border-amber-200'
                }`}>
                  <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
                  <span className={`text-sm font-medium ${isDarkMode ? 'text-amber-300' : 'text-amber-700'}`}>
                    Alerts: {alerts.filter(a => !a.read).length} unread
                  </span>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 overflow-hidden">
          {[
            { label: 'Elderly Monitored', value: elderlyList.length.toString(), icon: <Users className="w-6 h-6" />, color: 'blue', change: 'All active' },
            { label: 'Pending Reviews', value: dietPlans.filter(p => !p.reviewed).length.toString(), icon: <ClipboardList className="w-6 h-6" />, color: 'amber', change: 'Diet plans' },
            { label: 'Medications Today', value: medicationSchedule.length.toString(), icon: <Pill className="w-6 h-6" />, color: 'emerald', change: '1 missed' },
            { label: 'Health Alerts', value: alerts.filter(a => !a.read).length.toString(), icon: <AlertCircle className="w-6 h-6" />, color: 'rose', change: 'New today' },
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">
          {/* Elderly List */}
          <GlassCard color="emerald" darkMode={isDarkMode} className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className={`text-xl font-bold mb-1 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                  Elderly Under Care ({elderlyList.length})
                </h3>
                <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                  Recently active elderly requiring attention
                </p>
              </div>
              <GlowingButton 
                icon={<Eye className="w-4 h-4" />}
                color="emerald"
                size="md"
                onClick={() => setActiveModule('elderly-list')}
              >
                View All
              </GlowingButton>
            </div>
            
            <div className="space-y-3">
              {elderlyList.slice(0, 3).map((elderly, idx) => (
                <AnimatedCard key={elderly.id} delay={idx}>
                  <div 
                    onClick={() => {
                      setSelectedElderly(elderly);
                      setActiveModule('elderly-profile');
                    }}
                    className={`group cursor-pointer rounded-2xl p-4 backdrop-blur-sm border transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${
                      isDarkMode
                        ? 'bg-gray-900/30 border-gray-800 hover:border-emerald-700/30'
                        : 'bg-white/50 border-gray-200 hover:border-emerald-300/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-xl ${
                          isDarkMode ? getColorClass(elderly.color, 'darkBg') : getColorClass(elderly.color, 'bg')
                        }`}>
                          <User className={isDarkMode ? getColorClass(elderly.color, 'darkText') : getColorClass(elderly.color, 'text')} />
                        </div>
                        <div>
                          <h4 className={`font-bold text-sm mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                            {elderly.name}
                          </h4>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              elderly.status === 'Needs Attention' 
                                ? isDarkMode ? 'bg-rose-900/30 text-rose-300' : 'bg-rose-100 text-rose-700'
                                : elderly.status === 'Stable'
                                ? isDarkMode ? 'bg-emerald-900/30 text-emerald-300' : 'bg-emerald-100 text-emerald-700'
                                : isDarkMode ? 'bg-amber-900/30 text-amber-300' : 'bg-amber-100 text-amber-700'
                            }`}>
                              {elderly.status}
                            </span>
                            <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                              {elderly.relationship} • {elderly.age} yrs
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Last check: {elderly.lastCheck}
                        </div>
                        <div className="flex items-center gap-2">
                          <button className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-300 hover:scale-105 ${
                            isDarkMode
                              ? 'bg-emerald-900/30 hover:bg-emerald-800/30 text-emerald-300'
                              : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-700'
                          }`}>
                            View Profile
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              window.location.href = 'tel:';
                            }}
                            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-300 hover:scale-105 ${
                              isDarkMode
                                ? 'bg-blue-900/30 hover:bg-blue-800/30 text-blue-300'
                                : 'bg-blue-100 hover:bg-blue-200 text-blue-700'
                            }`}
                          >
                            Call
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </AnimatedCard>
              ))}
            </div>
          </GlassCard>

          {/* Right Sidebar - Alerts & Notifications */}
          <div className="space-y-6 overflow-hidden">
            {/* Recent Alerts */}
            <GlassCard color="rose" darkMode={isDarkMode}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className={`text-xl font-bold mb-1 flex items-center gap-2 ${
                    isDarkMode ? 'text-rose-300' : 'text-rose-600'
                  }`}>
                    <Bell className="w-5 h-5" />
                    Recent Alerts
                  </h3>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                    {alerts.slice(0, 3).length} new alerts
                  </p>
                </div>
              </div>
              
              <div className="space-y-3">
                {alerts.slice(0, 3).map((alert, idx) => (
                  <AnimatedCard key={alert.id} delay={idx}>
                    <div className={`p-3 rounded-xl border transition-all duration-300 hover:scale-105 ${
                      isDarkMode ? 'bg-gray-900/30 border-gray-800' : 'bg-white/50 border-gray-200'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                          {alert.elderly}
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          alert.severity === 'critical' 
                            ? isDarkMode ? 'bg-rose-900/30 text-rose-300' : 'bg-rose-100 text-rose-700'
                            : alert.severity === 'high'
                            ? isDarkMode ? 'bg-amber-900/30 text-amber-300' : 'bg-amber-100 text-amber-700'
                            : isDarkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {alert.severity}
                        </span>
                      </div>
                      <div className={`text-sm mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {alert.type}
                      </div>
                      <div className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                        ⏰ {alert.time}
                      </div>
                    </div>
                  </AnimatedCard>
                ))}
              </div>
            </GlassCard>

            {/* Medication Schedule */}
            <GlassCard color="blue" darkMode={isDarkMode}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className={`text-xl font-bold mb-1 flex items-center gap-2 ${
                    isDarkMode ? 'text-blue-300' : 'text-blue-600'
                  }`}>
                    <Pill className="w-5 h-5" />
                    Upcoming Medications
                  </h3>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                    Next 3 medications
                  </p>
                </div>
              </div>
              
              <div className="space-y-3">
                {medicationSchedule.slice(0, 3).map((med, idx) => (
                  <AnimatedCard key={med.id} delay={idx}>
                    <div 
                      onClick={() => {
                        setTargetMedId(med.id);
                        setActiveModule('medication');
                      }}
                      className={`p-3 rounded-xl border cursor-pointer transition-all duration-300 hover:scale-105 ${
                      isDarkMode ? 'bg-gray-900/30 border-gray-800' : 'bg-white/50 border-gray-200'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                          {med.elderly}
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          med.status === 'Taken' 
                            ? isDarkMode ? 'bg-emerald-900/30 text-emerald-300' : 'bg-emerald-100 text-emerald-700'
                            : med.status === 'Missed'
                            ? isDarkMode ? 'bg-rose-900/30 text-rose-300' : 'bg-rose-100 text-rose-700'
                            : isDarkMode ? 'bg-amber-900/30 text-amber-300' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {med.status}
                        </span>
                      </div>
                      <div className={`text-sm mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        💊 {med.medication} ({med.dosage})
                      </div>
                      <div className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                        ⏰ {med.time}
                      </div>
                    </div>
                  </AnimatedCard>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>

        {/* Pending Reviews */}
        <GlassCard color="amber" darkMode={isDarkMode}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className={`text-xl font-bold mb-1 flex items-center gap-2 ${
                isDarkMode ? 'text-amber-300' : 'text-amber-600'
              }`}>
                <ClipboardList className="w-5 h-5" />
                Pending Diet Plan Reviews
              </h3>
              <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                {dietPlans.filter(p => p.approvalStatus === 'pending').length} plans awaiting review
              </p>
            </div>
            <GlowingButton 
              icon={<CheckCircle className="w-4 h-4" />}
              color="amber"
              size="md"
              onClick={() => setActiveModule('diet-plan-review')}
            >
              Review All
            </GlowingButton>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {dietPlans.filter(p => p.approvalStatus === 'pending').map((plan, idx) => (
              <AnimatedCard key={plan.id} delay={idx}>
                <div className={`rounded-2xl p-4 border transition-all duration-300 hover:scale-105 ${
                  isDarkMode ? 'bg-gray-900/30 border-gray-800' : 'bg-white/50 border-gray-200'
                }`}>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className={`font-bold text-sm mb-1 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                        {plan.elderly}
                      </h4>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                        {plan.meals} meals • {plan.calories} calories
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      isDarkMode ? 'bg-amber-900/30 text-amber-300' : 'bg-amber-100 text-amber-700'
                    }`}>
                      Pending
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                      Date: {plan.date}
                    </span>
                    <button 
                      onClick={() => setActiveModule('diet-plan-review')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 hover:scale-110 hover:shadow-md ${
                      isDarkMode
                        ? 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white shadow-amber-500/20'
                        : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-amber-400/20'
                    } shadow-md`}>
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

export default CaregiverHome;
