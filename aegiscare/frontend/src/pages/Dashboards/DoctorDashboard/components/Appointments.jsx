import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Calendar, Plus, Check, ChevronDown, X, CalendarClock } from 'lucide-react';
import api from '../../../../services/api';
import GlassCard from './GlassCard';
import GlowingButton from './GlowingButton';
import AnimatedCard from './AnimatedCard';
import BeautifulFooter from './BeautifulFooter';

const Appointments = ({ isDarkMode, appointments, patients, fetchAppointments, showToast, setActiveModule }) => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [view, setView] = useState('day');
    const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState(false);
    const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
    const [selectedAppt, setSelectedAppt] = useState(null);
    const [newAppointmentForm, setNewAppointmentForm] = useState({
      patientId: '',
      date: new Date().toISOString().split('T')[0],
      timeSlot: '09:00 AM',
      type: 'video',
      notes: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const now = new Date();
    const isSameDay = (d1, d2) => 
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate();

    const upcomingAppointments = [...appointments]
      .filter(a => new Date(a.dateObj) > now || (isSameDay(new Date(a.dateObj), now) && a.time > now.toTimeString().slice(0,5)))
      .sort((a, b) => new Date(a.dateObj) - new Date(b.dateObj))
      .slice(0, 5);

    const handleRescheduleAppointment = async (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsSubmitting(true);
      try {
        const res = await api.put(`/appointments/${selectedAppt.id}`, {
          date: newAppointmentForm.date,
          timeSlot: newAppointmentForm.timeSlot
        });
        if (res.data && res.data.success) {
          showToast('Appointment rescheduled successfully!', 'success');
          setIsRescheduleModalOpen(false);
          fetchAppointments();
          setSelectedAppt(null);
        } else {
          showToast(res.data?.message || 'Failed to reschedule', 'error');
        }
      } catch (err) {
        console.error('Failed to reschedule:', err);
        showToast(err.response?.data?.message || err.message || 'Server connection error', 'error');
      } finally {
        setIsSubmitting(false);
      }
    };

    const handleCreateAppointment = async (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsSubmitting(true);
      try {
        const res = await api.post('/appointments', {
          patientId: newAppointmentForm.patientId,
          date: newAppointmentForm.date,
          timeSlot: newAppointmentForm.timeSlot,
          type: newAppointmentForm.type,
          notes: newAppointmentForm.notes
        });
        if (res.data && res.data.success) {
          showToast('Appointment scheduled successfully!', 'success');
          setIsNewAppointmentOpen(false);
          fetchAppointments();
          setNewAppointmentForm({
            patientId: '',
            date: new Date().toISOString().split('T')[0],
            timeSlot: '09:00 AM',
            type: 'video',
            notes: ''
          });
        } else {
          showToast(res.data?.message || 'Failed to create appointment', 'error');
        }
      } catch (err) {
        console.error('Failed to create appointment:', err);
        showToast(err.response?.data?.message || err.message || 'Server connection error', 'error');
      } finally {
        setIsSubmitting(false);
      }
    };

    const calendarDays = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() + i);
      return date;
    });

    return (
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <GlassCard color="purple" hoverable={false} darkMode={isDarkMode}>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex-1">
              <h1 className={`text-3xl font-bold mb-2 bg-gradient-to-r from-purple-500 to-violet-500 bg-clip-text text-transparent`}>
                Appointments Schedule
              </h1>
              <p className={`text-lg ${isDarkMode ? 'text-purple-200/80' : 'text-purple-700/80'}`}>
                Manage your daily appointments and patient consultations
              </p>
            </div>
            <div className="flex gap-3">
              <GlowingButton 
                icon={<Plus className="w-4 h-4" />}
                color="purple"
                size="md"
                onClick={() => setIsNewAppointmentOpen(true)}
              >
                New Appointment
              </GlowingButton>
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                isDarkMode ? 'bg-purple-950/40 border border-purple-900/30' : 'bg-gradient-to-r from-purple-100 to-violet-100 border border-purple-200'
              }`}>
                <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div>
                <span className={`text-sm font-medium ${isDarkMode ? 'text-purple-300' : 'text-purple-700'}`}>
                  Today: {appointments.length} appointments
                </span>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Calendar View */}
        <GlassCard color="purple" darkMode={isDarkMode}>
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-xl font-bold flex items-center gap-2 ${
              isDarkMode ? 'text-purple-300' : 'text-purple-600'
            }`}>
              <Calendar className="w-6 h-6 animate-pulse" />
              Weekly Schedule
            </h3>
            <div className="flex gap-2">
              {['day', 'week', 'month'].map((viewOption) => (
                <button
                  key={viewOption}
                  onClick={() => setView(viewOption)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 capitalize ${
                    view === viewOption
                      ? isDarkMode
                        ? 'bg-purple-600 text-white'
                        : 'bg-purple-500 text-white'
                      : isDarkMode
                      ? 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {viewOption}
                </button>
              ))}
            </div>
          </div>

          {/* Calendar Views */}
          {view === 'day' && (
            <>
              <div className="grid grid-cols-7 gap-2 mb-6">
                {calendarDays.map((dateObj, idx) => {
                  const dayStr = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dateObj.getDay()];
                  return (
                  <div key={idx} className="text-center cursor-pointer" onClick={() => setSelectedDate(dateObj)}>
                    <div className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {dayStr}
                    </div>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto transition-all duration-300 ${
                      dateObj.toDateString() === selectedDate.toDateString()
                        ? isDarkMode
                          ? 'bg-purple-600 text-white'
                          : 'bg-purple-500 text-white'
                        : isDarkMode
                        ? 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}>
                      {dateObj.getDate()}
                    </div>
                  </div>
                  );
                })}
              </div>

              <div className="space-y-3">
                {['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'].map((time) => {
                  const selectedDateAppointments = appointments.filter(a => a.dateObj.toDateString() === selectedDate.toDateString());
                  
                  const hour = parseInt(time.split(':')[0]);
                  const ampm = hour >= 12 ? 'PM' : 'AM';
                  const standardHour = hour > 12 ? hour - 12 : hour;
                  const displayHour = standardHour < 10 ? `0${standardHour}` : `${standardHour}`;
                  const formattedTime = `${displayHour}:00 ${ampm}`;
                  
                  const appointment = selectedDateAppointments.find(appt => {
                    if (!appt.time) return false;
                    return appt.time === formattedTime || 
                           appt.time === time || 
                           (appt.time.includes(standardHour.toString()) && appt.time.includes(ampm));
                  });
                  
                  return (
                    <div key={time} className="flex items-center gap-4">
                      <div className={`w-20 text-right ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {time}
                      </div>
                      <div className="flex-1">
                        {appointment ? (
                          <div className={`p-4 rounded-xl border-2 transition-all duration-300 hover:scale-[1.02] ${
                            isDarkMode ? 'bg-gray-800/40 border-purple-700/30' : 'bg-white/50 border-purple-200'
                          }`}>
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className={`font-bold text-lg mb-1 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                                  {appointment.patient}
                                </h4>
                                <div className="flex items-center gap-3">
                                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    ⏰ {appointment.time} • {appointment.duration}
                                  </span>
                                  <span className={`text-xs px-2 py-1 rounded-full ${
                                    appointment.status === 'Confirmed' 
                                      ? isDarkMode ? 'bg-emerald-900/30 text-emerald-300' : 'bg-emerald-100 text-emerald-700'
                                      : isDarkMode ? 'bg-amber-900/30 text-amber-300' : 'bg-amber-100 text-amber-700'
                                  }`}>
                                    {appointment.status}
                                  </span>
                                  <span className={`text-xs px-2 py-1 rounded-full ${
                                    appointment.priority === 'high'
                                      ? isDarkMode ? 'bg-rose-900/30 text-rose-300' : 'bg-rose-100 text-rose-700'
                                      : appointment.priority === 'medium'
                                      ? isDarkMode ? 'bg-amber-900/30 text-amber-300' : 'bg-amber-100 text-amber-700'
                                      : isDarkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-700'
                                  }`}>
                                    {appointment.priority}
                                  </span>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <button 
                                  onClick={(e) => { e.stopPropagation(); showToast(`Moving to Reschedule flow for ${appointment.patient}`, 'success'); }}
                                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 ${
                                  isDarkMode
                                    ? 'bg-purple-900/30 hover:bg-purple-800/30 text-purple-300'
                                    : 'bg-purple-100 hover:bg-purple-200 text-purple-700'
                                }`}>
                                  Reschedule
                                </button>
                                <button 
                                  onClick={(e) => { e.stopPropagation(); showToast(`Starting session with ${appointment.patient}`, 'success'); }}
                                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 ${
                                  isDarkMode
                                    ? 'bg-emerald-900/30 hover:bg-emerald-800/30 text-emerald-300'
                                    : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-700'
                                }`}>
                                  Start
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div 
                            onClick={() => {
                              const localDate = new Date(selectedDate.getTime() - (selectedDate.getTimezoneOffset() * 60000));
                              const hour = parseInt(time.split(':')[0]);
                              const ampm = hour >= 12 ? 'PM' : 'AM';
                              const standardHour = hour > 12 ? hour - 12 : hour;
                              const displayHour = standardHour < 10 ? `0${standardHour}` : `${standardHour}`;
                              const formattedTime = `${displayHour}:00 ${ampm}`;
                              
                              setNewAppointmentForm(prev => ({
                                ...prev,
                                date: localDate.toISOString().split('T')[0],
                                timeSlot: formattedTime,
                              }));
                              setIsNewAppointmentOpen(true);
                            }}
                            className={`p-4 rounded-xl border border-dashed cursor-pointer transition-all hover:-translate-y-1 ${
                            isDarkMode ? 'border-gray-800 hover:border-purple-800 hover:bg-purple-900/10' : 'border-gray-300 hover:border-purple-300 hover:bg-purple-50'
                          }`}>
                            <div className={`text-center font-medium ${isDarkMode ? 'text-gray-500 hover:text-purple-400' : 'text-gray-500 hover:text-purple-600'}`}>
                              + Click to book available slot
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {view === 'week' && (
            <div className="space-y-4">
              {calendarDays.map((dateObj, idx) => {
                const dayAppts = appointments.filter(a => a.dateObj.toDateString() === dateObj.toDateString());
                const isSelected = dateObj.toDateString() === selectedDate.toDateString();
                return (
                  <div key={idx} className={`p-4 rounded-xl border ${
                    isSelected ? (isDarkMode ? 'border-purple-600 bg-purple-900/10' : 'border-purple-400 bg-purple-50')
                    : (isDarkMode ? 'border-gray-800 bg-gray-800/20' : 'border-gray-200 bg-gray-50')
                  }`}>
                    <h4 className={`font-bold mb-3 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                      {dateObj.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
                    </h4>
                    {dayAppts.length > 0 ? (
                      <div className="space-y-2">
                        {dayAppts.map(appt => (
                          <div key={appt.id} className={`flex items-center justify-between p-3 rounded-lg ${
                            isDarkMode ? 'bg-gray-800' : 'bg-white shadow-sm'
                          }`}>
                            <div className="flex items-center gap-3">
                              <div className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{appt.patient}</div>
                              <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                ⏰ {appt.time} • {appt.type}
                              </div>
                            </div>
                            <div className={`text-xs px-2 py-1 rounded-full ${
                              appt.status === 'Confirmed' ? (isDarkMode ? 'bg-emerald-900/30 text-emerald-300' : 'bg-emerald-100 text-emerald-700') :
                              (isDarkMode ? 'bg-amber-900/30 text-amber-300' : 'bg-amber-100 text-amber-700')
                            }`}>
                              {appt.status}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className={`text-sm italic ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>No appointments scheduled</div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {view === 'month' && (
            <div className="grid grid-cols-7 gap-1 lg:gap-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                <div key={d} className={`text-center font-bold text-sm py-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{d}</div>
              ))}
              {(() => {
                const today = new Date();
                const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
                const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
                const startingDay = firstDay.getDay(); 
                const daysInMonth = lastDay.getDate();
                
                const blanks = Array.from({ length: startingDay }, (_, i) => i);
                const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

                return (
                  <>
                    {blanks.map(blank => (
                      <div key={`blank-${blank}`} className="p-1 lg:p-2 h-24 opacity-0"></div>
                    ))}
                    {days.map(day => {
                      const thisDate = new Date(today.getFullYear(), today.getMonth(), day);
                      const isToday = thisDate.toDateString() === today.toDateString();
                      const dayAppts = appointments.filter(a => a.dateObj.toDateString() === thisDate.toDateString());
                      
                      return (
                        <div 
                          key={day} 
                          onClick={() => { setSelectedDate(thisDate); setView('day'); }} 
                          className={`p-1 lg:p-2 h-20 lg:h-24 rounded-lg border flex flex-col cursor-pointer transition-all hover:scale-[1.02] ${
                            isToday 
                              ? (isDarkMode ? 'border-purple-500 bg-purple-900/20' : 'border-purple-400 bg-purple-50')
                              : (isDarkMode ? 'border-gray-800 bg-gray-900/50 hover:bg-gray-800' : 'border-gray-200 bg-white hover:bg-gray-50')
                        }`}>
                          <div className={`text-xs font-bold mb-1 ${isToday ? 'text-purple-500' : (isDarkMode ? 'text-gray-400' : 'text-gray-600')}`}>{day}</div>
                          <div className="flex-1 overflow-y-auto space-y-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                            {dayAppts.map((appt, i) => (
                              <div key={i} className={`text-[10px] leading-tight p-1 rounded truncate ${
                                isDarkMode ? 'bg-purple-900/40 text-purple-200' : 'bg-purple-100 text-purple-700'
                              }`}>
                                {appt.time} {appt.patient}
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </>
                );
              })()}
            </div>
          )}
        </GlassCard>

        {/* Upcoming Appointments */}
        <GlassCard color="indigo" darkMode={isDarkMode}>
          <h3 className={`text-xl font-bold mb-6 flex items-center gap-2 ${
            isDarkMode ? 'text-indigo-300' : 'text-indigo-600'
          }`}>
            <CalendarClock className="w-6 h-6 animate-pulse" />
            Upcoming Appointments
          </h3>
          <div className="space-y-3">
            {appointments.map((appt, idx) => (
                <div key={appt.id} className={`p-4 rounded-xl border ${
                  isDarkMode ? 'bg-gray-800/40 border-gray-700' : 'bg-white/50 border-gray-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className={`font-bold text-lg mb-1 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                        {appt.patient}
                      </h4>
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          📅 {appt.dateObj ? new Date(appt.dateObj).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                        </span>
                        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          ⏰ {appt.time} • {appt.type}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          appt.status === 'Confirmed' 
                            ? isDarkMode ? 'bg-emerald-900/30 text-emerald-300' : 'bg-emerald-100 text-emerald-700'
                            : isDarkMode ? 'bg-amber-900/30 text-amber-300' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {appt.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
            ))}
          </div>
        </GlassCard>

        <BeautifulFooter isDarkMode={isDarkMode} setActiveModule={setActiveModule} />

        {/* New Appointment Modal */}
        {isNewAppointmentOpen && createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className={`w-full max-w-md p-6 rounded-2xl shadow-2xl ${
              isDarkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200'
            }`}>
              <div className="flex justify-between items-center mb-6">
                <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  New Appointment
                </h3>
                <button onClick={() => setIsNewAppointmentOpen(false)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800">
                  <X className="w-5 h-5" />
                </button>
              </div>
              {(() => {
                const CustomSelect = ({ label, value, onChange, options, required }) => {
                  const [isOpen, setIsOpen] = useState(false);
                  const dropdownRef = useRef(null);

                  useEffect(() => {
                    const handleClickOutside = (event) => {
                      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                        setIsOpen(false);
                      }
                    };
                    document.addEventListener('mousedown', handleClickOutside);
                    return () => document.removeEventListener('mousedown', handleClickOutside);
                  }, []);

                  const selectedOption = options.find(opt => opt.value === value);

                  return (
                    <div className="relative mb-4" ref={dropdownRef}>
                      <label className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {label} {required && <span className="text-rose-500">*</span>}
                      </label>
                      <div 
                        onClick={() => setIsOpen(!isOpen)}
                        className={`w-full p-2.5 rounded-lg border cursor-pointer flex justify-between items-center transition-all ${
                          isOpen ? (isDarkMode ? 'border-purple-500 ring-2 ring-purple-500/20' : 'border-purple-400 ring-2 ring-purple-100') : (isDarkMode ? 'bg-gray-800 border-gray-700 text-white hover:border-gray-600' : 'bg-white border-gray-300 hover:border-gray-400')
                        }`}
                      >
                        <span className={!value ? 'text-gray-400' : (isDarkMode ? 'text-gray-100' : 'text-gray-900')}>
                          {selectedOption ? selectedOption.label : `Select ${label}...`}
                        </span>
                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180 text-purple-500' : (isDarkMode ? 'text-gray-400' : 'text-gray-500')}`} />
                      </div>
                      
                      {isOpen && (
                        <div className={`absolute z-50 w-full mt-2 rounded-xl border shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)] max-h-56 overflow-y-auto ${
                          isDarkMode ? 'bg-gray-800 border-gray-700 scrollbar-dark' : 'bg-white border-gray-100 scrollbar-light'
                        }`} style={{ animation: 'fade-in 0.15s ease-out' }}>
                          <div className="p-1">
                            {options.map((opt, i) => (
                              <div 
                                key={i}
                                onClick={() => { onChange(opt.value); setIsOpen(false); }}
                                className={`px-4 py-2.5 my-0.5 rounded-lg cursor-pointer text-sm flex items-center justify-between transition-colors ${
                                  value === opt.value
                                    ? (isDarkMode ? 'bg-purple-500/20 text-purple-300 font-semibold' : 'bg-purple-50 text-purple-700 font-semibold')
                                    : (isDarkMode ? 'hover:bg-gray-700/50 text-gray-300' : 'hover:bg-gray-50 text-gray-700')
                                }`}
                              >
                                {opt.label}
                                {value === opt.value && <Check className="w-4 h-4" />}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                };

                return (
                  <form onSubmit={handleCreateAppointment} className="space-y-4">
                    <CustomSelect 
                      label="Patient"
                      required
                      value={newAppointmentForm.patientId}
                      onChange={(val) => setNewAppointmentForm({...newAppointmentForm, patientId: val})}
                      options={patients.map(p => ({ value: p.id, label: p.name }))}
                    />
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Date</label>
                  <input
                    type="date"
                    required
                    value={newAppointmentForm.date}
                    onChange={(e) => setNewAppointmentForm({...newAppointmentForm, date: e.target.value})}
                    className={`w-full p-2 rounded-lg border ${
                      isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300'
                    }`}
                  />
                </div>
                    <CustomSelect 
                      label="Time Slot"
                      required
                      value={newAppointmentForm.timeSlot}
                      onChange={(val) => setNewAppointmentForm({...newAppointmentForm, timeSlot: val})}
                      options={['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'].map(time => ({ value: time, label: time }))}
                    />

                    <CustomSelect 
                      label="Type"
                      value={newAppointmentForm.type}
                      onChange={(val) => setNewAppointmentForm({...newAppointmentForm, type: val})}
                      options={[
                        { value: 'video', label: 'Video Consultation' },
                        { value: 'in-person', label: 'In-Person Visit' }
                      ]}
                    />
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Notes</label>
                  <textarea
                    value={newAppointmentForm.notes}
                    onChange={(e) => setNewAppointmentForm({...newAppointmentForm, notes: e.target.value})}
                    className={`w-full p-2 rounded-lg border ${
                      isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300'
                    }`}
                    rows="2"
                   
                  ></textarea>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 rounded-lg font-medium bg-purple-600 hover:bg-purple-700 text-white transition-colors disabled:opacity-50"
                  style={{ marginTop: '1rem' }}
                >
                  {isSubmitting ? 'Scheduling...' : 'Schedule Appointment'}
                </button>
              </form>
              );
              })()}
            </div>
          </div>,
          document.body
        )}
      </div>
    );
};

export default Appointments;
