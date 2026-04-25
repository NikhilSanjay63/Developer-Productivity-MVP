import React, { useState, useEffect } from 'react';
import { fetchDevelopers, fetchMetrics, fetchTeamSummary } from './api';
import DeveloperSelector from './components/DeveloperSelector';
import ActionableInsight  from './components/ActionableInsight';
import MetricsGrid        from './components/MetricsGrid';
import MetricsChart       from './components/MetricsChart';
import ViewToggle         from './components/ViewToggle';
import TeamInsight        from './components/TeamInsight';
import TeamMetricsGrid    from './components/TeamMetricsGrid';

const App = () => {
  const [viewMode,    setViewMode]    = useState('ic');
  const [developers,  setDevelopers]  = useState([]);
  const [selectedDev, setSelectedDev] = useState('');
  const [icData,      setIcData]      = useState(null);
  const [teamData,    setTeamData]    = useState(null);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState(null);
  const [teamError,   setTeamError]   = useState(null);

  useEffect(() => {
    setError(null);

    fetchDevelopers()
      .then(data => {
        setDevelopers(data);
        if (data.length > 0) setSelectedDev(data[0]);
      })
      .catch(() =>
        setError('Cannot connect to the Insight Engine. Please ensure the Python backend is running on port 8000.')
      );

    fetchTeamSummary()
      .then(setTeamData)
      .catch(() =>
        setTeamError('Could not load team summary. Check backend connection.')
      );
  }, []);

  useEffect(() => {
    if (!selectedDev) return;

    setLoading(true);
    setError(null);

    fetchMetrics(selectedDev)
      .then(data => {
        setIcData(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load developer metrics. Check backend connection.');
        setLoading(false);
      });
  }, [selectedDev]);

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8 md:px-8 font-sans text-gray-900">
      <div className="max-w-4xl mx-auto">

        <header className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Developer Insight Engine</h1>
          <p className="text-sm text-gray-400 mt-1">Moving from raw metrics to meaningful action.</p>
        </header>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8 rounded-md">
            <div className="flex items-start gap-3">
              <svg className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {!error && developers.length > 0 && (
          <>
            <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />

            {viewMode === 'ic' && (
              <div>
                <DeveloperSelector
                  developers={developers}
                  selectedDev={selectedDev}
                  setSelectedDev={setSelectedDev}
                />

                {loading && (
                  <div className="animate-pulse space-y-4 mb-8">
                    <div className="h-24 bg-gray-200 rounded-xl" />
                    <div className="grid grid-cols-3 gap-4">
                      <div className="h-20 bg-gray-200 rounded-xl" />
                      <div className="h-20 bg-gray-200 rounded-xl" />
                      <div className="h-20 bg-gray-200 rounded-xl" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="h-20 bg-gray-200 rounded-xl" />
                      <div className="h-20 bg-gray-200 rounded-xl" />
                    </div>
                  </div>
                )}

                {icData && !loading && (
                  <>
                    <div className="mb-4">
                      <p className="text-xs text-gray-400 uppercase tracking-wide">
                        {icData.seniority} · {icData.team}
                      </p>
                      <h2 className="text-lg font-semibold text-gray-900">{icData.developer}</h2>
                    </div>
                    <ActionableInsight insight={icData.insight} />
                    <MetricsGrid       metrics={icData.raw_metrics} />
                    <MetricsChart      metrics={icData.raw_metrics} />
                  </>
                )}
              </div>
            )}

            {viewMode === 'team' && (
              <div>
                {teamError && (
                  <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md mb-6">
                    <p className="text-sm text-red-700">{teamError}</p>
                  </div>
                )}
                {teamData && !teamError && (
                  <>
                    <TeamInsight     insight={teamData.manager_insight} />
                    <TeamMetricsGrid baselines={teamData.baselines} />
                  </>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default App;