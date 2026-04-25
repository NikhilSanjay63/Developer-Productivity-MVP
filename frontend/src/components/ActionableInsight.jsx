import React from 'react';

// Maps the status string from the API to visual and label config
const statusConfig = {
  danger: {
    border: 'border-red-400',
    badge:  'bg-red-50 text-red-700',
    label:  'Needs Attention',
    icon:   '⚠',
  },
  warning: {
    border: 'border-yellow-400',
    badge:  'bg-yellow-50 text-yellow-700',
    label:  'Watch This',
    icon:   '○',
  },
  neutral: {
    border: 'border-green-400',
    badge:  'bg-green-50 text-green-700',
    label:  'Healthy Flow',
    icon:   '✓',
  },
};

const ActionableInsight = ({ insight }) => {
  if (!insight) return null;

  const config = statusConfig[insight.status] || statusConfig.neutral;

  return (
    <div className={`bg-white border border-gray-100 border-l-4 ${config.border} rounded-xl p-5 mb-6 shadow-sm`}>
      {/* Status badge */}
      <div className="flex items-center gap-2 mb-3">
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${config.badge}`}>
          {config.icon} {config.label}
        </span>
      </div>

      {/* Story — what is happening and why */}
      <p className="text-sm text-gray-700 leading-relaxed mb-4">
        {insight.story}
      </p>

      {/* Divider + next step */}
      <div className="border-t border-gray-100 pt-4">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
          Recommended next step
        </p>
        <p className="text-sm text-gray-800 font-medium">
          {insight.action}
        </p>
      </div>
    </div>
  );
};

export default ActionableInsight;