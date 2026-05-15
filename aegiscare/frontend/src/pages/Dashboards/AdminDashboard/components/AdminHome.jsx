import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Users, UserCheck, Activity, AlertCircle, FileText,
  Shield, Server, History, TrendingUp, TrendingDown,
  Eye, Database, CheckCircle, XCircle, Clock,
  AlertTriangle, ShieldAlert, X,
  User as UserIcon
} from 'lucide-react';
import { getColorGradientDark, getColorGradientLight, getColorClass } from '../helpers';
import GlassCard from './GlassCard';
import AnimatedCard from './AnimatedCard';
import GlowingButton from './GlowingButton';
import AnimatedChart from './AnimatedChart';
import BeautifulFooter from './BeautifulFooter';

const AdminHome = ({ isDarkMode, dashboardStats, alerts, systemLogs, setActiveModule, userName, sessionTime }) => {
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [liveUptime, setLiveUptime] = useState(() => {
    const val = dashboardStats.serverUptime;
    if (typeof val === 'number') return val;
    if (typeof val === 'string') return parseFloat(val) || 99.9;
    return 99.6 + Math.random() * 0.3;
  });

  useEffect(() => {
    // Simulate slight uptime variation to make it dynamic
    const interval = setInterval(() => {
      setLiveUptime(prev => {
        let newValue = prev + (Math.random() * 0.02 - 0.01);
        if (newValue > 99.99) newValue = 99.99;
        if (newValue < 99.0) newValue = 99.0;
        return newValue;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { label: 'Total Users', value: dashboardStats.totalUsers.toLocaleString(), change: `+${dashboardStats.totalUsers}`, icon: <Users className="w-6 h-6" />, color: 'blue', moduleId: 'manage-users' },
    { label: 'Total Doctors', value: dashboardStats.totalDoctors.toLocaleString(), change: `+${dashboardStats.totalDoctors}`, icon: <UserCheck className="w-6 h-6" />, color: 'emerald', moduleId: 'manage-users' },
    { label: 'Active Elderly', value: dashboardStats.activeElderly.toLocaleString(), change: `+${dashboardStats.activeElderly}`, icon: <Activity className="w-6 h-6" />, color: 'purple', moduleId: 'manage-users' },
    { label: 'System Alerts', value: dashboardStats.systemAlerts.toLocaleString(), change: dashboardStats.systemAlerts > 0 ? `+${dashboardStats.systemAlerts}` : '0', icon: <AlertCircle className="w-6 h-6" />, color: 'amber', moduleId: 'security' },
    { label: 'Daily Logs', value: dashboardStats.dailyLogs.toLocaleString(), change: `+${dashboardStats.dailyLogs}`, icon: <FileText className="w-6 h-6" />, color: 'rose', moduleId: 'system-logs' },
    { label: 'Server Uptime', value: `${liveUptime.toFixed(2)}%`, change: `${(liveUptime - (parseFloat(dashboardStats.serverUptime) || 99.8)) >= 0 ? '+' : ''}${(liveUptime - (parseFloat(dashboardStats.serverUptime) || 99.8)).toFixed(2)}%`, icon: <Server className="w-6 h-6" />, color: 'indigo', moduleId: 'settings' },
  ];

  const recentActivities = dashboardStats.activities && dashboardStats.activities.length > 0
    ? dashboardStats.activities
    : [
      { user: 'System Admin', action: 'System started', time: 'Just now', color: 'blue' }
    ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Header */}
      <GlassCard color="blue" hoverable={false} darkMode={isDarkMode}>
        <div className="absolute top-0 right-0 w-64 h-64 -translate-y-32 translate-x-32 rounded-full bg-gradient-to-r from-blue-600/10 to-cyan-600/10 blur-3xl animate-pulse-slow"></div>

        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-3 rounded-2xl transition-all duration-300 hover:scale-110 ${isDarkMode ? 'bg-blue-950/40' : 'bg-gradient-to-r from-blue-100 to-cyan-100'
                  }`}>
                  <Shield className={`w-8 h-8 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                </div>
                <div>
                  <h1 className={`text-2xl lg:text-3xl font-bold mb-1 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent`}>
                    Welcome, {userName}!
                  </h1>
                  <p className={`text-base ${isDarkMode ? 'text-blue-200/80' : 'text-blue-700/80'}`}>
                    System Administrator • Last login: Today at {sessionTime}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 hover:scale-105 ${isDarkMode ? 'bg-emerald-950/40 border border-emerald-900/30' : 'bg-gradient-to-r from-emerald-100 to-teal-100 border border-emerald-200'
                }`}>
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className={`text-sm font-medium ${isDarkMode ? 'text-emerald-300' : 'text-emerald-700'}`}>
                  System: Operational
                </span>
              </div>
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 hover:scale-105 ${isDarkMode ? 'bg-amber-950/40 border border-amber-900/30' : 'bg-gradient-to-r from-amber-100 to-orange-100 border border-amber-200'
                }`}>
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
                <span className={`text-sm font-medium ${isDarkMode ? 'text-amber-300' : 'text-amber-700'}`}>
                  Alerts: {dashboardStats.systemAlerts} pending
                </span>
              </div>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((stat, idx) => (
          <AnimatedCard key={idx} delay={idx}>
            <div
              onClick={() => setActiveModule(stat.moduleId)}
              className={`group rounded-2xl p-5 backdrop-blur-xl border-2 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl relative overflow-hidden cursor-pointer ${isDarkMode
                ? 'bg-gradient-to-br from-gray-900/50 to-blue-950/30 border-gray-800/40'
                : 'bg-gradient-to-br from-white/90 to-blue-50/90 border-gray-200/50'
                }`}>
              <div className="flex items-center justify-between mb-3">
                <div className={`p-3 rounded-xl transition-all duration-300 group-hover:scale-110 ${isDarkMode ? getColorClass(stat.color, 'darkBg') : getColorClass(stat.color, 'bg')
                  }`}>
                  <div className={`${isDarkMode ? getColorClass(stat.color, 'darkText') : getColorClass(stat.color, 'text')}`}>
                    {stat.icon}
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${stat.change.startsWith('+')
                    ? isDarkMode ? 'bg-emerald-900/30 text-emerald-300' : 'bg-emerald-100 text-emerald-700'
                    : isDarkMode ? 'bg-rose-900/30 text-rose-300' : 'bg-rose-100 text-rose-700'
                    }`}>
                    {stat.change}
                  </span>
                </div>
              </div>

              <h3 className={`text-2xl font-bold mb-1 ${isDarkMode
                ? getColorGradientDark(stat.color)
                : getColorGradientLight(stat.color)
                } bg-clip-text text-transparent`}>
                {stat.value}
              </h3>
              <p className={`text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-800'}`}>
                {stat.label}
              </p>

              <div className={`flex items-center gap-1 mt-3 ${stat.change.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'
                }`}>
                {stat.change.startsWith('+') ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                <span className="text-sm font-medium">This week</span>
              </div>
            </div>
          </AnimatedCard>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System Overview */}
        <GlassCard color="blue" darkMode={isDarkMode} className="lg:col-span-2">
          <h3 className={`text-xl font-bold mb-6 flex items-center gap-2 ${isDarkMode ? 'text-blue-300' : 'text-blue-600'
            }`}>
            <Activity className="w-6 h-6 animate-pulse" />
            System Overview
          </h3>

          <div className="space-y-6">
            {/* Chart */}
            <div className="h-64">
              <AnimatedChart
                data={dashboardStats.chartData?.data || [[0], [0], [0], [0]]}
                labels={dashboardStats.chartData?.labels || ['']}
                colors={['#10b981', '#f59e0b', '#3b82f6', '#8b5cf6']}
                height={200}
                type="line"
                isDarkMode={isDarkMode}
              />
            </div>

            {/* System Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {(dashboardStats.systemMetrics?.length > 0 ? dashboardStats.systemMetrics : [
                { label: 'CPU Usage', value: '42%', color: 'emerald' },
                { label: 'Memory', value: '68%', color: 'amber' },
                { label: 'Storage', value: '45%', color: 'blue' },
                { label: 'Network', value: '24%', color: 'purple' }
              ]).map((metric, idx) => (
                <div key={idx} className={`p-3 rounded-xl border ${isDarkMode ? 'bg-gray-800/40 border-gray-700' : 'bg-white/50 border-gray-200'
                  }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {metric.label}
                    </span>
                    <span className={`text-lg font-bold ${metric.color === 'emerald' ? 'text-emerald-500' :
                      metric.color === 'amber' ? 'text-amber-500' :
                        metric.color === 'blue' ? 'text-blue-500' :
                          'text-purple-500'
                      }`}>
                      {metric.value}
                    </span>
                  </div>
                  <div className={`h-2 rounded-full overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'
                    }`}>
                    <div
                      className={`h-full rounded-full transition-all duration-1000`}
                      style={{
                        width: metric.value,
                        backgroundColor: metric.color === 'emerald' ? '#10b981' :
                          metric.color === 'amber' ? '#f59e0b' :
                            metric.color === 'blue' ? '#3b82f6' :
                              '#8b5cf6'
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>

        {/* Recent Activities */}
        <GlassCard color="purple" darkMode={isDarkMode}>
          <h3 className={`text-xl font-bold mb-6 flex items-center gap-2 ${isDarkMode ? 'text-purple-300' : 'text-purple-600'
            }`}>
            <History className="w-6 h-6 animate-pulse" />
            Recent Activities
          </h3>

          <div className="space-y-4">
            {recentActivities.map((activity, idx) => (
              <AnimatedCard key={idx} delay={idx}>
                <div className={`p-3 rounded-xl border ${isDarkMode ? 'bg-gray-800/40 border-gray-700' : 'bg-white/50 border-gray-200'
                  }`}>
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${isDarkMode ? getColorClass(activity.color, 'darkBg') : getColorClass(activity.color, 'bg')
                      }`}>
                      <UserIcon className={isDarkMode ? getColorClass(activity.color, 'darkText') : getColorClass(activity.color, 'text')} size={16} />
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-bold text-sm mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                        {activity.user}
                      </h4>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                        {activity.action}
                      </p>
                    </div>
                    <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                      {activity.time}
                    </span>
                  </div>
                </div>
              </AnimatedCard>
            ))}
          </div>

          <button
            onClick={() => setActiveModule('activity-log')}
            className={`w-full mt-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-[1.02] ${isDarkMode ? 'bg-purple-900/30 text-purple-300 hover:bg-purple-900/50 border border-purple-800/50' : 'bg-purple-50 text-purple-600 hover:bg-purple-100 border border-purple-200'
              }`}>
            View All Activities →
          </button>
        </GlassCard>
      </div>

      {/* Alerts Summary */}
      <GlassCard color="amber" darkMode={isDarkMode}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className={`text-xl font-bold mb-1 flex items-center gap-2 ${isDarkMode ? 'text-amber-300' : 'text-amber-600'
              }`}>
              <AlertCircle className="w-6 h-6 animate-pulse" />
              Alerts Summary
            </h3>
            <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
              {alerts.length} active alerts requiring attention
            </p>
          </div>
          <GlowingButton
            icon={<Eye className="w-4 h-4" />}
            color="amber"
            size="md"
            onClick={() => setActiveModule('security')}
            isDarkMode={isDarkMode}
          >
            View All Alerts
          </GlowingButton>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {alerts.map((alert, idx) => (
            <AnimatedCard key={alert.id} delay={idx}>
              <div className={`p-4 rounded-xl border-l-4 transition-all duration-300 hover:scale-105 ${alert.severity === 'high' ? 'border-rose-500' :
                alert.severity === 'medium' ? 'border-amber-500' :
                  'border-emerald-500'
                } ${isDarkMode ? 'bg-gray-800/40 border-gray-700' : 'bg-white/50 border-gray-200'}`}>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`w-2 h-2 rounded-full ${alert.severity === 'high' ? 'bg-rose-500 animate-pulse' :
                        alert.severity === 'medium' ? 'bg-amber-500' :
                          'bg-emerald-500'
                        }`}></div>
                      <span className={`text-xs font-medium ${alert.severity === 'high' ? 'text-rose-500' :
                        alert.severity === 'medium' ? 'text-amber-500' :
                          'text-emerald-500'
                        }`}>
                        {alert.type}
                      </span>
                    </div>
                    <h4 className={`font-bold text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                      {alert.title}
                    </h4>
                  </div>
                </div>
                <p className={`text-xs mb-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                  {alert.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                    {alert.timestamp}
                  </span>
                  <button className={`px-2 py-1 text-xs rounded-lg font-medium transition-all duration-300 hover:scale-105 ${isDarkMode
                    ? 'bg-amber-900/30 hover:bg-amber-800/30 text-amber-300'
                    : 'bg-amber-100 hover:bg-amber-200 text-amber-700'
                    }`}
                    onClick={() => setSelectedAlert(alert)}
                  >
                    Review
                  </button>
                </div>
              </div>
            </AnimatedCard>
          ))}
        </div>
      </GlassCard>

      {/* System Logs Preview */}
      <GlassCard color="indigo" darkMode={isDarkMode}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className={`text-xl font-bold mb-1 flex items-center gap-2 ${isDarkMode ? 'text-indigo-300' : 'text-indigo-600'
              }`}>
              <Database className="w-6 h-6 animate-pulse" />
              Recent System Logs
            </h3>
            <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
              Latest system activities and security events
            </p>
          </div>
          <GlowingButton
            icon={<FileText className="w-4 h-4" />}
            color="indigo"
            size="md"
            onClick={() => setActiveModule('system-logs')}
            isDarkMode={isDarkMode}
          >
            View All Logs
          </GlowingButton>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b ${isDarkMode ? 'border-gray-800' : 'border-gray-200'
                }`}>
                <th className={`py-3 px-4 text-left text-sm font-medium w-[20%] ${isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>Time</th>
                <th className={`py-3 px-4 text-left text-sm font-medium w-[25%] ${isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>User</th>
                <th className={`py-3 px-4 text-left text-sm font-medium w-[30%] ${isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>Action</th>
                <th className={`py-3 px-4 text-left text-sm font-medium w-[15%] ${isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>Status</th>
                <th className={`py-3 px-4 text-left text-sm font-medium w-[10%] ${isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>Severity</th>
              </tr>
            </thead>
            <tbody>
              {systemLogs.slice(0, 5).map((log, idx) => (
                <tr key={log.id} className={`border-b transform transition-all duration-300 hover:bg-gray-50/50 hover:scale-[1.01] animate-slide-up ${isDarkMode ? 'border-gray-800/50 hover:bg-gray-800/20' : 'border-gray-200/50'}`} style={{ animationDelay: `${idx * 100}ms` }}>
                  <td className={`py-3 px-4 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{log.timestamp}</td>
                  <td className={`py-3 px-4 text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{log.user}</td>
                  <td className={`py-3 px-4 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{log.action}</td>
                  <td className={`py-3 px-4`}>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${log.status === 'success'
                      ? isDarkMode ? 'bg-emerald-900/30 text-emerald-300' : 'bg-emerald-100 text-emerald-700'
                      : isDarkMode ? 'bg-rose-900/30 text-rose-300' : 'bg-rose-100 text-rose-700'
                      }`}>
                      {log.status === 'success' ? <CheckCircle size={10} /> : <XCircle size={10} />}
                      {log.status === 'success' ? 'Success' : 'Failed'}
                    </span>
                  </td>
                  <td className={`py-3 px-4`}>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${log.severity === 'high'
                      ? isDarkMode ? 'bg-rose-900/30 text-rose-300' : 'bg-rose-100 text-rose-700'
                      : log.severity === 'medium'
                        ? isDarkMode ? 'bg-amber-900/30 text-amber-300' : 'bg-amber-100 text-amber-700'
                        : isDarkMode ? 'bg-emerald-900/30 text-emerald-300' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                      {log.severity.charAt(0).toUpperCase() + log.severity.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Footer */}
      <BeautifulFooter isDarkMode={isDarkMode} setActiveModule={setActiveModule} />

      {/* Review Alert Modal */}
      {selectedAlert && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in text-left">
          <div className={`w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden ${isDarkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-100'} animate-scale-in`}>
            <div className={`p-6 border-b ${isDarkMode ? 'border-gray-800' : 'border-gray-100'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl ${selectedAlert.severity === 'high' ? 'bg-rose-100 text-rose-600' : selectedAlert.severity === 'medium' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{selectedAlert.title}</h3>
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{selectedAlert.type} Alert</p>
                  </div>
                </div>
                <button onClick={() => setSelectedAlert(null)} className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}>
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h4 className={`text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Description</h4>
                <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
                  <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{selectedAlert.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-gray-800/30 border-gray-800' : 'bg-white border-gray-100 shadow-sm'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Clock size={14} className={isDarkMode ? 'text-gray-500' : 'text-gray-400'} />
                    <h4 className={`text-xs font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Time Active</h4>
                  </div>
                  <p className={`text-sm font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{selectedAlert.timestamp}</p>
                </div>

                <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-gray-800/30 border-gray-800' : 'bg-white border-gray-100 shadow-sm'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <ShieldAlert size={14} className={isDarkMode ? 'text-gray-500' : 'text-gray-400'} />
                    <h4 className={`text-xs font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Severity Level</h4>
                  </div>
                  <span className={`inline-flex px-2.5 py-1 rounded-md text-xs font-bold ${selectedAlert.severity === 'high' ? 'bg-rose-100 text-rose-700' : selectedAlert.severity === 'medium' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                    {selectedAlert.severity.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            <div className={`p-6 border-t flex justify-end gap-3 ${isDarkMode ? 'border-gray-800 bg-gray-900/50' : 'border-gray-100 bg-gray-50'}`}>
              <button onClick={() => setSelectedAlert(null)} className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${isDarkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-200'}`}>
                Review Later
              </button>
              <button onClick={() => {
                setSelectedAlert(null);
                setActiveModule('security');
              }} className={`px-5 py-2.5 rounded-lg text-sm font-bold text-white transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 ${selectedAlert.severity === 'high' ? 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/25' : selectedAlert.severity === 'medium' ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/25' : 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/25'}`}>
                View Full Details
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default AdminHome;
