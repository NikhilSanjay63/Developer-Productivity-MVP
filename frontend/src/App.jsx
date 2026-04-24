import React, { useState, useEffect } from 'react';
import DeveloperSelector from './components/DeveloperSelector';
import ActionableInsight from './components/ActionableInsight';
import MetricsGrid from './components/MetricsGrid';
import ViewToggle from './components/ViewToggle';
import TeamInsight from './components/TeamInsight';
import TeamMetricsGrid from './components/TeamMetricsGrid';
import MetricsChart from './components/MetricsChart';

const App = () => {
  // New state for toggling views
  const [viewMode, setViewMode] = useState('ic'); // 'ic' or 'team'
  const [teamData, setTeamData] = useState(null);

  // Existing IC state
  const [developers, setDevelopers] = useState([]);
  const [selectedDev, setSelectedDev] = useState('');
  const [icData, setIcData] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // NEW: Global error state for the unhappy path
  const [error, setError] = useState(null);

  // 1. Fetch available developers AND team data on mount
  useEffect(() => {
    // Reset error on initial load attempt
    setError(null);

    fetch('http://127.0.0.1:8000/developers')
      .then(res => {
        if (!res.ok) throw new Error("Backend response was not ok.");
        return res.json();
      })
      .then(data => {
        setDevelopers(data);
        if (!selectedDev && data.length > 0 && viewMode === 'ic') {
          setSelectedDev(data[0]);
        }
      })
      .catch(err => {
        console.error("Error fetching devs:", err);
        setError("Cannot connect to the Insight Engine. Please ensure the Python backend is running.");
      });

    fetch('http://127.0.0.1:8000/team-summary')
      .then(res => {
        if (!res.ok) throw new Error("Backend response was not ok.");
        return res.json();
      })
      .then(setTeamData)
      .catch(err => console.error("Error fetching team data:", err));
  }, []);

  // 2. Fetch specific IC data when selection changes
  useEffect(() => {
    if (selectedDev && viewMode === 'ic') {
      setLoading(true);
      setError(null); // Clear previous errors
      
      fetch(`http://127.0.0.1:8000/metrics/${selectedDev}`)
        .then(res => {
          if (!res.ok) throw new Error("Backend response was not ok.");
          return res.json();
        })
        .then(resData => {
          setIcData(resData);
          setLoading(false);
        })
        .catch(err => {
          console.error("Error fetching metrics:", err);
          setError("Failed to load developer metrics. Check backend connection.");
          setLoading(false);
        });
    }
  }, [selectedDev, viewMode]);

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans text-gray-900">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-indigo-700">Developer Insight Engine</h1>
          <p className="text-gray-500 mt-2">Moving from raw metrics to meaningful action.</p>
        </header>

        {/* Global Error Banner */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-md shadow-sm">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700 font-medium">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Proceed with UI only if there is no critical initial error preventing dev fetch */}
        {!error && developers.length > 0 && (
          <>
            {/* The Toggle Switch */}
            <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />

            {/* --- IC VIEW UI --- */}
            {viewMode === 'ic' && (
              <div className="animate-fade-in">
                <DeveloperSelector 
                  developers={developers} 
                  selectedDev={selectedDev} 
                  setSelectedDev={setSelectedDev} 
                />

                {loading && (
                  <p className="text-center text-indigo-600 animate-pulse font-medium mb-8">
                    Analyzing engineering patterns...
                  </p>
                )}

                {icData && !loading && (
                  <>
                    <ActionableInsight insight={icData.insight} />
                    <MetricsGrid metrics={icData.raw_metrics} />
                    <MetricsChart metrics={icData.raw_metrics} />
                  </>
                )}
              </div>
            )}

            {/* --- MANAGER VIEW UI --- */}
            {viewMode === 'team' && teamData && (
              <div className="animate-fade-in">
                <TeamInsight insight={teamData.manager_insight} />
                <TeamMetricsGrid baselines={teamData.baselines} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default App;