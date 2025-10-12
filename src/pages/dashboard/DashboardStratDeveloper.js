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
    try {
      const resp = await fetch('/api/trading/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, name: `Generated - ${new Date().toLocaleString()}` })
      });
      const data = await resp.json();
      if (data?.success && data.data?.strategy) {
        const strat = data.data.strategy;
        setStrategyCode(strat.code || '');
        // Populate name with a short prompt-derived default
        const defaultName = (prompt || '').split('\n')[0].trim().slice(0, 60) || `Generated ${new Date().toLocaleString()}`;
        setName(defaultName);
        // Do NOT save automatically; wait for explicit user Save
        setStatus('generated (unsaved)');
      } else {
        setStatus('generation failed');
      }
    } catch (e) {
      console.error('generate error', e);
      setStatus('generation failed');
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
                <button className="btn-primary" disabled={!strategyCode} onClick={() => { const s = { id: Date.now().toString(), name: name || `Manual Save ${new Date().toLocaleString()}`, description: '', code: strategyCode, created_at: new Date().toISOString() }; saveLocal(s); setStatus('saved'); setTimeout(()=>setStatus(''),2000); }}>Save to Strategies</button>
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