import React from 'react';

const GlassCard = ({ children, className = '', hoverable = true, color = 'blue', darkMode }) => {
    const colorClass = {
      blue: 'border-blue-200/50 dark:border-blue-800/30',
      emerald: 'border-emerald-200/50 dark:border-emerald-800/30',
      purple: 'border-purple-200/50 dark:border-purple-800/30',
      amber: 'border-amber-200/50 dark:border-amber-800/30',
      rose: 'border-rose-200/50 dark:border-rose-800/30',
      indigo: 'border-indigo-200/50 dark:border-indigo-800/30',
      cyan: 'border-cyan-200/50 dark:border-cyan-800/30',
      green: 'border-green-200/50 dark:border-green-800/30',
      teal: 'border-teal-200/50 dark:border-teal-800/30',
      violet: 'border-violet-200/50 dark:border-violet-800/30',
      red: 'border-red-200/50 dark:border-red-800/30',
      pink: 'border-pink-200/50 dark:border-pink-800/30',
      orange: 'border-orange-200/50 dark:border-orange-800/30',
    };

    return (
      <div className={`
        backdrop-blur-xl border-2 rounded-3xl p-6 transition-all duration-300
        ${hoverable ? 'hover:scale-[1.02] hover:shadow-2xl' : ''}
        ${darkMode 
          ? 'bg-gradient-to-br from-gray-950/40 via-gray-900/30 to-gray-950/40' 
          : 'bg-gradient-to-br from-white/90 via-white/80 to-white/90'
        }
        ${colorClass[color] || colorClass.blue}
        ${className}
      `}>
        {children}
      </div>
    );
};

export default GlassCard;
