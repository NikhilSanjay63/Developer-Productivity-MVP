import React from 'react';

const ActionableInsight = ({ insight }) => {
  // Determine color theme based on status
  const getTheme = (status) => {
    switch(status) {
      case 'danger': return 'bg-red-50 border-red-500 text-red-900';
      case 'warning': return 'bg-amber-50 border-amber-500 text-amber-900';
      case 'neutral':
      default: return 'bg-emerald-50 border-emerald-500 text-emerald-900';
    }
  };

  return (
    <div className={`p-6 rounded-xl border-l-8 shadow-md mb-8 ${getTheme(insight.status)}`}>
      <h2 className="text-xl font-bold mb-2 text-gray-900">The Story</h2>
      <p className="text-lg mb-4 text-gray-700 italic">"{insight.story}"</p>
      <div className="bg-white bg-opacity-60 p-4 rounded-lg">
        <span className="font-bold uppercase text-xs text-gray-500 block mb-1">Recommended Habit</span>
        <p className="text-xl font-semibold text-gray-900">🚀 {insight.action}</p>
      </div>
    </div>
  );
};

export default ActionableInsight;