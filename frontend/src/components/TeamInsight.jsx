import React from 'react';

const TeamInsight = ({ insight }) => {
  if (!insight) return null;

  return (
    <div className="bg-white border border-gray-100 border-l-4 border-blue-400 rounded-xl p-5 mb-6 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
          ◈ System View
        </span>
      </div>

      <p className="text-sm text-gray-700 leading-relaxed mb-4">
        {insight.summary}
      </p>

      <div className="border-t border-gray-100 pt-4">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
          Manager recommendation
        </p>
        <p className="text-sm text-gray-800 font-medium">
          {insight.recommendation}
        </p>
      </div>
    </div>
  );
};

export default TeamInsight;