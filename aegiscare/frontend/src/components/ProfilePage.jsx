import React, { useState, useEffect } from 'react';
import {
  User, Edit, Camera, Save, Loader2, ArrowLeft, Mail, Phone,
  MapPin, Calendar, Shield, Stethoscope, Heart, UserCircle,
  CheckCircle, AlertCircle, X, Briefcase, FileText
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const roleThemes = {
  elderly: {
    gradient: 'from-rose-500 via-pink-500 to-fuchsia-600',
    lightGradient: 'from-rose-50 via-pink-50 to-fuchsia-50',
    cardBorder: 'border-rose-200',
    accent: 'text-rose-600',
    accentBg: 'bg-rose-50',
    buttonBg: 'bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700',
    editBorder: 'border-rose-400',
    editBg: 'bg-rose-50',
    icon: <Heart className="w-5 h-5" />,
    label: 'Elderly',
    dashboardPath: '/elderly-dashboard',
    avatarRing: 'ring-rose-400',
    fields: ['name', 'email', 'phone', 'dateOfBirth', 'address'],
  },
  doctor: {
    gradient: 'from-emerald-500 via-teal-500 to-cyan-600',
    lightGradient: 'from-emerald-50 via-teal-50 to-cyan-50',
    cardBorder: 'border-emerald-200',
    accent: 'text-emerald-600',
    accentBg: 'bg-emerald-50',
    buttonBg: 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700',
    editBorder: 'border-emerald-400',
    editBg: 'bg-emerald-50',
    icon: <Stethoscope className="w-5 h-5" />,
    label: 'Doctor',
    dashboardPath: '/doctor-dashboard',
    avatarRing: 'ring-emerald-400',
    fields: ['name', 'email', 'phone', 'specialization', 'licenseNumber', 'address'],
  },
  caregiver: {
    gradient: 'from-amber-500 via-orange-500 to-yellow-600',
    lightGradient: 'from-amber-50 via-orange-50 to-yellow-50',
    cardBorder: 'border-amber-200',
    accent: 'text-amber-600',
    accentBg: 'bg-amber-50',
    buttonBg: 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700',
    editBorder: 'border-amber-400',
    editBg: 'bg-amber-50',
    icon: <UserCircle className="w-5 h-5" />,
    label: 'Caregiver',
    dashboardPath: '/caregiver-dashboard',
    avatarRing: 'ring-amber-400',
    fields: ['name', 'email', 'phone', 'relationship', 'address'],
  },
  admin: {
    gradient: 'from-purple-500 via-violet-500 to-indigo-600',
    lightGradient: 'from-purple-50 via-violet-50 to-indigo-50',
    cardBorder: 'border-purple-200',
    accent: 'text-purple-600',
    accentBg: 'bg-purple-50',
    buttonBg: 'bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-indigo-700',
    editBorder: 'border-purple-400',
    editBg: 'bg-purple-50',
    icon: <Shield className="w-5 h-5" />,
    label: 'Admin',
    dashboardPath: '/admin-dashboard',
    avatarRing: 'ring-purple-400',
    fields: ['name', 'email', 'phone'],
  },
};

const fieldConfig = {
  name: { label: 'Full Name', icon: User, type: 'text', editable: true },
  email: { label: 'Email Address', icon: Mail, type: 'email', editable: false },
  phone: { label: 'Phone Number', icon: Phone, type: 'tel', editable: true },
  address: { label: 'Address', icon: MapPin, type: 'text', editable: true },
  dateOfBirth: { label: 'Date of Birth', icon: Calendar, type: 'date', editable: true },
  specialization: { label: 'Specialization', icon: Briefcase, type: 'text', editable: true },
  licenseNumber: { label: 'License Number', icon: FileText, type: 'text', editable: true },
  relationship: { label: 'Relationship', icon: Heart, type: 'text', editable: true },
};

const ProfilePage = () => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole') || 'elderly';
  const theme = roleThemes[userRole] || roleThemes.elderly;

  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [form, setForm] = useState({});
  const [toast, setToast] = useState({ show: false, type: '', message: '' });

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => setToast({ show: false, type: '', message: '' }), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const endpoint = userRole === 'admin' ? `/admin/profile/${localStorage.getItem('userId')}` : '/auth/profile';
      const res = await api.get(endpoint);
      const data = res.data.user || res.data.admin || res.data;
      setProfile(data);
      setForm(data);
      if (data.photo) {
        localStorage.setItem('userPhoto', data.photo);
      }
    } catch {
      showToast('error', 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (type, message) => {
    setToast({ show: true, type, message });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast('error', 'Image must be less than 5MB');
        return;
      }
      setPhoto(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleRemovePhoto = () => {
    setPhoto(null);
    setPreview(null);
    localStorage.removeItem('userPhoto');
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      let photoUrl = profile.photo;
      if (photo) {
        const formData = new FormData();
        formData.append('photo', photo);
        try {
          const uploadRes = await api.post('/auth/upload-photo', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          photoUrl = uploadRes.data.url;
        } catch {
          // Photo upload endpoint may not exist yet — continue saving other fields
        }
      }
      const endpoint = userRole === 'admin' ? `/admin/profile/${localStorage.getItem('userId')}` : '/auth/profile';
      await api.put(endpoint, { ...form, photo: photoUrl });
      setProfile({ ...form, photo: photoUrl });
      if (photoUrl) localStorage.setItem('userPhoto', photoUrl);
      
      // Dispatch custom event to notify navbar of photo update
      window.dispatchEvent(new Event('profilePhotoUpdated'));

      setEditMode(false);
      setPhoto(null);
      showToast('success', 'Profile updated successfully!');
    } catch {
      showToast('error', 'Failed to update profile');
    }
    setSaving(false);
  };

  const handleCancel = () => {
    setEditMode(false);
    setForm(profile);
    setPreview(null);
    setPhoto(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #f0f4ff 0%, #faf5ff 50%, #fff1f2 100%)' }}>
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-4 border-gray-200 border-t-blue-500 animate-spin"></div>
          </div>
          <p className="text-gray-500 font-medium animate-pulse">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #f0f4ff 0%, #faf5ff 50%, #fff1f2 100%)' }}>
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl">
          <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg font-medium">No profile data found</p>
          <button onClick={() => navigate(theme.dashboardPath)} className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const displayName = form.firstName
    ? `${form.firstName}${form.lastName ? ' ' + form.lastName : ''}`
    : form.name || profile.firstName || 'User';

  return (
    <div className="min-h-screen pb-12" style={{ background: 'linear-gradient(135deg, #f0f4ff 0%, #faf5ff 50%, #fff1f2 100%)' }}>
      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed top-6 right-6 z-50 animate-slideInRight">
          <div className={`flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl border backdrop-blur-md ${
            toast.type === 'success'
              ? 'bg-emerald-50/90 border-emerald-200 text-emerald-800'
              : 'bg-red-50/90 border-red-200 text-red-800'
          }`}>
            {toast.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            )}
            <span className="font-medium text-sm">{toast.message}</span>
            <button onClick={() => setToast({ show: false, type: '', message: '' })} className="ml-2 opacity-60 hover:opacity-100">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Header with gradient */}
      <div className={`relative bg-gradient-to-r ${theme.gradient} overflow-hidden`}>
        {/* Decorative circles */}
        <div className="absolute top-0 left-0 w-40 h-40 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute top-10 right-10 w-24 h-24 bg-white/10 rounded-full"></div>
        <div className="absolute bottom-0 right-1/4 w-32 h-32 bg-white/5 rounded-full translate-y-1/2"></div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-6 pb-24">
          <button
            onClick={() => navigate(theme.dashboardPath)}
            className="flex items-center gap-2 text-white/90 hover:text-white transition-all duration-300 mb-6 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Dashboard</span>
          </button>
          <div className="flex items-center gap-3">
            {theme.icon}
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">My Profile</h1>
              <p className="text-white/80 text-sm mt-1">{theme.label} Account</p>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Card - overlapping the header */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 -mt-16 relative z-10">
        <div className={`bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border ${theme.cardBorder} overflow-hidden`}>
          {/* Avatar Section */}
          <div className="flex flex-col items-center pt-8 pb-6 px-6">
            <div className="relative group">
              {/* Avatar Ring */}
              <div className={`w-32 h-32 sm:w-36 sm:h-36 rounded-full ring-4 ${theme.avatarRing} ring-offset-4 ring-offset-white overflow-hidden shadow-xl transition-transform duration-300 group-hover:scale-105`}>
                {(preview || profile?.photo || localStorage.getItem('userPhoto')) ? (
                  <img
                    src={preview || profile?.photo || localStorage.getItem('userPhoto')}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className={`w-full h-full bg-gradient-to-br ${theme.gradient} flex items-center justify-center`}>
                    <User className="w-14 h-14 sm:w-16 sm:h-16 text-white" />
                  </div>
                )}
              </div>

              {/* Camera button for photo upload */}
              {editMode && (
                <div className="absolute -bottom-1 -right-1 flex gap-1">
                  <label className={`${theme.buttonBg} text-white p-2.5 rounded-full cursor-pointer shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl`}>
                    <Camera className="w-5 h-5" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePhotoChange}
                    />
                  </label>
                  {(preview || profile.photo) && (
                    <button
                      onClick={handleRemovePhoto}
                      className="bg-red-500 hover:bg-red-600 text-white p-2.5 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
                      title="Remove photo"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              )}

              {/* Online indicator */}
              <div className="absolute top-2 right-2 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white shadow-sm"></div>
            </div>

            {/* Name & Role Badge */}
            <h2 className="mt-5 text-2xl font-bold text-gray-800">{displayName}</h2>
            <div className={`mt-2 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r ${theme.gradient} text-white text-sm font-semibold shadow-md`}>
              {theme.icon}
              <span>{theme.label}</span>
            </div>
            {profile.email && (
              <p className="mt-2 text-gray-500 text-sm flex items-center gap-1.5">
                <Mail className="w-4 h-4" />
                {profile.email}
              </p>
            )}
          </div>

          {/* Divider */}
          <div className="mx-6 border-t border-gray-100"></div>

          {/* Form Fields */}
          <div className="p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <Shield className="w-5 h-5 text-gray-400" />
                Personal Information
              </h3>
              {!editMode && (
                <button
                  onClick={() => setEditMode(true)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl ${theme.buttonBg} text-white font-semibold shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl`}
                >
                  <Edit className="w-4 h-4" />
                  Edit Profile
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {theme.fields.map((fieldKey) => {
                const config = fieldConfig[fieldKey];
                if (!config) return null;
                const IconComponent = config.icon;
                const value = fieldKey === 'name'
                  ? (form.firstName ? `${form.firstName}${form.lastName ? ' ' + form.lastName : ''}` : form.name || '')
                  : (form[fieldKey] || '');

                return (
                  <div
                    key={fieldKey}
                    className={`relative group ${fieldKey === 'address' ? 'sm:col-span-2' : ''}`}
                  >
                    <label className="block text-sm font-semibold text-gray-600 mb-1.5 flex items-center gap-1.5">
                      <IconComponent className={`w-4 h-4 ${theme.accent}`} />
                      {config.label}
                    </label>
                    <input
                      type={config.type}
                      name={fieldKey}
                      value={value}
                      onChange={handleChange}
                      disabled={!editMode || !config.editable}
                      className={`w-full px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                        editMode && config.editable
                          ? `${theme.editBorder} ${theme.editBg} focus:ring-blue-300 text-gray-800`
                          : 'border-gray-100 bg-gray-50 text-gray-600 cursor-not-allowed'
                      }`}
                     
                    />
                    {!config.editable && editMode && (
                      <p className="text-xs text-gray-400 mt-1 italic">This field cannot be edited</p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Action Buttons */}
            {editMode && (
              <div className="flex flex-col sm:flex-row justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
                <button
                  onClick={handleCancel}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold transition-all duration-300 hover:bg-gray-200 hover:scale-105"
                  type="button"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className={`flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed ${theme.buttonBg}`}
                  type="button"
                >
                  {saving ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Save className="w-5 h-5" />
                  )}
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(60px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-slideInRight {
          animation: slideInRight 0.4s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ProfilePage;
