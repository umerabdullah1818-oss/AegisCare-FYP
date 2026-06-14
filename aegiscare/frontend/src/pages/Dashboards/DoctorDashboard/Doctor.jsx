import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { 
  User, Users, Stethoscope, Video, Clock, Calendar, 
  AlertCircle, FileText, Pill, Activity, Heart, 
  Thermometer, Brain, Download, Upload, MessageCircle,
  Phone, Shield, TrendingUp, Award, Target, Zap, 
  Settings, HelpCircle, Home, BarChart3, FileHeart,
  Bell, ChevronRight, ChevronDown, Check, Menu, X, LogOut, History,
  ClipboardCheck, Database, Eye, Edit, Plus,
  PhoneCall, MapPin, Mail, CheckCircle, XCircle,
  MoreVertical, Filter, Search, Star, Crown,
  Sparkles, Wind, ShieldCheck, BrainCircuit,
  ActivitySquare, BedDouble, Droplets, Flame,
  Award as AwardIcon, TrendingDown, ThermometerSun,
  Dumbbell, Syringe, ClipboardList, Apple,
  Clock3, CalendarDays, DownloadCloud, Camera,
  Mic, MicOff, VideoOff, Volume2, Maximize2,
  Paperclip, Send, ThumbsUp, Star as StarIcon,
  Zap as ZapIcon, Cloud, ShieldAlert, Users as UsersIcon,
  BarChart, PieChart, LineChart, Target as TargetIcon,
  Pill as PillIcon, HeartPulse, UserCheck, UserPlus,
  Activity as ActivityIcon, FilePlus, FileCheck,
  MessageSquare, PhoneIncoming, Video as VideoIcon,
  UserX, AlertTriangle, CheckSquare, Square,
  UploadCloud, FileSignature, PillBottle, 
  Syringe as SyringeIcon, Heart as HeartIcon,
  Brain as BrainIcon, Eye as EyeIcon, Ear,
  Award as Award2, Globe, Monitor, Tablet,
  Watch, Smartphone, Wifi, Bluetooth,
  Battery, BatteryCharging, Cpu, Database as DbIcon,
  MessageSquarePlus, FileSearch, TestTube,
  ChartBar, Activity as ActivityHeart,
  Shield as ShieldIcon, Calendar as CalendarIcon,
  Bell as BellIcon, FilePlus2, FolderOpen,
  Layers, GitMerge, Cpu as CpuIcon,
  Database as DatabaseIcon, Server, Network,
  CloudRain, Wind as WindIcon, Sun, Moon,
  CloudSun, Droplet, Thermometer as ThermometerIcon,
  Waves, Radio, WifiOff, BluetoothConnected,
  BatteryFull, Power, Zap as ZapFast,
  RefreshCw, RotateCcw, Play, Pause, StopCircle,
  SkipBack, SkipForward, VolumeX, Headphones,
  Mic2, Video as Video2, Cast, Airplay,
  Monitor as MonitorIcon, Tablet as TabletIcon,
  Smartphone as SmartphoneIcon, Watch as WatchIcon,
  Camera as CameraIcon, Film, Image, Music,
  BookOpen, Book, CalendarClock, Timer,
  TimerReset, TimerOff, Clock as ClockIcon,
  CalendarCheck, CalendarMinus, CalendarPlus,
  CalendarX, CalendarRange, CalendarDays as CalendarDaysIcon
} from 'lucide-react';
import SplashScreen from '../../../components/SplashScreen';
import DashboardNavbar from '../../../components/DashboardsNavbar';
import SettingsPage from '../../../components/SettingsPage';
import api from '../../../services/api';
import { jsPDF } from 'jspdf';

