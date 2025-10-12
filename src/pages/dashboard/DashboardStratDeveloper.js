import React, { useEffect, useState } from 'react';
import { IconCode, IconDeviceFloppy, IconPlus } from '@tabler/icons-react';

export default function DashboardStratDeveloper() {
  const [activeTab, setActiveTab] = useState('editor');
  const [strategyCode, setStrategyCode] = useState('');
  const [prompt, setPrompt] = useState('');
  const [status, setStatus] = useState('');
  const [strategies, setStrategies] = useState([]);
  const [name, setName] = useState('');

  useEffect(() => {
    loadLocal();
  }, []);

  function loadLocal() {
    try {
      const list = JSON.parse(localStorage.getItem('strategies') || '[]');
      setStrategies(list || []);
    } catch (e) {
      setStrategies([]);
    }
  }

  function saveLocal(s) {
    try {
      const list = [s].concat(JSON.parse(localStorage.getItem('strategies') || '[]'));
      localStorage.setItem('strategies', JSON.stringify(list));
      setStrategies(list);
    } catch (e) {
      console.error('saveLocal error', e);
    }
  }

  async function generate() {
    setStatus('generating...');
    // small client-side fallback generator (useful when backend is down)
    const clientFallback = (promptText) => {
      const safe = (promptText || '').replace(/\n/g, ' ').slice(0, 180);
      return `###CODE_START###\n# Client fallback-generated strategy\n# Prompt: ${safe}\n\nimport pandas as pd\n\ndef run_strategy(historical_data: pd.DataFrame) -> list:\n    \"\"\"Fallback mean-reversion: buy when price is 1% below 10-bar MA, exit after 5 bars.\n    Returns list of trades with required fields.\n    \"\"\"\n    trades = []\n    try:\n        if historical_data is None or historical_data.empty:\n            return trades\n        df = historical_data.copy()\n        df['MA10'] = df['close'].rolling(10).mean()\n        df['pct_vs_ma'] = (df['close'] - df['MA10']) / df['MA10']\n        position = None\n        entry_idx = None\n        for i in range(len(df)):\n            row = df.iloc[i]\n            if position is None:\n                if pd.notna(row['MA10']) and row['pct_vs_ma'] < -0.01:\n                    position = {\n                        'Entry Date': row.name.isoformat() if hasattr(row.name, 'isoformat') else str(row.name),\n                        'Entry Price': float(row['close']),\n                        'Contracts': 1\n                    }\n                    entry_idx = i\n            else:\n                if (i - entry_idx) >= 5 or (pd.notna(row['MA10']) and row['close'] > row['MA10']):\n                    position['Exit Date'] = row.name.isoformat() if hasattr(row.name, 'isoformat') else str(row.name)\n                    position['Exit Price'] = float(row['close'])\n                    position['PnL'] = position['Exit Price'] - position['Entry Price']\n                    position['Bars'] = i - entry_idx\n                    trades.append(position)\n                    position = None\n                    entry_idx = None\n        return trades\n    except Exception:\n        return trades\n###CODE_END###`;
    };

    try {
      const resp = await fetch('/api/trading/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, name: `Generated - ${new Date().toLocaleString()}` })
      });

      // If response is not OK, try to read JSON error and show it
      if (!resp.ok) {
        let bodyText = '';
        try { bodyText = await resp.text(); } catch (e) { bodyText = resp.statusText; }
        const msg = `server error ${resp.status}: ${bodyText}`;
        console.warn('generate server error:', msg);
        setStatus(msg);
        // fallback to client generator
        const fallbackCode = clientFallback(prompt);
        setStrategyCode(fallbackCode);
        const defaultName = (prompt || '').split('\n')[0].trim().slice(0, 60) || `Generated ${new Date().toLocaleString()}`;
        setName(defaultName);
        setStatus('generated (client fallback)');
        setTimeout(() => setStatus(''), 4000);
        return;
      }

      const data = await resp.json();
      if (data?.success && data.data?.strategy) {
        const strat = data.data.strategy;
        setStrategyCode(strat.code || '');
        // Populate name with a short prompt-derived default
        const defaultName = (prompt || '').split('\n')[0].trim().slice(0, 60) || `Generated ${new Date().toLocaleString()}`;
        setName(defaultName);
        setStatus('generated (unsaved)');
      } else {
        // server returned success:false or no strategy
        const msg = data?.message || 'generation failed (no strategy returned)';
        console.warn('generate response issue:', data);
        setStatus(msg);
        // fallback
        const fallbackCode = clientFallback(prompt);
        setStrategyCode(fallbackCode);
        setStatus('generated (client fallback)');
      }
    } catch (e) {
      console.error('generate fetch error', e);
      // network/backend unreachable -> do client fallback so user can continue
      const fallbackCode = clientFallback(prompt);
      setStrategyCode(fallbackCode);
      const defaultName = (prompt || '').split('\n')[0].trim().slice(0, 60) || `Generated ${new Date().toLocaleString()}`;
      setName(defaultName);
      setStatus('generated (client fallback)');
    }
    setTimeout(() => setStatus(''), 4000);
  }

  function selectStrategy(s) {
    setStrategyCode(s.code || '');
    setActiveTab('editor');
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-page-header">
        <h2>Strategy Developer</h2>
        <p>Describe a strategy in plain English and click Generate.</p>
      </div>

      <div className="strat-developer-container">
        <div className="tab-navigation">
          <button className={`tab active`}>
            <IconCode className="h-4 w-4" />
            Code Editor
          </button>
        </div>

        {activeTab === 'editor' && (
          <div className="editor-section">
            <div className="editor-toolbar">
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <input value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Describe strategy (e.g. buy dip vs 20MA)" style={{ width: 520, padding: 10, borderRadius: 8, border: '1px solid rgba(255,255,255,0.04)', background: 'rgba(255,255,255,0.02)', color: '#e6f6f8' }} />
                <button className="btn-primary" onClick={generate}>Generate</button>
                <input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Strategy name" style={{ padding: 8, borderRadius: 8, border: '1px solid rgba(255,255,255,0.03)', background: 'transparent', color: '#e6f6f8', width: 260 }} />
                <button className="btn-primary" disabled={!strategyCode} onClick={async () => {
                  const s = { id: Date.now().toString(), name: name || `Manual Save ${new Date().toLocaleString()}`, description: '', code: strategyCode, created_at: new Date().toISOString() };
                  try {
                    const resp = await fetch('/api/trading/strategies/persist', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(s) });
                    const data = await resp.json();
                    if (data?.success) {
                      setStatus(data.message || 'saved');
                      // If server returned a strategy, update local cache to reflect saved record (use returned strategy if available)
                      const serverStrat = data.data?.strategy;
                      if (serverStrat) {
                        saveLocal(serverStrat);
                      } else {
                        saveLocal(s);
                      }
                    } else {
                      throw new Error('Server persist failed');
                    }
                  } catch (err) {
                    console.warn('Persist failed, falling back to localStorage', err);
                    saveLocal(s);
                    setStatus('saved locally');
                  }
                  setTimeout(()=>setStatus(''),2000);
                }}>Save to Strategies</button>
                <div style={{ marginLeft: 12, color: '#3f8ea3', minWidth: 160 }}>{status}</div>
              </div>
            </div>

            <div className="code-editor">
              <textarea value={strategyCode} onChange={(e) => setStrategyCode(e.target.value)} className="code-textarea" placeholder="Generated strategy code will appear here..." />
            </div>
          </div>
        )}

        {/* Strategies list is available on the dedicated Strategies page in the dashboard. */}
      </div>
    </div>
  );
}