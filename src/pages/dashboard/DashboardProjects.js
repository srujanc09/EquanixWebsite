import React from 'react';

export default function DashboardProjects() {
  const projects = [
    { id: 1, name: 'WebApp', desc: 'Customer-facing web application', status: 'Running', usages: '34k API calls' },
    { id: 2, name: 'MobileApp', desc: 'iOS/Android app', status: 'Deploying', usages: '12k API calls' },
    { id: 3, name: 'DataPipeline', desc: 'ETL processes', status: 'Idle', usages: '4.5k API calls' },
  ];

  return (
    <div className="dashboard-section">
      <h3>Projects</h3>

      <div className="dashboard-cards" style={{ marginTop: '1rem' }}>
        {projects.map(p => (
          <div key={p.id} className="dashboard-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ margin: 0, color: '#fff' }}>{p.name}</h4>
                <p style={{ color: '#cfcfcf', margin: '0.25rem 0' }}>{p.desc}</p>
                <p style={{ color: '#9aa4b2', margin: 0 }}>{p.usages}</p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn-dashboard secondary small">Open</button>
                <button className="btn-dashboard small">Manage</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-section" style={{ marginTop: '1rem' }}>
        <h4>Create New Project</h4>
        <p style={{ color: '#cfcfcf' }}>Quick create flow to scaffold a new project.</p>
        <div style={{ marginTop: '0.5rem' }}>
          <button className="btn-dashboard">Create Project</button>
        </div>
      </div>
    </div>
  );
}
