import React, { useState } from 'react';
import { CheckCircle, XCircle, Flame } from 'lucide-react';
import api from '../../../../services/api';
import GlassCard from './GlassCard';
import AnimatedCard from './AnimatedCard';
import BeautifulFooter from './BeautifulFooter';

const ReviewDietPlan = ({ isDarkMode, dietPlans, setDietPlans, fetchNotifications, setActiveModule }) => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [localApprovalStatus, setLocalApprovalStatus] = useState({});
  const [comments, setComments] = useState({});
  const [actionMsg, setActionMsg] = useState('');

  const handleApprove = async (planId) => {
    try {
      const res = await api.put(`/meals/${planId}/approve`);
      if (res.data.success) {
        setLocalApprovalStatus(prev => ({ ...prev, [planId]: 'approved' }));
        setActionMsg('Meal plan approved successfully!');
        setDietPlans(prev => prev.map(p => p.id === planId ? { ...p, status: 'Approved', reviewed: true, approvalStatus: 'approved' } : p));
        fetchNotifications();
        setTimeout(() => setActionMsg(''), 3000);
      }
    } catch (err) {
      setActionMsg(err.response?.data?.message || 'Error approving plan');
      setTimeout(() => setActionMsg(''), 3000);
    }
  };

  const handleReject = async (planId) => {
    try {
      const res = await api.put(`/meals/${planId}/reject`);
      if (res.data.success) {
        setLocalApprovalStatus(prev => ({ ...prev, [planId]: 'rejected' }));
        setActionMsg('Meal plan rejected.');
        setDietPlans(prev => prev.map(p => p.id === planId ? { ...p, status: 'Rejected', reviewed: true, approvalStatus: 'rejected' } : p));
        fetchNotifications();
        setTimeout(() => setActionMsg(''), 3000);
      }
    } catch (err) {
      setActionMsg(err.response?.data?.message || 'Error rejecting plan');
      setTimeout(() => setActionMsg(''), 3000);
    }
  };

  const handleCommentChange = (planId, value) => {
    setComments(prev => ({ ...prev, [planId]: value }));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <GlassCard color="amber" hoverable={false} darkMode={isDarkMode}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex-1">
            <h1 className={`text-3xl font-bold mb-2 bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent`}>
              Review Diet Plans
            </h1>
            <p className={`text-lg ${isDarkMode ? 'text-amber-200/80' : 'text-amber-700/80'}`}>
              Review and approve diet plans for elderly under your care
            </p>
          </div>
          <div className="flex gap-3">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
              isDarkMode ? 'bg-amber-950/40 border border-amber-900/30' : 'bg-gradient-to-r from-amber-100 to-orange-100 border border-amber-200'
            }`}>
              <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
              <span className={`text-sm font-medium ${isDarkMode ? 'text-amber-300' : 'text-amber-700'}`}>
                Pending: {dietPlans.filter(p => p.approvalStatus === 'pending').length} plans
              </span>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Diet Plans List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {actionMsg && (
          <div className={`col-span-full p-4 rounded-xl text-center font-medium ${
            actionMsg.includes('Error') ? isDarkMode ? 'bg-rose-900/30 text-rose-300' : 'bg-rose-100 text-rose-700'
              : isDarkMode ? 'bg-emerald-900/30 text-emerald-300' : 'bg-emerald-100 text-emerald-700'
          }`}>
            {actionMsg}
          </div>
        )}
        {dietPlans.map((plan, idx) => (
          <AnimatedCard key={plan.id} delay={idx}>
            <div className={`rounded-3xl p-6 backdrop-blur-sm border-2 transition-all duration-300 hover:scale-[1.02] ${
              isDarkMode
                ? 'bg-gradient-to-br from-gray-900/40 to-gray-950/40 border-gray-800'
                : 'bg-gradient-to-br from-white/90 to-gray-50/90 border-gray-200'
            }`}>
              {/* Plan Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className={`text-xl font-bold mb-1 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                    {plan.elderly}'s Diet Plan
                  </h3>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      📅 {plan.date}
                    </span>
                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      🍽️ {plan.name} ({plan.mealType})
                    </span>
                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      🔥 {plan.calories} cal
                    </span>
                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      ⏰ {plan.scheduledTime}
                    </span>
                  </div>
                </div>
                <span className={`text-sm px-3 py-1 rounded-full ${
                  plan.status === 'Approved' 
                    ? isDarkMode ? 'bg-emerald-900/30 text-emerald-300' : 'bg-emerald-100 text-emerald-700'
                    : plan.status === 'Rejected'
                    ? isDarkMode ? 'bg-rose-900/30 text-rose-300' : 'bg-rose-100 text-rose-700'
                    : isDarkMode ? 'bg-amber-900/30 text-amber-300' : 'bg-amber-100 text-amber-700'
                }`}>
                  {plan.status}
                </span>
              </div>

              {/* Meal Details - Real Data */}
              <div className="space-y-3 mb-6">
                <h4 className={`font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Meal Details:
                </h4>
                <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-800/40' : 'bg-gray-100/50'}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {plan.mealType ? plan.mealType.charAt(0).toUpperCase() + plan.mealType.slice(1) : 'Meal'}
                    </span>
                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      ⏰ {plan.scheduledTime}
                    </span>
                  </div>
                  <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {plan.name}
                  </div>
                  {plan.notes && (
                    <div className={`text-xs mt-1 italic ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                      Note: {plan.notes}
                    </div>
                  )}
                </div>
              </div>

              {/* Nutritional Info - Real Data */}
              <div className="grid grid-cols-4 gap-3 mb-6">
                <div className={`p-3 rounded-lg text-center ${isDarkMode ? 'bg-rose-900/20' : 'bg-rose-50'}`}>
                  <div className={`text-lg font-bold mb-1 ${isDarkMode ? 'text-rose-300' : 'text-rose-600'}`}>
                    {plan.calories}
                  </div>
                  <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Calories</div>
                </div>
                <div className={`p-3 rounded-lg text-center ${isDarkMode ? 'bg-blue-900/20' : 'bg-blue-50'}`}>
                  <div className={`text-lg font-bold mb-1 ${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`}>
                    {plan.protein}g
                  </div>
                  <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Protein</div>
                </div>
                <div className={`p-3 rounded-lg text-center ${isDarkMode ? 'bg-emerald-900/20' : 'bg-emerald-50'}`}>
                  <div className={`text-lg font-bold mb-1 ${isDarkMode ? 'text-emerald-300' : 'text-emerald-600'}`}>
                    {plan.carbs}g
                  </div>
                  <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Carbs</div>
                </div>
                <div className={`p-3 rounded-lg text-center ${isDarkMode ? 'bg-amber-900/20' : 'bg-amber-50'}`}>
                  <div className={`text-lg font-bold mb-1 ${isDarkMode ? 'text-amber-300' : 'text-amber-600'}`}>
                    {plan.fats}g
                  </div>
                  <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Fats</div>
                </div>
              </div>

              {/* Review Actions */}
              {!plan.reviewed && plan.approvalStatus === 'pending' && !localApprovalStatus[plan.id] && (
                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Add Comments (Optional)
                    </label>
                    <textarea
                      value={comments[plan.id] || ''}
                      onChange={(e) => handleCommentChange(plan.id, e.target.value)}
                      className={`w-full h-24 px-3 py-2 rounded-lg resize-none transition-all duration-300 ${
                        isDarkMode 
                          ? 'bg-gray-800/50 border-gray-700 text-white placeholder-gray-500 focus:border-amber-500'
                          : 'bg-white/50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-amber-400'
                      } border focus:ring-2 focus:ring-amber-500 focus:border-transparent`}
                     
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleReject(plan.id)}
                      className={`flex-1 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2 ${
                        isDarkMode
                          ? 'bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white shadow-rose-500/25'
                          : 'bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white shadow-rose-400/25'
                      } shadow-lg`}
                    >
                      <XCircle className="w-5 h-5" />
                      Reject Plan
                    </button>
                    <button
                      onClick={() => handleApprove(plan.id)}
                      className={`flex-1 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2 ${
                        isDarkMode
                          ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-500/25'
                          : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-emerald-400/25'
                      } shadow-lg`}
                    >
                      <CheckCircle className="w-5 h-5" />
                      Approve Plan
                    </button>
                  </div>
                </div>
              )}

              {/* Approval Status */}
              {plan.reviewed && (
                <div className={`p-3 rounded-lg ${
                  plan.status === 'Approved' 
                    ? isDarkMode ? 'bg-emerald-900/20' : 'bg-emerald-50'
                    : isDarkMode ? 'bg-rose-900/20' : 'bg-rose-50'
                }`}>
                  <div className="flex items-center gap-2 mb-1">
                    {plan.status === 'Approved' ? (
                      <CheckCircle className={`w-5 h-5 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
                    ) : (
                      <XCircle className={`w-5 h-5 ${isDarkMode ? 'text-rose-400' : 'text-rose-600'}`} />
                    )}
                    <span className={`font-medium ${
                      plan.status === 'Approved' 
                        ? isDarkMode ? 'text-emerald-300' : 'text-emerald-700'
                        : isDarkMode ? 'text-rose-300' : 'text-rose-700'
                    }`}>
                      Plan {plan.status.toLowerCase()}
                    </span>
                  </div>
                  <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Reviewed on {plan.date}
                  </div>
                </div>
              )}
            </div>
          </AnimatedCard>
        ))}
      </div>

      <BeautifulFooter isDarkMode={isDarkMode} setActiveModule={setActiveModule} />
    </div>
  );
};

export default ReviewDietPlan;
