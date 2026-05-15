// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import GoogleRoleSelection from './pages/GoogleRoleSelection';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import Elderly from './pages/Dashboards/ElderlyDashboard/Elderly';
import Doctor from './pages/Dashboards/DoctorDashboard/Doctor';
import Caregiver from './pages/Dashboards/CaregiverDashboard/Caregiver';
import Admin from './pages/Dashboards/AdminDashboard/Admin';
import Navbar from './components/Navbar';
// Add these imports with other page imports
import AboutUs from './pages/AboutUs';
import Services from './pages/Services';
import ContactUs from './pages/ContactUs';
import ProfilePage from './components/ProfilePage';
import HelpSupportPage from './components/HelpSupportPage';
import SettingsPage from './components/SettingsPage';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';

// Helper to check if current path is a dashboard
const useIsDashboardPage = () => {
  const location = useLocation();
  const dashboardPaths = [
    '/elderly-dashboard',
    '/doctor-dashboard',
    '/caregiver-dashboard',
    '/admin-dashboard',
    '/elderly-profile',
    '/doctor-profile',
    '/caregiver-profile',
    '/admin-profile',
    '/elderly-help',
    '/doctor-help',
    '/caregiver-help',
    '/admin-help',
    '/doctor-settings',
    '/elderly-settings',
    '/caregiver-settings',
    '/admin-settings',
    '/terms-of-service',
    '/privacy-policy'
  ];
  return dashboardPaths.includes(location.pathname);
};

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const userRole = localStorage.getItem('userRole');
  const isGoogleAuth = localStorage.getItem('isGoogleAuth') === 'true';
  
  // Clear any outdated auth if no role exists
  if (!userRole) {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userFirstName');
    return <Navigate to="/login" replace />;
  }

  // Google OAuth users cannot access admin dashboard
  if (isGoogleAuth && userRole === 'admin') {
    return <Navigate to="/elderly-dashboard" replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // Redirect to appropriate dashboard based on role
    const roleDashboards = {
      'elderly': '/elderly-dashboard',
      'doctor': '/doctor-dashboard',
      'caretaker': '/caregiver-dashboard',
      'caregiver': '/caregiver-dashboard',
      'admin': '/admin-dashboard'
    };
    
    const redirectPath = roleDashboards[userRole] || '/login';
    return <Navigate to={redirectPath} replace />;
  }
  
  return children;
};

// Logout handler to clear user data
export const handleLogout = () => {
  localStorage.removeItem('userRole');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('userFirstName');
  localStorage.removeItem('userLastName');
  localStorage.removeItem('userPhone');
  localStorage.removeItem('userSpecialization');
  localStorage.removeItem('userLicenseNumber');
  localStorage.removeItem('userRelationship');
  localStorage.removeItem('userDateOfBirth');
  localStorage.removeItem('isGoogleAuth');
  localStorage.removeItem('token');
  localStorage.removeItem('userPhoto');
  sessionStorage.clear();
  window.location.href = '/login';
};

// Main App Component
function App() {
  const [isDarkMode, setIsDarkMode] = React.useState(() => {
    const savedTheme = localStorage.getItem('aegiscare-theme');
    return savedTheme === 'dark';
  });

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => {
      const newMode = !prevMode;
      localStorage.setItem('aegiscare-theme', newMode ? 'dark' : 'light');
      return newMode;
    });
  };

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  if (!googleClientId) {
    console.warn('VITE_GOOGLE_CLIENT_ID is not configured in .env.local');
  }

  return (
    <GoogleOAuthProvider clientId={googleClientId || ''}>
      <Router>
        <div className={isDarkMode ? 'dark' : ''}>
          <AppContent 
            isDarkMode={isDarkMode}
            toggleDarkMode={toggleDarkMode}
          />
        </div>
      </Router>
    </GoogleOAuthProvider>
  );
}

