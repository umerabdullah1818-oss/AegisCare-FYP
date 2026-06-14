import React, { useState } from 'react';
import { 
  Bell, Activity, Pill, AlertTriangle, BarChart3 as BarChart
} from 'lucide-react';
import { getColorClass } from '../helpers';
import GlassCard from './GlassCard';
import AnimatedCard from './AnimatedCard';
import GlowingButton from './GlowingButton';
import BeautifulFooter from './BeautifulFooter';

const NotificationCenter = ({ 
  isDarkMode, 
  notifications, 
  unreadCount, 
  handleMarkNotificationRead, 
  handleMarkAllRead, 
  setActiveModule 
}) => {
  const [filter, setFilter] = useState('all');

  const filteredAlerts = notifications.filter(alert => {
    const isUnread = !(alert.isRead || alert.read);
    if (filter === 'all') return true;
    if (filter === 'unread') return isUnread;
    if (filter === 'critical') return alert.severity === 'critical';
    if (filter === 'missed') return alert.type?.toLowerCase().includes('missed') || alert.message?.toLowerCase().includes('missed');
    if (filter === 'vitals') return alert.type?.toLowerCase().includes('vital') || alert.message?.toLowerCase().includes('vital');
    return true;
  });

  const formatTime = (dateStr) => {
    if (!dateStr) return 'Just now';
    const date = new Date(dateStr);
    return date.toLocaleString('en-US', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <GlassCard color="rose" hoverable={false} darkMode={isDarkMode}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex-1">
            <h1 className={`text-3xl font-bold mb-2 bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent`}>
              Notification Center
            </h1>
            <p className={`text-lg ${isDarkMode ? 'text-rose-200/80' : 'text-rose-700/80'}`}>
              Stay updated with health alerts and notifications
            </p>
          </div>
          <div className="flex gap-3">
            <GlowingButton 
              icon={<Bell size={20} />}
              color="rose"
              size="md"
              onClick={handleMarkAllRead}
            >
              Mark All as Read
            </GlowingButton>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
              isDarkMode ? 'bg-rose-950/40 border border-rose-900/30' : 'bg-gradient-to-r from-rose-100 to-pink-100 border border-rose-200'
            }`}>
              <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></div>
              <span className={`text-sm font-medium ${isDarkMode ? 'text-rose-300' : 'text-rose-700'}`}>
                Unread: {unreadCount || notifications.filter(a => !(a.isRead || a.read)).length}
              </span>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {['all', 'unread', 'critical', 'missed', 'vitals'].map((filterOption) => (
          <button
            key={filterOption}
            onClick={() => setFilter(filterOption)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 capitalize ${
              filter === filterOption
                ? isDarkMode
                  ? 'bg-rose-600 text-white'
                  : 'bg-rose-500 text-white'
                : isDarkMode
                ? 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {filterOption}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <GlassCard color="rose" darkMode={isDarkMode}>
        <div className="space-y-4">
          {filteredAlerts.length === 0 ? (
             <div className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
               <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
               <p>No notifications found for this category.</p>
             </div>
          ) : filteredAlerts.map((alert, idx) => (
            <AnimatedCard key={alert._id || alert.id || idx} delay={idx}>
              <div className={`p-4 rounded-xl border transition-all duration-300 hover:scale-105 ${
                isDarkMode ? 'bg-gray-800/40 border-gray-700' : 'bg-white/50 border-gray-200'
              } ${(alert.isRead || alert.read) ? 'opacity-60' : ''}`}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-3 h-3 rounded-full animate-pulse ${
                        alert.severity === 'critical' || alert.type === 'Emergency' ? 'bg-rose-500' :
                        alert.severity === 'high' || alert.type === 'Missed Medication' ? 'bg-amber-500' :
                        'bg-blue-500'
                      }`}></div>
                      <h4 className={`font-bold text-lg ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                        {alert.type || alert.message || 'Notification'}
                      </h4>
                    </div>
                    <div className="space-y-1">
                      {alert.elderly && (
                        <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          👤 Elderly: {typeof alert.elderly === 'string' ? alert.elderly : alert.elderly?.firstName + ' ' + alert.elderly?.lastName}
                        </div>
                      )}
                      {alert.message && alert.message !== alert.type && (
                        <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          🚨 {alert.message}
                        </div>
                      )}
                      {alert.vital && (
                        <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          📊 Vital: {alert.vital} ({alert.value})
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm mb-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                      ⏰ {formatTime(alert.createdAt || alert.time)}
                    </div>
                    {!(alert.isRead || alert.read) && (
                      <button
                        onClick={() => handleMarkNotificationRead(alert._id || alert.id)}
                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 ${
                          isDarkMode
                            ? 'bg-rose-900/30 hover:bg-rose-800/30 text-rose-300'
                            : 'bg-rose-100 hover:bg-rose-200 text-rose-700'
                        }`}
                      >
                        Mark Read
                      </button>
                    )}
                  </div>
                </div>
                {(alert.severity === 'critical' || alert.type === 'Emergency') && (
                  <div className={`flex items-center gap-2 mt-3 p-2 rounded-lg ${
                    isDarkMode ? 'bg-rose-900/20' : 'bg-rose-50'
                  }`}>
                    <AlertTriangle className={`w-4 h-4 ${isDarkMode ? 'text-rose-400' : 'text-rose-600'}`} />
                    <span className={`text-sm ${isDarkMode ? 'text-rose-300' : 'text-rose-700'}`}>
                      Immediate attention required
                    </span>
                  </div>
                )}
              </div>
            </AnimatedCard>
          ))}
        </div>
      </GlassCard>

      {/* Weekly Summary */}
      <GlassCard color="purple" darkMode={isDarkMode}>
        <h3 className={`text-xl font-bold mb-6 flex items-center gap-2 ${
          isDarkMode ? 'text-purple-300' : 'text-purple-600'
        }`}>
          <BarChart className="w-6 h-6 animate-pulse" />
          Weekly Summary
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Alerts', value: notifications.length.toString(), color: 'rose', icon: <Bell className="w-5 h-5" /> },
            { label: 'Missed Doses', value: notifications.filter(a => a.type?.toLowerCase().includes('missed') || a.message?.toLowerCase().includes('missed')).length.toString(), color: 'amber', icon: <Pill className="w-5 h-5" /> },
            { label: 'Abnormal Vitals', value: notifications.filter(a => a.type?.toLowerCase().includes('vital') || a.message?.toLowerCase().includes('vital')).length.toString(), color: 'blue', icon: <Activity className="w-5 h-5" /> },
            { label: 'Emergency Alerts', value: notifications.filter(a => a.severity === 'critical' || a.type === 'Emergency').length.toString(), color: 'red', icon: <AlertTriangle className="w-5 h-5" /> },
          ].map((stat, idx) => (
            <AnimatedCard key={idx} delay={idx}>
              <div className={`p-4 rounded-xl border transition-all duration-300 hover:scale-105 ${
                isDarkMode ? 'bg-gray-800/40 border-gray-700' : 'bg-white/50 border-gray-200'
              }`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2 rounded-lg ${
                    isDarkMode ? getColorClass(stat.color, 'darkBg') : getColorClass(stat.color, 'bg')
                  }`}>
                    <div className={isDarkMode ? getColorClass(stat.color, 'darkText') : getColorClass(stat.color, 'text')}>
                      {stat.icon}
                    </div>
                  </div>
                  <div>
                    <div className={`text-2xl font-bold ${
                      isDarkMode ? getColorClass(stat.color, 'darkText') : getColorClass(stat.color, 'text')
                    }`}>
                      {stat.value}
                    </div>
                    <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {stat.label}
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedCard>
          ))}
        </div>
      </GlassCard>

      <BeautifulFooter isDarkMode={isDarkMode} setActiveModule={setActiveModule} />
    </div>
  );
};

export default NotificationCenter;
