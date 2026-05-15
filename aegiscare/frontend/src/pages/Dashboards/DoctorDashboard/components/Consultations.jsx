import React, { useState } from 'react';
import { MessageCircle, MessageSquarePlus, BarChart, FileText } from 'lucide-react';
import GlassCard from './GlassCard';
import GlowingButton from './GlowingButton';
import AnimatedCard from './AnimatedCard';
import BeautifulFooter from './BeautifulFooter';

const Consultations = ({ isDarkMode, pendingConsultations, patients, setSelectedPatient, setActiveModule, showToast }) => {
    const [activeFilter, setActiveFilter] = useState('all');

    return (
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <GlassCard color="rose" hoverable={false} darkMode={isDarkMode}>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex-1">
              <h1 className={`text-3xl font-bold mb-2 bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent`}>
                Consultations
              </h1>
              <p className={`text-lg ${isDarkMode ? 'text-rose-200/80' : 'text-rose-700/80'}`}>
                Review and manage patient consultation requests
              </p>
            </div>
            <div className="flex gap-3">
              <GlowingButton 
                icon={<MessageSquarePlus className="w-4 h-4" />}
                color="rose"
                size="md"
              >
                New Consultation
              </GlowingButton>
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                isDarkMode ? 'bg-rose-950/40 border border-rose-900/30' : 'bg-gradient-to-r from-rose-100 to-pink-100 border border-rose-200'
              }`}>
                <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></div>
                <span className={`text-sm font-medium ${isDarkMode ? 'text-rose-300' : 'text-rose-700'}`}>
                  Pending: {pendingConsultations.length}
                </span>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Filters */}
        <div className="flex gap-2 flex-wrap">
          {['all', 'pending', 'urgent', 'emergency', 'completed'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 capitalize ${
                activeFilter === filter
                  ? isDarkMode
                    ? 'bg-rose-600 text-white'
                    : 'bg-rose-500 text-white'
                  : isDarkMode
                  ? 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Consultation Requests */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pending Consultations */}
          <GlassCard color="rose" darkMode={isDarkMode}>
            <h3 className={`text-xl font-bold mb-6 flex items-center gap-2 ${
              isDarkMode ? 'text-rose-300' : 'text-rose-600'
            }`}>
              <MessageCircle className="w-6 h-6 animate-pulse" />
              Pending Review
            </h3>
            <div className="space-y-4">
              {pendingConsultations.map((consult, idx) => (
                <AnimatedCard key={consult.id} delay={idx}>
                  <div className={`p-4 rounded-xl border transition-all duration-300 hover:scale-105 ${
                    isDarkMode ? 'bg-gray-800/40 border-gray-700' : 'bg-white/50 border-gray-200'
                  }`}>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className={`font-bold text-lg mb-1 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                          {consult.patient}
                        </h4>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
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
                      <span className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                        Requested: {consult.requested}
                      </span>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => {
                            const p = patients.find(pt => pt.name === consult.patient);
                            if (p) {
                              setSelectedPatient(p);
                              setActiveModule('patient-profile');
                            }
                            showToast(`Reviewing consultation for ${consult.patient}`, 'success');
                          }}
                          className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 ${
                          isDarkMode
                            ? 'bg-rose-900/30 hover:bg-rose-800/30 text-rose-300'
                            : 'bg-rose-100 hover:bg-rose-200 text-rose-700'
                        }`}>
                          Review
                        </button>
                        <button 
                          onClick={() => showToast(`Message sent to ${consult.patient}`, 'success')}
                          className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 ${
                          isDarkMode
                            ? 'bg-blue-900/30 hover:bg-blue-800/30 text-blue-300'
                            : 'bg-blue-100 hover:bg-blue-200 text-blue-700'
                        }`}>
                          Message
                        </button>
                      </div>
                    </div>
                  </div>
                </AnimatedCard>
              ))}
            </div>
          </GlassCard>

          {/* Consultation Statistics */}
          <GlassCard color="pink" darkMode={isDarkMode}>
            <h3 className={`text-xl font-bold mb-6 flex items-center gap-2 ${
              isDarkMode ? 'text-pink-300' : 'text-pink-600'
            }`}>
              <BarChart className="w-6 h-6 animate-pulse" />
              Consultation Analytics
            </h3>
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className={`p-4 rounded-xl ${
                  isDarkMode ? 'bg-gray-800/40' : 'bg-white/50'
                }`}>
                  <div className={`text-2xl font-bold mb-2 ${
                    isDarkMode ? 'text-pink-300' : 'text-pink-600'
                  }`}>
                    {pendingConsultations.length}
                  </div>
                  <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Total Consultations
                  </div>
                </div>
                <div className={`p-4 rounded-xl ${
                  isDarkMode ? 'bg-gray-800/40' : 'bg-white/50'
                }`}>
                  <div className={`text-2xl font-bold mb-2 ${
                    isDarkMode ? 'text-emerald-300' : 'text-emerald-600'
                  }`}>
                    {pendingConsultations.length > 0 ? Math.round((pendingConsultations.filter(c => c.status === 'completed' || c.status === 'resolved').length / pendingConsultations.length) * 100) || 100 : 0}%
                  </div>
                  <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Response Rate
                  </div>
                </div>
              </div>

              {/* Priority Distribution */}
              <div>
                <h4 className={`font-bold mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Priority Distribution
                </h4>
                <div className="space-y-2">
                  {[
                    { label: 'Emergency', value: pendingConsultations.filter(c => c.priority === 'Critical').length, color: 'rose' },
                    { label: 'Urgent', value: pendingConsultations.filter(c => c.priority === 'High').length, color: 'amber' },
                    { label: 'Normal', value: pendingConsultations.filter(c => c.priority === 'Normal' || c.priority === 'Medium').length, color: 'blue' },
                    { label: 'Routine', value: pendingConsultations.filter(c => !c.priority || c.priority === 'Low').length, color: 'emerald' },
                  ].map((item, idx) => (
                    <div key={item.label} className="flex items-center gap-3">
                      <div className="w-24">
                        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {item.label}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className={`h-2 rounded-full overflow-hidden ${
                          isDarkMode ? 'bg-gray-800' : 'bg-gray-200'
                        }`}>
                          <div
                            className={`h-full rounded-full transition-all duration-1000`}
                            style={{
                              width: `${(item.value / 27) * 100}%`,
                              backgroundColor: item.color === 'rose' ? '#f472b6' :
                                            item.color === 'amber' ? '#f59e0b' :
                                            item.color === 'blue' ? '#3b82f6' : '#10b981'
                            }}
                          ></div>
                        </div>
                      </div>
                      <div className="w-8 text-right">
                        <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          {item.value}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Quick Response Templates */}
        <GlassCard color="rose" darkMode={isDarkMode}>
          <h3 className={`text-xl font-bold mb-6 flex items-center gap-2 ${
            isDarkMode ? 'text-rose-300' : 'text-rose-600'
          }`}>
            <FileText className="w-6 h-6 animate-pulse" />
            Quick Response Templates
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: 'Lab Review', content: 'Your lab results have been reviewed...', color: 'blue' },
              { title: 'Medication Refill', content: 'Your medication refill has been approved...', color: 'emerald' },
              { title: 'Follow-up Required', content: 'A follow-up appointment is recommended...', color: 'amber' },
            ].map((template, idx) => (
              <AnimatedCard key={idx} delay={idx}>
                <div className={`p-4 rounded-xl border transition-all duration-300 hover:scale-105 ${
                  isDarkMode ? 'bg-gray-800/40 border-gray-700' : 'bg-white/50 border-gray-200'
                }`}>
                  <h4 className={`font-bold mb-2 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                    {template.title}
                  </h4>
                  <p className={`text-sm mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {template.content}
                  </p>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(template.content).then(() => {
                        showToast(`"${template.title}" template copied to clipboard!`, 'success');
                      }).catch(() => {
                        showToast(`Template: ${template.content}`, 'success');
                      });
                    }}
                    className={`w-full py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 ${
                    isDarkMode
                      ? `bg-${template.color}-600 hover:bg-${template.color}-500 text-white`
                      : `bg-${template.color}-500 hover:bg-${template.color}-600 text-white`
                  }`}>
                    Use Template
                  </button>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </GlassCard>

        <BeautifulFooter isDarkMode={isDarkMode} setActiveModule={setActiveModule} />
      </div>
    );
};

export default Consultations;
