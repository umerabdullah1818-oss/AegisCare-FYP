import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  Users, UserPlus, UserCheck, UserX, UserMinus,
  ShieldCheck, Activity, AlertCircle,
  Search, CheckCircle, XCircle, MoreVertical,
  Eye, Download, Upload, Clock,
  AlertTriangle, X, ChevronRight,
  User as UserIcon, Mail, Phone
} from 'lucide-react';
import { getGradient } from '../helpers';
import GlassCard from './GlassCard';
import AnimatedCard from './AnimatedCard';
import GlowingButton from './GlowingButton';
import BeautifulFooter from './BeautifulFooter';

const AddNewUserModal = ({ onClose, isDarkMode, showToast, fetchUsers, fetchDashboardStats }) => {
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '', password: '', role: 'elderly',
    specialization: '', licenseNumber: '', dateOfBirth: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    let fieldError = null;
    switch (name) {
      case 'firstName':
      case 'lastName':
        if (value.trim() && !/^[a-zA-Z\s\-']{2,50}$/.test(value.trim())) {
          fieldError = '2-50 chars (letters, spaces, hyphens only)';
        }
        break;
      case 'email':
        if (value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          fieldError = 'Invalid email address';
        }
        break;
      case 'phone':
        if (value.trim()) {
          const digitsOnly = value.replace(/\D/g, '');
          if (digitsOnly.length < 10) fieldError = 'At least 10 digits required';
        }
        break;
      case 'password':
        if (value) {
          if (value.length < 8) fieldError = 'Min 8 characters';
          else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#\-_+=.])/.test(value)) {
            fieldError = 'Require upper, lower, number, special char';
          }
        }
        break;
    }
    setErrors(prev => ({ ...prev, [name]: fieldError }));
  };

  const handleSubmit = async () => {
    const basicErrors = {};
    if (!formData.firstName.trim()) basicErrors.firstName = 'Required';
    if (!formData.lastName.trim()) basicErrors.lastName = 'Required';
    if (!formData.email.trim()) basicErrors.email = 'Required';
    if (!formData.phone.trim()) basicErrors.phone = 'Required';
    if (formData.password && errors.password) basicErrors.password = errors.password;

    if (formData.role === 'doctor') {
      if (!formData.specialization.trim()) basicErrors.specialization = 'Required for doctors';
      if (!formData.licenseNumber.trim()) basicErrors.licenseNumber = 'Required for doctors';
    }

    if (Object.keys(basicErrors).length > 0 || Object.values(errors).some(e => e)) {
      setErrors(prev => ({ ...prev, ...basicErrors }));
      showToast('Please fix the validation errors.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const api = (await import('../../../../services/api')).default;
      const payload = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        password: formData.password || 'AegisCare123!',
        role: formData.role
      };
      if (formData.role === 'doctor') {
        payload.specialization = formData.specialization.trim();
        payload.licenseNumber = formData.licenseNumber.trim();
      }
      if (formData.role === 'elderly' && formData.dateOfBirth) {
        payload.dateOfBirth = formData.dateOfBirth;
      }

      await api.post('/admin/users', payload);
      showToast('User created successfully!', 'success');
      if (typeof fetchUsers === 'function') fetchUsers(true);
      if (typeof fetchDashboardStats === 'function') fetchDashboardStats(true);
      onClose();
    } catch (e) {
      showToast(e.response?.data?.message || 'Error creating user', 'error');
      setIsSubmitting(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className={`w-full max-w-lg max-h-[90vh] flex flex-col rounded-2xl shadow-2xl ${isDarkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-100'} animate-scale-in`}>
        <div className={`flex-shrink-0 p-6 border-b rounded-t-2xl ${isDarkMode ? 'border-gray-800 bg-gray-900' : 'border-gray-100 bg-white'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${isDarkMode ? 'from-emerald-900/50 to-teal-900/50' : 'from-emerald-100 to-teal-100'}`}>
                <UserPlus className={`w-6 h-6 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
              </div>
              <div>
                <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Add New User</h3>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Create a new platform user</p>
              </div>
            </div>
            <button onClick={onClose} className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}>
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto">
          <div className="p-6 space-y-5">
            <div>
              <label className={`block text-xs font-semibold mb-1.5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Role *</label>
              <div className="relative cursor-pointer" tabIndex="0" onBlur={() => setTimeout(() => setIsRoleDropdownOpen(false), 200)}>
                <div
                  onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                  className={`flex items-center justify-between w-full px-4 py-3 rounded-xl border-2 text-sm transition-all duration-300 ${isDarkMode ? 'bg-gray-800/50 border-gray-700 text-white hover:border-emerald-500/50' : 'bg-white border-gray-200 text-gray-900 hover:border-emerald-400'}`}
                >
                  <div className="flex items-center gap-2">
                    {formData.role === 'elderly' && <><span className={`flex items-center justify-center w-6 h-6 rounded-md ${isDarkMode ? 'bg-purple-900/50 text-purple-400' : 'bg-purple-100 text-purple-600'}`}><Activity size={14} /></span><span className="font-medium">Elderly</span></>}
                    {formData.role === 'caregiver' && <><span className={`flex items-center justify-center w-6 h-6 rounded-md ${isDarkMode ? 'bg-blue-900/50 text-blue-400' : 'bg-blue-100 text-blue-600'}`}><UserIcon size={14} /></span><span className="font-medium">Caregiver</span></>}
                    {formData.role === 'doctor' && <><span className={`flex items-center justify-center w-6 h-6 rounded-md ${isDarkMode ? 'bg-emerald-900/50 text-emerald-400' : 'bg-emerald-100 text-emerald-600'}`}><UserCheck size={14} /></span><span className="font-medium">Doctor</span></>}
                  </div>
                  <ChevronRight size={16} className={`transition-transform duration-300 transform ${isRoleDropdownOpen ? 'rotate-90' : ''} ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                </div>
                {/* Dropdown Options */}
                <div className={`absolute top-full left-0 z-50 w-full mt-2 rounded-xl border overflow-hidden shadow-xl transition-all duration-300 ${isRoleDropdownOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'} ${isDarkMode ? 'bg-gray-800 border-gray-700 shadow-black/50' : 'bg-white border-gray-100 shadow-emerald-500/10'}`}>
                  {[
                    { val: 'elderly', label: 'Elderly', icon: <Activity size={14} />, color: 'purple', desc: 'Patient receiving care' },
                    { val: 'caregiver', label: 'Caregiver', icon: <UserIcon size={14} />, color: 'blue', desc: 'Family or assigned caretaker' },
                    { val: 'doctor', label: 'Doctor', icon: <UserCheck size={14} />, color: 'emerald', desc: 'Medical professional' }
                  ].map(opt => (
                    <div key={opt.val}
                      className={`flex items-start gap-3 p-3 transition-colors hover:cursor-pointer ${isDarkMode ? 'hover:bg-gray-700/50' : 'hover:bg-emerald-50'}`}
                      onClick={() => {
                        setFormData(prev => ({ ...prev, role: opt.val, specialization: '', licenseNumber: '', dateOfBirth: '' }));
                        setErrors(prev => ({ ...prev, specialization: null, licenseNumber: null }));
                        setIsRoleDropdownOpen(false);
                      }}
                    >
                      <div className={`mt-0.5 flex items-center justify-center w-8 h-8 rounded-lg ${isDarkMode ? `bg-${opt.color}-900/30 text-${opt.color}-400` : `bg-${opt.color}-100 text-${opt.color}-600`}`}>
                        {opt.icon}
                      </div>
                      <div>
                        <div className={`text-sm font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{opt.label}</div>
                        <div className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>{opt.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {formData.role === 'doctor' && (
              <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-emerald-900/10 border-emerald-900/30' : 'bg-emerald-50 border-emerald-100'} space-y-4`}>
                <div>
                  <label className={`block text-xs font-semibold mb-1.5 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>Specialization *</label>
                  <input type="text" name="specialization" value={formData.specialization} onChange={handleChange}
                    className={`w-full min-w-0 px-3 py-2.5 rounded-xl border-2 text-sm ${errors.specialization ? 'border-rose-500 focus:ring-rose-500/50' : isDarkMode ? 'bg-gray-800/50 border-gray-700 focus:border-emerald-500' : 'bg-white border-gray-200 focus:border-emerald-500'} focus:ring-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`} />
                  {errors.specialization && <p className="text-[10px] text-rose-500 mt-1">{errors.specialization}</p>}
                </div>
                <div>
                  <label className={`block text-xs font-semibold mb-1.5 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>Medical License Number *</label>
                  <input type="text" name="licenseNumber" value={formData.licenseNumber} onChange={handleChange}
                    className={`w-full min-w-0 px-3 py-2.5 rounded-xl border-2 text-sm ${errors.licenseNumber ? 'border-rose-500 focus:ring-rose-500/50' : isDarkMode ? 'bg-gray-800/50 border-gray-700 focus:border-emerald-500' : 'bg-white border-gray-200 focus:border-emerald-500'} focus:ring-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`} />
                  {errors.licenseNumber && <p className="text-[10px] text-rose-500 mt-1">{errors.licenseNumber}</p>}
                </div>
              </div>
            )}

            {formData.role === 'elderly' && (
              <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-purple-900/10 border-purple-900/30' : 'bg-purple-50 border-purple-100'} space-y-4`}>
                <div>
                  <label className={`block text-xs font-semibold mb-1.5 ${isDarkMode ? 'text-purple-400' : 'text-purple-700'}`}>Date of Birth</label>
                  <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange}
                    className={`w-full min-w-0 px-3 py-2.5 rounded-xl border-2 text-sm ${isDarkMode ? 'bg-gray-800/50 border-gray-700 focus:border-purple-500' : 'bg-white border-gray-200 focus:border-purple-500'} focus:ring-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`} />
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="min-w-0">
                <label className={`block text-xs font-semibold mb-1.5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>First Name *</label>
                <input type="text" name="firstName" value={formData.firstName} onChange={handleChange}
                  className={`w-full min-w-0 px-3 py-2.5 rounded-xl border-2 text-sm ${errors.firstName ? 'border-rose-500 focus:ring-rose-500/50' : isDarkMode ? 'bg-gray-800/50 border-gray-700 focus:border-emerald-500' : 'bg-white border-gray-200 focus:border-emerald-500'} focus:ring-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`} />
                {errors.firstName && <p className="text-[10px] text-rose-500 mt-1">{errors.firstName}</p>}
              </div>
              <div className="min-w-0">
                <label className={`block text-xs font-semibold mb-1.5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Last Name *</label>
                <input type="text" name="lastName" value={formData.lastName} onChange={handleChange}
                  className={`w-full min-w-0 px-3 py-2.5 rounded-xl border-2 text-sm ${errors.lastName ? 'border-rose-500 focus:ring-rose-500/50' : isDarkMode ? 'bg-gray-800/50 border-gray-700 focus:border-emerald-500' : 'bg-white border-gray-200 focus:border-emerald-500'} focus:ring-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`} />
                {errors.lastName && <p className="text-[10px] text-rose-500 mt-1">{errors.lastName}</p>}
              </div>
            </div>

            <div className="min-w-0">
              <label className={`block text-xs font-semibold mb-1.5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Email *</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} autoComplete="off"
                className={`w-full min-w-0 px-3 py-2.5 rounded-xl border-2 text-sm ${errors.email ? 'border-rose-500 focus:ring-rose-500/50' : isDarkMode ? 'bg-gray-800/50 border-gray-700 focus:border-emerald-500' : 'bg-white border-gray-200 focus:border-emerald-500'} focus:ring-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`} />
              {errors.email && <p className="text-[10px] text-rose-500 mt-1">{errors.email}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="min-w-0">
                <label className={`block text-xs font-semibold mb-1.5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Phone Number *</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange}
                  className={`w-full min-w-0 px-3 py-2.5 rounded-xl border-2 text-sm ${errors.phone ? 'border-rose-500 focus:ring-rose-500/50' : isDarkMode ? 'bg-gray-800/50 border-gray-700 focus:border-emerald-500' : 'bg-white border-gray-200 focus:border-emerald-500'} focus:ring-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`} />
                {errors.phone && <p className="text-[10px] text-rose-500 mt-1">{errors.phone}</p>}
              </div>
              <div className="min-w-0">
                <label className={`block text-xs font-semibold mb-1.5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Password</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} autoComplete="new-password"
                  className={`w-full min-w-0 px-3 py-2.5 rounded-xl border-2 text-sm ${errors.password ? 'border-rose-500 focus:ring-rose-500/50' : isDarkMode ? 'bg-gray-800/50 border-gray-700 focus:border-emerald-500' : 'bg-white border-gray-200 focus:border-emerald-500'} focus:ring-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`} />
                {errors.password && <p className="text-[10px] text-rose-500 mt-1">{errors.password}</p>}
              </div>
            </div>
          </div>
        </div>

        <div className={`flex-shrink-0 p-6 border-t flex justify-end gap-3 rounded-b-2xl ${isDarkMode ? 'border-gray-800 bg-gray-900' : 'border-gray-100 bg-gray-50'}`}>
          <button onClick={onClose}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${isDarkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-200'}`}>
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={isSubmitting}
            className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/20 hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50">
            {isSubmitting ? 'Creating...' : 'Create User'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

const ManageUsers = ({ isDarkMode, users, doctors, dbUsers, setActiveModule, showToast, showConfirm, fetchUsers, fetchDashboardStats }) => {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserRole, setNewUserRole] = useState('elderly');
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [moreMenuUserId, setMoreMenuUserId] = useState(null);

  const filteredUsers = users.filter(user => {
    // Search Box Filter
    if (searchQuery &&
      !user.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !user.email.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !user.role.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Tab Filter
    if (filter === 'all') return true;
    if (filter === 'active') return user.status === 'active';
    if (filter === 'pending') return user.status === 'pending';
    if (filter === 'inactive') return user.status === 'inactive';
    if (filter === 'verified') return user.status === 'verified';
    return true;
  });

  const UserActionModal = ({ user, action, onClose }) => {
    const [selectedCaregiverId, setSelectedCaregiverId] = useState('');
    const [isCaregiverDropdownOpen, setIsCaregiverDropdownOpen] = useState(false);
    const [selectedDoctorId, setSelectedDoctorId] = useState('');
    const [isDoctorDropdownOpen, setIsDoctorDropdownOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const availableCaregivers = dbUsers.caregivers || [];
    const selectedCaregiver = availableCaregivers.find(c => c._id === selectedCaregiverId);
    const availableDoctors = (dbUsers.doctors || []).filter(d => d.status === 'verified');
    const selectedDoctor = availableDoctors.find(d => d._id === selectedDoctorId);

    const actionConfigs = {
      verify: { title: 'Verify User', desc: `Approve ${user.name} as a verified user`, btn: 'Verify Now', color: 'emerald', icon: <CheckCircle size={22} /> },
      suspend: { title: 'Suspend User', desc: `Temporarily suspend ${user.name}'s access`, btn: 'Suspend Account', color: 'amber', icon: <UserX size={22} /> },
      delete: { title: 'Delete User', desc: `Permanently remove ${user.name} from the system`, btn: 'Delete Forever', color: 'rose', icon: <UserMinus size={22} /> },
      assign: { title: 'Assign Caregiver', desc: `Select a caregiver for ${user.name}`, btn: 'Assign Caregiver', color: 'blue', icon: <Users size={22} /> },
      assignDoctor: { title: 'Assign Doctor', desc: `Select a verified doctor for ${user.name}`, btn: 'Assign Doctor', color: 'indigo', icon: <UserCheck size={22} /> }
    };
    const config = actionConfigs[action] || actionConfigs.verify;

    const handleAction = async () => {
      setIsLoading(true);
      try {
        const api = (await import('../../../../services/api')).default;
        if (action === 'verify') {
          await api.put(`/admin/users/${user.id}/status`, { status: 'verified' });
          showToast(`${user.name} has been verified!`, 'success');
        } else if (action === 'suspend') {
          await api.put(`/admin/users/${user.id}/status`, { status: 'suspended' });
          showToast(`${user.name} has been suspended.`, 'success');
        } else if (action === 'delete') {
          await api.delete(`/admin/users/${user.id}`);
          showToast(`${user.name} has been deleted.`, 'success');
        } else if (action === 'assign') {
          if (!selectedCaregiverId) { showToast('Please select a caregiver first.', 'error'); setIsLoading(false); return; }
          await api.post('/admin/assign-caregiver', { elderlyId: user.id, caregiverId: selectedCaregiverId });
          showToast(`Caregiver assigned to ${user.name} successfully!`, 'success');
        } else if (action === 'assignDoctor') {
          if (!selectedDoctorId) { showToast('Please select a doctor first.', 'error'); setIsLoading(false); return; }
          await api.post('/admin/assign-doctor', { elderlyId: user.id, doctorId: selectedDoctorId });
          showToast(`Doctor assigned to ${user.name} successfully!`, 'success');
        }
        fetchUsers(true); fetchDashboardStats(true);
      } catch (e) {
        showToast(e.response?.data?.message || 'Action failed', 'error');
      }
      setIsLoading(false);
      onClose();
    };

    const colorStyles = {
      emerald: { bg: isDarkMode ? 'from-emerald-900/40 to-teal-900/30' : 'from-emerald-50 to-teal-50', icon: isDarkMode ? 'bg-emerald-900/50 text-emerald-400' : 'bg-emerald-100 text-emerald-600', btn: 'from-emerald-500 to-teal-500 shadow-emerald-500/25' },
      amber: { bg: isDarkMode ? 'from-amber-900/30 to-orange-900/20' : 'from-amber-50 to-orange-50', icon: isDarkMode ? 'bg-amber-900/50 text-amber-400' : 'bg-amber-100 text-amber-600', btn: 'from-amber-500 to-orange-500 shadow-amber-500/25' },
      rose: { bg: isDarkMode ? 'from-rose-900/30 to-red-900/20' : 'from-rose-50 to-red-50', icon: isDarkMode ? 'bg-rose-900/50 text-rose-400' : 'bg-rose-100 text-rose-600', btn: 'from-rose-500 to-red-600 shadow-rose-500/25' },
      blue: { bg: isDarkMode ? 'from-blue-900/30 to-cyan-900/20' : 'from-blue-50 to-cyan-50', icon: isDarkMode ? 'bg-blue-900/50 text-blue-400' : 'bg-blue-100 text-blue-600', btn: 'from-blue-500 to-cyan-500 shadow-blue-500/25' },
      indigo: { bg: isDarkMode ? 'from-indigo-900/30 to-purple-900/20' : 'from-indigo-50 to-purple-50', icon: isDarkMode ? 'bg-indigo-900/50 text-indigo-400' : 'bg-indigo-100 text-indigo-600', btn: 'from-indigo-500 to-purple-600 shadow-indigo-500/25' }
    };
    const cs = colorStyles[config.color] || colorStyles.blue;

    return createPortal(
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 animate-fade-in" onClick={onClose}>
        <div onClick={e => e.stopPropagation()} className={`w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>
          {/* Header */}
          <div className={`p-5 bg-gradient-to-r ${cs.bg}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${cs.icon}`}>{config.icon}</div>
                <div>
                  <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{config.title}</h3>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{config.desc}</p>
                </div>
              </div>
              <button onClick={onClose} className={`p-2 rounded-xl transition-colors ${isDarkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-white/50 text-gray-500'}`}>
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-5">
            {/* User Info Card */}
            <div className={`flex items-center gap-3 p-3 rounded-xl mb-4 ${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white bg-gradient-to-br ${getGradient(user.color)}`}>
                {user.name.charAt(0)}
              </div>
              <div>
                <p className={`font-semibold text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{user.name}</p>
                <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>{user.email}</p>
              </div>
              <span className={`ml-auto text-xs px-2.5 py-1 rounded-full font-medium capitalize ${user.role === 'elderly' ? (isDarkMode ? 'bg-purple-900/40 text-purple-300' : 'bg-purple-100 text-purple-700') :
                  user.role === 'doctor' ? (isDarkMode ? 'bg-emerald-900/40 text-emerald-300' : 'bg-emerald-100 text-emerald-700') :
                    (isDarkMode ? 'bg-blue-900/40 text-blue-300' : 'bg-blue-100 text-blue-700')
                }`}>{user.role}</span>
            </div>

            {/* Assign Caregiver Dropdown */}
            {action === 'assign' && (
              <div className="mb-4">
                <label className={`block text-xs font-semibold mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Select Caregiver</label>
                {availableCaregivers.length === 0 ? (
                  <div className={`text-center py-6 rounded-xl border-2 border-dashed ${isDarkMode ? 'border-gray-700 text-gray-500' : 'border-gray-200 text-gray-400'}`}>
                    <Users className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p className="text-sm font-medium">No caregivers available</p>
                    <p className="text-xs mt-1">Add caregivers first to assign them</p>
                  </div>
                ) : (
                  <div className="relative">
                    <div
                      onClick={() => setIsCaregiverDropdownOpen(!isCaregiverDropdownOpen)}
                      className={`flex items-center justify-between w-full px-4 py-3 rounded-xl border-2 text-sm cursor-pointer transition-all duration-300 ${isDarkMode
                          ? `bg-gray-800/50 border-gray-700 text-white ${isCaregiverDropdownOpen ? 'border-blue-500 ring-2 ring-blue-500/20' : 'hover:border-blue-500/50'}`
                          : `bg-white border-gray-200 text-gray-900 ${isCaregiverDropdownOpen ? 'border-blue-400 ring-2 ring-blue-400/20' : 'hover:border-blue-400'}`
                        }`}
                    >
                      <div className="flex items-center gap-2">
                        {selectedCaregiver ? (
                          <>
                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white bg-gradient-to-br from-blue-500 to-cyan-500`}>
                              {selectedCaregiver.firstName?.charAt(0)}
                            </div>
                            <div>
                              <p className="font-medium">{selectedCaregiver.firstName} {selectedCaregiver.lastName}</p>
                              <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>{selectedCaregiver.email}</p>
                            </div>
                          </>
                        ) : (
                          <span className={isDarkMode ? 'text-gray-500' : 'text-gray-400'}>Choose a caregiver...</span>
                        )}
                      </div>
                      <ChevronRight size={16} className={`transition-transform duration-300 ${isCaregiverDropdownOpen ? 'rotate-90' : ''} ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    </div>

                    {/* Dropdown List */}
                    <div className={`absolute top-full left-0 z-50 w-full mt-2 rounded-xl border overflow-hidden shadow-xl transition-all duration-300 max-h-48 overflow-y-auto ${isCaregiverDropdownOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
                      } ${isDarkMode ? 'bg-gray-800 border-gray-700 shadow-black/50' : 'bg-white border-gray-100 shadow-blue-500/10'}`}>
                      {availableCaregivers.map(cg => (
                        <div
                          key={cg._id}
                          onClick={() => { setSelectedCaregiverId(cg._id); setIsCaregiverDropdownOpen(false); }}
                          className={`flex items-center gap-3 p-3 cursor-pointer transition-colors ${selectedCaregiverId === cg._id
                              ? (isDarkMode ? 'bg-blue-900/30' : 'bg-blue-50')
                              : (isDarkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50')
                            }`}
                        >
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white bg-gradient-to-br from-blue-500 to-cyan-500`}>
                            {cg.firstName?.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-semibold truncate ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{cg.firstName} {cg.lastName}</p>
                            <p className={`text-xs truncate ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>{cg.email}</p>
                          </div>
                          {selectedCaregiverId === cg._id && <CheckCircle size={16} className="text-blue-500 shrink-0" />}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Assign Doctor Dropdown */}
            {action === 'assignDoctor' && (
              <div className="mb-4">
                <label className={`block text-xs font-semibold mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Select Verified Doctor</label>
                {availableDoctors.length === 0 ? (
                  <div className={`text-center py-6 rounded-xl border-2 border-dashed ${isDarkMode ? 'border-gray-700 text-gray-500' : 'border-gray-200 text-gray-400'}`}>
                    <UserCheck className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p className="text-sm font-medium">No verified doctors available</p>
                    <p className="text-xs mt-1">Verify doctors first to assign them</p>
                  </div>
                ) : (
                  <div className="relative">
                    <div
                      onClick={() => setIsDoctorDropdownOpen(!isDoctorDropdownOpen)}
                      className={`flex items-center justify-between w-full px-4 py-3 rounded-xl border-2 text-sm cursor-pointer transition-all duration-300 ${isDarkMode
                          ? `bg-gray-800/50 border-gray-700 text-white ${isDoctorDropdownOpen ? 'border-indigo-500 ring-2 ring-indigo-500/20' : 'hover:border-indigo-500/50'}`
                          : `bg-white border-gray-200 text-gray-900 ${isDoctorDropdownOpen ? 'border-indigo-400 ring-2 ring-indigo-400/20' : 'hover:border-indigo-400'}`
                        }`}
                    >
                      <div className="flex items-center gap-2">
                        {selectedDoctor ? (
                          <>
                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white bg-gradient-to-br from-indigo-500 to-purple-500`}>
                              {selectedDoctor.firstName?.charAt(0)}
                            </div>
                            <div>
                              <p className="font-medium">{selectedDoctor.firstName} {selectedDoctor.lastName}</p>
                              <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>{selectedDoctor.specialization || selectedDoctor.email}</p>
                            </div>
                          </>
                        ) : (
                          <span className={isDarkMode ? 'text-gray-500' : 'text-gray-400'}>Choose a verified doctor...</span>
                        )}
                      </div>
                      <ChevronRight size={16} className={`transition-transform duration-300 ${isDoctorDropdownOpen ? 'rotate-90' : ''} ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    </div>

                    {/* Dropdown List */}
                    <div className={`absolute top-full left-0 z-50 w-full mt-2 rounded-xl border overflow-hidden shadow-xl transition-all duration-300 max-h-48 overflow-y-auto ${isDoctorDropdownOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
                      } ${isDarkMode ? 'bg-gray-800 border-gray-700 shadow-black/50' : 'bg-white border-gray-100 shadow-indigo-500/10'}`}>
                      {availableDoctors.map(doc => (
                        <div
                          key={doc._id}
                          onClick={() => { setSelectedDoctorId(doc._id); setIsDoctorDropdownOpen(false); }}
                          className={`flex items-center gap-3 p-3 cursor-pointer transition-colors ${selectedDoctorId === doc._id
                              ? (isDarkMode ? 'bg-indigo-900/30' : 'bg-indigo-50')
                              : (isDarkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50')
                            }`}
                        >
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white bg-gradient-to-br from-indigo-500 to-purple-500`}>
                            {doc.firstName?.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-semibold truncate ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{doc.firstName} {doc.lastName}</p>
                            <p className={`text-xs truncate ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>{doc.specialization || doc.email}</p>
                          </div>
                          {selectedDoctorId === doc._id && <CheckCircle size={16} className="text-indigo-500 shrink-0" />}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Warning for destructive actions */}
            {(action === 'delete' || action === 'suspend') && (
              <div className={`flex items-start gap-3 p-3 rounded-xl mb-4 ${action === 'delete'
                  ? (isDarkMode ? 'bg-rose-900/20 border border-rose-800/30' : 'bg-rose-50 border border-rose-200')
                  : (isDarkMode ? 'bg-amber-900/20 border border-amber-800/30' : 'bg-amber-50 border border-amber-200')
                }`}>
                <AlertTriangle size={18} className={action === 'delete' ? 'text-rose-500 shrink-0 mt-0.5' : 'text-amber-500 shrink-0 mt-0.5'} />
                <p className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {action === 'delete' ? 'This action is permanent and cannot be undone. All user data will be removed.' : 'The user will lose access until their account is reactivated by an administrator.'}
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className={`p-5 border-t flex justify-end gap-3 ${isDarkMode ? 'border-gray-800 bg-gray-900/50' : 'border-gray-100 bg-gray-50/50'}`}>
            <button onClick={onClose} className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${isDarkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-200'}`}>
              Cancel
            </button>
            <button
              onClick={handleAction}
              disabled={isLoading || (action === 'assign' && !selectedCaregiverId)}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:scale-105 shadow-lg bg-gradient-to-r ${cs.btn} disabled:opacity-50 disabled:hover:scale-100`}
            >
              {isLoading ? 'Processing...' : config.btn}
            </button>
          </div>
        </div>
      </div>,
      document.body
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <GlassCard color="emerald" hoverable={false} darkMode={isDarkMode}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex-1">
            <h1 className={`text-3xl font-bold mb-2 bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent`}>
              Manage Users
            </h1>
            <p className={`text-lg ${isDarkMode ? 'text-emerald-200/80' : 'text-emerald-700/80'}`}>
              Manage user accounts, permissions, and roles across the platform
            </p>
          </div>
          <div className="flex gap-3">
            <GlowingButton
              icon={<UserPlus className="w-4 h-4" />}
              color="emerald"
              size="md"
              onClick={() => setShowAddUserModal(true)}
              isDarkMode={isDarkMode}
            >
              Add New User
            </GlowingButton>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${isDarkMode ? 'bg-emerald-950/40 border border-emerald-900/30' : 'bg-gradient-to-r from-emerald-100 to-teal-100 border border-emerald-200'
              }`}>
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className={`text-sm font-medium ${isDarkMode ? 'text-emerald-300' : 'text-emerald-700'}`}>
                Total: {users.length} users
              </span>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Bulk Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-2">
        <input type="file" id="import-users-file" className="hidden" accept=".csv" onChange={async (e) => {
          if (e.target.files.length > 0) {
            const fileName = e.target.files[0].name;
            showToast(`Imported users from ${fileName}. (Mock implementation)`, 'success');
            e.target.value = '';
            try {
              const api = (await import('../../../../services/api')).default;
              await api.post('/admin/system/activity-log', { title: 'CSV Import', message: `Administrator uploaded bulk user data via ${fileName}.` });
              fetchDashboardStats(true);
            } catch (error) { console.error('Logging failed', error); }
          }
        }} />
        <button
          onClick={() => document.getElementById('import-users-file')?.click()}
          className={`flex items-center justify-center gap-2 p-4 rounded-xl font-bold text-white transition-all transform hover:scale-[1.02] hover:shadow-lg bg-gradient-to-r from-blue-500 to-blue-600 shadow-blue-500/20`}>
          <Upload size={18} /> Import Elderly Users (CSV)
        </button>
        <button
          onClick={async () => {
            const csvHeader = "ID,Name,Email,Phone,Role,Status,Last Login,Account Created\n";
            const csvRows = dbUsers.all.map(u => {
              const safePhone = u.phone || 'N/A';
              const safeName = `${u.firstName || ''} ${u.lastName || ''}`.trim();
              const safeLastLogin = u.lastLogin ? new Date(u.lastLogin).toLocaleString() : 'Never';
              const safeCreatedAt = u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Unknown';
              return `${u._id || ''},${safeName},${u.email},${safePhone},${u.role},${u.status},"${safeLastLogin}","${safeCreatedAt}"`;
            }).join("\n");
            const csvContent = "data:text/csv;charset=utf-8," + csvHeader + csvRows;
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "aegiscare_detailed_users.csv");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            try {
              const api = (await import('../../../../services/api')).default;
              await api.post('/admin/system/activity-log', { title: 'CSV Export', message: `Administrator generated a detailed CSV report of ${users.length} users.` });
              fetchDashboardStats(true);
            } catch (error) { console.error('Logging failed', error); }
          }}
          className={`flex items-center justify-center gap-2 p-4 rounded-xl font-bold text-white transition-all transform hover:scale-[1.02] hover:shadow-lg bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-emerald-500/20`}>
          <Download size={18} /> Export User List
        </button>
        <button
          onClick={() => {
            showConfirm("Batch Verify Doctors", "Are you sure you want to verify all pending doctor accounts simultaneously? This action will grant them immediate system access.", async () => {
              try {
                const api = (await import('../../../../services/api')).default;
                await api.post('/admin/users/bulk-verify');
                fetchUsers(true); fetchDashboardStats(true);
                showToast("All pending doctors have been verified.", "success");
              } catch (e) { console.error(e); }
            }, { confirmText: "Verify All", color: "amber" });
          }}
          className={`flex items-center justify-center gap-2 p-4 rounded-xl font-bold text-white transition-all transform hover:scale-[1.02] hover:shadow-lg bg-gradient-to-r from-amber-500 to-orange-500 shadow-amber-500/20`}>
          <UserCheck size={18} /> Batch Verify Doctors
        </button>
        <button
          onClick={() => {
            showConfirm("Remove Inactive Users", "Are you sure you want to permanently delete all users who have been inactive for more than 30 consecutive days? This action cannot be undone.", async () => {
              try {
                const api = (await import('../../../../services/api')).default;
                await api.delete('/admin/users/bulk-remove');
                fetchUsers(true); fetchDashboardStats(true);
                showToast("Inactive users pruned successfully.", "success");
              } catch (e) { console.error(e); }
            }, { confirmText: "Delete Users", color: "rose" });
          }}
          className={`flex items-center justify-center gap-2 p-4 rounded-xl font-bold text-white transition-all transform hover:scale-[1.02] hover:shadow-lg bg-gradient-to-r from-rose-500 to-red-600 shadow-rose-500/20`}>
          <UserMinus size={18} /> Remove Inactive Users
        </button>
      </div>

      {/* Filters and Search */}
      <GlassCard color="emerald" darkMode={isDarkMode}>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} size={20} />
              <input
                type="text"
               
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 rounded-xl border ${isDarkMode
                  ? 'bg-gray-900/50 border-gray-800 text-white placeholder-gray-500'
                  : 'bg-white/50 border-gray-200 text-gray-900 placeholder-gray-400'
                  } focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300`}
              />
            </div>
          </div>
          <div className="flex gap-2">
            {['all', 'active', 'pending', 'verified', 'inactive'].map((filterOption) => (
              <button
                key={filterOption}
                onClick={() => setFilter(filterOption)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 capitalize ${filter === filterOption
                  ? isDarkMode
                    ? 'bg-emerald-600 text-white'
                    : 'bg-emerald-500 text-white'
                  : isDarkMode
                    ? 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                {filterOption}
              </button>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* Users Table */}
      <GlassCard color="emerald" darkMode={isDarkMode}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b-2 ${isDarkMode ? 'border-gray-800' : 'border-emerald-100'}`}>
                {['User', 'Phone', 'Role', 'Status', 'Last Login', 'Joined'].map(h => (
                  <th key={h} className={`py-3.5 px-4 text-left text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>{h}</th>
                ))}
                <th className={`py-3.5 px-4 text-center text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, idx) => (
                <tr key={user.id} className={`border-b transition-colors duration-200 ${isDarkMode ? 'border-gray-800/40 hover:bg-gray-800/30' : 'border-gray-100 hover:bg-emerald-50/30'}`}>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white bg-gradient-to-br ${getGradient(user.color)} shadow-sm`}>
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className={`font-semibold text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{user.name}</div>
                        <div className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className={`py-3.5 px-4 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {user.phone}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold capitalize ${user.role === 'elderly' ? (isDarkMode ? 'bg-purple-900/40 text-purple-300' : 'bg-purple-100 text-purple-700') :
                        user.role === 'doctor' ? (isDarkMode ? 'bg-emerald-900/40 text-emerald-300' : 'bg-emerald-100 text-emerald-700') :
                          user.role === 'caregiver' ? (isDarkMode ? 'bg-blue-900/40 text-blue-300' : 'bg-blue-100 text-blue-700') :
                            (isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700')
                      }`}>
                      {user.role === 'elderly' && <Activity size={10} />}
                      {user.role === 'doctor' && <UserCheck size={10} />}
                      {user.role === 'caregiver' && <UserIcon size={10} />}
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold capitalize ${user.status === 'active' ? (isDarkMode ? 'bg-emerald-900/40 text-emerald-300' : 'bg-emerald-100 text-emerald-700') :
                        user.status === 'verified' ? (isDarkMode ? 'bg-blue-900/40 text-blue-300' : 'bg-blue-100 text-blue-700') :
                          user.status === 'pending' ? (isDarkMode ? 'bg-amber-900/40 text-amber-300' : 'bg-amber-100 text-amber-700') :
                            (isDarkMode ? 'bg-rose-900/40 text-rose-300' : 'bg-rose-100 text-rose-700')
                      }`}>
                      {user.status === 'active' && <CheckCircle size={10} />}
                      {user.status === 'verified' && <ShieldCheck size={10} />}
                      {user.status === 'pending' && <Clock size={10} />}
                      {user.status === 'inactive' && <UserX size={10} />}
                      {user.status}
                    </span>
                  </td>
                  <td className={`py-3.5 px-4 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {user.lastActive}
                  </td>
                  <td className={`py-3.5 px-4 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {user.joinDate}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => { setSelectedUser(user); setActionType('verify'); }}
                        className={`p-1.5 rounded-lg transition-all duration-300 hover:scale-110 ${isDarkMode ? 'bg-emerald-900/30 hover:bg-emerald-800/30 text-emerald-300' : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-700'}`}
                        title="Verify User"
                      >
                        <UserCheck size={14} />
                      </button>
                      {user.role === 'elderly' && (
                        <>
                          <button
                            onClick={() => { setSelectedUser(user); setActionType('assign'); }}
                            className={`p-1.5 rounded-lg transition-all duration-300 hover:scale-110 ${isDarkMode ? 'bg-blue-900/30 hover:bg-blue-800/30 text-blue-300' : 'bg-blue-100 hover:bg-blue-200 text-blue-700'}`}
                            title="Assign Caregiver"
                          >
                            <Users size={14} />
                          </button>
                          <button
                            onClick={() => { setSelectedUser(user); setActionType('assignDoctor'); }}
                            className={`p-1.5 rounded-lg transition-all duration-300 hover:scale-110 ${isDarkMode ? 'bg-indigo-900/30 hover:bg-indigo-800/30 text-indigo-300' : 'bg-indigo-100 hover:bg-indigo-200 text-indigo-700'}`}
                            title="Assign Doctor"
                          >
                            <Activity size={14} />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => { setSelectedUser(user); setActionType('suspend'); }}
                        className={`p-1.5 rounded-lg transition-all duration-300 hover:scale-110 ${isDarkMode ? 'bg-amber-900/30 hover:bg-amber-800/30 text-amber-300' : 'bg-amber-100 hover:bg-amber-200 text-amber-700'}`}
                        title="Suspend User"
                      >
                        <UserX size={14} />
                      </button>
                      <button
                        onClick={() => { setSelectedUser(user); setActionType('delete'); }}
                        className={`p-1.5 rounded-lg transition-all duration-300 hover:scale-110 ${isDarkMode ? 'bg-rose-900/30 hover:bg-rose-800/30 text-rose-300' : 'bg-rose-100 hover:bg-rose-200 text-rose-700'}`}
                        title="Delete User"
                      >
                        <UserMinus size={14} />
                      </button>
                      <div className="relative">
                        <button
                          onClick={() => setMoreMenuUserId(moreMenuUserId === user.id ? null : user.id)}
                          className={`p-1.5 rounded-lg transition-all duration-300 hover:scale-110 ${isDarkMode ? 'bg-gray-800/50 hover:bg-gray-700/50 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                          title="More Options"
                        >
                          <MoreVertical size={14} />
                        </button>
                        {moreMenuUserId === user.id && (
                          <div className={`absolute right-0 top-full mt-1 z-50 w-48 rounded-xl border shadow-xl overflow-hidden ${isDarkMode ? 'bg-gray-800 border-gray-700 shadow-black/50' : 'bg-white border-gray-100 shadow-lg'}`}>
                            <button onClick={() => { navigator.clipboard.writeText(user.email); showToast('Email copied!', 'success'); setMoreMenuUserId(null); }}
                              className={`w-full flex items-center gap-2 px-4 py-2.5 text-xs font-medium transition-colors ${isDarkMode ? 'text-gray-300 hover:bg-gray-700/50' : 'text-gray-700 hover:bg-gray-50'}`}>
                              <Mail size={13} /> Copy Email
                            </button>
                            <button onClick={() => { navigator.clipboard.writeText(user.phone); showToast('Phone copied!', 'success'); setMoreMenuUserId(null); }}
                              className={`w-full flex items-center gap-2 px-4 py-2.5 text-xs font-medium transition-colors ${isDarkMode ? 'text-gray-300 hover:bg-gray-700/50' : 'text-gray-700 hover:bg-gray-50'}`}>
                              <Phone size={13} /> Copy Phone
                            </button>
                            <div className={`border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`} />
                            <button onClick={() => { setSelectedUser(user); setActionType('verify'); setMoreMenuUserId(null); }}
                              className={`w-full flex items-center gap-2 px-4 py-2.5 text-xs font-medium transition-colors ${isDarkMode ? 'text-emerald-400 hover:bg-gray-700/50' : 'text-emerald-600 hover:bg-emerald-50'}`}>
                              <CheckCircle size={13} /> Mark as Verified
                            </button>
                            {user.role === 'elderly' && (
                              <>
                                <button onClick={() => { setSelectedUser(user); setActionType('assign'); setMoreMenuUserId(null); }}
                                  className={`w-full flex items-center gap-2 px-4 py-2.5 text-xs font-medium transition-colors ${isDarkMode ? 'text-blue-400 hover:bg-gray-700/50' : 'text-blue-600 hover:bg-blue-50'}`}>
                                  <Users size={13} /> Assign Caregiver
                                </button>
                                <button onClick={() => { setSelectedUser(user); setActionType('assignDoctor'); setMoreMenuUserId(null); }}
                                  className={`w-full flex items-center gap-2 px-4 py-2.5 text-xs font-medium transition-colors ${isDarkMode ? 'text-indigo-400 hover:bg-gray-700/50' : 'text-indigo-600 hover:bg-indigo-50'}`}>
                                  <Activity size={13} /> Assign Doctor
                                </button>
                              </>
                            )}
                            <button onClick={() => { setSelectedUser(user); setActionType('delete'); setMoreMenuUserId(null); }}
                              className={`w-full flex items-center gap-2 px-4 py-2.5 text-xs font-medium transition-colors ${isDarkMode ? 'text-rose-400 hover:bg-gray-700/50' : 'text-rose-600 hover:bg-rose-50'}`}>
                              <UserMinus size={13} /> Delete User
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Doctor Verification Section */}
      <GlassCard color="blue" darkMode={isDarkMode}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className={`text-xl font-bold mb-1 flex items-center gap-2 ${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`}>
              <UserCheck className="w-6 h-6 animate-pulse" />
              Doctor Verification Requests
            </h3>
            <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
              {doctors.filter(d => d.status === 'pending').length} doctors pending verification
            </p>
          </div>
          <GlowingButton
            icon={<ShieldCheck className="w-4 h-4" />}
            color="blue"
            size="md"
            isDarkMode={isDarkMode}
            onClick={async () => {
              try {
                const api = (await import('../../../../services/api')).default;
                await api.post('/admin/users/bulk-verify');
                fetchUsers(true); fetchDashboardStats(true);
              } catch (e) { console.error(e); }
            }}
          >
            Verify All
          </GlowingButton>
        </div>

        {doctors.filter(d => d.status === 'pending').length === 0 ? (
          <div className={`text-center py-12 rounded-2xl border-2 border-dashed ${isDarkMode ? 'border-gray-800 text-gray-500' : 'border-gray-200 text-gray-400'}`}>
            <ShieldCheck className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">All doctors are verified!</p>
            <p className="text-sm mt-1">No pending verification requests</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {doctors.filter(d => d.status === 'pending').map((doctor, idx) => (
              <AnimatedCard key={doctor.id} delay={idx}>
                <div className={`p-5 rounded-2xl border-2 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 ${isDarkMode ? 'bg-gradient-to-br from-gray-800/60 to-blue-950/30 border-gray-700/50' : 'bg-gradient-to-br from-white to-blue-50/50 border-gray-100 shadow-sm'}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br ${isDarkMode ? 'from-blue-900/50 to-cyan-900/50' : 'from-blue-100 to-cyan-100'}`}>
                        <UserCheck className={`w-6 h-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                      </div>
                      <div>
                        <h4 className={`font-bold text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>{doctor.name}</h4>
                        <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>{doctor.specialty}</p>
                      </div>
                    </div>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${isDarkMode ? 'bg-amber-900/30 text-amber-300' : 'bg-amber-100 text-amber-700'}`}>
                      Pending
                    </span>
                  </div>
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={async () => {
                        try {
                          const api = (await import('../../../../services/api')).default;
                          await api.put(`/admin/users/${doctor.id}/status`, { status: 'verified' });
                          fetchUsers(true); fetchDashboardStats(true);
                        } catch (e) { console.error(e); }
                      }}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 hover:scale-105 hover:shadow-md bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-emerald-500/20"
                    >
                      <CheckCircle size={14} /> Verify
                    </button>
                    <button
                      onClick={async () => {
                        try {
                          const api = (await import('../../../../services/api')).default;
                          await api.put(`/admin/users/${doctor.id}/status`, { status: 'inactive' });
                          fetchUsers(true); fetchDashboardStats(true);
                        } catch (e) { console.error(e); }
                      }}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 hover:scale-105 hover:shadow-md bg-gradient-to-r from-rose-500 to-red-500 text-white shadow-rose-500/20"
                    >
                      <XCircle size={14} /> Reject
                    </button>
                  </div>
                </div>
              </AnimatedCard>
            ))}
          </div>
        )}
      </GlassCard>

      {/* Footer */}
      <BeautifulFooter isDarkMode={isDarkMode} setActiveModule={setActiveModule} />

      {/* Action Modal */}
      {selectedUser && actionType && (
        <UserActionModal
          user={selectedUser}
          action={actionType}
          onClose={() => { setSelectedUser(null); setActionType(null); }}
        />
      )}

      {/* Add New User Modal */}
      {showAddUserModal && <AddNewUserModal onClose={() => setShowAddUserModal(false)} isDarkMode={isDarkMode} showToast={showToast} fetchUsers={fetchUsers} fetchDashboardStats={fetchDashboardStats} />}
    </div>
  );
};

export default ManageUsers;
