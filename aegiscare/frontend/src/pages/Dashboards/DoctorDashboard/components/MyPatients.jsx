import React from 'react';
import { Search, User, Eye, BrainCircuit } from 'lucide-react';
import GlassCard from './GlassCard';
import AnimatedCard from './AnimatedCard';
import BeautifulFooter from './BeautifulFooter';
import { getColorClass } from '../helpers';

const MyPatients = ({ isDarkMode, patients, searchQuery, setSearchQuery, patientsFilter, setPatientsFilter, setSelectedPatient, setActiveModule }) => {
    const filteredPatients = patients.filter(patient => {
      const searchLower = searchQuery.toLowerCase();
      const pName = patient.name || '';
      const pCond = patient.condition || '';
      const pId = patient.id ? patient.id.toString() : '';

      const matchesSearch = 
        pName.toLowerCase().includes(searchLower) ||
        pCond.toLowerCase().includes(searchLower) ||
        pId.toLowerCase().includes(searchLower);

      if (!matchesSearch) return false;

      if (patientsFilter === 'all') return true;
      if (patientsFilter === 'critical') return patient.status === 'Critical';
      if (patientsFilter === 'stable') return patient.status === 'Stable';
      if (patientsFilter === 'improving') return patient.status === 'Improving';
      return true;
    });

    return (
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <GlassCard color="emerald" hoverable={false} darkMode={isDarkMode}>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex-1">
              <h1 className={`text-3xl font-bold mb-2 bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent`}>
                My Patients
              </h1>
              <p className={`text-lg ${isDarkMode ? 'text-emerald-200/80' : 'text-emerald-700/80'}`}>
                Manage and monitor your patient's health in real-time
              </p>
            </div>
            <div className="flex gap-3">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                isDarkMode ? 'bg-emerald-950/40 border border-emerald-900/30' : 'bg-gradient-to-r from-emerald-100 to-teal-100 border border-emerald-200'
              }`}>
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className={`text-sm font-medium ${isDarkMode ? 'text-emerald-300' : 'text-emerald-700'}`}>
                  Active: {patients.length} patients
                </span>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Filters and Search */}
        <div className={`backdrop-blur-xl border-2 rounded-3xl p-6 transition-all duration-300 ${isDarkMode ? 'bg-gradient-to-br from-gray-950/40 via-gray-900/30 to-gray-950/40 border-emerald-800/30' : 'bg-gradient-to-br from-white/90 via-white/80 to-white/90 border-emerald-200/50'}`}>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} size={20} />
                <input
                  type="text"
                 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                    isDarkMode 
                      ? 'bg-gray-900/50 border-gray-800 text-white placeholder-gray-500'
                      : 'bg-white/50 border-gray-200 text-gray-900 placeholder-gray-400'
                  } focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300`}
                />
              </div>
            </div>
            <div className="flex gap-2">
              {['all', 'critical', 'stable', 'improving'].map((filterOption) => (
                <button
                  key={filterOption}
                  onClick={() => setPatientsFilter(filterOption)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 capitalize ${
                    patientsFilter === filterOption
                      ? isDarkMode
                        ? 'bg-emerald-600 text-white'
                        : 'bg-emerald-500 text-white'
                      : isDarkMode
                      ? 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {filterOption}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Patients Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPatients.map((patient, idx) => (
            <AnimatedCard key={patient.id} delay={idx}>
              <div 
                onClick={() => {
                  setSelectedPatient(patient);
                  setActiveModule('patient-profile');
                }}
                className={`group cursor-pointer rounded-3xl p-5 backdrop-blur-sm border-2 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl relative overflow-hidden ${
                  isDarkMode
                    ? 'bg-gradient-to-br from-gray-900/40 to-gray-950/40 border-gray-800'
                    : 'bg-gradient-to-br from-white/90 to-gray-50/90 border-gray-200'
                }`}
              >
                {/* Status Indicator */}
                <div className={`absolute top-4 right-4 w-3 h-3 rounded-full animate-pulse ${
                  patient.status === 'Critical' ? 'bg-rose-500' :
                  patient.status === 'Stable' ? 'bg-emerald-500' :
                  'bg-amber-500'
                }`}></div>

                {/* Patient Avatar */}
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold ${
                    isDarkMode ? getColorClass(patient.color, 'darkBg') : getColorClass(patient.color, 'bg')
                  }`}>
                    <span className={isDarkMode ? getColorClass(patient.color, 'darkText') : getColorClass(patient.color, 'text')}>
                      {patient.image}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-xl font-bold mb-1 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                      {patient.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm px-3 py-1 rounded-full ${
                        patient.status === 'Critical' 
                          ? isDarkMode ? 'bg-rose-900/30 text-rose-300' : 'bg-rose-100 text-rose-700'
                          : patient.status === 'Stable'
                          ? isDarkMode ? 'bg-emerald-900/30 text-emerald-300' : 'bg-emerald-100 text-emerald-700'
                          : isDarkMode ? 'bg-amber-900/30 text-amber-300' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {patient.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Patient Info */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Age / Gender</span>
                    <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {patient.age} yrs • {patient.gender}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Condition</span>
                    <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{patient.condition}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Last Visit</span>
                    <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{patient.lastVisit}</span>
                  </div>
                </div>

                {/* Vitals Preview */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className={`p-2 rounded-lg text-center ${
                    isDarkMode ? 'bg-gray-800/40' : 'bg-gray-100/50'
                  }`}>
                    <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Heart Rate</div>
                    <div className={`text-sm font-bold ${
                      patient.vitals.heartRate > 80 ? 'text-rose-500' : 'text-emerald-500'
                    }`}>
                      {patient.vitals.heartRate} BPM
                    </div>
                  </div>
                  <div className={`p-2 rounded-lg text-center ${
                    isDarkMode ? 'bg-gray-800/40' : 'bg-gray-100/50'
                  }`}>
                    <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>SpO2</div>
                    <div className={`text-sm font-bold ${
                      patient.vitals.spo2 < 95 ? 'text-amber-500' : 'text-emerald-500'
                    }`}>
                      {patient.vitals.spo2}%
                    </div>
                  </div>
                </div>

                {/* ML Risk Badge */}
                {patient.mlInsights?.risk && (
                  <div className={`mb-4 p-2.5 rounded-xl flex items-center gap-2 ${
                    patient.mlInsights.risk.risk_level === 'Low'
                      ? isDarkMode ? 'bg-emerald-900/20 border border-emerald-800/30' : 'bg-emerald-50 border border-emerald-200'
                      : patient.mlInsights.risk.risk_level === 'Medium'
                      ? isDarkMode ? 'bg-amber-900/20 border border-amber-800/30' : 'bg-amber-50 border border-amber-200'
                      : isDarkMode ? 'bg-red-900/20 border border-red-800/30' : 'bg-red-50 border border-red-200'
                  }`}>
                    <BrainCircuit className={`w-4 h-4 ${
                      patient.mlInsights.risk.risk_level === 'Low' ? 'text-emerald-500' : patient.mlInsights.risk.risk_level === 'Medium' ? 'text-amber-500' : 'text-red-500'
                    }`} />
                    <span className={`text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      ML Risk: {patient.mlInsights.risk.risk_level}
                    </span>
                    {patient.mlInsights.anomaly?.is_anomaly && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full ml-auto ${
                        isDarkMode ? 'bg-red-900/40 text-red-300' : 'bg-red-100 text-red-700'
                      }`}>Anomaly</span>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPatient(patient);
                      setActiveModule('patient-profile');
                    }}
                    className={`flex-1 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 ${
                      isDarkMode
                        ? 'bg-emerald-900/30 hover:bg-emerald-800/30 text-emerald-300'
                        : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-700'
                    }`}
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                </div>
              </div>
            </AnimatedCard>
          ))}
        </div>

        <BeautifulFooter isDarkMode={isDarkMode} setActiveModule={setActiveModule} />
      </div>
    );
};

export default MyPatients;
