import React, { useState } from 'react';
import { IconCode, IconPlayerPlay, IconDeviceFloppy, IconUpload, IconPlus, IconTrash } from '@tabler/icons-react';

export default function DashboardStratDeveloper() {
  const [activeTab, setActiveTab] = useState('editor');
  const [strategyCode, setStrategyCode] = useState(`# Momentum Trading Strategy
import pandas as pd
import numpy as np

class MomentumStrategy:
    def __init__(self, lookback_period=20, threshold=0.02):
        self.lookback_period = lookback_period
        self.threshold = threshold
        
    def generate_signals(self, data):
        # Calculate momentum indicator
        momentum = data['close'].pct_change(self.lookback_period)
        
        # Generate buy/sell signals
        signals = pd.Series(index=data.index, dtype=int)
        signals[momentum > self.threshold] = 1   # Buy signal
        signals[momentum < -self.threshold] = -1 # Sell signal
        signals.fillna(0, inplace=True)
        
        return signals
        
    def calculate_returns(self, data, signals):
        returns = data['close'].pct_change() * signals.shift(1)
        return returns.fillna(0)`);

  const savedStrategies = [
    { id: 1, name: 'Momentum Bot', type: 'Python', lastModified: '2 hours ago', status: 'active' },
    { id: 2, name: 'Mean Reversion', type: 'Python', lastModified: '1 day ago', status: 'testing' },
    { id: 3, name: 'Arbitrage Scanner', type: 'Python', lastModified: '3 days ago', status: 'draft' },
    { id: 4, name: 'Trend Follower', type: 'Python', lastModified: '1 week ago', status: 'archived' }
  ];

  const templates = [
    { id: 1, name: 'Basic Moving Average', description: 'Simple MA crossover strategy' },
    { id: 2, name: 'RSI Mean Reversion', description: 'RSI-based reversal strategy' },
    { id: 3, name: 'Bollinger Bands', description: 'Volatility-based trading' },
    { id: 4, name: 'MACD Momentum', description: 'MACD signal-based trading' }
  ];

  return (
    <div className="dashboard-page">
      <div className="dashboard-page-header">
        <h2>Strategy Developer</h2>
        <p>Build, test, and deploy your custom trading strategies</p>
      </div>

      <div className="strat-developer-container">
        {/* Tab Navigation */}
        <div className="tab-navigation">
          <button 
            className={`tab ${activeTab === 'editor' ? 'active' : ''}`}
            onClick={() => setActiveTab('editor')}
          >
            <IconCode className="h-4 w-4" />
            Code Editor
          </button>
          <button 
            className={`tab ${activeTab === 'strategies' ? 'active' : ''}`}
            onClick={() => setActiveTab('strategies')}
          >
            <IconDeviceFloppy className="h-4 w-4" />
            My Strategies
          </button>
          <button 
            className={`tab ${activeTab === 'templates' ? 'active' : ''}`}
            onClick={() => setActiveTab('templates')}
          >
            <IconUpload className="h-4 w-4" />
            Templates
          </button>
        </div>

        {/* Code Editor Tab */}
        {activeTab === 'editor' && (
          <div className="editor-section">
            <div className="editor-toolbar">
              <button className="btn-primary">
                <IconPlayerPlay className="h-4 w-4" />
                Test Strategy
              </button>
              <button className="btn-secondary">
                <IconDeviceFloppy className="h-4 w-4" />
                Save Strategy
              </button>
              <button className="btn-secondary">
                <IconUpload className="h-4 w-4" />
                Deploy
              </button>
            </div>
            
            <div className="code-editor">
              <textarea
                value={strategyCode}
                onChange={(e) => setStrategyCode(e.target.value)}
                className="code-textarea"
                placeholder="Write your strategy code here..."
              />
            </div>

            <div className="editor-output">
              <h4>Test Output</h4>
              <div className="output-console">
                <p>Strategy loaded successfully</p>
                <p>Backtesting period: 2023-01-01 to 2024-01-01</p>
                <p>Total trades: 47</p>
                <p>Win rate: 68.1%</p>
                <p>Total return: +16.4%</p>
                <p className="success">Strategy test completed successfully</p>
              </div>
            </div>
          </div>
        )}

        {/* My Strategies Tab */}
        {activeTab === 'strategies' && (
          <div className="strategies-section">
            <div className="strategies-header">
              <h3>My Strategies</h3>
              <button className="btn-primary">
                <IconPlus className="h-4 w-4" />
                New Strategy
              </button>
            </div>
            
            <div className="strategies-grid">
              {savedStrategies.map(strategy => (
                <div key={strategy.id} className="strategy-card">
                  <div className="strategy-header">
                    <h4>{strategy.name}</h4>
                    <span className={`status ${strategy.status}`}>{strategy.status}</span>
                  </div>
                  <p>{strategy.type} • {strategy.lastModified}</p>
                  <div className="strategy-actions">
                    <button className="btn-sm">Edit</button>
                    <button className="btn-sm">Clone</button>
                    <button className="btn-sm danger">
                      <IconTrash className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Templates Tab */}
        {activeTab === 'templates' && (
          <div className="templates-section">
            <div className="templates-header">
              <h3>Strategy Templates</h3>
              <p>Start with pre-built strategy templates</p>
            </div>
            
            <div className="templates-grid">
              {templates.map(template => (
                <div key={template.id} className="template-card">
                  <h4>{template.name}</h4>
                  <p>{template.description}</p>
                  <button className="btn-primary">Use Template</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}