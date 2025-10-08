import React, { useState } from 'react';
import AuthModal from './AuthModal';

export default function AuthRequiredPage() {
  const [showAuthModal, setShowAuthModal] = useState(true);

  return (
    <>
      <div className="auth-required-page">
        <div className="auth-required-content">
          <div className="auth-required-hero">
            <h1>Welcome to Equanix Dashboard</h1>
            <p>Access powerful trading tools, strategy development, and portfolio management.</p>
          </div>
          
          <div className="auth-required-features">
            <div className="feature-grid">
              <div className="feature-item">
                <div className="feature-icon">📊</div>
                <h3>Strategy Development</h3>
                <p>Create and test trading strategies with our AI-powered tools</p>
              </div>
              
              <div className="feature-item">
                <div className="feature-icon">📈</div>
                <h3>Advanced Analytics</h3>
                <p>Get detailed performance metrics and risk analysis</p>
              </div>
              
              <div className="feature-item">
                <div className="feature-icon">💼</div>
                <h3>Portfolio Management</h3>
                <p>Track and optimize your investment portfolio</p>
              </div>
              
              <div className="feature-item">
                <div className="feature-icon">🔄</div>
                <h3>Backtesting</h3>
                <p>Test strategies against historical market data</p>
              </div>
            </div>
          </div>
          
          <div className="auth-required-actions">
            <button 
              className="btn-auth-primary"
              onClick={() => setShowAuthModal(true)}
            >
              Sign Up for Free
            </button>
            <button 
              className="btn-auth-secondary"
              onClick={() => setShowAuthModal(true)}
            >
              Sign In
            </button>
          </div>
        </div>
      </div>

      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode="signup"
      />
    </>
  );
}