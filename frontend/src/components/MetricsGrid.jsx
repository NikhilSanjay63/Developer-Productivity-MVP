import React from 'react';

const MetricsGrid = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Object.entries(metrics).map(([key, metric]) => {
        // High/Low logic: 20% buffer
        const isHigh = metric.val > (metric.base * 1.2);
        const isLow = metric.val < (metric.base * 0.8);
        
        // Format the label (e.g., 'pr_throughput' -> 'pr throughput')
        const label = key.replace('_', ' ');

        return (
          <div key={key} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm transition hover:shadow-md">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-tight">
              {label}
            </h3>
            <div className="flex items-baseline mt-2">
              <p className={`text-2xl font-bold ${isHigh ? 'text-orange-600' : isLow ? 'text-blue-600' : 'text-gray-800'}`}>
                {metric.val.toFixed(metric.val < 1 ? 2 : 1)}
              </p>
              <p className="ml-2 text-sm text-gray-400">/ avg: {metric.base.toFixed(1)}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MetricsGrid;