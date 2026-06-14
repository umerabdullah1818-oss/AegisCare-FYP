import React, { useState } from 'react';
import { Users, History, Calendar, MessageCircle, Pill, Download, FileText, ClipboardCheck, FolderOpen } from 'lucide-react';
import api from '../../../../services/api';
import { generatePatientPDF } from '../pdfGenerator';
import { getColorClass } from '../helpers';
import GlassCard from './GlassCard';
import GlowingButton from './GlowingButton';
import AnimatedCard from './AnimatedCard';
import BeautifulFooter from './BeautifulFooter';

const MedicalHistory = ({ isDarkMode, patients, showToast, setActiveModule }) => {
    const [selectedPatientId, setSelectedPatientId] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('all');

    const categories = ['all', 'appointments', 'medications'];

    // Get selected patient data
    const selectedPatient = patients.find(p => p.id === selectedPatientId);
    const raw = selectedPatient?.raw || {};

    // Build dynamic timeline from selected patient's data
    const buildTimeline = () => {
      if (!selectedPatient) return [];
      const items = [];

      if (raw.appointments && raw.appointments.length > 0) {
        raw.appointments.forEach(appt => {
          items.push({
            date: new Date(appt.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            event: `${(appt.type || 'consultation').charAt(0).toUpperCase() + (appt.type || 'consultation').slice(1)} Appointment`,
            type: 'appointment',
            doctor: appt.doctorName || 'Doctor',
            status: appt.status,
            notes: appt.notes || `${appt.timeSlot || ''} — Status: ${appt.status}`,
            rawDate: new Date(appt.date),
            details: appt
          });
        });
      }

      if (raw.consultations && raw.consultations.length > 0) {
        raw.consultations.forEach(c => {
          items.push({
            date: new Date(c.requestedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            event: c.type || 'General Consultation',
            type: 'consultation',
            doctor: 'Consulting Physician',
            status: c.status,
            notes: c.notes || `${c.priority || 'Normal'} priority — ${c.status}`,
            rawDate: new Date(c.requestedAt),
            details: c
          });
        });
      }

      if (raw.medications && raw.medications.length > 0) {
        raw.medications.forEach(med => {
          items.push({
            date: new Date(med.startDate || med.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            event: `Medication: ${med.name}`,
            type: 'medication',
            doctor: med.prescribedBy || 'Prescriber',
            status: med.approvalStatus,
            notes: `${med.dosage} — ${med.frequency} at ${med.scheduledTime}. ${med.notes || ''}`.trim(),
            rawDate: new Date(med.startDate || med.createdAt),
            details: med
          });
        });
      }

      items.sort((a, b) => b.rawDate - a.rawDate);

      if (selectedCategory !== 'all') {
        const catMap = { appointments: 'appointment', consultations: 'consultation', medications: 'medication' };
        return items.filter(item => item.type === catMap[selectedCategory]);
      }
      return items;
    };

    const timeline = buildTimeline();

    // Compute dynamic health summary
    const healthSummary = selectedPatient ? [
      { label: 'Medical Conditions', value: (raw.medications || []).length > 0 ? [...new Set((raw.medications || []).map(m => m.type))].length : 0, color: 'rose' },
      { label: 'Active Medications', value: (raw.medications || []).filter(m => m.isActive).length, color: 'blue' },
      { label: 'Total Appointments', value: (raw.appointments || []).length, color: 'amber' },
      { label: 'Consultations', value: (raw.consultations || []).length, color: 'emerald' },
      { label: 'Completed Visits', value: (raw.appointments || []).filter(a => a.status === 'completed').length, color: 'purple' },
    ] : [
      { label: 'Select a patient', value: '—', color: 'blue' },
    ];

    // Build documents from patient data
    const buildDocuments = () => {
      if (!selectedPatient) return [];
      const docs = [];
      (raw.medications || []).forEach((med, i) => {
        docs.push({
          name: `Prescription_${med.name}.pdf`,
          date: new Date(med.startDate || med.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          type: 'prescription'
        });
      });
      (raw.appointments || []).slice(0, 4).forEach((appt, i) => {
        docs.push({
          name: `${(appt.type || 'visit').charAt(0).toUpperCase() + (appt.type || 'visit').slice(1)}_Report_${i + 1}.pdf`,
          date: new Date(appt.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          type: 'report'
        });
      });
      return docs.slice(0, 8);
    };

    return (
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <GlassCard color="indigo" hoverable={false} darkMode={isDarkMode}>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex-1">
              <h1 className={`text-3xl font-bold mb-2 bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent`}>
                Medical History
              </h1>
              <p className={`text-lg ${isDarkMode ? 'text-indigo-200/80' : 'text-indigo-700/80'}`}>
                Comprehensive patient medical records and history
              </p>
            </div>
            <div className="flex gap-3">
              {selectedPatient && (
                <GlowingButton 
                  icon={<Download className="w-4 h-4" />}
                  color="blue"
                  size="md"
                  onClick={() => {
                    generatePatientPDF(selectedPatient, isDarkMode);
                    showToast(`PDF generated for ${selectedPatient.name}`, 'success');
                  }}
                >
                  Export PDF
                </GlowingButton>
              )}
            </div>
          </div>
        </GlassCard>

        {/* Patient Selector */}
        <GlassCard color="indigo" darkMode={isDarkMode}>
          <h3 className={`text-xl font-bold mb-6 flex items-center gap-2 ${
            isDarkMode ? 'text-indigo-300' : 'text-indigo-600'
          }`}>
            <Users className="w-6 h-6 animate-pulse" />
            Select Patient
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {patients.map((patient, idx) => (
              <button
                key={patient.id}
                onClick={() => setSelectedPatientId(patient.id)}
                className={`p-3 rounded-xl border transition-all duration-300 hover:scale-105 ${
                  selectedPatientId === patient.id
                    ? isDarkMode
                      ? 'bg-indigo-600 border-indigo-500'
                      : 'bg-indigo-500 border-indigo-400'
                    : isDarkMode
                    ? 'bg-gray-800/40 border-gray-700'
                    : 'bg-white/50 border-gray-200'
                } ${selectedPatientId === patient.id ? 'text-white' : isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
              >
                <div className="text-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 ${
                    isDarkMode ? getColorClass(patient.color, 'darkBg') : getColorClass(patient.color, 'bg')
                  }`}>
                    <span className={isDarkMode ? getColorClass(patient.color, 'darkText') : getColorClass(patient.color, 'text')}>
                      {patient.image.charAt(0)}
                    </span>
                  </div>
                  <div className="text-sm font-medium truncate">{patient.name.split(' ')[0]}</div>
                </div>
              </button>
            ))}
          </div>
        </GlassCard>

        {/* Categories */}
        <div className="flex gap-2 flex-wrap">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 capitalize ${
                selectedCategory === category
                  ? isDarkMode
                    ? 'bg-indigo-600 text-white'
                    : 'bg-indigo-500 text-white'
                  : isDarkMode
                  ? 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Medical Records Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Timeline View */}
          <GlassCard color="indigo" darkMode={isDarkMode} className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-xl font-bold flex items-center gap-2 ${
                isDarkMode ? 'text-indigo-300' : 'text-indigo-600'
              }`}>
                <History className="w-6 h-6 animate-pulse" />
                Medical Timeline {selectedPatient ? `— ${selectedPatient.name}` : ''}
              </h3>
              {selectedPatient && (
                <button
                  onClick={() => {
                    generatePatientPDF(selectedPatient, isDarkMode);
                    showToast(`PDF generated for ${selectedPatient.name}`, 'success');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-all duration-300 hover:scale-105 ${
                    isDarkMode ? 'bg-indigo-600 hover:bg-indigo-500 text-white' : 'bg-indigo-500 hover:bg-indigo-600 text-white'
                  }`}
                >
                  <Download className="w-3.5 h-3.5" /> PDF
                </button>
              )}
            </div>
            <div className="space-y-4">
              {!selectedPatient ? (
                <div className={`text-center py-12 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  <Users className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p className="text-lg font-medium mb-2">Select a Patient</p>
                  <p className="text-sm">Choose a patient above to view their medical timeline.</p>
                </div>
              ) : timeline.length === 0 ? (
                <div className={`text-center py-12 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  <History className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p className="text-lg font-medium mb-2">No Records Found</p>
                  <p className="text-sm">No medical history records available for this patient{selectedCategory !== 'all' ? ` in the "${selectedCategory}" category` : ''}.</p>
                </div>
              ) : (
                timeline.map((record, idx) => (
                  <AnimatedCard key={idx} delay={idx}>
                    <div className={`p-4 rounded-xl border-l-4 transition-all duration-300 hover:scale-[1.02] ${
                      record.type === 'appointment' ? 'border-emerald-500' :
                      record.type === 'consultation' ? 'border-purple-500' :
                      'border-cyan-500'
                    } ${isDarkMode ? 'bg-gray-800/40' : 'bg-white/50'}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <div className={`p-1.5 rounded-lg ${
                              record.type === 'appointment' ? (isDarkMode ? 'bg-emerald-900/30 text-emerald-400' : 'bg-emerald-100 text-emerald-600') :
                              record.type === 'consultation' ? (isDarkMode ? 'bg-purple-900/30 text-purple-400' : 'bg-purple-100 text-purple-600') :
                              isDarkMode ? 'bg-cyan-900/30 text-cyan-400' : 'bg-cyan-100 text-cyan-600'
                            }`}>
                              {record.type === 'appointment' ? <Calendar className="w-4 h-4" /> :
                               record.type === 'consultation' ? <MessageCircle className="w-4 h-4" /> :
                               <Pill className="w-4 h-4" />}
                            </div>
                            <h4 className={`font-bold text-lg ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                              {record.event}
                            </h4>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              record.status === 'completed' || record.status === 'approved'
                                ? isDarkMode ? 'bg-emerald-900/30 text-emerald-300' : 'bg-emerald-100 text-emerald-700'
                                : record.status === 'cancelled' || record.status === 'rejected'
                                ? isDarkMode ? 'bg-rose-900/30 text-rose-300' : 'bg-rose-100 text-rose-700'
                                : isDarkMode ? 'bg-amber-900/30 text-amber-300' : 'bg-amber-100 text-amber-700'
                            }`}>
                              {record.status?.charAt(0).toUpperCase() + record.status?.slice(1)}
                            </span>
                          </div>
                          <p className={`text-sm mb-2 ml-9 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{record.notes}</p>
                          <div className="flex items-center gap-4 ml-9">
                            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              📅 {record.date}
                            </span>
                            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              👨‍⚕️ {record.doctor}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              generatePatientPDF(selectedPatient, isDarkMode);
                              showToast('PDF exported', 'success');
                            }}
                            className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 flex items-center gap-1 ${
                              isDarkMode ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-blue-100 hover:bg-blue-200 text-blue-700'
                            }`}
                          >
                            <Download className="w-3 h-3" /> PDF
                          </button>
                        </div>
                      </div>
                    </div>
                  </AnimatedCard>
                ))
              )}
            </div>
          </GlassCard>

          {/* Summary Stats */}
          <GlassCard color="violet" darkMode={isDarkMode}>
            <h3 className={`text-xl font-bold mb-6 flex items-center gap-2 ${
              isDarkMode ? 'text-violet-300' : 'text-violet-600'
            }`}>
              <ClipboardCheck className="w-6 h-6 animate-pulse" />
              Health Summary
            </h3>
            <div className="space-y-4">
              {healthSummary.map((stat, idx) => (
                <div key={idx} className={`p-3 rounded-xl transition-all duration-300 hover:scale-105 ${
                  isDarkMode ? 'bg-gray-800/40' : 'bg-white/50'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {stat.label}
                    </span>
                    <span className={`text-lg font-bold ${
                      stat.color === 'rose' ? 'text-rose-500' :
                      stat.color === 'blue' ? 'text-blue-500' :
                      stat.color === 'amber' ? 'text-amber-500' :
                      stat.color === 'emerald' ? 'text-emerald-500' :
                      'text-purple-500'
                    }`}>
                      {stat.value}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Documents */}
        <GlassCard color="indigo" darkMode={isDarkMode}>
          <h3 className={`text-xl font-bold mb-6 flex items-center gap-2 ${
            isDarkMode ? 'text-indigo-300' : 'text-indigo-600'
          }`}>
            <FolderOpen className="w-6 h-6 animate-pulse" />
            Medical Documents {selectedPatient ? `— ${selectedPatient.name}` : ''}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {!selectedPatient ? (
              <div className={`col-span-full text-center py-8 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">Select a patient to view their documents.</p>
              </div>
            ) : buildDocuments().length === 0 ? (
              <div className={`col-span-full text-center py-8 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No documents available for this patient.</p>
              </div>
            ) : (
              buildDocuments().map((doc, idx) => (
                <AnimatedCard key={idx} delay={idx}>
                  <div className={`p-4 rounded-xl border transition-all duration-300 hover:scale-105 ${
                    isDarkMode ? 'bg-gray-800/40 border-gray-700' : 'bg-white/50 border-gray-200'
                  }`}>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${
                      isDarkMode ? 'bg-indigo-950/30' : 'bg-indigo-100'
                    }`}>
                      <FileText className={`w-6 h-6 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
                    </div>
                    <h4 className={`font-bold mb-2 text-sm ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                      {doc.name}
                    </h4>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {doc.date}
                      </span>
                      <button
                        onClick={() => {
                          generatePatientPDF(selectedPatient, isDarkMode);
                          showToast('Document exported as PDF', 'success');
                        }}
                        className={`text-xs px-2 py-1 rounded-lg font-medium transition-all hover:scale-105 ${
                          isDarkMode ? 'bg-indigo-600 hover:bg-indigo-500 text-white' : 'bg-indigo-100 hover:bg-indigo-200 text-indigo-700'
                        }`}
                      >
                        Download
                      </button>
                    </div>
                  </div>
                </AnimatedCard>
              ))
            )}
          </div>
        </GlassCard>

        <BeautifulFooter isDarkMode={isDarkMode} setActiveModule={setActiveModule} />
      </div>
    );
};

export default MedicalHistory;
