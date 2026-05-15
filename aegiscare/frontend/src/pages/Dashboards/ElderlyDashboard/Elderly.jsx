import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Heart, Activity, Calendar, Pill, Users, Bell, 
  Clock, AlertCircle, Battery, Thermometer, Brain,
  Video, MessageCircle, Phone, Shield, TrendingUp,
  Award, Target, Zap, Sunrise, Moon, Activity as ActivityIcon,
  HeartPulse, Stethoscope, FileText, Settings, HelpCircle,
  Home, BarChart3, Gamepad2, Utensils, ShieldAlert,
  Download, BrainCircuit, Apple, Clock3, CalendarDays,
  User, LogOut, Menu, X, ChevronRight, ThermometerSun,
  ClipboardList, Soup, Dumbbell, Headphones, ActivitySquare,
  LineChart, BedDouble, Syringe, ClipboardCheck, FileHeart, 
  TrendingDown, Droplets, Gauge, Flame, BatteryCharging, Cpu,
  Mail,History,  PhoneCall, MapPin, Facebook, Twitter, Instagram, Linkedin,
  HeartHandshake, Sparkles, ShieldCheck, Wind, 
   Star, Gem, Eye, Search, ArrowLeft, Bookmark, Share2, Printer, ChevronDown, ChevronUp,
  Sun, Database, Award as AwardIcon, Plus, Check, Play, Pause, RotateCcw, Trophy, Square, RefreshCw,
  BellRing, Trash2, Info, Smartphone, Volume2, Glasses, Timer, StopCircle, SkipForward, MapPinned
} from 'lucide-react';
import SplashScreen from '../../../components/SplashScreen';
import DashboardNavbar from '../../../components/DashboardsNavbar';
import SettingsPage from '../../../components/SettingsPage';
import api from '../../../services/api';
import { assessCognitive, recommendNutrition } from '../../../services/mlService';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { LineChart as RLineChart, Line, AreaChart as RAreaChart, Area, BarChart as RBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip, ResponsiveContainer, RadialBarChart, RadialBar, Legend, ComposedChart } from 'recharts';

