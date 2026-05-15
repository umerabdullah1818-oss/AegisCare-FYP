import React, { useState, useEffect, useRef } from 'react';
import { Pill, ChevronDown, Zap, FileSignature, Check } from 'lucide-react';
import api from '../../../../services/api';
import GlassCard from './GlassCard';
import AnimatedCard from './AnimatedCard';
import BeautifulFooter from './BeautifulFooter';

const Prescriptions = ({ isDarkMode, patients, prescriptions, fetchPatients, showToast, setActiveModule }) => {
    const [activeFilter, setActiveFilter] = useState('active');

    // Quick Prescribe State
    const [quickPrescribe, setQuickPrescribe] = useState({
      patientId: '',
      medication: '',
      dosage: '',
      frequency: 'Once daily',
      instructions: '',
      id: null
    });
    const [isEditing, setIsEditing] = useState(false);

    const [isPatientDropdownOpen, setIsPatientDropdownOpen] = useState(false);
    const [isFrequencyDropdownOpen, setIsFrequencyDropdownOpen] = useState(false);
    const patientDropdownRef = useRef(null);
    const frequencyDropdownRef = useRef(null);

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (patientDropdownRef.current && !patientDropdownRef.current.contains(event.target)) setIsPatientDropdownOpen(false);
        if (frequencyDropdownRef.current && !frequencyDropdownRef.current.contains(event.target)) setIsFrequencyDropdownOpen(false);
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleEditClick = (prescription) => {
      setIsEditing(true);
      setQuickPrescribe({
        patientId: prescription.patientId,
        medication: prescription.medication,
        dosage: prescription.dosage,
        frequency: prescription.frequency,
        instructions: prescription.notes || '',
        id: prescription.id
      });
      if (window.innerWidth < 1024) window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    };

    const handleGeneratePrescription = async (e) => {
      e.preventDefault();
      if (!quickPrescribe.patientId || !quickPrescribe.medication) {
        showToast('Please select a patient and enter a medication name', 'error');
        return;
      }
      
      const backendFrequencyMap = {
        'Once daily': 'daily',
        'Twice daily': 'twice-daily',
        'Weekly': 'weekly',
        'As needed': 'as-needed'
      };
      const apiFrequency = backendFrequencyMap[quickPrescribe.frequency] || 'daily';

      try {
        if (isEditing) {
          const res = await api.put(`/doctor/prescribe/${quickPrescribe.id}`, { 
             name: quickPrescribe.medication, 
             dosage: quickPrescribe.dosage, 
             frequency: apiFrequency, 
             notes: quickPrescribe.instructions 
          });
          if (res.data.success) {
            showToast('Prescription updated successfully!', 'success');
          }
        } else {
          const res = await api.post('/doctor/prescribe', { 
            patientId: quickPrescribe.patientId, 
            name: quickPrescribe.medication, 
            type: 'General',
            dosage: quickPrescribe.dosage, 
            frequency: apiFrequency, 
            scheduledTime: '08:00',
            notes: quickPrescribe.instructions 
          });
          if (res.data.success) {
            showToast('Prescription generated successfully!', 'success');
          }
        }
        
        await fetchPatients();
        setIsEditing(false);
        setQuickPrescribe({ patientId: '', medication: '', dosage: '', frequency: 'Once daily', instructions: '', id: null });
      } catch (err) {
        console.error('Prescription error:', err);
        const errorMessage = err.response?.data?.message || err.message || 'Unknown network error';
        showToast(isEditing ? `Failed to update: ${errorMessage}` : `Failed to generate: ${errorMessage}`, 'error');
      }
    };

    // Filter prescriptions based on active list
    const filteredPrescriptions = prescriptions.filter(p => {
      if (activeFilter === 'all') return true;
      if (activeFilter === 'refills' && p.refills > 0) return true;
      return p.status.toLowerCase() === activeFilter;
    });

    return (
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <GlassCard color="cyan" hoverable={false} darkMode={isDarkMode}>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex-1">
              <h1 className={`text-3xl font-bold mb-2 bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent`}>
                E-Prescriptions
              </h1>
              <p className={`text-lg ${isDarkMode ? 'text-cyan-200/80' : 'text-cyan-700/80'}`}>
                Digital prescription management and medication tracking
              </p>
            </div>
            <div className="flex gap-3 items-center">

              <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                isDarkMode ? 'bg-cyan-900/50 text-cyan-200' : 'bg-cyan-100 text-cyan-800'
              }`}>
                <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></div>
                <span className={`text-sm font-medium ${isDarkMode ? 'text-cyan-200' : 'text-cyan-800'}`}>
                  Active: {prescriptions.filter(p => p.status === 'Active').length} prescriptions
                </span>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Filters */}
        <div className="flex gap-2 flex-wrap mb-6">
          {['active', 'expired', 'refills', 'all'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 capitalize ${
                activeFilter === filter
                  ? isDarkMode
                    ? 'bg-cyan-600 text-white'
                    : 'bg-cyan-500 text-white'
                  : isDarkMode
                  ? 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Prescriptions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Active Prescriptions */}
          <GlassCard color="cyan" darkMode={isDarkMode}>
            <h3 className={`text-xl font-bold mb-6 flex items-center gap-2 ${
              isDarkMode ? 'text-cyan-300' : 'text-cyan-600'
            }`}>
              <Pill className="w-6 h-6 animate-pulse" />
              Active Prescriptions
            </h3>
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {filteredPrescriptions.length === 0 ? (
                <div className={`text-center py-8 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  <Pill className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">No prescriptions found for this filter.</p>
                </div>
              ) : (
                filteredPrescriptions.map((prescription, idx) => (
                  <AnimatedCard key={prescription.id || idx} delay={idx}>
                    <div className={`p-4 rounded-xl border transition-all duration-300 ${
                      isDarkMode ? 'bg-gray-800/40 border-gray-700' : 'bg-white/50 border-gray-200'
                    }`}>
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className={`font-bold text-lg mb-1 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                            {prescription.medication}
                          </h4>
                          <div className="flex items-center gap-3">
                            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              💊 {prescription.dosage} • {prescription.frequency}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              isDarkMode ? 'bg-emerald-900/30 text-emerald-300' : 'bg-emerald-100 text-emerald-700'
                            }`}>
                              {prescription.refills} refills
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {prescription.patient}
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            prescription.status === 'Active' 
                              ? isDarkMode ? 'bg-cyan-900/30 text-cyan-300' : 'bg-cyan-100 text-cyan-700'
                              : isDarkMode ? 'bg-gray-700/50 text-gray-300' : 'bg-gray-100 text-gray-600'
                          }`}>
                            {prescription.status}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleEditClick(prescription)}
                          className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 shadow-sm border ${
                          isDarkMode
                            ? 'bg-blue-900/30 border-blue-800 hover:bg-blue-800/50 text-blue-300'
                            : 'bg-blue-50 border-blue-200 hover:bg-blue-100 text-blue-700'
                        }`}>
                          Edit Details
                        </button>
                      </div>
                    </div>
                  </AnimatedCard>
                ))
              )}
            </div>
          </GlassCard>

          {/* Quick Prescribe form wrapper */}
          <form onSubmit={handleGeneratePrescription}>
            <GlassCard color="blue" darkMode={isDarkMode}>
              <div className="flex justify-between items-center mb-6">
                <h3 className={`text-xl font-bold flex items-center gap-2 ${
                  isDarkMode ? 'text-blue-300' : 'text-blue-600'
                }`}>
                  {isEditing ? <FileSignature className="w-6 h-6 animate-pulse" /> : <Zap className="w-6 h-6 animate-pulse" />}
                  {isEditing ? 'Edit Prescription' : 'Quick Prescribe'}
                </h3>
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => { setIsEditing(false); setQuickPrescribe({ patientId: '', medication: '', dosage: '', frequency: 'Once daily', instructions: '', id: null }); }}
                    className={`text-sm px-3 py-1.5 rounded-lg transition-all ${
                      isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
              <div className="space-y-4">
                {/* Patient Selector */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Select Patient
                  </label>
                  <div className="relative" ref={patientDropdownRef}>
                    <div 
                      onClick={() => setIsPatientDropdownOpen(!isPatientDropdownOpen)}
                      className={`w-full px-4 py-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        isPatientDropdownOpen 
                          ? (isDarkMode ? 'ring-2 ring-blue-500 border-blue-500 bg-gray-800 text-white' : 'ring-2 ring-blue-400 border-blue-400 bg-white text-gray-900')
                          : (isDarkMode ? 'bg-gray-800/80 border-gray-700 text-white hover:border-gray-500' : 'bg-white/80 border-gray-300 text-gray-900 hover:border-blue-400')
                      }`}
                    >
                      <span className={!quickPrescribe.patientId ? (isDarkMode ? 'text-gray-500' : 'text-gray-400') : ''}>
                        {quickPrescribe.patientId 
                          ? patients.find(p => p.id === quickPrescribe.patientId)?.name || 'Select a patient...'
                          : 'Select a patient...'}
                      </span>
                      <ChevronDown className={`w-5 h-5 transition-transform ${isPatientDropdownOpen ? 'rotate-180 text-blue-500' : 'text-gray-400'}`} />
                    </div>
                    {isPatientDropdownOpen && (
                      <div className={`absolute z-20 w-full mt-2 py-2 rounded-xl border shadow-xl max-h-60 overflow-y-auto ${
                        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
                      }`}>
                        {patients.map(patient => (
                          <div 
                            key={patient.id} 
                            onClick={() => { setQuickPrescribe({...quickPrescribe, patientId: patient.id}); setIsPatientDropdownOpen(false); }}
                            className={`px-4 py-2.5 cursor-pointer transition-colors ${
                              quickPrescribe.patientId === patient.id 
                                ? (isDarkMode ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-50 text-blue-700 font-medium')
                                : (isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50')
                            }`}
                          >
                            {patient.name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Medication Form */}
                <div className="space-y-3">
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Medication
                    </label>
                    <input 
                      type="text"
                      value={quickPrescribe.medication}
                      onChange={(e) => setQuickPrescribe({...quickPrescribe, medication: e.target.value})}
                     
                      className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                        isDarkMode 
                          ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                          : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 hover:border-blue-400'
                      }`}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Dosage
                      </label>
                      <input 
                        type="text"
                        value={quickPrescribe.dosage}
                        onChange={(e) => setQuickPrescribe({...quickPrescribe, dosage: e.target.value})}
                       
                        className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                          isDarkMode 
                            ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                            : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 hover:border-blue-400'
                      }`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Frequency
                      </label>
                      <div className="relative" ref={frequencyDropdownRef}>
                        <div 
                          onClick={() => setIsFrequencyDropdownOpen(!isFrequencyDropdownOpen)}
                          className={`w-full px-4 py-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                            isFrequencyDropdownOpen 
                              ? (isDarkMode ? 'ring-2 ring-blue-500 border-blue-500 bg-gray-800 text-white' : 'ring-2 ring-blue-400 border-blue-400 bg-white text-gray-900')
                              : (isDarkMode ? 'bg-gray-800/80 border-gray-700 text-white hover:border-gray-500' : 'bg-white border-gray-200 text-gray-900 hover:border-blue-400')
                          }`}
                        >
                          <span>{quickPrescribe.frequency}</span>
                          <ChevronDown className={`w-5 h-5 transition-transform ${isFrequencyDropdownOpen ? 'rotate-180 text-blue-500' : 'text-gray-400'}`} />
                        </div>
                        {isFrequencyDropdownOpen && (
                          <div className={`absolute z-10 w-full mt-2 py-2 rounded-xl border shadow-xl bg-white max-h-48 overflow-y-auto transform origin-top animate-fade-in ${
                            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
                          }`}>
                            {['Once daily', 'Twice daily', 'Three times daily', 'Weekly', 'As needed'].map(freq => (
                              <div 
                                key={freq} 
                                onClick={() => { setQuickPrescribe({...quickPrescribe, frequency: freq}); setIsFrequencyDropdownOpen(false); }}
                                className={`px-4 py-2 cursor-pointer transition-colors ${
                                  quickPrescribe.frequency === freq 
                                    ? (isDarkMode ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-50 text-blue-700 font-medium')
                                    : (isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50')
                                }`}
                              >
                                {freq}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Instructions
                    </label>
                    <textarea 
                      rows="3"
                      value={quickPrescribe.instructions}
                      onChange={(e) => setQuickPrescribe({...quickPrescribe, instructions: e.target.value})}
                     
                      className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                        isDarkMode 
                          ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                          : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 hover:border-blue-400'
                      }`}
                    />
                  </div>

                  <button 
                    type="submit" 
                    className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2 ${
                    isDarkMode
                      ? (isEditing ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-cyan-600 hover:bg-cyan-500 text-white')
                      : (isEditing ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'bg-cyan-500 hover:bg-cyan-600 text-white')
                  }`}>
                    {isEditing ? <FileSignature className="w-5 h-5" /> : <Zap className="w-5 h-5" />}
                    {isEditing ? 'Update Prescription' : 'Generate Prescription'}
                  </button>
                </div>
              </div>
            </GlassCard>
          </form>
        </div>

        <BeautifulFooter isDarkMode={isDarkMode} setActiveModule={setActiveModule} />
      </div>
    );
};

export default Prescriptions;
