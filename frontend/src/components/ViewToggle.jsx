import React from 'react';

const ViewToggle = ({ viewMode, setViewMode }) => {
  return (
    <div className="flex mb-6">
      <div className="inline-flex bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setViewMode('ic')}
          className={`px-4 py-1.5 text-sm rounded-md transition-all ${
            viewMode === 'ic'
              ? 'bg-white text-gray-900 shadow-sm font-medium'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          My View
        </button>
        <button
          onClick={() => setViewMode('team')}
          className={`px-4 py-1.5 text-sm rounded-md transition-all ${
            viewMode === 'team'
              ? 'bg-white text-gray-900 shadow-sm font-medium'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Team View
        </button>
      </div>
    </div>
  );
};

export default ViewToggle;