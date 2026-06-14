import React from 'react';

const GlowingButton = ({ children, icon, color = 'blue', className = '', onClick, size = 'md', isDarkMode }) => {
  const sizeClass = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5',
    lg: 'px-6 py-3 text-lg'
  };

  const colorClass = {
    blue: isDarkMode
      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700'
      : 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600',
    emerald: isDarkMode
      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700'
      : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600',
    purple: isDarkMode
      ? 'bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700'
      : 'bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600',
    amber: isDarkMode
      ? 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700'
      : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600',
    rose: isDarkMode
      ? 'bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700'
      : 'bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600',
    indigo: isDarkMode
      ? 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700'
      : 'bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600'
  };

  const shadowColor = {
    blue: isDarkMode ? 'rgba(59, 130, 246, 0.35)' : 'rgba(59, 130, 246, 0.25)',
    emerald: isDarkMode ? 'rgba(16, 185, 129, 0.35)' : 'rgba(16, 185, 129, 0.25)',
    purple: isDarkMode ? 'rgba(139, 92, 246, 0.35)' : 'rgba(139, 92, 246, 0.25)',
    amber: isDarkMode ? 'rgba(245, 158, 11, 0.35)' : 'rgba(245, 158, 11, 0.25)',
    rose: isDarkMode ? 'rgba(244, 114, 182, 0.35)' : 'rgba(244, 114, 182, 0.25)',
    indigo: isDarkMode ? 'rgba(99, 102, 241, 0.35)' : 'rgba(99, 102, 241, 0.25)'
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        relative overflow-hidden group ${sizeClass[size]} ${colorClass[color] || colorClass.blue}
        text-white font-medium rounded-xl transition-all duration-300
        hover:scale-105 hover:shadow-lg
        active:scale-95 flex items-center gap-2 justify-center
        ${className}
      `}
      style={{
        boxShadow: `0 4px 15px ${shadowColor[color] || shadowColor.blue}`
      }}
    >
      <span className="relative z-10 flex items-center gap-2">
        {icon && <span className="group-hover:scale-110 transition-transform duration-300">{icon}</span>}
        {children}
      </span>
      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
    </button>
  );
};

export default GlowingButton;
