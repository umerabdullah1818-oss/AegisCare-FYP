// src/components/DashboardNavbar.jsx
import React, { useState, useEffect } from 'react';
import { 
  LogOut, Sun, Moon, Bell, User, ChevronDown,
  Menu, X, Home, Heart, Stethoscope, Users, 
  UserCircle, Shield, Activity, Settings, HelpCircle,
  Pill, Calendar, AlertTriangle, BellRing, Check, CheckCheck, Trash2, Clock
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const DashboardNavbar = ({ isDarkMode, onToggleDarkMode, dashboardName, onToggleSidebar, isSidebarOpen, showSidebarToggle = false, onSettingsClick, onProfileClick, notifications = [], onMarkNotificationRead, onMarkAllRead, onClearNotification }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const [userPhoto, setUserPhoto] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  // Check for mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Role configurations for icons and colors
  const roleConfig = {
    elderly: {
      name: 'Elderly Dashboard',
      icon: <Heart className="w-4 h-4 sm:w-5 sm:h-5" />,
      color: 'from-rose-500 to-pink-600',
      badgeColor: 'bg-gradient-to-r from-rose-500 to-pink-600',
      shortName: 'Elderly'
    },
   
    doctor: {
      name: 'Doctor Dashboard',
      icon: <Stethoscope className="w-4 h-4 sm:w-5 sm:h-5" />,
      color: 'from-emerald-500 to-teal-600',
      badgeColor: 'bg-gradient-to-r from-emerald-500 to-teal-600',
      shortName: 'Doctor'
    },
    caregiver: {
      name: 'Caregiver Dashboard',
      icon: <UserCircle className="w-4 h-4 sm:w-5 sm:h-5" />,
      color: 'from-amber-500 to-orange-600',
      badgeColor: 'bg-gradient-to-r from-amber-500 to-orange-600',
      shortName: 'Caregiver'
    },
    admin: {
      name: 'Admin Dashboard',
      icon: <Shield className="w-4 h-4 sm:w-5 sm:h-5" />,
      color: 'from-purple-500 to-violet-600',
      badgeColor: 'bg-gradient-to-r from-purple-500 to-violet-600',
      shortName: 'Admin'
    }
  };

  // Get user data from localStorage on component mount
  useEffect(() => {
    const firstName = localStorage.getItem('userFirstName') || 'User';
    const role = localStorage.getItem('userRole') || 'elderly';
    const photo = localStorage.getItem('userPhoto') || '';
    
    setUserName(firstName);
    setUserRole(role);
    setUserPhoto(photo);

    const handlePhotoUpdate = () => {
      setUserPhoto(localStorage.getItem('userPhoto') || '');
    };

    window.addEventListener('profilePhotoUpdated', handlePhotoUpdate);
    window.addEventListener('storage', handlePhotoUpdate);

    return () => {
      window.removeEventListener('profilePhotoUpdated', handlePhotoUpdate);
      window.removeEventListener('storage', handlePhotoUpdate);
    };
  }, []);

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('userFirstName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userPhoto');
    localStorage.removeItem('isGoogleAuth');
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    sessionStorage.clear();
    
    navigate('/login');
  };

  const currentRoleConfig = roleConfig[userRole] || roleConfig.elderly;

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotifIcon = (icon) => {
    switch (icon) {
      case 'pill': return <Pill className="w-4 h-4" />;
      case 'calendar': return <Calendar className="w-4 h-4" />;
      case 'bell': return <BellRing className="w-4 h-4" />;
      case 'alert': return <AlertTriangle className="w-4 h-4" />;
      case 'activity': return <Activity className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const getNotifColor = (color) => {
    const colors = {
      emerald: isDarkMode ? 'bg-emerald-900/40 text-emerald-400' : 'bg-emerald-100 text-emerald-600',
      cyan: isDarkMode ? 'bg-cyan-900/40 text-cyan-400' : 'bg-cyan-100 text-cyan-600',
      amber: isDarkMode ? 'bg-amber-900/40 text-amber-400' : 'bg-amber-100 text-amber-600',
      green: isDarkMode ? 'bg-green-900/40 text-green-400' : 'bg-green-100 text-green-600',
      red: isDarkMode ? 'bg-red-900/40 text-red-400' : 'bg-red-100 text-red-600',
      teal: isDarkMode ? 'bg-teal-900/40 text-teal-400' : 'bg-teal-100 text-teal-600',
      blue: isDarkMode ? 'bg-blue-900/40 text-blue-400' : 'bg-blue-100 text-blue-600',
    };
    return colors[color] || colors.blue;
  };

  return (
    <header
      className={`sticky top-0 z-50 backdrop-blur-md border-b transition-all duration-500 ${
        isDarkMode
          ? 'bg-gradient-to-r from-gray-900/95 via-gray-900/95 to-gray-900/95 border-gray-800'
          : 'bg-gradient-to-r from-white/95 via-blue-50/95 to-white/95 border-blue-100'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16 md:h-18">
          {/* Left Side - Logo with Role Badge */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Sidebar Toggle Button (only show on mobile when enabled) */}
            {showSidebarToggle && isMobile && (
              <button
                onClick={onToggleSidebar}
                className={`p-1.5 rounded-lg mr-1 ${
                  isDarkMode
                    ? 'bg-gray-800 text-blue-300 hover:bg-gray-700'
                    : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                }`}
                aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
              >
                {isSidebarOpen ? (
                  <X className="w-4 h-4" />
                ) : (
                  <Menu className="w-4 h-4" />
                )}
              </button>
            )}

            <Link to="/" className="flex items-center space-x-2 group">
              {/* Logo without blue border */}
              <div className="relative">
                <img
                  src="/assets/logo.png"
                  alt="AegisCare Logo"
                  className="w-10 h-8 sm:w-12 sm:h-10 md:w-14 md:h-12 transition-transform group-hover:scale-110 duration-300"
                />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center space-x-1.5">
                  <h1
                    className={`text-base sm:text-lg md:text-xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent ${
                      isDarkMode ? 'brightness-125' : ''
                    }`}
                  >
                    AegisCare
                  </h1>
                  {/* Role Badge - Always visible on small screens */}
                  <div className={`px-1.5 py-0.5 rounded-full ${currentRoleConfig.badgeColor} text-white text-xs font-semibold flex items-center space-x-1`}>
                    {currentRoleConfig.icon}
                    <span className="hidden xs:inline">{currentRoleConfig.shortName}</span>
                  </div>
                </div>
                {/* Dashboard Name - Hidden on very small screens, shown on sm+ */}
                <p
                  className={`hidden sm:block text-xs font-medium mt-0.5 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}
                >
                  {dashboardName || currentRoleConfig.name}
                </p>
              </div>
            </Link>

            {/* Welcome Message - Desktop */}
            <div className="hidden lg:block ml-3 pl-3 border-l border-gray-700/30">
              <div className={`text-sm font-medium ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Welcome back,
              </div>
              <div className={`text-sm font-bold bg-gradient-to-r ${currentRoleConfig.color} bg-clip-text text-transparent`}>
                {userName}
              </div>
            </div>
          </div>

          {/* Right Side - Navigation Controls */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 md:space-x-4">
            {/* Dark Mode Toggle */}
            <button
              onClick={onToggleDarkMode}
              className={`relative w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg sm:rounded-xl flex items-center justify-center transition-all duration-500 transform hover:scale-110 hover:rotate-12 group ${
                isDarkMode
                  ? 'bg-gradient-to-br from-blue-900/30 to-purple-900/30 border border-blue-800/30'
                  : 'bg-gradient-to-br from-blue-100 to-indigo-100 border border-blue-200'
              }`}
              aria-label={
                isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'
              }
            >
              {/* Background Glow Effect */}
              <div
                className={`absolute inset-0 rounded-lg sm:rounded-xl blur-lg transition-all duration-500 ${
                  isDarkMode
                    ? 'bg-gradient-to-br from-blue-500/20 to-purple-500/20 group-hover:bg-gradient-to-br group-hover:from-blue-500/40 group-hover:to-purple-500/40'
                    : 'bg-gradient-to-br from-blue-200/20 to-indigo-200/20 group-hover:bg-gradient-to-br group-hover:from-blue-300/40 group-hover:to-indigo-300/40'
                }`}
              ></div>
              {/* Sun Icon - Light Mode */}
              <Sun
                className={`absolute w-4 h-4 sm:w-5 sm:h-5 transition-all duration-500 ${
                  isDarkMode
                    ? 'opacity-0 rotate-0 scale-0 text-yellow-300'
                    : 'opacity-100 rotate-0 scale-100 text-amber-500'
                }`}
              />

              {/* Moon Icon - Dark Mode */}
              <Moon
                className={`absolute w-4 h-4 sm:w-5 sm:h-5 transition-all duration-500 ${
                  isDarkMode
                    ? 'opacity-100 rotate-0 scale-100 text-blue-300'
                    : 'opacity-0 rotate-90 scale-0 text-indigo-400'
                }`}
              />
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => { setIsNotifOpen(!isNotifOpen); setIsProfileMenuOpen(false); }}
                className={`relative w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg sm:rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 group ${
                  isDarkMode
                    ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700'
                    : 'bg-gradient-to-br from-white to-gray-50 border border-gray-200'
                }`}
                aria-label="Notifications"
              >
                <Bell className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors ${
                  isDarkMode 
                    ? 'text-blue-300 group-hover:text-blue-400' 
                    : 'text-blue-600 group-hover:text-blue-700'
                }`} />
                {/* Notification Badge */}
                {unreadCount > 0 && (
                  <div className="absolute -top-0.5 -right-0.5 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 flex items-center justify-center animate-pulse">
                    <span className="text-[10px] sm:text-xs font-bold text-white">{unreadCount > 9 ? '9+' : unreadCount}</span>
                  </div>
                )}
              </button>

              {/* Notification Dropdown */}
              {isNotifOpen && (
                <div className={`absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl shadow-2xl border backdrop-blur-xl animate-slideDown overflow-hidden ${
                  isDarkMode
                    ? 'bg-gray-900/95 border-gray-700/50'
                    : 'bg-white/95 border-gray-200'
                }`}>
                  {/* Header */}
                  <div className={`px-4 py-3 border-b flex items-center justify-between ${
                    isDarkMode ? 'border-gray-800 bg-gray-900/80' : 'border-gray-100 bg-blue-50/50'
                  }`}>
                    <div className="flex items-center gap-2">
                      <Bell className={`w-4 h-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                      <h3 className={`text-sm font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Notifications</h3>
                      {unreadCount > 0 && (
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                          isDarkMode ? 'bg-blue-900/40 text-blue-300' : 'bg-blue-100 text-blue-700'
                        }`}>{unreadCount} new</span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button onClick={() => onMarkAllRead && onMarkAllRead()} className={`text-xs font-medium flex items-center gap-1 transition-colors ${
                        isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
                      }`}>
                        <CheckCheck className="w-3.5 h-3.5" />
                        Mark all read
                      </button>
                    )}
                  </div>

                  {/* Notification List */}
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length > 0 ? notifications.slice(0, 20).map((notif) => (
                      <div
                        key={notif.id}
                        className={`flex items-start gap-3 px-4 py-3 transition-all duration-200 border-b last:border-b-0 ${
                          !notif.read
                            ? isDarkMode
                              ? 'bg-blue-900/10 border-gray-800/50 hover:bg-gray-800/40 cursor-pointer'
                              : 'bg-blue-50/50 border-gray-100 hover:bg-blue-50 cursor-pointer'
                            : isDarkMode
                              ? 'border-gray-800/30 hover:bg-gray-800/30'
                              : 'border-gray-50 hover:bg-gray-50'
                        }`}
                        onClick={() => {
                          if (!notif.read && onMarkNotificationRead) onMarkNotificationRead(notif.id);
                        }}
                      >
                        {/* Icon */}
                        <div className={`p-2 rounded-xl flex-shrink-0 ${getNotifColor(notif.color)}`}>
                          {getNotifIcon(notif.icon)}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className={`text-sm font-semibold truncate ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                              {notif.title}
                            </p>
                            {!notif.read && (
                              <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0"></div>
                            )}
                          </div>
                          <p className={`text-xs mt-0.5 line-clamp-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {notif.message}
                          </p>
                          <div className="flex items-center justify-between mt-1.5">
                            <span className={`text-[11px] flex items-center gap-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                              <Clock className="w-3 h-3" />
                              {notif.time}
                            </span>
                            <button
                              onClick={(e) => { e.stopPropagation(); onClearNotification && onClearNotification(notif.id); }}
                              className={`p-1 rounded-lg transition-all opacity-0 group-hover:opacity-100 hover:scale-110 ${
                                isDarkMode ? 'hover:bg-gray-700 text-gray-500 hover:text-red-400' : 'hover:bg-gray-100 text-gray-400 hover:text-red-500'
                              }`}
                              title="Dismiss"
                            >
                              <X className="w-3 h-3" />
                            </button>
                            {/* Mark as read button */}
                            {!notif.read && (
                              <button
                                onClick={(e) => { e.stopPropagation(); onMarkNotificationRead && onMarkNotificationRead(notif.id); }}
                                className={`ml-2 p-1 rounded-lg transition-all hover:scale-110 ${isDarkMode ? 'hover:bg-gray-700 text-emerald-400' : 'hover:bg-gray-100 text-emerald-600'}`}
                                title="Mark as read"
                              >
                                <Check className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    )) : (
                      <div className={`py-10 text-center ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
                        <p className="text-sm font-medium">No notifications</p>
                        <p className="text-xs mt-1">You're all caught up!</p>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  {notifications.length > 0 && (
                    <div className={`px-4 py-2.5 border-t text-center ${
                      isDarkMode ? 'border-gray-800 bg-gray-900/50' : 'border-gray-100 bg-gray-50/50'
                    }`}>
                      <span className={`text-xs ${
                        isDarkMode ? 'text-gray-500' : 'text-gray-400'
                      }`}>{notifications.length} total notification{notifications.length !== 1 ? 's' : ''}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Click outside to close */}
              {isNotifOpen && (
                <div className="fixed inset-0 z-[-1]" onClick={() => setIsNotifOpen(false)} />
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => { setIsProfileMenuOpen(!isProfileMenuOpen); setIsNotifOpen(false); }}
                className={`flex items-center space-x-1.5 p-1.5 sm:p-2 rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-105 group ${
                  isDarkMode
                    ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700'
                    : 'bg-gradient-to-br from-white to-gray-50 border border-gray-200'
                }`}
              >
                {/* Avatar */}
                <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center overflow-hidden ${currentRoleConfig.badgeColor}`}>
                  {userPhoto ? (
                    <img src={userPhoto} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                  )}
                </div>
                <div className="hidden md:block text-left">
                  <div className={`text-xs sm:text-sm font-semibold ${
                    isDarkMode ? 'text-gray-100' : 'text-gray-900'
                  }`}>
                    {userName}
                  </div>
                  <div className={`text-xs ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {currentRoleConfig.shortName}
                  </div>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform ${
                  isProfileMenuOpen ? 'rotate-180' : ''
                } ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`} />
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileMenuOpen && (
                <div className={`absolute right-0 mt-2 w-48 sm:w-56 md:w-64 rounded-lg sm:rounded-xl shadow-xl border backdrop-blur-lg animate-slideDown ${
                  isDarkMode
                    ? 'bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700'
                    : 'bg-gradient-to-br from-white to-blue-50 border-blue-100'
                }`}>
                  <div className="p-3 sm:p-4">
                    <div className="flex items-center space-x-3 mb-3 sm:mb-4">
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center overflow-hidden ${currentRoleConfig.badgeColor}`}>
                        {userPhoto ? (
                          <img src={userPhoto} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        )}
                      </div>
                      <div>
                        <div className={`text-sm sm:text-base font-bold ${
                          isDarkMode ? 'text-gray-100' : 'text-gray-900'
                        }`}>
                          {userName}
                        </div>
                        <div className={`text-xs sm:text-sm ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          {currentRoleConfig.name}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1 sm:space-y-2">
                      <button
                        className={`w-full flex items-center space-x-3 p-2 sm:p-3 rounded-lg transition-all hover:scale-105 ${
                          isDarkMode
                            ? 'hover:bg-gray-800 text-gray-300'
                            : 'hover:bg-blue-50 text-gray-700'
                        }`}
                        onClick={() => { setIsProfileMenuOpen(false); const roleRoute = userRole === 'caretaker' ? 'caregiver' : userRole; navigate(`/${roleRoute}-profile`); }}
                      >
                        <User className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="text-sm sm:text-base">My Profile</span>
                      </button>

                      <button
                        className={`w-full flex items-center space-x-3 p-2 sm:p-3 rounded-lg transition-all hover:scale-105 ${
                          isDarkMode
                            ? 'hover:bg-gray-800 text-gray-300'
                            : 'hover:bg-blue-50 text-gray-700'
                        }`}
                        onClick={() => { setIsProfileMenuOpen(false); if (onSettingsClick) onSettingsClick(); }}
                      >
                        <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="text-sm sm:text-base">Settings</span>
                      </button>

                      <Link
                        to={`/${userRole === 'caretaker' ? 'caregiver' : userRole}-help`}
                        className={`flex items-center space-x-3 p-2 sm:p-3 rounded-lg transition-all hover:scale-105 ${
                          isDarkMode
                            ? 'hover:bg-gray-800 text-gray-300'
                            : 'hover:bg-blue-50 text-gray-700'
                        }`}
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="text-sm sm:text-base">Help & Support</span>
                      </Link>

                      <div className="border-t pt-2 mt-2">
                        <button
                          onClick={handleLogout}
                          className={`w-full flex items-center justify-center space-x-3 p-2 sm:p-3 rounded-lg font-semibold ${
                            isDarkMode
                              ? 'bg-gradient-to-r from-rose-700 to-pink-700 text-white'
                              : 'bg-gradient-to-r from-rose-600 to-pink-600 text-white'
                          }`}
                        >
                          <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                          <span className="text-sm sm:text-base font-semibold">Logout</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-1.5 rounded-lg md:hidden ${
                isDarkMode
                  ? 'bg-gray-800 text-blue-300'
                  : 'bg-blue-50 text-blue-600'
              }`}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMenuOpen ? (
                <X className="h-4 w-4 sm:h-5 sm:w-5" />
              ) : (
                <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Welcome Message and Dashboard Name */}
        <div className="lg:hidden py-2 border-t">
          <div className="flex items-center justify-between">
            <div>
              <div className={`text-xs font-medium ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Welcome, <span className="font-bold">{userName}</span>
              </div>
              <div className={`text-sm font-bold bg-gradient-to-r ${currentRoleConfig.color} bg-clip-text text-transparent`}>
                {dashboardName || currentRoleConfig.name}
              </div>
            </div>
            <div className={`text-xs px-2 py-1 rounded-full ${currentRoleConfig.badgeColor} text-white`}>
              {currentRoleConfig.shortName}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div
            className={`md:hidden py-3 px-3 rounded-b-lg sm:rounded-b-xl shadow-lg animate-slideDown ${
              isDarkMode
                ? 'bg-gray-900 border-t border-gray-800'
                : 'bg-white border-t border-blue-100'
            }`}
          >
            <div className="space-y-2 sm:space-y-3">
              <Link
                to="/dashboard"
                className={`flex items-center space-x-3 p-2 sm:p-3 rounded-lg transition-all ${
                  isDarkMode
                    ? 'text-gray-300 hover:text-blue-400 hover:bg-gray-800'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <Home className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-sm sm:text-base">Dashboard Home</span>
              </Link>

              <Link
                to="/activity"
                className={`flex items-center space-x-3 p-2 sm:p-3 rounded-lg transition-all ${
                  isDarkMode
                    ? 'text-gray-300 hover:text-blue-400 hover:bg-gray-800'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <Activity className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-sm sm:text-base">Activity</span>
              </Link>

              <button
                className={`w-full flex items-center space-x-3 p-2 sm:p-3 rounded-lg transition-all ${
                  isDarkMode
                    ? 'text-gray-300 hover:text-blue-400 hover:bg-gray-800'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                }`}
                onClick={() => { setIsMenuOpen(false); if (onSettingsClick) onSettingsClick(); }}
              >
                <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-sm sm:text-base">Settings</span>
              </button>

              <div className="pt-2 sm:pt-3 border-t">
                <button
                  onClick={handleLogout}
                  className={`w-full flex items-center justify-center space-x-3 p-2 sm:p-3 rounded-lg font-semibold ${
                    isDarkMode
                      ? 'bg-gradient-to-r from-rose-700 to-pink-700 text-white'
                      : 'bg-gradient-to-r from-rose-600 to-pink-600 text-white'
                  }`}
                >
                  <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-sm sm:text-base font-semibold">Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }
      `}</style>
    </header>
  );
};

export default DashboardNavbar;