import { getColorGradientDark, getColorGradientLight, getColorClass } from './helpers';
import BeautifulFooter from './components/BeautifulFooter';
import DashboardHome from './components/DashboardHome';
import VitalsMonitoring from './components/VitalsMonitoring';
import HealthReports from './components/HealthReports';
import CognitiveActivities from './components/CognitiveActivities';
import DietPlan from './components/DietPlan';
import MedicationManagement from './components/MedicationManagement';
import PanicButton from './components/PanicButton';
import TelemedicineSchedule from './components/TelemedicineSchedule';
import VREngagement from './components/VREngagement';
const Elderly = ({ isDarkMode: propIsDarkMode, onToggleDarkMode, onLogout }) => {
  const [showSplash, setShowSplash] = useState(() => {
    const splashShown = sessionStorage.getItem('elderly-splash-shown');
    return !splashShown;
  });
  const [isDarkMode, setIsDarkMode] = useState(propIsDarkMode || false);
  const [activeMetric, setActiveMetric] = useState('heart');
  const [activeModule, setActiveModule] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [userPhoto, setUserPhoto] = useState('');
  const [assignedCaregivers, setAssignedCaregivers] = useState([]);
  const assignedCaregiversRef = useRef([]);

  // Fetch true dynamic profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/auth/profile');
        if (res.data && res.data.success && res.data.user) {
          const caregivers = res.data.user.assignedCaregivers || [];
          setAssignedCaregivers(caregivers);
          assignedCaregiversRef.current = caregivers;
        }
      } catch (err) {
        console.error('Failed to fetch profile info', err);
      }
    };
    fetchProfile();
  }, []);

  // ===== Notification System (Real API) =====
  const [notifications, setNotifications] = useState([]);

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
          emergency: { icon: 'alert', color: 'red' },
          general: { icon: 'bell', color: 'blue' }
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

  const addNotification = (notif) => {
    const now = new Date();
    const time = `${now.getHours() % 12 || 12}:${String(now.getMinutes()).padStart(2, '0')} ${now.getHours() >= 12 ? 'PM' : 'AM'}`;
    setNotifications(prev => [{ id: Date.now(), time, read: false, icon: 'bell', color: 'blue', ...notif }, ...prev]);
  };

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
  const [reportPeriod, setReportPeriod] = useState('24h');
  const [reportDropdownOpen, setReportDropdownOpen] = useState(false);
  const [showAIInsights, setShowAIInsights] = useState(false);
  const [vitalCardModal, setVitalCardModal] = useState({ open: false, key: null, tab: 'details' });
  const [showHealthTrends, setShowHealthTrends] = useState(false);
  const [reportStartDate, setReportStartDate] = useState('');
  const [reportEndDate, setReportEndDate] = useState('');
  const [selectedReportType, setSelectedReportType] = useState('PDF Report');
  const [showAllReports, setShowAllReports] = useState(false);
  const [viewingReport, setViewingReport] = useState(null);
  const [reportsFilter, setReportsFilter] = useState('All');
  const [reportsSearchQuery, setReportsSearchQuery] = useState('');

  // All reports data
  const allReportsData = [
    { id: 1, name: 'Monthly Summary', date: 'Nov 2024', fullDate: '2024-11-15', type: 'PDF', size: '2.4 MB', icon: 'FileHeart', category: 'Summary', doctor: 'Dr. Sarah Johnson', status: 'Complete', description: 'Comprehensive monthly summary of all vital signs, medication adherence, and activity levels.', metrics: { heartRate: '72 BPM avg', bp: '120/80 mmHg', glucose: '108 mg/dL', sleep: '7.2 hrs avg' }},
    { id: 2, name: 'Cardiology Review', date: 'Oct 2024', fullDate: '2024-10-22', type: 'PDF', size: '3.1 MB', icon: 'Heart', category: 'Specialist', doctor: 'Dr. Michael Chen', status: 'Complete', description: 'Detailed cardiology assessment including ECG analysis, heart rate variability, and blood pressure trends.', metrics: { heartRate: '70 BPM avg', bp: '118/78 mmHg', ecg: 'Normal Sinus', cholesterol: '185 mg/dL' }},
    { id: 3, name: 'Medication Log', date: 'Sep 2024', fullDate: '2024-09-30', type: 'Excel', size: '1.8 MB', icon: 'Pill', category: 'Medication', doctor: 'Dr. Sarah Johnson', status: 'Complete', description: 'Complete medication adherence log including dosage tracking, side effects, and refill schedule.', metrics: { adherence: '94%', medications: '5 active', missed: '3 doses', nextRefill: 'Oct 15' }},
    { id: 4, name: 'Sleep Analysis', date: 'Aug 2024', fullDate: '2024-08-28', type: 'PDF', size: '2.7 MB', icon: 'BedDouble', category: 'Wellness', doctor: 'Dr. Emily Parker', status: 'Complete', description: 'In-depth sleep pattern analysis with REM cycles, sleep quality scoring, and improvement recommendations.', metrics: { avgSleep: '7.5 hrs', quality: '82%', remCycles: '4.2 avg', deepSleep: '1.8 hrs' }},
    { id: 5, name: 'Blood Work Results', date: 'Aug 2024', fullDate: '2024-08-15', type: 'PDF', size: '1.5 MB', icon: 'Droplets', category: 'Lab Results', doctor: 'Dr. Michael Chen', status: 'Complete', description: 'Complete blood panel results including CBC, metabolic panel, lipid profile, and thyroid function.', metrics: { wbc: '6.2 K/uL', rbc: '4.8 M/uL', hemoglobin: '14.2 g/dL', platelets: '245 K/uL' }},
    { id: 6, name: 'Cognitive Assessment', date: 'Jul 2024', fullDate: '2024-07-20', type: 'PDF', size: '2.1 MB', icon: 'Brain', category: 'Cognitive', doctor: 'Dr. Emily Parker', status: 'Complete', description: 'Quarterly cognitive health evaluation including memory tests, reaction time, and brain fitness scoring.', metrics: { brainScore: '86/100', memory: '88%', reaction: '320ms', improvement: '+5%' }},
    { id: 7, name: 'Nutrition Report', date: 'Jul 2024', fullDate: '2024-07-10', type: 'PDF', size: '1.9 MB', icon: 'Apple', category: 'Wellness', doctor: 'Dr. Sarah Johnson', status: 'Complete', description: 'Dietary analysis with calorie tracking, macro/micronutrient breakdown, and meal plan recommendations.', metrics: { calories: '1,850 avg', protein: '65g/day', hydration: '2.1L/day', fiber: '28g/day' }},
    { id: 8, name: 'Quarterly Health Review', date: 'Jun 2024', fullDate: '2024-06-30', type: 'PDF', size: '4.2 MB', icon: 'ClipboardCheck', category: 'Summary', doctor: 'Dr. Michael Chen', status: 'Complete', description: 'Full quarterly health review covering all vital signs, lab results, medications, and care plan updates.', metrics: { overallScore: '91/100', vitals: 'Stable', medications: 'Optimized', nextReview: 'Sep 2024' }},
    { id: 9, name: 'Physical Therapy Log', date: 'Jun 2024', fullDate: '2024-06-15', type: 'Excel', size: '1.3 MB', icon: 'Dumbbell', category: 'Wellness', doctor: 'Dr. James Wilson', status: 'Complete', description: 'Physical therapy session records with exercise progress, mobility assessments, and pain tracking.', metrics: { sessions: '12 completed', mobility: '+15%', strength: '+10%', painLevel: '2/10' }},
    { id: 10, name: 'Annual Checkup Summary', date: 'May 2024', fullDate: '2024-05-20', type: 'PDF', size: '5.1 MB', icon: 'Stethoscope', category: 'Summary', doctor: 'Dr. Sarah Johnson', status: 'Complete', description: 'Comprehensive annual health checkup report with all screenings, immunizations, and preventive care.', metrics: { screenings: 'All clear', immunizations: 'Up to date', bmi: '24.2', risk: 'Low' }},
    { id: 11, name: 'Mental Health Check', date: 'Apr 2024', fullDate: '2024-04-18', type: 'PDF', size: '1.7 MB', icon: 'HeartHandshake', category: 'Wellness', doctor: 'Dr. Emily Parker', status: 'Complete', description: 'Mental health screening and wellness assessment including mood tracking and stress evaluation.', metrics: { moodScore: '8/10', stress: 'Low', anxiety: 'Minimal', socialActivity: 'Active' }},
    { id: 12, name: 'Prescription Update', date: 'Mar 2024', fullDate: '2024-03-25', type: 'PDF', size: '0.8 MB', icon: 'Syringe', category: 'Medication', doctor: 'Dr. Michael Chen', status: 'Complete', description: 'Updated prescription list with dosage adjustments, new medications, and pharmacy instructions.', metrics: { changes: '2 adjusted', newMeds: '1 added', removed: '0', interactions: 'None' }},
  ];

  const getReportIcon = (iconName) => {
    const icons = { FileHeart: <FileHeart className="w-5 h-5" />, Heart: <Heart className="w-5 h-5" />, Pill: <Pill className="w-5 h-5" />, BedDouble: <BedDouble className="w-5 h-5" />, Droplets: <Droplets className="w-5 h-5" />, Brain: <Brain className="w-5 h-5" />, Apple: <Apple className="w-5 h-5" />, ClipboardCheck: <ClipboardCheck className="w-5 h-5" />, Dumbbell: <Dumbbell className="w-5 h-5" />, Stethoscope: <Stethoscope className="w-5 h-5" />, HeartHandshake: <HeartHandshake className="w-5 h-5" />, Syringe: <Syringe className="w-5 h-5" /> };
    return icons[iconName] || <FileText className="w-5 h-5" />;
  };

  const downloadSingleReport = (report) => {
    const doc = new jsPDF();
    doc.setFillColor(0, 188, 212);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.text(report.name, 15, 22);
    doc.setFontSize(10);
    doc.text(`Generated: ${report.date} | Type: ${report.type} | Doctor: ${report.doctor}`, 15, 32);
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.text('Report Details', 15, 55);
    doc.setFontSize(10);
    const descLines = doc.splitTextToSize(report.description, 180);
    doc.text(descLines, 15, 65);
    doc.setFontSize(14);
    doc.text('Key Metrics', 15, 85);
    const metricsData = Object.entries(report.metrics).map(([key, value]) => [key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase()), value]);
    autoTable(doc, { startY: 90, head: [['Metric', 'Value']], body: metricsData, theme: 'grid', headStyles: { fillColor: [0, 188, 212], textColor: [255, 255, 255] }, styles: { fontSize: 10, cellPadding: 5 }, alternateRowStyles: { fillColor: [240, 248, 255] } });
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text('AegisCare Health Report - Generated automatically', 15, doc.internal.pageSize.height - 10);
    doc.save(`${report.name.replace(/\s+/g, '_')}_${report.date.replace(/\s+/g, '_')}.pdf`);
  };

  const filteredReports = allReportsData.filter(r => {
    const matchesFilter = reportsFilter === 'All' || r.category === reportsFilter || r.type === reportsFilter;
    const matchesSearch = r.name.toLowerCase().includes(reportsSearchQuery.toLowerCase()) || r.doctor.toLowerCase().includes(reportsSearchQuery.toLowerCase()) || r.category.toLowerCase().includes(reportsSearchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // ===== ML Insights State =====
  const [cognitiveAssessment, setCognitiveAssessment] = useState(null);
  const [cognitiveLoading, setCognitiveLoading] = useState(false);
  const [nutritionRecs, setNutritionRecs] = useState([]);
  const [nutritionLoading, setNutritionLoading] = useState(false);
  const [healthRisk, setHealthRisk] = useState(null);
  const [healthRiskLoading, setHealthRiskLoading] = useState(false);
  const [anomalyResult, setAnomalyResult] = useState(null);
  const [liveVitals, setLiveVitals] = useState(null);  // Dynamic vitals from backend

  // ===== Cognitive & Physical Activities State =====
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [activeGame, setActiveGame] = useState(null); // { type: 'memory' | 'pattern' | 'reaction' | 'wordrecall' }
  const [activeExercise, setActiveExercise] = useState(null); // exercise object
  const [exerciseTimer, setExerciseTimer] = useState(0);
  const [exerciseRunning, setExerciseRunning] = useState(false);
  const [exerciseCompleted, setExerciseCompleted] = useState(false);

  // Memory Matrix game state
  const [memoryGrid, setMemoryGrid] = useState([]);
  const [memoryShowPhase, setMemoryShowPhase] = useState(true);
  const [memoryPlayerPicks, setMemoryPlayerPicks] = useState([]);
  const [memoryLevel, setMemoryLevel] = useState(1);
  const [memoryScore, setMemoryScore] = useState(0);
  const [memoryGameOver, setMemoryGameOver] = useState(false);
  const [memoryTimer, setMemoryTimer] = useState(0);
  const [memoryRunning, setMemoryRunning] = useState(false);

  // Pattern Puzzles game state
  const [patternSequence, setPatternSequence] = useState([]);
  const [patternOptions, setPatternOptions] = useState([]);
  const [patternAnswer, setPatternAnswer] = useState(null);
  const [patternLevel, setPatternLevel] = useState(1);
  const [patternScore, setPatternScore] = useState(0);
  const [patternGameOver, setPatternGameOver] = useState(false);
  const [patternFeedback, setPatternFeedback] = useState(null);
  const [patternTimer, setPatternTimer] = useState(0);
  const [patternRunning, setPatternRunning] = useState(false);

  // Reaction Master state
  const [reactionPhase, setReactionPhase] = useState('waiting'); // waiting, ready, go, result
  const [reactionStartTime, setReactionStartTime] = useState(0);
  const [reactionTime, setReactionTime] = useState(0);
  const [reactionBest, setReactionBest] = useState(999);
  const [reactionRound, setReactionRound] = useState(0);
  const [reactionScores, setReactionScores] = useState([]);

  // Word Recall state
  const [wordRecallWords, setWordRecallWords] = useState([]);
  const [wordRecallShowPhase, setWordRecallShowPhase] = useState(true);
  const [wordRecallInput, setWordRecallInput] = useState('');
  const [wordRecallGuesses, setWordRecallGuesses] = useState([]);
  const [wordRecallLevel, setWordRecallLevel] = useState(1);
  const [wordRecallScore, setWordRecallScore] = useState(0);
  const [wordRecallGameOver, setWordRecallGameOver] = useState(false);
  const [wordRecallTimer, setWordRecallTimer] = useState(0);
  const [wordRecallRunning, setWordRecallRunning] = useState(false);

  // Schedule & Reminders
  const [scheduleItems, setScheduleItems] = useState([
    { id: 0, time: '9:00 AM', activity: 'Morning Memory Game', type: 'Cognitive', status: 'Completed', color: 'purple', gameType: 'memory', duration: '15 min', difficulty: 'Medium', description: 'Train your brain with memory matching exercises. Memorize the highlighted pattern and reproduce it from memory.', benefits: ['Improves short-term memory', 'Enhances pattern recognition', 'Boosts concentration'], completedAt: '9:18 AM', score: 7 },
    { id: 1, time: '2:00 PM', activity: 'Afternoon Yoga', type: 'Physical', status: 'Upcoming', color: 'teal', exerciseType: 'yoga', duration: '20 min', difficulty: 'Easy', description: 'Gentle yoga flow designed for seniors. Improve flexibility, balance, and mental peace with guided poses.', benefits: ['Increases flexibility', 'Reduces stress', 'Improves balance'], completedAt: null, score: null },
    { id: 2, time: '4:00 PM', activity: 'Pattern Puzzle', type: 'Cognitive', status: 'Pending', color: 'pink', gameType: 'pattern', duration: '10 min', difficulty: 'Hard', description: 'Challenge your logical thinking with number sequence puzzles. Find the hidden pattern and predict the next number.', benefits: ['Strengthens logical thinking', 'Improves problem solving', 'Enhances analytical skills'], completedAt: null, score: null },
    { id: 3, time: '7:00 PM', activity: 'Evening Stretching', type: 'Physical', status: 'Upcoming', color: 'blue', exerciseType: 'stretching', duration: '15 min', difficulty: 'Easy', description: 'End your day with relaxing stretches. Relieve muscle tension and prepare your body for restful sleep.', benefits: ['Relieves muscle tension', 'Promotes better sleep', 'Reduces stiffness'], completedAt: null, score: null },
  ]);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [scheduleReminders, setScheduleReminders] = useState({
    0: { enabled: false, minutesBefore: 15, type: 'push' },
    1: { enabled: false, minutesBefore: 15, type: 'push' },
    2: { enabled: false, minutesBefore: 15, type: 'push' },
    3: { enabled: false, minutesBefore: 15, type: 'push' },
  });
  const [scheduleDetailItem, setScheduleDetailItem] = useState(null);
  const [reminderSaved, setReminderSaved] = useState(false);

  // Panic/SOS states
  const [sosHolding, setSosHolding] = useState(false);
  const [sosProgress, setSosProgress] = useState(0);
  const [sosTriggered, setSosTriggered] = useState(false);
  const [sosNotifications, setSosNotifications] = useState([]);
  const [sosCooldown, setSosCooldown] = useState(false);

  // SOS hold timer
  useEffect(() => {
    let interval;
    if (sosHolding && !sosTriggered && !sosCooldown) {
      interval = setInterval(() => {
        setSosProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setSosHolding(false);
            setSosTriggered(true);
            setSosCooldown(true);
            // Send notifications only if not already present in the last 10 minutes
            const now = new Date();
            const timeStr = `${now.getHours() % 12 || 12}:${String(now.getMinutes()).padStart(2, '0')} ${now.getHours() >= 12 ? 'PM' : 'AM'}`;
            setSosNotifications([
              { to: 'Emergency Services (911)', status: 'Sent', time: timeStr, icon: 'phone' },
              { to: 'Dr. Sarah Johnson (Primary Doctor)', status: 'Delivered', time: timeStr, icon: 'doctor' },
              { to: 'Ahmed Khan (Caretaker)', status: 'Delivered', time: timeStr, icon: 'caretaker' },
              { to: 'Family Group (3 members)', status: 'Delivered', time: timeStr, icon: 'family' },
            ]);
            setNotifications(prev => {
              // Only add if not already present in last 10 minutes
              const already = prev.find(n => n.type === 'emergency' && n.title === 'Emergency SOS Triggered' && !n.read && n.time === timeStr);
              if (already) return prev;
              return [{ id: Date.now(), type: 'emergency', title: 'Emergency SOS Triggered', message: 'Alert sent to emergency contacts, doctor, and caretaker', time: timeStr, read: false, icon: 'alert', color: 'red' }, ...prev];
            });

            // Send real API notifications to the caregivers using the securely tracked ref
            assignedCaregiversRef.current.forEach(async (caretakerId) => {
              try {
                await api.post('/notifications', {
                  recipientId: caretakerId,
                  type: 'emergency',
                  title: 'CRITICAL: MEDICAL EMERGENCY',
                  message: `Immediate assistance required for ${userName}. SOS button triggered.`
                });
              } catch (err) {
                console.error('Error sending emergency notification to caretaker', err);
              }
            });

            return 100;
          }
          return prev + 100 / 30; // 30 intervals over 3 seconds
        });
      }, 100);
    } else if (!sosHolding && !sosTriggered) {
      setSosProgress(0);
    }
    return () => clearInterval(interval);
  }, [sosHolding, sosTriggered, sosCooldown]);

  // VR Engagement states
  const [vrExperiences] = useState([
    { id: 0, name: 'Virtual Museum Tour', duration: '30 mins', durationSec: 1800, category: 'Educational', color: 'purple', description: 'Explore world museums from home', benefits: ['Memory Stimulation', 'Cultural Learning'], scenes: ['Louvre Gallery', 'Egyptian Exhibit', 'Modern Art Wing', 'Sculpture Garden'], difficulty: 'Easy', rating: 4.8 },
    { id: 1, name: 'Memory Garden Walk', duration: '20 mins', durationSec: 1200, category: 'Relaxation', color: 'emerald', description: 'Peaceful garden for mindfulness', benefits: ['Stress Relief', 'Focus'], scenes: ['Cherry Blossom Path', 'Zen Rock Garden', 'Lotus Pond', 'Bamboo Grove'], difficulty: 'Easy', rating: 4.9 },
    { id: 2, name: 'Brain Training Games', duration: '25 mins', durationSec: 1500, category: 'Cognitive', color: 'blue', description: 'Interactive puzzles and challenges', benefits: ['Problem Solving', 'Reaction'], scenes: ['Number Maze', 'Color Match Arena', 'Shape Builder', 'Logic Challenge'], difficulty: 'Medium', rating: 4.7 },
    { id: 3, name: 'Virtual Travel', duration: '45 mins', durationSec: 2700, category: 'Entertainment', color: 'amber', description: 'Visit world landmarks virtually', benefits: ['Exploration', 'Joy'], scenes: ['Eiffel Tower', 'Grand Canyon', 'Great Wall of China', 'Northern Lights'], difficulty: 'Easy', rating: 4.6 },
    { id: 4, name: 'Meditation Space', duration: '15 mins', durationSec: 900, category: 'Wellness', color: 'teal', description: 'Guided meditation in peaceful VR', benefits: ['Calmness', 'Breathing'], scenes: ['Mountain Peak', 'Ocean Shore', 'Forest Clearing', 'Starlit Temple'], difficulty: 'Easy', rating: 4.9 },
    { id: 5, name: 'Puzzle Rooms', duration: '35 mins', durationSec: 2100, category: 'Problem Solving', color: 'pink', description: 'Escape room style challenges', benefits: ['Logic', 'Teamwork'], scenes: ['Ancient Tomb', 'Space Station', 'Underwater Lab', 'Clockwork Tower'], difficulty: 'Hard', rating: 4.5 },
  ]);
  const [activeVRSession, setActiveVRSession] = useState(null);
  const [vrSessionTimer, setVrSessionTimer] = useState(0);
  const [vrSessionRunning, setVrSessionRunning] = useState(false);
  const [vrCurrentScene, setVrCurrentScene] = useState(0);
  const [vrSessionCompleted, setVrSessionCompleted] = useState(false);
  const [showVRHistory, setShowVRHistory] = useState(false);
  const [vrHistory, setVrHistory] = useState([
    { id: 1, name: 'Virtual Museum Tour', date: 'Mar 14, 2026', duration: '28:45', score: 92, scenes: 4, category: 'Educational', color: 'purple' },
    { id: 2, name: 'Meditation Space', date: 'Mar 13, 2026', duration: '15:00', score: 88, scenes: 4, category: 'Wellness', color: 'teal' },
    { id: 3, name: 'Brain Training Games', date: 'Mar 12, 2026', duration: '22:30', score: 76, scenes: 3, category: 'Cognitive', color: 'blue' },
    { id: 4, name: 'Memory Garden Walk', date: 'Mar 11, 2026', duration: '20:00', score: 95, scenes: 4, category: 'Relaxation', color: 'emerald' },
    { id: 5, name: 'Virtual Travel', date: 'Mar 10, 2026', duration: '40:15', score: 85, scenes: 4, category: 'Entertainment', color: 'amber' },
    { id: 6, name: 'Puzzle Rooms', date: 'Mar 9, 2026', duration: '32:10', score: 70, scenes: 3, category: 'Problem Solving', color: 'pink' },
    { id: 7, name: 'Brain Training Games', date: 'Mar 8, 2026', duration: '25:00', score: 82, scenes: 4, category: 'Cognitive', color: 'blue' },
    { id: 8, name: 'Meditation Space', date: 'Mar 7, 2026', duration: '15:00', score: 90, scenes: 4, category: 'Wellness', color: 'teal' },
    { id: 9, name: 'Memory Garden Walk', date: 'Mar 6, 2026', duration: '18:30', score: 91, scenes: 3, category: 'Relaxation', color: 'emerald' },
    { id: 10, name: 'Virtual Museum Tour', date: 'Mar 5, 2026', duration: '30:00', score: 88, scenes: 4, category: 'Educational', color: 'purple' },
    { id: 11, name: 'Puzzle Rooms', date: 'Mar 4, 2026', duration: '35:00', score: 74, scenes: 4, category: 'Problem Solving', color: 'pink' },
    { id: 12, name: 'Virtual Travel', date: 'Mar 3, 2026', duration: '44:00', score: 80, scenes: 3, category: 'Entertainment', color: 'amber' },
  ]);
  const [vrStats, setVrStats] = useState({ totalSessions: 12, cognitiveScore: 24, weeklyGoal: 3 });

  const startVRSession = (exp) => {
    setActiveVRSession(exp);
    setVrSessionTimer(0);
    setVrSessionRunning(false);
    setVrCurrentScene(0);
    setVrSessionCompleted(false);
  };

  const completeVRSession = () => {
    if (!activeVRSession) return;
    const mins = Math.floor(vrSessionTimer / 60);
    const secs = vrSessionTimer % 60;
    const score = Math.min(100, Math.round(60 + Math.random() * 35));
    setVrHistory(prev => [{ id: prev.length + 1, name: activeVRSession.name, date: 'Mar 15, 2026', duration: `${mins}:${String(secs).padStart(2, '0')}`, score, scenes: vrCurrentScene + 1, category: activeVRSession.category, color: activeVRSession.color }, ...prev]);
    setVrStats(prev => ({ totalSessions: prev.totalSessions + 1, cognitiveScore: prev.cognitiveScore + Math.round(Math.random() * 3), weeklyGoal: Math.min(5, prev.weeklyGoal + 1) }));
    setVrSessionCompleted(true);
    setVrSessionRunning(false);
  };

  // VR session timer
  useEffect(() => {
    let interval;
    if (vrSessionRunning && activeVRSession) {
      interval = setInterval(() => {
        setVrSessionTimer(prev => {
          if (prev >= activeVRSession.durationSec) {
            clearInterval(interval);
            completeVRSession();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [vrSessionRunning, activeVRSession]);

  // Activity progress data
  const [activityProgress, setActivityProgress] = useState({
    memory: { played: 12, bestScore: 8, avgScore: 5.2, progress: 75, streak: 3 },
    pattern: { played: 8, bestScore: 6, avgScore: 3.8, progress: 45, streak: 2 },
    reaction: { played: 15, bestTime: 245, avgTime: 320, progress: 30, streak: 5 },
    wordrecall: { played: 10, bestScore: 7, avgScore: 4.5, progress: 60, streak: 4 },
    yoga: { sessions: 8, totalMins: 160, calories: 960, progress: 70 },
    chair: { sessions: 12, totalMins: 180, calories: 1020, progress: 85 },
    balance: { sessions: 6, totalMins: 108, calories: 570, progress: 55 },
    breathing: { sessions: 15, totalMins: 180, calories: 900, progress: 90 },
  });

  // ===== Memory Matrix Game Logic =====
  const startMemoryGame = useCallback(() => {
    const gridSize = 16;
    const highlightCount = 3 + memoryLevel;
    const highlighted = [];
    while (highlighted.length < Math.min(highlightCount, gridSize)) {
      const idx = Math.floor(Math.random() * gridSize);
      if (!highlighted.includes(idx)) highlighted.push(idx);
    }
    setMemoryGrid(highlighted);
    setMemoryShowPhase(true);
    setMemoryPlayerPicks([]);
    setMemoryGameOver(false);
    setMemoryRunning(true);
    setTimeout(() => setMemoryShowPhase(false), 1500 + memoryLevel * 300);
  }, [memoryLevel]);

  const handleMemoryCellClick = useCallback((idx) => {
    if (memoryShowPhase || memoryGameOver) return;
    if (memoryPlayerPicks.includes(idx)) return;
    const newPicks = [...memoryPlayerPicks, idx];
    setMemoryPlayerPicks(newPicks);
    if (!memoryGrid.includes(idx)) {
      setMemoryGameOver(true);
      setMemoryRunning(false);
      setActivityProgress(prev => ({ ...prev, memory: { ...prev.memory, played: prev.memory.played + 1 } }));
      runCognitiveAssessment({ memory: memoryScore });
    } else if (newPicks.filter(p => memoryGrid.includes(p)).length === memoryGrid.length) {
      const newScore = memoryScore + memoryLevel * 10;
      setMemoryScore(newScore);
      setMemoryLevel(prev => prev + 1);
      setActivityProgress(prev => ({
        ...prev, memory: { ...prev.memory, bestScore: Math.max(prev.memory.bestScore, newScore), progress: Math.min(100, prev.memory.progress + 3) }
      }));
      setTimeout(() => startMemoryGame(), 800);
    }
  }, [memoryShowPhase, memoryGameOver, memoryPlayerPicks, memoryGrid, memoryScore, memoryLevel, startMemoryGame]);

  // ===== Pattern Puzzles Game Logic =====
  const generatePattern = useCallback(() => {
    const patterns = [
      { seq: [2, 4, 6, 8], next: 10, opts: [10, 12, 9, 11] },
      { seq: [1, 1, 2, 3, 5], next: 8, opts: [7, 8, 6, 13] },
      { seq: [3, 6, 9, 12], next: 15, opts: [15, 14, 16, 18] },
      { seq: [1, 4, 9, 16], next: 25, opts: [20, 25, 24, 36] },
      { seq: [2, 6, 12, 20], next: 30, opts: [28, 30, 32, 24] },
      { seq: [1, 3, 7, 15], next: 31, opts: [31, 29, 27, 32] },
      { seq: [5, 10, 20, 40], next: 80, opts: [60, 80, 70, 100] },
      { seq: [100, 50, 25], next: 12.5, opts: [12.5, 10, 15, 20] },
      { seq: [1, 2, 4, 7, 11], next: 16, opts: [15, 16, 14, 17] },
      { seq: [0, 1, 1, 2, 3, 5], next: 8, opts: [7, 8, 9, 13] },
      { seq: [2, 3, 5, 7, 11], next: 13, opts: [12, 13, 14, 15] },
      { seq: [1, 8, 27, 64], next: 125, opts: [100, 125, 128, 216] },
    ];
    const idx = Math.floor(Math.random() * patterns.length);
    const p = patterns[idx];
    setPatternSequence(p.seq);
    setPatternAnswer(p.next);
    setPatternOptions(p.opts.sort(() => Math.random() - 0.5));
    setPatternFeedback(null);
  }, []);

  const startPatternGame = useCallback(() => {
    setPatternLevel(1);
    setPatternScore(0);
    setPatternGameOver(false);
    setPatternRunning(true);
    generatePattern();
  }, [generatePattern]);

  const handlePatternChoice = useCallback((choice) => {
    if (patternGameOver) return;
    if (choice === patternAnswer) {
      setPatternFeedback('correct');
      const newScore = patternScore + patternLevel * 15;
      setPatternScore(newScore);
      setPatternLevel(prev => prev + 1);
      setActivityProgress(prev => ({
        ...prev, pattern: { ...prev.pattern, bestScore: Math.max(prev.pattern.bestScore, newScore), progress: Math.min(100, prev.pattern.progress + 4) }
      }));
      setTimeout(() => { generatePattern(); setPatternFeedback(null); }, 800);
    } else {
      setPatternFeedback('wrong');
      setPatternGameOver(true);
      setPatternRunning(false);
      setActivityProgress(prev => ({ ...prev, pattern: { ...prev.pattern, played: prev.pattern.played + 1 } }));
      runCognitiveAssessment({ pattern: patternScore });
    }
  }, [patternGameOver, patternAnswer, patternScore, patternLevel, generatePattern]);

  // ===== Reaction Master Game Logic =====
  const startReactionRound = useCallback(() => {
    setReactionPhase('ready');
    const delay = 2000 + Math.random() * 3000;
    setTimeout(() => {
      setReactionPhase('go');
      setReactionStartTime(Date.now());
    }, delay);
  }, []);

  const handleReactionClick = useCallback(() => {
    if (reactionPhase === 'ready') {
      setReactionPhase('waiting');
      setReactionTime(-1); // too early
    } else if (reactionPhase === 'go') {
      const time = Date.now() - reactionStartTime;
      setReactionTime(time);
      setReactionPhase('result');
      setReactionRound(prev => prev + 1);
      setReactionScores(prev => [...prev, time]);
      if (time < reactionBest) setReactionBest(time);
      setActivityProgress(prev => ({
        ...prev, reaction: { ...prev.reaction, bestTime: Math.min(prev.reaction.bestTime, time), played: prev.reaction.played + 1, progress: Math.min(100, prev.reaction.progress + 2) }
      }));
    }
  }, [reactionPhase, reactionStartTime, reactionBest]);

  // ===== Word Recall Game Logic =====
  const wordBank = ['apple', 'tiger', 'ocean', 'river', 'chair', 'plant', 'cloud', 'bread', 'stone', 'flame', 'music', 'dream', 'light', 'storm', 'peace', 'grace', 'crown', 'brave', 'green', 'earth'];

  const startWordRecallGame = useCallback(() => {
    const count = 4 + wordRecallLevel;
    const shuffled = [...wordBank].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.min(count, wordBank.length));
    setWordRecallWords(selected);
    setWordRecallShowPhase(true);
    setWordRecallGuesses([]);
    setWordRecallInput('');
    setWordRecallGameOver(false);
    setWordRecallRunning(true);
    setTimeout(() => setWordRecallShowPhase(false), 3000 + wordRecallLevel * 500);
  }, [wordRecallLevel]);

  const handleWordRecallSubmit = useCallback(() => {
    if (!wordRecallInput.trim() || wordRecallGameOver) return;
    const guess = wordRecallInput.trim().toLowerCase();
    if (wordRecallGuesses.includes(guess)) { setWordRecallInput(''); return; }
    const newGuesses = [...wordRecallGuesses, guess];
    setWordRecallGuesses(newGuesses);
    setWordRecallInput('');
    const correctCount = newGuesses.filter(g => wordRecallWords.includes(g)).length;
    if (correctCount === wordRecallWords.length) {
      const newScore = wordRecallScore + wordRecallLevel * 12;
      setWordRecallScore(newScore);
      setWordRecallLevel(prev => prev + 1);
      setActivityProgress(prev => ({
        ...prev, wordrecall: { ...prev.wordrecall, bestScore: Math.max(prev.wordrecall.bestScore, newScore), progress: Math.min(100, prev.wordrecall.progress + 4) }
      }));
      setTimeout(() => startWordRecallGame(), 1000);
    }
    if (newGuesses.length >= wordRecallWords.length + 3) {
      setWordRecallGameOver(true);
      setWordRecallRunning(false);
      setActivityProgress(prev => ({ ...prev, wordrecall: { ...prev.wordrecall, played: prev.wordrecall.played + 1 } }));
      runCognitiveAssessment({ wordrecall: newGuesses.filter(g => wordRecallWords.includes(g)).length });
    }
  }, [wordRecallInput, wordRecallGameOver, wordRecallGuesses, wordRecallWords, wordRecallScore, wordRecallLevel, startWordRecallGame]);

  // ===== Exercise Timer =====
  useEffect(() => {
    let interval;
    if (exerciseRunning && !exerciseCompleted) {
      interval = setInterval(() => {
        setExerciseTimer(prev => {
          if (prev <= 1) {
            setExerciseRunning(false);
            setExerciseCompleted(true);
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [exerciseRunning, exerciseCompleted]);

  // Memory game timer
  useEffect(() => {
    let interval;
    if (memoryRunning && !memoryGameOver) {
      interval = setInterval(() => setMemoryTimer(prev => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [memoryRunning, memoryGameOver]);

  // Pattern game timer
  useEffect(() => {
    let interval;
    if (patternRunning && !patternGameOver) {
      interval = setInterval(() => setPatternTimer(prev => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [patternRunning, patternGameOver]);

  // Word recall timer
  useEffect(() => {
    let interval;
    if (wordRecallRunning && !wordRecallGameOver) {
      interval = setInterval(() => setWordRecallTimer(prev => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [wordRecallRunning, wordRecallGameOver]);

  const formatTimer = (s) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  const startExercise = (exercise) => {
    const mins = parseInt(exercise.duration);
    setActiveExercise(exercise);
    setExerciseTimer(mins * 60);
    setExerciseRunning(false);
    setExerciseCompleted(false);
  };

  const openGame = (type) => {
    setActiveGame({ type });
    if (type === 'memory') { setMemoryLevel(1); setMemoryScore(0); setMemoryTimer(0); startMemoryGame(); }
    if (type === 'pattern') { setPatternTimer(0); startPatternGame(); }
    if (type === 'reaction') { setReactionRound(0); setReactionScores([]); setReactionBest(999); setReactionPhase('waiting'); }
    if (type === 'wordrecall') { setWordRecallLevel(1); setWordRecallScore(0); setWordRecallTimer(0); startWordRecallGame(); }
  };

  const userName = localStorage.getItem('userFirstName') || 'Elderly User';
  const userEmail = localStorage.getItem('userEmail') || '';
  const userRole = localStorage.getItem('userRole') || 'elderly';

  // ===== Download Vitals Report as PDF =====
  const downloadVitalsReport = () => {
    const doc = new jsPDF();
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    const periodLabels = { '24h': 'Last 24 Hours', '7d': 'Last 7 Days', '30d': 'Last 30 Days' };
    const periodLabel = periodLabels[reportPeriod] || 'Last 24 Hours';

    // Vitals data per period
    const vitalsData = {
      '24h': [
        ['Heart Rate', '72 BPM', 'Normal', '60-100 BPM', '-2 BPM'],
        ['Body Temperature', '98.6 F', 'Normal', '97-99 F', 'Stable'],
        ['Glucose Level', '110 mg/dL', 'Normal', '70-140 mg/dL', '-5 mg/dL'],
        ['Blood Pressure', '120/80 mmHg', 'Optimal', '90/60-140/90', 'Stable'],
        ['SpO2', '98%', 'Excellent', '95-100%', '+1%'],
        ['Steps', '3,456', 'Good', 'Goal: 5,000', '+12%'],
        ['Sleep', '7.5 hrs', 'Excellent', '7-9 hrs', 'Deep Sleep'],
      ],
      '7d': [
        ['Heart Rate (Avg)', '73 BPM', 'Normal', '60-100 BPM', '-1 BPM from prev week'],
        ['Body Temperature (Avg)', '98.5 F', 'Normal', '97-99 F', 'Stable'],
        ['Glucose Level (Avg)', '112 mg/dL', 'Normal', '70-140 mg/dL', '-3 mg/dL from prev week'],
        ['Blood Pressure (Avg)', '121/81 mmHg', 'Normal', '90/60-140/90', 'Stable'],
        ['SpO2 (Avg)', '97%', 'Normal', '95-100%', 'Stable'],
        ['Steps (Daily Avg)', '4,120', 'Good', 'Goal: 5,000', '+8% from prev week'],
        ['Sleep (Daily Avg)', '7.2 hrs', 'Good', '7-9 hrs', '+0.3 hrs from prev week'],
      ],
      '30d': [
        ['Heart Rate (Monthly Avg)', '74 BPM', 'Normal', '60-100 BPM', '-2 BPM from prev month'],
        ['Body Temperature (Monthly Avg)', '98.5 F', 'Normal', '97-99 F', 'Stable'],
        ['Glucose Level (Monthly Avg)', '115 mg/dL', 'Normal', '70-140 mg/dL', '-8 mg/dL from prev month'],
        ['Blood Pressure (Monthly Avg)', '122/82 mmHg', 'Normal', '90/60-140/90', '+2/+1 mmHg'],
        ['SpO2 (Monthly Avg)', '97%', 'Normal', '95-100%', 'Stable'],
        ['Steps (Daily Avg)', '3,890', 'Moderate', 'Goal: 5,000', '+5% from prev month'],
        ['Sleep (Daily Avg)', '7.0 hrs', 'Good', '7-9 hrs', '-0.2 hrs from prev month'],
      ],
      'custom': [
        ['Heart Rate', '72 BPM', 'Normal', '60-100 BPM', '-2 BPM'],
        ['Body Temperature', '98.6 F', 'Normal', '97-99 F', 'Stable'],
        ['Glucose Level', '110 mg/dL', 'Normal', '70-140 mg/dL', '-5 mg/dL'],
        ['Blood Pressure', '120/80 mmHg', 'Optimal', '90/60-140/90', 'Stable'],
        ['SpO2', '98%', 'Excellent', '95-100%', '+1%'],
        ['Steps', '3,456', 'Good', 'Goal: 5,000', '+12%'],
        ['Sleep', '7.5 hrs', 'Excellent', '7-9 hrs', 'Deep Sleep'],
      ],
    };

    const summaryData = {
      '24h': [
        'All vital signs are within normal ranges over the last 24 hours.',
        'Heart rate is steady at 72 BPM with minor fluctuations.',
        'Blood pressure reading of 120/80 mmHg is optimal.',
        'Glucose levels are well-controlled at 110 mg/dL.',
        'Sleep quality was excellent at 7.5 hours with deep sleep phases.',
        'Step count at 3,456 - encourage more activity to reach 5,000 goal.',
      ],
      '7d': [
        'Weekly vitals show consistent and stable readings.',
        'Average heart rate of 73 BPM, slightly improved from previous week.',
        'Blood pressure averaged 121/81 mmHg - within healthy range.',
        'Glucose trending downward at 112 mg/dL average - good control.',
        'Average daily steps increased 8% to 4,120 steps.',
        'Sleep averaged 7.2 hours per night with improving quality.',
      ],
      '30d': [
        'Monthly health trends show overall stable condition.',
        'Heart rate averaged 74 BPM - consistent over the month.',
        'Blood pressure slightly elevated at 122/82 but still within range.',
        'Glucose improved significantly, down 8 mg/dL from previous month.',
        'Physical activity moderate at 3,890 avg daily steps.',
        'Sleep duration stable at 7.0 hours - meets recommended minimum.',
      ],
      'custom': [
        'All vital signs are within normal ranges for the selected period.',
        'Heart rate is steady at 72 BPM.',
        'Blood pressure is optimal at 120/80 mmHg.',
        'Glucose levels well-controlled at 110 mg/dL.',
        'Overall health status: Good. Continue current health regimen.',
      ],
    };

    // --- Header ---
    doc.setFillColor(220, 38, 38);
    doc.rect(0, 0, 210, 35, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('AegisCare', 14, 18);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Elderly Health & Wellness Dashboard', 14, 26);
    doc.text('Generated: ' + dateStr + ' at ' + timeStr, 196, 18, { align: 'right' });
    doc.text('Patient: ' + userName, 196, 26, { align: 'right' });

    // --- Title ---
    doc.setTextColor(30, 30, 30);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Vitals Monitoring Report - ' + periodLabel, 14, 48);
    doc.setDrawColor(220, 38, 38);
    doc.setLineWidth(0.5);
    doc.line(14, 52, 196, 52);

    // --- Vitals Table ---
    autoTable(doc, {
      startY: 58,
      head: [['Vital Sign', 'Value', 'Status', 'Normal Range', 'Change']],
      body: vitalsData[reportPeriod] || vitalsData['24h'],
      theme: 'grid',
      headStyles: { fillColor: [220, 38, 38], textColor: 255, fontStyle: 'bold', fontSize: 9 },
      bodyStyles: { fontSize: 9, textColor: [50, 50, 50] },
      alternateRowStyles: { fillColor: [255, 245, 245] },
      margin: { left: 14, right: 14 },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 45 },
        2: { halign: 'center' },
        4: { halign: 'center' },
      },
    });

    var finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY : 140;

    // --- Health Summary ---
    var summaryY = finalY + 14;
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 30, 30);
    doc.text('Health Summary (' + periodLabel + ')', 14, summaryY);
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.line(14, summaryY + 3, 196, summaryY + 3);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 80);
    var lines = summaryData[reportPeriod] || summaryData['24h'];
    var yPos = summaryY + 11;
    for (var i = 0; i < lines.length; i++) {
      doc.text('- ' + lines[i], 16, yPos);
      yPos += 7;
    }

    // --- Recommendation ---
    yPos += 5;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 30, 30);
    doc.text('Recommendation', 14, yPos);
    doc.setLineWidth(0.3);
    doc.line(14, yPos + 3, 196, yPos + 3);
    yPos += 10;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 80);
    doc.text('Continue current medications and health regimen. Increase daily physical', 16, yPos);
    yPos += 6;
    doc.text('activity to reach the 5,000 step goal. Schedule next check-up with your doctor.', 16, yPos);

    // --- Footer ---
    var pageH = doc.internal.pageSize.height;
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.line(14, pageH - 22, 196, pageH - 22);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('This report is auto-generated by AegisCare Health Monitoring System.', 14, pageH - 16);
    doc.text('For medical decisions, please consult your healthcare provider.', 14, pageH - 11);
    doc.text('Report ID: VR-' + Date.now(), 196, pageH - 16, { align: 'right' });

    doc.save('AegisCare_Vitals_Report_' + periodLabel.replace(/\s+/g, '_') + '_' + now.toISOString().split('T')[0] + '.pdf');
  };

  // ===== Generate Health Report (Health Reports Section) =====
  const generateHealthReport = () => {
    const doc = new jsPDF();
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    const startLabel = reportStartDate ? new Date(reportStartDate + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A';
    const endLabel = reportEndDate ? new Date(reportEndDate + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A';
    const rangeLabel = (reportStartDate && reportEndDate) ? startLabel + ' — ' + endLabel : 'All Available Data';

    const type = selectedReportType;
    const isDoctor = type === 'Doctor View';
    const isSummary = type === 'Summary';

    // Color scheme per report type
    const colors = {
      'PDF Report': { r: 59, g: 130, b: 246 },
      'Excel Data': { r: 16, g: 185, b: 129 },
      'Summary': { r: 139, g: 92, b: 246 },
      'Doctor View': { r: 99, g: 102, b: 241 },
    };
    const c = colors[type] || colors['PDF Report'];

    // --- Header ---
    doc.setFillColor(c.r, c.g, c.b);
    doc.rect(0, 0, 210, 35, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('AegisCare', 14, 18);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Elderly Health & Wellness Dashboard', 14, 26);
    doc.text('Generated: ' + dateStr + ' at ' + timeStr, 196, 18, { align: 'right' });
    doc.text('Patient: ' + userName, 196, 26, { align: 'right' });

    // --- Title ---
    doc.setTextColor(30, 30, 30);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    const titleMap = {
      'PDF Report': 'Comprehensive Health Report',
      'Excel Data': 'Health Data Export Report',
      'Summary': 'Health Summary Report',
      'Doctor View': 'Clinical Report — For Healthcare Provider',
    };
    doc.text(titleMap[type] || 'Health Report', 14, 48);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text('Period: ' + rangeLabel, 14, 55);
    doc.setDrawColor(c.r, c.g, c.b);
    doc.setLineWidth(0.6);
    doc.line(14, 58, 196, 58);

    // --- Vitals Table ---
    const vitalsRows = [
      ['Heart Rate', '72 BPM', 'Normal', '60-100 BPM', '-2 BPM', 'Stable sinus rhythm'],
      ['Body Temperature', '98.6°F', 'Normal', '97-99°F', 'Stable', 'Afebrile'],
      ['Blood Glucose', '110 mg/dL', 'Normal', '70-140 mg/dL', '-5 mg/dL', 'Fasting: 95 mg/dL'],
      ['Blood Pressure', '120/80 mmHg', 'Optimal', '90/60-140/90', 'Stable', 'MAP: 93 mmHg'],
      ['SpO2', '98%', 'Excellent', '95-100%', '+1%', 'No desaturation events'],
      ['Steps (Daily Avg)', '3,456', 'Good', 'Goal: 5,000', '+12%', '69% of target'],
      ['Sleep', '7.5 hrs', 'Excellent', '7-9 hrs', 'Deep Sleep', 'Sleep score: 88/100'],
    ];

    const tableHeaders = isDoctor
      ? [['Vital Sign', 'Value', 'Status', 'Normal Range', 'Trend', 'Clinical Notes']]
      : isSummary
      ? [['Vital Sign', 'Value', 'Status']]
      : [['Vital Sign', 'Value', 'Status', 'Normal Range', 'Change']];

    const tableBody = vitalsRows.map(row => {
      if (isSummary) return [row[0], row[1], row[2]];
      if (isDoctor) return row;
      return [row[0], row[1], row[2], row[3], row[4]];
    });

    autoTable(doc, {
      startY: 64,
      head: tableHeaders,
      body: tableBody,
      theme: 'grid',
      headStyles: { fillColor: [c.r, c.g, c.b], textColor: 255, fontStyle: 'bold', fontSize: 9 },
      bodyStyles: { fontSize: 9, textColor: [50, 50, 50] },
      alternateRowStyles: { fillColor: [245, 247, 255] },
      margin: { left: 14, right: 14 },
      columnStyles: { 0: { fontStyle: 'bold', cellWidth: isSummary ? 60 : isDoctor ? 35 : 45 }, 2: { halign: 'center' } },
    });

    let yPos = (doc.lastAutoTable ? doc.lastAutoTable.finalY : 140) + 14;

    if (isDoctor) {
      // Doctor View: add medication + lab-style section
      doc.setFontSize(13);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(30, 30, 30);
      doc.text('Current Medications', 14, yPos);
      doc.setDrawColor(200, 200, 200);
      doc.line(14, yPos + 3, 196, yPos + 3);
      yPos += 10;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(80, 80, 80);
      const meds = [
        'Metformin 500mg — Twice daily with meals (Diabetes management)',
        'Lisinopril 10mg — Once daily in morning (Blood pressure)',
        'Vitamin D3 1000 IU — Once daily (Supplement)',
        'Aspirin 81mg — Once daily (Cardiovascular prevention)',
      ];
      meds.forEach(med => { doc.text('• ' + med, 16, yPos); yPos += 7; });
      yPos += 6;

      doc.setFontSize(13);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(30, 30, 30);
      doc.text('Clinical Assessment', 14, yPos);
      doc.line(14, yPos + 3, 196, yPos + 3);
      yPos += 10;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(80, 80, 80);
      const notes = [
        'Patient is hemodynamically stable with well-controlled vitals.',
        'Blood glucose trending downward — current regimen is effective.',
        'No acute complaints. Ambulatory and alert.',
        'Recommend continued monitoring and follow-up in 30 days.',
        'Consider increasing physical activity target to 6,000 steps/day.',
      ];
      notes.forEach(n => { doc.text('• ' + n, 16, yPos); yPos += 7; });
    } else {
      // Summary / PDF Report / Excel Data: health summary
      doc.setFontSize(13);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(30, 30, 30);
      doc.text('Health Summary', 14, yPos);
      doc.setDrawColor(200, 200, 200);
      doc.line(14, yPos + 3, 196, yPos + 3);
      yPos += 10;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(80, 80, 80);
      const summaryLines = [
        'All vital signs are within normal ranges for the selected period.',
        'Heart rate is steady at 72 BPM with healthy variability (HRV: 42ms).',
        'Blood pressure reading of 120/80 mmHg is optimal.',
        'Glucose levels well-controlled — fasting at 95, post-meal at 130 mg/dL.',
        'Sleep quality is excellent at 7.5 hrs with 24% deep sleep.',
        'Step count at 69% of daily goal — recommend adding evening walks.',
        'Overall Health Score: 92/100 — Above average for age group.',
      ];
      summaryLines.forEach(l => { doc.text('• ' + l, 16, yPos); yPos += 7; });
      yPos += 6;

      // Recommendation
      doc.setFontSize(13);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(30, 30, 30);
      doc.text('Recommendations', 14, yPos);
      doc.line(14, yPos + 3, 196, yPos + 3);
      yPos += 10;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(80, 80, 80);
      const recs = [
        'Continue current medications and health regimen.',
        'Increase daily physical activity to reach the 5,000 step goal.',
        'Maintain low-sodium, low-glycemic diet for BP and glucose control.',
        'Keep consistent sleep schedule — avoid screens 30 min before bed.',
        'Schedule next check-up with your healthcare provider.',
      ];
      recs.forEach(r => { doc.text('• ' + r, 16, yPos); yPos += 7; });
    }

    // --- Footer ---
    const pageH = doc.internal.pageSize.height;
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.line(14, pageH - 22, 196, pageH - 22);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('This report is auto-generated by AegisCare Health Monitoring System.', 14, pageH - 16);
    doc.text('For medical decisions, please consult your healthcare provider.', 14, pageH - 11);
    doc.text('Report ID: HR-' + Date.now(), 196, pageH - 16, { align: 'right' });
    if (isDoctor) {
      doc.text('CONFIDENTIAL — For authorized healthcare personnel only.', 105, pageH - 6, { align: 'center' });
    }

    const filePrefix = type.replace(/\s+/g, '_');
    doc.save('AegisCare_' + filePrefix + '_' + now.toISOString().split('T')[0] + '.pdf');
  };

  // ===== Meals State =====
  const [meals, setMeals] = useState([]);
  const [mealTotals, setMealTotals] = useState({ calories: 0, protein: 0, carbs: 0, fats: 0 });
  const [mealsLoading, setMealsLoading] = useState(false);
  const [showAddMealModal, setShowAddMealModal] = useState(false);
  const [mealDetailModal, setMealDetailModal] = useState(null);
  const [showAllTips, setShowAllTips] = useState(false);
  const [newMeal, setNewMeal] = useState({ name: '', mealType: 'breakfast', scheduledTime: '8:00 AM', calories: 0, protein: 0, carbs: 0, fats: 0, notes: '' });

  // ===== Medications State =====
  const [medications, setMedications] = useState([]);
  const [medSummary, setMedSummary] = useState({ total: 0, taken: 0, pending: 0, adherenceRate: 0 });
  const [medsLoading, setMedsLoading] = useState(false);
  const [showAddMedModal, setShowAddMedModal] = useState(false);
  const [newMed, setNewMed] = useState({ name: '', type: '', dosage: '', frequency: 'daily', scheduledTime: '8:00 AM', prescribedBy: '', refillDate: '', notes: '' });
  const [reminderMsg, setReminderMsg] = useState('');

  // Medication History & Refills
  const [medHistory, setMedHistory] = useState([
    { id: 1, medication: 'Metformin', time: 'Today, 8:00 AM', date: 'Mar 16, 2026', status: 'Taken', dosage: '500mg', type: 'tablet' },
    { id: 2, medication: 'Lisinopril', time: 'Yesterday, 2:00 PM', date: 'Mar 15, 2026', status: 'Taken', dosage: '10mg', type: 'tablet' },
    { id: 3, medication: 'Atorvastatin', time: 'Yesterday, 8:00 PM', date: 'Mar 15, 2026', status: 'Missed', dosage: '20mg', type: 'capsule' },
    { id: 4, medication: 'Metformin', time: 'Mar 14, 8:00 AM', date: 'Mar 14, 2026', status: 'Taken', dosage: '500mg', type: 'tablet' },
    { id: 5, medication: 'Lisinopril', time: 'Mar 14, 2:00 PM', date: 'Mar 14, 2026', status: 'Taken', dosage: '10mg', type: 'tablet' },
    { id: 6, medication: 'Atorvastatin', time: 'Mar 14, 8:00 PM', date: 'Mar 14, 2026', status: 'Taken', dosage: '20mg', type: 'capsule' },
    { id: 7, medication: 'Metformin', time: 'Mar 13, 8:00 AM', date: 'Mar 13, 2026', status: 'Taken', dosage: '500mg', type: 'tablet' },
    { id: 8, medication: 'Lisinopril', time: 'Mar 13, 2:00 PM', date: 'Mar 13, 2026', status: 'Missed', dosage: '10mg', type: 'tablet' },
  ]);
  const [medRefills, setMedRefills] = useState([
    { id: 0, name: 'Metformin', date: 'Dec 15', fullDate: '2026-12-15', status: 'Due Soon', color: 'amber', pharmacy: 'City Pharmacy', quantity: '30 tablets', cost: '$12' },
    { id: 1, name: 'Atorvastatin', date: 'Dec 18', fullDate: '2026-12-18', status: 'Scheduled', color: 'blue', pharmacy: 'HealthMart', quantity: '30 capsules', cost: '$18' },
    { id: 2, name: 'Lisinopril', date: 'Dec 20', fullDate: '2026-12-20', status: 'Scheduled', color: 'blue', pharmacy: 'City Pharmacy', quantity: '30 tablets', cost: '$8' },
  ]);
  const [showMedHistory, setShowMedHistory] = useState(false);
  const [showScheduleRefill, setShowScheduleRefill] = useState(false);
  const [newRefill, setNewRefill] = useState({ name: '', date: '', pharmacy: 'City Pharmacy', quantity: '30 tablets' });
  const [refillSaved, setRefillSaved] = useState(false);

  // ===== Doctors State =====
  const [doctors, setDoctors] = useState([]);
  const [doctorsLoading, setDoctorsLoading] = useState(false);

  // ===== Appointment Booking State =====
  const [doctorDropdownOpen, setDoctorDropdownOpen] = useState(false);
  const [timeDropdownOpen, setTimeDropdownOpen] = useState(false);
  const [apptDoctor, setApptDoctor] = useState('');
  const [apptDate, setApptDate] = useState('');
  const [apptPeriod, setApptPeriod] = useState('morning');
  const [apptSlot, setApptSlot] = useState('');
  const [apptNotes, setApptNotes] = useState('');
  const [apptLoading, setApptLoading] = useState(false);
  const [apptMsg, setApptMsg] = useState({ type: '', text: '' });

  const [appointments, setAppointments] = useState([]);
  const [appointmentsLoading, setAppointmentsLoading] = useState(false);

  // ===== Fetch Meals =====
  const fetchMeals = useCallback(async () => {
    try {
      setMealsLoading(true);
      const res = await api.get('/meals');
      setMeals(res.data.meals || []);
      setMealTotals(res.data.totals || { calories: 0, protein: 0, carbs: 0, fats: 0 });
    } catch (err) {
      console.error('Failed to fetch meals:', err);
    } finally {
      setMealsLoading(false);
    }
  }, []);

  // ===== Fetch Medications =====
  const fetchMedications = useCallback(async () => {
    try {
      setMedsLoading(true);
      const res = await api.get('/medications');
      setMedications(res.data.medications || []);
      setMedSummary(res.data.summary || { total: 0, taken: 0, pending: 0, adherenceRate: 0 });
    } catch (err) {
      console.error('Failed to fetch medications:', err);
    } finally {
      setMedsLoading(false);
    }
  }, []);

  // ===== Fetch Doctors =====
  const fetchDoctors = useCallback(async () => {
    try {
      setDoctorsLoading(true);
      const res = await api.get('/doctors');
      setDoctors(res.data.doctors || []);
    } catch (err) {
      console.error('Failed to fetch doctors:', err);
    } finally {
      setDoctorsLoading(false);
    }
  }, []);

  // ===== Fetch Appointments =====
  const fetchAppointments = useCallback(async () => {
    try {
      setAppointmentsLoading(true);
      const res = await api.get('/appointments?upcoming=true');
      if (res.data && res.data.success) {
        setAppointments(res.data.appointments || []);
      }
    } catch (err) {
      console.error('Failed to fetch appointments:', err);
    } finally {
      setAppointmentsLoading(false);
    }
  }, []);

  // Load data when module changes
  // ===== Fetch Vitals + ML Insights from backend (dynamic per patient) =====
  const fetchVitalsAndML = useCallback(async () => {
    try {
      setHealthRiskLoading(true);
      const res = await api.get('/elderly/vitals');
      if (res.data?.success) {
        const { vitals, mlInsights } = res.data.data;
        setLiveVitals(vitals);
        if (mlInsights?.anomaly) setAnomalyResult(mlInsights.anomaly);
        if (mlInsights?.risk) {
          setHealthRisk(mlInsights.risk);
        } else if (vitals) {
          // Fallback: derive risk level from vitals when ML service is unavailable
          const hrOk = vitals.heartRate >= 60 && vitals.heartRate <= 100;
          const bpOk = vitals.systolicBP < 140 && vitals.diastolicBP < 90;
          const glOk = vitals.glucose >= 70 && vitals.glucose <= 140;
          const spOk = vitals.spo2 >= 95;
          const okCount = [hrOk, bpOk, glOk, spOk].filter(Boolean).length;
          setHealthRisk({
            risk_level: okCount >= 3 ? 'Low' : okCount >= 2 ? 'Medium' : 'High',
            risk_probability: okCount >= 3 ? 0.15 : okCount >= 2 ? 0.5 : 0.8,
            _fallback: true,
          });
        }
      }
    } catch (err) { console.error('Vitals fetch error:', err); }
    finally { setHealthRiskLoading(false); }
  }, []);

  // ===== ML: Fetch Nutrition Recommendations =====
  const fetchNutritionRecs = useCallback(async () => {
    try {
      setNutritionLoading(true);
      const res = await recommendNutrition({
        calorie_target: 1800, protein_target: 55, carbs_target: 220, fats_target: 60,
        has_diabetes: 0, has_heart_disease: 0, needs_low_sodium: 0,
        meal_type: '', count: 6,
      });
      if (res.data?.success) setNutritionRecs(res.data.data.recommendations || []);
    } catch (err) { console.error('ML nutrition error:', err); }
    finally { setNutritionLoading(false); }
  }, []);

  // ===== ML: Cognitive Assessment after Game =====
  const runCognitiveAssessment = useCallback(async (gameScores) => {
    try {
      setCognitiveLoading(true);
      const res = await assessCognitive({
        age: 75,
        memory_game_score: gameScores.memory || activityProgress.memory.bestScore * 10 || 50,
        pattern_puzzle_score: gameScores.pattern || activityProgress.pattern.bestScore * 10 || 50,
        reaction_test_avg_ms: gameScores.reaction || activityProgress.reaction.avgTime || 400,
        word_recall_correct: gameScores.wordrecall || Math.round(activityProgress.wordrecall.avgScore) || 5,
        memory_avg_7: activityProgress.memory.avgScore * 10 || 52,
        pattern_avg_7: activityProgress.pattern.avgScore * 10 || 38,
        reaction_avg_7: activityProgress.reaction.avgTime || 320,
        word_recall_avg_7: activityProgress.wordrecall.avgScore || 4.5,
        session_number: activityProgress.memory.played + activityProgress.pattern.played || 20,
      });
      if (res.data?.success) setCognitiveAssessment(res.data.data);
    } catch (err) { console.error('ML cognitive error:', err); }
    finally { setCognitiveLoading(false); }
  }, [activityProgress]);

  useEffect(() => {
    if (activeModule === 'diet') { fetchMeals(); fetchNutritionRecs(); }
    if (activeModule === 'medication') fetchMedications();
    if (activeModule === 'telemedicine-schedule') {
      fetchDoctors();
      fetchAppointments();
    }
    if (activeModule === 'dashboard') { fetchVitalsAndML(); }
    if (activeModule === 'vitals' || activeModule === 'health-monitoring') { fetchVitalsAndML(); }
    if (activeModule === 'health-reports') { fetchVitalsAndML(); }
  }, [activeModule, fetchMeals, fetchMedications, fetchDoctors, fetchAppointments, fetchVitalsAndML, fetchNutritionRecs]);

  // ===== Meal Handlers =====
  const handleAddMeal = async () => {
    try {
      if (!newMeal.name || !newMeal.mealType || !newMeal.scheduledTime) return;
      await api.post('/meals', newMeal);
      setShowAddMealModal(false);
      setNewMeal({ name: '', mealType: 'breakfast', scheduledTime: '8:00 AM', calories: 0, protein: 0, carbs: 0, fats: 0, notes: '' });
      fetchMeals();
    } catch (err) {
      console.error('Failed to add meal:', err);
    }
  };

  const handleLogMeal = async (mealId) => {
    try {
      await api.put(`/meals/${mealId}/log`);
      fetchMeals();
    } catch (err) {
      console.error('Failed to log meal:', err);
    }
  };

  // ===== Medication Handlers =====
  const handleAddMedication = async () => {
    try {
      if (!newMed.name || !newMed.type || !newMed.dosage || !newMed.scheduledTime) return;
      await api.post('/medications', newMed);
      setShowAddMedModal(false);
      setNewMed({ name: '', type: '', dosage: '', frequency: 'daily', scheduledTime: '8:00 AM', prescribedBy: '', refillDate: '', notes: '' });
      fetchMedications();
    } catch (err) {
      console.error('Failed to add medication:', err);
    }
  };

  const handleMarkMedication = async (medId) => {
    try {
      const med = medications.find(m => m._id === medId);
      await api.put(`/medications/${medId}/mark`);
      if (med && med.todayStatus !== 'taken') {
        const now = new Date();
        const timeStr = `${now.getHours() % 12 || 12}:${String(now.getMinutes()).padStart(2, '0')} ${now.getHours() >= 12 ? 'PM' : 'AM'}`;
        setMedHistory(prev => [{ id: Date.now(), medication: med.name, time: `Today, ${timeStr}`, date: 'Mar 16, 2026', status: 'Taken', dosage: med.dosage || 'N/A', type: med.type || 'tablet' }, ...prev]);
        addNotification({ type: 'medication', title: `${med.name} Taken`, message: `You took ${med.name} (${med.dosage || 'N/A'}) at ${timeStr}`, icon: 'pill', color: 'emerald' });
      }
      fetchMedications();
    } catch (err) {
      console.error('Failed to mark medication:', err);
    }
  };

  const handleSetReminder = async (medId) => {
    try {
      const res = await api.put(`/medications/${medId}/reminder`);
      setReminderMsg(res.data.message || 'Reminder set!');
      const med = medications.find(m => m._id === medId);
      addNotification({ type: 'reminder', title: 'Medication Reminder Set', message: `Reminder set for ${med?.name || 'medication'}`, icon: 'bell', color: 'amber' });
      setTimeout(() => setReminderMsg(''), 3000);
    } catch (err) {
      console.error('Failed to set reminder:', err);
    }
  };

  // ===== Book Appointment =====
  const handleBookAppointment = async () => {
    if (!apptDoctor || !apptDate || !apptSlot) {
      setApptMsg({ type: 'error', text: 'Please select a doctor, date, and time slot.' });
      setTimeout(() => setApptMsg({ type: '', text: '' }), 4000);
      return;
    }
    try {
      setApptLoading(true);
      const res = await api.post('/appointments', {
        doctorId: apptDoctor,
        date: apptDate,
        timeSlot: apptSlot,
        preferredPeriod: apptPeriod,
        type: 'video',
        notes: apptNotes
      });
      setApptMsg({ type: 'success', text: res.data.message || 'Appointment scheduled successfully!' });
      const doc = doctors.find(d => d._id === apptDoctor);
      addNotification({ type: 'appointment', title: 'Appointment Booked', message: `Appointment with ${doc?.name || 'Doctor'} on ${apptDate} at ${apptSlot}`, icon: 'calendar', color: 'green' });
      // Reset form
      setApptDoctor('');
      setApptDate('');
      setApptSlot('');
      setApptPeriod('morning');
      setApptNotes('');
      fetchAppointments();
      setTimeout(() => setApptMsg({ type: '', text: '' }), 5000);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to schedule appointment.';
      setApptMsg({ type: 'error', text: msg });
      setTimeout(() => setApptMsg({ type: '', text: '' }), 4000);
    } finally {
      setApptLoading(false);
    }
  };

  // Helper to get meal icon
  const getMealIcon = (mealType) => {
    switch (mealType) {
      case 'breakfast': return <Sunrise className="w-5 h-5" />;
      case 'lunch': return <Sun className="w-5 h-5" />;
      case 'snack': return <Clock className="w-5 h-5" />;
      case 'dinner': return <Moon className="w-5 h-5" />;
      default: return <Utensils className="w-5 h-5" />;
    }
  };

  const getMealColor = (mealType) => {
    switch (mealType) {
      case 'breakfast': return 'amber';
      case 'lunch': return 'emerald';
      case 'snack': return 'blue';
      case 'dinner': return 'purple';
      default: return 'amber';
    }
  };

  const getMedColor = (type) => {
    const lower = (type || '').toLowerCase();
    if (lower.includes('diabet')) return 'emerald';
    if (lower.includes('blood') || lower.includes('pressure')) return 'blue';
    if (lower.includes('cholest')) return 'purple';
    if (lower.includes('pain')) return 'red';
    return 'cyan';
  };

  // Get role-based dashboard name
  const getDashboardName = () => {
    const roleNames = {
      'elderly': 'Elderly Health & Wellness Dashboard',
      'family': 'Family Care Dashboard',
      'doctor': 'Medical Professional Dashboard',
      'caretaker': 'Caregiver Management Dashboard',
      'admin': 'Administration Dashboard'
    };
    return roleNames[userRole] || 'Health Dashboard';
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

  // Navigation modules
  const modules = [
    { id: 'dashboard', name: 'Dashboard', icon: <Home size={22} />, color: 'rose' },
    { id: 'vitals', name: 'Vitals Monitoring', icon: <Activity size={22} />, color: 'emerald' },
    { id: 'health-reports', name: 'Health Reports', icon: <FileHeart size={22} />, color: 'blue' },
    { id: 'activities', name: 'Cognitive Activities', icon: <BrainCircuit size={22} />, color: 'purple' },
    { id: 'vr', name: 'VR Engagement', icon: <Headphones size={22} />, color: 'indigo' },
    { id: 'diet', name: 'Diet Plan', icon: <Utensils size={22} />, color: 'amber' },
    { id: 'medication', name: 'Medication', icon: <Pill size={22} />, color: 'cyan' },
    { id: 'panic', name: 'Panic Button', icon: <ShieldAlert size={22} />, color: 'red' },
    { id: 'telemedicine-schedule', name: 'Book Appointment', icon: <CalendarDays size={22} />, color: 'green' },
    { id: 'settings', name: 'Settings', icon: <Settings size={22} />, color: 'indigo' },
  ];

  if (showSplash) {
    return (
      <SplashScreen 
        userRole={userRole}
        userName={userName}
        isDarkMode={isDarkMode}
        onFinish={() => { sessionStorage.setItem('elderly-splash-shown', 'true'); setShowSplash(false); }}
      />
    );
  }

  // Dynamic vitals helpers
  const hr = liveVitals?.heartRate ?? 72;
  const sbp = liveVitals?.systolicBP ?? 120;
  const dbp = liveVitals?.diastolicBP ?? 80;
  const gl = liveVitals?.glucose ?? 110;
  const tp = liveVitals?.temp ?? 36.6;
  const sp = liveVitals?.spo2 ?? 98;

  const hrStatus = hr >= 60 && hr <= 100 ? 'Normal' : hr > 100 ? 'High' : 'Low';
  const bpStatus = sbp < 120 && dbp < 80 ? 'Optimal' : sbp <= 140 && dbp <= 90 ? 'Normal' : 'High';
  const glStatus = gl >= 70 && gl <= 140 ? 'Normal' : gl > 140 ? 'High' : 'Low';
  const tpCelsius = tp < 45 ? tp : Math.round((tp - 32) * 5 / 9 * 10) / 10; // handle both C and F
  const tpF = tp < 45 ? Math.round((tp * 9 / 5 + 32) * 10) / 10 : tp;
  const tpStatus = tpCelsius >= 36.1 && tpCelsius <= 37.2 ? 'Normal' : tpCelsius > 37.5 ? 'Fever' : 'Low';
  const spStatus = sp >= 95 ? 'Excellent' : sp >= 90 ? 'Low' : 'Critical';

  const healthMetrics = {
    heart: {
      icon: <Heart className="w-6 h-6" />,
      title: "Heart Rate",
      value: `${hr} BPM`,
      status: hrStatus,
      color: "rose",
      trend: hrStatus === 'Normal' ? '↓ Stable' : hr > 100 ? '↑ Elevated' : '↓ Low',
      description: hrStatus === 'Normal' ? "Resting heart rate within normal range" : hr > 100 ? "Heart rate is elevated — monitor closely" : "Heart rate is below normal",
      currentValue: hr,
      minValue: 60,
      maxValue: 100,
      details: {
        summary: hrStatus === 'Normal' ? 'Your heart rate is within a healthy range.' : 'Your heart rate needs attention — consult your doctor.',
        metrics: [
          { label: 'Resting HR', value: `${hr} BPM`, note: hrStatus === 'Normal' ? 'Normal (60-100)' : 'Outside normal range' },
          { label: 'Peak HR Today', value: `${hr + 38} BPM`, note: 'During morning walk' },
          { label: 'Avg HR (7 days)', value: `${hr + 1} BPM`, note: 'Recent trend' },
          { label: 'HRV', value: '42 ms', note: 'Good variability' },
        ],
        recommendation: hrStatus === 'Normal' ? 'Your heart rate is well-controlled. Continue regular light exercise.' : 'Elevated heart rate detected. Please rest and consult your doctor if persistent.'
      },
      history: [
        { date: 'Today', value: `${hr} BPM`, status: hrStatus },
        { date: 'Yesterday', value: `${hr - 2} BPM`, status: (hr - 2) >= 60 && (hr - 2) <= 100 ? 'Normal' : 'Elevated' },
        { date: '2 days ago', value: `${hr + 1} BPM`, status: (hr + 1) >= 60 && (hr + 1) <= 100 ? 'Normal' : 'Elevated' },
        { date: '3 days ago', value: `${hr - 3} BPM`, status: (hr - 3) >= 60 && (hr - 3) <= 100 ? 'Normal' : 'Elevated' },
        { date: '4 days ago', value: `${hr + 2} BPM`, status: (hr + 2) >= 60 && (hr + 2) <= 100 ? 'Normal' : 'Elevated' },
        { date: '5 days ago', value: `${hr - 1} BPM`, status: (hr - 1) >= 60 && (hr - 1) <= 100 ? 'Normal' : 'Elevated' },
        { date: '6 days ago', value: `${hr + 4} BPM`, status: (hr + 4) >= 60 && (hr + 4) <= 100 ? 'Normal' : 'Elevated' },
      ]
    },
    temp: {
      icon: <ThermometerSun className="w-6 h-6" />,
      title: "Body Temp",
      value: `${tpF}°F`,
      status: tpStatus,
      color: "orange",
      trend: tpStatus === 'Normal' ? 'Stable' : tpStatus === 'Fever' ? '↑ Elevated' : '↓ Low',
      description: tpStatus === 'Normal' ? "Body temperature optimal" : tpStatus === 'Fever' ? "Temperature elevated — possible fever" : "Temperature below normal",
      currentValue: tpF,
      minValue: 97,
      maxValue: 100,
      details: {
        summary: tpStatus === 'Normal' ? 'Body temperature is stable with no signs of fever.' : 'Temperature is outside normal range — please monitor.',
        metrics: [
          { label: 'Current Temp', value: `${tpF}°F (${tpCelsius}°C)`, note: tpStatus === 'Normal' ? 'Normal (97–99°F)' : 'Outside normal range' },
          { label: 'Morning Avg', value: `${(tpF - 0.8).toFixed(1)}°F`, note: 'Slightly lower AM is normal' },
          { label: 'Evening Avg', value: `${(tpF + 0.3).toFixed(1)}°F`, note: 'Slight PM rise is normal' },
          { label: 'Max Recorded', value: `${(tpF + 0.5).toFixed(1)}°F`, note: tpStatus === 'Normal' ? 'Within normal range' : 'Elevated' },
        ],
        recommendation: tpStatus === 'Normal' ? 'Temperature regulation is functioning normally.' : 'Consult your doctor if temperature remains elevated.'
      },
      history: [
        { date: 'Today', value: `${tpF}°F`, status: tpStatus },
        { date: 'Yesterday', value: `${(tpF - 0.2).toFixed(1)}°F`, status: (tpF - 0.2) > 99.5 ? 'Fever' : (tpF - 0.2) < 97 ? 'Low' : 'Normal' },
        { date: '2 days ago', value: `${(tpF + 0.1).toFixed(1)}°F`, status: (tpF + 0.1) > 99.5 ? 'Fever' : (tpF + 0.1) < 97 ? 'Low' : 'Normal' },
        { date: '3 days ago', value: `${(tpF - 0.1).toFixed(1)}°F`, status: (tpF - 0.1) > 99.5 ? 'Fever' : (tpF - 0.1) < 97 ? 'Low' : 'Normal' },
        { date: '4 days ago', value: `${(tpF + 0.2).toFixed(1)}°F`, status: (tpF + 0.2) > 99.5 ? 'Fever' : (tpF + 0.2) < 97 ? 'Low' : 'Normal' },
        { date: '5 days ago', value: `${tpF}°F`, status: tpStatus },
        { date: '6 days ago', value: `${(tpF - 0.3).toFixed(1)}°F`, status: (tpF - 0.3) > 99.5 ? 'Fever' : (tpF - 0.3) < 97 ? 'Low' : 'Normal' },
      ]
    },
    glucose: {
      icon: <ActivitySquare className="w-6 h-6" />,
      title: "Glucose",
      value: `${gl} mg/dL`,
      status: glStatus,
      color: "emerald",
      trend: glStatus === 'Normal' ? '↓ Stable' : gl > 140 ? '↑ Elevated' : '↓ Low',
      description: glStatus === 'Normal' ? "Within target range" : gl > 140 ? "Glucose elevated — monitor diet" : "Glucose below normal — eat something",
      currentValue: gl,
      minValue: 70,
      maxValue: 140,
      details: {
        summary: glStatus === 'Normal' ? 'Blood glucose levels are well-controlled.' : 'Blood glucose is outside normal range — please consult your doctor.',
        metrics: [
          { label: 'Current Glucose', value: `${gl} mg/dL`, note: glStatus === 'Normal' ? 'Normal (70-140)' : 'Outside normal range' },
          { label: 'Fasting (est.)', value: `${Math.round(gl * 0.86)} mg/dL`, note: gl * 0.86 < 100 ? 'Normal (<100)' : 'Elevated' },
          { label: 'Avg (7 days)', value: `${gl + 2} mg/dL`, note: 'Recent trend' },
          { label: 'HbA1c (est.)', value: `${((gl + 46.7) / 28.7).toFixed(1)}%`, note: gl <= 140 ? 'Non-diabetic range' : 'Elevated' },
        ],
        recommendation: glStatus === 'Normal' ? 'Continue your current meal plan. Maintain low-glycemic food choices.' : 'Glucose is elevated. Reduce sugar/carb intake and consult your doctor.'
      },
      history: [
        { date: 'Today', value: `${gl} mg/dL`, status: glStatus },
        { date: 'Yesterday', value: `${gl + 5} mg/dL`, status: (gl + 5) >= 70 && (gl + 5) <= 140 ? 'Normal' : 'High' },
        { date: '2 days ago', value: `${gl - 2} mg/dL`, status: (gl - 2) >= 70 && (gl - 2) <= 140 ? 'Normal' : 'High' },
        { date: '3 days ago', value: `${gl + 10} mg/dL`, status: (gl + 10) >= 70 && (gl + 10) <= 140 ? 'Normal' : 'High' },
        { date: '4 days ago', value: `${gl + 2} mg/dL`, status: (gl + 2) >= 70 && (gl + 2) <= 140 ? 'Normal' : 'High' },
        { date: '5 days ago', value: `${gl + 8} mg/dL`, status: (gl + 8) >= 70 && (gl + 8) <= 140 ? 'Normal' : 'High' },
        { date: '6 days ago', value: `${gl - 5} mg/dL`, status: (gl - 5) >= 70 && (gl - 5) <= 140 ? 'Normal' : 'High' },
      ]
    },
    bp: {
      icon: <Activity className="w-6 h-6" />,
      title: "Blood Pressure",
      value: `${sbp}/${dbp}`,
      status: bpStatus,
      color: "blue",
      trend: bpStatus === 'Optimal' ? 'Optimal' : bpStatus === 'Normal' ? 'Normal' : '↑ Elevated',
      description: bpStatus === 'Optimal' ? "Ideal reading" : bpStatus === 'Normal' ? "Within acceptable range" : "Blood pressure is elevated",
      currentValue: sbp,
      minValue: 90,
      maxValue: 140,
      details: {
        summary: bpStatus !== 'High' ? 'Blood pressure is within acceptable range.' : 'Blood pressure is elevated — consult your doctor.',
        metrics: [
          { label: 'Systolic', value: `${sbp} mmHg`, note: sbp < 120 ? 'Optimal (<120)' : sbp <= 140 ? 'Normal' : 'High (>140)' },
          { label: 'Diastolic', value: `${dbp} mmHg`, note: dbp < 80 ? 'Optimal (<80)' : dbp <= 90 ? 'Normal' : 'High (>90)' },
          { label: 'Pulse Pressure', value: `${sbp - dbp} mmHg`, note: (sbp - dbp) >= 30 && (sbp - dbp) <= 50 ? 'Normal (30-50)' : 'Outside normal range' },
          { label: 'MAP', value: `${Math.round((sbp + 2 * dbp) / 3)} mmHg`, note: 'Normal (70-105)' },
        ],
        recommendation: bpStatus !== 'High' ? 'Maintain a low-sodium diet and regular exercise.' : 'Blood pressure is high. Reduce salt intake, stay calm, and consult your doctor.'
      },
      history: [
        { date: 'Today', value: `${sbp}/${dbp}`, status: bpStatus },
        { date: 'Yesterday', value: `${sbp - 2}/${dbp - 2}`, status: (sbp - 2) <= 120 ? 'Normal' : (sbp - 2) <= 140 ? 'Elevated' : 'High' },
        { date: '2 days ago', value: `${sbp + 2}/${dbp + 2}`, status: (sbp + 2) <= 120 ? 'Normal' : (sbp + 2) <= 140 ? 'Elevated' : 'High' },
        { date: '3 days ago', value: `${sbp - 1}/${dbp - 1}`, status: (sbp - 1) <= 120 ? 'Normal' : (sbp - 1) <= 140 ? 'Elevated' : 'High' },
        { date: '4 days ago', value: `${sbp + 5}/${dbp + 4}`, status: (sbp + 5) <= 120 ? 'Normal' : (sbp + 5) <= 140 ? 'Elevated' : 'High' },
        { date: '5 days ago', value: `${sbp + 1}/${dbp + 1}`, status: (sbp + 1) <= 120 ? 'Normal' : (sbp + 1) <= 140 ? 'Elevated' : 'High' },
        { date: '6 days ago', value: `${sbp - 3}/${dbp - 3}`, status: (sbp - 3) <= 120 ? 'Normal' : (sbp - 3) <= 140 ? 'Elevated' : 'High' },
      ]
    },
    spo2: {
      icon: <Activity size={22} />,
      title: "SpO2",
      value: `${sp}%`,
      status: spStatus,
      color: "purple",
      trend: spStatus === 'Excellent' ? 'Normal' : '↓ Low',
      description: spStatus === 'Excellent' ? "Oxygen saturation optimal" : sp >= 90 ? "Oxygen level slightly low" : "Critically low oxygen — seek help",
      currentValue: sp,
      minValue: 90,
      maxValue: 100,
      details: {
        summary: spStatus === 'Excellent' ? 'Oxygen saturation levels are excellent.' : 'Oxygen saturation is below normal — please monitor.',
        metrics: [
          { label: 'Current SpO2', value: `${sp}%`, note: sp >= 95 ? 'Excellent (≥95%)' : sp >= 90 ? 'Low (90-94%)' : 'Critical (<90%)' },
          { label: 'Lowest Today', value: `${sp - 2}%`, note: 'During sleep' },
          { label: 'Avg (7 days)', value: `${sp}%`, note: 'Recent trend' },
          { label: 'Perfusion Index', value: '4.2%', note: 'Good signal quality' },
        ],
        recommendation: spStatus === 'Excellent' ? 'SpO2 levels are excellent. No action needed.' : 'Oxygen levels are low. Practice deep breathing. Seek medical attention if persistently below 92%.'
      },
      history: [
        { date: 'Today', value: `${sp}%`, status: spStatus },
        { date: 'Yesterday', value: `${Math.min(sp + 1, 100)}%`, status: Math.min(sp + 1, 100) >= 95 ? 'Normal' : Math.min(sp + 1, 100) >= 90 ? 'Low' : 'Critical' },
        { date: '2 days ago', value: `${sp}%`, status: sp >= 95 ? 'Normal' : sp >= 90 ? 'Low' : 'Critical' },
        { date: '3 days ago', value: `${Math.min(sp + 1, 100)}%`, status: Math.min(sp + 1, 100) >= 95 ? 'Normal' : Math.min(sp + 1, 100) >= 90 ? 'Low' : 'Critical' },
        { date: '4 days ago', value: `${sp}%`, status: sp >= 95 ? 'Normal' : sp >= 90 ? 'Low' : 'Critical' },
        { date: '5 days ago', value: `${Math.min(sp - 1, 100)}%`, status: Math.min(sp - 1, 100) >= 95 ? 'Normal' : Math.min(sp - 1, 100) >= 90 ? 'Low' : 'Critical' },
        { date: '6 days ago', value: `${Math.min(sp + 1, 100)}%`, status: Math.min(sp + 1, 100) >= 95 ? 'Normal' : Math.min(sp + 1, 100) >= 90 ? 'Low' : 'Critical' },
      ]
    },
    steps: (() => {
      const stepsBase = healthRisk?.risk_level === 'High' ? 1200 : healthRisk?.risk_level === 'Medium' ? 2800 : 3456;
      const stepsGoal = 5000;
      const stepsPct = Math.round((stepsBase / stepsGoal) * 100);
      const stepsStatus = stepsPct >= 100 ? 'Goal Met' : stepsPct >= 50 ? 'Good' : 'Low';
      return {
        icon: <Dumbbell className="w-6 h-6" />,
        title: "Steps",
        value: stepsBase.toLocaleString(),
        status: stepsStatus,
        color: "amber",
        trend: healthRisk?.risk_level === 'High' ? '↓ 30%' : healthRisk?.risk_level === 'Medium' ? '↑ 5%' : '↑ 12%',
        description: `Daily goal: ${stepsGoal.toLocaleString()} steps`,
        currentValue: stepsBase,
        minValue: 0,
        maxValue: stepsGoal,
        details: {
          summary: stepsStatus === 'Low' ? 'Activity level is low. Even light movement can help improve circulation and mood.' : `You are making ${stepsStatus === 'Goal Met' ? 'excellent' : 'good'} progress toward your daily step goal.`,
          metrics: [
            { label: 'Today\'s Steps', value: stepsBase.toLocaleString(), note: `${stepsPct}% of ${stepsGoal.toLocaleString()} goal` },
            { label: 'Calories Burned', value: `${Math.round(stepsBase * 0.04)} kcal`, note: 'From walking' },
            { label: 'Distance', value: `${(stepsBase * 0.0005).toFixed(1)} miles`, note: 'Estimated' },
            { label: 'Active Minutes', value: `${Math.round(stepsBase / 100)} min`, note: 'Goal: 30 min' },
          ],
          recommendation: stepsStatus === 'Low' ? 'Try short 5-minute walks around the house. Consult your doctor for a safe activity plan.' : 'Try adding a 15-minute evening walk to reach your step goal consistently.'
        },
        history: [
          { date: 'Today', value: stepsBase.toLocaleString(), status: stepsStatus },
          { date: 'Yesterday', value: (stepsBase + 320).toLocaleString(), status: (stepsBase + 320) >= stepsGoal ? 'Goal Met' : (stepsBase + 320) >= stepsGoal * 0.5 ? 'Good' : 'Low' },
          { date: '2 days ago', value: (stepsBase - 150).toLocaleString(), status: (stepsBase - 150) >= stepsGoal ? 'Goal Met' : (stepsBase - 150) >= stepsGoal * 0.5 ? 'Good' : 'Low' },
          { date: '3 days ago', value: (stepsBase + 580).toLocaleString(), status: (stepsBase + 580) >= stepsGoal ? 'Goal Met' : (stepsBase + 580) >= stepsGoal * 0.5 ? 'Good' : 'Low' },
          { date: '4 days ago', value: (stepsBase - 400).toLocaleString(), status: (stepsBase - 400) >= stepsGoal ? 'Goal Met' : (stepsBase - 400) >= stepsGoal * 0.5 ? 'Good' : 'Low' },
          { date: '5 days ago', value: (stepsBase + 200).toLocaleString(), status: (stepsBase + 200) >= stepsGoal ? 'Goal Met' : (stepsBase + 200) >= stepsGoal * 0.5 ? 'Good' : 'Low' },
          { date: '6 days ago', value: (stepsBase + 700).toLocaleString(), status: (stepsBase + 700) >= stepsGoal ? 'Goal Met' : (stepsBase + 700) >= stepsGoal * 0.5 ? 'Good' : 'Low' },
        ]
      };
    })(),
    sleep: (() => {
      const sleepHrs = healthRisk?.risk_level === 'High' ? 5.2 : healthRisk?.risk_level === 'Medium' ? 6.3 : 7.5;
      const sleepStatus = sleepHrs >= 7 ? 'Excellent' : sleepHrs >= 6 ? 'Fair' : 'Poor';
      const deepPct = sleepHrs >= 7 ? 24 : sleepHrs >= 6 ? 16 : 10;
      const sleepScore = sleepHrs >= 7 ? 88 : sleepHrs >= 6 ? 62 : 38;
      return {
        icon: <BedDouble className="w-6 h-6" />,
        title: "Sleep",
        value: `${sleepHrs} hrs`,
        status: sleepStatus,
        color: "indigo",
        trend: sleepStatus === 'Excellent' ? 'Deep Sleep' : sleepStatus === 'Fair' ? 'Light Sleep' : 'Restless',
        description: sleepStatus === 'Excellent' ? 'Quality sleep achieved' : sleepStatus === 'Fair' ? 'Sleep could be improved' : 'Poor sleep — consult doctor',
        currentValue: sleepHrs,
        minValue: 5,
        maxValue: 9,
        details: {
          summary: sleepStatus === 'Excellent' ? 'Sleep quality has been excellent with a healthy balance of deep and REM sleep cycles.' : sleepStatus === 'Fair' ? 'Sleep quality is fair. You may benefit from a more consistent sleep schedule.' : 'Sleep quality is poor. Health conditions may be affecting your rest. Discuss with your doctor.',
          metrics: [
            { label: 'Total Sleep', value: `${sleepHrs} hrs`, note: `Recommended: 7-9 hrs${sleepHrs < 7 ? ' ⚠' : ' ✓'}` },
            { label: 'Deep Sleep', value: `${(sleepHrs * deepPct / 100).toFixed(1)} hrs`, note: `${deepPct}% — ${deepPct >= 20 ? 'Excellent' : deepPct >= 15 ? 'Fair' : 'Low'}` },
            { label: 'REM Sleep', value: `${(sleepHrs * 0.2).toFixed(1)} hrs`, note: '20% — Normal' },
            { label: 'Sleep Score', value: `${sleepScore}/100`, note: sleepScore >= 80 ? 'Above average' : sleepScore >= 50 ? 'Below average' : 'Needs attention' },
          ],
          recommendation: sleepStatus === 'Excellent' ? 'Maintain your consistent sleep schedule. Avoid screens 30 minutes before bed.' : 'Try to maintain a consistent bedtime. Avoid caffeine after noon and keep the bedroom cool and dark.'
        },
        history: [
          { date: 'Today', value: `${sleepHrs} hrs`, status: sleepStatus },
          { date: 'Yesterday', value: `${(sleepHrs - 0.3).toFixed(1)} hrs`, status: (sleepHrs - 0.3) >= 7 ? 'Excellent' : (sleepHrs - 0.3) >= 6 ? 'Fair' : 'Poor' },
          { date: '2 days ago', value: `${(sleepHrs + 0.5).toFixed(1)} hrs`, status: (sleepHrs + 0.5) >= 7 ? 'Excellent' : (sleepHrs + 0.5) >= 6 ? 'Fair' : 'Poor' },
          { date: '3 days ago', value: `${(sleepHrs - 0.7).toFixed(1)} hrs`, status: (sleepHrs - 0.7) >= 7 ? 'Excellent' : (sleepHrs - 0.7) >= 6 ? 'Fair' : 'Poor' },
          { date: '4 days ago', value: `${(sleepHrs + 0.1).toFixed(1)} hrs`, status: (sleepHrs + 0.1) >= 7 ? 'Excellent' : (sleepHrs + 0.1) >= 6 ? 'Fair' : 'Poor' },
          { date: '5 days ago', value: `${(sleepHrs - 0.2).toFixed(1)} hrs`, status: (sleepHrs - 0.2) >= 7 ? 'Excellent' : (sleepHrs - 0.2) >= 6 ? 'Fair' : 'Poor' },
          { date: '6 days ago', value: `${(sleepHrs + 0.3).toFixed(1)} hrs`, status: (sleepHrs + 0.3) >= 7 ? 'Excellent' : (sleepHrs + 0.3) >= 6 ? 'Fair' : 'Poor' },
        ]
      };
    })()
  };


  // Render different modules based on selection
  const renderModuleContent = () => {
    const moduleProps = {
      isDarkMode, setActiveModule, userName,
      // Vitals & Health
      healthMetrics, hr, sbp, dbp, gl, sp, tp,
      bpStatus, hrStatus, glStatus, spStatus,
      healthRisk, healthRiskLoading, anomalyResult, liveVitals,
      cognitiveAssessment,
      // Reports
      reportPeriod, setReportPeriod, reportDropdownOpen, setReportDropdownOpen,
      downloadVitalsReport, setShowAIInsights, setVitalCardModal,
      reportStartDate, setReportStartDate, reportEndDate, setReportEndDate,
      selectedReportType, setSelectedReportType, generateHealthReport,
      setShowHealthTrends, allReportsData, setShowAllReports,
      getReportIcon, setViewingReport, downloadSingleReport,
      // Activities
      activityProgress, scheduleItems, scheduleReminders,
      setShowProgressModal, setShowReminderModal, setScheduleDetailItem,
      setScheduleItems, openGame, startExercise,
      // Diet
      meals, mealsLoading, mealTotals,
      setShowAddMealModal, setMealDetailModal, handleLogMeal,
      getMealColor, getMealIcon,
      nutritionLoading, nutritionRecs, showAllTips, setShowAllTips,
      // Medications
      medications, medSummary, medsLoading, medHistory, medRefills,
      setShowAddMedModal, setShowMedHistory, setShowScheduleRefill,
      handleMarkMedication, handleSetReminder, getMedColor,
      // Panic
      sosHolding, setSosHolding, sosProgress, setSosProgress,
      sosTriggered, setSosTriggered, sosCooldown, setSosCooldown,
      sosNotifications, setSosNotifications,
      // Telemedicine
      doctors, doctorsLoading, appointments, appointmentsLoading,
      apptDoctor, setApptDoctor, apptDate, setApptDate,
      apptPeriod, setApptPeriod, apptSlot, setApptSlot,
      apptNotes, setApptNotes, apptLoading, apptMsg,
      doctorDropdownOpen, setDoctorDropdownOpen,
      timeDropdownOpen, setTimeDropdownOpen,
      handleBookAppointment,
      // VR
      vrExperiences, startVRSession, setShowVRHistory, vrStats,
      // Notifications
      notifications,
    };

    switch(activeModule) {
      case 'dashboard':
        return <DashboardHome {...moduleProps} />;
      case 'vitals':
        return <VitalsMonitoring {...moduleProps} />;
      case 'health-reports':
        return <HealthReports {...moduleProps} />;
      case 'activities':
        return <CognitiveActivities {...moduleProps} />;
      case 'diet':
        return <DietPlan {...moduleProps} />;
      case 'medication':
        return <MedicationManagement {...moduleProps} />;
      case 'panic':
        return <PanicButton {...moduleProps} />;
      case 'telemedicine-schedule':
        return <TelemedicineSchedule {...moduleProps} />;
      case 'vr':
        return <VREngagement {...moduleProps} />;
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
            <div className={`rounded-xl p-4 backdrop-blur-xl ${
              isDarkMode
                ? 'bg-gradient-to-br from-gray-900/50 to-gray-950/30 border border-gray-800/50'
                : 'bg-gradient-to-br from-white/80 to-rose-50/80 border border-gray-200/50'
            }`}>
              <h2 className={`text-xl font-bold mb-3 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                {modules.find(m => m.id === activeModule)?.name}
              </h2>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Module content coming soon...
              </p>
            </div>
            <BeautifulFooter isDarkMode={isDarkMode} setActiveModule={setActiveModule} />
          </>
        );
    }
  };

  return (
    <div className={`h-screen overflow-hidden transition-all duration-500 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-950 via-gray-900 to-rose-950/30' 
        : 'bg-gradient-to-br from-rose-50 via-white to-blue-50'
    }`}>
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
        /* Hide scrollbar for Chrome, Safari and Opera */
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        /* Hide scrollbar for IE, Edge and Firefox */
        .scrollbar-hide {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
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
      `}</style>

      <DashboardNavbar 
        isDarkMode={isDarkMode}
        onToggleDarkMode={handleDarkModeToggle}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        isSidebarOpen={isSidebarOpen}
        dashboardName={getDashboardName()}
        onLogout={onLogout}
        showSidebarToggle={true}
        onSettingsClick={() => setActiveModule('settings')}
        onProfileClick={() => setActiveModule('settings')}
        notifications={notifications}
        onMarkNotificationRead={markNotificationRead}
        onMarkAllRead={markAllNotificationsRead}
        onClearNotification={clearNotification}
      />

      <div className="flex relative h-[calc(100vh-4rem)]">
        {/* Sidebar - Fixed with lower z-index (40) */}
        <div className={`transition-all duration-300 flex flex-col fixed lg:relative z-40 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${isDarkMode ? 'bg-gray-950/95' : 'bg-white/95'} backdrop-blur-xl h-[calc(100vh-4rem)] w-56 md:w-64 lg:w-56 xl:w-64 border-r ${
          isDarkMode ? 'border-gray-800' : 'border-gray-200'
        }`}>
          {/* Sidebar Header */}
          <div className="p-3 border-b border-gray-800/50 flex-shrink-0 relative">
            <div className="flex items-center gap-2 mb-3">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center overflow-hidden ${
                isDarkMode ? 'bg-rose-950/40' : 'bg-gradient-to-r from-rose-100 to-pink-100'
              }`}>
                {userPhoto ? (
                  <img src={userPhoto} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className={isDarkMode ? 'text-rose-400' : 'text-rose-600'} size={18} />
                )}
              </div>
              <div>
                <h2 className={`font-bold text-sm ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                  {userName}
                </h2>
                <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                  Elderly User
                </p>
              </div>
            </div>
            
            {/* Mobile close button */}
            {isMobile && (
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-gray-800/50 transition-colors"
              >
                <X size={16} className={isDarkMode ? 'text-gray-500' : 'text-gray-600'} />
              </button>
            )}
          </div>

          {/* Navigation Modules - Scrollable area that fills available space */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-hide">
            {modules.map((module) => (
              <button
                key={module.id}
                onClick={() => {
                  setActiveModule(module.id);
                  if (isMobile) setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between p-2.5 rounded-lg transition-all duration-200 text-left ${
                  activeModule === module.id
                    ? isDarkMode
                      ? `bg-${module.color}-950/40 text-${module.color}-300 border-l-2 border-${module.color}-500`
                      : `bg-${module.color}-100 text-${module.color}-700 border-l-2 border-${module.color}-500`
                    : isDarkMode
                    ? 'hover:bg-gray-800/50 text-gray-400'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={activeModule === module.id ? `text-${module.color}-500` : ''}>
                    {module.icon}
                  </div>
                  <span className="font-medium text-sm">{module.name}</span>
                </div>
                {activeModule === module.id && (
                  <ChevronRight size={12} className={isDarkMode ? 'text-gray-500' : 'text-gray-500'} />
                )}
              </button>
            ))}
          </div>

          {/* Sidebar Footer - Updated with sticky positioning */}
          <div className="sticky bottom-0 p-3 border-t border-gray-800/50 bg-inherit">
            <div className={`text-center p-2 rounded-lg ${
              isDarkMode ? 'bg-gray-900/40' : 'bg-rose-50/50'
            }`}>
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className={`text-xs font-medium ${isDarkMode ? 'text-emerald-300' : 'text-emerald-700'}`}>
                  System Active
                </span>
              </div>
              <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                24/7 Health Monitoring
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className={`flex-1 transition-all duration-300 overflow-y-auto ${
          isSidebarOpen ? 'ml-0 lg:ml-0' : 'ml-0'
        }`}>
          <main className="p-4 sm:p-6">
            {/* Only showing module content */}
            {renderModuleContent()}
          </main>
        </div>

        {/* Overlay for mobile sidebar - Lower z-index (30) */}
        {isSidebarOpen && isMobile && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </div>

      {/* ===== Add Meal Modal ===== */}
      {showAddMealModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className={`relative w-full max-w-lg rounded-3xl p-6 border-2 shadow-2xl ${
            isDarkMode
              ? 'bg-gray-900 border-cyan-800/40'
              : 'bg-white border-cyan-200'
          }`}>
            <button onClick={() => setShowAddMealModal(false)} className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}>
              <X className="w-5 h-5" />
            </button>
            <h3 className={`text-xl font-bold mb-5 flex items-center gap-2 ${isDarkMode ? 'text-cyan-300' : 'text-cyan-600'}`}>
              <Plus className="w-5 h-5" /> Add New Meal
            </h3>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
              <div>
                <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Meal Name *</label>
                <input type="text" value={newMeal.name} onChange={e => setNewMeal({...newMeal, name: e.target.value})}
                  placeholder="Meal name"
                  className={`w-full px-4 py-2.5 rounded-xl border transition-colors ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white focus:border-cyan-500' : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-cyan-400'}`}
                  />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Meal Type</label>
                  <select value={newMeal.mealType} onChange={e => setNewMeal({...newMeal, mealType: e.target.value})}
                    className={`w-full px-4 py-2.5 rounded-xl border transition-colors ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}>
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="snack">Snack</option>
                    <option value="dinner">Dinner</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Scheduled Time</label>
                  <input type="text" value={newMeal.scheduledTime} onChange={e => setNewMeal({...newMeal, scheduledTime: e.target.value})}
                    placeholder="Time"
                    className={`w-full px-4 py-2.5 rounded-xl border transition-colors ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                    />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Calories</label>
                  <input type="number" value={newMeal.calories} onChange={e => setNewMeal({...newMeal, calories: Number(e.target.value)})}
                    className={`w-full px-4 py-2.5 rounded-xl border transition-colors ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`} />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Protein (g)</label>
                  <input type="number" value={newMeal.protein} onChange={e => setNewMeal({...newMeal, protein: Number(e.target.value)})}
                    className={`w-full px-4 py-2.5 rounded-xl border transition-colors ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Carbs (g)</label>
                  <input type="number" value={newMeal.carbs} onChange={e => setNewMeal({...newMeal, carbs: Number(e.target.value)})}
                    className={`w-full px-4 py-2.5 rounded-xl border transition-colors ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`} />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Fats (g)</label>
                  <input type="number" value={newMeal.fats} onChange={e => setNewMeal({...newMeal, fats: Number(e.target.value)})}
                    className={`w-full px-4 py-2.5 rounded-xl border transition-colors ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`} />
                </div>
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Notes</label>
                <textarea value={newMeal.notes} onChange={e => setNewMeal({...newMeal, notes: e.target.value})} rows={2}
                  placeholder="Notes"
                  className={`w-full px-4 py-2.5 rounded-xl border transition-colors resize-none ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                  />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowAddMealModal(false)}
                className={`flex-1 py-3 rounded-xl font-medium transition-all ${isDarkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                Cancel
              </button>
              <button onClick={handleAddMeal}
                className="flex-1 py-3 rounded-xl font-medium bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600 transition-all hover:scale-105">
                Add Meal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== Add Medication Modal ===== */}
      {showAddMedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className={`relative w-full max-w-lg rounded-3xl p-6 border-2 shadow-2xl ${
            isDarkMode
              ? 'bg-gray-900 border-cyan-800/40'
              : 'bg-white border-cyan-200'
          }`}>
            <button onClick={() => setShowAddMedModal(false)} className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}>
              <X className="w-5 h-5" />
            </button>
            <h3 className={`text-xl font-bold mb-5 flex items-center gap-2 ${isDarkMode ? 'text-cyan-300' : 'text-cyan-600'}`}>
              <Plus className="w-5 h-5" /> Add New Medication
            </h3>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
              <div>
                <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Medication Name *</label>
                <input type="text" value={newMed.name} onChange={e => setNewMed({...newMed, name: e.target.value})}
                  placeholder="Medication name"
                  className={`w-full px-4 py-2.5 rounded-xl border transition-colors ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white focus:border-cyan-500' : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-cyan-400'}`}
                  />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Type</label>
                  <input type="text" value={newMed.type} onChange={e => setNewMed({...newMed, type: e.target.value})}
                    placeholder="Type"
                    className={`w-full px-4 py-2.5 rounded-xl border transition-colors ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                    />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Dosage *</label>
                  <input type="text" value={newMed.dosage} onChange={e => setNewMed({...newMed, dosage: e.target.value})}
                    placeholder="Dosage"
                    className={`w-full px-4 py-2.5 rounded-xl border transition-colors ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                    />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Frequency</label>
                  <select value={newMed.frequency} onChange={e => setNewMed({...newMed, frequency: e.target.value})}
                    className={`w-full px-4 py-2.5 rounded-xl border transition-colors ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}>
                    <option value="daily">Daily</option>
                    <option value="twice-daily">Twice Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="as-needed">As Needed</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Scheduled Time</label>
                  <input type="text" value={newMed.scheduledTime} onChange={e => setNewMed({...newMed, scheduledTime: e.target.value})}
                    placeholder="Time"
                    className={`w-full px-4 py-2.5 rounded-xl border transition-colors ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                    />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Prescribed By</label>
                  <input type="text" value={newMed.prescribedBy} onChange={e => setNewMed({...newMed, prescribedBy: e.target.value})}
                    placeholder="Doctor name"
                    className={`w-full px-4 py-2.5 rounded-xl border transition-colors ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                    />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Refill Date</label>
                  <input type="date" value={newMed.refillDate} onChange={e => setNewMed({...newMed, refillDate: e.target.value})}
                    className={`w-full px-4 py-2.5 rounded-xl border transition-colors ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`} />
                </div>
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Notes</label>
                <textarea value={newMed.notes} onChange={e => setNewMed({...newMed, notes: e.target.value})} rows={2}
                  placeholder="Notes"
                  className={`w-full px-4 py-2.5 rounded-xl border transition-colors resize-none ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                  />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowAddMedModal(false)}
                className={`flex-1 py-3 rounded-xl font-medium transition-all ${isDarkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                Cancel
              </button>
              <button onClick={handleAddMedication}
                className="flex-1 py-3 rounded-xl font-medium bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600 transition-all hover:scale-105">
                Add Medication
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== Meal Detail Modal ===== */}
      {mealDetailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className={`relative w-full max-w-md rounded-3xl p-6 border-2 shadow-2xl ${
            isDarkMode
              ? 'bg-gray-900 border-cyan-800/40'
              : 'bg-white border-cyan-200'
          }`}>
            <button onClick={() => setMealDetailModal(null)} className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}>
              <X className="w-5 h-5" />
            </button>
            <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-cyan-300' : 'text-cyan-600'}`}>
              {mealDetailModal.name}
            </h3>
            <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-4 ${
              isDarkMode ? 'bg-cyan-900/30 text-cyan-300' : 'bg-cyan-100 text-cyan-700'
            }`}>
              {mealDetailModal.mealType?.charAt(0).toUpperCase() + mealDetailModal.mealType?.slice(1)} &bull; {mealDetailModal.scheduledTime}
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {[
                { label: 'Calories', value: `${mealDetailModal.calories || 0} cal`, color: 'orange' },
                { label: 'Protein', value: `${mealDetailModal.protein || 0}g`, color: 'blue' },
                { label: 'Carbs', value: `${mealDetailModal.carbs || 0}g`, color: 'amber' },
                { label: 'Fats', value: `${mealDetailModal.fats || 0}g`, color: 'red' },
              ].map((item, i) => (
                <div key={i} className={`p-3 rounded-xl border ${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                  <div className={`text-xs mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{item.label}</div>
                  <div className={`text-lg font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{item.value}</div>
                </div>
              ))}
            </div>
            <div className={`flex items-center gap-2 mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <span className="text-sm font-medium">Status:</span>
              <span className={`text-sm px-2 py-0.5 rounded-full ${
                mealDetailModal.status === 'consumed'
                  ? isDarkMode ? 'bg-emerald-900/30 text-emerald-300' : 'bg-emerald-100 text-emerald-700'
                  : isDarkMode ? 'bg-amber-900/30 text-amber-300' : 'bg-amber-100 text-amber-700'
              }`}>
                {mealDetailModal.status === 'consumed' ? 'Consumed' : 'Upcoming'}
              </span>
            </div>
            <div className={`flex items-center gap-2 mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <span className="text-sm font-medium">Approval:</span>
              <span className={`text-sm px-2 py-0.5 rounded-full font-semibold ${
                mealDetailModal.approvalStatus === 'approved'
                  ? isDarkMode ? 'bg-emerald-900/30 text-emerald-300' : 'bg-emerald-100 text-emerald-700'
                  : mealDetailModal.approvalStatus === 'rejected'
                  ? isDarkMode ? 'bg-rose-900/30 text-rose-300' : 'bg-rose-100 text-rose-700'
                  : isDarkMode ? 'bg-amber-900/30 text-amber-300' : 'bg-amber-100 text-amber-700'
              }`}>
                {mealDetailModal.approvalStatus === 'approved' ? `✅ Approved${mealDetailModal.approvedBy ? ` by ${mealDetailModal.approvedBy.firstName || ''}` : ''}` 
                  : mealDetailModal.approvalStatus === 'rejected' ? `❌ Rejected${mealDetailModal.approvedBy ? ` by ${mealDetailModal.approvedBy.firstName || ''}` : ''}` 
                  : '⏳ Pending Approval'}
              </span>
            </div>
            {mealDetailModal.notes && (
              <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
                <div className={`text-xs mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Notes</div>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{mealDetailModal.notes}</p>
              </div>
            )}
            <button onClick={() => setMealDetailModal(null)}
              className={`w-full mt-4 py-3 rounded-xl font-medium transition-all ${isDarkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* ===== Health Trends Modal ===== */}
      {showHealthTrends && (() => {
        const heartRateData = [
          { day: 'Mon', value: 74, min: 62, max: 88 },
          { day: 'Tue', value: 71, min: 60, max: 85 },
          { day: 'Wed', value: 76, min: 64, max: 92 },
          { day: 'Thu', value: 73, min: 61, max: 87 },
          { day: 'Fri', value: 70, min: 58, max: 84 },
          { day: 'Sat', value: 72, min: 60, max: 86 },
          { day: 'Sun', value: 72, min: 63, max: 85 },
        ];
        const bpData = [
          { day: 'Mon', systolic: 122, diastolic: 82 },
          { day: 'Tue', systolic: 118, diastolic: 78 },
          { day: 'Wed', systolic: 125, diastolic: 84 },
          { day: 'Thu', systolic: 119, diastolic: 79 },
          { day: 'Fri', systolic: 121, diastolic: 81 },
          { day: 'Sat', systolic: 120, diastolic: 80 },
          { day: 'Sun', systolic: 120, diastolic: 80 },
        ];
        const glucoseData = [
          { day: 'Mon', fasting: 98, postMeal: 135 },
          { day: 'Tue', fasting: 95, postMeal: 128 },
          { day: 'Wed', fasting: 102, postMeal: 140 },
          { day: 'Thu', fasting: 94, postMeal: 125 },
          { day: 'Fri', fasting: 96, postMeal: 130 },
          { day: 'Sat', fasting: 93, postMeal: 122 },
          { day: 'Sun', fasting: 95, postMeal: 130 },
        ];
        const sleepData = [
          { day: 'Mon', deep: 1.8, rem: 1.5, light: 4.2 },
          { day: 'Tue', deep: 1.5, rem: 1.3, light: 4.4 },
          { day: 'Wed', deep: 2.0, rem: 1.6, light: 4.4 },
          { day: 'Thu', deep: 1.2, rem: 1.4, light: 4.2 },
          { day: 'Fri', deep: 1.6, rem: 1.5, light: 4.3 },
          { day: 'Sat', deep: 1.4, rem: 1.2, light: 4.5 },
          { day: 'Sun', deep: 1.8, rem: 1.5, light: 4.2 },
        ];
        const spo2Data = [
          { day: 'Mon', value: 98 },
          { day: 'Tue', value: 97 },
          { day: 'Wed', value: 98 },
          { day: 'Thu', value: 97 },
          { day: 'Fri', value: 99 },
          { day: 'Sat', value: 98 },
          { day: 'Sun', value: 98 },
        ];
        const activityData = [
          { day: 'Mon', steps: 4200, calories: 180 },
          { day: 'Tue', steps: 3800, calories: 160 },
          { day: 'Wed', steps: 5100, calories: 220 },
          { day: 'Thu', steps: 3450, calories: 148 },
          { day: 'Fri', steps: 4800, calories: 205 },
          { day: 'Sat', steps: 2650, calories: 112 },
          { day: 'Sun', steps: 3456, calories: 142 },
        ];
        const overallScoreData = [
          { name: 'Heart', value: 92, fill: '#f43f5e' },
          { name: 'BP', value: 95, fill: '#3b82f6' },
          { name: 'Glucose', value: 88, fill: '#10b981' },
          { name: 'Sleep', value: 90, fill: '#6366f1' },
          { name: 'SpO2', value: 97, fill: '#8b5cf6' },
          { name: 'Activity', value: 72, fill: '#f59e0b' },
        ];
        const chartCardClass = `rounded-2xl p-5 backdrop-blur-xl border transition-all duration-300 ${
          isDarkMode
            ? 'bg-gray-900/60 border-gray-700/40'
            : 'bg-white/90 border-gray-200/60 shadow-lg shadow-gray-100/50'
        }`;
        const chartTitleClass = `text-base font-bold mb-1 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`;
        const chartSubClass = `text-xs mb-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`;
        const gridColor = isDarkMode ? '#1f2937' : '#f3f4f6';
        const axisColor = isDarkMode ? '#6b7280' : '#9ca3af';
        const CustomTooltip = ({ active, payload, label }) => {
          if (active && payload && payload.length) {
            return (
              <div className={`rounded-xl p-3 border shadow-xl backdrop-blur-md ${isDarkMode ? 'bg-gray-900/95 border-gray-700 text-gray-200' : 'bg-white/95 border-gray-200 text-gray-800'}`}>
                <p className="text-xs font-bold mb-1">{label}</p>
                {payload.map((entry, i) => (
                  <p key={i} className="text-xs" style={{ color: entry.color }}>
                    {entry.name}: <span className="font-semibold">{entry.value}</span>
                  </p>
                ))}
              </div>
            );
          }
          return null;
        };

        return (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setShowHealthTrends(false)}>
            <div onClick={(e) => e.stopPropagation()} className={`relative w-full max-w-6xl flex flex-col rounded-3xl border-2 shadow-2xl overflow-hidden ${
              isDarkMode ? 'bg-gray-950 border-blue-800/40' : 'bg-gradient-to-br from-gray-50 to-white border-blue-200'
            }`} style={{ maxHeight: '90vh' }}>
              {/* Header */}
              <div className={`flex-shrink-0 p-6 pb-4 border-b ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
                <button onClick={() => setShowHealthTrends(false)} className={`absolute top-4 right-4 p-2 rounded-full transition-all duration-200 hover:scale-110 z-10 ${
                  isDarkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
                }`}>
                  <X size={20} />
                </button>
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-2xl ${isDarkMode ? 'bg-blue-900/40' : 'bg-gradient-to-br from-blue-100 to-indigo-100'}`}>
                    <BarChart3 className={`w-6 h-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                  </div>
                  <div>
                    <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Health Trends Overview</h2>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>7-day trends across all vitals — Week of Mar 9 - Mar 15, 2026</p>
                  </div>
                </div>
              </div>

              {/* Scrollable Charts Grid */}
              <div className="flex-1 overflow-y-auto p-6 pt-4">
                {/* Summary Score Card */}
                <div className={`rounded-2xl p-5 mb-5 border ${isDarkMode ? 'bg-gradient-to-r from-blue-950/40 to-indigo-950/30 border-blue-800/30' : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200/60'}`}>
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="flex-1">
                      <p className={`text-sm font-medium mb-1 ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>Weekly Health Score</p>
                      <p className={`text-5xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>{Math.round([92, 95, 88, 90, 97, 72].reduce((a, b) => a + b, 0) / 6)}<span className="text-xl">/100</span></p>
                      <p className={`text-xs mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        <span className="text-emerald-500 font-medium">+3 pts</span> from last week — All vitals within healthy ranges
                      </p>
                    </div>
                    <div className="w-full md:w-64 h-40">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadialBarChart cx="50%" cy="50%" innerRadius="30%" outerRadius="90%" data={overallScoreData} startAngle={180} endAngle={0}>
                          <RadialBar background={{ fill: isDarkMode ? '#1f2937' : '#f3f4f6' }} dataKey="value" cornerRadius={6} />
                          <RTooltip content={<CustomTooltip />} />
                        </RadialBarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex flex-wrap gap-2 md:flex-col">
                      {overallScoreData.map((d, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.fill }}></div>
                          <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{d.name}: <span className="font-semibold">{d.value}%</span></span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {/* Heart Rate Chart */}
                  <div className={chartCardClass}>
                    <div className="flex items-center gap-2 mb-1">
                      <Heart className={`w-4 h-4 ${isDarkMode ? 'text-rose-400' : 'text-rose-500'}`} />
                      <h4 className={chartTitleClass}>Heart Rate</h4>
                    </div>
                    <p className={chartSubClass}>Resting avg, min & max range (BPM)</p>
                    <div className="h-52">
                      <ResponsiveContainer width="100%" height="100%">
                        <RAreaChart data={heartRateData}>
                          <defs>
                            <linearGradient id="hrGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                          <XAxis dataKey="day" tick={{ fontSize: 11, fill: axisColor }} axisLine={false} tickLine={false} />
                          <YAxis domain={[55, 95]} tick={{ fontSize: 11, fill: axisColor }} axisLine={false} tickLine={false} />
                          <RTooltip content={<CustomTooltip />} />
                          <Area type="monotone" dataKey="max" stroke="transparent" fill="#fda4af" fillOpacity={isDarkMode ? 0.15 : 0.2} name="Max" />
                          <Area type="monotone" dataKey="value" stroke="#f43f5e" strokeWidth={2.5} fill="url(#hrGrad)" name="Avg HR" dot={{ r: 4, fill: '#f43f5e', strokeWidth: 2, stroke: isDarkMode ? '#111827' : '#fff' }} />
                          <Area type="monotone" dataKey="min" stroke="transparent" fill="#fda4af" fillOpacity={isDarkMode ? 0.08 : 0.1} name="Min" />
                        </RAreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Blood Pressure Chart */}
                  <div className={chartCardClass}>
                    <div className="flex items-center gap-2 mb-1">
                      <Activity className={`w-4 h-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`} />
                      <h4 className={chartTitleClass}>Blood Pressure</h4>
                    </div>
                    <p className={chartSubClass}>Systolic & Diastolic (mmHg)</p>
                    <div className="h-52">
                      <ResponsiveContainer width="100%" height="100%">
                        <RLineChart data={bpData}>
                          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                          <XAxis dataKey="day" tick={{ fontSize: 11, fill: axisColor }} axisLine={false} tickLine={false} />
                          <YAxis domain={[70, 135]} tick={{ fontSize: 11, fill: axisColor }} axisLine={false} tickLine={false} />
                          <RTooltip content={<CustomTooltip />} />
                          <Line type="monotone" dataKey="systolic" stroke="#3b82f6" strokeWidth={2.5} name="Systolic" dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: isDarkMode ? '#111827' : '#fff' }} />
                          <Line type="monotone" dataKey="diastolic" stroke="#60a5fa" strokeWidth={2.5} strokeDasharray="5 5" name="Diastolic" dot={{ r: 4, fill: '#60a5fa', strokeWidth: 2, stroke: isDarkMode ? '#111827' : '#fff' }} />
                        </RLineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Glucose Chart */}
                  <div className={chartCardClass}>
                    <div className="flex items-center gap-2 mb-1">
                      <ActivitySquare className={`w-4 h-4 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-500'}`} />
                      <h4 className={chartTitleClass}>Blood Glucose</h4>
                    </div>
                    <p className={chartSubClass}>Fasting & Post-Meal (mg/dL)</p>
                    <div className="h-52">
                      <ResponsiveContainer width="100%" height="100%">
                        <RAreaChart data={glucoseData}>
                          <defs>
                            <linearGradient id="glucFast" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="glucPost" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#6ee7b7" stopOpacity={0.2} />
                              <stop offset="95%" stopColor="#6ee7b7" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                          <XAxis dataKey="day" tick={{ fontSize: 11, fill: axisColor }} axisLine={false} tickLine={false} />
                          <YAxis domain={[80, 150]} tick={{ fontSize: 11, fill: axisColor }} axisLine={false} tickLine={false} />
                          <RTooltip content={<CustomTooltip />} />
                          <Area type="monotone" dataKey="postMeal" stroke="#6ee7b7" strokeWidth={2} fill="url(#glucPost)" name="Post-Meal" dot={{ r: 3, fill: '#6ee7b7', strokeWidth: 2, stroke: isDarkMode ? '#111827' : '#fff' }} />
                          <Area type="monotone" dataKey="fasting" stroke="#10b981" strokeWidth={2.5} fill="url(#glucFast)" name="Fasting" dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: isDarkMode ? '#111827' : '#fff' }} />
                        </RAreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Sleep Chart */}
                  <div className={chartCardClass}>
                    <div className="flex items-center gap-2 mb-1">
                      <BedDouble className={`w-4 h-4 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-500'}`} />
                      <h4 className={chartTitleClass}>Sleep Breakdown</h4>
                    </div>
                    <p className={chartSubClass}>Deep, REM & Light sleep (hours)</p>
                    <div className="h-52">
                      <ResponsiveContainer width="100%" height="100%">
                        <RBarChart data={sleepData} barCategoryGap="20%">
                          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                          <XAxis dataKey="day" tick={{ fontSize: 11, fill: axisColor }} axisLine={false} tickLine={false} />
                          <YAxis tick={{ fontSize: 11, fill: axisColor }} axisLine={false} tickLine={false} />
                          <RTooltip content={<CustomTooltip />} />
                          <Bar dataKey="deep" stackId="sleep" fill="#4f46e5" radius={[0, 0, 0, 0]} name="Deep" />
                          <Bar dataKey="rem" stackId="sleep" fill="#818cf8" name="REM" />
                          <Bar dataKey="light" stackId="sleep" fill="#c7d2fe" radius={[4, 4, 0, 0]} name="Light" />
                        </RBarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* SpO2 Chart */}
                  <div className={chartCardClass}>
                    <div className="flex items-center gap-2 mb-1">
                      <Droplets className={`w-4 h-4 ${isDarkMode ? 'text-purple-400' : 'text-purple-500'}`} />
                      <h4 className={chartTitleClass}>Oxygen Saturation (SpO2)</h4>
                    </div>
                    <p className={chartSubClass}>Daily readings (%)</p>
                    <div className="h-52">
                      <ResponsiveContainer width="100%" height="100%">
                        <RAreaChart data={spo2Data}>
                          <defs>
                            <linearGradient id="spo2Grad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                          <XAxis dataKey="day" tick={{ fontSize: 11, fill: axisColor }} axisLine={false} tickLine={false} />
                          <YAxis domain={[94, 100]} tick={{ fontSize: 11, fill: axisColor }} axisLine={false} tickLine={false} />
                          <RTooltip content={<CustomTooltip />} />
                          <Area type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={2.5} fill="url(#spo2Grad)" name="SpO2" dot={{ r: 4, fill: '#8b5cf6', strokeWidth: 2, stroke: isDarkMode ? '#111827' : '#fff' }} />
                        </RAreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Activity / Steps Chart */}
                  <div className={chartCardClass}>
                    <div className="flex items-center gap-2 mb-1">
                      <Dumbbell className={`w-4 h-4 ${isDarkMode ? 'text-amber-400' : 'text-amber-500'}`} />
                      <h4 className={chartTitleClass}>Physical Activity</h4>
                    </div>
                    <p className={chartSubClass}>Steps & Calories burned</p>
                    <div className="h-52">
                      <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={activityData} barCategoryGap="20%">
                          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                          <XAxis dataKey="day" tick={{ fontSize: 11, fill: axisColor }} axisLine={false} tickLine={false} />
                          <YAxis yAxisId="left" tick={{ fontSize: 11, fill: axisColor }} axisLine={false} tickLine={false} />
                          <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: axisColor }} axisLine={false} tickLine={false} />
                          <RTooltip content={<CustomTooltip />} />
                          <Bar yAxisId="left" dataKey="steps" fill={isDarkMode ? '#fbbf24' : '#f59e0b'} radius={[6, 6, 0, 0]} name="Steps" />
                          <Line yAxisId="right" type="monotone" dataKey="calories" stroke="#ef4444" strokeWidth={2} name="Calories" dot={{ r: 3, fill: '#ef4444' }} />
                        </ComposedChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* AI Summary */}
                <div className={`mt-5 rounded-2xl p-5 border-l-4 ${isDarkMode ? 'bg-blue-950/20 border-blue-500/50' : 'bg-blue-50/80 border-blue-400'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className={`w-4 h-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                    <p className={`text-sm font-bold ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>AI Weekly Summary</p>
                  </div>
                  <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Your vitals have been consistently within healthy ranges this week. Heart rate and blood pressure are stable. Glucose management shows a positive downward trend. Sleep quality is excellent with good deep-sleep ratios. Consider increasing daily steps to meet your 5,000-step goal — a short evening walk could help.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ===== Vital Card Details/History Modal ===== */}
      {vitalCardModal.open && healthMetrics[vitalCardModal.key] && (() => {
        const metric = healthMetrics[vitalCardModal.key];
        const tab = vitalCardModal.tab;
        return (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setVitalCardModal({ open: false, key: null, tab: 'details' })}>
            <div onClick={(e) => e.stopPropagation()} className={`relative w-full max-w-lg flex flex-col rounded-3xl border-2 shadow-2xl overflow-hidden ${
              isDarkMode ? 'bg-gray-900 border-gray-700/50' : 'bg-white border-gray-200'
            }`} style={{ maxHeight: '85vh' }}>
              {/* Header */}
              <div className={`flex-shrink-0 p-5 pb-4 border-b ${isDarkMode ? 'border-gray-800' : 'border-gray-100'}`}>
                <button onClick={() => setVitalCardModal({ open: false, key: null, tab: 'details' })} className={`absolute top-4 right-4 p-2 rounded-full transition-all duration-200 hover:scale-110 z-10 ${
                  isDarkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
                }`}>
                  <X size={20} />
                </button>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-3 rounded-2xl ${isDarkMode ? getColorClass(metric.color, 'darkBg') : getColorClass(metric.color, 'bg')}`}>
                    <div className={isDarkMode ? getColorClass(metric.color, 'darkText') : getColorClass(metric.color, 'text')}>
                      {React.cloneElement(metric.icon, { size: 22 })}
                    </div>
                  </div>
                  <div>
                    <h2 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{metric.title}</h2>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{metric.value} · {metric.status}</p>
                  </div>
                </div>
                {/* Tabs */}
                <div className="flex gap-2">
                  <button onClick={() => setVitalCardModal(prev => ({ ...prev, tab: 'details' }))} className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    tab === 'details'
                      ? isDarkMode ? 'bg-gray-700 text-white shadow-md' : 'bg-gray-900 text-white shadow-md'
                      : isDarkMode ? 'bg-gray-800/50 text-gray-400 hover:text-gray-300' : 'bg-gray-100 text-gray-600 hover:text-gray-800'
                  }`}>
                    Details
                  </button>
                  <button onClick={() => setVitalCardModal(prev => ({ ...prev, tab: 'history' }))} className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    tab === 'history'
                      ? isDarkMode ? 'bg-gray-700 text-white shadow-md' : 'bg-gray-900 text-white shadow-md'
                      : isDarkMode ? 'bg-gray-800/50 text-gray-400 hover:text-gray-300' : 'bg-gray-100 text-gray-600 hover:text-gray-800'
                  }`}>
                    History
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-5 pt-4">
                {tab === 'details' ? (
                  <div className="space-y-4">
                    {/* Summary */}
                    <div className={`rounded-2xl p-4 border ${isDarkMode ? 'bg-gray-800/40 border-gray-700/40' : 'bg-gray-50 border-gray-100'}`}>
                      <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{metric.details.summary}</p>
                    </div>
                    {/* Metric Breakdown */}
                    <div className="space-y-2">
                      {metric.details.metrics.map((m, i) => (
                        <div key={i} className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-200 hover:shadow-sm ${
                          isDarkMode ? 'bg-gray-800/30 border-gray-700/30 hover:bg-gray-800/50' : 'bg-white border-gray-100 hover:border-gray-200'
                        }`}>
                          <div>
                            <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{m.label}</p>
                            <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>{m.note}</p>
                          </div>
                          <span className={`text-sm font-bold ${isDarkMode ? getColorClass(metric.color, 'darkText') : getColorClass(metric.color, 'text')}`}>{m.value}</span>
                        </div>
                      ))}
                    </div>
                    {/* Recommendation */}
                    <div className={`rounded-2xl p-4 border-l-4 ${isDarkMode ? 'bg-emerald-900/20 border-emerald-500/50' : 'bg-emerald-50 border-emerald-400'}`}>
                      <p className={`text-xs font-semibold mb-1 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>Recommendation</p>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{metric.details.recommendation}</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {/* History Table Header */}
                    <div className={`flex items-center justify-between px-3 py-2 rounded-xl ${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
                      <span className={`text-xs font-semibold uppercase tracking-wider ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Date</span>
                      <span className={`text-xs font-semibold uppercase tracking-wider ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Value</span>
                      <span className={`text-xs font-semibold uppercase tracking-wider ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Status</span>
                    </div>
                    {/* History Rows */}
                    {metric.history.map((h, i) => (
                      <div key={i} className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-200 ${
                        isDarkMode ? 'bg-gray-800/20 border-gray-700/30 hover:bg-gray-800/40' : 'bg-white border-gray-100 hover:bg-gray-50'
                      }`}>
                        <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{h.date}</span>
                        <span className={`text-sm font-bold ${isDarkMode ? getColorClass(metric.color, 'darkText') : getColorClass(metric.color, 'text')}`}>{h.value}</span>
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                          h.status === 'Excellent' || h.status === 'Optimal' || h.status === 'Goal Met'
                            ? isDarkMode ? 'bg-emerald-900/40 text-emerald-300' : 'bg-emerald-100 text-emerald-700'
                            : h.status === 'Normal' || h.status === 'Good'
                            ? isDarkMode ? 'bg-blue-900/40 text-blue-300' : 'bg-blue-100 text-blue-700'
                            : h.status === 'Fair' || h.status === 'In Progress'
                            ? isDarkMode ? 'bg-amber-900/40 text-amber-300' : 'bg-amber-100 text-amber-700'
                            : isDarkMode ? 'bg-red-900/40 text-red-300' : 'bg-red-100 text-red-700'
                        }`}>{h.status}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {/* ===== AI Insights Modal ===== */}
      {showAIInsights && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setShowAIInsights(false)}>
          <div onClick={(e) => e.stopPropagation()} className={`relative w-full max-w-2xl flex flex-col rounded-3xl border-2 shadow-2xl overflow-hidden ${
            isDarkMode
              ? 'bg-gray-900 border-emerald-800/40'
              : 'bg-white border-emerald-200'
          }`} style={{ maxHeight: '85vh' }}>
            {/* Fixed Header */}
            <div className={`flex-shrink-0 p-6 pb-4 border-b ${isDarkMode ? 'border-gray-800' : 'border-gray-100'}`}>
              <button onClick={() => setShowAIInsights(false)} className={`absolute top-4 right-4 p-2 rounded-full transition-all duration-200 hover:scale-110 z-10 ${
                isDarkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
              }`}>
                <X size={20} />
              </button>
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-2xl ${isDarkMode ? 'bg-emerald-900/40' : 'bg-gradient-to-br from-emerald-100 to-teal-100'}`}>
                  <Sparkles className={`w-6 h-6 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
                </div>
                <div>
                  <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>AI Health Insights</h2>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Personalized analysis based on your vitals data</p>
                </div>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 pt-4">
              {/* Overall Health Score */}
              <div className={`rounded-2xl p-5 mb-5 border ${
                isDarkMode
                  ? (healthRisk?.risk_level === 'High' ? 'bg-gradient-to-r from-red-900/30 to-red-900/20 border-red-800/30' : healthRisk?.risk_level === 'Medium' ? 'bg-gradient-to-r from-amber-900/30 to-amber-900/20 border-amber-800/30' : 'bg-gradient-to-r from-emerald-900/30 to-teal-900/20 border-emerald-800/30')
                  : (healthRisk?.risk_level === 'High' ? 'bg-gradient-to-r from-red-50 to-red-50 border-red-200/50' : healthRisk?.risk_level === 'Medium' ? 'bg-gradient-to-r from-amber-50 to-amber-50 border-amber-200/50' : 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200/50')
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-medium mb-1 ${isDarkMode ? (healthRisk?.risk_level === 'High' ? 'text-red-300' : healthRisk?.risk_level === 'Medium' ? 'text-amber-300' : 'text-emerald-300') : (healthRisk?.risk_level === 'High' ? 'text-red-700' : healthRisk?.risk_level === 'Medium' ? 'text-amber-700' : 'text-emerald-700')}`}>Overall Health Score</p>
                    <p className={`text-4xl font-bold ${isDarkMode ? (healthRisk?.risk_level === 'High' ? 'text-red-400' : healthRisk?.risk_level === 'Medium' ? 'text-amber-400' : 'text-emerald-400') : (healthRisk?.risk_level === 'High' ? 'text-red-600' : healthRisk?.risk_level === 'Medium' ? 'text-amber-600' : 'text-emerald-600')}`}>{healthRisk ? (healthRisk.risk_level === 'Low' ? 92 : healthRisk.risk_level === 'Medium' ? 68 : 42) : '--'}<span className="text-lg">/100</span></p>
                    <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{healthRisk ? (healthRisk.risk_level === 'Low' ? 'Excellent - Above average for your age group' : healthRisk.risk_level === 'Medium' ? 'Moderate - Some risk factors detected' : 'Concerning - Multiple risk factors, consult your doctor') : 'Loading...'}</p>
                  </div>
                  <div className={`p-3 rounded-full ${isDarkMode ? (healthRisk?.risk_level === 'High' ? 'bg-red-900/50' : healthRisk?.risk_level === 'Medium' ? 'bg-amber-900/50' : 'bg-emerald-900/50') : (healthRisk?.risk_level === 'High' ? 'bg-red-100' : healthRisk?.risk_level === 'Medium' ? 'bg-amber-100' : 'bg-emerald-100')}`}>
                    {healthRisk?.risk_level === 'High' ? <TrendingDown className={`w-8 h-8 ${isDarkMode ? 'text-red-400' : 'text-red-500'}`} /> : <TrendingUp className={`w-8 h-8 ${isDarkMode ? (healthRisk?.risk_level === 'Medium' ? 'text-amber-400' : 'text-emerald-400') : (healthRisk?.risk_level === 'Medium' ? 'text-amber-500' : 'text-emerald-500')}`} />}
                  </div>
                </div>
              </div>

              {/* Insights List */}
              <div className="space-y-3">
                {[
                  {
                    icon: <Heart size={18} />,
                    title: 'Heart Rate Analysis',
                    detail: `Your resting heart rate of ${hr || '--'} BPM is ${hrStatus === 'Normal' ? 'within the ideal range (60-100 BPM). Consistent readings suggest a healthy cardiovascular system.' : hrStatus === 'Elevated' ? 'slightly elevated. Monitor for sustained increases and consider relaxation techniques.' : 'outside the normal range. Consult your doctor for further evaluation.'}`,
                    status: hrStatus || 'N/A',
                    statusColor: hrStatus === 'Normal' ? 'emerald' : hrStatus === 'Elevated' ? 'amber' : 'amber'
                  },
                  {
                    icon: <Activity size={18} />,
                    title: 'Blood Pressure Trend',
                    detail: `BP at ${sbp || '--'}/${dbp || '--'} mmHg is ${bpStatus === 'Normal' ? 'optimal. No signs of hypertension detected. Keep maintaining your current diet and activity level.' : bpStatus === 'Elevated' ? 'elevated. Consider dietary changes and stress management. Monitor closely.' : 'high. Consult your healthcare provider for medication review and lifestyle guidance.'}`,
                    status: bpStatus === 'Normal' ? 'Optimal' : bpStatus || 'N/A',
                    statusColor: bpStatus === 'Normal' ? 'blue' : 'amber'
                  },
                  {
                    icon: <ActivitySquare size={18} />,
                    title: 'Glucose Management',
                    detail: `Blood glucose at ${gl || '--'} mg/dL is ${glStatus === 'Normal' ? 'well-controlled. Good dietary management detected. Continue current meal plan.' : glStatus === 'Elevated' ? 'slightly elevated. Consider reducing sugar intake and increasing physical activity.' : 'outside the normal range. Review your meal plan with your healthcare provider.'}`,
                    status: glStatus === 'Normal' ? 'Good' : glStatus || 'N/A',
                    statusColor: glStatus === 'Normal' ? 'emerald' : 'amber'
                  },
                  {
                    icon: <BedDouble size={18} />,
                    title: 'Sleep Quality',
                    detail: healthRisk?.risk_level === 'High' ? 'Sleep quality may be affected by current health conditions. Ensure consistent sleep schedule and discuss sleep aids with your doctor.' : 'Quality sleep supports cognitive function and immune health. Maintain consistent sleep schedule.',
                    status: healthRisk?.risk_level === 'High' ? 'Monitor' : 'Good',
                    statusColor: healthRisk?.risk_level === 'High' ? 'amber' : 'indigo'
                  },
                  {
                    icon: <Dumbbell size={18} />,
                    title: 'Physical Activity',
                    detail: healthRisk?.risk_level === 'High' ? 'Activity level should be adapted to your current health status. Consult your doctor for a safe exercise plan.' : healthRisk?.risk_level === 'Medium' ? 'Consider adding light exercise like a 15-minute walk to boost cardiovascular health.' : 'Maintain your current activity level. Regular movement supports overall health.',
                    status: healthRisk?.risk_level === 'High' ? 'Adapt' : healthRisk?.risk_level === 'Medium' ? 'Improve' : 'Good',
                    statusColor: healthRisk?.risk_level === 'High' ? 'amber' : healthRisk?.risk_level === 'Medium' ? 'amber' : 'emerald'
                  },
                  {
                    icon: <ThermometerSun size={18} />,
                    title: 'Body Temperature',
                    detail: `${tpStatus === 'Normal' ? `Stable at ${tpF || '--'}°F with no fluctuations. No signs of infection or inflammation detected. Temperature regulation is functioning normally.` : `Temperature at ${tpF || '--'}°F is ${tpStatus === 'Elevated' ? 'slightly elevated. Monitor for fever symptoms.' : 'outside normal range. Consult your healthcare provider.'}`}`,
                    status: tpStatus || 'N/A',
                    statusColor: tpStatus === 'Normal' ? 'emerald' : 'amber'
                  },
                ].map((insight, idx) => (
                  <div key={idx} className={`rounded-xl p-4 border transition-all duration-300 hover:shadow-md ${
                    isDarkMode ? 'bg-gray-800/50 border-gray-700/50 hover:bg-gray-800/80' : 'bg-white border-gray-100 hover:border-gray-200'
                  }`}>
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg mt-0.5 ${
                        isDarkMode ? 'bg-gray-700/60' : 'bg-gray-50'
                      }`}>
                        <div className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>{insight.icon}</div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className={`text-sm font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{insight.title}</h4>
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                            insight.statusColor === 'emerald' 
                              ? isDarkMode ? 'bg-emerald-900/40 text-emerald-300' : 'bg-emerald-100 text-emerald-700'
                              : insight.statusColor === 'blue'
                              ? isDarkMode ? 'bg-blue-900/40 text-blue-300' : 'bg-blue-100 text-blue-700'
                              : insight.statusColor === 'amber'
                              ? isDarkMode ? 'bg-amber-900/40 text-amber-300' : 'bg-amber-100 text-amber-700'
                              : isDarkMode ? 'bg-indigo-900/40 text-indigo-300' : 'bg-indigo-100 text-indigo-700'
                          }`}>{insight.status}</span>
                        </div>
                        <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{insight.detail}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* AI Disclaimer */}
              <div className={`mt-5 p-3 rounded-xl text-center ${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
                <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  These insights are generated by AI based on your health data. Always consult your healthcare provider for medical advice.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== Medication History Modal ===== */}
      {showMedHistory && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setShowMedHistory(false)}>
          <div onClick={(e) => e.stopPropagation()} className={`relative w-full max-w-2xl flex flex-col rounded-3xl border-2 shadow-2xl overflow-hidden ${
            isDarkMode ? 'bg-gray-900 border-emerald-800/40' : 'bg-white border-emerald-200'
          }`} style={{ maxHeight: '90vh' }}>
            {/* Header */}
            <div className={`flex-shrink-0 relative overflow-hidden ${
              isDarkMode ? 'bg-gradient-to-r from-emerald-900/80 via-teal-900/60 to-cyan-900/50' : 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500'
            }`}>
              <div className="relative z-10 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-white/20 backdrop-blur-sm">
                      <History className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Medication History</h2>
                      <p className="text-white/80 text-sm">{medHistory.length} records • {medHistory.filter(h => h.status === 'Taken').length} taken</p>
                    </div>
                  </div>
                  <button onClick={() => setShowMedHistory(false)} className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-all">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Summary Stats */}
            <div className={`flex-shrink-0 p-4 border-b ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
              <div className="grid grid-cols-4 gap-3">
                {[
                  { label: 'Total', value: medHistory.length, color: 'blue' },
                  { label: 'Taken', value: medHistory.filter(h => h.status === 'Taken').length, color: 'emerald' },
                  { label: 'Missed', value: medHistory.filter(h => h.status === 'Missed').length, color: 'red' },
                  { label: 'Adherence', value: `${medHistory.length > 0 ? Math.round(medHistory.filter(h => h.status === 'Taken').length / medHistory.length * 100) : 0}%`, color: 'purple' },
                ].map((s, i) => (
                  <div key={i} className={`rounded-xl p-3 text-center ${isDarkMode ? 'bg-gray-800/40' : 'bg-gray-50'}`}>
                    <div className={`text-lg font-bold ${
                      isDarkMode ? (s.color === 'blue' ? 'text-blue-300' : s.color === 'emerald' ? 'text-emerald-300' : s.color === 'red' ? 'text-red-300' : 'text-purple-300') :
                      (s.color === 'blue' ? 'text-blue-600' : s.color === 'emerald' ? 'text-emerald-600' : s.color === 'red' ? 'text-red-600' : 'text-purple-600')
                    }`}>{s.value}</div>
                    <div className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* History List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {medHistory.map((entry) => (
                <div key={entry.id} className={`rounded-xl p-4 border transition-all duration-300 hover:scale-[1.01] ${
                  isDarkMode
                    ? entry.status === 'Taken' ? 'bg-gray-800/30 border-gray-800 hover:border-emerald-700/30' : 'bg-gray-800/30 border-gray-800 hover:border-red-700/30'
                    : entry.status === 'Taken' ? 'bg-white border-gray-100 hover:border-emerald-200 hover:shadow-md' : 'bg-white border-gray-100 hover:border-red-200 hover:shadow-md'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        entry.status === 'Taken'
                          ? isDarkMode ? 'bg-emerald-900/30' : 'bg-emerald-100'
                          : isDarkMode ? 'bg-red-900/30' : 'bg-red-100'
                      }`}>
                        {entry.status === 'Taken' 
                          ? <ClipboardCheck className={`w-4 h-4 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
                          : <AlertCircle className={`w-4 h-4 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`} />
                        }
                      </div>
                      <div>
                        <h4 className={`font-bold text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>{entry.medication}</h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>{entry.time}</span>
                          {entry.dosage && (
                            <>
                              <span className={`text-xs ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>•</span>
                              <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>{entry.dosage}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      entry.status === 'Taken'
                        ? isDarkMode ? 'bg-emerald-900/30 text-emerald-300' : 'bg-emerald-100 text-emerald-700'
                        : isDarkMode ? 'bg-red-900/30 text-red-300' : 'bg-red-100 text-red-700'
                    }`}>
                      {entry.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===== Schedule Refill Modal ===== */}
      {showScheduleRefill && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => { setShowScheduleRefill(false); setRefillSaved(false); }}>
          <div onClick={(e) => e.stopPropagation()} className={`relative w-full max-w-md flex flex-col rounded-3xl border-2 shadow-2xl overflow-hidden ${
            isDarkMode ? 'bg-gray-900 border-blue-800/40' : 'bg-white border-blue-200'
          }`} style={{ maxHeight: '90vh' }}>
            {/* Header */}
            <div className={`flex-shrink-0 relative overflow-hidden ${
              isDarkMode ? 'bg-gradient-to-r from-blue-900/80 via-cyan-900/60 to-sky-900/50' : 'bg-gradient-to-r from-blue-500 via-cyan-500 to-sky-500'
            }`}>
              <div className="relative z-10 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-white/20 backdrop-blur-sm">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Schedule Refill</h2>
                      <p className="text-white/80 text-sm">Plan your next medication refill</p>
                    </div>
                  </div>
                  <button onClick={() => { setShowScheduleRefill(false); setRefillSaved(false); }} className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-all">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {refillSaved && (
                <div className={`flex items-center gap-2 p-3 rounded-xl text-sm font-medium ${
                  isDarkMode ? 'bg-emerald-900/30 text-emerald-300 border border-emerald-800/40' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}>
                  <Check className="w-4 h-4" />
                  Refill scheduled successfully!
                </div>
              )}

              {/* Medication Name */}
              <div>
                <label className={`text-sm font-medium mb-2 block ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Medication Name</label>
                <input
                  type="text"
                  value={newRefill.name}
                  onChange={(e) => setNewRefill(prev => ({ ...prev, name: e.target.value }))}
                 
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                    isDarkMode
                      ? 'bg-gray-800/50 border-gray-700 text-gray-200 focus:ring-blue-500/30 placeholder-gray-500'
                      : 'bg-gray-50 border-gray-200 text-gray-900 focus:ring-blue-500/30 placeholder-gray-400'
                  }`}
                />
              </div>

              {/* Refill Date */}
              <div>
                <label className={`text-sm font-medium mb-2 block ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Refill Date</label>
                <input
                  type="date"
                  value={newRefill.date}
                  onChange={(e) => setNewRefill(prev => ({ ...prev, date: e.target.value }))}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                    isDarkMode
                      ? 'bg-gray-800/50 border-gray-700 text-gray-200 focus:ring-blue-500/30'
                      : 'bg-gray-50 border-gray-200 text-gray-900 focus:ring-blue-500/30'
                  }`}
                />
              </div>

              {/* Pharmacy */}
              <div>
                <label className={`text-sm font-medium mb-2 block ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Pharmacy</label>
                <select
                  value={newRefill.pharmacy}
                  onChange={(e) => setNewRefill(prev => ({ ...prev, pharmacy: e.target.value }))}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                    isDarkMode
                      ? 'bg-gray-800/50 border-gray-700 text-gray-200 focus:ring-blue-500/30'
                      : 'bg-gray-50 border-gray-200 text-gray-900 focus:ring-blue-500/30'
                  }`}
                >
                  <option value="City Pharmacy">City Pharmacy</option>
                  <option value="HealthMart">HealthMart</option>
                  <option value="MedPlus">MedPlus</option>
                  <option value="Walgreens">Walgreens</option>
                </select>
              </div>

              {/* Quantity */}
              <div>
                <label className={`text-sm font-medium mb-2 block ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Quantity</label>
                <select
                  value={newRefill.quantity}
                  onChange={(e) => setNewRefill(prev => ({ ...prev, quantity: e.target.value }))}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                    isDarkMode
                      ? 'bg-gray-800/50 border-gray-700 text-gray-200 focus:ring-blue-500/30'
                      : 'bg-gray-50 border-gray-200 text-gray-900 focus:ring-blue-500/30'
                  }`}
                >
                  <option value="30 tablets">30 tablets</option>
                  <option value="60 tablets">60 tablets</option>
                  <option value="90 tablets">90 tablets</option>
                  <option value="30 capsules">30 capsules</option>
                  <option value="60 capsules">60 capsules</option>
                </select>
              </div>

              {/* Existing Refills */}
              <div>
                <h4 className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Scheduled Refills</h4>
                <div className="space-y-2">
                  {medRefills.map((refill) => (
                    <div key={refill.id} className={`flex items-center justify-between p-3 rounded-xl ${
                      isDarkMode ? 'bg-gray-800/40 border border-gray-700/50' : 'bg-gray-50 border border-gray-100'
                    }`}>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${refill.status === 'Due Soon' ? 'bg-amber-500' : 'bg-blue-500'}`} />
                        <div>
                          <div className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>{refill.name}</div>
                          <div className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>{refill.date} • {refill.pharmacy}</div>
                        </div>
                      </div>
                      <button onClick={() => setMedRefills(prev => prev.filter(r => r.id !== refill.id))} className={`p-1.5 rounded-lg transition-all hover:scale-110 ${
                        isDarkMode ? 'hover:bg-red-900/30 text-gray-500 hover:text-red-400' : 'hover:bg-red-50 text-gray-400 hover:text-red-500'
                      }`}>
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className={`flex-shrink-0 p-4 border-t ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
              <div className="flex gap-3">
                <button onClick={() => { setShowScheduleRefill(false); setRefillSaved(false); }} className={`flex-1 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 hover:scale-[1.02] ${
                  isDarkMode ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}>
                  Cancel
                </button>
                <button onClick={() => {
                  if (!newRefill.name || !newRefill.date) return;
                  const d = new Date(newRefill.date);
                  const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                  const now = new Date();
                  const diffDays = Math.ceil((d - now) / (1000 * 60 * 60 * 24));
                  setMedRefills(prev => [...prev, { id: Date.now(), name: newRefill.name, date: dateStr, fullDate: newRefill.date, status: diffDays <= 7 ? 'Due Soon' : 'Scheduled', color: diffDays <= 7 ? 'amber' : 'blue', pharmacy: newRefill.pharmacy, quantity: newRefill.quantity, cost: 'TBD' }]);
                  setNewRefill({ name: '', date: '', pharmacy: 'City Pharmacy', quantity: '30 tablets' });
                  setRefillSaved(true);
                  setTimeout(() => { setShowScheduleRefill(false); setRefillSaved(false); }, 1200);
                }} className="flex-1 py-2.5 rounded-xl font-medium text-sm text-white bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2">
                  <Check className="w-4 h-4" />
                  Schedule Refill
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== VR Session Modal ===== */}
      {activeVRSession && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md p-4" onClick={() => { if (!vrSessionRunning) { setActiveVRSession(null); } }}>
          <div onClick={(e) => e.stopPropagation()} className={`relative w-full max-w-lg flex flex-col rounded-3xl border-2 shadow-2xl overflow-hidden ${
            isDarkMode ? 'bg-gray-900 border-purple-800/40' : 'bg-white border-purple-200'
          }`} style={{ maxHeight: '90vh' }}>
            {/* Gradient Header */}
            <div className={`flex-shrink-0 relative overflow-hidden ${
              isDarkMode ? 'bg-gradient-to-r from-purple-900/90 via-violet-900/70 to-indigo-900/60' : 'bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600'
            }`}>
              <div className="absolute inset-0">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="absolute rounded-full bg-white/10 animate-pulse" style={{ width: 30 + i * 15, height: 30 + i * 15, top: `${5 + (i * 12) % 80}%`, left: `${10 + (i * 17) % 80}%`, animationDelay: `${i * 0.5}s` }} />
                ))}
              </div>
              <div className="relative z-10 p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                    vrSessionCompleted ? 'bg-emerald-400/20 text-emerald-100' : vrSessionRunning ? 'bg-blue-400/20 text-blue-100' : 'bg-white/20 text-white/80'
                  }`}>
                    {vrSessionCompleted ? 'Completed' : vrSessionRunning ? 'In Progress' : 'Ready to Start'}
                  </span>
                  <button onClick={() => { setVrSessionRunning(false); setActiveVRSession(null); }} className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-all">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 rounded-2xl bg-white/20 backdrop-blur-sm">
                    <Glasses className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{activeVRSession.name}</h2>
                    <p className="text-white/70 text-sm">{activeVRSession.category} • {activeVRSession.difficulty}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Timer Display */}
              <div className={`rounded-2xl p-6 text-center ${
                isDarkMode ? 'bg-gray-800/60 border border-gray-700/50' : 'bg-gray-50 border border-gray-100'
              }`}>
                <div className={`text-5xl font-bold font-mono mb-2 ${
                  vrSessionCompleted ? (isDarkMode ? 'text-emerald-400' : 'text-emerald-600') :
                  vrSessionRunning ? (isDarkMode ? 'text-purple-400' : 'text-purple-600') :
                  (isDarkMode ? 'text-gray-300' : 'text-gray-800')
                }`}>
                  {`${Math.floor(vrSessionTimer / 60).toString().padStart(2, '0')}:${(vrSessionTimer % 60).toString().padStart(2, '0')}`}
                </div>
                <div className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                  of {activeVRSession.duration}
                </div>
                {/* Progress bar */}
                <div className={`mt-3 h-2 rounded-full overflow-hidden ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                  <div className="h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-1000" style={{ width: `${Math.min(100, (vrSessionTimer / activeVRSession.durationSec) * 100)}%` }} />
                </div>
              </div>

              {/* Current Scene */}
              <div>
                <h4 className={`text-sm font-bold mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>Scenes</h4>
                <div className="grid grid-cols-2 gap-2">
                  {activeVRSession.scenes.map((scene, i) => (
                    <button key={i} onClick={() => { if (vrSessionRunning || vrSessionCompleted) setVrCurrentScene(i); }} className={`p-3 rounded-xl text-left text-sm font-medium transition-all duration-300 border ${
                      i === vrCurrentScene
                        ? isDarkMode ? 'bg-purple-900/40 border-purple-700 text-purple-300' : 'bg-purple-50 border-purple-300 text-purple-700'
                        : i <= vrCurrentScene
                        ? isDarkMode ? 'bg-gray-800/40 border-gray-700 text-gray-300' : 'bg-gray-50 border-gray-200 text-gray-700'
                        : isDarkMode ? 'bg-gray-900/30 border-gray-800 text-gray-500' : 'bg-white border-gray-100 text-gray-400'
                    }`}>
                      <div className="flex items-center gap-2">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${
                          i === vrCurrentScene ? 'bg-purple-500 text-white' :
                          i < vrCurrentScene ? (isDarkMode ? 'bg-emerald-800 text-emerald-300' : 'bg-emerald-100 text-emerald-600') :
                          isDarkMode ? 'bg-gray-800 text-gray-500' : 'bg-gray-200 text-gray-400'
                        }`}>
                          {i < vrCurrentScene ? <Check className="w-3 h-3" /> : i + 1}
                        </div>
                        {scene}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Info Row */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Duration', value: activeVRSession.duration, icon: <Clock className="w-4 h-4" /> },
                  { label: 'Difficulty', value: activeVRSession.difficulty, icon: <Target className="w-4 h-4" /> },
                  { label: 'Rating', value: `${activeVRSession.rating}/5`, icon: <Star className="w-4 h-4" /> },
                ].map((info, i) => (
                  <div key={i} className={`rounded-xl p-3 text-center ${
                    isDarkMode ? 'bg-gray-800/40 border border-gray-700/50' : 'bg-gray-50 border border-gray-100'
                  }`}>
                    <div className={`flex justify-center mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{info.icon}</div>
                    <div className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>{info.label}</div>
                    <div className={`text-sm font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>{info.value}</div>
                  </div>
                ))}
              </div>

              {/* Completed State */}
              {vrSessionCompleted && (
                <div className={`rounded-xl p-4 ${isDarkMode ? 'bg-emerald-900/20 border border-emerald-800/30' : 'bg-emerald-50 border border-emerald-200'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Trophy className={`w-5 h-5 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
                    <h4 className={`text-sm font-bold ${isDarkMode ? 'text-emerald-300' : 'text-emerald-700'}`}>Session Complete!</h4>
                  </div>
                  <p className={`text-sm ${isDarkMode ? 'text-emerald-400/80' : 'text-emerald-600'}`}>
                    Great work! This session has been saved to your history.
                  </p>
                </div>
              )}
            </div>

            {/* Footer Controls */}
            <div className={`flex-shrink-0 p-4 border-t ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
              {vrSessionCompleted ? (
                <div className="flex gap-3">
                  <button onClick={() => setActiveVRSession(null)} className={`flex-1 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 hover:scale-[1.02] ${
                    isDarkMode ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}>
                    Close
                  </button>
                  <button onClick={() => { setVrSessionTimer(0); setVrCurrentScene(0); setVrSessionCompleted(false); }} className="flex-1 py-2.5 rounded-xl font-medium text-sm text-white bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2">
                    <RotateCcw className="w-4 h-4" />
                    Restart
                  </button>
                </div>
              ) : (
                <div className="flex gap-3">
                  {!vrSessionRunning ? (
                    <>
                      <button onClick={() => setActiveVRSession(null)} className={`flex-1 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 hover:scale-[1.02] ${
                        isDarkMode ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}>
                        Cancel
                      </button>
                      <button onClick={() => setVrSessionRunning(true)} className="flex-1 py-2.5 rounded-xl font-medium text-sm text-white bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2">
                        <Play className="w-4 h-4" />
                        {vrSessionTimer > 0 ? 'Resume' : 'Begin Session'}
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => setVrSessionRunning(false)} className={`flex-1 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2 ${
                        isDarkMode ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}>
                        <Pause className="w-4 h-4" />
                        Pause
                      </button>
                      {vrCurrentScene < activeVRSession.scenes.length - 1 ? (
                        <button onClick={() => setVrCurrentScene(prev => prev + 1)} className="flex-1 py-2.5 rounded-xl font-medium text-sm text-white bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2">
                          <SkipForward className="w-4 h-4" />
                          Next Scene
                        </button>
                      ) : (
                        <button onClick={() => completeVRSession()} className="flex-1 py-2.5 rounded-xl font-medium text-sm text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2">
                          <Check className="w-4 h-4" />
                          Finish
                        </button>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ===== VR History Modal ===== */}
      {showVRHistory && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setShowVRHistory(false)}>
          <div onClick={(e) => e.stopPropagation()} className={`relative w-full max-w-3xl flex flex-col rounded-3xl border-2 shadow-2xl overflow-hidden ${
            isDarkMode ? 'bg-gray-900 border-violet-800/40' : 'bg-white border-violet-200'
          }`} style={{ maxHeight: '90vh' }}>
            {/* Header */}
            <div className={`flex-shrink-0 relative overflow-hidden ${
              isDarkMode ? 'bg-gradient-to-r from-violet-900/80 via-purple-900/60 to-indigo-900/50' : 'bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500'
            }`}>
              <div className="relative z-10 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-white/20 backdrop-blur-sm">
                      <History className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">VR Session History</h2>
                      <p className="text-white/80 text-sm">{vrHistory.length} sessions completed</p>
                    </div>
                  </div>
                  <button onClick={() => setShowVRHistory(false)} className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-all">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Summary Stats */}
            <div className={`flex-shrink-0 p-4 border-b ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
              <div className="grid grid-cols-4 gap-3">
                {[
                  { label: 'Total Sessions', value: vrHistory.length, color: 'purple' },
                  { label: 'Avg Score', value: `${Math.round(vrHistory.reduce((a, b) => a + b.score, 0) / vrHistory.length)}%`, color: 'blue' },
                  { label: 'Total Scenes', value: vrHistory.reduce((a, b) => a + b.scenes, 0), color: 'emerald' },
                  { label: 'Best Score', value: `${Math.max(...vrHistory.map(h => h.score))}%`, color: 'amber' },
                ].map((s, i) => (
                  <div key={i} className={`rounded-xl p-3 text-center ${isDarkMode ? 'bg-gray-800/40' : 'bg-gray-50'}`}>
                    <div className={`text-lg font-bold ${
                      isDarkMode ? (s.color === 'purple' ? 'text-purple-300' : s.color === 'blue' ? 'text-blue-300' : s.color === 'emerald' ? 'text-emerald-300' : 'text-amber-300') :
                      (s.color === 'purple' ? 'text-purple-600' : s.color === 'blue' ? 'text-blue-600' : s.color === 'emerald' ? 'text-emerald-600' : 'text-amber-600')
                    }`}>{s.value}</div>
                    <div className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* History List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {vrHistory.map((session) => (
                <div key={session.id} className={`rounded-xl p-4 border transition-all duration-300 hover:scale-[1.01] ${
                  isDarkMode ? 'bg-gray-800/30 border-gray-800 hover:border-violet-700/30' : 'bg-white border-gray-100 hover:border-violet-200 hover:shadow-md'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${isDarkMode ? getColorClass(session.color, 'darkBg') : getColorClass(session.color, 'bg')}`}>
                        <div className={isDarkMode ? getColorClass(session.color, 'darkText') : getColorClass(session.color, 'text')}>
                          <Glasses className="w-4 h-4" />
                        </div>
                      </div>
                      <div>
                        <h4 className={`font-bold text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>{session.name}</h4>
                        <div className="flex items-center gap-3 mt-0.5">
                          <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>{session.date}</span>
                          <span className={`text-xs ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>•</span>
                          <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>{session.duration}</span>
                          <span className={`text-xs ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>•</span>
                          <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>{session.scenes} scenes</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        isDarkMode
                          ? session.color === 'purple' ? 'bg-purple-900/30 text-purple-300' :
                            session.color === 'emerald' ? 'bg-emerald-900/30 text-emerald-300' :
                            session.color === 'blue' ? 'bg-blue-900/30 text-blue-300' :
                            session.color === 'amber' ? 'bg-amber-900/30 text-amber-300' :
                            session.color === 'teal' ? 'bg-teal-900/30 text-teal-300' :
                            'bg-pink-900/30 text-pink-300'
                          : session.color === 'purple' ? 'bg-purple-100 text-purple-700' :
                            session.color === 'emerald' ? 'bg-emerald-100 text-emerald-700' :
                            session.color === 'blue' ? 'bg-blue-100 text-blue-700' :
                            session.color === 'amber' ? 'bg-amber-100 text-amber-700' :
                            session.color === 'teal' ? 'bg-teal-100 text-teal-700' :
                            'bg-pink-100 text-pink-700'
                      }`}>{session.category}</span>
                      <div className={`text-right`}>
                        <div className={`text-lg font-bold ${
                          session.score >= 90 ? (isDarkMode ? 'text-emerald-400' : 'text-emerald-600') :
                          session.score >= 75 ? (isDarkMode ? 'text-blue-400' : 'text-blue-600') :
                          (isDarkMode ? 'text-amber-400' : 'text-amber-600')
                        }`}>{session.score}%</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===== Set Reminder Modal ===== */}
      {showReminderModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => { setShowReminderModal(false); setReminderSaved(false); }}>
          <div onClick={(e) => e.stopPropagation()} className={`relative w-full max-w-lg flex flex-col rounded-3xl border-2 shadow-2xl overflow-hidden ${
            isDarkMode ? 'bg-gray-900 border-amber-800/40' : 'bg-white border-amber-200'
          }`} style={{ maxHeight: '90vh' }}>
            {/* Header */}
            <div className={`flex-shrink-0 relative overflow-hidden ${
              isDarkMode ? 'bg-gradient-to-r from-amber-900/80 via-orange-900/60 to-yellow-900/50' : 'bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500'
            }`}>
              <div className="absolute inset-0 opacity-20">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="absolute rounded-full bg-white/20" style={{ width: 40 + i * 20, height: 40 + i * 20, top: `${10 + i * 8}%`, left: `${5 + i * 15}%`, animationDelay: `${i * 0.4}s` }} />
                ))}
              </div>
              <div className="relative z-10 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-white/20 backdrop-blur-sm">
                      <BellRing className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Activity Reminders</h2>
                      <p className="text-white/80 text-sm">Get notified before your scheduled activities</p>
                    </div>
                  </div>
                  <button onClick={() => { setShowReminderModal(false); setReminderSaved(false); }} className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-all">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {reminderSaved && (
                <div className={`flex items-center gap-2 p-3 rounded-xl text-sm font-medium ${
                  isDarkMode ? 'bg-emerald-900/30 text-emerald-300 border border-emerald-800/40' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}>
                  <Check className="w-4 h-4" />
                  Reminders saved successfully!
                </div>
              )}

              {scheduleItems.map((item) => {
                const reminder = scheduleReminders[item.id] || { enabled: false, minutesBefore: 15, type: 'push' };
                const iconMap = { purple: <Brain className="w-4 h-4" />, teal: <Activity className="w-4 h-4" />, pink: <Gamepad2 className="w-4 h-4" />, blue: <Wind className="w-4 h-4" /> };
                return (
                  <div key={item.id} className={`rounded-2xl border p-4 transition-all duration-300 ${
                    reminder.enabled
                      ? isDarkMode ? 'bg-amber-950/20 border-amber-800/40' : 'bg-amber-50/80 border-amber-200'
                      : isDarkMode ? 'bg-gray-900/30 border-gray-800' : 'bg-gray-50 border-gray-200'
                  }`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${isDarkMode ? getColorClass(item.color, 'darkBg') : getColorClass(item.color, 'bg')}`}>
                          <div className={isDarkMode ? getColorClass(item.color, 'darkText') : getColorClass(item.color, 'text')}>
                            {iconMap[item.color]}
                          </div>
                        </div>
                        <div>
                          <h4 className={`font-bold text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>{item.activity}</h4>
                          <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>{item.time} • {item.type}</p>
                        </div>
                      </div>
                      {/* Toggle */}
                      <button onClick={() => setScheduleReminders(prev => ({
                        ...prev,
                        [item.id]: { ...prev[item.id], enabled: !prev[item.id]?.enabled }
                      }))} className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                        reminder.enabled
                          ? 'bg-amber-500'
                          : isDarkMode ? 'bg-gray-700' : 'bg-gray-300'
                      }`}>
                        <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-all duration-300 ${
                          reminder.enabled ? 'left-6.5 translate-x-0.5' : 'left-0.5'
                        }`} style={{ left: reminder.enabled ? '26px' : '2px' }} />
                      </button>
                    </div>

                    {reminder.enabled && (
                      <div className="space-y-3 mt-3 pt-3 border-t border-dashed" style={{ borderColor: isDarkMode ? 'rgba(251,191,36,0.2)' : 'rgba(251,191,36,0.4)' }}>
                        {/* Minutes before */}
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Remind me before</span>
                          <div className="flex items-center gap-1">
                            {[5, 10, 15, 30].map((m) => (
                              <button key={m} onClick={() => setScheduleReminders(prev => ({
                                ...prev,
                                [item.id]: { ...prev[item.id], minutesBefore: m }
                              }))} className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                                reminder.minutesBefore === m
                                  ? 'bg-amber-500 text-white'
                                  : isDarkMode ? 'bg-gray-800 text-gray-400 hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}>
                                {m}m
                              </button>
                            ))}
                          </div>
                        </div>
                        {/* Notification type */}
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Notification type</span>
                          <div className="flex items-center gap-1">
                            {[
                              { key: 'push', icon: <Smartphone className="w-3 h-3" />, label: 'Push' },
                              { key: 'sound', icon: <Volume2 className="w-3 h-3" />, label: 'Sound' },
                              { key: 'email', icon: <Mail className="w-3 h-3" />, label: 'Email' },
                            ].map((t) => (
                              <button key={t.key} onClick={() => setScheduleReminders(prev => ({
                                ...prev,
                                [item.id]: { ...prev[item.id], type: t.key }
                              }))} className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                                reminder.type === t.key
                                  ? 'bg-amber-500 text-white'
                                  : isDarkMode ? 'bg-gray-800 text-gray-400 hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}>
                                {t.icon} {t.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className={`flex-shrink-0 p-4 border-t ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
              <div className="flex gap-3">
                <button onClick={() => { setShowReminderModal(false); setReminderSaved(false); }} className={`flex-1 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 hover:scale-[1.02] ${
                  isDarkMode ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}>
                  Cancel
                </button>
                <button onClick={() => { setReminderSaved(true); const enabled = Object.values(scheduleReminders).filter(r => r.enabled).length; if (enabled > 0) addNotification({ type: 'reminder', title: 'Schedule Reminders Updated', message: `${enabled} activity reminder${enabled > 1 ? 's' : ''} activated`, icon: 'bell', color: 'amber' }); setTimeout(() => { setShowReminderModal(false); setReminderSaved(false); }, 1200); }} className="flex-1 py-2.5 rounded-xl font-medium text-sm text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2">
                  <Check className="w-4 h-4" />
                  Save Reminders
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== Schedule Activity Details Modal ===== */}
      {scheduleDetailItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setScheduleDetailItem(null)}>
          <div onClick={(e) => e.stopPropagation()} className={`relative w-full max-w-md flex flex-col rounded-3xl border-2 shadow-2xl overflow-hidden ${
            isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
          }`} style={{ maxHeight: '90vh' }}>
            {/* Gradient Header */}
            <div className={`flex-shrink-0 relative overflow-hidden ${
              scheduleDetailItem.color === 'purple' ? (isDarkMode ? 'bg-gradient-to-r from-purple-900/80 via-violet-900/60 to-pink-900/50' : 'bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500') :
              scheduleDetailItem.color === 'teal' ? (isDarkMode ? 'bg-gradient-to-r from-teal-900/80 via-cyan-900/60 to-emerald-900/50' : 'bg-gradient-to-r from-teal-500 via-cyan-500 to-emerald-500') :
              scheduleDetailItem.color === 'pink' ? (isDarkMode ? 'bg-gradient-to-r from-pink-900/80 via-rose-900/60 to-red-900/50' : 'bg-gradient-to-r from-pink-500 via-rose-500 to-red-500') :
              (isDarkMode ? 'bg-gradient-to-r from-blue-900/80 via-sky-900/60 to-indigo-900/50' : 'bg-gradient-to-r from-blue-500 via-sky-500 to-indigo-500')
            }`}>
              <div className="relative z-10 p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                    scheduleDetailItem.status === 'Completed' ? 'bg-emerald-400/20 text-emerald-100' :
                    scheduleDetailItem.status === 'In Progress' ? 'bg-purple-400/20 text-purple-100' :
                    scheduleDetailItem.status === 'Upcoming' ? 'bg-blue-400/20 text-blue-100' :
                    'bg-amber-400/20 text-amber-100'
                  }`}>
                    {scheduleDetailItem.status}
                  </span>
                  <button onClick={() => setScheduleDetailItem(null)} className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-all">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <h2 className="text-2xl font-bold text-white mb-1">{scheduleDetailItem.activity}</h2>
                <p className="text-white/80 text-sm">{scheduleDetailItem.type} Activity</p>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Info Grid */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Time', value: scheduleDetailItem.time, icon: <Clock className="w-4 h-4" /> },
                  { label: 'Duration', value: scheduleDetailItem.duration, icon: <Clock3 className="w-4 h-4" /> },
                  { label: 'Difficulty', value: scheduleDetailItem.difficulty, icon: <Target className="w-4 h-4" /> },
                ].map((info, i) => (
                  <div key={i} className={`rounded-xl p-3 text-center ${
                    isDarkMode ? 'bg-gray-800/60 border border-gray-700/50' : 'bg-gray-50 border border-gray-100'
                  }`}>
                    <div className={`flex justify-center mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{info.icon}</div>
                    <div className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>{info.label}</div>
                    <div className={`text-sm font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>{info.value}</div>
                  </div>
                ))}
              </div>

              {/* Description */}
              <div>
                <h4 className={`text-sm font-bold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>About This Activity</h4>
                <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{scheduleDetailItem.description}</p>
              </div>

              {/* Benefits */}
              <div>
                <h4 className={`text-sm font-bold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>Benefits</h4>
                <div className="space-y-2">
                  {scheduleDetailItem.benefits.map((benefit, i) => (
                    <div key={i} className={`flex items-center gap-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isDarkMode ? 'bg-emerald-900/40 text-emerald-400' : 'bg-emerald-100 text-emerald-600'
                      }`}>
                        <Check className="w-3 h-3" />
                      </div>
                      {benefit}
                    </div>
                  ))}
                </div>
              </div>

              {/* Completion Info (for completed items) */}
              {scheduleDetailItem.status === 'Completed' && (
                <div className={`rounded-xl p-4 ${
                  isDarkMode ? 'bg-emerald-900/20 border border-emerald-800/30' : 'bg-emerald-50 border border-emerald-200'
                }`}>
                  <h4 className={`text-sm font-bold mb-2 flex items-center gap-2 ${isDarkMode ? 'text-emerald-300' : 'text-emerald-700'}`}>
                    <Trophy className="w-4 h-4" /> Completed
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className={`text-xs ${isDarkMode ? 'text-emerald-400/60' : 'text-emerald-600/70'}`}>Finished at</div>
                      <div className={`text-sm font-bold ${isDarkMode ? 'text-emerald-300' : 'text-emerald-700'}`}>{scheduleDetailItem.completedAt}</div>
                    </div>
                    {scheduleDetailItem.score !== null && (
                      <div>
                        <div className={`text-xs ${isDarkMode ? 'text-emerald-400/60' : 'text-emerald-600/70'}`}>Score</div>
                        <div className={`text-sm font-bold ${isDarkMode ? 'text-emerald-300' : 'text-emerald-700'}`}>{scheduleDetailItem.score}/10</div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Reminder Status */}
              <div className={`flex items-center justify-between rounded-xl p-3 ${
                isDarkMode ? 'bg-gray-800/60 border border-gray-700/50' : 'bg-gray-50 border border-gray-100'
              }`}>
                <div className="flex items-center gap-2">
                  <Bell className={`w-4 h-4 ${scheduleReminders[scheduleDetailItem.id]?.enabled ? (isDarkMode ? 'text-amber-400' : 'text-amber-600') : (isDarkMode ? 'text-gray-500' : 'text-gray-400')}`} />
                  <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Reminder</span>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  scheduleReminders[scheduleDetailItem.id]?.enabled
                    ? isDarkMode ? 'bg-amber-900/30 text-amber-300' : 'bg-amber-100 text-amber-700'
                    : isDarkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-500'
                }`}>
                  {scheduleReminders[scheduleDetailItem.id]?.enabled ? `${scheduleReminders[scheduleDetailItem.id].minutesBefore} min before` : 'Off'}
                </span>
              </div>
            </div>

            {/* Footer */}
            <div className={`flex-shrink-0 p-4 border-t ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
              {scheduleDetailItem.status === 'Completed' ? (
                <button onClick={() => {
                  if (scheduleDetailItem.type === 'Cognitive' && scheduleDetailItem.gameType) openGame(scheduleDetailItem.gameType);
                  else if (scheduleDetailItem.type === 'Physical') {
                    const exerciseMap = { yoga: { name: 'Afternoon Yoga', duration: '20 mins', calories: '120 cal', intensity: 'Low' }, stretching: { name: 'Evening Stretching', duration: '15 mins', calories: '60 cal', intensity: 'Very Low' } };
                    startExercise(exerciseMap[scheduleDetailItem.exerciseType] || exerciseMap.yoga);
                  }
                  setScheduleDetailItem(null);
                }} className={`w-full py-2.5 rounded-xl font-medium text-sm transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2 ${
                  isDarkMode ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}>
                  <RotateCcw className="w-4 h-4" />
                  Play Again
                </button>
              ) : (
                <div className="flex gap-3">
                  <button onClick={() => setScheduleDetailItem(null)} className={`flex-1 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 hover:scale-[1.02] ${
                    isDarkMode ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}>
                    Close
                  </button>
                  <button onClick={() => {
                    const item = scheduleDetailItem;
                    if (item.type === 'Cognitive' && item.gameType) {
                      setScheduleItems(prev => prev.map(s => s.id === item.id ? { ...s, status: 'In Progress' } : s));
                      openGame(item.gameType);
                    } else if (item.type === 'Physical') {
                      const exerciseMap = { yoga: { name: 'Afternoon Yoga', duration: '20 mins', calories: '120 cal', intensity: 'Low' }, stretching: { name: 'Evening Stretching', duration: '15 mins', calories: '60 cal', intensity: 'Very Low' } };
                      setScheduleItems(prev => prev.map(s => s.id === item.id ? { ...s, status: 'In Progress' } : s));
                      startExercise(exerciseMap[item.exerciseType] || exerciseMap.yoga);
                    }
                    setScheduleDetailItem(null);
                  }} className={`flex-1 py-2.5 rounded-xl font-medium text-sm text-white transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2 ${
                    scheduleDetailItem.color === 'purple' ? 'bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600' :
                    scheduleDetailItem.color === 'teal' ? 'bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600' :
                    scheduleDetailItem.color === 'pink' ? 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600' :
                    'bg-gradient-to-r from-blue-500 to-sky-500 hover:from-blue-600 hover:to-sky-600'
                  }`}>
                    <Play className="w-4 h-4" />
                    {scheduleDetailItem.status === 'In Progress' ? 'Resume' : 'Start Now'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ===== Activity Progress Modal ===== */}
      {showProgressModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setShowProgressModal(false)}>
          <div onClick={(e) => e.stopPropagation()} className={`relative w-full max-w-4xl flex flex-col rounded-3xl border-2 shadow-2xl overflow-hidden ${
            isDarkMode ? 'bg-gray-900 border-purple-800/40' : 'bg-white border-purple-200'
          }`} style={{ maxHeight: '90vh' }}>
            {/* Header */}
            <div className={`flex-shrink-0 relative overflow-hidden ${
              isDarkMode ? 'bg-gradient-to-r from-purple-900/80 via-pink-900/60 to-violet-900/50' : 'bg-gradient-to-r from-purple-500 via-pink-500 to-violet-500'
            }`}>
              <div className="absolute inset-0"><div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 animate-pulse"></div></div>
              <div className="relative z-10 px-6 py-5">
                <button onClick={() => setShowProgressModal(false)} className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all duration-200 hover:scale-110"><X size={20} /></button>
                <div className="flex items-center gap-4">
                  <div className="p-3.5 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20"><Trophy className="w-7 h-7 text-white" /></div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Activity Progress</h2>
                    <p className="text-sm text-white/70">Track your cognitive and physical wellness journey</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Overall Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: 'Games Played', value: activityProgress.memory.played + activityProgress.pattern.played + activityProgress.reaction.played + activityProgress.wordrecall.played, color: 'purple' },
                  { label: 'Exercise Sessions', value: activityProgress.yoga.sessions + activityProgress.chair.sessions + activityProgress.balance.sessions + activityProgress.breathing.sessions, color: 'teal' },
                  { label: 'Total Calories', value: `${activityProgress.yoga.calories + activityProgress.chair.calories + activityProgress.balance.calories + activityProgress.breathing.calories}`, color: 'amber' },
                  { label: 'Brain Score', value: `${Math.round((activityProgress.memory.progress + activityProgress.pattern.progress + activityProgress.reaction.progress + activityProgress.wordrecall.progress) / 4)}%`, color: 'pink' },
                ].map((s, i) => (
                  <div key={i} className={`rounded-2xl p-4 text-center border ${isDarkMode ? 'bg-gray-800/50 border-gray-700/40' : 'bg-gray-50 border-gray-200/60'}`}>
                    <p className={`text-2xl font-bold ${isDarkMode ? `text-${s.color}-400` : `text-${s.color}-600`}`}>{s.value}</p>
                    <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Cognitive Games Section */}
              <div>
                <h3 className={`text-lg font-bold mb-3 flex items-center gap-2 ${isDarkMode ? 'text-purple-300' : 'text-purple-600'}`}><BrainCircuit className="w-5 h-5" /> Cognitive Games</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { name: 'Memory Matrix', key: 'memory', icon: <Brain className="w-5 h-5" />, color: 'purple', stats: [`${activityProgress.memory.played} games`, `Best: ${activityProgress.memory.bestScore} pts`, `Avg: ${activityProgress.memory.avgScore}`, `${activityProgress.memory.streak} day streak`] },
                    { name: 'Pattern Puzzles', key: 'pattern', icon: <Gamepad2 className="w-5 h-5" />, color: 'pink', stats: [`${activityProgress.pattern.played} games`, `Best: ${activityProgress.pattern.bestScore} pts`, `Avg: ${activityProgress.pattern.avgScore}`, `${activityProgress.pattern.streak} day streak`] },
                    { name: 'Reaction Master', key: 'reaction', icon: <Zap className="w-5 h-5" />, color: 'amber', stats: [`${activityProgress.reaction.played} rounds`, `Best: ${activityProgress.reaction.bestTime}ms`, `Avg: ${activityProgress.reaction.avgTime}ms`, `${activityProgress.reaction.streak} day streak`] },
                    { name: 'Word Recall', key: 'wordrecall', icon: <Brain className="w-5 h-5" />, color: 'violet', stats: [`${activityProgress.wordrecall.played} games`, `Best: ${activityProgress.wordrecall.bestScore} pts`, `Avg: ${activityProgress.wordrecall.avgScore}`, `${activityProgress.wordrecall.streak} day streak`] },
                  ].map((g, i) => (
                    <div key={i} className={`rounded-2xl p-4 border ${isDarkMode ? 'bg-gray-800/40 border-gray-700/40' : 'bg-white border-gray-200/60'}`}>
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`p-2 rounded-xl ${isDarkMode ? `bg-${g.color}-900/40` : `bg-${g.color}-100`}`}>
                          <div className={isDarkMode ? `text-${g.color}-400` : `text-${g.color}-600`}>{g.icon}</div>
                        </div>
                        <div className="flex-1">
                          <h4 className={`font-bold text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{g.name}</h4>
                          <div className={`h-2 rounded-full mt-1 overflow-hidden ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                            <div className={`h-full rounded-full bg-gradient-to-r ${g.color === 'purple' ? 'from-purple-500 to-pink-500' : g.color === 'pink' ? 'from-pink-500 to-rose-500' : g.color === 'amber' ? 'from-amber-500 to-orange-500' : 'from-violet-500 to-purple-500'}`} style={{ width: `${activityProgress[g.key].progress}%` }}></div>
                          </div>
                        </div>
                        <span className={`text-sm font-bold ${isDarkMode ? `text-${g.color}-400` : `text-${g.color}-600`}`}>{activityProgress[g.key].progress}%</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {g.stats.map((stat, j) => (
                          <span key={j} className={`text-xs px-2 py-1 rounded-lg text-center ${isDarkMode ? 'bg-gray-700/50 text-gray-400' : 'bg-gray-50 text-gray-500'}`}>{stat}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Physical Exercises Section */}
              <div>
                <h3 className={`text-lg font-bold mb-3 flex items-center gap-2 ${isDarkMode ? 'text-teal-300' : 'text-teal-600'}`}><Activity className="w-5 h-5" /> Physical Exercises</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { name: 'Gentle Yoga Flow', key: 'yoga', icon: <Activity className="w-5 h-5" />, color: 'teal' },
                    { name: 'Chair Exercises', key: 'chair', icon: <Utensils className="w-5 h-5" />, color: 'cyan' },
                    { name: 'Balance Training', key: 'balance', icon: <Target className="w-5 h-5" />, color: 'blue' },
                    { name: 'Breathing & Stretch', key: 'breathing', icon: <Wind className="w-5 h-5" />, color: 'indigo' },
                  ].map((e, i) => {
                    const p = activityProgress[e.key];
                    return (
                      <div key={i} className={`rounded-2xl p-4 border ${isDarkMode ? 'bg-gray-800/40 border-gray-700/40' : 'bg-white border-gray-200/60'}`}>
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`p-2 rounded-xl ${isDarkMode ? 'bg-teal-900/40' : 'bg-teal-100'}`}>
                            <div className={isDarkMode ? 'text-teal-400' : 'text-teal-600'}>{e.icon}</div>
                          </div>
                          <div className="flex-1">
                            <h4 className={`font-bold text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{e.name}</h4>
                            <div className={`h-2 rounded-full mt-1 overflow-hidden ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                              <div className="h-full rounded-full bg-gradient-to-r from-teal-500 to-cyan-500" style={{ width: `${p.progress}%` }}></div>
                            </div>
                          </div>
                          <span className={`text-sm font-bold ${isDarkMode ? 'text-teal-400' : 'text-teal-600'}`}>{p.progress}%</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          {[`${p.sessions} sessions`, `${p.totalMins} mins`, `${p.calories} cal`].map((stat, j) => (
                            <span key={j} className={`text-xs px-2 py-1 rounded-lg text-center ${isDarkMode ? 'bg-gray-700/50 text-gray-400' : 'bg-gray-50 text-gray-500'}`}>{stat}</span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== Memory Matrix Game Modal ===== */}
      {activeGame?.type === 'memory' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div onClick={(e) => e.stopPropagation()} className={`relative w-full max-w-lg flex flex-col rounded-3xl border-2 shadow-2xl overflow-hidden ${
            isDarkMode ? 'bg-gray-900 border-purple-800/40' : 'bg-white border-purple-200'
          }`} style={{ maxHeight: '90vh' }}>
            <div className={`flex-shrink-0 px-6 py-4 border-b flex items-center justify-between ${isDarkMode ? 'border-gray-800 bg-gradient-to-r from-purple-900/40 to-pink-900/30' : 'border-gray-100 bg-gradient-to-r from-purple-50 to-pink-50'}`}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${isDarkMode ? 'bg-purple-900/50' : 'bg-purple-100'}`}><Brain className={`w-5 h-5 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} /></div>
                <div>
                  <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Memory Matrix</h3>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Level {memoryLevel} • Score: {memoryScore} • {formatTimer(memoryTimer)}</p>
                </div>
              </div>
              <button onClick={() => setActiveGame(null)} className={`p-2 rounded-full transition-all hover:scale-110 ${isDarkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}><X size={20} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              {memoryShowPhase && (
                <div className={`text-center mb-4 py-2 rounded-xl text-sm font-medium ${isDarkMode ? 'bg-purple-900/30 text-purple-300' : 'bg-purple-100 text-purple-700'}`}>
                  Memorize the highlighted cells!
                </div>
              )}
              {!memoryShowPhase && !memoryGameOver && (
                <div className={`text-center mb-4 py-2 rounded-xl text-sm font-medium ${isDarkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-700'}`}>
                  Tap the cells that were highlighted ({memoryPlayerPicks.filter(p => memoryGrid.includes(p)).length}/{memoryGrid.length})
                </div>
              )}
              {memoryGameOver && (
                <div className={`text-center mb-4 py-3 rounded-xl ${isDarkMode ? 'bg-red-900/30' : 'bg-red-50'}`}>
                  <p className={`text-lg font-bold ${isDarkMode ? 'text-red-300' : 'text-red-600'}`}>Game Over!</p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Final Score: {memoryScore} • Level reached: {memoryLevel}</p>
                </div>
              )}
              {memoryGameOver && cognitiveAssessment && (
                <div className={`mb-4 p-4 rounded-xl border ${
                  cognitiveAssessment.status_code === 0
                    ? isDarkMode ? 'bg-emerald-900/20 border-emerald-800/40' : 'bg-emerald-50 border-emerald-200'
                    : cognitiveAssessment.status_code === 1
                    ? isDarkMode ? 'bg-amber-900/20 border-amber-800/40' : 'bg-amber-50 border-amber-200'
                    : isDarkMode ? 'bg-red-900/20 border-red-800/40' : 'bg-red-50 border-red-200'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <BrainCircuit className={`w-5 h-5 ${
                      cognitiveAssessment.status_code === 0 ? 'text-emerald-500' : cognitiveAssessment.status_code === 1 ? 'text-amber-500' : 'text-red-500'
                    }`} />
                    <span className={`text-sm font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>AI Cognitive Assessment</span>
                  </div>
                  <p className={`text-xs font-semibold mb-1 ${
                    cognitiveAssessment.status_code === 0 ? 'text-emerald-600' : cognitiveAssessment.status_code === 1 ? 'text-amber-600' : 'text-red-600'
                  }`}>Status: {cognitiveAssessment.status}</p>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{cognitiveAssessment.recommendation}</p>
                </div>
              )}
              {memoryGameOver && cognitiveLoading && (
                <div className={`mb-4 p-3 rounded-xl text-center ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Analyzing cognitive performance...</p>
                </div>
              )}
              <div className="grid grid-cols-4 gap-2 max-w-xs mx-auto">
                {Array.from({ length: 16 }).map((_, idx) => {
                  const isHighlighted = memoryGrid.includes(idx);
                  const isPicked = memoryPlayerPicks.includes(idx);
                  const showHighlight = memoryShowPhase && isHighlighted;
                  const isCorrectPick = isPicked && isHighlighted;
                  const isWrongPick = isPicked && !isHighlighted;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleMemoryCellClick(idx)}
                      disabled={memoryShowPhase || memoryGameOver}
                      className={`aspect-square rounded-xl border-2 transition-all duration-300 font-bold text-lg ${
                        showHighlight
                          ? 'bg-gradient-to-br from-purple-500 to-pink-500 border-purple-400 scale-105 shadow-lg shadow-purple-500/30'
                          : isCorrectPick
                          ? 'bg-gradient-to-br from-emerald-500 to-green-500 border-emerald-400 text-white'
                          : isWrongPick
                          ? 'bg-gradient-to-br from-red-500 to-rose-500 border-red-400 text-white'
                          : isDarkMode
                          ? 'bg-gray-800 border-gray-700 hover:border-purple-600 hover:bg-gray-750'
                          : 'bg-gray-100 border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                      }`}
                    >
                      {isCorrectPick ? '✓' : isWrongPick ? '✗' : ''}
                    </button>
                  );
                })}
              </div>
              {memoryGameOver && (
                <div className="flex justify-center mt-5">
                  <button onClick={() => { setMemoryLevel(1); setMemoryScore(0); setMemoryTimer(0); startMemoryGame(); }} className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all hover:scale-105 shadow-lg">
                    <RotateCcw className="w-4 h-4" /> Play Again
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ===== Pattern Puzzles Game Modal ===== */}
      {activeGame?.type === 'pattern' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div onClick={(e) => e.stopPropagation()} className={`relative w-full max-w-lg flex flex-col rounded-3xl border-2 shadow-2xl overflow-hidden ${
            isDarkMode ? 'bg-gray-900 border-pink-800/40' : 'bg-white border-pink-200'
          }`} style={{ maxHeight: '90vh' }}>
            <div className={`flex-shrink-0 px-6 py-4 border-b flex items-center justify-between ${isDarkMode ? 'border-gray-800 bg-gradient-to-r from-pink-900/40 to-rose-900/30' : 'border-gray-100 bg-gradient-to-r from-pink-50 to-rose-50'}`}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${isDarkMode ? 'bg-pink-900/50' : 'bg-pink-100'}`}><Gamepad2 className={`w-5 h-5 ${isDarkMode ? 'text-pink-400' : 'text-pink-600'}`} /></div>
                <div>
                  <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Pattern Puzzles</h3>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Level {patternLevel} • Score: {patternScore} • {formatTimer(patternTimer)}</p>
                </div>
              </div>
              <button onClick={() => setActiveGame(null)} className={`p-2 rounded-full transition-all hover:scale-110 ${isDarkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}><X size={20} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <p className={`text-center text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>What comes next in the pattern?</p>
              {/* Sequence display */}
              <div className="flex items-center justify-center gap-2 flex-wrap mb-6">
                {patternSequence.map((num, i) => (
                  <div key={i} className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg border-2 ${
                    isDarkMode ? 'bg-gray-800 border-gray-700 text-pink-400' : 'bg-pink-50 border-pink-200 text-pink-600'
                  }`}>{num}</div>
                ))}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-2xl border-2 border-dashed ${
                  isDarkMode ? 'border-pink-700 text-pink-500' : 'border-pink-300 text-pink-400'
                }`}>?</div>
              </div>
              {/* Feedback */}
              {patternFeedback === 'correct' && (
                <div className={`text-center mb-4 py-2 rounded-xl text-sm font-bold ${isDarkMode ? 'bg-emerald-900/30 text-emerald-300' : 'bg-emerald-100 text-emerald-700'}`}>
                  ✓ Correct! +{patternLevel * 15} points
                </div>
              )}
              {patternGameOver && (
                <div className={`text-center mb-4 py-3 rounded-xl ${isDarkMode ? 'bg-red-900/30' : 'bg-red-50'}`}>
                  <p className={`text-lg font-bold ${isDarkMode ? 'text-red-300' : 'text-red-600'}`}>Wrong Answer!</p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>The answer was {patternAnswer}. Final Score: {patternScore}</p>
                </div>
              )}
              {patternGameOver && cognitiveAssessment && (
                <div className={`mb-4 p-4 rounded-xl border ${
                  cognitiveAssessment.status_code === 0
                    ? isDarkMode ? 'bg-emerald-900/20 border-emerald-800/40' : 'bg-emerald-50 border-emerald-200'
                    : cognitiveAssessment.status_code === 1
                    ? isDarkMode ? 'bg-amber-900/20 border-amber-800/40' : 'bg-amber-50 border-amber-200'
                    : isDarkMode ? 'bg-red-900/20 border-red-800/40' : 'bg-red-50 border-red-200'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <BrainCircuit className={`w-5 h-5 ${
                      cognitiveAssessment.status_code === 0 ? 'text-emerald-500' : cognitiveAssessment.status_code === 1 ? 'text-amber-500' : 'text-red-500'
                    }`} />
                    <span className={`text-sm font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>AI Cognitive Assessment</span>
                  </div>
                  <p className={`text-xs font-semibold mb-1 ${
                    cognitiveAssessment.status_code === 0 ? 'text-emerald-600' : cognitiveAssessment.status_code === 1 ? 'text-amber-600' : 'text-red-600'
                  }`}>Status: {cognitiveAssessment.status}</p>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{cognitiveAssessment.recommendation}</p>
                </div>
              )}
              {patternGameOver && cognitiveLoading && (
                <div className={`mb-4 p-3 rounded-xl text-center ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Analyzing cognitive performance...</p>
                </div>
              )}
              {/* Options */}
              {!patternGameOver && (
                <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto">
                  {patternOptions.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handlePatternChoice(opt)}
                      className={`py-4 rounded-xl font-bold text-lg border-2 transition-all duration-300 hover:scale-105 ${
                        isDarkMode
                          ? 'bg-gray-800 border-gray-700 hover:border-pink-500 hover:bg-gray-750 text-white'
                          : 'bg-white border-gray-200 hover:border-pink-400 hover:bg-pink-50 text-gray-800'
                      }`}
                    >{opt}</button>
                  ))}
                </div>
              )}
              {patternGameOver && (
                <div className="flex justify-center mt-5">
                  <button onClick={() => { setPatternTimer(0); startPatternGame(); }} className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 transition-all hover:scale-105 shadow-lg">
                    <RotateCcw className="w-4 h-4" /> Play Again
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ===== Reaction Master Game Modal ===== */}
      {activeGame?.type === 'reaction' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div onClick={(e) => e.stopPropagation()} className={`relative w-full max-w-lg flex flex-col rounded-3xl border-2 shadow-2xl overflow-hidden ${
            isDarkMode ? 'bg-gray-900 border-amber-800/40' : 'bg-white border-amber-200'
          }`} style={{ maxHeight: '90vh' }}>
            <div className={`flex-shrink-0 px-6 py-4 border-b flex items-center justify-between ${isDarkMode ? 'border-gray-800 bg-gradient-to-r from-amber-900/40 to-orange-900/30' : 'border-gray-100 bg-gradient-to-r from-amber-50 to-orange-50'}`}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${isDarkMode ? 'bg-amber-900/50' : 'bg-amber-100'}`}><Zap className={`w-5 h-5 ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`} /></div>
                <div>
                  <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Reaction Master</h3>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Round {reactionRound} • Best: {reactionBest < 999 ? `${reactionBest}ms` : '--'}</p>
                </div>
              </div>
              <button onClick={() => setActiveGame(null)} className={`p-2 rounded-full transition-all hover:scale-110 ${isDarkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}><X size={20} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              {reactionPhase === 'waiting' && (
                <div className="text-center space-y-4">
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Click the button when it turns green. Be quick!</p>
                  {reactionTime === -1 && (
                    <div className={`py-2 rounded-xl text-sm font-medium ${isDarkMode ? 'bg-red-900/30 text-red-300' : 'bg-red-100 text-red-600'}`}>Too early! Wait for green.</div>
                  )}
                  {reactionScores.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {reactionScores.slice(-6).map((s, i) => (
                        <span key={i} className={`text-xs py-1.5 rounded-lg text-center font-medium ${s < 300 ? isDarkMode ? 'bg-emerald-900/30 text-emerald-300' : 'bg-emerald-100 text-emerald-700' : isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'}`}>{s}ms</span>
                      ))}
                    </div>
                  )}
                  <button onClick={startReactionRound} className="px-8 py-4 rounded-2xl font-bold text-lg text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 transition-all hover:scale-105 shadow-lg shadow-amber-500/30">
                    Start Round
                  </button>
                </div>
              )}
              {reactionPhase === 'ready' && (
                <button onClick={handleReactionClick} className="w-full aspect-[2/1] rounded-2xl flex items-center justify-center bg-gradient-to-br from-red-500 to-rose-600 transition-all shadow-xl cursor-pointer">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-white">Wait...</p>
                    <p className="text-white/70 text-sm mt-1">Don't click yet!</p>
                  </div>
                </button>
              )}
              {reactionPhase === 'go' && (
                <button onClick={handleReactionClick} className="w-full aspect-[2/1] rounded-2xl flex items-center justify-center bg-gradient-to-br from-emerald-400 to-green-500 transition-all shadow-xl shadow-emerald-500/30 cursor-pointer animate-pulse">
                  <div className="text-center">
                    <p className="text-4xl font-bold text-white">CLICK NOW!</p>
                    <p className="text-white/80 text-sm mt-1">As fast as you can!</p>
                  </div>
                </button>
              )}
              {reactionPhase === 'result' && (
                <div className="text-center space-y-4">
                  <div className={`py-6 rounded-2xl ${reactionTime < 300 ? isDarkMode ? 'bg-emerald-900/30' : 'bg-emerald-50' : isDarkMode ? 'bg-amber-900/30' : 'bg-amber-50'}`}>
                    <p className={`text-5xl font-bold ${reactionTime < 300 ? isDarkMode ? 'text-emerald-400' : 'text-emerald-600' : isDarkMode ? 'text-amber-400' : 'text-amber-600'}`}>{reactionTime}ms</p>
                    <p className={`text-sm mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {reactionTime < 200 ? 'Incredible! Lightning fast!' : reactionTime < 300 ? 'Great reflexes!' : reactionTime < 400 ? 'Good reaction time!' : 'Keep practicing!'}
                    </p>
                  </div>
                  <div className="flex gap-3 justify-center">
                    <button onClick={startReactionRound} className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:scale-105 transition-all shadow-lg">
                      <RefreshCw className="w-4 h-4" /> Next Round
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ===== Word Recall Game Modal ===== */}
      {activeGame?.type === 'wordrecall' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div onClick={(e) => e.stopPropagation()} className={`relative w-full max-w-lg flex flex-col rounded-3xl border-2 shadow-2xl overflow-hidden ${
            isDarkMode ? 'bg-gray-900 border-violet-800/40' : 'bg-white border-violet-200'
          }`} style={{ maxHeight: '90vh' }}>
            <div className={`flex-shrink-0 px-6 py-4 border-b flex items-center justify-between ${isDarkMode ? 'border-gray-800 bg-gradient-to-r from-violet-900/40 to-purple-900/30' : 'border-gray-100 bg-gradient-to-r from-violet-50 to-purple-50'}`}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${isDarkMode ? 'bg-violet-900/50' : 'bg-violet-100'}`}><Brain className={`w-5 h-5 ${isDarkMode ? 'text-violet-400' : 'text-violet-600'}`} /></div>
                <div>
                  <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Word Recall</h3>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Level {wordRecallLevel} • Score: {wordRecallScore} • {formatTimer(wordRecallTimer)}</p>
                </div>
              </div>
              <button onClick={() => setActiveGame(null)} className={`p-2 rounded-full transition-all hover:scale-110 ${isDarkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}><X size={20} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              {wordRecallShowPhase && (
                <div className="text-center space-y-4">
                  <div className={`py-2 rounded-xl text-sm font-medium ${isDarkMode ? 'bg-violet-900/30 text-violet-300' : 'bg-violet-100 text-violet-700'}`}>
                    Memorize these {wordRecallWords.length} words!
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {wordRecallWords.map((w, i) => (
                      <span key={i} className={`px-4 py-2 rounded-xl text-sm font-bold border-2 ${isDarkMode ? 'bg-violet-900/40 border-violet-700 text-violet-300' : 'bg-violet-100 border-violet-300 text-violet-700'}`}>{w}</span>
                    ))}
                  </div>
                  <div className={`text-xs animate-pulse ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Words will disappear soon...</div>
                </div>
              )}
              {!wordRecallShowPhase && !wordRecallGameOver && (
                <div className="space-y-4">
                  <div className={`py-2 rounded-xl text-sm font-medium text-center ${isDarkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-700'}`}>
                    Type the words you remember ({wordRecallGuesses.filter(g => wordRecallWords.includes(g)).length}/{wordRecallWords.length})
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={wordRecallInput}
                      onChange={(e) => setWordRecallInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleWordRecallSubmit()}
                     
                      className={`flex-1 px-4 py-3 rounded-xl border-2 outline-none text-sm font-medium transition-all ${
                        isDarkMode ? 'bg-gray-800 border-gray-700 text-white focus:border-violet-500 placeholder-gray-500' : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-violet-400 placeholder-gray-400'
                      }`}
                      autoFocus
                    />
                    <button onClick={handleWordRecallSubmit} className="px-4 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-violet-500 to-purple-500 hover:scale-105 transition-all">Submit</button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {wordRecallGuesses.map((g, i) => (
                      <span key={i} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                        wordRecallWords.includes(g)
                          ? isDarkMode ? 'bg-emerald-900/40 text-emerald-300 border border-emerald-700' : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                          : isDarkMode ? 'bg-red-900/40 text-red-300 border border-red-700' : 'bg-red-100 text-red-700 border border-red-200'
                      }`}>{g} {wordRecallWords.includes(g) ? '✓' : '✗'}</span>
                    ))}
                  </div>
                  <p className={`text-xs text-center ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    {wordRecallWords.length + 3 - wordRecallGuesses.length} guesses remaining
                  </p>
                </div>
              )}
              {wordRecallGameOver && (
                <div className="text-center space-y-4">
                  <div className={`py-4 rounded-2xl ${isDarkMode ? 'bg-violet-900/30' : 'bg-violet-50'}`}>
                    <p className={`text-lg font-bold ${isDarkMode ? 'text-violet-300' : 'text-violet-600'}`}>Round Over!</p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      You recalled {wordRecallGuesses.filter(g => wordRecallWords.includes(g)).length}/{wordRecallWords.length} words • Score: {wordRecallScore}
                    </p>
                  </div>
                  {cognitiveAssessment && (
                    <div className={`p-4 rounded-xl border ${
                      cognitiveAssessment.status_code === 0
                        ? isDarkMode ? 'bg-emerald-900/20 border-emerald-800/40' : 'bg-emerald-50 border-emerald-200'
                        : cognitiveAssessment.status_code === 1
                        ? isDarkMode ? 'bg-amber-900/20 border-amber-800/40' : 'bg-amber-50 border-amber-200'
                        : isDarkMode ? 'bg-red-900/20 border-red-800/40' : 'bg-red-50 border-red-200'
                    }`}>
                      <div className="flex items-center gap-2 mb-2">
                        <BrainCircuit className={`w-5 h-5 ${
                          cognitiveAssessment.status_code === 0 ? 'text-emerald-500' : cognitiveAssessment.status_code === 1 ? 'text-amber-500' : 'text-red-500'
                        }`} />
                        <span className={`text-sm font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>AI Cognitive Assessment</span>
                      </div>
                      <p className={`text-xs font-semibold mb-1 ${
                        cognitiveAssessment.status_code === 0 ? 'text-emerald-600' : cognitiveAssessment.status_code === 1 ? 'text-amber-600' : 'text-red-600'
                      }`}>Status: {cognitiveAssessment.status}</p>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{cognitiveAssessment.recommendation}</p>
                    </div>
                  )}
                  {cognitiveLoading && (
                    <div className={`p-3 rounded-xl text-center ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Analyzing cognitive performance...</p>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2 justify-center">
                    {wordRecallWords.map((w, i) => (
                      <span key={i} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                        wordRecallGuesses.includes(w)
                          ? isDarkMode ? 'bg-emerald-900/40 text-emerald-300' : 'bg-emerald-100 text-emerald-700'
                          : isDarkMode ? 'bg-red-900/40 text-red-300' : 'bg-red-100 text-red-600'
                      }`}>{w} {wordRecallGuesses.includes(w) ? '✓' : '✗'}</span>
                    ))}
                  </div>
                  <button onClick={() => { setWordRecallLevel(1); setWordRecallScore(0); setWordRecallTimer(0); startWordRecallGame(); }} className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 transition-all hover:scale-105 shadow-lg mx-auto">
                    <RotateCcw className="w-4 h-4" /> Play Again
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ===== Exercise Timer Modal ===== */}
      {activeExercise && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div onClick={(e) => e.stopPropagation()} className={`relative w-full max-w-md flex flex-col rounded-3xl border-2 shadow-2xl overflow-hidden ${
            isDarkMode ? 'bg-gray-900 border-teal-800/40' : 'bg-white border-teal-200'
          }`}>
            <div className={`flex-shrink-0 relative overflow-hidden ${isDarkMode ? 'bg-gradient-to-r from-teal-900/80 via-cyan-900/60 to-blue-900/50' : 'bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500'}`}>
              <div className="absolute inset-0"><div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -translate-y-1/2 animate-pulse"></div></div>
              <div className="relative z-10 px-6 py-5">
                <button onClick={() => { setActiveExercise(null); setExerciseRunning(false); }} className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all hover:scale-110"><X size={20} /></button>
                <h3 className="text-xl font-bold text-white">{activeExercise.name}</h3>
                <p className="text-sm text-white/70">{activeExercise.description}</p>
              </div>
            </div>
            <div className="p-6 text-center space-y-6">
              {/* Timer Display */}
              <div className={`relative mx-auto w-48 h-48 rounded-full flex items-center justify-center border-4 ${
                exerciseCompleted
                  ? 'border-emerald-500'
                  : exerciseRunning
                  ? 'border-teal-500'
                  : isDarkMode ? 'border-gray-700' : 'border-gray-200'
              }`}>
                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="46" fill="none" strokeWidth="4" className={isDarkMode ? 'stroke-gray-800' : 'stroke-gray-100'} />
                  {activeExercise && (
                    <circle cx="50" cy="50" r="46" fill="none" strokeWidth="4" strokeLinecap="round"
                      className={exerciseCompleted ? 'stroke-emerald-500' : 'stroke-teal-500'}
                      strokeDasharray={`${2 * Math.PI * 46}`}
                      strokeDashoffset={`${2 * Math.PI * 46 * (exerciseTimer / (parseInt(activeExercise.duration) * 60))}`}
                    />
                  )}
                </svg>
                <div>
                  <p className={`text-4xl font-bold font-mono ${
                    exerciseCompleted ? isDarkMode ? 'text-emerald-400' : 'text-emerald-600' : isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>{formatTimer(exerciseTimer)}</p>
                  <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    {exerciseCompleted ? 'Completed!' : exerciseRunning ? 'In Progress' : 'Ready'}
                  </p>
                </div>
              </div>

              {/* Exercise Info */}
              <div className="grid grid-cols-3 gap-3">
                <div className={`rounded-xl p-3 ${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Duration</p>
                  <p className={`font-bold ${isDarkMode ? 'text-teal-400' : 'text-teal-600'}`}>{activeExercise.duration}</p>
                </div>
                <div className={`rounded-xl p-3 ${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Calories</p>
                  <p className={`font-bold ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`}>{activeExercise.calories}</p>
                </div>
                <div className={`rounded-xl p-3 ${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Intensity</p>
                  <p className={`font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>{activeExercise.intensity}</p>
                </div>
              </div>

              {/* Controls */}
              {exerciseCompleted ? (
                <div className="space-y-3">
                  <div className={`py-3 rounded-xl ${isDarkMode ? 'bg-emerald-900/30' : 'bg-emerald-50'}`}>
                    <p className={`text-lg font-bold ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>Well Done! 🎉</p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>You burned {activeExercise.calories} • {activeExercise.duration} completed</p>
                  </div>
                  <button onClick={() => setActiveExercise(null)} className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-emerald-500 to-green-500 hover:scale-[1.02] transition-all shadow-lg">
                    Done
                  </button>
                </div>
              ) : (
                <div className="flex gap-3">
                  {!exerciseRunning ? (
                    <button onClick={() => setExerciseRunning(true)} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-teal-500 to-cyan-500 hover:scale-[1.02] transition-all shadow-lg">
                      <Play className="w-5 h-5" /> {exerciseTimer < parseInt(activeExercise.duration) * 60 ? 'Resume' : 'Start'}
                    </button>
                  ) : (
                    <button onClick={() => setExerciseRunning(false)} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:scale-[1.02] transition-all shadow-lg">
                      <Pause className="w-5 h-5" /> Pause
                    </button>
                  )}
                  <button onClick={() => { setExerciseTimer(parseInt(activeExercise.duration) * 60); setExerciseRunning(false); setExerciseCompleted(false); }} className={`px-4 py-3 rounded-xl font-medium transition-all hover:scale-105 ${isDarkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                    <RotateCcw className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ===== All Reports Modal ===== */}
      {showAllReports && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setShowAllReports(false)}>
          <div onClick={(e) => e.stopPropagation()} className={`relative w-full max-w-5xl flex flex-col rounded-3xl border-2 shadow-2xl overflow-hidden ${
            isDarkMode
              ? 'bg-gray-900 border-cyan-800/40'
              : 'bg-white border-cyan-200'
          }`} style={{ maxHeight: '90vh' }}>
            {/* Gradient Banner Header */}
            <div className="flex-shrink-0">
              <div className={`relative overflow-hidden ${
                isDarkMode
                  ? 'bg-gradient-to-r from-cyan-900/80 via-blue-900/60 to-purple-900/50'
                  : 'bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500'
              }`}>
                {/* Animated decorative elements */}
                <div className="absolute inset-0">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 animate-pulse"></div>
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 animate-pulse delay-1000"></div>
                  <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-cyan-300/10 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2"></div>
                </div>
                <div className="relative z-10 px-6 pt-5 pb-4">
                  <button onClick={() => setShowAllReports(false)} className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all duration-200 hover:scale-110 backdrop-blur-sm">
                    <X size={20} />
                  </button>
                  <div className="flex items-center gap-4">
                    <div className="p-3.5 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20 shadow-lg">
                      <FileText className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white tracking-tight">All Health Reports</h2>
                      <p className="text-sm text-white/70 mt-0.5">{allReportsData.length} reports • {filteredReports.length} showing</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Search & Filter Section */}
              <div className={`px-6 pt-5 pb-4 border-b ${isDarkMode ? 'border-gray-800' : 'border-gray-100'}`}>
                {/* Search Bar */}
                <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all duration-300 mb-4 ${
                  isDarkMode
                    ? 'bg-gray-800/60 border-gray-700/60 focus-within:border-cyan-500 focus-within:bg-gray-800/80'
                    : 'bg-gray-50/80 border-gray-200 focus-within:border-cyan-400 focus-within:bg-white'
                }`}>
                  <div className={`p-2 rounded-xl flex-shrink-0 ${
                    isDarkMode ? 'bg-cyan-900/40' : 'bg-gradient-to-br from-cyan-100 to-blue-100'
                  }`}>
                    <Search className={`w-4 h-4 ${isDarkMode ? 'text-cyan-400' : 'text-cyan-600'}`} />
                  </div>
                  <input
                    type="text"
                   
                    value={reportsSearchQuery}
                    onChange={(e) => setReportsSearchQuery(e.target.value)}
                    className={`w-full bg-transparent outline-none text-sm font-medium ${isDarkMode ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'}`}
                  />
                  {reportsSearchQuery && (
                    <button onClick={() => setReportsSearchQuery('')} className={`p-1.5 rounded-lg transition-all duration-200 hover:scale-110 flex-shrink-0 ${
                      isDarkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-400'
                    }`}>
                      <X size={14} />
                    </button>
                  )}
                </div>

                {/* Filter Chips */}
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                  {[
                    { label: 'All', icon: <BarChart3 className="w-3.5 h-3.5" />, color: 'cyan' },
                    { label: 'PDF', icon: <FileText className="w-3.5 h-3.5" />, color: 'red' },
                    { label: 'Excel', icon: <Database className="w-3.5 h-3.5" />, color: 'emerald' },
                    { label: 'Summary', icon: <ClipboardCheck className="w-3.5 h-3.5" />, color: 'blue' },
                    { label: 'Specialist', icon: <Stethoscope className="w-3.5 h-3.5" />, color: 'purple' },
                    { label: 'Medication', icon: <Pill className="w-3.5 h-3.5" />, color: 'amber' },
                    { label: 'Wellness', icon: <Heart className="w-3.5 h-3.5" />, color: 'pink' },
                    { label: 'Lab Results', icon: <Droplets className="w-3.5 h-3.5" />, color: 'teal' },
                    { label: 'Cognitive', icon: <Brain className="w-3.5 h-3.5" />, color: 'indigo' },
                  ].map(filter => {
                    const isActive = reportsFilter === filter.label;
                    const colorMap = {
                      cyan: isActive ? 'from-cyan-500 to-blue-500 shadow-cyan-500/25' : '',
                      red: isActive ? 'from-red-500 to-rose-500 shadow-red-500/25' : '',
                      emerald: isActive ? 'from-emerald-500 to-green-500 shadow-emerald-500/25' : '',
                      blue: isActive ? 'from-blue-500 to-indigo-500 shadow-blue-500/25' : '',
                      purple: isActive ? 'from-purple-500 to-violet-500 shadow-purple-500/25' : '',
                      amber: isActive ? 'from-amber-500 to-orange-500 shadow-amber-500/25' : '',
                      pink: isActive ? 'from-pink-500 to-rose-500 shadow-pink-500/25' : '',
                      teal: isActive ? 'from-teal-500 to-cyan-500 shadow-teal-500/25' : '',
                      indigo: isActive ? 'from-indigo-500 to-purple-500 shadow-indigo-500/25' : '',
                    };
                    const inactiveIcon = {
                      cyan: isDarkMode ? 'text-cyan-400' : 'text-cyan-600',
                      red: isDarkMode ? 'text-red-400' : 'text-red-500',
                      emerald: isDarkMode ? 'text-emerald-400' : 'text-emerald-600',
                      blue: isDarkMode ? 'text-blue-400' : 'text-blue-500',
                      purple: isDarkMode ? 'text-purple-400' : 'text-purple-500',
                      amber: isDarkMode ? 'text-amber-400' : 'text-amber-600',
                      pink: isDarkMode ? 'text-pink-400' : 'text-pink-500',
                      teal: isDarkMode ? 'text-teal-400' : 'text-teal-600',
                      indigo: isDarkMode ? 'text-indigo-400' : 'text-indigo-500',
                    };
                    return (
                      <button
                        key={filter.label}
                        onClick={() => setReportsFilter(filter.label)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-semibold transition-all duration-300 whitespace-nowrap ${
                          isActive
                            ? `bg-gradient-to-r ${colorMap[filter.color]} text-white shadow-lg hover:shadow-xl hover:scale-105`
                            : isDarkMode
                              ? 'bg-gray-800/70 text-gray-400 hover:bg-gray-700/70 hover:text-gray-300 border border-gray-700/50'
                              : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-800 border border-gray-200/80'
                        }`}
                      >
                        <span className={isActive ? 'text-white' : inactiveIcon[filter.color]}>{filter.icon}</span>
                        {filter.label}
                        {isActive && filter.label !== 'All' && (
                          <span className="bg-white/25 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                            {filteredReports.length}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Scrollable Reports Grid */}
            <div className="flex-1 overflow-y-auto p-6 pt-4">
              {filteredReports.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <FileText className={`w-16 h-16 mb-4 ${isDarkMode ? 'text-gray-700' : 'text-gray-300'}`} />
                  <p className={`text-lg font-medium mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>No reports found</p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>Try adjusting your search or filter</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredReports.map((report) => (
                    <div key={report.id} className={`group relative rounded-2xl p-5 border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                      isDarkMode
                        ? 'bg-gradient-to-br from-gray-800/60 to-gray-900/40 border-gray-700/50 hover:border-cyan-700/50'
                        : 'bg-gradient-to-br from-white to-gray-50/80 border-gray-200 hover:border-cyan-300'
                    }`}>
                      {/* Top Row: Icon + Type Badge */}
                      <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 rounded-xl ${
                          isDarkMode ? 'bg-cyan-950/50' : 'bg-gradient-to-br from-cyan-50 to-blue-50'
                        }`}>
                          <div className={isDarkMode ? 'text-cyan-400' : 'text-cyan-600'}>
                            {getReportIcon(report.icon)}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                            report.type === 'PDF'
                              ? isDarkMode ? 'bg-red-900/30 text-red-300' : 'bg-red-100 text-red-600'
                              : isDarkMode ? 'bg-emerald-900/30 text-emerald-300' : 'bg-emerald-100 text-emerald-600'
                          }`}>
                            {report.type}
                          </span>
                          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                            isDarkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-600'
                          }`}>
                            {report.category}
                          </span>
                        </div>
                      </div>

                      {/* Report Info */}
                      <h4 className={`font-bold text-base mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {report.name}
                      </h4>
                      <p className={`text-xs mb-3 line-clamp-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {report.description}
                      </p>
                      <div className="flex items-center gap-3 mb-4">
                        <span className={`text-xs flex items-center gap-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                          <Calendar className="w-3 h-3" /> {report.date}
                        </span>
                        <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>•</span>
                        <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>{report.size}</span>
                        <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>•</span>
                        <span className={`text-xs ${isDarkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>{report.doctor}</span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => { setShowAllReports(false); setViewingReport(report); }}
                          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-[1.02] ${
                            isDarkMode
                              ? 'bg-gray-700/50 hover:bg-gray-600/50 text-gray-200'
                              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                          }`}
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </button>
                        <button
                          onClick={() => downloadSingleReport(report)}
                          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-[1.02] ${
                            isDarkMode
                              ? 'bg-gradient-to-r from-cyan-700/50 to-blue-700/50 hover:from-cyan-600/50 hover:to-blue-600/50 text-white'
                              : 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white'
                          }`}
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ===== View Report Modal ===== */}
      {viewingReport && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setViewingReport(null)}>
          <div onClick={(e) => e.stopPropagation()} className={`relative w-full max-w-3xl flex flex-col rounded-3xl border-2 shadow-2xl overflow-hidden ${
            isDarkMode
              ? 'bg-gray-900 border-cyan-800/40'
              : 'bg-white border-cyan-200'
          }`} style={{ maxHeight: '90vh' }}>
            {/* Header */}
            <div className={`flex-shrink-0 border-b ${
              isDarkMode ? 'border-gray-800' : 'border-gray-100'
            }`}>
              {/* Colored Banner */}
              <div className={`h-24 relative overflow-hidden ${
                isDarkMode
                  ? 'bg-gradient-to-r from-cyan-900/60 via-blue-900/40 to-purple-900/30'
                  : 'bg-gradient-to-r from-cyan-500 via-blue-400 to-purple-400'
              }`}>
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-2 left-10 w-20 h-20 rounded-full bg-white/20 blur-xl"></div>
                  <div className="absolute bottom-0 right-20 w-32 h-16 rounded-full bg-white/10 blur-xl"></div>
                </div>
                <button onClick={() => setViewingReport(null)} className="absolute top-3 right-3 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-all duration-200 hover:scale-110">
                  <X size={18} />
                </button>
                {showAllReports && (
                  <button onClick={() => { setViewingReport(null); setShowAllReports(true); }} className="absolute top-3 left-3 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-all duration-200 hover:scale-110 flex items-center gap-1">
                    <ArrowLeft size={18} />
                  </button>
                )}
              </div>
              {/* Report Title Area */}
              <div className="px-6 pb-4 -mt-8 relative z-10">
                <div className="flex items-end gap-4">
                  <div className={`p-4 rounded-2xl border-4 shadow-lg ${
                    isDarkMode ? 'bg-gray-800 border-gray-900' : 'bg-white border-white'
                  }`}>
                    <div className={isDarkMode ? 'text-cyan-400' : 'text-cyan-600'}>
                      {getReportIcon(viewingReport.icon)}
                    </div>
                  </div>
                  <div className="flex-1 pb-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{viewingReport.name}</h2>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        viewingReport.type === 'PDF'
                          ? isDarkMode ? 'bg-red-900/40 text-red-300' : 'bg-red-100 text-red-600'
                          : isDarkMode ? 'bg-emerald-900/40 text-emerald-300' : 'bg-emerald-100 text-emerald-600'
                      }`}>
                        {viewingReport.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className={`text-xs flex items-center gap-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        <Calendar className="w-3 h-3" /> {viewingReport.date}
                      </span>
                      <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>•</span>
                      <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{viewingReport.size}</span>
                      <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>•</span>
                      <span className={`text-xs font-medium ${isDarkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>{viewingReport.doctor}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Status & Category */}
              <div className="flex items-center gap-3">
                <span className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full ${
                  isDarkMode ? 'bg-emerald-900/40 text-emerald-300' : 'bg-emerald-100 text-emerald-700'
                }`}>
                  <Check className="w-3 h-3" /> {viewingReport.status}
                </span>
                <span className={`text-xs font-medium px-3 py-1.5 rounded-full ${
                  isDarkMode ? 'bg-blue-900/40 text-blue-300' : 'bg-blue-100 text-blue-700'
                }`}>
                  {viewingReport.category}
                </span>
              </div>

              {/* Description */}
              <div className={`rounded-2xl p-5 border ${
                isDarkMode ? 'bg-gray-800/40 border-gray-700/50' : 'bg-gray-50 border-gray-100'
              }`}>
                <h3 className={`text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Description</h3>
                <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {viewingReport.description}
                </p>
              </div>

              {/* Key Metrics */}
              <div>
                <h3 className={`text-sm font-semibold mb-3 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Key Metrics</h3>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(viewingReport.metrics).map(([key, value], idx) => (
                    <div key={idx} className={`rounded-xl p-4 border transition-all duration-200 ${
                      isDarkMode
                        ? 'bg-gradient-to-br from-gray-800/60 to-gray-800/30 border-gray-700/40'
                        : 'bg-gradient-to-br from-white to-gray-50 border-gray-200/60'
                    }`}>
                      <p className={`text-xs font-medium mb-1 capitalize ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </p>
                      <p className={`text-lg font-bold ${isDarkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Doctor Info */}
              <div className={`rounded-2xl p-5 border ${
                isDarkMode ? 'bg-gradient-to-r from-cyan-950/30 to-blue-950/20 border-cyan-900/30' : 'bg-gradient-to-r from-cyan-50 to-blue-50 border-cyan-200/50'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-full ${
                    isDarkMode ? 'bg-cyan-900/50' : 'bg-cyan-100'
                  }`}>
                    <Stethoscope className={`w-5 h-5 ${isDarkMode ? 'text-cyan-400' : 'text-cyan-600'}`} />
                  </div>
                  <div>
                    <p className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{viewingReport.doctor}</p>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Attending Physician</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Fixed Footer Actions */}
            <div className={`flex-shrink-0 p-5 border-t flex items-center justify-between ${
              isDarkMode ? 'border-gray-800 bg-gray-900/80' : 'border-gray-100 bg-white/80'
            } backdrop-blur-sm`}>
              <p className={`text-xs ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>Report ID: RPT-{String(viewingReport.id).padStart(4, '0')}</p>
              <div className="flex gap-3">
                <button
                  onClick={() => downloadSingleReport(viewingReport)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-105 ${
                    isDarkMode
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-lg shadow-cyan-900/30'
                      : 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-lg shadow-cyan-200/50'
                  }`}
                >
                  <Download className="w-4 h-4" />
                  Download Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== Reminder Toast ===== */}
      {reminderMsg && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div className={`flex items-center gap-3 px-5 py-3 rounded-2xl shadow-2xl border ${
            isDarkMode
              ? 'bg-gray-900 border-emerald-700/50 text-emerald-300'
              : 'bg-white border-emerald-200 text-emerald-700'
          }`}>
            <Bell className="w-5 h-5" />
            <span className="text-sm font-medium">{reminderMsg}</span>
            <button onClick={() => setReminderMsg('')} className="ml-2 p-1 rounded-full hover:bg-gray-200/20">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Elderly;