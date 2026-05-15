import React, { useState, useEffect } from 'react';
import { Video, User, Pause, Play, MicOff, Mic, VideoOff, Maximize2, FileText, Pill, UploadCloud, FileSignature } from 'lucide-react';

const VideoCall = ({ patient, onEndCall, isDarkMode, userName }) => {
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [diagnosis, setDiagnosis] = useState('');
    const [prescription, setPrescription] = useState('');
    const [callDuration, setCallDuration] = useState(0);
    const [isRecording, setIsRecording] = useState(false);

    useEffect(() => {
      const timer = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);

      return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
      <div className={`fixed inset-0 z-50 ${isDarkMode ? 'bg-gray-950' : 'bg-gray-900'} animate-fade-in`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className={`p-4 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-800'} border-b ${isDarkMode ? 'border-gray-800' : 'border-gray-700'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-blue-950/40' : 'bg-blue-900/20'} animate-pulse`}>
                  <Video className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Consultation with {patient?.name}</h2>
                  <p className="text-sm text-gray-300">
                    Cardiology Follow-up • Duration: {formatTime(callDuration)}
                    {isRecording && <span className="ml-2 text-rose-400 animate-pulse">● REC</span>}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${isDarkMode ? 'bg-emerald-900/40 text-emerald-300' : 'bg-emerald-800/40 text-emerald-200'} animate-pulse`}>
                  Live
                </span>
                <button
                  onClick={() => setIsRecording(!isRecording)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 flex items-center gap-2 ${
                    isRecording
                      ? (isDarkMode ? 'bg-rose-600 hover:bg-rose-500' : 'bg-rose-500 hover:bg-rose-400')
                      : (isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-700 hover:bg-gray-600')
                  } text-white`}
                >
                  {isRecording ? <Pause size={16} /> : <Play size={16} />}
                  {isRecording ? 'Stop Recording' : 'Record'}
                </button>
                <button
                  onClick={onEndCall}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 ${
                    isDarkMode 
                      ? 'bg-rose-600 hover:bg-rose-500 text-white'
                      : 'bg-rose-500 hover:bg-rose-400 text-white'
                  }`}
                >
                  End Consultation
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex">
            {/* Video Feed */}
            <div className="flex-1 p-4">
              <div className="relative rounded-2xl overflow-hidden bg-black h-full animate-scale-in">
                {/* Patient Video */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-900/40 to-purple-900/40 flex items-center justify-center mb-4 mx-auto animate-pulse">
                      <User className="w-16 h-16 text-blue-300" />
                    </div>
                    <p className="text-gray-400 animate-pulse">Waiting for {patient?.name} to join...</p>
                  </div>
                </div>
                
                {/* Doctor's Video */}
                <div className="absolute bottom-4 right-4 w-48 h-36 rounded-lg overflow-hidden border-2 border-blue-500 bg-gray-800 animate-slide-in-right">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-900/40 to-cyan-900/40 flex items-center justify-center animate-spin-slow">
                      <User className="w-8 h-8 text-blue-300" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 left-2 px-2 py-1 rounded bg-blue-900/80 text-white text-xs">
                    Dr. {userName}
                  </div>
                </div>

                {/* Controls Overlay */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className={`p-3 rounded-full transition-all duration-300 hover:scale-110 ${
                        isMuted 
                          ? (isDarkMode ? 'bg-rose-600' : 'bg-rose-500') 
                          : (isDarkMode ? 'bg-gray-800/80' : 'bg-gray-700/80')
                      }`}
                    >
                      {isMuted ? <MicOff className="w-5 h-5 text-white" /> : <Mic className="w-5 h-5 text-white" />}
                    </button>
                    <button
                      onClick={() => setIsVideoOff(!isVideoOff)}
                      className={`p-3 rounded-full transition-all duration-300 hover:scale-110 ${
                        isVideoOff 
                          ? (isDarkMode ? 'bg-rose-600' : 'bg-rose-500') 
                          : (isDarkMode ? 'bg-gray-800/80' : 'bg-gray-700/80')
                      }`}
                    >
                      {isVideoOff ? <VideoOff className="w-5 h-5 text-white" /> : <Video className="w-5 h-5 text-white" />}
                    </button>
                    <button
                      onClick={() => setIsFullscreen(!isFullscreen)}
                      className="p-3 rounded-full bg-gray-800/80 hover:bg-gray-700/80 transition-all duration-300 hover:scale-110"
                    >
                      <Maximize2 className="w-5 h-5 text-white" />
                    </button>
                    <button
                      onClick={() => setIsRecording(!isRecording)}
                      className={`p-3 rounded-full transition-all duration-300 hover:scale-110 ${
                        isRecording
                          ? (isDarkMode ? 'bg-rose-600' : 'bg-rose-500')
                          : (isDarkMode ? 'bg-gray-800/80' : 'bg-gray-700/80')
                      }`}
                    >
                      {isRecording ? (
                        <div className="w-5 h-5 bg-white rounded-sm"></div>
                      ) : (
                        <div className="w-5 h-5 border-2 border-white rounded-sm"></div>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Side Panel */}
            <div className={`w-96 border-l ${isDarkMode ? 'border-gray-800 bg-gray-900' : 'border-gray-700 bg-gray-800'} animate-slide-in-left`}>
              <div className="p-4 h-full flex flex-col">
                {/* Patient Info */}
                <div className={`p-4 rounded-xl mb-4 ${isDarkMode ? 'bg-gray-800/60' : 'bg-gray-700/60'}`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-900/40 to-cyan-900/40 flex items-center justify-center">
                      <User className="w-6 h-6 text-blue-300" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white">{patient?.name}</h3>
                      <p className="text-sm text-gray-300">{patient?.age} years • {patient?.condition}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-800/40' : 'bg-gray-700/40'}`}>
                      <div className="text-xs text-gray-400">Heart Rate</div>
                      <div className="text-sm font-medium text-white">{patient?.vitals.heartRate} BPM</div>
                    </div>
                    <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-800/40' : 'bg-gray-700/40'}`}>
                      <div className="text-xs text-gray-400">Blood Pressure</div>
                      <div className="text-sm font-medium text-white">{patient?.vitals.bp}</div>
                    </div>
                  </div>
                </div>

                {/* Diagnosis Input */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                    <FileText size={14} />
                    Diagnosis
                  </label>
                  <textarea
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    className={`w-full h-32 px-3 py-2 rounded-lg resize-none transition-all duration-300 ${
                      isDarkMode 
                        ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-blue-500'
                        : 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400'
                    } border focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                   
                  />
                </div>

                {/* Prescription Input */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                    <Pill size={14} />
                    Prescription
                  </label>
                  <textarea
                    value={prescription}
                    onChange={(e) => setPrescription(e.target.value)}
                    className={`w-full h-32 px-3 py-2 rounded-lg resize-none transition-all duration-300 ${
                      isDarkMode 
                        ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-emerald-500'
                        : 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-emerald-400'
                    } border focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
                   
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-auto">
                  <button className={`flex-1 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 ${
                    isDarkMode 
                      ? 'bg-blue-600 hover:bg-blue-500 text-white'
                      : 'bg-blue-500 hover:bg-blue-400 text-white'
                  }`}>
                    <UploadCloud className="w-4 h-4" />
                    Upload Reports
                  </button>
                  <button className={`flex-1 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 ${
                    isDarkMode 
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                      : 'bg-emerald-500 hover:bg-emerald-400 text-white'
                  }`}>
                    <FileSignature className="w-4 h-4" />
                    Save & End
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
};

export default VideoCall;
