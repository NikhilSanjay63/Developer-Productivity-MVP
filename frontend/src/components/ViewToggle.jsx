import React from 'react';

const ViewToggle = ({ viewMode, setViewMode }) => {
  return (
    <div className="flex justify-center mb-8">
      <div className="bg-gray-200 p-1 rounded-lg flex space-x-1">
        <button
          className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
            viewMode === 'ic' ? 'bg-white shadow text-indigo-700' : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setViewMode('ic')}
        >
          IC View
        </button>
        <button
          className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
            viewMode === 'team' ? 'bg-white shadow text-indigo-700' : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setViewMode('team')}
        >
          Manager View
        </button>
      </div>
    </div>
  );
};

export default ViewToggle;