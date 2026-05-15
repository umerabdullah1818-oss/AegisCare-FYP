import React from 'react';
import { 
  User, Users, Phone, Search, MoreVertical, HeartPulse, Wind 
} from 'lucide-react';
import GlassCard from './GlassCard';
import AnimatedCard from './AnimatedCard';
import BeautifulFooter from './BeautifulFooter';

const ElderlyList = ({ 
  elderlyList, 
  searchQuery, 
  setSearchQuery, 
  elderlyFilter, 
  setElderlyFilter, 
  setSelectedElderly, 
  setActiveModule, 
  isDarkMode 
}) => {
  const filteredElderly = elderlyList.filter(elderly => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      elderly.name.toLowerCase().includes(q) || 
      elderly.relationship.toLowerCase().includes(q) || 
      elderly.status.toLowerCase().includes(q);

    if (!matchesSearch) return false;

    if (!matchesSearch) return false;

    if (elderlyFilter === 'all') return true;
    if (elderlyFilter === 'stable') return elderly.status === 'Stable';
    if (elderlyFilter === 'attention') return elderly.status === 'Needs Attention';
    if (elderlyFilter === 'monitor') return elderly.status === 'Monitor';
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <GlassCard color="emerald" hoverable={false} darkMode={isDarkMode}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex-1">
            <h1 className={`text-3xl font-bold mb-2 bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent`}>
              Elderly I Monitor
            </h1>
            <p className={`text-lg ${isDarkMode ? 'text-emerald-200/80' : 'text-emerald-700/80'}`}>
              Manage and monitor the elderly under your care
            </p>
          </div>
          <div className="flex gap-3">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
              isDarkMode ? 'bg-emerald-950/40 border border-emerald-900/30' : 'bg-gradient-to-r from-emerald-100 to-teal-100 border border-emerald-200'
            }`}>
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className={`text-sm font-medium ${isDarkMode ? 'text-emerald-300' : 'text-emerald-700'}`}>
                Active: {elderlyList.length} elderly
              </span>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Filters and Search */}
      <div className={`backdrop-blur-xl border-2 rounded-3xl p-6 transition-all duration-300 mb-6 ${
        isDarkMode 
          ? 'bg-gradient-to-br from-gray-950/40 via-gray-900/30 to-gray-950/40 border-emerald-800/30' 
          : 'bg-gradient-to-br from-white/90 via-white/80 to-white/90 border-emerald-200/50'
      }`}>
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
            {['all', 'stable', 'attention', 'monitor'].map((filterOption) => (
              <button
                key={filterOption}
                onClick={() => setElderlyFilter(filterOption)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 capitalize ${
                  elderlyFilter === filterOption
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

      {/* Elderly Grid - Redesigned cleanly */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredElderly.map((elderly, idx) => (
          <div key={elderly.id || idx} className="animate-fade-in" style={{ animationDelay: `${idx * 50}ms` }}>
            <div 
              onClick={() => {
                setSelectedElderly(elderly);
                setActiveModule('elderly-profile');
              }}
              className={`group cursor-pointer rounded-2xl flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                isDarkMode
                  ? 'bg-gray-900 border border-gray-800'
                  : 'bg-white border border-gray-100 shadow-sm'
              }`}
            >
              {/* Top Clean Status Banner */}
              <div className={`h-1.5 w-full ${
                elderly.status === 'Needs Attention' ? 'bg-rose-500' :
                elderly.status === 'Stable' ? 'bg-emerald-500' :
                'bg-amber-500'
              }`}></div>

              <div className="p-5 flex-1 flex flex-col">
                {/* Status & Menu line */}
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md ${
                    elderly.status === 'Needs Attention' 
                      ? (isDarkMode ? 'bg-rose-500/10 text-rose-400' : 'bg-rose-50 text-rose-600')
                      : elderly.status === 'Stable'
                      ? (isDarkMode ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600')
                      : (isDarkMode ? 'bg-amber-500/10 text-amber-400' : 'bg-amber-50 text-amber-600')
                  }`}>
                    <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1.5 ${
                      elderly.status === 'Needs Attention' ? 'bg-rose-500 animate-pulse' :
                      elderly.status === 'Stable' ? 'bg-emerald-500' :
                      'bg-amber-500'
                    }`}></span>
                    {elderly.status}
                  </span>
                  <button className={`p-1 rounded hover:bg-gray-100 ${isDarkMode ? 'hover:bg-gray-800 text-gray-500' : 'text-gray-400'} transition-colors`}>
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>

                {/* Profile Header */}
                <div className="flex items-center gap-3 mb-5">
                  <img 
                    src={elderly.photo || "https://img.freepik.com/free-vector/user-blue-gradient_78370-4692.jpg"} 
                    alt={elderly.name} 
                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-100 dark:border-gray-800"
                  />
                  <div>
                    <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} truncate`}>
                      {elderly.name}
                    </h3>
                    <p className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {elderly.age} yrs • {elderly.location}
                    </p>
                  </div>
                </div>

                {/* Minimalist Telemetry Component */}
                <div className="flex items-center gap-3 mb-5">
                  <div className={`flex-1 flex items-center gap-3 p-2.5 rounded-xl border ${isDarkMode ? 'bg-gray-800/40 border-gray-700' : 'bg-gray-50 border-gray-100'}`}>
                    <div className={`p-1.5 rounded-lg ${isDarkMode ? 'bg-rose-900/30' : 'bg-white shadow-sm'}`}>
                      <HeartPulse className="w-4 h-4 text-rose-500" />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Heart</div>
                      <div className={`font-bold leading-none ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                        {elderly.vitals?.heartRate || '--'} <span className="text-[10px] font-normal text-gray-400">bpm</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`flex-1 flex items-center gap-3 p-2.5 rounded-xl border ${isDarkMode ? 'bg-gray-800/40 border-gray-700' : 'bg-gray-50 border-gray-100'}`}>
                    <div className={`p-1.5 rounded-lg ${isDarkMode ? 'bg-cyan-900/30' : 'bg-white shadow-sm'}`}>
                      <Wind className="w-4 h-4 text-cyan-500" />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">SpO2</div>
                      <div className={`font-bold leading-none ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                        {elderly.vitals?.spo2 || '--'} <span className="text-[10px] font-normal text-gray-400">%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Spacer to push buttons to bottom */}
                <div className="mt-auto"></div>

                {/* Clean Action Buttons */}
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      window.location.href = `tel:+1234567890`;
                    }}
                    className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      isDarkMode 
                        ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                        : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                    }`}
                  >
                    <Phone className="w-4 h-4" /> Contact
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedElderly(elderly);
                      setActiveModule('elderly-profile');
                    }}
                    className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      isDarkMode 
                        ? 'bg-purple-900/40 text-purple-300 hover:bg-purple-800/60' 
                        : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
                    }`}
                  >
                    <User className="w-4 h-4" /> Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <BeautifulFooter isDarkMode={isDarkMode} setActiveModule={setActiveModule} />
    </div>
  );
};

export default ElderlyList;
