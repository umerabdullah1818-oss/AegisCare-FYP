import React from 'react';
import { ShieldAlert, Clock3, PhoneCall, Users, User, Stethoscope, Check, MapPin, ShieldCheck } from 'lucide-react';
import BeautifulFooter from './BeautifulFooter';

const PanicButton = (props) => {
  const {
    isDarkMode,
    sosCooldown,
    sosHolding,
    sosProgress,
    sosTriggered,
    sosNotifications,
    setSosHolding,
    setSosCooldown,
    setSosProgress,
    setSosTriggered,
    setSosNotifications,
    setActiveModule,
  } = props;

  return (
    <>
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-4">
        {/* Elegant Panic Card */}
        <div className={`relative rounded-3xl p-8 max-w-md w-full overflow-hidden backdrop-blur-xl ${
          isDarkMode
            ? 'bg-gradient-to-br from-red-900/20 via-rose-900/15 to-red-900/20 border border-red-800/30 shadow-2xl shadow-red-950/30'
            : 'bg-gradient-to-br from-white/95 via-rose-50/80 to-white/95 border border-rose-200/60 shadow-2xl shadow-rose-100/30'
        }`}>
          
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-gradient-to-r from-red-500/5 to-rose-500/5 rounded-full"></div>
            <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-gradient-to-r from-rose-500/5 to-pink-500/5 rounded-full"></div>
          </div>

          <div className="relative z-10">
            {/* Beautiful Icon Container */}
            <div className="flex justify-center mb-6">
              <div className={`relative p-6 rounded-3xl ${
                isDarkMode 
                  ? 'bg-gradient-to-br from-red-900/40 to-rose-900/30 border border-red-800/40' 
                  : 'bg-gradient-to-br from-red-100 to-rose-100 border border-rose-200'
              } shadow-2xl`}>
                
                {/* Glowing Ring */}
                <div className={`absolute inset-0 rounded-3xl border-2 ${
                  isDarkMode ? 'border-red-600/30' : 'border-rose-300/50'
                } animate-pulse`}></div>
                
                {/* Icon */}
                <ShieldAlert className={`w-12 h-12 ${
                  isDarkMode ? 'text-rose-300' : 'text-rose-500'
                }`} />
              </div>
            </div>

            {/* Title */}
            <h2 className={`text-3xl font-bold mb-3 text-center ${
              isDarkMode 
                ? 'text-white' 
                : 'text-gray-900'
            }`}>
              Emergency Alert
            </h2>

            {/* Description */}
            <p className={`text-center mb-8 px-4 ${
              isDarkMode 
                ? 'text-gray-400' 
                : 'text-gray-600'
            }`}>
              Press only in serious emergencies. Help will be dispatched immediately.
            </p>

            {/* Main Emergency Button */}
            <div className="mb-6">
              <button 
                onMouseDown={() => { if (!sosCooldown) setSosHolding(true); }}
                onMouseUp={() => setSosHolding(false)}
                onMouseLeave={() => setSosHolding(false)}
                onTouchStart={() => { if (!sosCooldown) setSosHolding(true); }}
                onTouchEnd={() => setSosHolding(false)}
                className={`relative w-full py-5 px-6 rounded-2xl font-bold text-lg 
                transition-all duration-300 ${sosHolding ? 'scale-[0.97]' : 'hover:scale-[1.02]'} active:scale-[0.98]
                flex items-center justify-center gap-3 overflow-hidden group ${
                sosCooldown
                  ? isDarkMode
                    ? 'bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 text-gray-300 cursor-not-allowed shadow-lg shadow-gray-900/30'
                    : 'bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 text-white cursor-not-allowed shadow-lg shadow-gray-200'
                  : isDarkMode
                    ? 'bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-500 hover:via-rose-500 hover:to-red-500 text-white shadow-lg shadow-red-900/30'
                    : 'bg-gradient-to-r from-red-500 via-rose-500 to-red-500 hover:from-red-400 hover:via-rose-400 hover:to-red-400 text-white shadow-lg shadow-rose-200'
              }`}>
                
                {/* Progress overlay */}
                {sosHolding && (
                  <div className="absolute inset-0 bg-white/20 transition-all duration-100" style={{ width: `${sosProgress}%` }} />
                )}
                
                {/* Button Shine Effect */}
                {!sosCooldown && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                    translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                )}
                
                {/* Text */}
                <span className="relative font-bold tracking-wider">
                  {sosCooldown ? 'ALERT SENT' : sosHolding ? 'HOLD...' : 'EMERGENCY SOS'}
                </span>
              </button>
              
              {/* Progress bar */}
              {sosHolding && (
                <div className={`mt-2 h-1.5 rounded-full overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
                  <div className="h-full rounded-full bg-gradient-to-r from-red-500 to-rose-500 transition-all duration-100" style={{ width: `${sosProgress}%` }} />
                </div>
              )}
              
              {/* Instruction */}
              <p className={`text-center mt-3 text-sm ${
                isDarkMode ? 'text-rose-300/70' : 'text-rose-500/70'
              }`}>
                {sosCooldown ? 'Emergency alert has been dispatched' : 'Press and hold for 3 seconds'}
              </p>
            </div>

            {/* Response Time Indicator */}
            <div className={`flex items-center justify-center gap-3 mb-6 p-4 rounded-2xl ${
              isDarkMode 
                ? 'bg-red-950/20 border border-red-800/20' 
                : 'bg-rose-50/60 border border-rose-200/40'
            }`}>
              <Clock3 className={`w-5 h-5 ${isDarkMode ? 'text-rose-400' : 'text-rose-500'}`} />
              <div>
                <div className={`text-sm font-medium ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Response Time
                </div>
                <div className={`text-lg font-bold ${
                  isDarkMode ? 'text-rose-300' : 'text-rose-600'
                }`}>
                  Under 60 seconds
                </div>
              </div>
            </div>

            {/* Who Gets Notified */}
            <div className={`p-4 rounded-2xl ${
              isDarkMode 
                ? 'bg-gray-900/30' 
                : 'bg-gray-50/60'
            }`}>
              <div className={`text-sm font-medium mb-2 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Immediate notifications sent to:
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
                  isDarkMode 
                    ? 'bg-red-900/30 text-red-300' 
                    : 'bg-red-100 text-red-600'
                }`}>
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium">Emergency Services</span>
                </div>
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
                  isDarkMode 
                    ? 'bg-rose-900/30 text-rose-300' 
                    : 'bg-rose-100 text-rose-600'
                }`}>
                  <Users className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium">Family Members</span>
                </div>
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
                  isDarkMode 
                    ? 'bg-amber-900/30 text-amber-300' 
                    : 'bg-amber-100 text-amber-600'
                }`}>
                  <User className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium">Care Team</span>
                </div>
              </div>
            </div>

            {/* Status Indicator */}
            <div className="flex items-center justify-center gap-2 mt-6">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className={`text-sm font-medium ${
                isDarkMode ? 'text-emerald-400' : 'text-emerald-600'
              }`}>
                System Ready • Location Tracking Active
              </span>
            </div>
          </div>

          {/* Decorative Corner Elements */}
          <div className={`absolute top-4 right-4 w-3 h-3 rounded-full ${
            isDarkMode ? 'bg-rose-500/30' : 'bg-rose-400/30'
          } animate-ping`}></div>
          <div className={`absolute bottom-4 left-4 w-3 h-3 rounded-full ${
            isDarkMode ? 'bg-red-500/30' : 'bg-red-400/30'
          } animate-ping delay-500`}></div>
        </div>
      </div>
      
      {/* SOS Triggered Modal */}
      {sosTriggered && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
          <div className={`relative w-full max-w-md flex flex-col rounded-3xl border-2 shadow-2xl overflow-hidden ${
            isDarkMode ? 'bg-gray-900 border-red-800/40' : 'bg-white border-red-200'
          }`} style={{ maxHeight: '90vh' }}>
            {/* Header */}
            <div className={`flex-shrink-0 relative overflow-hidden ${
              isDarkMode ? 'bg-gradient-to-r from-red-900/90 via-rose-900/70 to-red-900/60' : 'bg-gradient-to-r from-red-500 via-rose-500 to-red-500'
            }`}>
              <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-rose-600/20 animate-pulse" />
              </div>
              <div className="relative z-10 p-6 text-center">
                <div className="inline-flex p-4 rounded-full bg-white/20 backdrop-blur-sm mb-3">
                  <ShieldAlert className="w-8 h-8 text-white animate-pulse" />
                </div>
                <h2 className="text-2xl font-bold text-white">Emergency Alert Sent!</h2>
                <p className="text-white/80 text-sm mt-1">Help is on the way</p>
              </div>
            </div>

            {/* Notification List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              <p className={`text-sm font-medium mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Notifications dispatched to:</p>
              {sosNotifications.map((notif, idx) => (
                <div key={idx} className={`flex items-center justify-between p-3.5 rounded-xl border transition-all duration-500 ${
                  isDarkMode ? 'bg-gray-800/40 border-gray-700/50' : 'bg-gray-50 border-gray-100'
                }`} style={{ animationDelay: `${idx * 200}ms` }}>
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      notif.icon === 'phone' ? (isDarkMode ? 'bg-red-900/40 text-red-400' : 'bg-red-100 text-red-600') :
                      notif.icon === 'doctor' ? (isDarkMode ? 'bg-blue-900/40 text-blue-400' : 'bg-blue-100 text-blue-600') :
                      notif.icon === 'caretaker' ? (isDarkMode ? 'bg-emerald-900/40 text-emerald-400' : 'bg-emerald-100 text-emerald-600') :
                      (isDarkMode ? 'bg-purple-900/40 text-purple-400' : 'bg-purple-100 text-purple-600')
                    }`}>
                      {notif.icon === 'phone' ? <PhoneCall className="w-4 h-4" /> :
                       notif.icon === 'doctor' ? <Stethoscope className="w-4 h-4" /> :
                       notif.icon === 'caretaker' ? <User className="w-4 h-4" /> :
                       <Users className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>{notif.to}</div>
                      <div className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>{notif.time}</div>
                    </div>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                    isDarkMode ? 'bg-emerald-900/30 text-emerald-300' : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    <span className="flex items-center gap-1"><Check className="w-3 h-3" /> {notif.status}</span>
                  </span>
                </div>
              ))}

              {/* Location Shared */}
              <div className={`flex items-center gap-3 p-3.5 rounded-xl border mt-2 ${
                isDarkMode ? 'bg-blue-900/20 border-blue-800/30' : 'bg-blue-50 border-blue-200'
              }`}>
                <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-blue-900/40 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className={`text-sm font-medium ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>Live Location Shared</div>
                  <div className={`text-xs ${isDarkMode ? 'text-blue-400/70' : 'text-blue-600/70'}`}>GPS coordinates sent to all contacts</div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className={`flex-shrink-0 p-4 border-t ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
              <div className="flex gap-3">
                <button onClick={() => { setSosTriggered(false); setSosProgress(0); setTimeout(() => setSosCooldown(false), 30000); }} className={`flex-1 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 hover:scale-[1.02] ${
                  isDarkMode ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}>
                  Close
                </button>
                <button onClick={() => {
                  setSosTriggered(false);
                  setSosProgress(0);
                  setSosCooldown(false);
                  setSosNotifications([]);
                }} className="flex-1 py-2.5 rounded-xl font-medium text-sm text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  I'm Safe - Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <BeautifulFooter isDarkMode={isDarkMode} setActiveModule={setActiveModule} />
    </>
  );
};

export default PanicButton;
