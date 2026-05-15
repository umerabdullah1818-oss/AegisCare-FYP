// Color gradient helper functions
export const getColorGradientDark = (color) => {
  const colorMap = {
    rose: 'from-rose-300 to-rose-500',
    emerald: 'from-emerald-300 to-emerald-500',
    blue: 'from-blue-300 to-blue-500',
    amber: 'from-amber-300 to-amber-500',
    purple: 'from-purple-300 to-purple-500',
    indigo: 'from-indigo-300 to-indigo-500',
    orange: 'from-orange-300 to-orange-500',
    cyan: 'from-cyan-300 to-cyan-500',
    green: 'from-green-300 to-green-500',
    teal: 'from-teal-300 to-teal-500',
    red: 'from-red-300 to-red-500'
  };
  return `bg-gradient-to-r ${colorMap[color] || 'from-rose-300 to-rose-500'}`;
};

export const getColorGradientLight = (color) => {
  const colorMap = {
    rose: 'from-rose-600 to-rose-800',
    emerald: 'from-emerald-600 to-emerald-800',
    blue: 'from-blue-600 to-blue-800',
    amber: 'from-amber-600 to-amber-800',
    purple: 'from-purple-600 to-purple-800',
    indigo: 'from-indigo-600 to-indigo-800',
    orange: 'from-orange-600 to-orange-800',
    cyan: 'from-cyan-600 to-cyan-800',
    green: 'from-green-600 to-green-800',
    teal: 'from-teal-600 to-teal-800',
    red: 'from-red-600 to-red-800'
  };
  return `bg-gradient-to-r ${colorMap[color] || 'from-rose-600 to-rose-800'}`;
};

export const getColorClass = (color, type = 'bg') => {
  const colorMap = {
    rose: { bg: 'bg-rose-100', text: 'text-rose-600', darkBg: 'bg-rose-900/40', darkText: 'text-rose-300' },
    emerald: { bg: 'bg-emerald-100', text: 'text-emerald-600', darkBg: 'bg-emerald-900/40', darkText: 'text-emerald-300' },
    blue: { bg: 'bg-blue-100', text: 'text-blue-600', darkBg: 'bg-blue-900/40', darkText: 'text-blue-300' },
    amber: { bg: 'bg-amber-100', text: 'text-amber-600', darkBg: 'bg-amber-900/40', darkText: 'text-amber-300' },
    purple: { bg: 'bg-purple-100', text: 'text-purple-600', darkBg: 'bg-purple-900/40', darkText: 'text-purple-300' },
    indigo: { bg: 'bg-indigo-100', text: 'text-indigo-600', darkBg: 'bg-indigo-900/40', darkText: 'text-indigo-300' },
    orange: { bg: 'bg-orange-100', text: 'text-orange-600', darkBg: 'bg-orange-900/40', darkText: 'text-orange-300' },
    cyan: { bg: 'bg-cyan-100', text: 'text-cyan-600', darkBg: 'bg-cyan-900/40', darkText: 'text-cyan-300' },
    green: { bg: 'bg-green-100', text: 'text-green-600', darkBg: 'bg-green-900/40', darkText: 'text-green-300' },
    teal: { bg: 'bg-teal-100', text: 'text-teal-600', darkBg: 'bg-teal-900/40', darkText: 'text-teal-300' },
    red: { bg: 'bg-red-100', text: 'text-red-600', darkBg: 'bg-red-900/40', darkText: 'text-red-300' }
  };
  return colorMap[color]?.[type] || colorMap.rose[type];
};
