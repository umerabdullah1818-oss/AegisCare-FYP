import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import {
  Users, UserPlus, UserCheck, UserX, UserMinus, Shield, ShieldCheck, ShieldAlert,
  Database, Activity, AlertCircle, FileText, History, LogOut,
  Settings, Home, BarChart3, Bell, ChevronRight, ChevronDown, Menu, X,
  Search, Filter, CheckCircle, XCircle, MoreVertical, Edit,
  TrendingUp, TrendingDown, Eye, Download, Upload, Lock, Unlock,
  Calendar, Clock, Globe, Server, Cpu, Network,
  FilePlus, FileCheck, User as UserIcon,
  PieChart, LineChart, BarChart, Zap, RefreshCw, AlertTriangle,
  CheckSquare, DownloadCloud, EyeOff, Save,
  Monitor, Tablet, Smartphone, Watch, Camera, Music,
  Timer, GitBranch, GitPullRequest, GitCommit,
  GitMerge, Terminal, Code, HardDrive, Wifi, Battery,
  Cloud, CloudUpload, CloudDownload, CloudOff,
  Key, Settings as SettingsIcon,
  Link2, Mail, Phone
} from 'lucide-react';
import SplashScreen from '../../../components/SplashScreen';
import DashboardNavbar from '../../../components/DashboardsNavbar';
import SettingsPage from '../../../components/SettingsPage';
import api from '../../../services/api';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';// Color gradient helper functions

