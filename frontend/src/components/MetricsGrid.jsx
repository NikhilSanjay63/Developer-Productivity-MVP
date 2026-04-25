import React from 'react';

// Defines display config for each metric key returned by the API
const metaConfig = {
  lead_time:     { label: 'Lead Time',           unit: 'days',    higherIsBad: true  },
  cycle_time:    { label: 'Cycle Time',           unit: 'days',    higherIsBad: true  },
  bug_rate:      { label: 'Bug Rate',             unit: '%',       higherIsBad: true  },
  deploy_freq:   { label: 'Deployment Frequency', unit: 'deploys', higherIsBad: false },
  pr_throughput: { label: 'PR Throughput',        unit: 'PRs',     higherIsBad: false },
};

// Mirrors the backend buffer logic so card colors match the insight status
const getStatus = (val, base, higherIsBad) => {
  if (higherIsBad) {
    if (val > base * 1.20) return 'red';
    if (val > base * 1.05) return 'yellow';
    return 'green';
  } else {
    if (val < base * 0.80) return 'red';
    if (val < base * 0.95) return 'yellow';
    return 'green';
  }
};

const dotColor = {
  red:    'bg-red-400',
  yellow: 'bg-yellow-400',
  green:  'bg-green-400',
};

const MetricCard = ({ metricKey, data }) => {
  const meta = metaConfig[metricKey];
  if (!meta || !data) return null;

  const status = getStatus(data.val, data.base, meta.higherIsBad);

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-2">
      {/* Label row with status dot */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-gray-500">{meta.label}</span>
        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${dotColor[status]}`} />
      </div>

      {/* Value — large and readable */}
      <p className="text-2xl font-semibold text-gray-900">
        {typeof data.val === 'number' ? data.val.toFixed(1) : data.val}
        <span className="text-sm font-normal text-gray-400 ml-1">{meta.unit}</span>
      </p>

      {/* Team baseline for context */}
      <p className="text-xs text-gray-400">
        Team avg: {typeof data.base === 'number' ? data.base.toFixed(1) : data.base} {meta.unit}
      </p>
    </div>
  );
};

const MetricsGrid = ({ metrics }) => {
  if (!metrics) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
      {Object.entries(metrics).map(([key, data]) => (
        <MetricCard key={key} metricKey={key} data={data} />
      ))}
    </div>
  );
};

export default MetricsGrid;