import React from 'react';

const TeamInsight = ({ insight }) => {
  return (
    <div className="p-6 rounded-xl border-l-8 shadow-md mb-8 bg-indigo-50 border-indigo-500 text-indigo-900">
      <h2 className="text-xl font-bold mb-2">System Insight</h2>
      <p className="text-lg mb-4 italic">"{insight.summary}"</p>
      <div className="bg-white bg-opacity-60 p-4 rounded-lg">
        <span className="font-bold uppercase text-xs text-indigo-500 block mb-1">Manager Action</span>
        <p className="text-xl font-semibold text-gray-900">🛠️ {insight.recommendation}</p>
      </div>
    </div>
  );
};

export default TeamInsight;