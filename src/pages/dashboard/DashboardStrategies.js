import React, { useEffect, useState } from 'react';
import { IconTrash } from '@tabler/icons-react';

export default function DashboardStrategies() {
  const [strategies, setStrategies] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    async function load() {
      // Prefer localStorage cached strategies so the page works without backend
      try {
        const ls = window.localStorage.getItem('strategies');
        if (ls) {
          const parsed = JSON.parse(ls);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setStrategies(parsed);
            return;
          }
        }
      } catch (e) {
        // ignore parse errors and fall through to backend fetch
      }

      try {
        const resp = await fetch('/api/trading/strategies');
        if (!resp.ok) return;
        const json = await resp.json();
        if (json?.data?.strategies) setStrategies(json.data.strategies);
      } catch (e) {
        console.error('load strategies error', e);
      }
    }
    load();
  }, []);

  function load() {
    try {
      const list = JSON.parse(localStorage.getItem('strategies') || '[]');
      setStrategies(list || []);
      if (list && list.length && !selected) setSelected(list[0].id);
    } catch (e) {
      setStrategies([]);
    }
  }

  function showCode(s) {
    setSelected(s.id === selected ? null : s.id);
  }

  function remove(id) {
    const filtered = strategies.filter(s => s.id !== id);
    localStorage.setItem('strategies', JSON.stringify(filtered));
    setStrategies(filtered);
    if (selected === id) setSelected(filtered[0]?.id || null);
  }

  const selectedStrategy = strategies.find(s => s.id === selected) || null;

  return (
    <div className="dashboard-page" style={{ padding: 20 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '360px 1fr', gap: 20 }}>
        <div style={{ background: '#071421', border: '1px solid rgba(255,255,255,0.04)', borderRadius: 8, padding: 12, height: '70vh', overflowY: 'auto' }}>
          <h3 style={{ marginTop: 0, color: '#e6f6f8' }}>Saved Strategies</h3>
          {strategies.length === 0 && <p style={{ color: '#89a6ad' }}>No saved strategies yet.</p>}
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {strategies.map(s => (
              <li key={s.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: 6, padding: '10px 12px', background: selected === s.id ? 'linear-gradient(90deg,#063a44,#083f49)' : 'transparent', border: '1px solid rgba(255,255,255,0.02)', marginBottom: 8, cursor: 'pointer' }} onClick={() => showCode(s)}>
                <div>
                  <strong style={{ display: 'block', color: '#e6f6f8' }}>{s.name || s.description?.slice(0, 30) || 'Untitled'}</strong>
                  <div style={{ fontSize: 12, color: '#89a6ad' }}>{s.created_at ? new Date(s.created_at).toLocaleString() : (s.createdAt ? new Date(s.createdAt).toLocaleString() : '')}</div>
                </div>
                <button title="Delete" onClick={(e) => { e.stopPropagation(); remove(s.id); }} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#ff7b7b' }}>
                  <IconTrash />
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ margin: 0 }}>Strategy Detail</h2>
              <p style={{ margin: 0, color: '#99a3b5' }}>{selectedStrategy ? selectedStrategy.name : 'Select a strategy from the left'}</p>
            </div>
          </div>

          <div style={{ borderRadius: 8, overflow: 'hidden', background: 'linear-gradient(180deg,#021218,#071421)', padding: 12, minHeight: '70vh' }}>
            {selectedStrategy ? (
              <pre style={{ color: '#e6eef3', whiteSpace: 'pre-wrap', margin: 0, fontFamily: 'Fira Code, monospace' }}>{selectedStrategy.code}</pre>
            ) : (
              <div style={{ color: '#89a6ad', fontStyle: 'italic' }}>Select a strategy name on the left to view its code.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
