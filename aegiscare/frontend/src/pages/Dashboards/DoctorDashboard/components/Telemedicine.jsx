import React, { useState } from 'react';
import { Video, Zap, Phone, User, Camera, Shield, FileText, Settings } from 'lucide-react';
import GlassCard from './GlassCard';
import GlowingButton from './GlowingButton';
import AnimatedCard from './AnimatedCard';
import BeautifulFooter from './BeautifulFooter';
import { getColorClass } from '../helpers';

const Telemedicine = ({ isDarkMode, patients, setSelectedPatient, setIsVideoCallActive, telemedicineSessions, setActiveModule }) => {
    const [activeTab, setActiveTab] = useState('upcoming');
    const [callHistory, setCallHistory] = useState([]);

    return (
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <GlassCard color="amber" hoverable={false} darkMode={isDarkMode}>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex-1">
              <h1 className={`text-3xl font-bold mb-2 bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent`}>
                Telemedicine Hub
              </h1>
              <p className={`text-lg ${isDarkMode ? 'text-amber-200/80' : 'text-amber-700/80'}`}>
                Connect with patients through secure video consultations
              </p>
            </div>
            <div className="flex gap-3">
              <GlowingButton 
                icon={<Video className="w-4 h-4" />}
                color="amber"
                size="md"
                onClick={() => {
                  if (patients.length > 0) {
                    setSelectedPatient(patients[0]);
                    setIsVideoCallActive(true);
                  }
                }}
              >
                Start New Call
              </GlowingButton>
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                isDarkMode ? 'bg-amber-950/40 border border-amber-900/30' : 'bg-gradient-to-r from-amber-100 to-orange-100 border border-amber-200'
              }`}>
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
                <span className={`text-sm font-medium ${isDarkMode ? 'text-amber-300' : 'text-amber-700'}`}>
                  Online: {patients.filter(p => p.status !== 'Critical').length} patients
                </span>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Tabs */}
        <div className="flex gap-2">
          {['upcoming', 'history', 'recordings'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 capitalize ${
                activeTab === tab
                  ? isDarkMode
                    ? 'bg-amber-600 text-white'
                    : 'bg-amber-500 text-white'
                  : isDarkMode
                  ? 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Telemedicine Sessions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming Sessions */}
          <GlassCard color="amber" darkMode={isDarkMode}>
            <h3 className={`text-xl font-bold mb-6 flex items-center gap-2 ${
              isDarkMode ? 'text-amber-300' : 'text-amber-600'
            }`}>
              <Video className="w-6 h-6 animate-pulse" />
              Upcoming Sessions
            </h3>
            <div className="space-y-4">
              {telemedicineSessions.map((session, idx) => (
                <AnimatedCard key={session.id} delay={idx}>
                  <div className={`p-4 rounded-xl border transition-all duration-300 hover:scale-105 ${
                    isDarkMode ? 'bg-gray-800/40 border-gray-700' : 'bg-white/50 border-gray-200'
                  }`}>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className={`font-bold text-lg mb-1 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                          {session.patient}
                        </h4>
                        <div className="flex items-center gap-2">
                          <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            ⏰ {session.time} • {session.duration}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            session.status === 'Completed' 
                              ? isDarkMode ? 'bg-emerald-900/30 text-emerald-300' : 'bg-emerald-100 text-emerald-700'
                              : session.status === 'Scheduled'
                              ? isDarkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-700'
                              : isDarkMode ? 'bg-amber-900/30 text-amber-300' : 'bg-amber-100 text-amber-700'
                          }`}>
                            {session.status}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          const patient = patients.find(p => p.name === session.patient);
                          if (patient) {
                            setSelectedPatient(patient);
                            setIsVideoCallActive(true);
                          }
                        }}
                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 flex items-center gap-2 ${
                          isDarkMode
                            ? 'bg-amber-600 hover:bg-amber-500 text-white'
                            : 'bg-amber-500 hover:bg-amber-600 text-white'
                        }`}
                      >
                        <Video className="w-4 h-4" />
                        Join
                      </button>
                    </div>
                    {session.recording && (
                      <div className={`flex items-center gap-2 text-sm ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`}>
                        <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></div>
                        Recording will be available
                      </div>
                    )}
                  </div>
                </AnimatedCard>
              ))}
            </div>
          </GlassCard>

          {/* Quick Connect */}
          <GlassCard color="orange" darkMode={isDarkMode}>
            <h3 className={`text-xl font-bold mb-6 flex items-center gap-2 ${
              isDarkMode ? 'text-orange-300' : 'text-orange-600'
            }`}>
              <Zap className="w-6 h-6 animate-pulse" />
              Quick Connect
            </h3>
            <div className="space-y-4">
              {patients.slice(0, 3).map((patient, idx) => (
                <AnimatedCard key={patient.id} delay={idx}>
                  <div className={`p-4 rounded-xl border transition-all duration-300 hover:scale-105 ${
                    isDarkMode ? 'bg-gray-800/40 border-gray-700' : 'bg-white/50 border-gray-200'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          isDarkMode ? getColorClass(patient.color, 'darkBg') : getColorClass(patient.color, 'bg')
                        }`}>
                          <User className={isDarkMode ? getColorClass(patient.color, 'darkText') : getColorClass(patient.color, 'text')} size={20} />
                        </div>
                        <div>
                          <h4 className={`font-bold text-lg mb-1 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                            {patient.name}
                          </h4>
                          <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {patient.condition}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedPatient(patient);
                            setIsVideoCallActive(true);
                          }}
                          className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${
                            isDarkMode
                              ? 'bg-amber-900/30 hover:bg-amber-800/30 text-amber-300'
                              : 'bg-amber-100 hover:bg-amber-200 text-amber-700'
                          }`}
                        >
                          <Video className="w-4 h-4" />
                        </button>
                        <button className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${
                          isDarkMode
                            ? 'bg-blue-900/30 hover:bg-blue-800/30 text-blue-300'
                            : 'bg-blue-100 hover:bg-blue-200 text-blue-700'
                        }`}>
                          <Phone className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </AnimatedCard>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Call Setup */}
        <GlassCard color="amber" darkMode={isDarkMode}>
          <h3 className={`text-xl font-bold mb-6 flex items-center gap-2 ${
            isDarkMode ? 'text-amber-300' : 'text-amber-600'
          }`}>
            <Settings className="w-6 h-6 animate-pulse" />
            Call Setup
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className={`p-6 rounded-2xl border transition-all duration-300 hover:scale-105 ${
              isDarkMode ? 'bg-gray-800/40 border-gray-700' : 'bg-white/50 border-gray-200'
            }`}>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                isDarkMode ? 'bg-blue-950/30' : 'bg-blue-100'
              }`}>
                <Camera className={`w-6 h-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              </div>
              <h4 className={`text-lg font-bold mb-2 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                Video Settings
              </h4>
              <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Configure camera, microphone, and video quality
              </p>
              <button className={`w-full py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 ${
                isDarkMode
                  ? 'bg-blue-600 hover:bg-blue-500 text-white'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}>
                Configure
              </button>
            </div>

            <div className={`p-6 rounded-2xl border transition-all duration-300 hover:scale-105 ${
              isDarkMode ? 'bg-gray-800/40 border-gray-700' : 'bg-white/50 border-gray-200'
            }`}>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                isDarkMode ? 'bg-emerald-950/30' : 'bg-emerald-100'
              }`}>
                <Shield className={`w-6 h-6 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
              </div>
              <h4 className={`text-lg font-bold mb-2 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                Security & Privacy
              </h4>
              <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                HIPAA compliant encryption and privacy settings
              </p>
              <button className={`w-full py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 ${
                isDarkMode
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  : 'bg-emerald-500 hover:bg-emerald-600 text-white'
              }`}>
                Security Settings
              </button>
            </div>

            <div className={`p-6 rounded-2xl border transition-all duration-300 hover:scale-105 ${
              isDarkMode ? 'bg-gray-800/40 border-gray-700' : 'bg-white/50 border-gray-200'
            }`}>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                isDarkMode ? 'bg-purple-950/30' : 'bg-purple-100'
              }`}>
                <FileText className={`w-6 h-6 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
              </div>
              <h4 className={`text-lg font-bold mb-2 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                Documentation
              </h4>
              <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Templates for consultation notes and prescriptions
              </p>
              <button className={`w-full py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 ${
                isDarkMode
                  ? 'bg-purple-600 hover:bg-purple-500 text-white'
                  : 'bg-purple-500 hover:bg-purple-600 text-white'
              }`}>
                View Templates
              </button>
            </div>
          </div>
        </GlassCard>

        <BeautifulFooter isDarkMode={isDarkMode} setActiveModule={setActiveModule} />
      </div>
    );
};

export default Telemedicine;
