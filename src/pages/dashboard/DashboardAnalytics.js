import React from 'react';

export default function DashboardAnalytics() {
  const metrics = [
    { id: 'visits', label: 'Website Visits', value: '34,567', change: '+12%' },
    { id: 'errors', label: 'Errors', value: '23', change: '-4%' },
    { id: 'latency', label: 'Avg Latency', value: '120ms', change: '-8%' },
    { id: 'api', label: 'API Calls', value: '78,900', change: '+5%' },
  ];

  return (
    <div className="dashboard-section">
      <h3>Analytics</h3>

      <div className="dashboard-cards" style={{ marginTop: '1rem' }}>
        {metrics.map(m => (
          <div key={m.id} className="dashboard-card" style={{ padding: '1rem' }}>
            <h4 style={{ color: '#9aa4b2', fontSize: '0.9rem' }}>{m.label}</h4>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem' }}>
              <div className="dashboard-stat" style={{ fontSize: '1.6rem' }}>{m.value}</div>
              <div style={{ color: m.change.startsWith('+') ? '#60a5fa' : '#ef4444' }}>{m.change}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-section" style={{ marginTop: '1rem' }}>
        <h4>Traffic Overview</h4>
        <p style={{ color: '#cfcfcf' }}>Mini placeholder chart (replace with real chart later)</p>
        <div style={{ height: 180, borderRadius: 10, background: 'linear-gradient(90deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))', marginTop: '0.5rem' }} />
      </div>

      <div className="dashboard-section" style={{ marginTop: '1rem' }}>
        <h4>Top Projects by Usage</h4>
        <ul style={{ color: '#d1d1d1' }}>
          <li>WebApp — 34,000 API calls</li>
          <li>MobileApp — 12,400 API calls</li>
          <li>Internal Tools — 8,900 API calls</li>
        </ul>
      </div>
    </div>
  );
}
