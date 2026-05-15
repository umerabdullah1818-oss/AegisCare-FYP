import React, { useState, useEffect, useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  User, Users, Heart, Activity, Home, Bell, AlertCircle, 
  Calendar, FileText, MapPin, Clock, CheckCircle, XCircle,
  MessageCircle, Phone, Shield, TrendingUp, Award, Target, 
  Zap, Settings, HelpCircle, BarChart3, FileHeart, ChevronRight, ChevronDown,
  Menu, X, LogOut, History, ClipboardCheck, Database, Eye, 
  Edit, Plus, PhoneCall, Mail, MoreVertical, Filter, Search, 
  Star, Sparkles, Wind, ShieldCheck, ActivitySquare, Bed, 
  Droplets, Flame, TrendingDown, Thermometer, Dumbbell, 
  Syringe, ClipboardList, Apple, Clock3, CalendarDays, 
  DownloadCloud, Camera, Mic, MicOff, VideoOff, Volume2, 
  Maximize2, Paperclip, Send, ThumbsUp, Cloud, ShieldAlert, 
  PieChart, LineChart, Pill, HeartPulse, 
  UserCheck, UserPlus, FilePlus, FileCheck, MessageSquare, 
  PhoneIncoming, Video, UserX, AlertTriangle, CheckSquare, Square,
  UploadCloud, FileSignature, PillBottle, Heart as HeartIcon,
  Brain as BrainIcon, Eye as EyeIcon, Globe, Monitor, Tablet,
  Watch, Smartphone, Wifi, Bluetooth, Battery, BatteryCharging,
  Cpu, MessageSquarePlus, FileSearch, TestTube, ChartBar,
  Layers, GitMerge, Server, Network, CloudRain, Sun, Moon,
  CloudSun, Droplet, Waves, Radio, WifiOff, BluetoothConnected,
  BatteryFull, Power, RefreshCw, RotateCcw, Play, Pause, StopCircle,
  SkipBack, SkipForward, VolumeX, Headphones, Mic2, Cast, Airplay,
  Film, Image, Music, BookOpen, Book, CalendarClock, Timer,
  TimerReset, TimerOff, CalendarCheck, CalendarMinus, CalendarPlus,
  CalendarX, CalendarRange, Navigation, Award as AwardIcon,
  Target as TargetIcon, Users as UsersIcon, Activity as ActivityIcon,
  Map, BellRing, Utensils, Coffee, Carrot, Beef, Fish, Milk, Egg,
  AlertOctagon, Map as MapIcon, Navigation as NavigationIcon,
  Compass, BatteryCharging as BatteryIcon, Activity as ActivityTracker,
  Shield as ShieldIcon, Moon as SleepIcon, FileWarning, FileQuestion,
  FileX, FileCheck as FileApproved, ThumbsDown, AlertOctagon as EmergencyIcon,
  Siren, Ambulance, LifeBuoy, MapPin as LocationPin, Route,
  CheckCheck, BellDot, CalendarHeart, ChefHat, Scale, Calculator,
  PieChart as NutritionChart, TrendingUp as ProgressUp, TrendingDown as ProgressDown,
  ArrowUpRight, ArrowDownRight, Timer as TimerIcon, BatteryLow,
  SignalHigh, SignalLow, SignalMedium, SignalZero, BatteryWarning,
  ShieldOff, ShieldHalf, Shield as ShieldFull, HeartOff,
  Thermometer as TemperatureIcon, Wind as OxygenIcon, Bed as SleepTracker,
  Coffee as BeverageIcon, Carrot as VegetableIcon, Beef as ProteinIcon,
  Fish as SeafoodIcon, Milk as DairyIcon, Egg as EggsIcon,
  UtensilsCrossed, ChefHat as MealPlanIcon, Scale as WeightScaleIcon,
  Calculator as BmiCalcIcon, PieChart as DietChartIcon, Stethoscope,
  Crown, Target as TargetIcon2
} from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import SplashScreen from '../../../components/SplashScreen';
import DashboardNavbar from '../../../components/DashboardsNavbar';
import SettingsPage from '../../../components/SettingsPage';
import api from '../../../services/api';

