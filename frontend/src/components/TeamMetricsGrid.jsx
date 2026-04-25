import React from 'react';

const metaConfig = {
  avg_lead_time_days:  { label: 'Avg Lead Time',           unit: 'days'    },
  avg_cycle_time_days: { label: 'Avg Cycle Time',           unit: 'days'    },
  bug_rate:            { label: 'Avg Bug Rate',             unit: '%'       },
  deployment_frequency:{ label: 'Avg Deployment Frequency', unit: 'deploys' },
  pr_throughput:       { label: 'Avg PR Throughput',        unit: 'PRs'     },
};

const TeamMetricsGrid = ({ baselines }) => {
  if (!baselines) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
      {Object.entries(metaConfig).map(([key, meta]) => {
        const val = baselines[key];
        if (val === undefined) return null;

        return (
          <div key={key} className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-2">
            <span className="text-xs font-medium text-gray-500">{meta.label}</span>
            <p className="text-2xl font-semibold text-gray-900">
              {typeof val === 'number' ? val.toFixed(1) : val}
              <span className="text-sm font-normal text-gray-400 ml-1">{meta.unit}</span>
            </p>
            <p className="text-xs text-gray-400">Team average · April 2026</p>
          </div>
        );
      })}
    </div>
  );
};

export default TeamMetricsGrid;