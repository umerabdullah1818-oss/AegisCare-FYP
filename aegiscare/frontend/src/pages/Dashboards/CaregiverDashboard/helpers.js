// Color gradient helper functions
export const getColorGradientDark = (color) => {
  const colorMap = {
    blue: 'from-blue-300 to-blue-500',
    emerald: 'from-emerald-300 to-emerald-500',
    purple: 'from-purple-300 to-purple-500',
    amber: 'from-amber-300 to-amber-500',
    rose: 'from-rose-300 to-rose-500',
    indigo: 'from-indigo-300 to-indigo-500',
    cyan: 'from-cyan-300 to-cyan-500',
    green: 'from-green-300 to-green-500',
    teal: 'from-teal-300 to-teal-500',
    violet: 'from-violet-300 to-violet-500',
    sky: 'from-sky-300 to-sky-500',
    pink: 'from-pink-300 to-pink-500',
    fuchsia: 'from-fuchsia-300 to-fuchsia-500',
    lime: 'from-lime-300 to-lime-500',
    orange: 'from-orange-300 to-orange-500'
  };
  return `bg-gradient-to-r ${colorMap[color] || 'from-blue-300 to-blue-500'}`;
};

export const getColorGradientLight = (color) => {
  const colorMap = {
    blue: 'from-blue-600 to-blue-800',
    emerald: 'from-emerald-600 to-emerald-800',
    purple: 'from-purple-600 to-purple-800',
    amber: 'from-amber-600 to-amber-800',
    rose: 'from-rose-600 to-rose-800',
    indigo: 'from-indigo-600 to-indigo-800',
    cyan: 'from-cyan-600 to-cyan-800',
    green: 'from-green-600 to-green-800',
    teal: 'from-teal-600 to-teal-800',
    violet: 'from-violet-600 to-violet-800',
    sky: 'from-sky-600 to-sky-800',
    pink: 'from-pink-600 to-pink-800',
    fuchsia: 'from-fuchsia-600 to-fuchsia-800',
    lime: 'from-lime-600 to-lime-800',
    orange: 'from-orange-600 to-orange-800'
  };
  return `bg-gradient-to-r ${colorMap[color] || 'from-blue-600 to-blue-800'}`;
};

export const getColorClass = (color, type = 'bg') => {
  const colorMap = {
    blue: { bg: 'bg-blue-100', text: 'text-blue-600', darkBg: 'bg-blue-900/40', darkText: 'text-blue-300' },
    emerald: { bg: 'bg-emerald-100', text: 'text-emerald-600', darkBg: 'bg-emerald-900/40', darkText: 'text-emerald-300' },
    purple: { bg: 'bg-purple-100', text: 'text-purple-600', darkBg: 'bg-purple-900/40', darkText: 'text-purple-300' },
    amber: { bg: 'bg-amber-100', text: 'text-amber-600', darkBg: 'bg-amber-900/40', darkText: 'text-amber-300' },
    rose: { bg: 'bg-rose-100', text: 'text-rose-600', darkBg: 'bg-rose-900/40', darkText: 'text-rose-300' },
    indigo: { bg: 'bg-indigo-100', text: 'text-indigo-600', darkBg: 'bg-indigo-900/40', darkText: 'text-indigo-300' },
    cyan: { bg: 'bg-cyan-100', text: 'text-cyan-600', darkBg: 'bg-cyan-900/40', darkText: 'text-cyan-300' },
    green: { bg: 'bg-green-100', text: 'text-green-600', darkBg: 'bg-green-900/40', darkText: 'text-green-300' },
    teal: { bg: 'bg-teal-100', text: 'text-teal-600', darkBg: 'bg-teal-900/40', darkText: 'text-teal-300' },
    violet: { bg: 'bg-violet-100', text: 'text-violet-600', darkBg: 'bg-violet-900/40', darkText: 'text-violet-300' },
    sky: { bg: 'bg-sky-100', text: 'text-sky-600', darkBg: 'bg-sky-900/40', darkText: 'text-sky-300' },
    pink: { bg: 'bg-pink-100', text: 'text-pink-600', darkBg: 'bg-pink-900/40', darkText: 'text-pink-300' },
    fuchsia: { bg: 'bg-fuchsia-100', text: 'text-fuchsia-600', darkBg: 'bg-fuchsia-900/40', darkText: 'text-fuchsia-300' },
    lime: { bg: 'bg-lime-100', text: 'text-lime-600', darkBg: 'bg-lime-900/40', darkText: 'text-lime-300' },
    orange: { bg: 'bg-orange-100', text: 'text-orange-600', darkBg: 'bg-orange-900/40', darkText: 'text-orange-300' }
  };
  return colorMap[color]?.[type] || colorMap.blue[type];
};
