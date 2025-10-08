import React, { useState } from 'react';
import { IconPlayerPlay, IconDownload, IconCalendar, IconTrendingUp, IconChartBar } from '@tabler/icons-react';

export default function DashboardBacktesting() {
  const [backtestConfig, setBacktestConfig] = useState({
    strategy: 'momentum',
    startDate: '2023-01-01',
    endDate: '2024-01-01',
    initialCapital: 100000,
    commission: 0.1
  });

  const backtestResults = [
    { id: 1, strategy: 'Momentum Bot', period: '2023-2024', return: '+18.4%', sharpe: '1.92', status: 'completed' },
    { id: 2, strategy: 'Mean Reversion', period: '2023-2024', return: '+12.7%', sharpe: '1.45', status: 'completed' },
    { id: 3, strategy: 'Trend Following', period: '2022-2023', return: '+22.1%', sharpe: '2.1', status: 'completed' },
    { id: 4, strategy: 'Arbitrage Bot', period: '2023-2024', return: '+9.8%', sharpe: '1.23', status: 'running' }
  ];

  return (
    <div className="dashboard-page">
      <div className="dashboard-page-header">
        <h2>Strategy Backtesting</h2>
        <p>Test your trading strategies against historical market data</p>
      </div>

      <div className="backtesting-container">
        {/* Backtest Configuration */}
        <div className="backtest-section">
          <h3><IconCalendar className="h-5 w-5" /> Backtest Configuration</h3>
          <div className="config-grid">
            <div className="config-group">
              <label>Strategy</label>
              <select 
                value={backtestConfig.strategy}
                onChange={(e) => setBacktestConfig({...backtestConfig, strategy: e.target.value})}
              >
                <option value="momentum">Momentum Trading</option>
                <option value="meanreversion">Mean Reversion</option>
                <option value="arbitrage">Statistical Arbitrage</option>
                <option value="trend">Trend Following</option>
              </select>
            </div>
            <div className="config-group">
              <label>Start Date</label>
              <input 
                type="date" 
                value={backtestConfig.startDate}
                onChange={(e) => setBacktestConfig({...backtestConfig, startDate: e.target.value})}
              />
            </div>
            <div className="config-group">
              <label>End Date</label>
              <input 
                type="date" 
                value={backtestConfig.endDate}
                onChange={(e) => setBacktestConfig({...backtestConfig, endDate: e.target.value})}
              />
            </div>
            <div className="config-group">
              <label>Initial Capital ($)</label>
              <input 
                type="number" 
                value={backtestConfig.initialCapital}
                onChange={(e) => setBacktestConfig({...backtestConfig, initialCapital: e.target.value})}
              />
            </div>
            <div className="config-group">
              <label>Commission (%)</label>
              <input 
                type="number" 
                step="0.01"
                value={backtestConfig.commission}
                onChange={(e) => setBacktestConfig({...backtestConfig, commission: e.target.value})}
              />
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="backtest-section">
          <h3><IconTrendingUp className="h-5 w-5" /> Performance Metrics</h3>
          <div className="metrics-grid">
            <div className="metric-card">
              <h4>Total Return</h4>
              <p className="metric-value positive">+18.4%</p>
            </div>
            <div className="metric-card">
              <h4>Annual Return</h4>
              <p className="metric-value positive">+16.2%</p>
            </div>
            <div className="metric-card">
              <h4>Sharpe Ratio</h4>
              <p className="metric-value">1.92</p>
            </div>
            <div className="metric-card">
              <h4>Max Drawdown</h4>
              <p className="metric-value negative">-8.7%</p>
            </div>
            <div className="metric-card">
              <h4>Win Rate</h4>
              <p className="metric-value">67.3%</p>
            </div>
            <div className="metric-card">
              <h4>Profit Factor</h4>
              <p className="metric-value">1.84</p>
            </div>
          </div>
        </div>

        {/* Backtest History */}
        <div className="backtest-section">
          <h3><IconChartBar className="h-5 w-5" /> Backtest History</h3>
          <div className="backtest-table">
            <div className="table-header">
              <span>Strategy</span>
              <span>Period</span>
              <span>Return</span>
              <span>Sharpe</span>
              <span>Status</span>
              <span>Actions</span>
            </div>
            {backtestResults.map(result => (
              <div key={result.id} className="table-row">
                <span>{result.strategy}</span>
                <span>{result.period}</span>
                <span className="positive">{result.return}</span>
                <span>{result.sharpe}</span>
                <span className={`status ${result.status}`}>{result.status}</span>
                <span>
                  <button className="btn-icon">
                    <IconDownload className="h-4 w-4" />
                  </button>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="backtest-actions">
          <button className="btn-primary">
            <IconPlayerPlay className="h-4 w-4" />
            Run Backtest
          </button>
          <button className="btn-secondary">
            <IconDownload className="h-4 w-4" />
            Export Results
          </button>
        </div>
      </div>
    </div>
  );
}