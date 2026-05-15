import React, { useState, useEffect } from 'react';
import {
  Activity, TrendingUp, PieChart, DownloadCloud
} from 'lucide-react';
import GlassCard from './GlassCard';
import AnimatedCard from './AnimatedCard';
import GlowingButton from './GlowingButton';
import AnimatedChart from './AnimatedChart';
import BeautifulFooter from './BeautifulFooter';

const Analytics = ({ isDarkMode, dbUsers, dashboardStats, showToast, setActiveModule }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [liveMetrics, setLiveMetrics] = useState({ responseTime: 142, errorRate: 0.02 });

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveMetrics(prev => ({
        responseTime: Math.max(80, Math.min(250, prev.responseTime + (Math.random() * 20 - 10))),
        errorRate: Math.max(0.01, Math.min(0.1, prev.errorRate + (Math.random() * 0.02 - 0.01)))
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const elderlyCount = dbUsers.all.filter(u => u.role === 'elderly').length;
  const familyCount = dbUsers.all.filter(u => u.role === 'family').length;
  const doctorCount = dbUsers.all.filter(u => u.role === 'doctor').length;
  const caregiverCount = dbUsers.all.filter(u => u.role === 'caregiver').length;
  const adminCount = dbUsers.all.filter(u => u.role === 'admin').length || 1;
  const totalCount = elderlyCount + familyCount + doctorCount + caregiverCount + adminCount || 1;
  const displayTotal = dashboardStats.totalUsers || totalCount;

  const roleData = [
    { role: 'Elderly', count: elderlyCount, percentage: Math.round((elderlyCount / totalCount) * 100), color: 'blue' },
    { role: 'Family', count: familyCount, percentage: Math.round((familyCount / totalCount) * 100), color: 'emerald' },
    { role: 'Doctors', count: doctorCount, percentage: Math.round((doctorCount / totalCount) * 100), color: 'purple' },
    { role: 'Caregivers', count: caregiverCount, percentage: Math.round((caregiverCount / totalCount) * 100), color: 'amber' },
    { role: 'Admins', count: adminCount, percentage: Math.round((adminCount / totalCount) * 100), color: 'rose' },
  ];

  const generateGrowthData = () => {
    const curve = [Math.floor(displayTotal * 0.1), Math.floor(displayTotal * 0.15), Math.floor(displayTotal * 0.25), Math.floor(displayTotal * 0.4), Math.floor(displayTotal * 0.6), Math.floor(displayTotal * 0.75), Math.floor(displayTotal * 0.85), Math.floor(displayTotal * 0.95), displayTotal];
    return curve.map(v => v || 1);
  };

  const handleExportAnalytics = () => {
    if (isExporting) return;
    setIsExporting(true);

    setTimeout(() => {
      const headers = ['Metric', 'Value'];
      const rows = [
        ['Total Users', displayTotal],
        ['Active Elderly', elderlyCount],
        ['Registered Caregivers', caregiverCount],
        ['Registered Doctors', doctorCount],
        ['System Alerts', dashboardStats.systemAlerts || 0],
        ['Server Uptime', `${dashboardStats.serverUptime || 99.9}%`],
        ['Avg Response Time', `${Math.round(liveMetrics.responseTime)}ms`],
        ['Current Error Rate', `${liveMetrics.errorRate.toFixed(2)}%`]
      ];

      const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `AegisCare_Analytics_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setIsExporting(false);
      showToast('Analytics payload exported successfully', 'success');
    }, 1500);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <GlassCard color="rose" hoverable={false} darkMode={isDarkMode}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex-1">
            <h1 className={`text-3xl font-bold mb-2 bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent`}>
              Advanced Analytics
            </h1>
            <p className={`text-lg ${isDarkMode ? 'text-rose-200/80' : 'text-rose-700/80'}`}>
              In-depth analytics and insights for system optimization
            </p>
          </div>
          <div className="flex gap-3">
            <GlowingButton
              icon={<DownloadCloud className={`w-4 h-4 ${isExporting ? 'animate-bounce' : ''}`} />}
              color="rose"
              size="md"
              onClick={handleExportAnalytics}
              isDarkMode={isDarkMode}
            >
              {isExporting ? 'Generating...' : 'Export Report'}
            </GlowingButton>
          </div>
        </div>
      </GlassCard>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth */}
        <GlassCard color="blue" hoverable={false} darkMode={isDarkMode}>
          <h3 className={`text-xl font-bold mb-6 flex items-center gap-2 ${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`}>
            <TrendingUp className="w-6 h-6 animate-pulse" />
            User Growth Analytics
          </h3>
          <AnimatedChart
            data={[generateGrowthData()]}
            labels={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']}
            colors={['#3b82f6']}
            height={200}
            isDarkMode={isDarkMode}
          />
        </GlassCard>

        {/* Role Distribution */}
        <GlassCard color="purple" hoverable={false} darkMode={isDarkMode}>
          <h3 className={`text-xl font-bold mb-6 flex items-center gap-2 ${isDarkMode ? 'text-purple-300' : 'text-purple-600'}`}>
            <PieChart className="w-6 h-6 animate-spin-slow" style={{ animationDuration: '8s' }} />
            User Role Distribution
          </h3>
          <div className="space-y-4">
            {roleData.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="w-24">
                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {item.role}
                  </span>
                </div>
                <div className="flex-1">
                  <div className={`h-2 rounded-full overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
                    <div
                      className={`h-full rounded-full transition-all duration-1000`}
                      style={{
                        width: `${item.percentage}%`,
                        backgroundColor: item.color === 'blue' ? '#3b82f6' :
                          item.color === 'emerald' ? '#10b981' :
                            item.color === 'purple' ? '#8b5cf6' :
                              item.color === 'amber' ? '#f59e0b' :
                                '#f472b6'
                      }}
                    ></div>
                  </div>
                </div>
                <div className="w-16 text-right">
                  <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {item.count} ({item.percentage}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Performance Metrics */}
      <GlassCard color="emerald" hoverable={false} darkMode={isDarkMode}>
        <h3 className={`text-xl font-bold mb-6 flex items-center gap-2 ${isDarkMode ? 'text-emerald-300' : 'text-emerald-600'}`}>
          <Activity className="w-6 h-6 animate-pulse" />
          System Performance Metrics
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Response Time', value: `${Math.round(liveMetrics.responseTime)}ms`, change: liveMetrics.responseTime < 150 ? '-5ms' : '+12ms', color: 'emerald' },
            { label: 'Uptime', value: `${dashboardStats.serverUptime || 99.9}%`, change: '+0.1%', color: 'blue' },
            { label: 'Error Rate', value: `${liveMetrics.errorRate.toFixed(2)}%`, change: liveMetrics.errorRate < 0.05 ? '-0.01%' : '+0.02%', color: 'purple' },
            { label: 'Active Users', value: displayTotal.toString(), change: '+12', color: 'amber' },
          ].map((metric, idx) => (
            <AnimatedCard key={idx} delay={idx}>
              <div className={`p-4 rounded-xl border text-center transition-all duration-300 ${isDarkMode ? 'bg-gray-800/40 border-gray-700 hover:bg-gray-800/60' : 'bg-white/50 border-gray-200 hover:bg-white'}`}>
                <div className={`text-2xl font-bold mb-2 transition-colors duration-700 ${metric.color === 'emerald' ? 'text-emerald-500' :
                  metric.color === 'blue' ? 'text-blue-500' :
                    metric.color === 'purple' ? 'text-purple-500' :
                      'text-amber-500'
                  }`}>
                  {metric.value}
                </div>
                <div className={`text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {metric.label}
                </div>
                <div className={`text-xs ${metric.change.startsWith('-') || metric.change.startsWith('+0')
                  ? 'text-emerald-500' : 'text-rose-500'
                  }`}>
                  {metric.change}
                </div>
              </div>
            </AnimatedCard>
          ))}
        </div>
      </GlassCard>

      {/* Footer */}
      <BeautifulFooter isDarkMode={isDarkMode} setActiveModule={setActiveModule} />
    </div>
  );
};

export default Analytics;
