import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const MetricsChart = ({ metrics }) => {
  if (!metrics || Object.keys(metrics).length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mt-8 w-full">
        <h2 className="text-xl font-bold mb-6 text-gray-900">Performance vs. Baseline</h2>
        <p className="text-sm text-gray-500">No metric data available to render the chart.</p>
      </div>
    );
  }

  // 1. Transform the API data object into an array for Recharts
  const chartData = Object.entries(metrics)
    .filter(([key]) => key !== 'bug_rate')
    .map(([key, metric]) => ({
      name: key.replace('_', ' ').toUpperCase(),
      // We round the numbers so the tooltip looks clean
      "IC Metric": Number(metric.val.toFixed(2)),
      "Team Average": Number(metric.base.toFixed(2)),
    }));

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mt-8 h-96 w-full">
      <h2 className="text-xl font-bold mb-6 text-gray-900">Performance vs. Baseline</h2>
      
      {/* ResponsiveContainer makes the chart scale to fit our layout perfectly */}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 12, fill: '#6B7280' }} 
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            tick={{ fontSize: 12, fill: '#6B7280' }} 
            axisLine={false}
            tickLine={false}
          />
          <Tooltip 
            cursor={{ fill: '#F3F4F6' }}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
          />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
          
          {/* The two bars for comparison */}
          <Bar dataKey="IC Metric" fill="#4F46E5" radius={[4, 4, 0, 0]} maxBarSize={50} />
          <Bar dataKey="Team Average" fill="#D1D5DB" radius={[4, 4, 0, 0]} maxBarSize={50} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MetricsChart;