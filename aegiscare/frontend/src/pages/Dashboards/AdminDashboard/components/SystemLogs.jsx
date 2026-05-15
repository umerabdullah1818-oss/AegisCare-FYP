import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Search, CheckCircle, XCircle, AlertTriangle, AlertCircle,
  Eye, Download, X, FileText, Database, DownloadCloud
} from 'lucide-react';
import api from '../../../../services/api';
import { getColorClass } from '../helpers';
import GlassCard from './GlassCard';
import AnimatedCard from './AnimatedCard';
import GlowingButton from './GlowingButton';
import BeautifulFooter from './BeautifulFooter';

const SystemLogs = ({ isDarkMode, showToast, setActiveModule }) => {
  const [filter, setFilter] = useState('all');
  const [selectedLog, setSelectedLog] = useState(null);
  const [timeRange, setTimeRange] = useState('24h');
  const [searchQuery, setSearchQuery] = useState('');
  const [allSystemLogs, setAllSystemLogs] = useState([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setIsLoadingLogs(true);
        const res = await api.get('/admin/activities');
        if (res.data && res.data.success) {
          const mappedLogs = res.data.data.map((a, i) => {
            const dt = new Date(a.timestamp);
            const timeString = dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
            const dateString = dt.toLocaleDateString();

            return {
              id: a.id || i,
              timestamp: `${dateString} ${timeString}`,
              rawDate: dt,
              user: a.user,
              action: a.action,
              status: a.color === 'rose' || a.color === 'red' ? 'failed' : 'success',
              severity: a.color === 'rose' || a.color === 'red' ? 'high' : a.color === 'amber' ? 'medium' : 'low',
              ip: a.email || `192.168.1.${Math.floor(Math.random() * 255)}`
            };
          });
          setAllSystemLogs(mappedLogs);
        }
      } catch (error) {
        console.error('Error fetching logs:', error);
        showToast('Failed to load system logs', 'error');
      } finally {
        setIsLoadingLogs(false);
      }
    };
    fetchLogs();
  }, []);

  const filteredLogs = allSystemLogs.filter(log => {
    const sq = searchQuery.toLowerCase();
    const matchesSearch = !sq ||
      (log.user && log.user.toLowerCase().includes(sq)) ||
      (log.action && log.action.toLowerCase().includes(sq)) ||
      (log.ip && log.ip.toLowerCase().includes(sq));

    if (!matchesSearch) return false;

    if (filter === 'all') return true;
    if (filter === 'success') return log.status === 'success';
    if (filter === 'failed') return log.status === 'failed';
    if (filter === 'high') return log.severity === 'high';
    if (filter === 'medium') return log.severity === 'medium';
    if (filter === 'low') return log.severity === 'low';
    return true;
  });

  const handleExportLogs = () => {
    if (filteredLogs.length === 0) return showToast('No logs to export', 'error');

    const csvHeader = ['Timestamp,User,Action,Severity,IP Address,Status'];
    const csvData = filteredLogs.map(log =>
      `"${log.timestamp}","${log.user}","${log.action}","${log.severity}","${log.ip}","${log.status}"`
    );

    const csvString = [csvHeader, ...csvData].join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `system_logs_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    showToast('Logs exported successfully!', 'success');
  };

  const exportSingleLog = (log) => {
    const csvHeader = ['Timestamp,User,Action,Severity,IP Address,Status'];
    const csvData = [
      `"${log.timestamp}","${log.user}","${log.action}","${log.severity}","${log.ip}","${log.status}"`
    ];

    const csvString = [csvHeader, ...csvData].join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `log_${log.id}_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    showToast('Log exported successfully!', 'success');
  };

  const LogDetailModal = ({ log, onClose }) => {
    return createPortal(
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999] p-4 animate-fade-in">
        <div className={`max-w-2xl w-full rounded-3xl p-6 backdrop-blur-xl border-2 ${isDarkMode
          ? 'bg-gradient-to-br from-gray-950/80 via-gray-900/70 to-gray-950/80 border-gray-800'
          : 'bg-gradient-to-br from-white/95 via-white/90 to-white/95 border-gray-200'
          }`}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl ${log.severity === 'high'
                ? isDarkMode ? 'bg-rose-900/30' : 'bg-rose-100'
                : log.severity === 'medium'
                  ? isDarkMode ? 'bg-amber-900/30' : 'bg-amber-100'
                  : isDarkMode ? 'bg-emerald-900/30' : 'bg-emerald-100'
                }`}>
                {log.severity === 'high' && <AlertTriangle className={isDarkMode ? 'text-rose-300' : 'text-rose-600'} />}
                {log.severity === 'medium' && <AlertCircle className={isDarkMode ? 'text-amber-300' : 'text-amber-600'} />}
                {log.severity === 'low' && <CheckCircle className={isDarkMode ? 'text-emerald-300' : 'text-emerald-600'} />}
              </div>
              <div>
                <h3 className={`text-xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                  Log Details
                </h3>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {log.timestamp}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-800/50' : 'hover:bg-gray-100'
                } transition-colors`}
            >
              <X size={20} className={isDarkMode ? 'text-gray-400' : 'text-gray-600'} />
            </button>
          </div>

          <div className="space-y-4">
            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-800/40' : 'bg-white/50'
              }`}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                    User
                  </label>
                  <div className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {log.user}
                  </div>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                    IP Address
                  </label>
                  <div className={`font-mono text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {log.ip}
                  </div>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                    Status
                  </label>
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${log.status === 'success'
                    ? isDarkMode ? 'bg-emerald-900/30 text-emerald-300' : 'bg-emerald-100 text-emerald-700'
                    : isDarkMode ? 'bg-rose-900/30 text-rose-300' : 'bg-rose-100 text-rose-700'
                    }`}>
                    {log.status}
                  </span>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                    Severity
                  </label>
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${log.severity === 'high'
                    ? isDarkMode ? 'bg-rose-900/30 text-rose-300' : 'bg-rose-100 text-rose-700'
                    : log.severity === 'medium'
                      ? isDarkMode ? 'bg-amber-900/30 text-amber-300' : 'bg-amber-100 text-amber-700'
                      : isDarkMode ? 'bg-emerald-900/30 text-emerald-300' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                    {log.severity}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                Action
              </label>
              <div className={`p-3 rounded-lg border ${isDarkMode ? 'bg-gray-800/30 border-gray-700' : 'bg-gray-50 border-gray-200'
                }`}>
                <code className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {log.action}
                </code>
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                Raw Data
              </label>
              <pre className={`p-3 rounded-lg border text-xs overflow-x-auto ${isDarkMode ? 'bg-gray-800/30 border-gray-700 text-gray-300' : 'bg-gray-50 border-gray-200 text-gray-700'
                }`}>
                {JSON.stringify({
                  timestamp: log.timestamp,
                  user: log.user,
                  action: log.action,
                  ip: log.ip,
                  status: log.status,
                  severity: log.severity,
                  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                  location: 'Unknown',
                  sessionId: 'session_123456'
                }, null, 2)}
              </pre>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              className={`flex-1 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105 ${isDarkMode
                ? 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
            >
              Close
            </button>
            <button
              onClick={() => exportSingleLog(log)}
              className={`flex-1 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105 ${isDarkMode
                ? 'bg-blue-600 hover:bg-blue-500 text-white'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}>
              Export Log
            </button>
          </div>
        </div>
      </div>,
      document.body
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <GlassCard color="purple" hoverable={false} darkMode={isDarkMode}>
        <div className="absolute top-0 right-0 w-64 h-64 -translate-y-32 translate-x-32 rounded-full bg-gradient-to-r from-purple-600/10 to-violet-600/10 blur-3xl animate-pulse-slow"></div>

        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex-1">
              <h1 className={`text-3xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent`}>
                System Logs
              </h1>
              <p className={`text-lg ${isDarkMode ? 'text-purple-200/80' : 'text-purple-700/80'}`}>
                Monitor system activities, login attempts, and security events
              </p>
            </div>
            <div className="flex gap-3">
              <GlowingButton
                icon={<DownloadCloud className="w-4 h-4" />}
                color="purple"
                size="md"
                onClick={handleExportLogs}
                isDarkMode={isDarkMode}
              >
                Export Logs
              </GlowingButton>
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${isDarkMode ? 'bg-purple-950/40 border border-purple-900/30' : 'bg-gradient-to-r from-purple-100 to-violet-100 border border-purple-200'
                }`}>
                <div className={`w-2 h-2 rounded-full bg-purple-500 ${isLoadingLogs ? 'animate-bounce' : 'animate-pulse'}`}></div>
                <span className={`text-sm font-medium ${isDarkMode ? 'text-purple-300' : 'text-purple-700'}`}>
                  {isLoadingLogs ? 'Loading logs...' : `${allSystemLogs.length} total logs`}
                </span>
              </div>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Advanced Filters Section */}
      <GlassCard color="purple" hoverable={false} darkMode={isDarkMode}>
        <div className="space-y-6 animate-fade-in">
          {/* Search Bar */}
          <div className="relative group">
            <div className={`absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none transition-colors duration-300 ${isDarkMode ? 'text-purple-400 group-focus-within:text-purple-300' : 'text-purple-500 group-focus-within:text-purple-600'}`}>
              <Search size={22} />
            </div>
            <input
              type="text"
             
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-12 pr-12 py-3.5 rounded-2xl border-2 font-medium shadow-sm transition-all duration-300 outline-none ${isDarkMode
                  ? 'bg-gray-900/60 border-gray-700/50 text-white placeholder-gray-500 focus:bg-gray-800 focus:border-purple-500/50 focus:shadow-[0_0_15px_rgba(168,85,247,0.15)]'
                  : 'bg-white/60 border-gray-200/80 text-gray-900 placeholder-gray-400 focus:bg-white focus:border-purple-400 focus:shadow-[0_0_15px_rgba(168,85,247,0.15)]'
                }`}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-rose-500 transition-colors"
              >
                <X size={20} />
              </button>
            )}
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2.5">
              {['all', 'success', 'failed', 'high', 'medium', 'low'].map((filterOption) => (
                <button
                  key={filterOption}
                  onClick={() => setFilter(filterOption)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 capitalize flex items-center gap-1.5 ${filter === filterOption
                      ? isDarkMode
                        ? 'bg-gradient-to-r from-purple-600 to-violet-600 text-white shadow-lg shadow-purple-900/30 ring-1 ring-purple-500/50'
                        : 'bg-gradient-to-r from-purple-500 to-violet-500 text-white shadow-lg shadow-purple-200 ring-1 ring-purple-400/50'
                      : isDarkMode
                        ? 'bg-gray-800/80 text-gray-400 hover:bg-gray-700 hover:text-gray-200 border border-gray-700/50'
                        : 'bg-white/80 text-gray-600 hover:bg-purple-50 hover:text-purple-700 border border-gray-200/80 hover:border-purple-200'
                    }`}
                >
                  {filterOption === 'success' && <CheckCircle size={14} className={filter === filterOption ? 'text-white' : 'text-emerald-500'} />}
                  {filterOption === 'failed' && <X size={14} className={filter === filterOption ? 'text-white' : 'text-rose-500'} />}
                  {filterOption === 'high' && <AlertTriangle size={14} className={filter === filterOption ? 'text-white' : 'text-rose-500'} />}
                  {filterOption === 'medium' && <AlertCircle size={14} className={filter === filterOption ? 'text-white' : 'text-amber-500'} />}
                  {filterOption === 'low' && <CheckCircle size={14} className={filter === filterOption ? 'text-white' : 'text-emerald-500'} />}
                  {filterOption}
                </button>
              ))}
            </div>

            {/* Time Range */}
            <div className={`flex flex-wrap gap-2 p-1.5 rounded-xl ${isDarkMode ? 'bg-gray-900/50 border border-gray-800' : 'bg-gray-100 border border-gray-200'}`}>
              {['24h', '7d', '30d'].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-5 py-1.5 rounded-lg text-sm font-bold transition-all duration-300 ${timeRange === range
                      ? isDarkMode
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30'
                        : 'bg-blue-500 text-white shadow-md shadow-blue-200'
                      : isDarkMode
                        ? 'text-gray-400 hover:text-gray-200'
                        : 'text-gray-500 hover:text-gray-800 hover:bg-gray-200/50'
                    }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Simple Logs Table */}
      <GlassCard color="purple" hoverable={false} darkMode={isDarkMode}>
        <div className="flex items-center justify-between mb-6">
          <h3 className={`text-xl font-bold flex items-center gap-2 ${isDarkMode ? 'text-purple-300' : 'text-purple-600'
            }`}>
            <FileText className="w-6 h-6 animate-pulse" />
            All System Logs
          </h3>
          <div className={`text-sm px-3 py-1 rounded-full ${isDarkMode ? 'bg-purple-900/30 text-purple-300' : 'bg-purple-100 text-purple-700'
            }`}>
            Showing {filteredLogs.length} of {allSystemLogs.length} logs
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-full">
            <thead>
              <tr className={`border-b ${isDarkMode ? 'border-gray-800' : 'border-gray-200'
                }`}>
                <th className={`py-3 px-4 text-left text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>Time</th>
                <th className={`py-3 px-4 text-left text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>User</th>
                <th className={`py-3 px-4 text-left text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>Action</th>
                <th className={`py-3 px-4 text-left text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>Status</th>
                <th className={`py-3 px-4 text-left text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>Severity</th>
                <th className={`py-3 px-4 text-left text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoadingLogs ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-gray-500">Loading system logs...</td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-gray-500">No logs found matching your filters.</td>
                </tr>
              ) : filteredLogs.map((log, idx) => (
                <tr
                  key={log.id}
                  className={`border-b animate-slide-up ${isDarkMode ? 'border-gray-800/50' : 'border-gray-200/50'} transition-colors duration-200`}
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <td className={`py-4 px-4 text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {log.timestamp.split(' ').slice(1).join(' ')}
                    <span className="block text-xs opacity-60 mt-0.5">{log.timestamp.split(' ')[0]}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className={`font-medium text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                      {log.user}
                    </div>
                  </td>
                  <td className={`py-3 px-4 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>{log.action}</td>
                  <td className={`py-3 px-4`}>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${log.status === 'success'
                      ? isDarkMode ? 'bg-emerald-900/30 text-emerald-300' : 'bg-emerald-100 text-emerald-700'
                      : isDarkMode ? 'bg-rose-900/30 text-rose-300' : 'bg-rose-100 text-rose-700'
                      }`}>
                      {log.status === 'success' ? <CheckCircle size={10} /> : <XCircle size={10} />}
                      {log.status}
                    </span>
                  </td>
                  <td className={`py-3 px-4`}>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${log.severity === 'high'
                      ? isDarkMode ? 'bg-rose-900/30 text-rose-300' : 'bg-rose-100 text-rose-700'
                      : log.severity === 'medium'
                        ? isDarkMode ? 'bg-amber-900/30 text-amber-300' : 'bg-amber-100 text-amber-700'
                        : isDarkMode ? 'bg-emerald-900/30 text-emerald-300' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                      {log.severity === 'high' && <AlertTriangle size={10} />}
                      {log.severity === 'medium' && <AlertCircle size={10} />}
                      {log.severity === 'low' && <CheckCircle size={10} />}
                      {log.severity}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className={`p-1.5 rounded-lg transition-all duration-300 hover:scale-110 ${isDarkMode
                          ? 'bg-purple-900/30 hover:bg-purple-800/30 text-purple-300'
                          : 'bg-purple-100 hover:bg-purple-200 text-purple-700'
                          }`}
                        title="View Details"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        onClick={() => exportSingleLog(log)}
                        className={`p-1.5 rounded-lg transition-all duration-300 hover:scale-110 ${isDarkMode
                          ? 'bg-blue-900/30 hover:bg-blue-800/30 text-blue-300'
                          : 'bg-blue-100 hover:bg-blue-200 text-blue-700'
                          }`}
                        title="Export Log"
                      >
                        <Download size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Simple Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Logs', value: allSystemLogs.length.toLocaleString(), color: 'blue', icon: <Database size={20} /> },
          { label: 'Success', value: allSystemLogs.filter(l => l.status === 'success').length.toLocaleString(), color: 'emerald', icon: <CheckCircle size={20} /> },
          { label: 'Failed', value: allSystemLogs.filter(l => l.status === 'failed').length.toLocaleString(), color: 'rose', icon: <XCircle size={20} /> },
          { label: 'High Severity', value: allSystemLogs.filter(l => l.severity === 'high').length.toLocaleString(), color: 'amber', icon: <AlertTriangle size={20} /> },
        ].map((stat, idx) => (
          <AnimatedCard key={idx} delay={idx}>
            <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-gray-800/40 border-gray-700' : 'bg-white/50 border-gray-200'
              }`}>
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-lg ${isDarkMode ? getColorClass(stat.color, 'darkBg') : getColorClass(stat.color, 'bg')
                  }`}>
                  <div className={isDarkMode ? getColorClass(stat.color, 'darkText') : getColorClass(stat.color, 'text')}>
                    {stat.icon}
                  </div>
                </div>
                <div>
                  <div className={`text-2xl font-bold ${isDarkMode ? getColorClass(stat.color, 'darkText') : getColorClass(stat.color, 'text')
                    }`}>
                    {stat.value}
                  </div>
                  <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {stat.label}
                  </div>
                </div>
              </div>
            </div>
          </AnimatedCard>
        ))}
      </div>

      {/* Footer */}
      <BeautifulFooter isDarkMode={isDarkMode} setActiveModule={setActiveModule} />

      {/* Log Detail Modal */}
      {selectedLog && (
        <LogDetailModal
          log={selectedLog}
          onClose={() => setSelectedLog(null)}
        />
      )}
    </div>
  );
};

export default SystemLogs;
