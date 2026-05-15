import React from 'react';
import {
  BrainCircuit,
  Brain,
  Flame,
  Clock,
  Sparkles,
  Gamepad2,
  Zap,
  Activity,
  Dumbbell,
  Utensils,
  Target,
  Wind,
  Calendar,
  Bell,
} from 'lucide-react';
import { getColorClass } from '../helpers';
import BeautifulFooter from './BeautifulFooter';

const CognitiveActivities = (props) => {
  const {
    isDarkMode,
    activityProgress,
    scheduleItems,
    scheduleReminders,
    setShowProgressModal,
    setShowReminderModal,
    setScheduleDetailItem,
    setScheduleItems,
    openGame,
    startExercise,
    setActiveModule,
  } = props;

  return (
          <div className="space-y-6">
            {/* Modern Header with Animated Background */}
            <div className={`relative rounded-3xl p-6 overflow-hidden backdrop-blur-xl border transition-all duration-500 ${
              isDarkMode
                ? 'bg-gradient-to-br from-gray-950/80 via-purple-950/30 to-pink-950/20 border-purple-800/30 shadow-2xl shadow-purple-950/30'
                : 'bg-gradient-to-br from-white/90 via-purple-50/60 to-pink-50/40 border-purple-200/50 shadow-2xl shadow-purple-100/50'
            }`}>
              {/* Animated Background Elements */}
              <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-r from-indigo-500/5 to-violet-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
              </div>
              
              <div className="relative z-10">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
                  <div>
                    <h2 className={`text-3xl font-bold mb-3 bg-gradient-to-r from-purple-500 via-pink-500 to-violet-500 bg-clip-text text-transparent animate-gradient`}>
                      Cognitive & Physical Activities Hub
                    </h2>
                    <p className={`text-base ${isDarkMode ? 'text-purple-200/80' : 'text-purple-700/80'}`}>
                      Boost brain health and physical wellness with interactive games and exercises
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
                        4 Activities Available
                      </span>
                    </div>
                    <button onClick={() => setShowProgressModal(true)} className={`px-4 py-2 rounded-full font-medium transition-all duration-300 hover:scale-105 flex items-center gap-2 ${
                      isDarkMode
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white'
                        : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white'
                    }`}>
                      <BrainCircuit className="w-4 h-4" />
                      View Progress
                    </button>
                  </div>
                </div>

                {/* Activity Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  {[
                    { label: 'Brain Fitness Score', value: `${Math.round((activityProgress.memory.progress + activityProgress.pattern.progress + activityProgress.reaction.progress + activityProgress.wordrecall.progress) / 4)}%`, icon: <Brain className="w-5 h-5" />, color: 'purple', trend: '+5% this week' },
                    { label: 'Daily Streak', value: `${Math.max(activityProgress.memory.streak, activityProgress.pattern.streak, activityProgress.reaction.streak, activityProgress.wordrecall.streak)} days`, icon: <Flame className="w-5 h-5" />, color: 'amber', trend: 'Keep Going!' },
                    { label: 'Total Play Time', value: `${((activityProgress.yoga.totalMins + activityProgress.chair.totalMins + activityProgress.balance.totalMins + activityProgress.breathing.totalMins) / 60).toFixed(1)} hrs`, icon: <Clock className="w-5 h-5" />, color: 'teal', trend: 'This Week' },
                  ].map((stat, idx) => (
                    <div key={idx} className={`group rounded-2xl p-5 backdrop-blur-lg border transition-all duration-300 hover:scale-105 hover:shadow-xl relative overflow-hidden ${
                      isDarkMode
                        ? 'bg-gradient-to-br from-gray-900/40 to-gray-950/30 border-gray-800/30'
                        : 'bg-gradient-to-br from-white/80 to-gray-50/80 border-gray-200/40'
                    }`}>
                      {/* Card glow effect */}
                      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r ${
                        stat.color === 'purple' ? 'from-purple-500/5 via-pink-500/5 to-purple-500/5' :
                        stat.color === 'amber' ? 'from-amber-500/5 via-orange-500/5 to-amber-500/5' :
                        'from-teal-500/5 via-cyan-500/5 to-teal-500/5'
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
                              ? stat.color === 'purple' ? 'bg-purple-900/30 text-purple-300' : 
                                stat.color === 'amber' ? 'bg-amber-900/30 text-amber-300' :
                                'bg-teal-900/30 text-teal-300'
                              : stat.color === 'purple' ? 'bg-purple-100 text-purple-700' : 
                                stat.color === 'amber' ? 'bg-amber-100 text-amber-700' :
                                'bg-teal-100 text-teal-700'
                          }`}>
                            {stat.trend}
                          </span>
                        </div>
                        <h3 className={`text-3xl font-bold mb-2 bg-gradient-to-r ${
                          isDarkMode
                            ? stat.color === 'purple' ? 'from-purple-300 to-pink-300' :
                              stat.color === 'amber' ? 'from-amber-300 to-orange-300' :
                              'from-teal-300 to-cyan-300'
                            : stat.color === 'purple' ? 'from-purple-600 to-pink-600' :
                              stat.color === 'amber' ? 'from-amber-600 to-orange-600' :
                              'from-teal-600 to-cyan-600'
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

            {/* Main Activities Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {/* Cognitive Activities Section */}
              <div className={`group relative rounded-3xl p-6 backdrop-blur-xl border-2 overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-xl ${
                isDarkMode
                  ? 'bg-gradient-to-br from-gray-950/40 via-gray-900/30 to-gray-950/40 border-purple-800/30'
                  : 'bg-gradient-to-br from-white/90 via-white/80 to-white/90 border-purple-200/50'
              }`}>
                {/* Animated Background */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className={`text-2xl font-bold mb-2 flex items-center gap-3 ${
                        isDarkMode ? 'text-purple-300' : 'text-purple-600'
                      }`}>
                        <BrainCircuit className="w-7 h-7" />
                        Cognitive Activities
                      </h3>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Train your brain with fun and challenging games
                      </p>
                    </div>
                    <div className={`p-2 rounded-lg ${
                      isDarkMode ? 'bg-purple-950/40' : 'bg-purple-100'
                    }`}>
                      <Sparkles className={`w-5 h-5 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { 
                        name: 'Memory Matrix', 
                        icon: <Brain className="w-5 h-5" />, 
                        color: 'purple',
                        description: 'Improve short-term memory',
                        difficulty: 'Medium',
                        progress: activityProgress.memory.progress,
                        duration: '10 mins',
                        gameType: 'memory'
                      },
                      { 
                        name: 'Pattern Puzzles', 
                        icon: <Gamepad2 className="w-5 h-5" />, 
                        color: 'pink',
                        description: 'Enhance pattern recognition',
                        difficulty: 'Easy',
                        progress: activityProgress.pattern.progress,
                        duration: '15 mins',
                        gameType: 'pattern'
                      },
                      { 
                        name: 'Reaction Master', 
                        icon: <Zap className="w-5 h-5" />, 
                        color: 'amber',
                        description: 'Boost reaction speed',
                        difficulty: 'Hard',
                        progress: activityProgress.reaction.progress,
                        duration: '8 mins',
                        gameType: 'reaction'
                      },
                      { 
                        name: 'Word Recall', 
                        icon: <Brain className="w-5 h-5" />, 
                        color: 'violet',
                        description: 'Strengthen verbal memory',
                        difficulty: 'Medium',
                        progress: activityProgress.wordrecall.progress,
                        duration: '12 mins',
                        gameType: 'wordrecall'
                      },
                    ].map((activity, idx) => (
                      <div key={idx} className={`group/activity rounded-2xl p-4 backdrop-blur-sm border transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                        isDarkMode
                          ? 'bg-gray-900/30 border-gray-800 hover:border-purple-700/30'
                          : 'bg-white/50 border-gray-200 hover:border-purple-300/50'
                      }`}>
                        <div className="flex items-start gap-3">
                          <div className={`p-3 rounded-xl transition-all duration-300 group-hover/activity:rotate-12 ${
                            isDarkMode ? getColorClass(activity.color, 'darkBg') : getColorClass(activity.color, 'bg')
                          }`}>
                            <div className={isDarkMode ? getColorClass(activity.color, 'darkText') : getColorClass(activity.color, 'text')}>
                              {activity.icon}
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className={`font-bold text-sm mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                                  {activity.name}
                                </h4>
                                <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                                  {activity.description}
                                </p>
                              </div>
                              <span className={`text-xs px-2 py-1 rounded-full backdrop-blur-sm ${
                                activity.difficulty === 'Easy' 
                                  ? isDarkMode ? 'bg-emerald-900/30 text-emerald-300' : 'bg-emerald-100 text-emerald-700'
                                  : activity.difficulty === 'Medium'
                                  ? isDarkMode ? 'bg-amber-900/30 text-amber-300' : 'bg-amber-100 text-amber-700'
                                  : isDarkMode ? 'bg-red-900/30 text-red-300' : 'bg-red-100 text-red-700'
                              }`}>
                                {activity.difficulty}
                              </span>
                            </div>
                            
                            {/* Progress Bar */}
                            <div className="space-y-1.5">
                              <div className="flex justify-between text-xs">
                                <span className={isDarkMode ? 'text-gray-500' : 'text-gray-600'}>Progress</span>
                                <span className={`font-medium ${
                                  isDarkMode ? 'text-gray-400' : 'text-gray-700'
                                }`}>
                                  {activity.progress}%
                                </span>
                              </div>
                              <div className={`h-1.5 rounded-full overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
                                <div 
                                  className={`h-full rounded-full transition-all duration-1000 ease-out ${
                                    isDarkMode
                                      ? activity.color === 'purple' ? 'bg-gradient-to-r from-purple-500 to-pink-500' :
                                        activity.color === 'pink' ? 'bg-gradient-to-r from-pink-500 to-rose-500' :
                                        activity.color === 'amber' ? 'bg-gradient-to-r from-amber-500 to-orange-500' :
                                        'bg-gradient-to-r from-violet-500 to-purple-500'
                                      : activity.color === 'purple' ? 'bg-gradient-to-r from-purple-400 to-pink-400' :
                                        activity.color === 'pink' ? 'bg-gradient-to-r from-pink-400 to-rose-400' :
                                        activity.color === 'amber' ? 'bg-gradient-to-r from-amber-400 to-orange-400' :
                                        'bg-gradient-to-r from-violet-400 to-purple-400'
                                  }`}
                                  style={{ width: `${activity.progress}%` }}
                                ></div>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between mt-3">
                              <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                                ⏱️ {activity.duration}
                              </span>
                              <button onClick={() => openGame(activity.gameType)} className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-300 hover:scale-105 ${
                                isDarkMode
                                  ? 'bg-purple-900/30 hover:bg-purple-800/30 text-purple-300'
                                  : 'bg-purple-100 hover:bg-purple-200 text-purple-700'
                              }`}>
                                Play Now
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Physical Activities Section */}
              <div className={`group relative rounded-3xl p-6 backdrop-blur-xl border-2 overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-xl ${
                isDarkMode
                  ? 'bg-gradient-to-br from-gray-950/40 via-gray-900/30 to-gray-950/40 border-teal-800/30'
                  : 'bg-gradient-to-br from-white/90 via-white/80 to-white/90 border-teal-200/50'
              }`}>
                {/* Animated Background */}
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-r from-teal-500/10 to-cyan-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className={`text-2xl font-bold mb-2 flex items-center gap-3 ${
                        isDarkMode ? 'text-teal-300' : 'text-teal-600'
                      }`}>
                        <Activity className="w-7 h-7" />
                        Physical Exercises
                      </h3>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Gentle exercises for mobility and strength
                      </p>
                    </div>
                    <div className={`p-2 rounded-lg ${
                      isDarkMode ? 'bg-teal-950/40' : 'bg-teal-100'
                    }`}>
                      <Dumbbell className={`w-5 h-5 ${isDarkMode ? 'text-teal-400' : 'text-teal-600'}`} />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {[
                      { 
                        name: 'Gentle Yoga Flow', 
                        icon: <Activity className="w-5 h-5" />, 
                        color: 'teal',
                        description: 'Improve flexibility and balance',
                        calories: '120 cal',
                        duration: '20 mins',
                        intensity: 'Low'
                      },
                      { 
                        name: 'Chair Exercises', 
                        icon: <Utensils className="w-5 h-5" />, 
                        color: 'cyan',
                        description: 'Safe seated movements',
                        calories: '85 cal',
                        duration: '15 mins',
                        intensity: 'Very Low'
                      },
                      { 
                        name: 'Balance Training', 
                        icon: <Target className="w-5 h-5" />, 
                        color: 'blue',
                        description: 'Prevent falls and improve stability',
                        calories: '95 cal',
                        duration: '18 mins',
                        intensity: 'Low'
                      },
                      { 
                        name: 'Breathing & Stretch', 
                        icon: <Wind className="w-5 h-5" />, 
                        color: 'indigo',
                        description: 'Relaxation and gentle stretching',
                        calories: '60 cal',
                        duration: '12 mins',
                        intensity: 'Very Low'
                      },
                    ].map((exercise, idx) => (
                      <div key={idx} className={`group/exercise rounded-2xl p-4 backdrop-blur-sm border transition-all duration-300 hover:scale-[1.02] ${
                        isDarkMode
                          ? 'bg-gray-900/30 border-gray-800 hover:border-teal-700/30'
                          : 'bg-white/50 border-gray-200 hover:border-teal-300/50'
                      }`}>
                        <div className="flex items-start gap-3">
                          <div className={`p-3 rounded-xl transition-all duration-300 group-hover/exercise:rotate-12 ${
                            isDarkMode ? getColorClass(exercise.color, 'darkBg') : getColorClass(exercise.color, 'bg')
                          }`}>
                            <div className={isDarkMode ? getColorClass(exercise.color, 'darkText') : getColorClass(exercise.color, 'text')}>
                              {exercise.icon}
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className={`font-bold text-sm mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                                  {exercise.name}
                                </h4>
                                <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                                  {exercise.description}
                                </p>
                              </div>
                              <div className="text-right">
                                <div className={`text-xs font-bold mb-0.5 ${
                                  isDarkMode ? 'text-teal-300' : 'text-teal-600'
                                }`}>
                                  {exercise.calories}
                                </div>
                                <div className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                                  ⏱️ {exercise.duration}
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between mt-3">
                              <div className={`flex items-center gap-1 text-xs ${
                                exercise.intensity === 'Very Low' 
                                  ? isDarkMode ? 'text-emerald-400' : 'text-emerald-600'
                                  : isDarkMode ? 'text-blue-400' : 'text-blue-600'
                              }`}>
                                <div className={`w-2 h-2 rounded-full ${
                                  exercise.intensity === 'Very Low' ? 'bg-emerald-500' : 'bg-blue-500'
                                }`}></div>
                                {exercise.intensity} Intensity
                              </div>
                              <button onClick={() => startExercise(exercise)} className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-300 hover:scale-105 ${
                                isDarkMode
                                  ? 'bg-teal-900/30 hover:bg-teal-800/30 text-teal-300'
                                  : 'bg-teal-100 hover:bg-teal-200 text-teal-700'
                              }`}>
                                Start Exercise
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Schedule & Recommendations */}
            <div className={`rounded-3xl p-6 backdrop-blur-xl border-2 transition-all duration-500 ${
              isDarkMode
                ? 'bg-gradient-to-br from-gray-950/40 via-gray-900/30 to-gray-950/40 border-amber-800/30'
                : 'bg-gradient-to-br from-white/90 via-white/80 to-white/90 border-amber-200/50'
            }`}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className={`text-2xl font-bold mb-2 flex items-center gap-3 ${
                    isDarkMode ? 'text-amber-300' : 'text-amber-600'
                  }`}>
                    <Calendar className="w-6 h-6" />
                    Today's Activity Schedule
                  </h3>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Recommended activities for optimal brain and body health
                  </p>
                </div>
                <button onClick={() => setShowReminderModal(true)} className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 hover:scale-105 flex items-center gap-2 ${
                  isDarkMode
                    ? 'bg-gray-800/50 border-gray-700 hover:bg-gray-700/50 text-amber-400 border'
                    : 'bg-white border-gray-200 hover:bg-gray-50 text-amber-600 border'
                }`}>
                  <Clock className="w-4 h-4" />
                  Set Reminder
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {scheduleItems.map((schedule) => {
                  const iconMap = { purple: <Brain className="w-5 h-5" />, teal: <Activity className="w-5 h-5" />, pink: <Gamepad2 className="w-5 h-5" />, blue: <Wind className="w-5 h-5" /> };
                  const hasReminder = scheduleReminders[schedule.id]?.enabled;
                  return (
                  <div key={schedule.id} className={`group relative rounded-2xl p-4 backdrop-blur-sm border transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                    isDarkMode
                      ? 'bg-gray-900/30 border-gray-800 hover:border-amber-700/30'
                      : 'bg-white/50 border-gray-200 hover:border-amber-300/50'
                  }`}>
                    {hasReminder && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center">
                        <Bell className="w-2.5 h-2.5 text-white" />
                      </div>
                    )}
                    <div className="flex items-center justify-between mb-3">
                      <div className={`p-2 rounded-lg ${
                        isDarkMode ? getColorClass(schedule.color, 'darkBg') : getColorClass(schedule.color, 'bg')
                      }`}>
                        <div className={isDarkMode ? getColorClass(schedule.color, 'darkText') : getColorClass(schedule.color, 'text')}>
                          {iconMap[schedule.color]}
                        </div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full backdrop-blur-sm ${
                        schedule.status === 'Completed' 
                          ? isDarkMode ? 'bg-emerald-900/30 text-emerald-300' : 'bg-emerald-100 text-emerald-700'
                          : schedule.status === 'In Progress'
                          ? isDarkMode ? 'bg-purple-900/30 text-purple-300' : 'bg-purple-100 text-purple-700'
                          : schedule.status === 'Upcoming'
                          ? isDarkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-700'
                          : isDarkMode ? 'bg-amber-900/30 text-amber-300' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {schedule.status}
                      </span>
                    </div>
                    <h4 className={`font-bold text-sm mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                      {schedule.activity}
                    </h4>
                    <p className={`text-xs mb-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                      ⏰ {schedule.time} • {schedule.type}
                    </p>
                    <div className="flex gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button onClick={() => setScheduleDetailItem(schedule)} className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 hover:scale-105 ${
                        isDarkMode
                          ? 'bg-gray-800/50 hover:bg-gray-700/50 text-gray-300'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}>
                        Details
                      </button>
                      <button onClick={() => {
                        if (schedule.status === 'Completed') {
                          setScheduleDetailItem(schedule);
                        } else if (schedule.type === 'Cognitive' && schedule.gameType) {
                          setScheduleItems(prev => prev.map(s => s.id === schedule.id ? { ...s, status: 'In Progress' } : s));
                          openGame(schedule.gameType);
                        } else if (schedule.type === 'Physical') {
                          const exerciseMap = { yoga: { name: 'Afternoon Yoga', duration: '20 mins', calories: '120 cal', intensity: 'Low' }, stretching: { name: 'Evening Stretching', duration: '15 mins', calories: '60 cal', intensity: 'Very Low' } };
                          const ex = exerciseMap[schedule.exerciseType] || exerciseMap.yoga;
                          setScheduleItems(prev => prev.map(s => s.id === schedule.id ? { ...s, status: 'In Progress' } : s));
                          startExercise(ex);
                        }
                      }} className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 hover:scale-105 ${
                        schedule.status === 'Completed'
                          ? isDarkMode ? 'bg-gray-800/50 hover:bg-gray-700/50 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                          : schedule.status === 'In Progress'
                          ? isDarkMode ? 'bg-purple-900/30 hover:bg-purple-800/30 text-purple-300' : 'bg-purple-100 hover:bg-purple-200 text-purple-700'
                          : isDarkMode ? 'bg-amber-900/30 hover:bg-amber-800/30 text-amber-300' : 'bg-amber-100 hover:bg-amber-200 text-amber-700'
                      }`}>
                        {schedule.status === 'Completed' ? 'Review' : schedule.status === 'In Progress' ? 'Resume' : 'Start'}
                      </button>
                    </div>
                  </div>
                  );
                })}
              </div>
            </div>
            
            {/* Footer */}
            <BeautifulFooter isDarkMode={isDarkMode} setActiveModule={setActiveModule} />
          </div>
  );
};

export default CognitiveActivities;
