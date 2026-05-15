import React, { useState, useEffect } from 'react';
import { 
  User, Mail, Lock, Eye, EyeOff, Save, CheckCircle, 
  AlertCircle, Settings as SettingsIcon, Shield, Edit3, 
  Loader, X, Key
} from 'lucide-react';
import api from '../services/api';

// --- Moved OUTSIDE SettingsPage to avoid re-creation on every render ---

const Card = ({ children, className = '', isDarkMode }) => (
  <div className={`rounded-2xl p-6 backdrop-blur-xl border transition-all duration-500 ${
    isDarkMode
      ? 'bg-gradient-to-br from-gray-900/60 via-gray-800/40 to-gray-900/60 border-gray-700/40 shadow-2xl shadow-black/20'
      : 'bg-gradient-to-br from-white/95 via-white/90 to-white/95 border-gray-200/60 shadow-xl shadow-gray-200/30'
  } ${className}`}>
    {children}
  </div>
);

const InputField = ({ label, icon: Icon, type = 'text', value, onChange, placeholder, showToggle, isVisible, onToggle, disabled = false, isDarkMode }) => (
  <div className="space-y-2">
    <label className={`text-sm font-semibold flex items-center gap-2 ${
      isDarkMode ? 'text-gray-300' : 'text-gray-700'
    }`}>
      <Icon size={16} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
      {label}
    </label>
    <div className="relative">
      <input
        type={showToggle ? (isVisible ? 'text' : 'password') : type}
        value={value}
        onChange={onChange}
       
        disabled={disabled}
        className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none ${
          isDarkMode
            ? 'bg-gray-800/60 border-gray-700/50 text-white placeholder-gray-500 disabled:bg-gray-800/30 disabled:text-gray-500'
            : 'bg-gray-50/80 border-gray-200 text-gray-900 placeholder-gray-400 disabled:bg-gray-100 disabled:text-gray-400'
        } ${disabled ? 'cursor-not-allowed opacity-60' : ''}`}
      />
      {showToggle && (
        <button
          type="button"
          onClick={onToggle}
          className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg transition-all duration-200 hover:scale-110 ${
            isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {isVisible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      )}
    </div>
  </div>
);

const Alert = ({ type, message, isDarkMode }) => {
  if (!message) return null;
  const isSuccess = type === 'success';
  return (
    <div className={`flex items-center gap-3 p-4 rounded-xl border transition-all duration-300 animate-fade-in ${
      isSuccess
        ? isDarkMode
          ? 'bg-emerald-950/40 border-emerald-800/40 text-emerald-300'
          : 'bg-emerald-50 border-emerald-200 text-emerald-700'
        : isDarkMode
          ? 'bg-red-950/40 border-red-800/40 text-red-300'
          : 'bg-red-50 border-red-200 text-red-700'
    }`}>
      {isSuccess ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
};

const SubmitButton = ({ loading, children, onClick, isDarkMode }) => (
  <button
    type="submit"
    onClick={onClick}
    disabled={loading}
    className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 ${
      isDarkMode
        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-900/30'
        : 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 shadow-lg shadow-blue-200/50'
    }`}
  >
    {loading ? <Loader size={18} className="animate-spin" /> : <Save size={18} />}
    {loading ? 'Saving...' : children}
  </button>
);

