import React from 'react';

export default function DashboardProfile() {
  return (
    <div className="dashboard-section">
      <h3>Profile</h3>
      <div className="profile-grid">
        <div className="profile-card">
          <div className="profile-meta">
            <img src="/example.png" alt="avatar" className="profile-avatar" />
            <div>
              <h4>Equanix User</h4>
              <p style={{ color: '#9aa4b2' }}>user@example.com</p>
            </div>
          </div>
          <p><strong>Role:</strong> Developer</p>
          <p><strong>Member since:</strong> Jan 2024</p>
        </div>

        <div className="profile-card">
          <h4>Security</h4>
          <p><strong>Two-Factor Authentication:</strong> Enabled</p>
          <p><strong>Last Password Change:</strong> 12 days ago</p>
          <div style={{ marginTop: '0.5rem' }}>
            <button className="btn-dashboard secondary small">Change Password</button>
          </div>
        </div>

        <div className="profile-card">
          <h4>Preferences</h4>
          <p><strong>Theme:</strong> Dark</p>
          <p><strong>Notifications:</strong> Email, Push</p>
          <div style={{ marginTop: '0.5rem' }}>
            <button className="btn-dashboard secondary small">Edit Preferences</button>
          </div>
        </div>

        <div className="profile-card">
          <h4>Connected Accounts</h4>
          <p>GitHub: connected</p>
          <p>Google: not connected</p>
          <div style={{ marginTop: '0.5rem' }}>
            <button className="btn-dashboard secondary small">Manage Connections</button>
          </div>
        </div>
      </div>

      {/* Billing & Usage removed per request */}
    </div>
  );
}
