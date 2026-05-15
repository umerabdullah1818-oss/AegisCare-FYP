import React from 'react';
import {
  Settings, Save, Bell, Database, RefreshCw, DownloadCloud
} from 'lucide-react';
import GlassCard from './GlassCard';
import GlowingButton from './GlowingButton';
import BeautifulFooter from './BeautifulFooter';

const AdminSettings = ({ isDarkMode, setActiveModule }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <GlassCard color="indigo" hoverable={false} darkMode={isDarkMode}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex-1">
            <h1 className={`text-3xl font-bold mb-2 bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent`}>
              System Settings
            </h1>
            <p className={`text-lg ${isDarkMode ? 'text-indigo-200/80' : 'text-indigo-700/80'}`}>
              Configure system preferences, notifications, and integrations
            </p>
          </div>
          <div className="flex gap-3">
            <GlowingButton
              icon={<Save className="w-4 h-4" />}
              color="indigo"
              size="md"
              isDarkMode={isDarkMode}
            >
              Save Changes
            </GlowingButton>
          </div>
        </div>
      </GlassCard>

      {/* Settings Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <GlassCard color="blue" darkMode={isDarkMode}>
          <h3 className={`text-xl font-bold mb-6 flex items-center gap-2 ${isDarkMode ? 'text-blue-300' : 'text-blue-600'
            }`}>
            <Settings className="w-6 h-6 animate-pulse" />
            General Settings
          </h3>
          <div className="space-y-4">
            {[
              { label: 'System Name', value: 'AegisCare Admin', type: 'text' },
              { label: 'Timezone', value: 'UTC+05:00', type: 'select' },
              { label: 'Date Format', value: 'YYYY-MM-DD', type: 'select' },
              { label: 'Language', value: 'English', type: 'select' },
            ].map((setting, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div>
                  <div className={`font-medium text-sm mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {setting.label}
                  </div>
                </div>
                <div className="w-48">
                  {setting.type === 'text' ? (
                    <input
                      type="text"
                      defaultValue={setting.value}
                      className={`w-full px-3 py-2 rounded-lg border ${isDarkMode
                        ? 'bg-gray-800/50 border-gray-700 text-white'
                        : 'bg-white/50 border-gray-200 text-gray-900'
                        } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    />
                  ) : (
                    <select className={`w-full px-3 py-2 rounded-lg border ${isDarkMode
                      ? 'bg-gray-800/50 border-gray-700 text-white'
                      : 'bg-white/50 border-gray-200 text-gray-900'
                      } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}>
                      <option>{setting.value}</option>
                    </select>
                  )}
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Notification Settings */}
        <GlassCard color="emerald" darkMode={isDarkMode}>
          <h3 className={`text-xl font-bold mb-6 flex items-center gap-2 ${isDarkMode ? 'text-emerald-300' : 'text-emerald-600'
            }`}>
            <Bell className="w-6 h-6 animate-pulse" />
            Notification Settings
          </h3>
          <div className="space-y-4">
            {[
              { label: 'Email Notifications', enabled: true },
              { label: 'Push Notifications', enabled: true },
              { label: 'SMS Alerts', enabled: false },
              { label: 'Security Alerts', enabled: true },
              { label: 'System Updates', enabled: true },
            ].map((setting, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div>
                  <div className={`font-medium text-sm mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {setting.label}
                  </div>
                </div>
                <button className={`relative w-12 h-6 rounded-full transition-all duration-300 ${setting.enabled
                  ? isDarkMode ? 'bg-emerald-600' : 'bg-emerald-500'
                  : isDarkMode ? 'bg-gray-700' : 'bg-gray-300'
                  }`}>
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform duration-300 ${setting.enabled ? 'left-7' : 'left-1'
                    }`}></div>
                </button>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Backup & Restore */}
      <GlassCard color="amber" darkMode={isDarkMode}>
        <h3 className={`text-xl font-bold mb-6 flex items-center gap-2 ${isDarkMode ? 'text-amber-300' : 'text-amber-600'
          }`}>
          <Database className="w-6 h-6 animate-pulse" />
          Backup & Restore
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className={`p-4 rounded-xl border transition-all duration-300 hover:scale-105 flex flex-col items-center justify-center gap-3 ${isDarkMode ? 'bg-gray-800/40 border-gray-700' : 'bg-white/50 border-gray-200'
            }`}>
            <Database className={`w-8 h-8 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Backup Now
            </span>
          </button>
          <button className={`p-4 rounded-xl border transition-all duration-300 hover:scale-105 flex flex-col items-center justify-center gap-3 ${isDarkMode ? 'bg-gray-800/40 border-gray-700' : 'bg-white/50 border-gray-200'
            }`}>
            <RefreshCw className={`w-8 h-8 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
            <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Restore Backup
            </span>
          </button>
          <button className={`p-4 rounded-xl border transition-all duration-300 hover:scale-105 flex flex-col items-center justify-center gap-3 ${isDarkMode ? 'bg-gray-800/40 border-gray-700' : 'bg-white/50 border-gray-200'
            }`}>
            <DownloadCloud className={`w-8 h-8 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
            <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Export Data
            </span>
          </button>
        </div>
      </GlassCard>

      {/* Footer */}
      <BeautifulFooter isDarkMode={isDarkMode} setActiveModule={setActiveModule} />
    </div>
  );
};

export default AdminSettings;