import { getColorGradientDark, getColorGradientLight, getColorClass } from './helpers';
import { generatePatientPDF } from './pdfGenerator';
import GlobalToast from './components/GlobalToast';
import AnimatedGauge from './components/AnimatedGauge';
import GlassCard from './components/GlassCard';
import AnimatedCard from './components/AnimatedCard';
import GlowingButton from './components/GlowingButton';
import AnimatedChart from './components/AnimatedChart';
import BeautifulFooter from './components/BeautifulFooter';
import VideoCall from './components/VideoCall';
import PatientProfile from './components/PatientProfile';
import MyPatients from './components/MyPatients';
import Appointments from './components/Appointments';
import Telemedicine from './components/Telemedicine';
import Consultations from './components/Consultations';
import MedicalHistory from './components/MedicalHistory';
import Prescriptions from './components/Prescriptions';
import LabReports from './components/LabReports';
import VitalAlerts from './components/VitalAlerts';
import DoctorAnalytics from './components/Analytics';
import DoctorHome from './components/DoctorHome';
const Doctor = ({ isDarkMode: propIsDarkMode, onToggleDarkMode, onLogout }) => {
  const [showSplash, setShowSplash] = useState(() => {
    const splashShown = sessionStorage.getItem('doctor-splash-shown');
    return !splashShown;
  });
  const [isDarkMode, setIsDarkMode] = useState(propIsDarkMode || false);
  const [activeModule, setActiveModuleRaw] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isVideoCallActive, setIsVideoCallActive] = useState(false);

  const setActiveModule = (module) => {
    if (module !== 'patient-profile') {
      setSelectedPatient(null);
      setIsVideoCallActive(false);
    }
    setActiveModuleRaw(module);
  };
  const [searchQuery, setSearchQuery] = useState('');
  const [userPhoto, setUserPhoto] = useState('');

  // ===== Global Toast Notication =====
  const showToast = useCallback((message, type = 'success') => {
    window.dispatchEvent(new CustomEvent('showToast', { detail: { message, type } }));
  }, []);

  // Lifted from MyPatientsComponent to prevent input focus loss
  const [patientsFilter, setPatientsFilter] = useState('all');
  const [patientsSortBy, setPatientsSortBy] = useState('recent');

  // ===== Notification System (Real API) =====
  const [notifications, setNotifications] = useState([]);

  // ===== Dynamic Data States =====
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [isLoadingPatients, setIsLoadingPatients] = useState(true);
  const [isLoadingAppointments, setIsLoadingAppointments] = useState(true);

  const [vitalAlerts, setVitalAlerts] = useState([]);
  const [pendingConsultations, setPendingConsultations] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [labReports, setLabReports] = useState([]);
  const [telemedicineSessions, setTelemedicineSessions] = useState([]);

  const fetchPatients = useCallback(async () => {
    try {
      setIsLoadingPatients(true);
      const res = await api.get('/doctor/elderly');
      if (res.data && res.data.success) {
        const assigned = res.data.data.map((p, index) => {
          const colors = ['blue', 'emerald', 'purple', 'amber', 'rose', 'indigo', 'cyan', 'teal'];
          // Calculate age from dateOfBirth
          let calculatedAge = 'N/A';
          if (p.dateOfBirth) {
            const dob = new Date(p.dateOfBirth);
            const today = new Date();
            calculatedAge = Math.floor((today - dob) / 31557600000); // ms in a year
          }
          return {
            id: p._id,
            name: `${p.firstName} ${p.lastName}`,
            age: calculatedAge,
            gender: p.gender || 'Unknown',
            condition: p.medicalHistory?.[0] || 'Routine Care',
            lastVisit: 'Recently', // Backend could provide this later
            nextAppointment: 'Pending',
            status: p.mlInsights?.risk?.risk_level === 'High' ? 'Critical' : p.mlInsights?.risk?.risk_level === 'Medium' ? 'Monitoring' : 'Stable',
            color: colors[index % colors.length],
            image: `${p.firstName?.[0] || ''}${p.lastName?.[0] || ''}`.toUpperCase() || 'P',
            vitals: p.vitals || {
              heartRate: 72, bp: '120/80', glucose: 100, temp: 98.6, spo2: 98
            },
            mlInsights: p.mlInsights || null,
            raw: p
          };
        });
        setPatients(assigned);

        // Dynamically compute vital alerts from patient vitals
        const newAlerts = [];
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        assigned.forEach(p => {
          const hr = p.vitals?.heartRate || 72;
          const spo2 = p.vitals?.spo2 || 98;
          const glucose = p.vitals?.glucose || 100;
          const temp = p.vitals?.tempF || (p.vitals?.temp ? (p.vitals.temp < 45 ? Math.round((p.vitals.temp * 9 / 5 + 32) * 10) / 10 : p.vitals.temp) : 98.6);
          const bp = p.vitals?.bp || '120/80';
          const systolic = parseInt(bp.split('/')[0]) || 120;
          const diastolic = parseInt(bp.split('/')[1]) || 80;

          if (hr > 90 || hr < 60) {
            newAlerts.push({
              id: `alert-${p.id}-hr`,
              patientId: p.id,
              patient: p.name,
              vital: 'Heart Rate',
              value: `${hr} BPM`,
              threshold: hr > 90 ? '90 BPM' : '60 BPM',
              time: timeStr,
              timestamp: now.getTime(),
              severity: hr > 100 || hr < 50 ? 'High' : 'Medium',
              trend: hr > 90 ? 'increasing' : 'decreasing'
            });
          }
          if (spo2 < 95) {
            newAlerts.push({
              id: `alert-${p.id}-spo2`,
              patientId: p.id,
              patient: p.name,
              vital: 'SpO2',
              value: `${spo2}%`,
              threshold: '95%',
              time: timeStr,
              timestamp: now.getTime(),
              severity: spo2 < 90 ? 'High' : 'Medium',
              trend: 'decreasing'
            });
          }
          if (glucose > 140) {
            newAlerts.push({
              id: `alert-${p.id}-glu`,
              patientId: p.id,
              patient: p.name,
              vital: 'Glucose',
              value: `${glucose} mg/dL`,
              threshold: '140 mg/dL',
              time: timeStr,
              timestamp: now.getTime(),
              severity: glucose > 180 ? 'High' : 'Medium',
              trend: 'increasing'
            });
          }
          if (temp > 100.4 || temp < 96.8) {
            newAlerts.push({
              id: `alert-${p.id}-temp`,
              patientId: p.id,
              patient: p.name,
              vital: 'Temperature',
              value: `${temp}°F`,
              threshold: temp > 100.4 ? '100.4°F' : '96.8°F',
              time: timeStr,
              timestamp: now.getTime(),
              severity: temp > 103 || temp < 95 ? 'High' : 'Medium',
              trend: temp > 100.4 ? 'increasing' : 'decreasing'
            });
          }
          if (systolic > 140 || systolic < 90 || diastolic > 90 || diastolic < 60) {
            newAlerts.push({
              id: `alert-${p.id}-bp`,
              patientId: p.id,
              patient: p.name,
              vital: 'Blood Pressure',
              value: bp + ' mmHg',
              threshold: systolic > 140 || diastolic > 90 ? '140/90 mmHg' : '90/60 mmHg',
              time: timeStr,
              timestamp: now.getTime(),
              severity: systolic > 160 || systolic < 80 || diastolic > 100 || diastolic < 50 ? 'High' : 'Medium',
              trend: systolic > 140 ? 'increasing' : 'decreasing'
            });
          }

          // ML-generated alerts from backend
          if (p.mlInsights?.anomaly?.alerts) {
            p.mlInsights.anomaly.alerts.forEach((mlAlert, i) => {
              const exists = newAlerts.some(a => a.patientId === p.id && a.vital.toLowerCase().includes(mlAlert.vital?.replace('_', ' ')));
              if (!exists) {
                newAlerts.push({
                  id: `alert-${p.id}-ml-${i}`,
                  patientId: p.id,
                  patient: p.name,
                  vital: `ML: ${mlAlert.vital?.replace('_', ' ') || 'Anomaly'}`,
                  value: String(mlAlert.value || ''),
                  threshold: 'ML detected',
                  time: timeStr,
                  timestamp: now.getTime(),
                  severity: p.mlInsights.anomaly.severity === 'critical' ? 'High' : 'Medium',
                  trend: 'ML anomaly'
                });
              }
            });
          }
          // ML health risk alert
          if (p.mlInsights?.risk?.risk_level === 'High') {
            newAlerts.push({
              id: `alert-${p.id}-risk`,
              patientId: p.id,
              patient: p.name,
              vital: 'ML Health Risk',
              value: `${p.mlInsights.risk.risk_level} Risk`,
              threshold: 'ML prediction',
              time: timeStr,
              timestamp: now.getTime(),
              severity: 'High',
              trend: p.mlInsights.risk.risk_factors?.join(', ') || 'Multiple factors'
            });
          }
        });
        setVitalAlerts(newAlerts);
      }
    } catch (err) {
      console.error('Error fetching patients:', err);
    } finally {
      setIsLoadingPatients(false);
    }
  }, []);

  const fetchAppointments = useCallback(async () => {
    try {
      setIsLoadingAppointments(true);
      const res = await api.get('/appointments');
      if (res.data && res.data.success) {
        const mapped = res.data.appointments.map(a => {
          const u = a.userId || {};
          return {
            id: a._id,
            patient: u.firstName ? `${u.firstName} ${u.lastName}` : 'Patient',
            time: a.timeSlot || new Date(a.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            dateObj: new Date(a.date),
            type: a.type || 'Consultation',
            status: a.status === 'scheduled' ? 'Scheduled' : a.status === 'cancelled' ? 'Cancelled' : a.status === 'completed' ? 'Confirmed' : 'Pending',
            duration: '30 mins',
            priority: 'medium',
            raw: a
          };
        });
        setAppointments(mapped);
      }
    } catch (err) {
      console.error('Error fetching appointments:', err);
    } finally {
      setIsLoadingAppointments(false);
    }
  }, []);

  const fetchConsultations = useCallback(async () => {
    try {
      const res = await api.get('/consultations');
      if (res.data && res.data.success) {
        const mapped = res.data.data.map(c => {
          const u = c.userId || {};
          let requestedDisplay = 'Recently';
          if (c.requestedAt) {
            const reqDate = new Date(c.requestedAt);
            const today = new Date();
            const diffTime = Math.abs(today - reqDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
            if (diffDays === 1) requestedDisplay = 'Today';
            else if (diffDays === 2) requestedDisplay = 'Yesterday';
            else requestedDisplay = `${diffDays} days ago`;
          }

          return {
            id: c._id,
            patient: u.firstName ? `${u.firstName} ${u.lastName}` : 'Patient',
            type: c.type || 'General Consult',
            requested: requestedDisplay,
            priority: c.priority || 'Normal',
            status: c.status || 'pending',
            raw: c
          };
        });
        setPendingConsultations(mapped);
      }
    } catch (err) {
      console.error('Error fetching consultations:', err);
    }
  }, []);

  // Derive prescriptions, lab reports, telemedicine from real dynamic data
  useEffect(() => {
    if (patients.length > 0) {
      // Build prescriptions from all patients' medications
      const allPrescriptions = [];
      patients.forEach(p => {
        const raw = p.raw || {};
        if (raw.medications && raw.medications.length > 0) {
          raw.medications.forEach(med => {
            allPrescriptions.push({
              id: med._id || `med-${allPrescriptions.length}`,
              patient: p.name,
              patientId: p.id,
              medication: med.name,
              dosage: med.dosage,
              frequency: med.frequency === 'daily' ? 'Once daily' : med.frequency === 'twice-daily' ? 'Twice daily' : med.frequency === 'weekly' ? 'Weekly' : 'As needed',
              status: med.isActive ? 'Active' : 'Expired',
              refills: med.refillDate ? 1 : 0,
              prescribedBy: med.prescribedBy || 'Doctor',
              type: med.type,
              scheduledTime: med.scheduledTime,
              notes: med.notes,
              startDate: med.startDate,
              raw: med
            });
          });
        }
      });
      setPrescriptions(allPrescriptions);

      // Build lab reports from patients' completed appointments
      const allLabReports = [];
      patients.forEach(p => {
        const raw = p.raw || {};
        if (raw.appointments && raw.appointments.length > 0) {
          raw.appointments.forEach(appt => {
            allLabReports.push({
              id: appt._id || `lab-${allLabReports.length}`,
              patient: p.name,
              patientId: p.id,
              test: `${(appt.type || 'consultation').charAt(0).toUpperCase() + (appt.type || 'consultation').slice(1)} Report`,
              date: new Date(appt.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
              status: appt.status === 'completed' ? 'Normal' : appt.status === 'cancelled' ? 'Cancelled' : 'Pending',
              color: appt.status === 'completed' ? 'emerald' : appt.status === 'cancelled' ? 'rose' : 'amber',
              raw: appt
            });
          });
        }
      });
      setLabReports(allLabReports);

      // Build telemedicine sessions from video/audio appointments
      const allSessions = [];
      appointments.forEach(appt => {
        if (appt.type === 'video' || appt.type === 'audio' || appt.type === 'Video Consultation') {
          allSessions.push({
            id: appt.id,
            patient: appt.patient,
            time: appt.time,
            duration: appt.duration || '30 mins',
            status: appt.status,
            recording: appt.status === 'Confirmed' || appt.status === 'Completed',
            raw: appt
          });
        }
      });
      // If no video appointments exist, show upcoming appointments as sessions
      if (allSessions.length === 0 && appointments.length > 0) {
        appointments.slice(0, 3).forEach(appt => {
          allSessions.push({
            id: appt.id,
            patient: appt.patient,
            time: appt.time,
            duration: appt.duration || '30 mins',
            status: appt.status,
            recording: false,
            raw: appt
          });
        });
      }
      setTelemedicineSessions(allSessions);
    }
  }, [patients, appointments]);

  useEffect(() => {
    fetchPatients();
    fetchAppointments();
    fetchConsultations();
  }, [fetchPatients, fetchAppointments]);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await api.get('/notifications');
      if (res.data && res.data.success) {
        const typeMap = {
          meal_added: { icon: 'calendar', color: 'amber' },
          medication_added: { icon: 'pill', color: 'cyan' },
          meal_approved: { icon: 'activity', color: 'emerald' },
          meal_rejected: { icon: 'alert', color: 'red' },
          medication_approved: { icon: 'activity', color: 'green' },
          medication_rejected: { icon: 'alert', color: 'red' },
          assignment: { icon: 'bell', color: 'teal' },
          appointment: { icon: 'calendar', color: 'green' },
          general: { icon: 'bell', color: 'blue' },
          emergency: { icon: 'alert', color: 'red' }
        };
        const newNotifications = res.data.data.map(n => {
          const mapped = typeMap[n.type] || typeMap.general;
          return {
            id: n._id,
            type: n.type,
            title: n.title,
            message: n.message,
            time: new Date(n.createdAt).toLocaleString(),
            read: n.isRead,
            icon: mapped.icon,
            color: mapped.color
          };
        });

        setNotifications(prev => {
          // Compare if notifications have actually changed to prevent entire dashboard re-renders and animation loops
          if (
            prev.length === newNotifications.length &&
            prev.every((p, i) => p.id === newNotifications[i].id && p.read === newNotifications[i].read)
          ) {
            return prev;
          }
          return newNotifications;
        });
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const markNotificationRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (err) {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    }
  };

  const markAllNotificationsRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (err) {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    }
  };

  const clearNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const userName = localStorage.getItem('userFirstName') || 'Dr. Sarah Johnson';
  const userEmail = localStorage.getItem('userEmail') || 'sarah.johnson@hospital.com';
  const userRole = localStorage.getItem('userRole') || 'doctor';
  const specialty = localStorage.getItem('userSpecialty') || 'Cardiology Specialist';

  // Get role-based dashboard name
  const getDashboardName = () => {
    const roleNames = {
      'elderly': 'Elderly Health & Wellness Dashboard',
      'family': 'Family Care Dashboard',
      'doctor': 'Medical Professional Dashboard',
      'caretaker': 'Caregiver Management Dashboard',
      'admin': 'Administration Dashboard'
    };
    return roleNames[userRole] || 'Doctor Dashboard';
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

  // Handle dark mode toggle
  const handleDarkModeToggle = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (onToggleDarkMode) {
      onToggleDarkMode();
    }
  };

  // Enhanced Animated Components - Defined inside Doctor component to access isDarkMode

  // Glass Card Component - Fixed to accept isDarkMode as prop

  // Navigation modules for Doctor
  const modules = [
    { id: 'dashboard', name: 'Doctor Home', icon: <Home size={22} />, color: 'blue', notification: 0 },
    { id: 'patients', name: 'My Patients', icon: <Users size={22} />, color: 'emerald', notification: patients.length },
    { id: 'appointments', name: 'Appointments', icon: <Calendar size={22} />, color: 'purple', notification: appointments.filter(a => new Date(a.dateObj).toDateString() === new Date().toDateString()).length },
    { id: 'medical-history', name: 'Medical History', icon: <FileText size={22} />, color: 'indigo', notification: 0 },
    { id: 'prescriptions', name: 'Prescriptions', icon: <Pill size={22} />, color: 'cyan', notification: prescriptions.filter(p => p.status === 'Active').length },
    { id: 'lab-reports', name: 'Lab Reports', icon: <ClipboardCheck size={22} />, color: 'green', notification: labReports.length },
    { id: 'alerts', name: 'Vital Alerts', icon: <AlertCircle size={22} />, color: 'red', notification: vitalAlerts.length },
    { id: 'analytics', name: 'Analytics', icon: <BarChart3 size={22} />, color: 'violet', notification: 0 },
    { id: 'settings', name: 'Settings', icon: <Settings size={22} />, color: 'indigo', notification: 0 },
  ];

  // Enhanced Animated Chart Component - Fixed to access isDarkMode

  // Beautiful Eye-catching Footer Component

  // Enhanced Video Call Component

  // Enhanced Patient Profile Component

  // Enhanced My Patients Component

  // Enhanced Appointments Component

  // Enhanced Telemedicine Component

  // Enhanced Consultations Component

  // Enhanced Medical History Component

  // Enhanced Prescriptions Component

  // Enhanced Lab Reports Component

  // Enhanced Vital Alerts Component

  // Enhanced Analytics Component

  // Render different modules based on selection

  const renderModuleContent = () => {
    const moduleProps = {
      isDarkMode, setActiveModule, showToast,
      patients, appointments, pendingConsultations, prescriptions,
      labReports, vitalAlerts, telemedicineSessions,
      selectedPatient, setSelectedPatient,
      isVideoCallActive, setIsVideoCallActive,
      searchQuery, setSearchQuery,
      patientsFilter, setPatientsFilter,
      patientsSortBy, setPatientsSortBy,
      fetchPatients, fetchAppointments, fetchConsultations,
      generatePatientPDF, userName, specialty,
    };

    if (isVideoCallActive) {
      return <VideoCall {...moduleProps} />;
    }
    if (selectedPatient) {
      return <PatientProfile {...moduleProps} patient={selectedPatient} onBack={() => setSelectedPatient(null)} />;
    }

    switch(activeModule) {
      case 'dashboard':
        return <DoctorHome {...moduleProps} />;
      case 'patients':
        return <MyPatients {...moduleProps} />;
      case 'appointments':
        return <Appointments {...moduleProps} />;
      case 'medical-history':
        return <MedicalHistory {...moduleProps} />;
      case 'prescriptions':
        return <Prescriptions {...moduleProps} />;
      case 'lab-reports':
        return <LabReports {...moduleProps} />;
      case 'alerts':
        return <VitalAlerts {...moduleProps} />;
      case 'analytics':
        return <DoctorAnalytics {...moduleProps} />;
      case 'settings':
        return (
          <>
            <SettingsPage isDarkMode={isDarkMode} />
            <BeautifulFooter isDarkMode={isDarkMode} setActiveModule={setActiveModule} />
          </>
        );
      default:
        return (
          <>
            <div className={`rounded-xl p-6 backdrop-blur-xl ${
              isDarkMode ? 'bg-gray-900/50 border border-gray-800/50' : 'bg-white/80 border border-gray-200/50'
            }`}>
              <h2 className={`text-xl font-bold mb-3 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                {modules.find(m => m.id === activeModule)?.name || activeModule}
              </h2>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Coming soon...</p>
            </div>
            <BeautifulFooter isDarkMode={isDarkMode} setActiveModule={setActiveModule} />
          </>
        );
    }
  };


  if (showSplash) {
    return (
      <SplashScreen 
        userRole={userRole}
        userName={userName}
        isDarkMode={isDarkMode}
        onFinish={() => { sessionStorage.setItem('doctor-splash-shown', 'true'); setShowSplash(false); }}
      />
    );
  }

  return (
    <div className={`h-screen w-full overflow-hidden transition-all duration-500 ${
      isDarkMode 
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
        notifications={notifications}
        onMarkNotificationRead={markNotificationRead}
        onMarkAllRead={markAllNotificationsRead}
        onClearNotification={clearNotification}
      />

      {/* Global Toast Notification */}
      <GlobalToast isDarkMode={isDarkMode} />

      <div className="flex relative h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <div className={`transition-all duration-300 flex flex-col fixed lg:relative z-40 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${isDarkMode ? 'bg-gray-950/95' : 'bg-white/95'} backdrop-blur-xl h-[calc(100vh-5rem)] w-56 md:w-64 lg:w-56 xl:w-64 border-r ${
          isDarkMode ? 'border-gray-800' : 'border-gray-200'
        }`}>
          {/* Sidebar Header */}
          <div className="p-3 border-b border-gray-800/50 flex-shrink-0 relative">
            <div className="flex items-center gap-2 mb-3">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center overflow-hidden ${
                isDarkMode ? 'bg-blue-950/40' : 'bg-gradient-to-r from-blue-100 to-cyan-100'
              }`}>
                {userPhoto ? (
                  <img src={userPhoto} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <Stethoscope className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} size={18} />
                )}
              </div>
              <div>
                <h2 className={`font-bold text-sm ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                  {userName}
                </h2>
                <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                  {specialty}
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
          <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-hide mb-16">
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

          {/* Sidebar Footer */}
          <div className="p-3 border-t border-gray-800/50 flex-shrink-0 sticky bottom-0 bg-inherit">
            <div className={`text-center p-2 rounded-lg transition-all duration-300 hover:scale-105 cursor-pointer ${
              isDarkMode ? 'bg-gray-900/40 hover:bg-gray-800/40' : 'bg-blue-50/50 hover:bg-blue-100/50'
            }`}>
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className={`text-xs font-medium ${isDarkMode ? 'text-emerald-300' : 'text-emerald-700'}`}>
                  System Active
                </span>
              </div>
              <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                24/7 Patient Monitoring
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className={`flex-1 transition-all duration-300 overflow-y-auto overflow-x-hidden ${
          isSidebarOpen ? 'ml-0 lg:ml-0' : 'ml-0'
        }`}>
          <main className="p-4 sm:p-6 animate-fade-in">
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

export default Doctor;