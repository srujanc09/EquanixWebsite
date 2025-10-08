import React, { useState } from 'react';
import { IconSettings, IconPlayerPlay, IconChartLine, IconTarget } from '@tabler/icons-react';

export default function DashboardOptimization() {
  const [selectedStrategy, setSelectedStrategy] = useState('momentum');
  const [optimizationParams, setOptimizationParams] = useState({
    riskTolerance: 'medium',
    timeHorizon: '6months',
    capital: 100000,
    maxDrawdown: 15
  });

  const strategies = [
    { id: 'momentum', name: 'Momentum Trading', performance: '+12.4%' },
    { id: 'meanreversion', name: 'Mean Reversion', performance: '+8.7%' },
    { id: 'arbitrage', name: 'Statistical Arbitrage', performance: '+15.2%' },
    { id: 'trend', name: 'Trend Following', performance: '+9.8%' }
  ];

  return (
    <div className="dashboard-page">
      <div className="dashboard-page-header">
        <h2>Portfolio Optimization</h2>
        <p>Optimize your trading strategies and portfolio allocation</p>
      </div>

      <div className="optimization-container">
        {/* Strategy Selection */}
        <div className="optimization-section">
          <h3><IconTarget className="h-5 w-5" /> Strategy Selection</h3>
          <div className="strategy-grid">
            {strategies.map(strategy => (
              <div 
                key={strategy.id}
                className={`strategy-card ${selectedStrategy === strategy.id ? 'selected' : ''}`}
                onClick={() => setSelectedStrategy(strategy.id)}
              >
                <h4>{strategy.name}</h4>
                <p className="performance">{strategy.performance}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Optimization Parameters */}
        <div className="optimization-section">
          <h3><IconSettings className="h-5 w-5" /> Optimization Parameters</h3>
          <div className="params-grid">
            <div className="param-group">
              <label>Risk Tolerance</label>
              <select 
                value={optimizationParams.riskTolerance}
                onChange={(e) => setOptimizationParams({...optimizationParams, riskTolerance: e.target.value})}
              >
                <option value="low">Conservative</option>
                <option value="medium">Moderate</option>
                <option value="high">Aggressive</option>
              </select>
            </div>
            <div className="param-group">
              <label>Time Horizon</label>
              <select 
                value={optimizationParams.timeHorizon}
                onChange={(e) => setOptimizationParams({...optimizationParams, timeHorizon: e.target.value})}
              >
                <option value="1month">1 Month</option>
                <option value="3months">3 Months</option>
                <option value="6months">6 Months</option>
                <option value="1year">1 Year</option>
              </select>
            </div>
            <div className="param-group">
              <label>Capital ($)</label>
              <input 
                type="number" 
                value={optimizationParams.capital}
                onChange={(e) => setOptimizationParams({...optimizationParams, capital: e.target.value})}
              />
            </div>
            <div className="param-group">
              <label>Max Drawdown (%)</label>
              <input 
                type="number" 
                value={optimizationParams.maxDrawdown}
                onChange={(e) => setOptimizationParams({...optimizationParams, maxDrawdown: e.target.value})}
              />
            </div>
          </div>
        </div>

        {/* Optimization Results */}
        <div className="optimization-section">
          <h3><IconChartLine className="h-5 w-5" /> Optimization Results</h3>
          <div className="results-grid">
            <div className="result-card">
              <h4>Expected Return</h4>
              <p className="result-value">+14.2%</p>
            </div>
            <div className="result-card">
              <h4>Sharpe Ratio</h4>
              <p className="result-value">1.85</p>
            </div>
            <div className="result-card">
              <h4>Max Drawdown</h4>
              <p className="result-value">-12.3%</p>
            </div>
            <div className="result-card">
              <h4>Volatility</h4>
              <p className="result-value">18.7%</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="optimization-actions">
          <button className="btn-primary">
            <IconPlayerPlay className="h-4 w-4" />
            Run Optimization
          </button>
          <button className="btn-secondary">
            <IconSettings className="h-4 w-4" />
            Advanced Settings
          </button>
        </div>
      </div>
    </div>
  );
}