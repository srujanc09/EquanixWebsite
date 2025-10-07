import React from 'react';
import { Link, Routes, Route, Outlet } from 'react-router-dom';
import {
  IconHome,
  IconUser,
  IconSettings,
  IconChartBar,
  IconBell,
  IconFiles,
  IconLogout
} from "@tabler/icons-react";
import DashboardProfile from './dashboard/DashboardProfile';
import DashboardNotifications from './dashboard/DashboardNotifications';
import DashboardAnalytics from './dashboard/DashboardAnalytics';
import DashboardProjects from './dashboard/DashboardProjects';
import DashboardSettings from './dashboard/DashboardSettings';

export default function Dashboard() {
  const sidebarItems = [
    { icon: <IconHome className="h-5 w-5" />, label: 'Dashboard', path: '/dashboard', active: true },
    { icon: <IconChartBar className="h-5 w-5" />, label: 'Analytics', path: '/dashboard/analytics' },
    { icon: <IconFiles className="h-5 w-5" />, label: 'Projects', path: '/dashboard/projects' },
    { icon: <IconUser className="h-5 w-5" />, label: 'Profile', path: '/dashboard/profile' },
    { icon: <IconBell className="h-5 w-5" />, label: 'Notifications', path: '/dashboard/notifications' },
    { icon: <IconSettings className="h-5 w-5" />, label: 'Settings', path: '/dashboard/settings' },
  ];

  return (
    <div className="dashboard-container">
      {/* Left Sidebar */}
      <div className="dashboard-sidebar">
        {/* Logo at top left */}
        <div className="dashboard-logo">
          <h1>
            <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>Equanix</Link>
          </h1>
        </div>
        
        {/* Navigation Menu */}
        <nav className="dashboard-nav">
          {sidebarItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className={`dashboard-nav-item ${item.active ? 'active' : ''}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        
        {/* Logout at bottom */}
        <div className="dashboard-logout">
          <Link to="/" className="dashboard-nav-item logout">
            <IconLogout className="h-5 w-5" />
            <span>Logout</span>
          </Link>
        </div>
      </div>
      
      {/* Main Content Area (uses nested routing) */}
      <div className="dashboard-main">
        <div className="dashboard-header">
          <h2>Welcome to your Dashboard</h2>
          <p>Manage your Equanix account and projects</p>
        </div>

        <div className="dashboard-content">
          <Routes>
            <Route path="/" element={
              <>
                <div className="dashboard-cards">
                  <div className="dashboard-card">
                    <h3>Active Projects</h3>
                    <p className="dashboard-stat">12</p>
                  </div>
                  <div className="dashboard-card">
                    <h3>Total Users</h3>
                    <p className="dashboard-stat">1,234</p>
                  </div>
                  <div className="dashboard-card">
                    <h3>System Health</h3>
                    <p className="dashboard-stat">99.9%</p>
                  </div>
                  <div className="dashboard-card">
                    <h3>API Calls</h3>
                    <p className="dashboard-stat">45,678</p>
                  </div>
                </div>

                <div className="dashboard-section">
                  <h3>Recent Activity</h3>
                  <div className="activity-list">
                    <div className="activity-item">
                      <span>Project "WebApp" deployed successfully</span>
                      <span className="activity-time">2 minutes ago</span>
                    </div>
                    <div className="activity-item">
                      <span>New user registered</span>
                      <span className="activity-time">5 minutes ago</span>
                    </div>
                    <div className="activity-item">
                      <span>System backup completed</span>
                      <span className="activity-time">1 hour ago</span>
                    </div>
                  </div>
                </div>
              </>
            } />
            <Route path="analytics" element={<DashboardAnalytics />} />
            <Route path="projects" element={<DashboardProjects />} />
            <Route path="profile" element={<DashboardProfile />} />
            <Route path="notifications" element={<DashboardNotifications />} />
            <Route path="settings" element={<DashboardSettings />} />
          </Routes>

          {/* nested content outlet for the dashboard pages */}
          <Outlet />
        </div>
      </div>
    </div>
  );
}