import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Check, AlertCircle } from 'lucide-react';

const GlobalToast = ({ isDarkMode }) => {
  const [toastMessage, setToastMessage] = useState({ show: false, message: '', type: 'success' });

  useEffect(() => {
    const handleToast = (e) => {
      setToastMessage({ show: true, message: e.detail.message, type: e.detail.type });
      setTimeout(() => setToastMessage(prev => ({ ...prev, show: false })), 3500);
    };
    window.addEventListener('showToast', handleToast);
    return () => window.removeEventListener('showToast', handleToast);
  }, []);

  if (!toastMessage.show) return null;

  return createPortal(
    <div style={{ animation: 'slide-in-right 0.3s ease-out forwards' }} className={`fixed top-6 right-6 z-[99999] px-6 py-4 rounded-xl shadow-2xl font-medium flex items-center gap-3 border ${
      toastMessage.type === 'success' 
        ? (isDarkMode ? 'bg-emerald-900 border-emerald-800 text-emerald-100' : 'bg-emerald-100 border-emerald-200 text-emerald-800')
        : (isDarkMode ? 'bg-rose-900 border-rose-800 text-rose-100' : 'bg-rose-100 border-rose-200 text-rose-800')
    }`}>
      {toastMessage.type === 'success' ? <Check className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
      <span className="text-sm">{toastMessage.message}</span>
    </div>,
    document.body
  );
};

export default GlobalToast;
