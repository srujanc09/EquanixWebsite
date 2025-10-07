import React from 'react';

export default function DashboardNotifications() {
  const notifications = [
    { id: 1, title: 'Build succeeded', body: 'Your project "WebApp" finished building.', time: '2m ago', unread: true },
    { id: 2, title: 'New signups', body: '12 new users signed up today.', time: '30m ago', unread: false },
    { id: 3, title: 'Security alert', body: 'New sign-in from unknown device.', time: '2h ago', unread: true },
  ];

  return (
    <div className="dashboard-section">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>Notifications</h3>
        <div>
          <button className="btn-dashboard secondary small">Mark all as read</button>
          <button className="btn-dashboard secondary small" style={{ marginLeft: '0.5rem' }}>Notification Settings</button>
        </div>
      </div>

      <div className="notifications-list" style={{ marginTop: '1rem' }}>
        {notifications.map(n => (
          <div key={n.id} className={`notification-item ${n.unread ? 'unread' : ''}`}>
            <div className="notification-body">
              <strong>{n.title}</strong>
              <p>{n.body}</p>
            </div>
            <div className="notification-meta">
              <span className="notification-time">{n.time}</span>
              <button className="btn-dashboard secondary small">Mark Read</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
