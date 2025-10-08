import React, { useState } from 'react';
import { IconRobot, IconSettings, IconPlayerPlay, IconPlayerPause, IconBrain, IconChartLine } from '@tabler/icons-react';

export default function DashboardAgenticHandling() {
  const [activeAgent, setActiveAgent] = useState('trader');
  
  const agents = [
    { 
      id: 'trader', 
      name: 'Trading Agent', 
      status: 'active', 
      description: 'Executes trades based on strategy signals',
      performance: '+12.4%',
      trades: 156
    },
    { 
      id: 'risk', 
      name: 'Risk Management Agent', 
      status: 'active', 
      description: 'Monitors and manages portfolio risk',
      performance: 'Low Risk',
      trades: 23
    },
    { 
      id: 'research', 
      name: 'Research Agent', 
      status: 'idle', 
      description: 'Analyzes market data and generates insights',
      performance: '847 insights',
      trades: 0
    },
    { 
      id: 'optimizer', 
      name: 'Portfolio Optimizer', 
      status: 'active', 
      description: 'Optimizes portfolio allocation dynamically',
      performance: '+2.1% alpha',
      trades: 12
    }
  ];

  const agentLogs = [
    { time: '14:32:15', agent: 'Trading Agent', action: 'Executed BUY order for AAPL', type: 'trade' },
    { time: '14:31:42', agent: 'Risk Agent', action: 'Portfolio exposure within limits', type: 'check' },
    { time: '14:30:18', agent: 'Research Agent', action: 'Market sentiment: Bullish on tech sector', type: 'insight' },
    { time: '14:28:55', agent: 'Optimizer', action: 'Rebalanced portfolio weights', type: 'optimization' },
    { time: '14:27:33', agent: 'Trading Agent', action: 'Signal detected: Momentum breakout', type: 'signal' }
  ];

  const selectedAgent = agents.find(agent => agent.id === activeAgent);

  return (
    <div className="dashboard-page">
      <div className="dashboard-page-header">
        <h2>Agentic Handling</h2>
        <p>Manage and monitor your AI trading agents</p>
      </div>

      <div className="agentic-container">
        {/* Agent Overview */}
        <div className="agents-section">
          <h3><IconRobot className="h-5 w-5" /> Active Agents</h3>
          <div className="agents-grid">
            {agents.map(agent => (
              <div 
                key={agent.id} 
                className={`agent-card ${activeAgent === agent.id ? 'selected' : ''}`}
                onClick={() => setActiveAgent(agent.id)}
              >
                <div className="agent-header">
                  <h4>{agent.name}</h4>
                  <span className={`agent-status ${agent.status}`}>{agent.status}</span>
                </div>
                <p className="agent-description">{agent.description}</p>
                <div className="agent-metrics">
                  <span>Performance: {agent.performance}</span>
                  <span>Actions: {agent.trades}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Agent Details */}
        {selectedAgent && (
          <div className="agent-details-section">
            <h3><IconBrain className="h-5 w-5" /> {selectedAgent.name} Details</h3>
            
            <div className="agent-controls">
              <div className="control-group">
                <label>Agent Status</label>
                <div className="control-buttons">
                  <button className="btn-success">
                    <IconPlayerPlay className="h-4 w-4" />
                    Start
                  </button>
                  <button className="btn-warning">
                    <IconPlayerPause className="h-4 w-4" />
                    Pause
                  </button>
                  <button className="btn-secondary">
                    <IconSettings className="h-4 w-4" />
                    Configure
                  </button>
                </div>
              </div>
            </div>

            <div className="agent-performance">
              <h4>Performance Metrics</h4>
              <div className="performance-grid">
                <div className="metric-item">
                  <span>Uptime</span>
                  <span>99.8%</span>
                </div>
                <div className="metric-item">
                  <span>Success Rate</span>
                  <span>87.3%</span>
                </div>
                <div className="metric-item">
                  <span>Response Time</span>
                  <span>124ms</span>
                </div>
                <div className="metric-item">
                  <span>CPU Usage</span>
                  <span>23%</span>
                </div>
              </div>
            </div>

            <div className="agent-parameters">
              <h4>Configuration Parameters</h4>
              <div className="params-list">
                <div className="param-item">
                  <label>Risk Threshold</label>
                  <input type="range" min="0" max="100" defaultValue="75" />
                  <span>75%</span>
                </div>
                <div className="param-item">
                  <label>Decision Confidence</label>
                  <input type="range" min="0" max="100" defaultValue="85" />
                  <span>85%</span>
                </div>
                <div className="param-item">
                  <label>Update Frequency</label>
                  <select defaultValue="1min">
                    <option value="30sec">30 seconds</option>
                    <option value="1min">1 minute</option>
                    <option value="5min">5 minutes</option>
                    <option value="15min">15 minutes</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Agent Activity Log */}
        <div className="activity-section">
          <h3><IconChartLine className="h-5 w-5" /> Agent Activity Log</h3>
          <div className="activity-log">
            {agentLogs.map((log, index) => (
              <div key={index} className={`log-entry ${log.type}`}>
                <span className="log-time">{log.time}</span>
                <span className="log-agent">{log.agent}</span>
                <span className="log-action">{log.action}</span>
                <span className={`log-type ${log.type}`}>{log.type}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Global Agent Controls */}
        <div className="global-controls">
          <button className="btn-primary">
            <IconPlayerPlay className="h-4 w-4" />
            Start All Agents
          </button>
          <button className="btn-warning">
            <IconPlayerPause className="h-4 w-4" />
            Pause All Agents
          </button>
          <button className="btn-secondary">
            <IconSettings className="h-4 w-4" />
            Global Settings
          </button>
        </div>
      </div>
    </div>
  );
}