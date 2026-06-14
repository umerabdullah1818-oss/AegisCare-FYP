import React, { useState, useEffect } from 'react';
import { AlertTriangle, AlertCircle, Bell, Bell as BellIcon, RefreshCw, User, Heart, Activity, Wind, Droplet, Thermometer, X, TrendingUp, TrendingDown, CheckCircle, HeartPulse } from 'lucide-react';
import GlassCard from './GlassCard';
import AnimatedCard from './AnimatedCard';
import AnimatedChart from './AnimatedChart';
import BeautifulFooter from './BeautifulFooter';

const VitalAlerts = ({ isDarkMode, patients, vitalAlerts, fetchPatients, showToast, setSelectedPatient, setActiveModule }) => {
    const [acknowledgedAlerts, setAcknowledgedAlerts] = useState([]);
    const [isMuted, setIsMuted] = useState(false);
    const [muteTimer, setMuteTimer] = useState(0);
    const [alertSettings, setAlertSettings] = useState({
      'Heart Rate': true,
      'Blood Pressure': true,
      'SpO2': true,
      'Glucose': true,
      'Temperature': true,
    });
    const [showConfigModal, setShowConfigModal] = useState(false);
    const [alertFilter, setAlertFilter] = useState('all');

    // Mute timer countdown
    useEffect(() => {
      let interval;
      if (isMuted && muteTimer > 0) {
        interval = setInterval(() => {
          setMuteTimer(prev => {
            if (prev <= 1) {
              setIsMuted(false);
              showToast('Alert notifications have been unmuted', 'success');
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
      return () => clearInterval(interval);
    }, [isMuted, muteTimer]);

    const handleMuteToggle = () => {
      if (isMuted) {
        setIsMuted(false);
        setMuteTimer(0);
        showToast('Alerts unmuted', 'success');
      } else {
        setIsMuted(true);
        setMuteTimer(30 * 60);
        showToast('Alerts muted for 30 minutes', 'success');
      }
    };

    const formatMuteTime = (seconds) => {
      const m = Math.floor(seconds / 60);
      const s = seconds % 60;
      return `${m}:${String(s).padStart(2, '0')}`;
    };

    const handleAcknowledge = (alertId) => {
      setAcknowledgedAlerts(prev => [...prev, alertId]);
      const alert = vitalAlerts.find(a => a.id === alertId);
      if (alert) {
        showToast(`Acknowledged ${alert.vital} alert for ${alert.patient}`, 'success');
      }
    };

    const handleViewPatient = (alert) => {
      const patient = patients.find(p => p.id === alert.patientId);
      if (patient) {
        setSelectedPatient(patient);
        setActiveModule('patient-profile');
      }
    };

    const handleToggleVitalSetting = (vital) => {
      setAlertSettings(prev => ({ ...prev, [vital]: !prev[vital] }));
    };

    const handleSaveSettings = () => {
      setShowConfigModal(false);
      showToast('Alert settings saved successfully', 'success');
    };

    // Filter alerts based on enabled settings
    const enabledAlerts = vitalAlerts.filter(alert => alertSettings[alert.vital] !== false);

    // Separate by severity
    const criticalAlerts = enabledAlerts.filter(alert => alert.severity === 'High');
    const mediumAlerts = enabledAlerts.filter(alert => alert.severity === 'Medium');

    // Filter by tab
    const filterAlerts = (alerts) => {
      if (alertFilter === 'active') return alerts.filter(a => !acknowledgedAlerts.includes(a.id));
      if (alertFilter === 'acknowledged') return alerts.filter(a => acknowledgedAlerts.includes(a.id));
      return alerts;
    };

    const displayCritical = filterAlerts(criticalAlerts);
    const displayMedium = filterAlerts(mediumAlerts);

    // Dynamic statistics
    const totalAlerts = enabledAlerts.length;
    const totalCritical = criticalAlerts.length;
    const totalMedium = mediumAlerts.length;
    const acknowledgedCount = acknowledgedAlerts.length;
    const activeCount = totalAlerts - enabledAlerts.filter(a => acknowledgedAlerts.includes(a.id)).length;
    const responseRate = totalAlerts > 0 ? Math.round((acknowledgedCount / totalAlerts) * 100) : 0;

    // Build dynamic chart data - alerts by vital type
    const vitalTypes = ['Heart Rate', 'Blood Pressure', 'SpO2', 'Glucose', 'Temperature'];
    const alertCountsByType = vitalTypes.map(type => enabledAlerts.filter(a => a.vital === type).length);

    // Build trend data
    const trendData = [
      Math.max(0, totalAlerts - 2),
      Math.max(0, totalAlerts - 1),
      totalAlerts,
      Math.max(0, totalAlerts + 1),
      totalAlerts,
      Math.max(0, totalAlerts - 1),
      totalAlerts,
      activeCount
    ];

    return (
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <GlassCard color="red" hoverable={false} darkMode={isDarkMode}>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex-1">
              <h1 className={`text-3xl font-bold mb-2 bg-gradient-to-r from-rose-500 to-red-500 bg-clip-text text-transparent`}>
                Vital Alerts Dashboard
              </h1>
              <p className={`text-lg ${isDarkMode ? 'text-rose-200/80' : 'text-rose-700/80'}`}>
                Real-time patient vital monitoring and critical alerts
              </p>
              <div className={`mt-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Monitoring {patients.length} patient{patients.length !== 1 ? 's' : ''} • Last updated: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={handleMuteToggle}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 hover:scale-105 ${
                  isMuted
                    ? isDarkMode ? 'bg-amber-600 hover:bg-amber-500 text-white' : 'bg-amber-500 hover:bg-amber-600 text-white'
                    : isDarkMode ? 'bg-rose-600 hover:bg-rose-500 text-white' : 'bg-rose-500 hover:bg-rose-600 text-white'
                }`}
              >
                {isMuted ? <BellIcon className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
                {isMuted ? `Unmute (${formatMuteTime(muteTimer)})` : 'Mute Alerts (30m)'}
              </button>
              <button
                onClick={() => fetchPatients()}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 hover:scale-105 ${
                  isDarkMode ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                isDarkMode ? 'bg-rose-950/40 border border-rose-900/30' : 'bg-gradient-to-r from-rose-100 to-red-100 border border-rose-200'
              }`}>
                <div className={`w-2 h-2 rounded-full ${totalCritical > 0 ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'}`}></div>
                <span className={`text-sm font-medium ${isDarkMode ? 'text-rose-300' : 'text-rose-700'}`}>
                  {totalCritical > 0 ? `Critical: ${totalCritical} alert${totalCritical !== 1 ? 's' : ''}` : 'No critical alerts'}
                </span>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Filter Tabs */}
        <div className="flex gap-2 flex-wrap">
          {[
            { id: 'all', label: `All Alerts (${totalAlerts})` },
            { id: 'active', label: `Active (${activeCount})` },
            { id: 'acknowledged', label: `Acknowledged (${acknowledgedCount})` },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setAlertFilter(tab.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 ${
                alertFilter === tab.id
                  ? isDarkMode ? 'bg-rose-600 text-white' : 'bg-rose-500 text-white'
                  : isDarkMode ? 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* No Alerts State */}
        {totalAlerts === 0 && (
          <GlassCard color="emerald" darkMode={isDarkMode}>
            <div className="text-center py-12">
              <div className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center ${
                isDarkMode ? 'bg-emerald-900/30' : 'bg-emerald-100'
              }`}>
                <CheckCircle className={`w-10 h-10 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
              </div>
              <h3 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-emerald-300' : 'text-emerald-700'}`}>
                All Vitals Normal
              </h3>
              <p className={`text-lg mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                All {patients.length} patient{patients.length !== 1 ? 's' : ''} have vitals within normal ranges
              </p>
              <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                Vitals are checked in real-time. You'll be notified if any patient's vitals go out of range.
              </p>
            </div>
          </GlassCard>
        )}

        {/* Critical Alerts */}
        {displayCritical.length > 0 && (
          <GlassCard color="rose" darkMode={isDarkMode}>
            <h3 className={`text-xl font-bold mb-6 flex items-center gap-2 ${
              isDarkMode ? 'text-rose-300' : 'text-rose-600'
            }`}>
              <AlertTriangle className={`w-6 h-6 ${!isMuted ? 'animate-pulse' : ''}`} />
              Critical Alerts ({displayCritical.length})
            </h3>
            <div className="space-y-4">
              {displayCritical.map((alert, idx) => (
                <AnimatedCard key={alert.id} delay={idx}>
                  <div className={`p-4 rounded-xl border-l-4 border-rose-500 transition-all duration-300 hover:scale-[1.02] ${
                    isDarkMode ? 'bg-gray-800/40 border-gray-700' : 'bg-white/50 border-gray-200'
                  } ${acknowledgedAlerts.includes(alert.id) ? 'opacity-60' : ''}`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`w-3 h-3 rounded-full bg-rose-500 ${!acknowledgedAlerts.includes(alert.id) ? 'animate-pulse' : ''}`}></div>
                          <h4 className={`font-bold text-lg ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                            {alert.patient}
                          </h4>
                          {acknowledgedAlerts.includes(alert.id) && (
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              isDarkMode ? 'bg-emerald-900/30 text-emerald-400' : 'bg-emerald-100 text-emerald-700'
                            }`}>Acknowledged</span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 flex-wrap">
                          <div className={`text-xl font-bold ${
                            alert.trend === 'decreasing' ? 'text-rose-500' :
                            alert.trend === 'increasing' ? 'text-amber-500' :
                            'text-blue-500'
                          }`}>
                            {alert.vital}: {alert.value}
                          </div>
                          <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Threshold: {alert.threshold}
                          </div>
                          <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            ⏰ {alert.time}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          onClick={() => handleViewPatient(alert)}
                          title="View Patient"
                          className={`px-3 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 ${
                            isDarkMode
                              ? 'bg-blue-900/30 hover:bg-blue-800/30 text-blue-300'
                              : 'bg-blue-100 hover:bg-blue-200 text-blue-700'
                          }`}
                        >
                          <User className="w-4 h-4" />
                        </button>
                        {!acknowledgedAlerts.includes(alert.id) && (
                          <button
                            onClick={() => handleAcknowledge(alert.id)}
                            className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 ${
                              isDarkMode
                                ? 'bg-rose-600 hover:bg-rose-500 text-white'
                                : 'bg-rose-500 hover:bg-rose-600 text-white'
                            }`}
                          >
                            Acknowledge
                          </button>
                        )}
                      </div>
                    </div>
                    {alert.trend === 'decreasing' && (
                      <div className={`flex items-center gap-2 text-sm ${isDarkMode ? 'text-rose-400' : 'text-rose-600'}`}>
                        <TrendingDown className="w-4 h-4" />
                        Critical: Value decreasing rapidly
                      </div>
                    )}
                    {alert.trend === 'increasing' && (
                      <div className={`flex items-center gap-2 text-sm ${isDarkMode ? 'text-rose-400' : 'text-rose-600'}`}>
                        <TrendingUp className="w-4 h-4" />
                        Critical: Value increasing rapidly
                      </div>
                    )}
                  </div>
                </AnimatedCard>
              ))}
            </div>
          </GlassCard>
        )}

        {/* Medium Alerts */}
        {displayMedium.length > 0 && (
          <GlassCard color="amber" darkMode={isDarkMode}>
            <h3 className={`text-xl font-bold mb-6 flex items-center gap-2 ${
              isDarkMode ? 'text-amber-300' : 'text-amber-600'
            }`}>
              <AlertCircle className={`w-6 h-6 ${!isMuted ? 'animate-pulse' : ''}`} />
              Medium Priority Alerts ({displayMedium.length})
            </h3>
            <div className="space-y-4">
              {displayMedium.map((alert, idx) => (
                <AnimatedCard key={alert.id} delay={idx}>
                  <div className={`p-4 rounded-xl border-l-4 border-amber-500 transition-all duration-300 hover:scale-[1.02] ${
                    isDarkMode ? 'bg-gray-800/40 border-gray-700' : 'bg-white/50 border-gray-200'
                  } ${acknowledgedAlerts.includes(alert.id) ? 'opacity-60' : ''}`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`w-3 h-3 rounded-full bg-amber-500 ${!acknowledgedAlerts.includes(alert.id) ? 'animate-pulse' : ''}`}></div>
                          <h4 className={`font-bold text-lg ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                            {alert.patient}
                          </h4>
                          {acknowledgedAlerts.includes(alert.id) && (
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              isDarkMode ? 'bg-emerald-900/30 text-emerald-400' : 'bg-emerald-100 text-emerald-700'
                            }`}>Acknowledged</span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 flex-wrap">
                          <div className={`text-xl font-bold ${
                            alert.trend === 'decreasing' ? 'text-rose-500' :
                            alert.trend === 'increasing' ? 'text-amber-500' :
                            'text-blue-500'
                          }`}>
                            {alert.vital}: {alert.value}
                          </div>
                          <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Threshold: {alert.threshold}
                          </div>
                          <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            ⏰ {alert.time}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          onClick={() => handleViewPatient(alert)}
                          title="View Patient"
                          className={`px-3 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 ${
                            isDarkMode
                              ? 'bg-blue-900/30 hover:bg-blue-800/30 text-blue-300'
                              : 'bg-blue-100 hover:bg-blue-200 text-blue-700'
                          }`}
                        >
                          <User className="w-4 h-4" />
                        </button>
                        {!acknowledgedAlerts.includes(alert.id) && (
                          <button
                            onClick={() => handleAcknowledge(alert.id)}
                            className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 ${
                              isDarkMode
                                ? 'bg-amber-600 hover:bg-amber-500 text-white'
                                : 'bg-amber-500 hover:bg-amber-600 text-white'
                            }`}
                          >
                            Acknowledge
                          </button>
                        )}
                      </div>
                    </div>
                    {alert.trend === 'increasing' && (
                      <div className={`flex items-center gap-2 text-sm ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`}>
                        <TrendingUp className="w-4 h-4" />
                        Monitor: Value trending upward
                      </div>
                    )}
                    {alert.trend === 'decreasing' && (
                      <div className={`flex items-center gap-2 text-sm ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`}>
                        <TrendingDown className="w-4 h-4" />
                        Monitor: Value trending downward
                      </div>
                    )}
                  </div>
                </AnimatedCard>
              ))}
            </div>
          </GlassCard>
        )}

        {/* Alert Statistics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <GlassCard color="blue" darkMode={isDarkMode}>
            <h4 className={`font-bold mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Alert Statistics
            </h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Total Alerts</span>
                <span className="text-xl font-bold text-blue-500">{totalAlerts}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Critical Alerts</span>
                <span className="text-xl font-bold text-rose-500">{totalCritical}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Medium Alerts</span>
                <span className="text-xl font-bold text-amber-500">{totalMedium}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Acknowledged</span>
                <span className="text-xl font-bold text-emerald-500">{acknowledgedCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Response Rate</span>
                <span className={`text-xl font-bold ${responseRate >= 80 ? 'text-emerald-500' : responseRate >= 50 ? 'text-amber-500' : 'text-rose-500'}`}>
                  {responseRate}%
                </span>
              </div>
              {/* Progress bar for response rate */}
              <div className={`w-full h-2 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${responseRate >= 80 ? 'bg-emerald-500' : responseRate >= 50 ? 'bg-amber-500' : 'bg-rose-500'}`}
                  style={{ width: `${responseRate}%` }}
                ></div>
              </div>
            </div>
          </GlassCard>

          <GlassCard color="emerald" darkMode={isDarkMode}>
            <h4 className={`font-bold mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Alerts by Vital Type
            </h4>
            {totalAlerts > 0 ? (
              <AnimatedChart 
                data={[alertCountsByType]}
                labels={['HR', 'BP', 'SpO2', 'Glu', 'Temp']}
                colors={['#10b981']}
                height={150}
                type="line"
                isDarkMode={isDarkMode}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-[150px]">
                <Activity className={`w-8 h-8 mb-2 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                <span className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>No alert data to display</span>
              </div>
            )}
          </GlassCard>

          <GlassCard color="purple" darkMode={isDarkMode}>
            <h4 className={`font-bold mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Alert Settings
            </h4>
            <div className="space-y-3">
              {Object.entries(alertSettings).map(([vital, enabled]) => (
                <div key={vital} className="flex items-center justify-between">
                  <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>{vital}</span>
                  <button
                    onClick={() => handleToggleVitalSetting(vital)}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <div className={`w-2 h-2 rounded-full ${enabled ? 'bg-emerald-500' : 'bg-gray-400'}`}></div>
                    <span className={`text-sm ${enabled ? 'text-emerald-500' : isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      {enabled ? 'Active' : 'Paused'}
                    </span>
                  </button>
                </div>
              ))}
              <button 
                onClick={() => setShowConfigModal(true)}
                className={`w-full py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 ${
                  isDarkMode
                    ? 'bg-purple-600 hover:bg-purple-500 text-white'
                    : 'bg-purple-500 hover:bg-purple-600 text-white'
                }`}
              >
                Configure Alerts
              </button>
            </div>
          </GlassCard>
        </div>

        {/* Patients Vital Overview */}
        {patients.length > 0 && (
          <GlassCard color="blue" darkMode={isDarkMode}>
            <h3 className={`text-xl font-bold mb-6 flex items-center gap-2 ${
              isDarkMode ? 'text-blue-300' : 'text-blue-600'
            }`}>
              <HeartPulse className="w-6 h-6" />
              All Patients Vitals Overview
            </h3>
            <div className="space-y-3">
              {patients.map((patient, idx) => {
                const hr = patient.vitals?.heartRate || 72;
                const spo2 = patient.vitals?.spo2 || 98;
                const glucose = patient.vitals?.glucose || 100;
                const temp = patient.vitals?.tempF || (patient.vitals?.temp ? (patient.vitals.temp < 45 ? Math.round((patient.vitals.temp * 9 / 5 + 32) * 10) / 10 : patient.vitals.temp) : 98.6);
                const bp = patient.vitals?.bp || '120/80';
                const hasAlert = vitalAlerts.some(a => a.patientId === patient.id);
                
                return (
                  <AnimatedCard key={patient.id} delay={idx}>
                    <div 
                      onClick={() => { setSelectedPatient(patient); setActiveModule('patient-profile'); }}
                      className={`p-4 rounded-xl border transition-all duration-300 hover:scale-[1.01] cursor-pointer ${
                        isDarkMode ? 'bg-gray-800/40 border-gray-700 hover:border-gray-600' : 'bg-white/50 border-gray-200 hover:border-gray-300'
                      } ${hasAlert ? (isDarkMode ? 'border-l-4 border-l-rose-500' : 'border-l-4 border-l-rose-500') : ''}`}
                    >
                      <div className="flex items-center justify-between flex-wrap gap-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                            hasAlert 
                              ? isDarkMode ? 'bg-rose-900/30 text-rose-300' : 'bg-rose-100 text-rose-700'
                              : isDarkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {patient.image}
                          </div>
                          <div>
                            <h4 className={`font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>{patient.name}</h4>
                            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              {patient.age} yrs • {patient.condition}
                            </span>
                          </div>
                          {hasAlert && (
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              isDarkMode ? 'bg-rose-900/30 text-rose-400' : 'bg-rose-100 text-rose-700'
                            }`}>
                              ⚠ Alert
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 flex-wrap">
                          <div className={`text-center px-3 py-1 rounded-lg ${
                            hr > 90 || hr < 60 
                              ? isDarkMode ? 'bg-rose-900/30' : 'bg-rose-50' 
                              : isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'
                          }`}>
                            <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>HR</div>
                            <div className={`text-sm font-bold ${hr > 90 || hr < 60 ? 'text-rose-500' : 'text-emerald-500'}`}>{hr}</div>
                          </div>
                          <div className={`text-center px-3 py-1 rounded-lg ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                            <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>BP</div>
                            <div className={`text-sm font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>{bp}</div>
                          </div>
                          <div className={`text-center px-3 py-1 rounded-lg ${
                            spo2 < 95 
                              ? isDarkMode ? 'bg-rose-900/30' : 'bg-rose-50'
                              : isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'
                          }`}>
                            <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>SpO2</div>
                            <div className={`text-sm font-bold ${spo2 < 95 ? 'text-rose-500' : 'text-emerald-500'}`}>{spo2}%</div>
                          </div>
                          <div className={`text-center px-3 py-1 rounded-lg ${
                            glucose > 140 
                              ? isDarkMode ? 'bg-amber-900/30' : 'bg-amber-50'
                              : isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'
                          }`}>
                            <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Glucose</div>
                            <div className={`text-sm font-bold ${glucose > 140 ? 'text-amber-500' : 'text-emerald-500'}`}>{glucose}</div>
                          </div>
                          <div className={`text-center px-3 py-1 rounded-lg ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                            <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Temp</div>
                            <div className={`text-sm font-bold ${temp > 100.4 || temp < 96.8 ? 'text-rose-500' : 'text-emerald-500'}`}>{temp}°F</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </AnimatedCard>
                );
              })}
            </div>
          </GlassCard>
        )}

        {/* Configure Alerts Modal */}
        {showConfigModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setShowConfigModal(false)}>
            <div 
              onClick={(e) => e.stopPropagation()}
              className={`w-full max-w-md mx-4 p-6 rounded-2xl shadow-2xl ${
                isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                  Configure Alert Settings
                </h3>
                <button onClick={() => setShowConfigModal(false)} className={`p-1 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <p className={`text-sm mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Toggle monitoring for each vital sign. Disabled vitals will not generate alerts.
              </p>

              <div className="space-y-4">
                {Object.entries(alertSettings).map(([vital, enabled]) => {
                  const icons = {
                    'Heart Rate': <Heart className="w-5 h-5" />,
                    'Blood Pressure': <Activity className="w-5 h-5" />,
                    'SpO2': <Wind className="w-5 h-5" />,
                    'Glucose': <Droplet className="w-5 h-5" />,
                    'Temperature': <Thermometer className="w-5 h-5" />,
                  };
                  const thresholds = {
                    'Heart Rate': 'Alert if < 60 or > 90 BPM',
                    'Blood Pressure': 'Alert if < 90/60 or > 140/90',
                    'SpO2': 'Alert if < 95%',
                    'Glucose': 'Alert if > 140 mg/dL',
                    'Temperature': 'Alert if < 96.8°F or > 100.4°F',
                  };
                  return (
                    <div key={vital} className={`p-3 rounded-xl border transition-all ${
                      isDarkMode ? 'border-gray-700 hover:border-gray-600' : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`${enabled ? 'text-emerald-500' : isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>
                            {icons[vital]}
                          </div>
                          <div>
                            <div className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{vital}</div>
                            <div className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>{thresholds[vital]}</div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleToggleVitalSetting(vital)}
                          className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                            enabled
                              ? 'bg-emerald-500'
                              : isDarkMode ? 'bg-gray-600' : 'bg-gray-300'
                          }`}
                        >
                          <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-300 ${
                            enabled ? 'left-6' : 'left-0.5'
                          }`}></div>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowConfigModal(false)}
                  className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                    isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveSettings}
                  className={`flex-1 py-2 rounded-lg font-medium transition-all hover:scale-105 ${
                    isDarkMode ? 'bg-purple-600 hover:bg-purple-500 text-white' : 'bg-purple-500 hover:bg-purple-600 text-white'
                  }`}
                >
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        )}

        <BeautifulFooter isDarkMode={isDarkMode} setActiveModule={setActiveModule} />
      </div>
    );
};

export default VitalAlerts;