const SettingsPage = ({ isDarkMode = false }) => {
  // State for profile/name update
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');

  // State for email update
  const [emailData, setEmailData] = useState({
    newEmail: '',
    password: '',
  });
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState('');
  const [emailError, setEmailError] = useState('');

  // State for password update
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Password visibility toggles
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showEmailPassword, setShowEmailPassword] = useState(false);

  // Current user info
  const [currentEmail, setCurrentEmail] = useState('');
  const [isGoogleAuth, setIsGoogleAuth] = useState(false);

  // Load user data on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('auth/profile');
        const user = response.data.user;
        setProfileData({ firstName: user.firstName, lastName: user.lastName });
        setCurrentEmail(user.email);
        setIsGoogleAuth(user.isGoogleAuth || false);
        // Also update localStorage
        localStorage.setItem('userFirstName', user.firstName);
        localStorage.setItem('userEmail', user.email);
      } catch (error) {
        console.error('Error fetching profile:', error);
        // Fallback to localStorage
        setProfileData({
          firstName: localStorage.getItem('userFirstName') || '',
          lastName: localStorage.getItem('userLastName') || '',
        });
        setCurrentEmail(localStorage.getItem('userEmail') || '');
        setIsGoogleAuth(localStorage.getItem('isGoogleAuth') === 'true');
      }
    };
    fetchProfile();
  }, []);

  // Clear success messages after 4 seconds
  useEffect(() => {
    if (profileSuccess) { const t = setTimeout(() => setProfileSuccess(''), 4000); return () => clearTimeout(t); }
  }, [profileSuccess]);
  useEffect(() => {
    if (emailSuccess) { const t = setTimeout(() => setEmailSuccess(''), 4000); return () => clearTimeout(t); }
  }, [emailSuccess]);
  useEffect(() => {
    if (passwordSuccess) { const t = setTimeout(() => setPasswordSuccess(''), 4000); return () => clearTimeout(t); }
  }, [passwordSuccess]);

  // Handle profile/name update
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess('');

    if (!profileData.firstName.trim() || !profileData.lastName.trim()) {
      setProfileError('First name and last name are required');
      return;
    }

    setProfileLoading(true);
    try {
      const response = await api.put('auth/profile', {
        firstName: profileData.firstName.trim(),
        lastName: profileData.lastName.trim(),
      });
      setProfileSuccess('Name updated successfully!');
      localStorage.setItem('userFirstName', response.data.user.firstName);
      localStorage.setItem('userLastName', response.data.user.lastName || '');
    } catch (error) {
      setProfileError(error.response?.data?.message || 'Failed to update name');
    } finally {
      setProfileLoading(false);
    }
  };

  // Handle email update
  const handleEmailUpdate = async (e) => {
    e.preventDefault();
    setEmailError('');
    setEmailSuccess('');

    if (!emailData.newEmail.trim()) {
      setEmailError('New email is required');
      return;
    }
    if (!emailData.password) {
      setEmailError('Current password is required to change email');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailData.newEmail)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    setEmailLoading(true);
    try {
      const response = await api.put('auth/update-email', {
        newEmail: emailData.newEmail.trim(),
        password: emailData.password,
      });
      setEmailSuccess('Email updated successfully!');
      setCurrentEmail(response.data.email);
      localStorage.setItem('userEmail', response.data.email);
      setEmailData({ newEmail: '', password: '' });
    } catch (error) {
      setEmailError(error.response?.data?.message || 'Failed to update email');
    } finally {
      setEmailLoading(false);
    }
  };

  // Handle password update
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setPasswordError('All password fields are required');
      return;
    }
    if (passwordData.newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters');
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    setPasswordLoading(true);
    try {
      await api.put('auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setPasswordSuccess('Password changed successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      setPasswordError(error.response?.data?.message || 'Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <Card isDarkMode={isDarkMode}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`p-4 rounded-2xl transition-all duration-300 ${
              isDarkMode 
                ? 'bg-gradient-to-br from-blue-600/20 to-indigo-600/20' 
                : 'bg-gradient-to-br from-blue-100 to-indigo-100'
            }`}>
              <SettingsIcon className={`w-8 h-8 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            </div>
            <div>
              <h1 className={`text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent`}>
                Account Settings
              </h1>
              <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Manage your name, email, and password
              </p>
            </div>
          </div>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
            isDarkMode ? 'bg-gray-800/60 border border-gray-700/40' : 'bg-gray-100 border border-gray-200'
          }`}>
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {currentEmail}
            </span>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Update Name Section */}
        <Card isDarkMode={isDarkMode}>
          <div className="flex items-center gap-3 mb-6">
            <div className={`p-2.5 rounded-xl ${
              isDarkMode ? 'bg-emerald-950/40' : 'bg-emerald-100'
            }`}>
              <User className={`w-5 h-5 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
            </div>
            <h2 className={`text-xl font-bold ${isDarkMode ? 'text-emerald-300' : 'text-emerald-700'}`}>
              Update Name
            </h2>
          </div>
          
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <InputField
              label="First Name"
              icon={User}
              value={profileData.firstName}
              onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
             
              isDarkMode={isDarkMode}
            />
            <InputField
              label="Last Name"
              icon={User}
              value={profileData.lastName}
              onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
             
              isDarkMode={isDarkMode}
            />
            <Alert type="success" message={profileSuccess} isDarkMode={isDarkMode} />
            <Alert type="error" message={profileError} isDarkMode={isDarkMode} />
            <SubmitButton loading={profileLoading} isDarkMode={isDarkMode}>Update Name</SubmitButton>
          </form>
        </Card>

        {/* Update Email Section */}
        <Card isDarkMode={isDarkMode}>
          <div className="flex items-center gap-3 mb-6">
            <div className={`p-2.5 rounded-xl ${
              isDarkMode ? 'bg-amber-950/40' : 'bg-amber-100'
            }`}>
              <Mail className={`w-5 h-5 ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`} />
            </div>
            <h2 className={`text-xl font-bold ${isDarkMode ? 'text-amber-300' : 'text-amber-700'}`}>
              Update Email
            </h2>
          </div>

          {isGoogleAuth ? (
            <div className={`flex items-center gap-3 p-4 rounded-xl border ${
              isDarkMode
                ? 'bg-yellow-950/20 border-yellow-800/30 text-yellow-300'
                : 'bg-yellow-50 border-yellow-200 text-yellow-700'
            }`}>
              <Shield size={20} />
              <span className="text-sm">Email cannot be changed for Google OAuth accounts.</span>
            </div>
          ) : (
            <form onSubmit={handleEmailUpdate} className="space-y-4">
              <div className={`flex items-center gap-2 px-4 py-3 rounded-xl border mb-2 ${
                isDarkMode ? 'bg-gray-800/40 border-gray-700/40' : 'bg-gray-50 border-gray-200'
              }`}>
                <Mail size={16} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Current: <span className="font-medium">{currentEmail}</span>
                </span>
              </div>
              <InputField
                label="New Email"
                icon={Mail}
                type="email"
                value={emailData.newEmail}
                onChange={(e) => setEmailData(prev => ({ ...prev, newEmail: e.target.value }))}
               
                isDarkMode={isDarkMode}
              />
              <InputField
                label="Current Password"
                icon={Lock}
                value={emailData.password}
                onChange={(e) => setEmailData(prev => ({ ...prev, password: e.target.value }))}
               
                showToggle
                isVisible={showEmailPassword}
                onToggle={() => setShowEmailPassword(!showEmailPassword)}
                isDarkMode={isDarkMode}
              />
              <Alert type="success" message={emailSuccess} isDarkMode={isDarkMode} />
              <Alert type="error" message={emailError} isDarkMode={isDarkMode} />
              <SubmitButton loading={emailLoading} isDarkMode={isDarkMode}>Update Email</SubmitButton>
            </form>
          )}
        </Card>
      </div>

      {/* Change Password Section - Full width */}
      <Card isDarkMode={isDarkMode}>
        <div className="flex items-center gap-3 mb-6">
          <div className={`p-2.5 rounded-xl ${
            isDarkMode ? 'bg-rose-950/40' : 'bg-rose-100'
          }`}>
            <Key className={`w-5 h-5 ${isDarkMode ? 'text-rose-400' : 'text-rose-600'}`} />
          </div>
          <h2 className={`text-xl font-bold ${isDarkMode ? 'text-rose-300' : 'text-rose-700'}`}>
            Change Password
          </h2>
        </div>

        {isGoogleAuth ? (
          <div className={`flex items-center gap-3 p-4 rounded-xl border ${
            isDarkMode
              ? 'bg-yellow-950/20 border-yellow-800/30 text-yellow-300'
              : 'bg-yellow-50 border-yellow-200 text-yellow-700'
          }`}>
            <Shield size={20} />
            <span className="text-sm">Password cannot be changed for Google OAuth accounts.</span>
          </div>
        ) : (
          <form onSubmit={handlePasswordUpdate}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InputField
                label="Current Password"
                icon={Lock}
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
               
                showToggle
                isVisible={showCurrentPassword}
                onToggle={() => setShowCurrentPassword(!showCurrentPassword)}
                isDarkMode={isDarkMode}
              />
              <InputField
                label="New Password"
                icon={Lock}
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
               
                showToggle
                isVisible={showNewPassword}
                onToggle={() => setShowNewPassword(!showNewPassword)}
                isDarkMode={isDarkMode}
              />
              <InputField
                label="Confirm New Password"
                icon={Lock}
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
               
                showToggle
                isVisible={showConfirmPassword}
                onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
                isDarkMode={isDarkMode}
              />
            </div>
            
            {/* Password strength indicator */}
            {passwordData.newPassword && (
              <div className="mt-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Password strength:
                  </span>
                  <span className={`text-xs font-bold ${
                    passwordData.newPassword.length >= 12 
                      ? 'text-emerald-500' 
                      : passwordData.newPassword.length >= 8 
                        ? 'text-amber-500' 
                        : 'text-red-500'
                  }`}>
                    {passwordData.newPassword.length >= 12 ? 'Strong' : passwordData.newPassword.length >= 8 ? 'Medium' : 'Weak'}
                  </span>
                </div>
                <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-500 ${
                    passwordData.newPassword.length >= 12 
                      ? 'w-full bg-emerald-500' 
                      : passwordData.newPassword.length >= 8 
                        ? 'w-2/3 bg-amber-500' 
                        : 'w-1/3 bg-red-500'
                  }`}></div>
                </div>
              </div>
            )}

            <div className="mt-6 space-y-4">
              <Alert type="success" message={passwordSuccess} isDarkMode={isDarkMode} />
              <Alert type="error" message={passwordError} isDarkMode={isDarkMode} />
              <SubmitButton loading={passwordLoading} isDarkMode={isDarkMode}>Change Password</SubmitButton>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
};

export default SettingsPage;