// Separate component to use hooks
function AppContent({ isDarkMode, toggleDarkMode }) {
  const isDashboardPage = useIsDashboardPage();
  const navigate = useNavigate();

  React.useEffect(() => {
    const handleAuthExpired = () => {
      // Clear token and user data just to be safe
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userFirstName');
      localStorage.removeItem('userId');
      localStorage.removeItem('isGoogleAuth');
      
      // Navigate cleanly without refreshing the whole page
      navigate('/login');
    };

    window.addEventListener('auth-expired', handleAuthExpired);
    return () => window.removeEventListener('auth-expired', handleAuthExpired);
  }, [navigate]);
  
  return (
    <>
      {/* Only show main Navbar on non-dashboard pages */}
      {!isDashboardPage && (
        <Navbar 
          isDarkMode={isDarkMode} 
          onToggleDarkMode={toggleDarkMode}
          onLogout={handleLogout}
        />
      )}
      
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={
          <LandingPage 
            isDarkMode={isDarkMode}
            onToggleDarkMode={toggleDarkMode}
          />
        } />
        <Route path="/login" element={
          <LoginPage 
            isDarkMode={isDarkMode}
            onToggleDarkMode={toggleDarkMode}
          />
        } />
        <Route path="/signup" element={
          <SignupPage 
            isDarkMode={isDarkMode}
            onToggleDarkMode={toggleDarkMode}
          />
        } />
        
        <Route path="/google-role-selection" element={
          <GoogleRoleSelection 
            isDarkMode={isDarkMode}
            onToggleDarkMode={toggleDarkMode}
          />
        } />
        
        <Route path="/forgot-password" element={
          <ForgotPasswordPage isDarkMode={isDarkMode} />
        } />
        <Route path="/reset-password/:token" element={
          <ResetPasswordPage isDarkMode={isDarkMode} />
        } />
        
        {/* Dashboard Routes with Protected Access */}
        {/* These components will render their own role-specific navbars */}
        <Route path="/elderly-dashboard" element={
          <ProtectedRoute allowedRoles={['elderly']}>
            <Elderly 
              isDarkMode={isDarkMode} 
              onToggleDarkMode={toggleDarkMode}
              onLogout={handleLogout}
            />
          </ProtectedRoute>
        } />
        
        <Route path="/elderly-profile" element={
          <ProtectedRoute allowedRoles={['elderly']}>
            <ProfilePage />
          </ProtectedRoute>
        } />
        <Route path="/elderly-help" element={
          <ProtectedRoute allowedRoles={['elderly']}>
            <HelpSupportPage />
          </ProtectedRoute>
        } />

        <Route path="/doctor-profile" element={
          <ProtectedRoute allowedRoles={['doctor']}>
            <ProfilePage />
          </ProtectedRoute>
        } />
        <Route path="/doctor-help" element={
          <ProtectedRoute allowedRoles={['doctor']}>
            <HelpSupportPage />
          </ProtectedRoute>
        } />
        <Route path="/doctor-settings" element={
          <ProtectedRoute allowedRoles={['doctor']}>
            <SettingsPage />
          </ProtectedRoute>
        } />

        <Route path="/caregiver-profile" element={
          <ProtectedRoute allowedRoles={['caretaker', 'caregiver']}>
            <ProfilePage />
          </ProtectedRoute>
        } />
        <Route path="/caregiver-help" element={
          <ProtectedRoute allowedRoles={['caretaker', 'caregiver']}>
            <HelpSupportPage />
          </ProtectedRoute>
        } />
        
        <Route path="/admin-profile" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <ProfilePage />
          </ProtectedRoute>
        } />
        <Route path="/admin-help" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <HelpSupportPage />
          </ProtectedRoute>
        } />
        
      
        
        <Route path="/doctor-dashboard" element={
          <ProtectedRoute allowedRoles={['doctor']}>
            <Doctor 
              isDarkMode={isDarkMode} 
              onToggleDarkMode={toggleDarkMode}
              onLogout={handleLogout}
            />
          </ProtectedRoute>
        } />
        
        <Route path="/caregiver-dashboard" element={
          <ProtectedRoute allowedRoles={['caregiver']}>
            <Caregiver 
              isDarkMode={isDarkMode} 
              onToggleDarkMode={toggleDarkMode}
              onLogout={handleLogout}
            />
          </ProtectedRoute>
        } />
        
        <Route path="/admin-dashboard" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Admin 
              isDarkMode={isDarkMode} 
              onToggleDarkMode={toggleDarkMode}
              onLogout={handleLogout}
            />
          </ProtectedRoute>
        } />
        <Route path="/about-us" element={
    <AboutUs 
      isDarkMode={isDarkMode}
      onToggleDarkMode={toggleDarkMode}
    />
  } />
  
  <Route path="/services" element={
    <Services 
      isDarkMode={isDarkMode}
      onToggleDarkMode={toggleDarkMode}
    />
  } />
  
  <Route path="/contact-us" element={
    <ContactUs 
      isDarkMode={isDarkMode}
      onToggleDarkMode={toggleDarkMode}
    />
  } />

  <Route path="/terms-of-service" element={
    <TermsOfService 
      isDarkMode={isDarkMode}
      onToggleDarkMode={toggleDarkMode}
    />
  } />

  <Route path="/privacy-policy" element={
    <PrivacyPolicy 
      isDarkMode={isDarkMode}
      onToggleDarkMode={toggleDarkMode}
    />
  } />
        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;