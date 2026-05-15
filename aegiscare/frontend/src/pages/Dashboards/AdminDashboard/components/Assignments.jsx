import React, { useState, useEffect } from 'react';
import {
  Link2, Users, Activity,
  User as UserIcon, ShieldCheck, CheckCircle,
  ChevronDown, RefreshCw
} from 'lucide-react';
import api from '../../../../services/api';
import GlassCard from './GlassCard';
import AnimatedCard from './AnimatedCard';
import BeautifulFooter from './BeautifulFooter';

const Assignments = ({ isDarkMode, dbUsers, showToast, setActiveModule }) => {
  const [assignments, setAssignments] = useState([]);
  const [assLoading, setAssLoading] = useState(true);
  const [assMsg, setAssMsg] = useState('');
  const [selectedElderly, setSelectedElderly] = useState(null);
  const [selectedCaregiver, setSelectedCaregiver] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [openDropdownId, setOpenDropdownId] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setAssLoading(true);
        const res = await api.get('/admin/assignments');
        if (res.data && res.data.success) setAssignments(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setAssLoading(false);
      }
    };
    load();
  }, []);

  const handleAssignCaregiver = async (elderlyId) => {
    if (!selectedCaregiver) return;
    try {
      const res = await api.post('/admin/assign-caregiver', { elderlyId, caregiverId: selectedCaregiver });
      if (res.data.success) {
        setAssMsg('Caregiver assigned successfully!');
        const r2 = await api.get('/admin/assignments');
        if (r2.data.success) setAssignments(r2.data.data);
        setSelectedCaregiver('');
        setTimeout(() => setAssMsg(''), 3000);
      }
    } catch (err) {
      setAssMsg(err.response?.data?.message || 'Error assigning caregiver');
      setTimeout(() => setAssMsg(''), 3000);
    }
  };

  const handleAssignDoctor = async (elderlyId) => {
    if (!selectedDoctor) return;
    try {
      const res = await api.post('/admin/assign-doctor', { elderlyId, doctorId: selectedDoctor });
      if (res.data.success) {
        setAssMsg('Doctor assigned successfully!');
        const r2 = await api.get('/admin/assignments');
        if (r2.data.success) setAssignments(r2.data.data);
        setSelectedDoctor('');
        setTimeout(() => setAssMsg(''), 3000);
      }
    } catch (err) {
      setAssMsg(err.response?.data?.message || 'Error assigning doctor');
      setTimeout(() => setAssMsg(''), 3000);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <GlassCard color="violet" hoverable={false} darkMode={isDarkMode}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3 bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
              <Link2 className={`w-8 h-8 ${isDarkMode ? 'text-violet-400' : 'text-violet-500'}`} />
              Elderly Assignments
            </h1>
            <p className={`text-lg ${isDarkMode ? 'text-violet-200/80' : 'text-violet-700/80'}`}>
              Dynamically assign caregivers and doctors to elderly users across all dashboards
            </p>
          </div>
          <div className={`flex items-center gap-2 px-5 py-2.5 rounded-full shadow-sm ${isDarkMode ? 'bg-violet-950/40 border border-violet-900/50' : 'bg-gradient-to-r from-violet-100 to-fuchsia-100 border border-violet-200'
            }`}>
            <div className="w-2.5 h-2.5 rounded-full bg-violet-500 animate-pulse"></div>
            <span className={`text-sm font-semibold ${isDarkMode ? 'text-violet-300' : 'text-violet-700'}`}>
              {assignments.length} elderly registered
            </span>
          </div>
        </div>
      </GlassCard>

      {assMsg && (
        <div className={`p-4 rounded-xl text-center font-medium shadow-lg animate-slide-up ${assMsg.includes('Error') || assMsg.includes('Already')
          ? isDarkMode ? 'bg-rose-900/50 text-rose-300 border border-rose-800' : 'bg-rose-100 text-rose-700 border border-rose-200'
          : isDarkMode ? 'bg-emerald-900/50 text-emerald-300 border border-emerald-800' : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
          }`}>
          {assMsg}
        </div>
      )}

      {assLoading ? (
        <div className="text-center py-16">
          <RefreshCw className={`w-10 h-10 mx-auto animate-spin mb-4 ${isDarkMode ? 'text-violet-400' : 'text-violet-600'}`} />
          <p className={`text-lg font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Loading connected assignments...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {assignments.map((elderly, idx) => (
            <AnimatedCard
              key={elderly._id}
              delay={idx}
              className="relative"
              style={{ zIndex: assignments.length - idx }}
            >
              <div className={`relative p-1 rounded-3xl bg-gradient-to-br transition-all duration-300 hover:shadow-2xl hover:scale-[1.01] ${isDarkMode ? 'from-gray-800 via-gray-900 to-gray-800 hover:from-violet-900/50 hover:to-fuchsia-900/50' : 'from-white via-gray-50 to-white hover:from-violet-50 hover:to-fuchsia-50'} shadow-md border ${isDarkMode ? 'border-gray-800 hover:border-violet-500/30' : 'border-gray-200 hover:border-violet-300'}`}>
                <div className={`p-6 rounded-[1.35rem] ${isDarkMode ? 'bg-gray-900/80 backdrop-blur-xl' : 'bg-white/80 backdrop-blur-xl'}`}>
                  <div className="flex flex-col lg:flex-row lg:items-center gap-8">
                    {/* Elderly Info Hub */}
                    <div className="flex items-center gap-5 lg:w-[30%]">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold shadow-inner ${isDarkMode ? 'bg-gradient-to-br from-violet-900/50 to-fuchsia-900/50 text-violet-300 border border-violet-800/50' : 'bg-gradient-to-br from-violet-100 to-fuchsia-100 text-violet-700 border border-violet-200'}`}>
                        {elderly.firstName?.charAt(0)}{elderly.lastName?.charAt(0)}
                      </div>
                      <div>
                        <h3 className={`text-xl font-bold mb-1 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                          {elderly.firstName} {elderly.lastName}
                        </h3>
                        <p className={`text-sm mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{elderly.email}</p>
                        <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full ${isDarkMode ? 'bg-blue-900/40 text-blue-300 border border-blue-800/50' : 'bg-blue-100 text-blue-700 border border-blue-200'}`}>
                          <UserIcon size={12} /> Elderly Patient
                        </span>
                      </div>
                    </div>

                    <div className={`hidden lg:block w-px h-24 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`}></div>

                    {/* Assignment Controls Area */}
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8">

                      {/* Caregiver Assignment */}
                      <div className="flex flex-col h-full justify-between space-y-4">
                        <div>
                          <h4 className={`text-sm font-bold uppercase tracking-wider mb-3 flex items-center gap-2 ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`}>
                            <Users size={16} /> Assigned Caregivers
                          </h4>
                          <div className="flex flex-wrap gap-2 min-h-[32px]">
                            {elderly.assignedCaregivers && elderly.assignedCaregivers.length > 0 ? (
                              elderly.assignedCaregivers.map(cg => (
                                <div key={cg._id} className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-medium shadow-sm transition-all hover:scale-105 ${isDarkMode ? 'bg-amber-900/40 text-amber-300 border border-amber-800/50' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
                                  <ShieldCheck size={14} className={isDarkMode ? 'text-amber-400' : 'text-amber-500'} /> {cg.firstName} {cg.lastName}
                                </div>
                              ))
                            ) : (
                              <span className={`text-sm italic ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Unassigned</span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          {/* Custom Caregiver Dropdown */}
                          <div className="relative flex-1">
                            <button
                              onClick={() => setOpenDropdownId(openDropdownId === `caregiver-${elderly._id}` ? null : `caregiver-${elderly._id}`)}
                              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl border text-sm font-medium transition-all duration-300 ${isDarkMode
                                  ? 'bg-gray-800 border-gray-700 text-gray-200 hover:border-amber-500/50 hover:bg-gray-750'
                                  : 'bg-white border-gray-200 text-gray-700 hover:border-amber-400/50 shadow-sm'
                                } focus:outline-none focus:ring-2 focus:ring-amber-500/20`}
                            >
                              <span className="truncate">
                                {selectedElderly === elderly._id && selectedCaregiver
                                  ? dbUsers.caregivers.find(c => c._id === selectedCaregiver)?.firstName + ' ' + dbUsers.caregivers.find(c => c._id === selectedCaregiver)?.lastName
                                  : 'Select Caregiver...'}
                              </span>
                              <ChevronDown size={16} className={`transition-transform duration-300 ${openDropdownId === `caregiver-${elderly._id}` ? 'rotate-180' : ''} ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                            </button>

                            {openDropdownId === `caregiver-${elderly._id}` && (
                              <>
                                <div className="fixed inset-0 z-40" onClick={() => setOpenDropdownId(null)}></div>
                                <div className={`absolute top-[calc(100%+8px)] left-0 right-0 z-50 py-2 rounded-xl shadow-xl border overflow-hidden max-h-60 overflow-y-auto transition-all animate-fade-in ${isDarkMode ? 'bg-gray-800 border-gray-700 shadow-black/50' : 'bg-white border-gray-100 shadow-amber-900/10'
                                  }`}>
                                  {dbUsers.caregivers.length > 0 ? dbUsers.caregivers.map(cg => (
                                    <button
                                      key={cg._id}
                                      onClick={() => {
                                        setSelectedElderly(elderly._id);
                                        setSelectedCaregiver(cg._id);
                                        setOpenDropdownId(null);
                                      }}
                                      className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors ${(selectedElderly === elderly._id && selectedCaregiver === cg._id)
                                          ? (isDarkMode ? 'bg-amber-900/30 text-amber-400 border-l-2 border-amber-400' : 'bg-amber-50 text-amber-700 border-l-2 border-amber-500')
                                          : (isDarkMode ? 'text-gray-300 hover:bg-gray-700/50 hover:text-white border-l-2 border-transparent' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-l-2 border-transparent')
                                        }`}
                                    >
                                      {cg.firstName} {cg.lastName}
                                    </button>
                                  )) : (
                                    <div className={`px-4 py-2 text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>No caregivers available</div>
                                  )}
                                </div>
                              </>
                            )}
                          </div>

                          <button
                            onClick={() => handleAssignCaregiver(elderly._id)}
                            disabled={selectedElderly !== elderly._id || !selectedCaregiver}
                            className={`flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${isDarkMode
                              ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-900/50 disabled:bg-gray-800 disabled:text-gray-600 disabled:shadow-none'
                              : 'bg-amber-500 hover:bg-amber-600 hover:shadow-lg hover:shadow-amber-500/30 text-white disabled:bg-gray-100 disabled:text-gray-400 disabled:shadow-none disabled:transform-none'
                              } ${selectedElderly === elderly._id && selectedCaregiver ? 'hover:-translate-y-0.5' : ''}`}
                          >
                            Assign
                          </button>
                        </div>
                      </div>

                      {/* Doctor Assignment */}
                      <div className="flex flex-col h-full justify-between space-y-4">
                        <div>
                          <h4 className={`text-sm font-bold uppercase tracking-wider mb-3 flex items-center gap-2 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                            <Activity size={16} /> Primary Physician
                          </h4>
                          <div className="flex flex-wrap gap-2 min-h-[32px]">
                            {elderly.assignedDoctor ? (
                              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-medium shadow-sm transition-all hover:scale-105 ${isDarkMode ? 'bg-emerald-900/40 text-emerald-300 border border-emerald-800/50' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
                                <CheckCircle size={14} className={isDarkMode ? 'text-emerald-400' : 'text-emerald-500'} /> Dr. {elderly.assignedDoctor.firstName} {elderly.assignedDoctor.lastName}
                              </div>
                            ) : (
                              <span className={`text-sm italic ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Unassigned</span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          {/* Custom Doctor Dropdown */}
                          <div className="relative flex-1">
                            <button
                              onClick={() => setOpenDropdownId(openDropdownId === `doctor-${elderly._id}` ? null : `doctor-${elderly._id}`)}
                              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl border text-sm font-medium transition-all duration-300 ${isDarkMode
                                  ? 'bg-gray-800 border-gray-700 text-gray-200 hover:border-emerald-500/50 hover:bg-gray-750'
                                  : 'bg-white border-gray-200 text-gray-700 hover:border-emerald-400/50 shadow-sm'
                                } focus:outline-none focus:ring-2 focus:ring-emerald-500/20`}
                            >
                              <span className="truncate">
                                {selectedElderly === elderly._id && selectedDoctor
                                  ? 'Dr. ' + dbUsers.doctors.find(c => c._id === selectedDoctor)?.firstName + ' ' + dbUsers.doctors.find(c => c._id === selectedDoctor)?.lastName
                                  : 'Select Doctor...'}
                              </span>
                              <ChevronDown size={16} className={`transition-transform duration-300 ${openDropdownId === `doctor-${elderly._id}` ? 'rotate-180' : ''} ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                            </button>

                            {openDropdownId === `doctor-${elderly._id}` && (
                              <>
                                <div className="fixed inset-0 z-40" onClick={() => setOpenDropdownId(null)}></div>
                                <div className={`absolute top-[calc(100%+8px)] left-0 right-0 z-50 py-2 rounded-xl shadow-xl border max-h-60 overflow-y-auto overflow-x-hidden transition-all animate-fade-in ${isDarkMode ? 'bg-gray-800 border-gray-700 shadow-black/50' : 'bg-white border-gray-100 shadow-emerald-900/10'
                                  }`}>
                                  {dbUsers.doctors.length > 0 ? dbUsers.doctors.map(doc => (
                                    <button
                                      key={doc._id}
                                      onClick={() => {
                                        setSelectedElderly(elderly._id);
                                        setSelectedDoctor(doc._id);
                                        setOpenDropdownId(null);
                                      }}
                                      className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors ${(selectedElderly === elderly._id && selectedDoctor === doc._id)
                                          ? (isDarkMode ? 'bg-emerald-900/30 text-emerald-400 border-l-2 border-emerald-400' : 'bg-emerald-50 text-emerald-700 border-l-2 border-emerald-500')
                                          : (isDarkMode ? 'text-gray-300 hover:bg-gray-700/50 hover:text-white border-l-2 border-transparent' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-l-2 border-transparent')
                                        }`}
                                    >
                                      Dr. {doc.firstName} {doc.lastName}
                                    </button>
                                  )) : (
                                    <div className={`px-4 py-2 text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>No doctors available</div>
                                  )}
                                </div>
                              </>
                            )}
                          </div>

                          <button
                            onClick={() => handleAssignDoctor(elderly._id)}
                            disabled={selectedElderly !== elderly._id || !selectedDoctor}
                            className={`flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${isDarkMode
                              ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/50 disabled:bg-gray-800 disabled:text-gray-600 disabled:shadow-none'
                              : 'bg-emerald-500 hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-500/30 text-white disabled:bg-gray-100 disabled:text-gray-400 disabled:shadow-none disabled:transform-none'
                              } ${selectedElderly === elderly._id && selectedDoctor ? 'hover:-translate-y-0.5' : ''}`}
                          >
                            Assign
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            </AnimatedCard>
          ))}
        </div>
      )}

      {/* Footer */}
      <BeautifulFooter isDarkMode={isDarkMode} setActiveModule={setActiveModule} />
    </div>
  );
};

export default Assignments;
