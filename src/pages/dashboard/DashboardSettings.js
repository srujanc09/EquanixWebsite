import React from 'react';

export default function DashboardSettings() {
  return (
    <div className="dashboard-section">
      <h3>Settings</h3>

      <div className="profile-grid" style={{ marginTop: '1rem' }}>
        <div className="profile-card">
          <h4>Account</h4>
          <p style={{ color: '#cfcfcf' }}>Manage your account details and authentication settings.</p>
          <p><strong>Email:</strong> user@example.com</p>
          <div style={{ marginTop: '0.5rem' }}>
            <button className="btn-dashboard secondary small">Edit Account</button>
          </div>
        </div>

        <div className="profile-card">
          <h4>Team & Access</h4>
          <p style={{ color: '#cfcfcf' }}>Invite teammates and control their roles and permissions.</p>
          <div style={{ marginTop: '0.5rem' }}>
            <button className="btn-dashboard">Manage Team</button>
          </div>
        </div>
      </div>

      <div className="dashboard-section" style={{ marginTop: '1rem' }}>
        <h4>Integrations</h4>
        <p style={{ color: '#cfcfcf' }}>Connect GitHub, Slack, and other tools for a smooth workflow.</p>
        <div style={{ marginTop: '0.5rem' }}>
          <button className="btn-dashboard secondary small">Manage Integrations</button>
        </div>
      </div>
    </div>
  );
}