import { getColorGradientDark, getColorGradientLight, getColorClass, getGradient } from './helpers';
import AnimatedGauge from './components/AnimatedGauge';
import GlassCard from './components/GlassCard';
import AnimatedCard from './components/AnimatedCard';
import GlowingButton from './components/GlowingButton';
import AnimatedChart from './components/AnimatedChart';
import BeautifulFooter from './components/BeautifulFooter';
import AdminHome from './components/AdminHome';
import ManageUsers from './components/ManageUsers';
import SystemLogs from './components/SystemLogs';
import Security from './components/Security';
import Analytics from './components/Analytics';
import AdminSettings from './components/AdminSettings';
import Assignments from './components/Assignments';
import ActivityLog from './components/ActivityLog';
const Admin = ({ isDarkMode: propIsDarkMode, onToggleDarkMode, onLogout }) => {
  const [showSplash, setShowSplash] = useState(() => {
    return !sessionStorage.getItem('admin-splash-shown');
  });
  const [isDarkMode, setIsDarkMode] = useState(propIsDarkMode || false);
  const [activeModule, setActiveModule] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [toastMessage, setToastMessage] = useState({ show: false, message: '', type: 'success' });
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', message: '', confirmText: 'Confirm', cancelText: 'Cancel', color: 'blue', onConfirm: () => { } });

  const showConfirm = (title, message, onConfirm, options = {}) => {
    setConfirmDialog({
      isOpen: true,
      title,
      message,
      onConfirm,
      confirmText: options.confirmText || 'Confirm',
      cancelText: options.cancelText || 'Cancel',
      color: options.color || 'blue'
    });
  };

  const showToast = useCallback((message, type = 'success') => {
    setToastMessage({ show: true, message, type });
    setTimeout(() => setToastMessage(prev => ({ ...prev, show: false })), 4000);
  }, []);

  const userName = localStorage.getItem('userFirstName') || 'Admin User';
  const userEmail = localStorage.getItem('userEmail') || 'admin@aegiscare.com';
  const userRole = 'admin';

  // Get role-based dashboard name
  const getDashboardName = () => {
    return 'Administration Dashboard';
  };

  // Check for mobile
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle dark mode toggle
  const handleDarkModeToggle = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (onToggleDarkMode) {
      onToggleDarkMode();
    }
  };

  const handleSplashComplete = () => {
    setShowSplash(false);
    sessionStorage.setItem('admin-splash-shown', 'true');
  };

  // Enhanced Animated Components

  // Glass Card Component
  const [dashboardStats, setDashboardStats] = useState({
    totalUsers: 0,
    totalDoctors: 0,
    activeElderly: 0,
    systemAlerts: 0,
    dailyLogs: 0,
    serverUptime: 99.9,
    activities: [],
    systemMetrics: [],
    chartData: { data: [[0], [0], [0], [0]], labels: [''] }
  });

  // Navigation modules for Admin
  const modules = [
    { id: 'dashboard', name: 'Admin Home', icon: <Home size={22} />, color: 'blue', notification: 0 },
    { id: 'manage-users', name: 'Manage Users', icon: <Settings size={22} />, color: 'emerald', notification: 0 },
    { id: 'assignments', name: 'Assignments', icon: <Link2 size={22} />, color: 'teal', notification: 0 },
    { id: 'system-logs', name: 'System Logs', icon: <Database size={22} />, color: 'purple', notification: dashboardStats.dailyLogs },
    { id: 'security', name: 'Security', icon: <ShieldCheck size={22} />, color: 'amber', notification: dashboardStats.systemAlerts },
    { id: 'analytics', name: 'Analytics', icon: <BarChart3 size={22} />, color: 'rose', notification: 0 },
    { id: 'activity-log', name: 'Activity Log', icon: <History size={22} />, color: 'cyan', notification: dashboardStats.activities?.length || 0 },
    { id: 'settings', name: 'System Settings', icon: <SettingsIcon size={22} />, color: 'indigo', notification: 0 },
  ];

  // Real user data from API
  const [dbUsers, setDbUsers] = useState({ elderly: [], caregivers: [], doctors: [], all: [] });
  const [usersLoading, setUsersLoading] = useState(false);

  const fetchUsers = async (isBackground = false) => {
    try {
      if (!isBackground) setUsersLoading(true);
      const res = await api.get('/admin/users');
      if (res.data && res.data.success) {
        setDbUsers({ ...res.data.data, all: res.data.all || [] });
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      if (!isBackground) setUsersLoading(false);
    }
  };

  const fetchDashboardStats = async (isBackground = false) => {
    try {
      // No loading state for background fetches to avoid UI flicker
      const res = await api.get('/admin/stats');
      if (res.data && res.data.success) {
        setDashboardStats(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching admin stats:', err);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchDashboardStats();
  }, []);

  // --- Dynamic Notification System ---
  const [readNotificationIds, setReadNotificationIds] = useState([]);
  const [clearedNotificationIds, setClearedNotificationIds] = useState([]);

  const getNotifIconFromAction = (action = '') => {
    const lower = action.toLowerCase();
    if (lower.includes('login') || lower.includes('logged')) return 'activity';
    if (lower.includes('assign') || lower.includes('patient')) return 'bell';
    if (lower.includes('medication') || lower.includes('medicine') || lower.includes('pill')) return 'pill';
    if (lower.includes('appointment') || lower.includes('schedule') || lower.includes('calendar')) return 'calendar';
    if (lower.includes('alert') || lower.includes('emergency') || lower.includes('sos') || lower.includes('panic')) return 'alert';
    return 'activity';
  };

  const getNotifColorFromRole = (color = '') => {
    const c = (color || '').toLowerCase();
    if (c === 'emerald' || c === 'green' || c === 'teal') return 'emerald';
    if (c === 'amber' || c === 'orange') return 'amber';
    if (c === 'rose' || c === 'red' || c === 'pink') return 'red';
    if (c === 'cyan' || c === 'blue') return 'cyan';
    if (c === 'purple' || c === 'violet' || c === 'indigo') return 'blue';
    return 'blue';
  };

  const dynamicNotifications = React.useMemo(() => {
    const activities = dashboardStats.activities || [];
    if (activities.length === 0) return [];
    return activities
      .map((activity, idx) => {
        const nId = activity._id || activity.id || `notif-${idx}`;
        if (clearedNotificationIds.includes(nId)) return null;
        return {
          id: nId,
          title: activity.user || 'System',
          message: activity.action || 'Activity recorded',
          time: activity.time || 'Just now',
          icon: getNotifIconFromAction(activity.action),
          color: getNotifColorFromRole(activity.color),
          read: readNotificationIds.includes(nId),
        };
      })
      .filter(Boolean);
  }, [dashboardStats.activities, readNotificationIds, clearedNotificationIds]);

  const handleMarkNotificationRead = useCallback((id) => {
    setReadNotificationIds(prev => prev.includes(id) ? prev : [...prev, id]);
  }, []);

  const handleMarkAllNotificationsRead = useCallback(() => {
    const activities = dashboardStats.activities || [];
    const allIds = activities.map((a, idx) => a._id || a.id || `notif-${idx}`);
    setReadNotificationIds(prev => {
      const merged = [...prev];
      allIds.forEach(id => { if (!merged.includes(id)) merged.push(id); });
      return merged;
    });
  }, [dashboardStats.activities]);

  const handleClearNotification = useCallback((id) => {
    setClearedNotificationIds(prev => prev.includes(id) ? prev : [...prev, id]);
  }, []);

  // Dynamic user data mapping
  const users = dbUsers.all.length > 0 ? dbUsers.all.map((u, i) => ({
    id: u._id, name: `${u.firstName} ${u.lastName}`, email: u.email, role: u.role,
    phone: u.phone || 'N/A',
    status: u.status || 'active',
    lastActive: u.lastLogin ? new Date(u.lastLogin).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Never',
    joinDate: u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A',
    assignedCaregivers: u.assignedCaregivers || [],
    assignedDoctor: u.assignedDoctor || null,
    color: ['blue', 'emerald', 'purple', 'amber', 'rose', 'indigo', 'cyan', 'green'][i % 8]
  })) : [];

  const doctors = dbUsers.all.length > 0 ? dbUsers.all.filter(u => u.role === 'doctor').map((d, i) => ({
    id: d._id, name: `Dr. ${d.firstName} ${d.lastName}`, specialty: d.specialty || 'General',
    status: d.status || 'pending', patients: 0, rating: 5.0, lastActive: 'recently'
  })) : [];

  const systemLogs = dashboardStats.systemLogs && dashboardStats.systemLogs.length > 0
    ? dashboardStats.systemLogs
    : [];

  const alerts = dashboardStats.alerts && dashboardStats.alerts.length > 0
    ? dashboardStats.alerts
    : [];

  // Modern, Interactive, Attractive Chart using Recharts

  // Beautiful Eye-catching Footer Component

  const sessionTime = new Date(Date.now() - 15 * 60000).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

  // 5.1 Admin Home Component

  // AddNewUserModal Component extracted for state management and validation

  // 5.2 Manage Users Component - FIXED

  // 5.3 System Logs Component - SIMPLIFIED (Same Layout as Others)
  // Security Component

  // Analytics Component

  // Settings Component

  // Render different modules based on selection
  // ====== Assignments Component ======

  // 5.8 Activity Log Component


  const renderModuleContent = () => {
    const moduleProps = {
      isDarkMode, setActiveModule, showToast, showConfirm,
      dashboardStats, users, doctors, dbUsers, alerts, systemLogs,
      fetchUsers, fetchDashboardStats, userName,
    };

    switch(activeModule) {
      case 'dashboard':
        return <AdminHome {...moduleProps} />;
      case 'manage-users':
        return <ManageUsers {...moduleProps} />;
      case 'assignments':
        return <Assignments {...moduleProps} />;
      case 'system-logs':
        return <SystemLogs {...moduleProps} />;
      case 'security':
        return <Security {...moduleProps} />;
      case 'analytics':
        return <Analytics {...moduleProps} />;
      case 'activity-log':
        return <ActivityLog {...moduleProps} />;
      case 'settings':
        return <AdminSettings {...moduleProps} />;
      default:
        return <AdminHome {...moduleProps} />;
    }
  };


  if (showSplash) {
    return (
      <SplashScreen
        userRole={userRole}
        userName={userName}
        isDarkMode={isDarkMode}
        onFinish={handleSplashComplete}
      />
    );
  }

  return (
    <div className={`h-screen overflow-hidden transition-all duration-500 ${isDarkMode
      ? 'bg-gradient-to-br from-gray-950 via-gray-900 to-blue-950/30'
      : 'bg-gradient-to-br from-blue-50 via-white to-emerald-50'
      }`}>
      {/* Add global styles */}
      <style jsx global>{`
        @keyframes draw {
          to {
            stroke-dashoffset: 0;
          }
        }
        .animate-draw {
          animation: draw 2s ease-out forwards;
          stroke-dasharray: 1000;
          stroke-dashoffset: 1000;
        }

        @keyframes grow {
          from {
            transform: scaleY(0);
          }
          to {
            transform: scaleY(1);
          }
        }
        .animate-grow {
          animation: grow 0.8s ease-out forwards;
          transform-origin: bottom;
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.6s ease-out forwards;
          opacity: 0;
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }

        @keyframes scale-in {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out forwards;
        }

        @keyframes slide-in-left {
          from {
            transform: translateX(-100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in-left {
          animation: slide-in-left 0.3s ease-out forwards;
        }

        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out forwards;
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.2;
          }
          50% {
            opacity: 0.4;
          }
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }

        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* Toast Notification Container */}
      <div className={`fixed top-4 right-4 z-[100] transition-all duration-300 transform flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl backdrop-blur-md ${toastMessage.show ? 'translate-x-0 opacity-100' : 'translate-x-12 opacity-0 pointer-events-none'} ${isDarkMode
          ? toastMessage.type === 'error' ? 'bg-rose-950/90 text-rose-100 border border-rose-800/80 shadow-rose-900/30'
            : 'bg-emerald-950/90 text-emerald-100 border border-emerald-800/80 shadow-emerald-900/30'
          : toastMessage.type === 'error' ? 'bg-white/95 text-rose-600 border border-rose-100 shadow-rose-500/15'
            : 'bg-white/95 text-emerald-600 border border-emerald-100 shadow-emerald-500/15'
        }`}>
        <div className={`p-1.5 rounded-full ${toastMessage.type === 'error' ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'}`}>
          {toastMessage.type === 'error' ? <XCircle size={18} /> : <CheckCircle size={18} />}
        </div>
        <p className="font-semibold text-sm pr-6">{toastMessage.message}</p>
        <button onClick={() => setToastMessage(prev => ({ ...prev, show: false }))} className={`absolute right-3 p-1 rounded-md opacity-70 hover:opacity-100 transition-opacity ${toastMessage.type === 'error' ? 'hover:bg-rose-200/50' : 'hover:bg-emerald-200/50'}`}>
          <X size={16} />
        </button>
      </div>

      <DashboardNavbar
        isDarkMode={isDarkMode}
        onToggleDarkMode={handleDarkModeToggle}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        isSidebarOpen={isSidebarOpen}
        dashboardName={getDashboardName()}
        onLogout={onLogout}
        showSidebarToggle={true}
        userRole={userRole}
        onSettingsClick={() => setActiveModule('settings')}
        onProfileClick={() => setActiveModule('settings')}
        notifications={dynamicNotifications}
        onMarkNotificationRead={handleMarkNotificationRead}
        onMarkAllRead={handleMarkAllNotificationsRead}
        onClearNotification={handleClearNotification}
      />

      <div className="flex relative h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <div className={`transition-all duration-300 flex flex-col fixed lg:relative z-40 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          } ${isDarkMode ? 'bg-gray-950/95' : 'bg-white/95'} backdrop-blur-xl h-[calc(100vh-5rem)] w-56 md:w-64 lg:w-56 xl:w-64 border-r ${isDarkMode ? 'border-gray-800' : 'border-gray-200'
          }`}>
          {/* Sidebar Header */}
          <div className="p-3 border-b border-gray-800/50 flex-shrink-0 relative">
            <div className="flex items-center gap-2 mb-3">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${isDarkMode ? 'bg-blue-950/40' : 'bg-gradient-to-r from-blue-100 to-cyan-100'
                }`}>
                <Shield className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} size={18} />
              </div>
              <div>
                <h2 className={`font-bold text-sm ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                  {userName}
                </h2>
                <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                  System Administrator
                </p>
              </div>
            </div>

            {isMobile && (
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-gray-800/50 transition-colors"
              >
                <X size={16} className={isDarkMode ? 'text-gray-500' : 'text-gray-600'} />
              </button>
            )}
          </div>

          {/* Navigation Modules */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-hide">
            {modules.map((module) => (
              <button
                key={module.id}
                onClick={() => setActiveModule(module.id)}
                className={`w-full flex items-center justify-between p-2.5 rounded-lg transition-all duration-200 text-left group ${activeModule === module.id
                  ? isDarkMode
                    ? `bg-${module.color}-950/40 text-${module.color}-300 border-l-2 border-${module.color}-500`
                    : `bg-${module.color}-100 text-${module.color}-700 border-l-2 border-${module.color}-500`
                  : isDarkMode
                    ? 'hover:bg-gray-800/50 text-gray-400 hover:text-gray-300'
                    : 'hover:bg-gray-100 text-gray-700 hover:text-gray-900'
                  }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`transition-transform duration-300 group-hover:scale-110 ${activeModule === module.id ? `text-${module.color}-500` : ''
                    }`}>
                    {module.icon}
                  </div>
                  <span className="font-medium text-sm">{module.name}</span>
                </div>
                {module.notification > 0 && (
                  <span className={`text-xs px-2 py-1 rounded-full min-w-[20px] text-center ${isDarkMode
                    ? `bg-${module.color}-900/40 text-${module.color}-300`
                    : `bg-${module.color}-100 text-${module.color}-700`
                    }`}>
                    {module.notification}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Sidebar Footer */}
          <div className="p-3 border-t border-gray-800/50 flex-shrink-0 sticky bottom-0 bg-inherit">
            <div className={`text-center p-2 rounded-lg transition-all duration-300 hover:scale-105 cursor-pointer ${isDarkMode ? 'bg-gray-900/40 hover:bg-gray-800/40' : 'bg-blue-50/50 hover:bg-blue-100/50'
              }`}>
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className={`text-xs font-medium ${isDarkMode ? 'text-emerald-300' : 'text-emerald-700'}`}>
                  System Active
                </span>
              </div>
              <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                24/7 System Monitoring
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className={`flex-1 transition-all duration-300 overflow-y-auto overflow-x-hidden w-full ${isSidebarOpen ? 'ml-0 lg:ml-0' : 'ml-0'
          }`}>
          <main className="p-4 sm:p-6 animate-fade-in w-full max-w-full mx-auto">
            {renderModuleContent()}
          </main>
        </div>

        {/* Confirm Modal */}
        {confirmDialog.isOpen && createPortal(
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm shadow-2xl transition-opacity animate-in fade-in" onClick={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}></div>
            <div className={`relative w-full max-w-md p-6 rounded-3xl animate-fade-in ${isDarkMode ? 'bg-gray-900/90 border border-gray-700 shadow-[0_0_40px_rgba(0,0,0,0.5)]' : 'bg-white/90 border border-gray-200 shadow-[0_0_40px_rgba(0,0,0,0.2)]'
              } backdrop-blur-xl`}>
              <div className="flex items-start gap-4 mb-4">
                <div className={`p-3 rounded-full shrink-0 ${confirmDialog.color === 'rose' ? (isDarkMode ? 'bg-rose-900/30 text-rose-400' : 'bg-rose-100 text-rose-600') :
                    confirmDialog.color === 'amber' ? (isDarkMode ? 'bg-amber-900/30 text-amber-400' : 'bg-amber-100 text-amber-600') :
                      (isDarkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-600')
                  }`}>
                  <AlertTriangle size={28} />
                </div>
                <div>
                  <h3 className={`text-xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{confirmDialog.title}</h3>
                  <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{confirmDialog.message}</p>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8">
                <button onClick={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))} className={`px-5 py-2.5 rounded-xl font-semibold transition-all ${isDarkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                  {confirmDialog.cancelText}
                </button>
                <button
                  onClick={() => {
                    confirmDialog.onConfirm();
                    setConfirmDialog(prev => ({ ...prev, isOpen: false }));
                  }}
                  className={`px-5 py-2.5 rounded-xl font-bold text-white transition-all transform hover:scale-105 shadow-lg bg-gradient-to-r ${confirmDialog.color === 'rose' ? 'from-rose-500 to-red-600 shadow-rose-500/30 hover:shadow-rose-500/50' :
                      confirmDialog.color === 'amber' ? 'from-amber-500 to-orange-500 shadow-amber-500/30 hover:shadow-amber-500/50' :
                        'from-blue-500 to-blue-600 shadow-blue-500/30 hover:shadow-blue-500/50'
                    }`}>
                  {confirmDialog.confirmText}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

        {/* Overlay for mobile sidebar */}

        {isSidebarOpen && isMobile && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default Admin;