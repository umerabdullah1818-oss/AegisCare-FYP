import React, { useState, useEffect } from 'react';
import {
  History, UserPlus, UserMinus, CheckSquare, AlertTriangle,
  Download, Bell, Search, Calendar, ChevronDown, X,
  DownloadCloud, Mail
} from 'lucide-react';
import api from '../../../../services/api';
import GlassCard from './GlassCard';
import BeautifulFooter from './BeautifulFooter';

const ActivityLog = ({ isDarkMode, dashboardStats, showToast, setActiveModule }) => {
  const [allActivities, setAllActivities] = useState([]);
  const [activitiesLoading, setActivitiesLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setActivitiesLoading(true);
        const res = await api.get('/admin/activities');
        if (res.data && res.data.success) {
          setAllActivities(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching activities:', err);
        if (dashboardStats.activities && dashboardStats.activities.length > 0) {
          setAllActivities(dashboardStats.activities.map((a, i) => ({
            id: i, user: a.user, action: a.action, type: 'notification',
            timestamp: new Date(Date.now() - i * 3600000).toISOString(), color: a.color || 'blue'
          })));
        }
      } finally {
        setActivitiesLoading(false);
      }
    };
    fetchActivities();
  }, []);

  const getTimeAgo = (timestamp) => {
    const diffMins = Math.round((new Date() - new Date(timestamp)) / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 30) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return new Date(timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const typeConfig = {
    registration: { label: 'Registration', icon: <UserPlus size={16} />, gradient: 'from-emerald-500 to-teal-500', bg: isDarkMode ? 'bg-emerald-900/20' : 'bg-emerald-50', text: isDarkMode ? 'text-emerald-300' : 'text-emerald-700' },
    deletion: { label: 'Deletion', icon: <UserMinus size={16} />, gradient: 'from-rose-500 to-red-500', bg: isDarkMode ? 'bg-rose-900/20' : 'bg-rose-50', text: isDarkMode ? 'text-rose-300' : 'text-rose-700' },
    bulk_action: { label: 'Bulk Action', icon: <CheckSquare size={16} />, gradient: 'from-indigo-500 to-purple-500', bg: isDarkMode ? 'bg-indigo-900/20' : 'bg-indigo-50', text: isDarkMode ? 'text-indigo-300' : 'text-indigo-700' },
    emergency: { label: 'Emergency', icon: <AlertTriangle size={16} />, gradient: 'from-red-500 to-orange-500', bg: isDarkMode ? 'bg-red-900/20' : 'bg-red-50', text: isDarkMode ? 'text-red-300' : 'text-red-700' },
    export: { label: 'Export', icon: <Download size={16} />, gradient: 'from-blue-500 to-cyan-500', bg: isDarkMode ? 'bg-blue-900/20' : 'bg-blue-50', text: isDarkMode ? 'text-blue-300' : 'text-blue-700' },
    notification: { label: 'Notification', icon: <Bell size={16} />, gradient: 'from-amber-500 to-yellow-500', bg: isDarkMode ? 'bg-amber-900/20' : 'bg-amber-50', text: isDarkMode ? 'text-amber-300' : 'text-amber-700' },
  };

  const filteredActivities = allActivities.filter(a => {
    const matchesSearch = !searchQuery ||
      a.user?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.action?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || a.type === typeFilter;
    let matchesDate = true;
    if (dateFilter === 'today') {
      const today = new Date(); today.setHours(0, 0, 0, 0);
      matchesDate = new Date(a.timestamp) >= today;
    } else if (dateFilter === 'week') {
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      matchesDate = new Date(a.timestamp) >= weekAgo;
    } else if (dateFilter === 'month') {
      const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      matchesDate = new Date(a.timestamp) >= monthAgo;
    }
    return matchesSearch && matchesType && matchesDate;
  });

  const downloadCSV = () => {
    const headers = ['User', 'Action', 'Type', 'Description', 'Timestamp'];
    const rows = filteredActivities.map(a => [
      a.user || '', a.action || '', a.type || '', (a.description || '').replace(/,/g, ';'),
      new Date(a.timestamp).toLocaleString()
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `activity_log_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
    showToast('Activity log downloaded successfully!', 'success');
  };

  const typeCounts = {};
  allActivities.forEach(a => { typeCounts[a.type] = (typeCounts[a.type] || 0) + 1; });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <GlassCard color="cyan" hoverable={false} darkMode={isDarkMode}>
        <div className="absolute top-0 right-0 w-64 h-64 -translate-y-32 translate-x-32 rounded-full bg-gradient-to-r from-cyan-600/10 to-blue-600/10 blur-3xl animate-pulse-slow"></div>
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-3 rounded-2xl transition-all duration-300 ${isDarkMode ? 'bg-cyan-950/40' : 'bg-gradient-to-r from-cyan-100 to-blue-100'}`}>
                  <History className={`w-8 h-8 ${isDarkMode ? 'text-cyan-400' : 'text-cyan-600'}`} />
                </div>
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold mb-1 bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                    Activity Log
                  </h1>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Complete history of all system activities and user actions
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={downloadCSV} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:scale-105 shadow-lg bg-gradient-to-r from-cyan-500 to-blue-600 shadow-cyan-500/25 hover:shadow-cyan-500/40">
                <DownloadCloud size={18} />
                Download CSV
              </button>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {Object.entries(typeConfig).map(([key, config]) => (
          <div key={key} onClick={() => setTypeFilter(prev => prev === key ? 'all' : key)}
            className={`relative overflow-hidden rounded-2xl p-4 cursor-pointer transition-all duration-300 border-2 ${typeFilter === key
                ? `border-transparent bg-gradient-to-br ${config.gradient} text-white shadow-lg`
                : isDarkMode ? 'border-gray-800 bg-gray-900/50 hover:border-gray-700' : 'border-gray-100 bg-white hover:border-gray-200 shadow-sm'
              }`}>
            <div className="flex items-center gap-2 mb-2">
              <span className={typeFilter === key ? 'text-white' : config.text}>{config.icon}</span>
              <span className={`text-xs font-semibold ${typeFilter === key ? 'text-white/80' : isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{config.label}</span>
            </div>
            <p className={`text-2xl font-black ${typeFilter === key ? 'text-white' : isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
              {typeCounts[key] || 0}
            </p>
          </div>
        ))}
      </div>

      {/* Filters & Search */}
      <GlassCard darkMode={isDarkMode} className="!overflow-visible relative z-20">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} size={18} />
            <input
              type="text"
              value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm transition-all ${isDarkMode ? 'bg-gray-800/50 border-gray-700 text-gray-200 focus:border-cyan-500 placeholder-gray-500' : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-cyan-500 placeholder-gray-400'} focus:outline-none focus:ring-2 focus:ring-cyan-500/20`}
            />
          </div>
          {/* Custom Date Filter Dropdown */}
          <div className="relative min-w-[160px]">
            <button
              onClick={() => setIsDateDropdownOpen(!isDateDropdownOpen)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-300 ${isDarkMode
                  ? 'bg-gray-800/50 border-gray-700 text-gray-200 hover:bg-gray-800 hover:border-cyan-500/50'
                  : 'bg-white border-gray-100 text-gray-700 hover:bg-gray-50 hover:border-cyan-400/50 shadow-sm hover:shadow-md'
                } focus:outline-none focus:ring-2 focus:ring-cyan-500/20`}
            >
              <div className="flex items-center gap-2">
                <Calendar size={16} className={isDarkMode ? 'text-cyan-500' : 'text-cyan-600'} />
                <span>
                  {dateFilter === 'all' ? 'All Time' :
                    dateFilter === 'today' ? 'Today' :
                      dateFilter === 'week' ? 'This Week' : 'This Month'}
                </span>
              </div>
              <ChevronDown size={16} className={`transition-transform duration-300 ${isDateDropdownOpen ? 'rotate-180' : ''} ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
            </button>

            {isDateDropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsDateDropdownOpen(false)}></div>
                <div className={`absolute top-[calc(100%+8px)] left-0 right-0 z-50 py-2 rounded-xl shadow-xl border overflow-hidden transition-all animate-fade-in ${isDarkMode ? 'bg-gray-800 border-gray-700 shadow-black/50' : 'bg-white border-gray-100 shadow-cyan-900/10'
                  }`}>
                  {[
                    { value: 'all', label: 'All Time' },
                    { value: 'today', label: 'Today' },
                    { value: 'week', label: 'This Week' },
                    { value: 'month', label: 'This Month' }
                  ].map(option => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setDateFilter(option.value);
                        setIsDateDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors ${dateFilter === option.value
                          ? (isDarkMode ? 'bg-cyan-900/30 text-cyan-400 border-l-2 border-cyan-400' : 'bg-cyan-50 text-cyan-700 border-l-2 border-cyan-500')
                          : (isDarkMode ? 'text-gray-300 hover:bg-gray-700/50 hover:text-white border-l-2 border-transparent' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-l-2 border-transparent')
                        }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {(searchQuery || typeFilter !== 'all' || dateFilter !== 'all') && (
            <button onClick={() => { setSearchQuery(''); setTypeFilter('all'); setDateFilter('all'); }}
              className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${isDarkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-white text-gray-600 hover:bg-gray-50 shadow-sm border border-gray-100 hover:border-gray-200'}`}>
              <X size={16} className="inline mr-1" /> Clear
            </button>
          )}
        </div>
      </GlassCard>

      {/* Activity List */}
      <GlassCard hoverable={false} darkMode={isDarkMode}>
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-lg font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
            All Activities
            <span className={`ml-2 text-sm font-normal ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              ({filteredActivities.length} of {allActivities.length})
            </span>
          </h2>
        </div>

        {activitiesLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
          </div>
        ) : filteredActivities.length === 0 ? (
          <div className="text-center py-16">
            <History size={48} className={`mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-300'}`} />
            <p className={`text-lg font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>No activities found</p>
            <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>Try adjusting your filters or search query</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredActivities.map((activity, idx) => {
              const config = typeConfig[activity.type] || typeConfig.notification;
              return (
                <div key={activity.id || idx}
                  className={`group relative flex items-start gap-4 p-4 rounded-2xl border transition-all duration-300 ${isDarkMode ? 'bg-gray-800/30 border-gray-800' : 'bg-white border-gray-100'
                    }`}>
                  <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${config.bg}`}>
                    <span className={config.text}>{config.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`font-bold text-sm ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                            {activity.user}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${config.bg} ${config.text}`}>
                            {config.label}
                          </span>
                        </div>
                        <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          {activity.action}
                        </p>
                        {activity.description && (
                          <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                            {activity.description}
                          </p>
                        )}
                        {activity.email && (
                          <p className={`text-xs mt-1 flex items-center gap-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                            <Mail size={12} /> {activity.email}
                          </p>
                        )}
                      </div>
                      <div className="text-right shrink-0">
                        <span className={`text-xs font-medium ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                          {getTimeAgo(activity.timestamp)}
                        </span>
                        <p className={`text-[10px] mt-1 ${isDarkMode ? 'text-gray-600' : 'text-gray-300'}`}>
                          {new Date(activity.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </GlassCard>

      <BeautifulFooter isDarkMode={isDarkMode} setActiveModule={setActiveModule} />
    </div>
  );
};

export default ActivityLog;
