import React from 'react';

const TeamMetricsGrid = ({ baselines }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Object.entries(baselines).map(([key, val]) => {
        const label = key.replace('_', ' ');
        return (
          <div key={key} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm transition hover:shadow-md">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-tight">
              Team Avg {label}
            </h3>
            <div className="flex items-baseline mt-2">
              <p className="text-2xl font-bold text-gray-800">
                {val.toFixed(val < 1 ? 2 : 1)}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TeamMetricsGrid;