const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

export async function fetchDevelopers() {
  const res = await fetch(`${BASE_URL}/developers`);
  if (!res.ok) throw new Error('Failed to fetch developers');
  return res.json();
}

export async function fetchMetrics(developerName) {
  const res = await fetch(`${BASE_URL}/metrics/${encodeURIComponent(developerName)}`);
  if (!res.ok) throw new Error('Failed to fetch metrics');
  return res.json();
}

export async function fetchTeamSummary() {
  const res = await fetch(`${BASE_URL}/team-summary`);
  if (!res.ok) throw new Error('Failed to fetch team summary');
  return res.json();
}