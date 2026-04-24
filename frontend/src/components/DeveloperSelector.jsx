import React from 'react';

const DeveloperSelector = ({ developers, selectedDev, setSelectedDev }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm mb-8 border border-gray-200">
      <label className="block text-sm font-semibold mb-2 uppercase tracking-wider text-gray-500">
        Select Individual Contributor
      </label>
      <select 
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
        value={selectedDev}
        onChange={(e) => setSelectedDev(e.target.value)}
      >
        <option value="">-- Choose a Developer --</option>
        {developers.map(dev => (
          <option key={dev} value={dev}>{dev}</option>
        ))}
      </select>
    </div>
  );
};

export default DeveloperSelector;