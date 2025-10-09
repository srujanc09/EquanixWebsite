import React from 'react';

export default function Features() {
  const features = [
    {
      key: 'platform',
      title: 'AI Trading Platform',
      subtitle: 'Advanced AI powering automated trading',
      desc: 'Unified ML models and execution to power automated strategies.',
    },
    {
      key: 'strategy',
      title: 'AI Strategy Development',
      subtitle: 'Build strategies using natural language',
      desc: 'Describe your idea and instantly get a backtestable strategy—no code.',
    },
    {
      key: 'backtest',
      title: 'Advanced Backtesting',
      subtitle: 'Realistic historical testing',
      desc: 'Run event-driven backtests with realistic costs and drawdown metrics.',
    },
    {
      key: 'realtime',
      title: 'Real-time Analysis',
      subtitle: 'Live signals and explainability',
      desc: 'Continuous signals with confidence scores and visual explanations.',
    },
    {
      key: 'multi',
      title: 'Multi-Asset Support',
      subtitle: 'Trade across markets',
      desc: 'Stocks, crypto, forex and more with unified PnL and execution.',
    },
    {
      key: 'risk',
      title: 'Risk Management',
      subtitle: 'Automated sizing & stress tests',
      desc: 'Position sizing and scenario analysis to limit downside.',
    },
    {
      key: 'monitor',
      title: '24/7 AI Monitoring',
      subtitle: 'Always-on market surveillance',
      desc: 'Alerts for regime shifts and opportunistic signals.',
    },
    {
      key: 'portfolio',
      title: 'Portfolio Optimization',
      subtitle: 'Smart allocation & rebalancing',
      desc: 'ML-driven allocation to meet your risk-return targets.',
    },
    {
      key: 'evolve',
      title: 'Strategy Evolution',
      subtitle: 'Adaptive, self-improving strategies',
      desc: 'Online learning and ensembling to handle market drift.',
    }
  ];

  const Icon = ({ name }) => {
    // simple inline SVG icons keyed by feature
    const icons = {
      platform: (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 7h10v10H7z"/></svg>
      ),
      strategy: (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 12h18"/><path d="M12 3v18"/></svg>
      ),
      backtest: (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 7h18"/><path d="M7 21V7"/><path d="M17 21V11"/></svg>
      ),
      realtime: (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="9"/><path d="M12 8v4l3 3"/></svg>
      ),
      multi: (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h16"/></svg>
      ),
      risk: (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2l9 4v6c0 5-4 9-9 10-5-1-9-5-9-10V6l9-4z"/></svg>
      ),
      monitor: (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 12s4-8 10-8 10 8 10 8-4 8-10 8S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>
      ),
      portfolio: (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="7" width="18" height="14" rx="2"/><path d="M16 3H8v4h8V3z"/></svg>
      ),
      evolve: (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 12a9 9 0 0 1 9-9v4l4-4-4-4v4A9 9 0 0 1 3 12z"/></svg>
      )
    };
    return icons[name] || null;
  };

  return (
    <div className="features-inner-content container">
      <header className="features-hero" data-aos="fade-up">
        <h1>AI Trading Platform</h1>
        <p className="sub-description">Advanced artificial intelligence for sophisticated trading strategies</p>
      </header>

      <section className="features-grid">
        {features.map((f, i) => (
          <article key={i} className="feature-card" data-aos="fade-up" data-aos-delay={i * 80}>
            <div className="feature-icon" aria-hidden>
              <div className="feature-icon-inner">{<Icon name={f.key} />}</div>
            </div>
            <div className="feature-content">
              <h3 className="feature-title">{f.title}</h3>
              <h4 className="feature-sub">{f.subtitle}</h4>
              <p className="feature-desc">{f.desc}</p>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}