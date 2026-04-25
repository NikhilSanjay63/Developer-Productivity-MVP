import React from 'react';

const DeveloperSelector = ({ developers, selectedDev, setSelectedDev }) => {
  return (
    <div className="bg-white p-5 rounded-xl border border-gray-200 mb-6">
      <label className="block text-xs font-medium text-gray-500 mb-2">
        Individual Contributor
      </label>
      <div className="relative">
        <select
          className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg appearance-none bg-white focus:outline-none focus:ring-1 focus:ring-gray-400 cursor-pointer text-gray-900"
          value={selectedDev}
          onChange={(e) => setSelectedDev(e.target.value)}
        >
          <option value="">Choose a developer</option>
          {developers.map(dev => (
            <option key={dev} value={dev}>{dev}</option>
          ))}
        </select>
        {/* Custom chevron — replaces the browser-native arrow */}
        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default DeveloperSelector;