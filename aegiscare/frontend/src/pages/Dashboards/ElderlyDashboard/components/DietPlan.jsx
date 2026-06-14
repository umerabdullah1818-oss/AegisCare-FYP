import React from 'react';
import {
  Soup,
  Flame,
  Droplets,
  Apple,
  Utensils,
  ClipboardCheck,
  BrainCircuit,
  Sparkles,
  Brain,
} from 'lucide-react';
import { getColorClass } from '../helpers';
import BeautifulFooter from './BeautifulFooter';

const DietPlan = (props) => {
  const {
    isDarkMode,
    setActiveModule,
    meals,
    mealsLoading,
    mealTotals,
    setShowAddMealModal,
    setMealDetailModal,
    handleLogMeal,
    getMealColor,
    getMealIcon,
    nutritionLoading,
    nutritionRecs,
    showAllTips,
    setShowAllTips,
  } = props;

  return (
          <div className="space-y-6">
            {/* Modern Header with Animated Background */}
            <div className={`relative rounded-3xl p-6 overflow-hidden backdrop-blur-xl border transition-all duration-500 ${
              isDarkMode
                ? 'bg-gradient-to-br from-gray-950/80 via-amber-950/30 to-orange-950/20 border-amber-800/30 shadow-2xl shadow-amber-950/30'
                : 'bg-gradient-to-br from-white/90 via-amber-50/60 to-orange-50/40 border-amber-200/50 shadow-2xl shadow-amber-100/50'
            }`}>
              {/* Animated Background Elements */}
              <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-r from-yellow-500/5 to-red-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
              </div>
              
              <div className="relative z-10">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
                  <div>
                    <h2 className={`text-3xl font-bold mb-3 bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent animate-gradient`}>
                      Nutrition & Meal Planning
                    </h2>
                    <p className={`text-base ${isDarkMode ? 'text-amber-200/80' : 'text-amber-700/80'}`}>
                      Personalized meal plans for optimal health and wellness
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap gap-3">
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 hover:scale-105 ${
                      isDarkMode 
                        ? 'bg-amber-950/40 border border-amber-800/50 backdrop-blur-sm' 
                        : 'bg-amber-100 border border-amber-200 backdrop-blur-sm'
                    }`}>
                      <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
                      <span className={`text-sm font-medium ${isDarkMode ? 'text-amber-300' : 'text-amber-700'}`}>
                        Today's Plan: Active
                      </span>
                    </div>
                    <button onClick={() => setShowAddMealModal(true)} className={`px-4 py-2 rounded-full font-medium transition-all duration-300 hover:scale-105 flex items-center gap-2 ${
                      isDarkMode
                        ? 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white'
                        : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white'
                    }`}>
                      <Soup className="w-4 h-4" />
                      Add Meal
                    </button>
                  </div>
                </div>

                {/* Nutrition Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                  {[
                    { label: 'Daily Calories', value: mealTotals.calories.toLocaleString(), icon: <Flame className="w-5 h-5" />, color: 'red', trend: 'of 1,800 goal' },
                    { label: 'Protein Intake', value: `${mealTotals.protein}g`, icon: <Droplets className="w-5 h-5" />, color: 'blue', trend: mealTotals.protein >= 50 ? 'Excellent' : 'Low' },
                    { label: 'Carbs Balance', value: '45%', icon: <Apple className="w-5 h-5" />, color: 'emerald', trend: 'Optimal' },
                    { label: 'Water Intake', value: '1.8L', icon: <Droplets className="w-5 h-5" />, color: 'cyan', trend: 'of 2L goal' },
                  ].map((stat, idx) => (
                    <div key={idx} className={`group rounded-2xl p-5 backdrop-blur-lg border transition-all duration-300 hover:scale-105 hover:shadow-xl relative overflow-hidden ${
                      isDarkMode
                        ? 'bg-gradient-to-br from-gray-900/40 to-gray-950/30 border-gray-800/30'
                        : 'bg-gradient-to-br from-white/80 to-gray-50/80 border-gray-200/40'
                    }`}>
                      {/* Card glow effect */}
                      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r ${
                        stat.color === 'red' ? 'from-red-500/5 via-orange-500/5 to-red-500/5' :
                        stat.color === 'blue' ? 'from-blue-500/5 via-indigo-500/5 to-blue-500/5' :
                        stat.color === 'emerald' ? 'from-emerald-500/5 via-green-500/5 to-emerald-500/5' :
                        'from-cyan-500/5 via-sky-500/5 to-cyan-500/5'
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
                              ? stat.color === 'red' ? 'bg-red-900/30 text-red-300' : 
                                stat.color === 'blue' ? 'bg-blue-900/30 text-blue-300' :
                                stat.color === 'emerald' ? 'bg-emerald-900/30 text-emerald-300' :
                                'bg-cyan-900/30 text-cyan-300'
                              : stat.color === 'red' ? 'bg-red-100 text-red-700' : 
                                stat.color === 'blue' ? 'bg-blue-100 text-blue-700' :
                                stat.color === 'emerald' ? 'bg-emerald-100 text-emerald-700' :
                                'bg-cyan-100 text-cyan-700'
                          }`}>
                            {stat.trend}
                          </span>
                        </div>
                        <h3 className={`text-3xl font-bold mb-2 bg-gradient-to-r ${
                          isDarkMode
                            ? stat.color === 'red' ? 'from-red-300 to-orange-300' :
                              stat.color === 'blue' ? 'from-blue-300 to-indigo-300' :
                              stat.color === 'emerald' ? 'from-emerald-300 to-green-300' :
                              'from-cyan-300 to-sky-300'
                            : stat.color === 'red' ? 'from-red-600 to-orange-600' :
                              stat.color === 'blue' ? 'from-blue-600 to-indigo-600' :
                              stat.color === 'emerald' ? 'from-emerald-600 to-green-600' :
                              'from-cyan-600 to-sky-600'
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
              {/* Today's Meals Section */}
              <div className={`lg:col-span-2 group relative rounded-3xl p-6 backdrop-blur-xl border-2 overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-xl ${
                isDarkMode
                  ? 'bg-gradient-to-br from-gray-950/40 via-gray-900/30 to-gray-950/40 border-amber-800/30'
                  : 'bg-gradient-to-br from-white/90 via-white/80 to-white/90 border-amber-200/50'
              }`}>
                {/* Animated Background */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className={`text-2xl font-bold mb-2 flex items-center gap-3 ${
                        isDarkMode ? 'text-amber-300' : 'text-amber-600'
                      }`}>
                        <Utensils className="w-7 h-7" />
                        Today's Meal Plan
                      </h3>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Nutritionist-approved meals for optimal health
                      </p>
                    </div>
                    <div className={`p-2 rounded-lg ${
                      isDarkMode ? 'bg-amber-950/40' : 'bg-amber-100'
                    }`}>
                      <ClipboardCheck className={`w-5 h-5 ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`} />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {meals.length === 0 && !mealsLoading ? (
                      <div className={`text-center py-8 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        <Utensils className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p className="font-medium">No meals planned for today</p>
                        <p className="text-sm mt-1">Click "Add Meal" to get started</p>
                      </div>
                    ) : meals.map((meal, idx) => {
                      const mealColor = getMealColor(meal.mealType);
                      const mealIcon = getMealIcon(meal.mealType);
                      const displayTime = `${meal.mealType.charAt(0).toUpperCase() + meal.mealType.slice(1)} (${meal.scheduledTime})`;
                      return (
                      <div key={meal._id || idx} className={`group/meal rounded-2xl p-4 backdrop-blur-sm border transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${
                        isDarkMode
                          ? 'bg-gray-900/30 border-gray-800 hover:border-amber-700/30'
                          : 'bg-white/50 border-gray-200 hover:border-amber-300/50'
                      }`}>
                        <div className="flex items-start gap-4">
                          <div className={`p-3 rounded-xl transition-all duration-300 group-hover/meal:rotate-12 ${
                            isDarkMode ? getColorClass(mealColor, 'darkBg') : getColorClass(mealColor, 'bg')
                          }`}>
                            <div className={isDarkMode ? getColorClass(mealColor, 'darkText') : getColorClass(mealColor, 'text')}>
                              {mealIcon}
                            </div>
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className={`font-bold text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                                    {displayTime}
                                  </h4>
                                  <span className={`text-xs px-2 py-1 rounded-full backdrop-blur-sm ${
                                    meal.status === 'consumed' 
                                      ? isDarkMode ? 'bg-emerald-900/30 text-emerald-300' : 'bg-emerald-100 text-emerald-700'
                                      : isDarkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-700'
                                  }`}>
                                    {meal.status === 'consumed' ? 'Consumed' : 'Upcoming'}
                                  </span>
                                  {/* Approval Status Badge */}
                                  <span className={`text-xs px-2 py-1 rounded-full font-semibold backdrop-blur-sm ${
                                    meal.approvalStatus === 'approved'
                                      ? isDarkMode ? 'bg-emerald-900/40 text-emerald-300 border border-emerald-700/30' : 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                                      : meal.approvalStatus === 'rejected'
                                      ? isDarkMode ? 'bg-rose-900/40 text-rose-300 border border-rose-700/30' : 'bg-rose-100 text-rose-700 border border-rose-300'
                                      : isDarkMode ? 'bg-amber-900/40 text-amber-300 border border-amber-700/30' : 'bg-amber-100 text-amber-700 border border-amber-300'
                                  }`}>
                                    {meal.approvalStatus === 'approved' ? `✅ Approved${meal.approvedBy ? ` by ${meal.approvedBy.firstName || ''}` : ''}` 
                                      : meal.approvalStatus === 'rejected' ? `❌ Rejected${meal.approvedBy ? ` by ${meal.approvedBy.firstName || ''}` : ''}` 
                                      : '⏳ Pending Approval'}
                                  </span>
                                </div>
                                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                  {meal.name}
                                </p>
                              </div>
                              <div className={`text-right`}>
                                <div className={`text-lg font-bold mb-0.5 ${
                                  isDarkMode ? 'text-amber-300' : 'text-amber-600'
                                }`}>
                                  {meal.calories} cal
                                </div>
                                <div className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                                  Calories
                                </div>
                              </div>
                            </div>
                            
                            {/* Nutrition Info */}
                            <div className="grid grid-cols-2 gap-3 mt-3">
                              <div className={`p-2 rounded-lg backdrop-blur-sm ${
                                isDarkMode ? 'bg-gray-800/30' : 'bg-gray-100/50'
                              }`}>
                                <div className="flex items-center justify-between">
                                  <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Protein</span>
                                  <span className={`text-xs font-bold ${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`}>{meal.protein}g</span>
                                </div>
                              </div>
                              <div className={`p-2 rounded-lg backdrop-blur-sm ${
                                isDarkMode ? 'bg-gray-800/30' : 'bg-gray-100/50'
                              }`}>
                                <div className="flex items-center justify-between">
                                  <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Carbs</span>
                                  <span className={`text-xs font-bold ${isDarkMode ? 'text-emerald-300' : 'text-emerald-600'}`}>{meal.carbs}g</span>
                                </div>
                              </div>
                            </div>
                            
                            {/* Action Buttons */}
                            <div className="flex gap-2 mt-4">
                              <button onClick={() => setMealDetailModal(meal)} className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all duration-300 hover:scale-105 ${
                                isDarkMode
                                  ? 'bg-gray-800/50 hover:bg-gray-700/50 text-gray-300'
                                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                              }`}>
                                Details
                              </button>
                              {meal.approvalStatus === 'approved' ? (
                                <button onClick={() => handleLogMeal(meal._id)} className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all duration-300 hover:scale-105 ${
                                  meal.status === 'consumed'
                                    ? isDarkMode ? 'bg-emerald-900/30 hover:bg-emerald-800/30 text-emerald-300' : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-700'
                                    : isDarkMode ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white' : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white'
                                }`}>
                                  {meal.status === 'consumed' ? '✓ Consumed' : '🍽️ Eat Now'}
                                </button>
                              ) : meal.approvalStatus === 'rejected' ? (
                                <div className={`flex-1 py-2 rounded-lg text-xs font-semibold text-center ${
                                  isDarkMode ? 'bg-rose-900/20 text-rose-400' : 'bg-rose-50 text-rose-600'
                                }`}>
                                  ❌ Not Allowed
                                </div>
                              ) : (
                                <div className={`flex-1 py-2 rounded-lg text-xs font-semibold text-center ${
                                  isDarkMode ? 'bg-amber-900/20 text-amber-400' : 'bg-amber-50 text-amber-600'
                                }`}>
                                  ⏳ Awaiting Approval
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                    })}
                  </div>
                </div>
              </div>

              {/* Sidebar - ML Nutrition Recommendations, Tips & Water Tracker */}
              <div className="space-y-6">
                {/* ML Nutrition Recommendations */}
                <div className={`group relative rounded-3xl p-5 backdrop-blur-xl border-2 overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-xl ${
                  isDarkMode
                    ? 'bg-gradient-to-br from-gray-950/40 via-gray-900/30 to-gray-950/40 border-amber-800/30'
                    : 'bg-gradient-to-br from-white/90 via-white/80 to-white/90 border-amber-200/50'
                }`}>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className={`text-xl font-bold flex items-center gap-2 ${
                        isDarkMode ? 'text-amber-300' : 'text-amber-600'
                      }`}>
                        <BrainCircuit className="w-5 h-5" />
                        AI Meal Suggestions
                      </h3>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        isDarkMode ? 'bg-amber-900/30 text-amber-300' : 'bg-amber-100 text-amber-700'
                      }`}>ML Powered</div>
                    </div>
                    {nutritionLoading ? (
                      <div className="text-center py-4">
                        <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Getting personalized recommendations...</p>
                      </div>
                    ) : nutritionRecs.length > 0 ? (
                      <div className="space-y-3">
                        {nutritionRecs.slice(0, 4).map((meal, idx) => (
                          <div key={idx} className={`p-3 rounded-xl border transition-all duration-300 hover:scale-[1.02] ${
                            isDarkMode ? 'bg-gray-900/30 border-gray-800' : 'bg-white/50 border-gray-200'
                          }`}>
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <p className={`text-sm font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{meal.name}</p>
                                <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>{meal.meal_type}</p>
                              </div>
                              <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                                isDarkMode ? 'bg-amber-900/30 text-amber-300' : 'bg-amber-100 text-amber-700'
                              }`}>{meal.calories} cal</span>
                            </div>
                            <div className="flex gap-2 flex-wrap">
                              <span className={`text-[10px] px-2 py-0.5 rounded-full ${isDarkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-700'}`}>P: {meal.protein_g}g</span>
                              <span className={`text-[10px] px-2 py-0.5 rounded-full ${isDarkMode ? 'bg-emerald-900/30 text-emerald-300' : 'bg-emerald-100 text-emerald-700'}`}>C: {meal.carbs_g}g</span>
                              <span className={`text-[10px] px-2 py-0.5 rounded-full ${isDarkMode ? 'bg-orange-900/30 text-orange-300' : 'bg-orange-100 text-orange-700'}`}>F: {meal.fats_g}g</span>
                              {meal.tags?.diabetic_friendly && <span className={`text-[10px] px-2 py-0.5 rounded-full ${isDarkMode ? 'bg-purple-900/30 text-purple-300' : 'bg-purple-100 text-purple-700'}`}>Diabetic-Friendly</span>}
                              {meal.tags?.heart_healthy && <span className={`text-[10px] px-2 py-0.5 rounded-full ${isDarkMode ? 'bg-rose-900/30 text-rose-300' : 'bg-rose-100 text-rose-700'}`}>Heart-Healthy</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className={`text-xs text-center py-3 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>No recommendations available</p>
                    )}
                  </div>
                </div>

                {/* Water Tracker */}
                <div className={`group relative rounded-3xl p-5 backdrop-blur-xl border-2 overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-xl ${
                  isDarkMode
                    ? 'bg-gradient-to-br from-gray-950/40 via-gray-900/30 to-gray-950/40 border-cyan-800/30'
                    : 'bg-gradient-to-br from-white/90 via-white/80 to-white/90 border-cyan-200/50'
                }`}>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className={`text-xl font-bold flex items-center gap-2 ${
                        isDarkMode ? 'text-cyan-300' : 'text-cyan-600'
                      }`}>
                        <Droplets className="w-5 h-5" />
                        Water Tracker
                      </h3>
                      <span className={`text-sm font-bold ${isDarkMode ? 'text-cyan-300' : 'text-cyan-600'}`}>
                        1.8L / 2L
                      </span>
                    </div>
                    
                    {/* Water Progress */}
                    <div className="space-y-3">
                      <div className="flex justify-between text-xs">
                        <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Today's Intake</span>
                        <span className={`font-medium ${isDarkMode ? 'text-cyan-300' : 'text-cyan-600'}`}>90%</span>
                      </div>
                      <div className={`h-3 rounded-full overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
                        <div 
                          className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-1000 ease-out"
                          style={{ width: '90%' }}
                        ></div>
                      </div>
                      
                      {/* Water Bottles */}
                      <div className="grid grid-cols-4 gap-2 mt-4">
                        {[1, 2, 3, 4].map((bottle) => (
                          <button key={bottle} className={`p-3 rounded-xl border transition-all duration-300 hover:scale-110 ${
                            bottle <= 3
                              ? isDarkMode 
                                ? 'bg-cyan-900/30 border-cyan-800/30 hover:bg-cyan-800/40'
                                : 'bg-cyan-100 border-cyan-200 hover:bg-cyan-200'
                              : isDarkMode 
                                ? 'bg-gray-800/30 border-gray-700 hover:bg-gray-700/40'
                                : 'bg-gray-100 border-gray-200 hover:bg-gray-200'
                          }`}>
                            <Droplets className={`w-5 h-5 mx-auto ${
                              bottle <= 3 
                                ? isDarkMode ? 'text-cyan-400' : 'text-cyan-600'
                                : isDarkMode ? 'text-gray-500' : 'text-gray-400'
                            }`} />
                            <span className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              {bottle * 0.5}L
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Nutrition Tips */}
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
                        <Sparkles className="w-5 h-5" />
                        Nutrition Tips
                      </h3>
                      <div className={`p-1.5 rounded-lg ${
                        isDarkMode ? 'bg-emerald-950/40' : 'bg-emerald-100'
                      }`}>
                        <Brain className={`w-4 h-4 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {[
                        'Drink water 30 mins before meals for better digestion',
                        'Include protein in every meal to maintain muscle mass',
                        'Choose whole grains over refined carbs for sustained energy',
                        'Add colorful vegetables for antioxidants and fiber',
                        'Eat smaller, more frequent meals to maintain energy levels',
                        'Limit sodium intake to support heart health',
                        'Include calcium-rich foods for stronger bones',
                        'Add omega-3 fatty acids from fish for brain health',
                        'Eat fiber-rich foods to support digestive health',
                        'Avoid processed foods with added sugars and preservatives',
                        'Take vitamin D supplements if sun exposure is limited',
                        'Eat potassium-rich bananas and sweet potatoes for muscle function',
                      ].slice(0, showAllTips ? 12 : 4).map((tip, idx) => (
                        <div key={idx} className={`flex items-start gap-2 p-3 rounded-xl ${
                          isDarkMode ? 'bg-gray-900/30' : 'bg-gray-100/50'
                        }`}>
                          <div className={`p-1 rounded-full mt-0.5 ${isDarkMode ? 'bg-emerald-900/30' : 'bg-emerald-100'}`}>
                            <div className={`w-2 h-2 rounded-full ${isDarkMode ? 'bg-emerald-400' : 'bg-emerald-500'}`}></div>
                          </div>
                          <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {tip}
                          </p>
                        </div>
                      ))}
                    </div>
                    
                    <button onClick={() => setShowAllTips(!showAllTips)} className={`w-full mt-4 py-2.5 rounded-xl font-medium transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 ${
                      isDarkMode
                        ? 'bg-gray-800/50 border-gray-700 hover:bg-gray-700/50 text-emerald-400 border'
                        : 'bg-white border-gray-200 hover:bg-gray-50 text-emerald-600 border'
                    }`}>
                      <Sparkles className="w-4 h-4" />
                      {showAllTips ? 'Show Less' : 'More Tips'}
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

export default DietPlan;
