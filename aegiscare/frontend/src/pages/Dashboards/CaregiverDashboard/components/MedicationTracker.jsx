import React, { useEffect } from 'react';
import { 
  Users, Pill, Clock, Syringe, ChevronRight, BellRing 
} from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../../../../services/api';
import GlassCard from './GlassCard';
import AnimatedCard from './AnimatedCard';
import BeautifulFooter from './BeautifulFooter';

const MedicationTracker = ({ 
  isDarkMode, 
  elderlyList, 
  targetMedId, 
  setTargetMedId, 
  setSelectedElderly, 
  setActiveModule 
}) => {
  useEffect(() => {
    if (targetMedId) {
      setTimeout(() => {
        const el = document.getElementById(`med-${targetMedId}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
      const timer = setTimeout(() => setTargetMedId(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [targetMedId]);

  return (
    <div className="space-y-6 animate-fade-in">
      <GlassCard color="cyan" darkMode={isDarkMode} className="relative overflow-hidden border-2">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="relative z-10 w-full flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold mb-3 flex items-center gap-3">
              <span className={`bg-gradient-to-r ${isDarkMode ? 'from-cyan-400 to-blue-400' : 'from-cyan-600 to-blue-600'} bg-clip-text text-transparent flex items-center gap-2`}>
                <Pill className="w-8 h-8 text-cyan-500" />
                Medication Tracker
              </span>
            </h2>
            <p className={`text-base font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Monitor medication adherence for all assigned elderly individuals
            </p>
          </div>
          
          <div className={`flex items-center gap-6 px-6 py-4 rounded-2xl border-2 ${isDarkMode ? 'bg-gray-900/50 border-gray-700/50' : 'bg-white/80 border-cyan-100'} shadow-sm backdrop-blur-sm`}>
             <div className="flex flex-col items-center">
               <span className={`text-3xl font-bold ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                 {elderlyList.reduce((acc, e) => acc + (e.medications || []).filter(m => m.todayStatus === 'taken').length, 0)}
               </span>
               <span className={`text-xs font-bold uppercase tracking-wider mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Taken Today</span>
             </div>
             <div className={`h-10 w-px ${isDarkMode ? 'bg-gray-700' : 'bg-cyan-200'}`}></div>
             <div className="flex flex-col items-center">
               <span className={`text-3xl font-bold ${isDarkMode ? 'text-amber-400' : 'text-amber-500'}`}>
                 {elderlyList.reduce((acc, e) => acc + (e.medications || []).filter(m => m.todayStatus === 'pending' || !m.todayStatus).length, 0)}
               </span>
               <span className={`text-xs font-bold uppercase tracking-wider mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Pending</span>
             </div>
          </div>
        </div>
      </GlassCard>

      {/* List of elderly with medications */}
      <div className="space-y-6">
        {elderlyList.length === 0 ? (
          <div className={`text-center py-12 rounded-3xl border-2 ${isDarkMode ? 'bg-gray-900/30 border-gray-800' : 'bg-white/50 border-gray-200'}`}>
             <Users className={`w-16 h-16 mx-auto mb-4 ${isDarkMode ? 'text-gray-700' : 'text-gray-300'}`} />
             <p className={`text-xl font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>No elderly monitored currently</p>
          </div>
        ) : elderlyList.map((elderly, idx) => (
          <AnimatedCard key={elderly._id} delay={idx}>
            <GlassCard color="cyan" darkMode={isDarkMode} className="overflow-hidden">
               <div className={`flex items-center justify-between pb-5 mb-5 border-b ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
                 <div className="flex items-center gap-4">
                   <img src={elderly.photo || "https://img.freepik.com/free-vector/user-blue-gradient_78370-4692.jpg"} alt={elderly.firstName} className="w-14 h-14 rounded-full object-cover border-2 border-cyan-500 shadow-md" />
                   <div>
                     <h3 className={`text-xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>{elderly.firstName} {elderly.lastName}</h3>
                     <div className="flex items-center gap-2 mt-1">
                       <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-cyan-50 text-cyan-700 border border-cyan-200'}`}>
                         Elderly Patient
                       </span>
                       <span className={`text-xs font-medium ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                         {elderly.medications?.length || 0} Medications
                       </span>
                     </div>
                   </div>
                 </div>
                 <button 
                   onClick={() => { setSelectedElderly(elderly); setActiveModule('elderly-profile'); }} 
                   className={`p-2 rounded-xl transition-colors ${isDarkMode ? 'hover:bg-gray-800 text-cyan-400' : 'hover:bg-cyan-50 text-cyan-600'}`}
                   title="View Profile"
                 >
                   <ChevronRight className="w-6 h-6" />
                 </button>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                 {(elderly.medications || []).length === 0 ? (
                   <div className={`col-span-full text-center py-8 rounded-2xl ${isDarkMode ? 'bg-gray-900/30' : 'bg-gray-50/50'}`}>
                     <Pill className={`w-10 h-10 mx-auto mb-2 opacity-50 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                     <p className={`font-medium ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>No medications assigned to this patient.</p>
                   </div>
                 ) : (elderly.medications || []).map((med, mIdx) => (
                   <div key={med._id || mIdx} id={`med-${med._id}`} className={`group rounded-2xl p-5 border-2 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] flex flex-col justify-between ${
                     targetMedId === med._id
                       ? isDarkMode ? 'bg-cyan-900/40 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.5)]' : 'bg-cyan-50 border-cyan-400 shadow-xl'
                       : isDarkMode 
                         ? 'bg-gray-900/40 border-gray-800/50 hover:border-cyan-700/50' 
                         : 'bg-white border-gray-100 hover:border-cyan-300/50 shadow-sm'
                   }`}>
                     <div>
                       <div className="flex items-start justify-between mb-4">
                         <div className={`p-3 rounded-xl transition-colors ${
                           med.todayStatus === 'taken' 
                             ? (isDarkMode ? 'bg-emerald-900/40 text-emerald-400 group-hover:bg-emerald-900/60' : 'bg-emerald-100 text-emerald-600 group-hover:bg-emerald-200')
                             : med.todayStatus === 'missed' 
                             ? (isDarkMode ? 'bg-rose-900/40 text-rose-400 group-hover:bg-rose-900/60' : 'bg-rose-100 text-rose-600 group-hover:bg-rose-200')
                             : (isDarkMode ? 'bg-amber-900/40 text-amber-400 group-hover:bg-amber-900/60' : 'bg-amber-100 text-amber-600 group-hover:bg-amber-200')
                         }`}>
                           <Pill className="w-6 h-6" />
                         </div>
                         <div className="flex flex-col items-end">
                           <span className={`text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-sm shadow-sm ${
                             med.todayStatus === 'taken' 
                               ? (isDarkMode ? 'bg-emerald-900/50 text-emerald-300 border border-emerald-700/50' : 'bg-emerald-100/80 text-emerald-700 border border-emerald-300')
                               : med.todayStatus === 'missed' 
                               ? (isDarkMode ? 'bg-rose-900/50 text-rose-300 border border-rose-700/50' : 'bg-rose-100/80 text-rose-700 border border-rose-300')
                               : (isDarkMode ? 'bg-amber-900/50 text-amber-300 border border-amber-700/50' : 'bg-amber-100/80 text-amber-700 border border-amber-300')
                           }`}>
                             {med.todayStatus === 'taken' ? '✓ Taken' : med.todayStatus === 'missed' ? '⚠️ Missed' : '⏳ Pending'}
                           </span>
                         </div>
                       </div>
                       
                       <h4 className={`font-bold text-xl mb-1 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>{med.name}</h4>
                       
                       <div className="flex items-center gap-4 mb-5 mt-3">
                         <div className={`flex items-center gap-1.5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                           <div className={`p-1.5 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                             <Clock className="w-4 h-4" />
                           </div>
                           <span className="text-sm font-medium">{med.scheduledTime}</span>
                         </div>
                         <div className={`flex items-center gap-1.5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                           <div className={`p-1.5 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                             <Syringe className="w-4 h-4" />
                           </div>
                           <span className="text-sm font-medium">{med.dosage}</span>
                         </div>
                       </div>
                     </div>
                     
                     <button 
                       onClick={async () => {
                         try {
                           await api.post('/notifications', {
                             recipientId: elderly._id,
                             type: 'medication_added',
                             title: 'Medication Reminder',
                             message: `Hi ${elderly.firstName}, it is time to take your ${med.name} (${med.dosage}).`
                           });
                           toast.success(`Reminder sent to ${elderly.firstName} for ${med.name}`);
                         } catch (err) {
                           console.error('Failed to send reminder:', err);
                           toast.error('Failed to send reminder');
                         }
                       }}
                       className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
                         isDarkMode 
                           ? 'bg-gray-800/80 hover:bg-cyan-900 hover:text-cyan-300 text-gray-300 border border-gray-700' 
                           : 'bg-gray-50 hover:bg-cyan-50 hover:text-cyan-700 text-gray-700 border border-gray-200'
                       }`}
                     >
                       <BellRing className="w-4 h-4" /> Send Reminder
                     </button>
                   </div>
                 ))}
               </div>
            </GlassCard>
          </AnimatedCard>
        ))}
      </div>
      <BeautifulFooter isDarkMode={isDarkMode} setActiveModule={setActiveModule} />
    </div>
  );
};

export default MedicationTracker;
