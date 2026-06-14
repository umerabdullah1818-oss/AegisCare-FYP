import React from 'react';

const GlowingButton = ({ children, icon, color = 'blue', className = '', onClick, size = 'md' }) => {
  const sizeClass = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5',
    lg: 'px-6 py-3 text-lg'
  };

  const colorClass = {
    blue: 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600',
    emerald: 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600',
    purple: 'bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600',
    amber: 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600',
    rose: 'bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600'
  };

  return (
    <button
      onClick={onClick}
      className={`
        relative overflow-hidden group ${sizeClass[size]} ${colorClass[color]}
        text-white font-medium rounded-xl transition-all duration-300
        hover:scale-105 hover:shadow-lg
        active:scale-95 flex items-center gap-2 justify-center
        ${className}
      `}
      style={{
        boxShadow: `0 4px 15px ${color === 'blue' ? 'rgba(59, 130, 246, 0.25)' :
                    color === 'emerald' ? 'rgba(16, 185, 129, 0.25)' :
                    color === 'purple' ? 'rgba(139, 92, 246, 0.25)' :
                    color === 'amber' ? 'rgba(245, 158, 11, 0.25)' :
                    'rgba(244, 114, 182, 0.25)'}`
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
