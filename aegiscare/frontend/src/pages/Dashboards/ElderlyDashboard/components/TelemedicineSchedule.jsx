import React from 'react';
import {
  Video,
  Calendar,
  Stethoscope,
  Search,
  ChevronDown,
  Check,
  User,
  Clock,
  AlertCircle,
  Sparkles,
  CalendarDays
} from 'lucide-react';
import { getColorClass } from '../helpers';
import BeautifulFooter from './BeautifulFooter';

const TelemedicineSchedule = (props) => {
  const {
    isDarkMode,
    doctorDropdownOpen,
    setDoctorDropdownOpen,
    apptDoctor,
    setApptDoctor,
    doctors,
    apptDate,
    setApptDate,
    apptPeriod,
    setApptPeriod,
    timeDropdownOpen,
    setTimeDropdownOpen,
    apptSlot,
    setApptSlot,
    apptMsg,
    apptNotes,
    setApptNotes,
    handleBookAppointment,
    apptLoading,
    appointments,
    appointmentsLoading,
    setActiveModule,
  } = props;

  return (
    <div className="space-y-6">
      {/* Modern Header */}
      <div className={`relative rounded-3xl p-6 overflow-hidden backdrop-blur-xl border transition-all duration-500 ${
        isDarkMode
          ? 'bg-gradient-to-br from-gray-950/80 via-emerald-950/20 to-green-950/10 border-emerald-800/30 shadow-2xl shadow-emerald-950/30'
          : 'bg-gradient-to-br from-white/90 via-emerald-50/60 to-green-50/40 border-emerald-200/50 shadow-2xl shadow-emerald-100/50'
      }`}>
        
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className={`text-3xl font-bold mb-2 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 bg-clip-text text-transparent animate-gradient`}>
                Book Virtual Consultation
              </h2>
              <p className={`text-base ${isDarkMode ? 'text-emerald-200/80' : 'text-emerald-700/80'}`}>
                Schedule a secure video appointment with healthcare specialists
              </p>
            </div>
            
            <div className={`p-3 rounded-xl ${
              isDarkMode ? 'bg-emerald-950/40' : 'bg-emerald-100'
            }`}>
              <Video className={`w-6 h-6 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Booking Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Form Section */}
        <div className={`lg:col-span-2 relative rounded-3xl p-6 backdrop-blur-xl border-2 overflow-hidden transition-all duration-500 ${
          isDarkMode
            ? 'bg-gradient-to-br from-gray-950/40 via-gray-900/30 to-gray-950/40 border-emerald-800/30'
            : 'bg-gradient-to-br from-white/90 via-white/80 to-white/90 border-emerald-200/50'
        }`}>
          
          <h3 className={`text-xl font-bold mb-6 flex items-center gap-2 ${
            isDarkMode ? 'text-emerald-300' : 'text-emerald-600'
          }`}>
            <Calendar className="w-6 h-6" />
            Appointment Details
          </h3>

          <div className="space-y-5">
            {/* Doctor Selection */}
            <div className="space-y-2">
              <label className={`text-sm font-semibold flex items-center gap-2 ${isDarkMode ? 'text-emerald-300' : 'text-emerald-600'}`}>
                <Stethoscope className="w-4 h-4" />
                Select Healthcare Provider
              </label>
              <div className="relative">
                {/* Trigger Button */}
                <button
                  type="button"
                  onClick={() => setDoctorDropdownOpen(!doctorDropdownOpen)}
                  className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-sm transition-all duration-300 border-2 ${
                    doctorDropdownOpen
                      ? isDarkMode
                        ? 'bg-gray-800/80 border-emerald-500/60 ring-4 ring-emerald-500/10 shadow-lg shadow-emerald-900/20'
                        : 'bg-white border-emerald-400 ring-4 ring-emerald-400/15 shadow-lg shadow-emerald-100'
                      : apptDoctor
                        ? isDarkMode
                          ? 'bg-gray-800/60 border-emerald-700/40 hover:border-emerald-600/50'
                          : 'bg-white border-emerald-300 hover:border-emerald-400'
                        : isDarkMode
                          ? 'bg-gray-800/60 border-gray-700/50 hover:border-emerald-700/40'
                          : 'bg-white border-gray-200 hover:border-emerald-300'
                  }`}
                >
                  {apptDoctor ? (() => {
                    const selected = doctors.find(d => d._id === apptDoctor);
                    return selected ? (
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold ${
                          isDarkMode ? 'bg-emerald-900/50 text-emerald-300' : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {selected.name.replace('Dr. ', '').charAt(0)}
                        </div>
                        <div className="text-left">
                          <div className={`font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{selected.name}</div>
                          <div className={`text-xs ${isDarkMode ? 'text-emerald-400/70' : 'text-emerald-600/70'}`}>{selected.specialization || 'General Physician'}</div>
                        </div>
                      </div>
                    ) : <span className={isDarkMode ? 'text-gray-500' : 'text-gray-400'}>Select a doctor...</span>;
                  })() : (
                    <span className={`flex items-center gap-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      <Search className="w-4 h-4" />
                      Select a doctor...
                    </span>
                  )}
                  <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${
                    doctorDropdownOpen ? 'rotate-180' : ''
                  } ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                </button>

                {/* Dropdown Panel */}
                {doctorDropdownOpen && (
                  <div className={`absolute z-50 w-full mt-2 rounded-2xl border-2 shadow-2xl overflow-hidden transition-all duration-300 ${
                    isDarkMode
                      ? 'bg-gray-900 border-emerald-800/40 shadow-black/40'
                      : 'bg-white border-emerald-200/60 shadow-emerald-100/60'
                  }`}>
                    {/* Dropdown Header */}
                    <div className={`px-4 py-3 border-b ${
                      isDarkMode ? 'border-gray-800 bg-gray-900/80' : 'border-gray-100 bg-emerald-50/50'
                    }`}>
                      <p className={`text-xs font-semibold uppercase tracking-wider ${isDarkMode ? 'text-emerald-400/70' : 'text-emerald-600/70'}`}>
                        {doctors.length > 0 ? `${doctors.length} Doctor${doctors.length > 1 ? 's' : ''} Available` : 'No Doctors Found'}
                      </p>
                    </div>

                    {/* Doctor List */}
                    <div className="max-h-56 overflow-y-auto">
                      {doctors.length > 0 ? doctors.map((doc) => {
                        const isSelected = apptDoctor === doc._id;
                        const initials = doc.name.replace('Dr. ', '').split(' ').map(n => n[0]).join('').toUpperCase();
                        const specColors = {
                          'Heart': { bg: isDarkMode ? 'bg-rose-900/40' : 'bg-rose-100', text: isDarkMode ? 'text-rose-300' : 'text-rose-600', badge: isDarkMode ? 'bg-rose-800/40 text-rose-300' : 'bg-rose-100 text-rose-700' },
                          'Cardiology': { bg: isDarkMode ? 'bg-rose-900/40' : 'bg-rose-100', text: isDarkMode ? 'text-rose-300' : 'text-rose-600', badge: isDarkMode ? 'bg-rose-800/40 text-rose-300' : 'bg-rose-100 text-rose-700' },
                          'Neurology': { bg: isDarkMode ? 'bg-purple-900/40' : 'bg-purple-100', text: isDarkMode ? 'text-purple-300' : 'text-purple-600', badge: isDarkMode ? 'bg-purple-800/40 text-purple-300' : 'bg-purple-100 text-purple-700' },
                          'Orthopedics': { bg: isDarkMode ? 'bg-blue-900/40' : 'bg-blue-100', text: isDarkMode ? 'text-blue-300' : 'text-blue-600', badge: isDarkMode ? 'bg-blue-800/40 text-blue-300' : 'bg-blue-100 text-blue-700' },
                          'Dermatology': { bg: isDarkMode ? 'bg-amber-900/40' : 'bg-amber-100', text: isDarkMode ? 'text-amber-300' : 'text-amber-600', badge: isDarkMode ? 'bg-amber-800/40 text-amber-300' : 'bg-amber-100 text-amber-700' },
                          'Pediatrics': { bg: isDarkMode ? 'bg-cyan-900/40' : 'bg-cyan-100', text: isDarkMode ? 'text-cyan-300' : 'text-cyan-600', badge: isDarkMode ? 'bg-cyan-800/40 text-cyan-300' : 'bg-cyan-100 text-cyan-700' },
                        };
                        const spec = doc.specialization || 'General Physician';
                        const colorKey = Object.keys(specColors).find(k => spec.toLowerCase().includes(k.toLowerCase()));
                        const colors = colorKey ? specColors[colorKey] : { bg: isDarkMode ? 'bg-emerald-900/40' : 'bg-emerald-100', text: isDarkMode ? 'text-emerald-300' : 'text-emerald-600', badge: isDarkMode ? 'bg-emerald-800/40 text-emerald-300' : 'bg-emerald-100 text-emerald-700' };

                        return (
                          <button
                            key={doc._id}
                            type="button"
                            onClick={() => { setApptDoctor(doc._id); setDoctorDropdownOpen(false); }}
                            className={`w-full flex items-center gap-3 px-4 py-3 transition-all duration-200 ${
                              isSelected
                                ? isDarkMode
                                  ? 'bg-emerald-900/30 border-l-3 border-l-emerald-400'
                                  : 'bg-emerald-50 border-l-3 border-l-emerald-500'
                                : isDarkMode
                                  ? 'hover:bg-gray-800/60'
                                  : 'hover:bg-gray-50'
                            }`}
                          >
                            {/* Avatar */}
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 ${colors.bg} ${colors.text}`}>
                              {initials}
                            </div>

                            {/* Info */}
                            <div className="flex-1 text-left min-w-0">
                              <div className={`text-sm font-semibold truncate ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                                {doc.name}
                              </div>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${colors.badge}`}>
                                  {spec}
                                </span>
                              </div>
                            </div>

                            {/* Selected Check */}
                            {isSelected && (
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                                isDarkMode ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-600'
                              }`}>
                                <Check className="w-4 h-4" />
                              </div>
                            )}
                          </button>
                        );
                      }) : (
                        <div className={`px-4 py-8 text-center ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                          <User className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">No doctors available</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Click outside to close */}
                {doctorDropdownOpen && (
                  <div className="fixed inset-0 z-40" onClick={() => setDoctorDropdownOpen(false)} />
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Date Selection */}
              <div className="space-y-2">
                <label className={`text-sm font-semibold flex items-center gap-2 ${isDarkMode ? 'text-emerald-300' : 'text-emerald-600'}`}>
                  <Calendar className="w-4 h-4" />
                  Select Date
                </label>
                <div className="relative">
                  <input 
                    type="date" 
                    value={apptDate}
                    onChange={e => setApptDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className={`w-full px-4 py-3 rounded-xl text-sm backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] ${
                      isDarkMode
                        ? 'bg-gray-900/50 border-emerald-800/30 text-gray-300 hover:bg-gray-800/50 focus:ring-2 focus:ring-emerald-500'
                        : 'bg-white/80 border-emerald-200 text-gray-700 hover:bg-white focus:ring-2 focus:ring-emerald-400'
                    } border`}
                  />
                </div>
              </div>

              {/* Time Selection */}
              <div className="space-y-2">
                <label className={`text-sm font-semibold flex items-center gap-2 ${isDarkMode ? 'text-emerald-300' : 'text-emerald-600'}`}>
                  <Clock className="w-4 h-4" />
                  Preferred Time
                </label>
                <div className="relative">
                  {/* Trigger */}
                  <button
                    type="button"
                    onClick={() => setTimeDropdownOpen(!timeDropdownOpen)}
                    className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-sm transition-all duration-300 border-2 ${
                      timeDropdownOpen
                        ? isDarkMode
                          ? 'bg-gray-800/80 border-emerald-500/60 ring-4 ring-emerald-500/10 shadow-lg shadow-emerald-900/20'
                          : 'bg-white border-emerald-400 ring-4 ring-emerald-400/15 shadow-lg shadow-emerald-100'
                        : isDarkMode
                          ? 'bg-gray-800/60 border-gray-700/50 hover:border-emerald-700/40'
                          : 'bg-white border-gray-200 hover:border-emerald-300'
                    }`}
                  >
                    {(() => {
                      const periods = [
                        { value: 'morning', label: 'Morning', time: '9:00 AM - 12:00 PM', icon: '🌅', color: isDarkMode ? 'text-amber-300' : 'text-amber-600' },
                        { value: 'afternoon', label: 'Afternoon', time: '1:00 PM - 4:00 PM', icon: '☀️', color: isDarkMode ? 'text-orange-300' : 'text-orange-600' },
                        { value: 'evening', label: 'Evening', time: '5:00 PM - 8:00 PM', icon: '🌙', color: isDarkMode ? 'text-indigo-300' : 'text-indigo-600' },
                      ];
                      const sel = periods.find(p => p.value === apptPeriod) || periods[0];
                      return (
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{sel.icon}</span>
                          <div className="text-left">
                            <span className={`font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{sel.label}</span>
                            <span className={`text-xs ml-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{sel.time}</span>
                          </div>
                        </div>
                      );
                    })()}
                    <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${
                      timeDropdownOpen ? 'rotate-180' : ''
                    } ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  </button>

                  {/* Dropdown Panel */}
                  {timeDropdownOpen && (
                    <div className={`absolute z-50 w-full mt-2 rounded-2xl border-2 shadow-2xl overflow-hidden ${
                      isDarkMode
                        ? 'bg-gray-900 border-emerald-800/40 shadow-black/40'
                        : 'bg-white border-emerald-200/60 shadow-emerald-100/60'
                    }`}>
                      {[{ value: 'morning', label: 'Morning', time: '9:00 AM - 12:00 PM', icon: '🌅', desc: 'Start your day fresh',
                          bg: isDarkMode ? 'bg-amber-900/20' : 'bg-amber-50', accent: isDarkMode ? 'text-amber-300' : 'text-amber-600' },
                        { value: 'afternoon', label: 'Afternoon', time: '1:00 PM - 4:00 PM', icon: '☀️', desc: 'Post-lunch appointment',
                          bg: isDarkMode ? 'bg-orange-900/20' : 'bg-orange-50', accent: isDarkMode ? 'text-orange-300' : 'text-orange-600' },
                        { value: 'evening', label: 'Evening', time: '5:00 PM - 8:00 PM', icon: '🌙', desc: 'End of day visit',
                          bg: isDarkMode ? 'bg-indigo-900/20' : 'bg-indigo-50', accent: isDarkMode ? 'text-indigo-300' : 'text-indigo-600' },
                      ].map((period) => {
                        const isSelected = apptPeriod === period.value;
                        return (
                          <button
                            key={period.value}
                            type="button"
                            onClick={() => { setApptPeriod(period.value); setTimeDropdownOpen(false); }}
                            className={`w-full flex items-center gap-3 px-4 py-3.5 transition-all duration-200 ${
                              isSelected
                                ? `${period.bg} ${isDarkMode ? 'border-l-3 border-l-emerald-400' : 'border-l-3 border-l-emerald-500'}`
                                : isDarkMode
                                  ? 'hover:bg-gray-800/60'
                                  : 'hover:bg-gray-50'
                            }`}
                          >
                            <span className="text-xl">{period.icon}</span>
                            <div className="flex-1 text-left">
                              <div className="flex items-center gap-2">
                                <span className={`text-sm font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{period.label}</span>
                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                  isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'
                                }`}>{period.time}</span>
                              </div>
                              <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>{period.desc}</p>
                            </div>
                            {isSelected && (
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                                isDarkMode ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-600'
                              }`}>
                                <Check className="w-4 h-4" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Click outside to close */}
                  {timeDropdownOpen && (
                    <div className="fixed inset-0 z-40" onClick={() => setTimeDropdownOpen(false)} />
                  )}
                </div>
              </div>
            </div>

            {/* Time Slots */}
            <div className="space-y-2">
              <label className={`block text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Available Time Slots
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                {['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM'].map((time, idx) => (
                  <button key={idx} onClick={() => setApptSlot(time)} className={`p-3 rounded-xl border transition-all duration-300 hover:scale-105 flex flex-col items-center justify-center gap-1 ${
                    apptSlot === time
                      ? isDarkMode
                        ? 'bg-emerald-900/50 border-emerald-500 ring-2 ring-emerald-500/30'
                        : 'bg-emerald-200 border-emerald-400 ring-2 ring-emerald-300/50'
                      : isDarkMode
                        ? 'bg-gray-900/30 border-gray-800 hover:border-emerald-700/30'
                        : 'bg-white/50 border-gray-200 hover:border-emerald-300/50'
                  }`}>
                    <span className={`text-sm font-medium ${apptSlot === time ? (isDarkMode ? 'text-emerald-300' : 'text-emerald-700') : (isDarkMode ? 'text-gray-300' : 'text-gray-700')}`}>
                      {time}
                    </span>
                    <span className={`text-xs ${apptSlot === time ? (isDarkMode ? 'text-emerald-400' : 'text-emerald-600') : (isDarkMode ? 'text-emerald-400' : 'text-emerald-600')}`}>
                      {apptSlot === time ? 'Selected' : 'Available'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Appointment Message */}
            {apptMsg.text && (
              <div className={`p-4 rounded-xl flex items-center gap-3 ${
                apptMsg.type === 'success'
                  ? isDarkMode ? 'bg-emerald-900/30 border border-emerald-700/40 text-emerald-300' : 'bg-emerald-100 border border-emerald-200 text-emerald-700'
                  : isDarkMode ? 'bg-red-900/30 border border-red-700/40 text-red-300' : 'bg-red-100 border border-red-200 text-red-700'
              }`}>
                {apptMsg.type === 'success' ? <Check className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                <span className="text-sm font-medium">{apptMsg.text}</span>
              </div>
            )}

            {/* Notes Field */}
            <div className="space-y-2">
              <label className={`block text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Notes (optional)
              </label>
              <textarea
                value={apptNotes}
                onChange={e => setApptNotes(e.target.value)}
                rows={2}
               
                className={`w-full px-4 py-3 rounded-xl text-sm backdrop-blur-sm transition-all duration-300 resize-none ${
                  isDarkMode
                    ? 'bg-gray-900/50 border-emerald-800/30 text-gray-300 focus:ring-2 focus:ring-emerald-500'
                    : 'bg-white/80 border-emerald-200 text-gray-700 focus:ring-2 focus:ring-emerald-400'
                } border`}
              />
            </div>

            {/* Schedule Button */}
            <button 
              onClick={handleBookAppointment}
              disabled={apptLoading}
              className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all duration-300 
              hover:scale-105 active:scale-95 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:hover:scale-100 ${
              isDarkMode
                ? 'bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 hover:from-emerald-500 hover:via-green-500 hover:to-emerald-600 text-white'
                : 'bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 hover:from-emerald-600 hover:via-green-600 hover:to-emerald-700 text-white'
            }`}>
              {apptLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Scheduling...
                </>
              ) : (
                <>
                  <Calendar className="w-5 h-5" />
                  Schedule Virtual Appointment
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Info Section */}
        <div className={`space-y-4`}>
          {/* Appointment Tips */}
          <div className={`relative rounded-2xl p-5 backdrop-blur-xl border-2 overflow-hidden ${
            isDarkMode
              ? 'bg-gradient-to-br from-gray-950/40 via-gray-900/30 to-gray-950/40 border-teal-800/30'
              : 'bg-gradient-to-br from-white/90 via-white/80 to-white/90 border-teal-200/50'
          }`}>
            <h3 className={`text-lg font-bold mb-3 flex items-center gap-2 ${
              isDarkMode ? 'text-teal-300' : 'text-teal-600'
            }`}>
              <Sparkles className="w-5 h-5" />
              Preparation Tips
            </h3>
            <ul className="space-y-2">
              {[
                'Have your medical reports ready',
                'Test your camera and microphone',
                'Find a quiet, well-lit space',
                'Write down questions in advance',
                'Keep medications list handy'
              ].map((tip, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <div className={`p-1 rounded-full mt-0.5 ${isDarkMode ? 'bg-teal-900/30' : 'bg-teal-100'}`}>
                    <div className={`w-2 h-2 rounded-full ${isDarkMode ? 'bg-teal-400' : 'bg-teal-500'}`}></div>
                  </div>
                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {tip}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Doctor Availability */}
          <div className={`relative rounded-2xl p-5 backdrop-blur-xl border-2 overflow-hidden ${
            isDarkMode
              ? 'bg-gradient-to-br from-gray-950/40 via-gray-900/30 to-gray-950/40 border-blue-800/30'
              : 'bg-gradient-to-br from-white/90 via-white/80 to-white/90 border-blue-200/50'
          }`}>
            <h3 className={`text-lg font-bold mb-3 flex items-center gap-2 ${
              isDarkMode ? 'text-blue-300' : 'text-blue-600'
            }`}>
              <Clock className="w-5 h-5" />
              Doctor Availability
            </h3>
            <div className="space-y-3">
              {doctors.length > 0 ? doctors.map((doc, idx) => {
                const colors = ['emerald', 'blue', 'purple', 'teal', 'cyan'];
                const docColor = colors[idx % colors.length];
                return (
                  <div key={doc._id} className="flex items-center justify-between">
                    <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {doc.name}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full backdrop-blur-sm ${
                      isDarkMode 
                        ? getColorClass(docColor, 'darkBg') + ' ' + getColorClass(docColor, 'darkText')
                        : getColorClass(docColor, 'bg') + ' ' + getColorClass(docColor, 'text')
                    }`}>
                      {doc.specialization || 'General'}
                    </span>
                  </div>
                );
              }) : (
                <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>No doctors found</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ===== Upcoming Appointments Section ===== */}
      <div className={`relative rounded-3xl p-6 backdrop-blur-xl border-2 overflow-hidden transition-all duration-500 ${
        isDarkMode
          ? 'bg-gradient-to-br from-gray-950/40 via-gray-900/30 to-gray-950/40 border-green-800/30'
          : 'bg-gradient-to-br from-white/90 via-white/80 to-white/90 border-green-200/50'
      }`}>
        <h3 className={`text-xl font-bold mb-5 flex items-center gap-2 ${
          isDarkMode ? 'text-green-300' : 'text-green-600'
        }`}>
          <CalendarDays className="w-6 h-6" />
          Your Upcoming Appointments
          {appointments.length > 0 && (
            <span className={`text-xs ml-2 px-2.5 py-1 rounded-full font-medium ${
              isDarkMode ? 'bg-green-900/40 text-green-300' : 'bg-green-100 text-green-700'
            }`}>
              {appointments.length}
            </span>
          )}
        </h3>

        {appointmentsLoading ? (
          <div className="flex items-center justify-center py-10">
            <div className="w-8 h-8 border-3 border-green-500/30 border-t-green-500 rounded-full animate-spin"></div>
          </div>
        ) : appointments.length === 0 ? (
          <div className={`text-center py-10 rounded-2xl border-2 border-dashed ${
            isDarkMode ? 'border-gray-700/50 text-gray-500' : 'border-gray-200 text-gray-400'
          }`}>
            <Calendar className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p className="text-base font-medium mb-1">No upcoming appointments</p>
            <p className="text-sm opacity-70">Book a consultation above to get started</p>
          </div>
        ) : (
          <div className="space-y-3">
            {appointments.map((appt, idx) => {
              const apptDate = new Date(appt.date);
              const dateStr = apptDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
              const statusColors = {
                scheduled: isDarkMode ? 'bg-amber-900/30 text-amber-300 border-amber-700/30' : 'bg-amber-50 text-amber-700 border-amber-200',
                confirmed: isDarkMode ? 'bg-emerald-900/30 text-emerald-300 border-emerald-700/30' : 'bg-emerald-50 text-emerald-700 border-emerald-200',
                completed: isDarkMode ? 'bg-blue-900/30 text-blue-300 border-blue-700/30' : 'bg-blue-50 text-blue-700 border-blue-200',
                cancelled: isDarkMode ? 'bg-red-900/30 text-red-300 border-red-700/30' : 'bg-red-50 text-red-700 border-red-200',
              };
              const statusClass = statusColors[appt.status] || statusColors.scheduled;

              return (
                <div key={appt._id || idx} className={`p-4 rounded-2xl border transition-all duration-300 ${
                  isDarkMode
                    ? 'bg-gray-800/40 border-gray-700/50 hover:border-green-700/40'
                    : 'bg-white/70 border-gray-200/60 hover:border-green-300/60'
                }`}>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 min-w-0">
                      {/* Date badge */}
                      <div className={`flex-shrink-0 w-14 h-14 rounded-xl flex flex-col items-center justify-center ${
                        isDarkMode ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-700'
                      }`}>
                        <span className="text-xs font-medium uppercase">{apptDate.toLocaleDateString('en-US', { month: 'short' })}</span>
                        <span className="text-lg font-bold leading-tight">{apptDate.getDate()}</span>
                      </div>
                      {/* Details */}
                      <div className="min-w-0">
                        <h4 className={`font-bold text-base truncate ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                          {appt.doctorName || 'Doctor'}
                        </h4>
                        <div className="flex items-center gap-3 mt-1 flex-wrap">
                          <span className={`text-sm flex items-center gap-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            <Clock className="w-3.5 h-3.5" />
                            {appt.timeSlot}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${
                            isDarkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {appt.type || 'video'}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize border ${statusClass}`}>
                            {appt.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      {/* Footer */}
      <BeautifulFooter isDarkMode={isDarkMode} setActiveModule={setActiveModule} />
    </div>
  );
};

export default TelemedicineSchedule;
