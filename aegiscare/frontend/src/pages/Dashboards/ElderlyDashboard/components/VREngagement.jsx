import React from 'react';
import { Brain, Headphones, BrainCircuit, Sparkles, Wind, Gamepad2, TrendingUp, History } from 'lucide-react';
import { getColorClass } from '../helpers';
import BeautifulFooter from './BeautifulFooter';

const VREngagement = (props) => {
  const {
    isDarkMode,
    vrExperiences,
    startVRSession,
    setShowVRHistory,
    vrStats,
    setActiveModule,
  } = props;

  return (
    <div className="space-y-6">
      {/* Modern Header */}
      <div className={`relative rounded-3xl p-6 overflow-hidden backdrop-blur-xl border transition-all duration-500 ${
        isDarkMode
          ? 'bg-gradient-to-br from-gray-950/80 via-purple-950/20 to-indigo-950/10 border-purple-800/30 shadow-2xl shadow-purple-950/30'
          : 'bg-gradient-to-br from-white/90 via-purple-50/60 to-indigo-50/40 border-purple-200/50 shadow-2xl shadow-purple-100/50'
      }`}>
        
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className={`text-3xl font-bold mb-2 bg-gradient-to-r from-purple-500 via-violet-500 to-indigo-500 bg-clip-text text-transparent animate-gradient`}>
                Virtual Reality Therapy
              </h2>
              <p className={`text-base ${isDarkMode ? 'text-purple-200/80' : 'text-purple-700/80'}`}>
                Immersive experiences for cognitive stimulation and mental wellness
              </p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 hover:scale-105 ${
                isDarkMode 
                  ? 'bg-purple-950/40 border border-purple-800/50 backdrop-blur-sm' 
                  : 'bg-purple-100 border border-purple-200 backdrop-blur-sm'
              }`}>
                <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div>
                <span className={`text-sm font-medium ${isDarkMode ? 'text-purple-300' : 'text-purple-700'}`}>
                  6 Experiences Available
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* VR Experiences Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {(() => {
          const vrIcons = [<Brain className="w-6 h-6" />, <Headphones className="w-6 h-6" />, <BrainCircuit className="w-6 h-6" />, <Sparkles className="w-6 h-6" />, <Wind className="w-6 h-6" />, <Gamepad2 className="w-6 h-6" />];
          return vrExperiences.map((activity, idx) => (
          <div key={idx} className={`group relative rounded-2xl p-5 backdrop-blur-xl border-2 overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-xl ${
            isDarkMode
              ? 'bg-gradient-to-br from-gray-950/40 via-gray-900/30 to-gray-950/40 border-gray-800/30 text-white'
              : 'bg-gradient-to-br from-white/90 via-white/80 to-white/90 border-gray-200/50'
          }`}>
            
            {/* Top Section */}
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl transition-all duration-300 group-hover:rotate-12 ${
                isDarkMode ? getColorClass(activity.color, 'darkBg') : getColorClass(activity.color, 'bg')
              }`}>
                <div className={isDarkMode ? getColorClass(activity.color, 'darkText') : getColorClass(activity.color, 'text')}>
                  {vrIcons[idx]}
                </div>
              </div>
              <span className={`text-xs px-3 py-1 rounded-full backdrop-blur-sm ${
                isDarkMode ? 'bg-gray-800/50' : 'bg-gray-100'
              }`}>
                {activity.duration}
              </span>
            </div>

            {/* Content */}
            <h3 className={`text-lg font-bold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
              {activity.name}
            </h3>
            <p className={`text-sm mb-3 ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
              {activity.description}
            </p>

            {/* Benefits */}
            <div className="mb-4">
              <div className={`text-xs font-medium mb-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                Benefits:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {activity.benefits.map((benefit, bIdx) => (
                  <span key={bIdx} className={`text-xs px-2 py-1 rounded-full backdrop-blur-sm ${
                    isDarkMode 
                      ? activity.color === 'purple' ? 'bg-purple-900/30 text-purple-300' :
                        activity.color === 'emerald' ? 'bg-emerald-900/30 text-emerald-300' :
                        activity.color === 'blue' ? 'bg-blue-900/30 text-blue-300' :
                        activity.color === 'amber' ? 'bg-amber-900/30 text-amber-300' :
                        activity.color === 'teal' ? 'bg-teal-900/30 text-teal-300' :
                        'bg-pink-900/30 text-pink-300'
                      : activity.color === 'purple' ? 'bg-purple-100 text-purple-700' :
                        activity.color === 'emerald' ? 'bg-emerald-100 text-emerald-700' :
                        activity.color === 'blue' ? 'bg-blue-100 text-blue-700' :
                        activity.color === 'amber' ? 'bg-amber-100 text-amber-700' :
                        activity.color === 'teal' ? 'bg-teal-100 text-teal-700' :
                        'bg-pink-100 text-pink-700'
                  }`}>
                    {benefit}
                  </span>
                ))}
              </div>
            </div>

            {/* Start Button */}
            <button onClick={() => startVRSession(activity)} className={`w-full py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 ${
              isDarkMode
                ? 'bg-gradient-to-r from-purple-800 to-indigo-800 hover:from-purple-700 hover:to-indigo-700 text-white'
                : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white'
            }`}>
              <Headphones className="w-4 h-4" />
              Start Experience
            </button>
          </div>
          ));
        })()}
      </div>

      {/* Stats & Progress */}
      <div className={`rounded-3xl p-6 backdrop-blur-xl border-2 transition-all duration-500 ${
        isDarkMode
          ? 'bg-gradient-to-br from-gray-950/40 via-gray-900/30 to-gray-950/40 border-violet-800/30'
          : 'bg-gradient-to-br from-white/90 via-white/80 to-white/90 border-violet-200/50'
      }`}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className={`text-xl font-bold mb-2 flex items-center gap-3 ${
              isDarkMode ? 'text-violet-300' : 'text-violet-600'
            }`}>
              <TrendingUp className="w-6 h-6" />
              Your Progress
            </h3>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Track your cognitive development through VR therapy
            </p>
          </div>
          <button onClick={() => setShowVRHistory(true)} className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 hover:scale-105 flex items-center gap-2 ${
            isDarkMode
              ? 'bg-gray-800/50 border-gray-700 hover:bg-gray-700/50 text-violet-400 border'
              : 'bg-white border-gray-200 hover:bg-gray-50 text-violet-600 border'
          }`}>
            <History className="w-4 h-4" />
            View History
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: 'Total Sessions', value: String(vrStats.totalSessions), progress: Math.min(100, Math.round(vrStats.totalSessions / 20 * 100)), color: 'purple' },
            { label: 'Cognitive Score', value: `+${vrStats.cognitiveScore}%`, progress: Math.min(100, vrStats.cognitiveScore + 40), color: 'blue' },
            { label: 'Weekly Goal', value: `${vrStats.weeklyGoal}/5`, progress: vrStats.weeklyGoal / 5 * 100, color: 'emerald' },
          ].map((stat, idx) => (
            <div key={idx} className={`p-4 rounded-xl border transition-all duration-300 hover:scale-105 ${
              isDarkMode
                ? 'bg-gray-900/30 border-gray-800'
                : 'bg-white/50 border-gray-200'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <div className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {stat.label}
                </div>
                <div className={`text-lg font-bold ${
                  isDarkMode 
                    ? stat.color === 'purple' ? 'text-purple-300' :
                      stat.color === 'blue' ? 'text-blue-300' :
                      stat.color === 'emerald' ? 'text-emerald-300' : 'text-gray-100'
                    : stat.color === 'purple' ? 'text-purple-600' :
                      stat.color === 'blue' ? 'text-blue-600' :
                      stat.color === 'emerald' ? 'text-emerald-600' : 'text-gray-900'
                }`}>
                  {stat.value}
                </div>
              </div>
              <div className={`h-1.5 rounded-full overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ease-out ${
                    isDarkMode
                      ? stat.color === 'purple' ? 'bg-gradient-to-r from-purple-500 to-violet-500' :
                        stat.color === 'blue' ? 'bg-gradient-to-r from-blue-500 to-cyan-500' :
                        'bg-gradient-to-r from-emerald-500 to-teal-500'
                      : stat.color === 'purple' ? 'bg-gradient-to-r from-purple-400 to-violet-400' :
                        stat.color === 'blue' ? 'bg-gradient-to-r from-blue-400 to-cyan-400' :
                        'bg-gradient-to-r from-emerald-400 to-teal-400'
                  }`}
                  style={{ width: `${stat.progress}%` }}
                ></div>
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

export default VREngagement;