import { getColorGradientDark, getColorGradientLight, getColorClass } from './helpers';
import AnimatedGauge from './components/AnimatedGauge';
import GlassCard from './components/GlassCard';
import AnimatedCard from './components/AnimatedCard';
import GlowingButton from './components/GlowingButton';
import AnimatedChart from './components/AnimatedChart';
import BeautifulFooter from './components/BeautifulFooter';
import ElderlyProfile from './components/ElderlyProfile';
import ElderlyList from './components/ElderlyList';
import ReviewDietPlan from './components/ReviewDietPlan';
import NotificationCenter from './components/NotificationCenter';
import HealthAlerts from './components/HealthAlerts';
import MedicationTracker from './components/MedicationTracker';
import EmergencyLocation from './components/EmergencyLocation';
import HealthAnalytics from './components/HealthAnalytics';
import CaregiverHome from './components/CaregiverHome';
const Caregiver = ({ isDarkMode: propIsDarkMode, onToggleDarkMode, onLogout }) => {
  const [showSplash, setShowSplash] = useState(() => {
    const splashShown = sessionStorage.getItem('caregiver-splash-shown');
    return !splashShown;
  });
  const [isDarkMode, setIsDarkMode] = useState(propIsDarkMode || false);
  const [activeModule, setActiveModule] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedElderly, setSelectedElderly] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [userPhoto, setUserPhoto] = useState('');

  // Dynamically fetched data states
  const [elderlyList, setElderlyList] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [dietPlans, setDietPlans] = useState([]);
  const [medicationSchedule, setMedicationSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [targetMedId, setTargetMedId] = useState(null);
  const [elderlyFilter, setElderlyFilter] = useState('all');

  const userName = localStorage.getItem('userFirstName') || 'Sarah Johnson';
  const userEmail = localStorage.getItem('userEmail') || 'sarah.johnson@family.com';
  const userRole = localStorage.getItem('userRole') || 'caregiver';

  // Get role-based dashboard name
  const getDashboardName = () => {
    const roleNames = {
      'elderly': 'Elderly Health & Wellness Dashboard',
      'doctor': 'Medical Professional Dashboard',
      'caregiver': 'Caregiver Management Dashboard',
      'admin': 'Administration Dashboard'
    };
    return roleNames[userRole] || 'Caregiver Dashboard';
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

    setUserPhoto(localStorage.getItem('userPhoto') || '');
    const handlePhotoUpdate = () => {
      setUserPhoto(localStorage.getItem('userPhoto') || '');
    };
    window.addEventListener('profilePhotoUpdated', handlePhotoUpdate);
    window.addEventListener('storage', handlePhotoUpdate);

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('profilePhotoUpdated', handlePhotoUpdate);
      window.removeEventListener('storage', handlePhotoUpdate);
    };
  }, []);

  // Fetch Caregiver Data
  useEffect(() => {
    const fetchCaregiverData = async () => {
      try {
        setLoading(true);
        const response = await api.get('/caregiver/elderly');
        if (response.data && response.data.success) {
          const elderlyData = response.data.data;
          
          const colors = ['blue', 'emerald', 'purple', 'amber', 'rose', 'cyan'];
          const processedElderly = elderlyData.map((e, index) => {
            const mlStatus = e.mlInsights?.anomaly?.is_anomaly ? 'Needs Attention' : 'Stable';
            return {
              ...e,
              name: `${e.firstName} ${e.lastName}`,
              age: e.dateOfBirth ? Math.floor((new Date() - new Date(e.dateOfBirth)) / 31557600000) : 'N/A',
              gender: e.gender || 'Unknown',
              relationship: 'Patient',
              location: e.address || 'Home',
              status: mlStatus,
              color: colors[index % colors.length],
              image: `${e.firstName.charAt(0)}${e.lastName.charAt(0)}`,
              vitals: (() => {
                const v = e.vitals || { heartRate: 72, bp: '120/80', glucose: 110, temp: 36.6, spo2: 98 };
                return {
                  ...v,
                  tempF: v.tempF || (v.temp < 45 ? Math.round((v.temp * 9 / 5 + 32) * 10) / 10 : v.temp)
                };
              })(),
              mlInsights: e.mlInsights || null,
              lastCheck: 'Just now',
              alertsCount: e.alerts ? e.alerts.length : 0
            };
          });

          setElderlyList(processedElderly);

          let allAlerts = [];
          let allDietPlans = [];
          let allMedications = [];

          processedElderly.forEach(elderly => {
            if (elderly.alerts && Array.isArray(elderly.alerts)) {
              elderly.alerts.forEach((a, i) => allAlerts.push({ id: `${elderly._id}-a${i}`, ...a, elderly: elderly.name }));
            }
            // Add ML anomaly alerts
            if (elderly.mlInsights?.anomaly?.alerts) {
              elderly.mlInsights.anomaly.alerts.forEach((mlAlert, i) => {
                allAlerts.push({
                  id: `${elderly._id}-ml${i}`,
                  type: 'ML Anomaly',
                  title: mlAlert.message || 'Vitals anomaly detected',
                  message: `${mlAlert.vital?.replace('_', ' ')}: ${mlAlert.value}`,
                  severity: elderly.mlInsights.anomaly.severity === 'critical' ? 'critical' : 'high',
                  elderly: elderly.name
                });
              });
            }
            if (elderly.dietPlans && Array.isArray(elderly.dietPlans)) {
              elderly.dietPlans.forEach(d => allDietPlans.push({ 
                id: d._id, 
                elderly: elderly.name, 
                elderlyId: elderly._id,
                date: new Date(d.date).toISOString().split('T')[0], 
                status: d.approvalStatus === 'approved' ? 'Approved' : d.approvalStatus === 'rejected' ? 'Rejected' : 'Pending', 
                approvalStatus: d.approvalStatus || 'pending',
                meals: 1, 
                calories: d.calories || 0, 
                reviewed: d.approvalStatus === 'approved' || d.approvalStatus === 'rejected',
                name: d.name,
                mealType: d.mealType,
                scheduledTime: d.scheduledTime,
                protein: d.protein || 0,
                carbs: d.carbs || 0,
                fats: d.fats || 0,
                notes: d.notes || ''
              }));
            }
            if (elderly.medications && Array.isArray(elderly.medications)) {
              elderly.medications.forEach(m => allMedications.push({
                id: m._id,
                elderly: elderly.name,
                medication: m.name,
                dosage: m.dosage,
                time: m.scheduledTime,
                status: m.todayStatus === 'taken' ? 'Taken' : m.todayStatus === 'missed' ? 'Missed' : 'Upcoming',
                timeTaken: null
              }));
            }
          });

          setAlerts(allAlerts);
          setDietPlans(allDietPlans);
          setMedicationSchedule(allMedications);
        }
      } catch (err) {
        console.error('Error fetching caregiver data:', err);
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchCaregiverData();
  }, []);

  // Fetch Notifications
  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return; // Skip polling if no token
      
      const res = await api.get('/notifications');
      if (res.data && res.data.success) {
        const newNotifications = res.data.data;
        setNotifications(prev => {
          if (
            prev.length === newNotifications.length &&
            prev.every((p, i) => p._id === newNotifications[i]._id && p.isRead === newNotifications[i].isRead)
          ) {
            return prev;
          }
          return newNotifications;
        });
        
        setUnreadCount(res.data.unreadCount || 0);

        // Inject emergency notifications into the dashboard alerts view
        const emergencyNotifs = res.data.data
          .filter(n => n.type === 'emergency' && !n.isRead)
          .map(n => ({
            id: n._id,
            type: 'Emergency',
            title: n.title || 'Emergency Alert',
            message: n.message,
            severity: 'critical',
            date: new Date(n.createdAt).toISOString().split('T')[0],
            elderly: n.message.includes('for') ? n.message.split('for ')[1].split('.')[0] : 'Unknown' 
          }));

        setAlerts(prev => {
          const filtered = prev.filter(a => a.type !== 'Emergency');
          const newAlerts = [...emergencyNotifs, ...filtered];
          if (
            prev.length === newAlerts.length && 
            prev.every((p, i) => p.id === newAlerts[i].id)
          ) {
            return prev;
          }
          return newAlerts;
        });
      }
    } catch (err) {
      // Silently ignore 401 errors during background polling
      // to prevent the global interceptor from triggering page refresh
      if (err.response && err.response.status === 401) {
        console.warn('Notification poll skipped: token may have expired');
        return;
      }
      console.error('Error fetching notifications:', err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000); // Poll every 60s instead of 30s
    return () => clearInterval(interval);
  }, []);

  const handleMarkNotificationRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.put('/notifications/read-all');
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  // Handle dark mode toggle
  const handleDarkModeToggle = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (onToggleDarkMode) {
      onToggleDarkMode();
    }
  };

  // Enhanced Animated Components

  // Glass Card Component

  // Navigation modules for Caregiver
  const modules = [
    { id: 'dashboard', name: 'Caregiver Home', icon: <Home size={22} />, color: 'blue', notification: 0 },
    { id: 'elderly-list', name: 'Elderly I Monitor', icon: <Users size={22} />, color: 'emerald', notification: 0 },
    { id: 'elderly-profile', name: 'Elderly Profile', icon: <User size={22} />, color: 'purple', notification: 0 },
    { id: 'diet-plan-review', name: 'Review Diet Plans', icon: <ClipboardList size={22} />, color: 'amber', notification: dietPlans.filter(d => d.status === 'Pending' || d.approvalStatus === 'pending').length },
    { id: 'notifications', name: 'Notification Center', icon: <Bell size={22} />, color: 'rose', notification: unreadCount || notifications.filter(a => !(a.isRead || a.read)).length },
    { id: 'alerts', name: 'Health Alerts', icon: <AlertCircle size={22} />, color: 'indigo', notification: notifications.filter(a => a.severity === 'critical' || a.type === 'Emergency').length },
    { id: 'medication', name: 'Medication Tracker', icon: <Pill size={22} />, color: 'cyan', notification: medicationSchedule.length },
    { id: 'emergency', name: 'Emergency Location', icon: <MapPin size={22} />, color: 'green', notification: 0 },
    { id: 'analytics', name: 'Health Analytics', icon: <BarChart3 size={22} />, color: 'violet', notification: 0 },
    { id: 'settings', name: 'Caregiver Settings', icon: <Settings size={22} />, color: 'teal', notification: 0 },
  ];

  // Sample Data Removed - Now using State Variables from API

  const emergencyContacts = [
    { id: 1, name: 'Dr. Sarah Miller', role: 'Primary Physician', phone: '+1 (555) 123-4567' },
    { id: 2, name: 'Emergency Services', role: '911', phone: '911' },
    { id: 3, name: 'Nearest Hospital', role: 'City General', phone: '+1 (555) 987-6543' },
    { id: 4, name: 'Family Member', role: 'Spouse', phone: '+1 (555) 234-5678' },
  ];

  const healthHistory = [
    { date: '2024-12-10', event: 'Regular Check-up', type: 'checkup', doctor: 'Dr. Miller' },
    { date: '2024-12-05', event: 'Blood Test', type: 'lab', doctor: 'Lab Corp' },
    { date: '2024-11-28', event: 'Medication Adjustment', type: 'medication', doctor: 'Dr. Miller' },
    { date: '2024-11-15', event: 'Dental Appointment', type: 'dental', doctor: 'Dr. Johnson' },
  ];

  // Enhanced Animated Chart Component

  // Enhanced Elderly Profile Component

  // Elderly List Component

  // Review Diet Plan Component

  // Notification Center Component

  // Health Alerts Component

  // Medication Tracker Component

  // Emergency Location Component (Stunning Modern Redesign)

  // Health Analytics Component (Modern Redesign)

  // Render different modules based on selection

  const renderModuleContent = () => {
    const moduleProps = {
      isDarkMode, setActiveModule, selectedElderly, setSelectedElderly,
      searchQuery, setSearchQuery, elderlyList, elderlyFilter, setElderlyFilter,
      alerts, dietPlans, setDietPlans, medicationSchedule, loading, error,
      notifications, unreadCount, handleMarkNotificationRead, handleMarkAllRead,
      fetchNotifications, emergencyContacts, healthHistory, targetMedId, setTargetMedId,
      userName, userEmail, userRole,
    };

    if (activeModule === 'elderly-profile' && selectedElderly) {
      return <ElderlyProfile {...moduleProps} elderly={selectedElderly} onBack={() => setSelectedElderly(null)} />;
    }

    switch(activeModule) {
      case 'dashboard':
        return <CaregiverHome {...moduleProps} />;
      case 'elderly-list':
        return <ElderlyList {...moduleProps} />;
      case 'diet-plan-review':
        return <ReviewDietPlan {...moduleProps} />;
      case 'notifications':
        return <NotificationCenter {...moduleProps} />;
      case 'alerts':
        return <HealthAlerts {...moduleProps} />;
      case 'medication':
        return <MedicationTracker {...moduleProps} />;
      case 'emergency':
        return <EmergencyLocation {...moduleProps} />;
      case 'analytics':
        return <HealthAnalytics {...moduleProps} />;
      case 'settings':
        return (
          <>
            <SettingsPage isDarkMode={isDarkMode} />
            <BeautifulFooter isDarkMode={isDarkMode} setActiveModule={setActiveModule} />
          </>
        );
      case 'elderly-profile':
        return (
          <div className="text-center py-20">
            <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>No elderly person selected. Please select from the list.</p>
          </div>
        );
      default:
        return null;
    }
  };


  if (showSplash) {
    return (
      <SplashScreen 
        userRole={userRole}
        userName={userName}
        isDarkMode={isDarkMode}
        onFinish={() => { sessionStorage.setItem('caregiver-splash-shown', 'true'); setShowSplash(false); }}
      />
    );
  }

  return (
    <div className={`h-screen overflow-hidden transition-all duration-500 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-950 via-gray-900 to-emerald-950/30' 
        : 'bg-gradient-to-br from-emerald-50 via-white to-blue-50'
    }`}>
      <ToastContainer position="top-right" theme={isDarkMode ? "dark" : "light"} />
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
        notifications={notifications.map(n => {
          const typeMap = {
            meal_added: { icon: 'calendar', color: 'amber' },
            medication_added: { icon: 'pill', color: 'cyan' },
            meal_approved: { icon: 'activity', color: 'emerald' },
            meal_rejected: { icon: 'alert', color: 'red' },
            medication_approved: { icon: 'activity', color: 'green' },
            medication_rejected: { icon: 'alert', color: 'red' },
            assignment: { icon: 'bell', color: 'teal' },
            emergency: { icon: 'alert', color: 'red' },
            general: { icon: 'bell', color: 'blue' }
          };
          const mapped = typeMap[n.type] || typeMap.general;
          return {
            id: n._id,
            title: n.title,
            message: n.message,
            time: new Date(n.createdAt).toLocaleString(),
            read: n.isRead,
            type: n.type,
            icon: mapped.icon,
            color: mapped.color
          };
        })}
        onMarkNotificationRead={handleMarkNotificationRead}
        onMarkAllRead={handleMarkAllRead}
      />

      <div className="flex relative h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <div className={`transition-all duration-300 flex flex-col fixed lg:relative z-40 h-full ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${isDarkMode ? 'bg-gray-950/95' : 'bg-white/95'} backdrop-blur-xl h-[calc(100vh-5rem)] w-56 md:w-64 lg:w-56 xl:w-64 border-r ${
          isDarkMode ? 'border-gray-800' : 'border-gray-200'
        }`}>
          {/* Sidebar Header */}
          <div className="p-3 border-b border-gray-800/50 flex-shrink-0 relative">
            <div className="flex items-center gap-2 mb-3">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center overflow-hidden ${
                isDarkMode ? 'bg-emerald-950/40' : 'bg-gradient-to-r from-emerald-100 to-teal-100'
              }`}>
                {userPhoto ? (
                  <img src={userPhoto} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <Heart className={isDarkMode ? 'text-emerald-400' : 'text-emerald-600'} size={18} />
                )}
              </div>
              <div>
                <h2 className={`font-bold text-sm ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                  {userName}
                </h2>
                <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                  Caregiver
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
                className={`w-full flex items-center justify-between p-2.5 rounded-lg transition-all duration-200 text-left group ${
                  activeModule === module.id
                    ? isDarkMode
                      ? `bg-${module.color}-950/40 text-${module.color}-300 border-l-2 border-${module.color}-500`
                      : `bg-${module.color}-100 text-${module.color}-700 border-l-2 border-${module.color}-500`
                    : isDarkMode
                    ? 'hover:bg-gray-800/50 text-gray-400 hover:text-gray-300'
                    : 'hover:bg-gray-100 text-gray-700 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`transition-transform duration-300 group-hover:scale-110 ${
                    activeModule === module.id ? `text-${module.color}-500` : ''
                  }`}>
                    {module.icon}
                  </div>
                  <span className="font-medium text-sm">{module.name}</span>
                </div>
                {module.notification > 0 && (
                  <span className={`text-xs px-2 py-1 rounded-full min-w-[20px] text-center ${
                    isDarkMode 
                      ? `bg-${module.color}-900/40 text-${module.color}-300`
                      : `bg-${module.color}-100 text-${module.color}-700`
                  }`}>
                    {module.notification}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Sidebar Footer - Fixed at bottom */}
          <div className="mt-auto p-3 border-t border-gray-800/50 flex-shrink-0">
            <div className={`text-center p-2 rounded-lg transition-all duration-300 hover:scale-105 cursor-pointer ${
              isDarkMode ? 'bg-gray-900/40 hover:bg-gray-800/40' : 'bg-emerald-50/50 hover:bg-emerald-100/50'
            }`}>
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className={`text-xs font-medium ${isDarkMode ? 'text-emerald-300' : 'text-emerald-700'}`}>
                  System Active
                </span>
              </div>
              <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                24/7 Elderly Monitoring
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className={`flex-1 transition-all duration-300 overflow-y-auto ${
          isSidebarOpen ? 'ml-0 lg:ml-0' : 'ml-0'
        }`}>
          <main className="p-4 sm:p-6 animate-fade-in max-w-full">
            {renderModuleContent()}
          </main>
        </div>

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

export default Caregiver;