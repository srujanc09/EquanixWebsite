import React from 'react';
import { Link, Routes, Route, Outlet } from 'react-router-dom';
import {
  IconHome,
  IconChartLine,
  IconChartBar,
  IconCode,
  IconRobot,
  IconLogout
} from "@tabler/icons-react";
import DashboardOptimization from './dashboard/DashboardOptimization';
import DashboardBacktesting from './dashboard/DashboardBacktesting';
import DashboardStratDeveloper from './dashboard/DashboardStratDeveloper';
import DashboardAgenticHandling from './dashboard/DashboardAgenticHandling';

export default function Dashboard() {
  const sidebarItems = [
    { icon: <IconHome className="h-5 w-5" />, label: 'Overview', path: '/dashboard', active: true },
    { icon: <IconChartLine className="h-5 w-5" />, label: 'Optimization', path: '/dashboard/optimization' },
    { icon: <IconChartBar className="h-5 w-5" />, label: 'Backtesting', path: '/dashboard/backtesting' },
    { icon: <IconCode className="h-5 w-5" />, label: 'Strat Developer', path: '/dashboard/strat-developer' },
    { icon: <IconRobot className="h-5 w-5" />, label: 'Agentic Handling', path: '/dashboard/agentic-handling' },
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
                    <h3>Active Strategies</h3>
                    <p className="dashboard-stat">8</p>
                  </div>
                  <div className="dashboard-card">
                    <h3>Portfolio Value</h3>
                    <p className="dashboard-stat">$127,340</p>
                  </div>
                  <div className="dashboard-card">
                    <h3>Today's P&L</h3>
                    <p className="dashboard-stat">+$2,140</p>
                  </div>
                  <div className="dashboard-card">
                    <h3>Win Rate</h3>
                    <p className="dashboard-stat">73.2%</p>
                  </div>
                </div>

                <div className="dashboard-section">
                  <h3>Recent Trading Activity</h3>
                  <div className="activity-list">
                    <div className="activity-item">
                      <span>Strategy "MomentumBot" executed buy order for AAPL</span>
                      <span className="activity-time">2 minutes ago</span>
                    </div>
                    <div className="activity-item">
                      <span>Backtest completed for "MeanReversion" strategy</span>
                      <span className="activity-time">15 minutes ago</span>
                    </div>
                    <div className="activity-item">
                      <span>Portfolio optimization updated risk parameters</span>
                      <span className="activity-time">1 hour ago</span>
                    </div>
                  </div>
                </div>
              </>
            } />
            <Route path="optimization" element={<DashboardOptimization />} />
            <Route path="backtesting" element={<DashboardBacktesting />} />
            <Route path="strat-developer" element={<DashboardStratDeveloper />} />
            <Route path="agentic-handling" element={<DashboardAgenticHandling />} />
          </Routes>

          {/* nested content outlet for the dashboard pages */}
          <Outlet />
        </div>
      </div>
    </div>
  );
}