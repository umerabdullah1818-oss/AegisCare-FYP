import React from 'react';
import { MapPin, Phone, Plus, User } from 'lucide-react';
import { toast } from 'react-toastify';
import GlassCard from './GlassCard';
import AnimatedCard from './AnimatedCard';
import BeautifulFooter from './BeautifulFooter';

const EmergencyLocation = ({ isDarkMode, emergencyContacts, setActiveModule }) => {
  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <GlassCard color="rose" darkMode={isDarkMode} className="relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 -translate-y-32 translate-x-32 rounded-full bg-gradient-to-r from-rose-500/20 to-pink-500/20 blur-3xl animate-pulse"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h2 className={`text-3xl font-bold mb-2 flex items-center gap-3 ${isDarkMode ? 'text-rose-400' : 'text-rose-600'}`}>
              <MapPin className="w-8 h-8" />
              Emergency Location Manager
            </h2>
            <p className={`text-lg font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Real-time tracking and quick response for your monitored elderly.
            </p>
          </div>
          <div className={`px-6 py-3 rounded-2xl flex items-center gap-3 backdrop-blur-md border-2 ${
            isDarkMode ? 'bg-rose-950/40 border-rose-900/50 text-rose-300' : 'bg-rose-50/80 border-rose-200 text-rose-700'
          }`}>
            <div className="relative flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-500"></span>
            </div>
            <span className="font-bold tracking-wide">SYSTEM ACTIVE</span>
          </div>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Live Map Area */}
        <div className="xl:col-span-2">
          <GlassCard color="indigo" darkMode={isDarkMode} className="h-full flex flex-col p-2">
            <div className={`w-full flex-grow rounded-[1.5rem] relative overflow-hidden flex items-center justify-center min-h-[400px] md:min-h-[500px] border-4 ${
              isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-100 border-white shadow-inner lg:shadow-[inset_0_0_50px_rgba(0,0,0,0.05)]'
            }`}>
              {/* Simulated Map Background Grid */}
              <div className="absolute inset-0" style={{ 
                backgroundImage: isDarkMode 
                  ? 'radial-gradient(circle at center, rgba(99, 102, 241, 0.15) 0, transparent 2px), radial-gradient(circle at center, rgba(99, 102, 241, 0.1) 0, transparent 1px)' 
                  : 'radial-gradient(circle at center, rgba(99, 102, 241, 0.2) 0, transparent 2px), radial-gradient(circle at center, rgba(99, 102, 241, 0.15) 0, transparent 1px)',
                backgroundSize: '40px 40px, 20px 20px' 
              }}></div>
              
              {/* Radar Sweep Effect */}
              <div className="absolute inset-0 overflow-hidden flex items-center justify-center opacity-30">
                <div className={`w-[800px] h-[800px] rounded-full absolute animate-spin-slow border border-indigo-500/20 ${isDarkMode ? 'bg-[conic-gradient(from_0deg,transparent_0deg,transparent_300deg,rgba(99,102,241,0.2)_360deg)]' : 'bg-[conic-gradient(from_0deg,transparent_0deg,transparent_300deg,rgba(99,102,241,0.1)_360deg)]'}`}></div>
              </div>

              {/* Map Content */}
              <div className="relative z-10 text-center flex flex-col items-center">
                <div className={`w-24 h-24 mb-6 rounded-3xl flex items-center justify-center rotate-3 mx-auto shadow-2xl ${
                  isDarkMode ? 'bg-gradient-to-br from-indigo-500 to-blue-600' : 'bg-gradient-to-br from-indigo-500 to-blue-500'
                }`}>
                  <MapPin className="w-12 h-12 text-white animate-bounce" />
                </div>
                <h3 className={`text-2xl font-bold mb-2 tracking-tight ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Live Tracking Hub</h3>
                <p className={`max-w-md mx-auto font-medium mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Real-time GPS integration allows you to accurately locate all monitored elderly individuals.
                </p>
                <div className="flex gap-4">
                   <button className={`px-6 py-3 rounded-full font-bold shadow-lg transition-transform hover:scale-105 ${
                     isDarkMode ? 'bg-indigo-600 hover:bg-indigo-500 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                   }`}>
                     Connect GPS Sensors
                   </button>
                </div>
              </div>
              
              {/* Overlay simulated pins */}
              <div className="absolute top-1/4 left-1/4 animate-pulse">
                <div className="w-4 h-4 rounded-full bg-emerald-500 ring-4 ring-emerald-500/30"></div>
              </div>
              <div className="absolute bottom-1/3 right-1/3 animate-pulse delay-75">
                <div className="w-4 h-4 rounded-full bg-blue-500 ring-4 ring-blue-500/30"></div>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Quick Dial Contacts */}
        <div className="xl:col-span-1 flex flex-col">
          <GlassCard color="amber" darkMode={isDarkMode} className="h-full flex flex-col">
            <h3 className={`text-2xl font-bold mb-6 flex items-center gap-3 ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`}>
              <Phone className="w-6 h-6" />
              Quick Dial
            </h3>
            
            <div className="flex-1 space-y-4 flex flex-col">
              {emergencyContacts.map((contact, idx) => (
                <AnimatedCard key={contact.id} delay={idx}>
                  <div className={`p-4 xl:p-5 rounded-2xl flex items-center justify-between group transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border-2 ${
                    contact.role === '911' 
                      ? (isDarkMode ? 'bg-rose-950/40 border-rose-900/50 hover:bg-rose-900/60' : 'bg-rose-50/80 border-rose-200 hover:bg-rose-100/80')
                      : (isDarkMode ? 'bg-gray-800/40 border-gray-700/50 hover:bg-gray-800/80 hover:border-amber-700/30' : 'bg-white/80 border-gray-100 hover:bg-amber-50/50 hover:border-amber-200/50')
                  }`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-inner ${
                        contact.role === '911'
                          ? (isDarkMode ? 'bg-rose-900/80 text-rose-300' : 'bg-rose-200/80 text-rose-700')
                          : (isDarkMode ? 'bg-amber-900/40 text-amber-400' : 'bg-amber-100 text-amber-600')
                      }`}>
                        <Phone className="w-5 h-5" />
                      </div>
                      <div>
                        <div className={`font-bold text-lg leading-tight mb-1 ${
                          contact.role === '911'
                            ? (isDarkMode ? 'text-rose-300' : 'text-rose-700')
                            : (isDarkMode ? 'text-gray-100' : 'text-gray-900')
                        }`}>{contact.name}</div>
                        <div className={`text-sm font-semibold flex items-center gap-2 ${
                          contact.role === '911'
                            ? (isDarkMode ? 'text-rose-400/80' : 'text-rose-600/80')
                            : (isDarkMode ? 'text-gray-400' : 'text-gray-500')
                        }`}>
                          <User className="w-3 h-3" /> {contact.role}
                        </div>
                      </div>
                    </div>
                    <button className={`p-3 rounded-full transition-transform hover:scale-110 shadow-md ${
                      contact.role === '911'
                        ? 'bg-gradient-to-br from-rose-500 to-red-600 text-white'
                        : 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-white'
                    }`}
                    onClick={() => toast.info(`Dialing ${contact.name}...`)}
                    >
                      <Phone className="w-5 h-5" />
                    </button>
                  </div>
                </AnimatedCard>
              ))}
              
              <div className={`mt-auto pt-6 border-t-2 border-dashed ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
                 <button className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all hover:-translate-y-1 shadow-md ${
                   isDarkMode ? 'bg-amber-600 hover:bg-amber-500 text-white' : 'bg-amber-500 hover:bg-amber-600 text-white'
                 }`}>
                   <Plus className="w-5 h-5" /> Add New Contact
                 </button>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
      <BeautifulFooter isDarkMode={isDarkMode} setActiveModule={setActiveModule} />
    </div>
  );
};

export default EmergencyLocation;
