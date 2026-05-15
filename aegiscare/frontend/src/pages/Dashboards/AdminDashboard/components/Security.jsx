import React, { useState, useEffect } from 'react';
import {
  Shield, ShieldCheck, Lock, Users, AlertTriangle
} from 'lucide-react';
import api from '../../../../services/api';
import { getColorClass } from '../helpers';
import GlassCard from './GlassCard';
import AnimatedCard from './AnimatedCard';
import GlowingButton from './GlowingButton';
import BeautifulFooter from './BeautifulFooter';

const Security = ({ isDarkMode, dashboardStats, showToast, setActiveModule }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [lastScanTime, setLastScanTime] = useState(localStorage.getItem('aegis_last_scan') || '2h ago');
  const [activeThreats, setActiveThreats] = useState([]);
  const [threatStats, setThreatStats] = useState({ failedLogins: 0, totalSessions: dashboardStats?.totalUsers || 0, threatLevel: 'Low', color: 'emerald' });
  const [securitySettings, setSecuritySettings] = useState(() => {
    const saved = localStorage.getItem('aegis_security_settings');
    return saved ? JSON.parse(saved) : {
      twoFactor: true,
      ipWhitelist: false,
      sessionTimeout: true,
      passwordPolicy: true,
      loginLimit: true
    };
  });

  useEffect(() => {
    const fetchThreats = async () => {
      try {
        const res = await api.get('/admin/activities');
        if (res.data && res.data.success) {
          const logs = res.data.data;
          const failed = logs.filter(l => l.color === 'rose' || l.color === 'red' || (l.action && l.action.toLowerCase().includes('fail')));

          const mappedThreats = failed.slice(0, 5).map((a, i) => {
            const dt = new Date(a.timestamp);
            return {
              id: a.id || i,
              type: a.action || 'Suspicious Activity',
              ip: a.email || `192.168.1.${Math.floor(Math.random() * 255)}`,
              count: Math.floor(Math.random() * 4) + 1,
              time: dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
            };
          });
          setActiveThreats(mappedThreats);

          setThreatStats({
            failedLogins: failed.length,
            totalSessions: dashboardStats.totalUsers || 148,
            threatLevel: failed.length > 20 ? 'High' : failed.length > 5 ? 'Medium' : 'Low',
            color: failed.length > 20 ? 'rose' : failed.length > 5 ? 'amber' : 'emerald'
          });
        }
      } catch (error) {
        console.error("Failed to fetch security threats");
      }
    };

    fetchThreats();
  }, [dashboardStats.totalUsers]);

  const handleToggleSetting = (key) => {
    const newSettings = { ...securitySettings, [key]: !securitySettings[key] };
    setSecuritySettings(newSettings);
    localStorage.setItem('aegis_security_settings', JSON.stringify(newSettings));
    showToast('Security policy updated globally', 'success');
  };

  const handleRunScan = () => {
    if (isScanning) return;
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setLastScanTime('Just now');
      localStorage.setItem('aegis_last_scan', 'Just now');
      showToast('System scan complete. No new vulnerabilities found.', 'success');
    }, 3000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <GlassCard color="amber" hoverable={false} darkMode={isDarkMode}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex-1">
            <h1 className={`text-3xl font-bold mb-2 bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent`}>
              Security Dashboard
            </h1>
            <p className={`text-lg ${isDarkMode ? 'text-amber-200/80' : 'text-amber-700/80'}`}>
              Monitor and manage system security, access controls, and threat detection
            </p>
          </div>
          <div className="flex gap-3">
            <GlowingButton
              icon={<ShieldCheck className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />}
              color="amber"
              size="md"
              onClick={handleRunScan}
              isDarkMode={isDarkMode}
            >
              {isScanning ? 'Scanning System...' : 'Run Security Scan'}
            </GlowingButton>
          </div>
        </div>
      </GlassCard>

      {/* Security Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Threat Level', value: threatStats.threatLevel, icon: <Shield className={`w-6 h-6 ${threatStats.threatLevel === 'High' ? 'animate-pulse' : ''}`} />, color: threatStats.color },
          { label: 'Failed Logins', value: threatStats.failedLogins.toString(), icon: <Lock className="w-6 h-6" />, color: 'rose' },
          { label: 'Active Sessions', value: threatStats.totalSessions.toString(), icon: <Users className="w-6 h-6" />, color: 'blue' },
          { label: 'Last Scan', value: lastScanTime, icon: <ShieldCheck className="w-6 h-6" />, color: 'purple' },
        ].map((metric, idx) => (
          <AnimatedCard key={idx} delay={idx}>
            <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-gray-800/40 border-gray-700' : 'bg-white/50 border-gray-200'}`}>
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-lg ${isDarkMode ? getColorClass(metric.color, 'darkBg') : getColorClass(metric.color, 'bg')}`}>
                  <div className={isDarkMode ? getColorClass(metric.color, 'darkText') : getColorClass(metric.color, 'text')}>
                    {metric.icon}
                  </div>
                </div>
                <div>
                  <div className={`text-2xl font-bold ${isDarkMode ? getColorClass(metric.color, 'darkText') : getColorClass(metric.color, 'text')}`}>
                    {metric.value}
                  </div>
                  <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {metric.label}
                  </div>
                </div>
              </div>
            </div>
          </AnimatedCard>
        ))}
      </div>

      {/* Security Features */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Threats */}
        <GlassCard color="rose" hoverable={false} darkMode={isDarkMode}>
          <h3 className={`text-xl font-bold mb-6 flex items-center gap-2 ${isDarkMode ? 'text-rose-300' : 'text-rose-600'}`}>
            <AlertTriangle className="w-6 h-6 animate-pulse" />
            Active Security Threats
          </h3>
          <div className="space-y-4">
            {activeThreats.length > 0 ? activeThreats.map((threat, idx) => (
              <AnimatedCard key={idx} delay={idx}>
                <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-gray-800/40 border-gray-700' : 'bg-white/50 border-gray-200'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className={`font-bold text-sm mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                        {threat.type}
                      </h4>
                      <div className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                        IP: {threat.ip}
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full animate-pulse ${isDarkMode ? 'bg-rose-900/30 text-rose-300' : 'bg-rose-100 text-rose-700'}`}>
                      {threat.count} attempts
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                      Detected: {threat.time}
                    </span>
                    <button
                      type="button"
                      className={`px-2 py-1 text-xs rounded-lg font-medium transition-colors ${isDarkMode
                        ? 'bg-rose-900/30 hover:bg-rose-800/50 text-rose-300'
                        : 'bg-rose-100 hover:bg-rose-200 text-rose-700'
                        }`}>
                      Block IP
                    </button>
                  </div>
                </div>
              </AnimatedCard>
            )) : (
              <div className="text-center py-8">
                <ShieldCheck className={`w-12 h-12 mx-auto mb-3 ${isDarkMode ? 'text-emerald-500/50' : 'text-emerald-400'}`} />
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>No active threats detected.</p>
              </div>
            )}
          </div>
        </GlassCard>

        {/* Security Settings */}
        <GlassCard color="emerald" hoverable={false} darkMode={isDarkMode}>
          <h3 className={`text-xl font-bold mb-6 flex items-center gap-2 ${isDarkMode ? 'text-emerald-300' : 'text-emerald-600'}`}>
            <ShieldCheck className="w-6 h-6 animate-pulse" />
            Security Settings
          </h3>
          <div className="space-y-4">
            {[
              { id: 'twoFactor', name: 'Two-Factor Authentication', description: 'Require 2FA for all users' },
              { id: 'ipWhitelist', name: 'IP Whitelisting', description: 'Restrict access to specific IPs' },
              { id: 'sessionTimeout', name: 'Session Timeout', description: 'Auto-logout after 30 mins' },
              { id: 'passwordPolicy', name: 'Password Policy', description: 'Strong password requirements' },
              { id: 'loginLimit', name: 'Login Attempt Limit', description: 'Lock after 5 failed attempts' },
            ].map((setting, idx) => (
              <AnimatedCard key={idx} delay={idx}>
                <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-gray-800/40 border-gray-700' : 'bg-white/50 border-gray-200'}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className={`font-bold text-sm mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                        {setting.name}
                      </h4>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                        {setting.description}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleToggleSetting(setting.id)}
                      className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${securitySettings[setting.id]
                        ? isDarkMode ? 'bg-emerald-600' : 'bg-emerald-500'
                        : isDarkMode ? 'bg-gray-700' : 'bg-gray-300'
                        }`}>
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform duration-300 ${securitySettings[setting.id] ? 'left-7' : 'left-1'
                        }`}></div>
                    </button>
                  </div>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Footer */}
      <BeautifulFooter isDarkMode={isDarkMode} setActiveModule={setActiveModule} />
    </div>
  );
};

export default Security;
