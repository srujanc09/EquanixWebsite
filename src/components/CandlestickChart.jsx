import React, { useRef, useEffect } from 'react';

// Simple candlestick animation drawn on a canvas. Generates synthetic data
// that trends slightly upward and animates leftwards in a looping manner.
export default function CandlestickChart({ width = 420, height = 220, colorBy = 'slope' }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const DPR = window.devicePixelRatio || 1;
    canvas.width = width * DPR;
    canvas.height = height * DPR;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.scale(DPR, DPR);

    const candleCount = 60; // number of candles shown at once
    const candleWidth = Math.max(3, Math.floor(width / candleCount));
    const spacing = 1;
    const visibleCount = Math.floor(width / (candleWidth + spacing));

    // generate initial candles with a gentle upward trend
    const candles = [];
    let price = 100;
    for (let i = 0; i < candleCount; i++) {
      const v = (Math.random() - 0.4) * 1.6; // small random
      const open = price;
      const close = +(price + v + i * 0.02).toFixed(2);
      const high = +(Math.max(open, close) + Math.random() * 1.6).toFixed(2);
      const low = +(Math.min(open, close) - Math.random() * 1.6).toFixed(2);
      candles.push({ open, close, high, low });
      price = close;
    }

    let nextCandleTimer = 0;
    const tickInterval = 140; // ms between new candles
    let lastTime = performance.now();
    let progressOffset = 0; // animation offset [0..1] between candle steps

    function drawGrid() {
      ctx.clearRect(0, 0, width, height);
      // background
      ctx.fillStyle = 'rgba(18,18,18,0.0)';
      ctx.fillRect(0, 0, width, height);
      // grid lines
      ctx.strokeStyle = 'rgba(255,255,255,0.03)';
      ctx.lineWidth = 1;
      for (let i = 0; i < 4; i++) {
        const y = (height / 4) * i + 12;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    }

    function drawCandles(offsetPx) {
      // compute price range
      let max = -Infinity;
      let min = Infinity;
      for (let c of candles) {
        max = Math.max(max, c.high);
        min = Math.min(min, c.low);
      }
      // add a small padding
      const pad = (max - min) * 0.08 || 1;
      max += pad;
      min -= pad;
      const range = max - min;

      // draw candles from right to left (newest at right)
      const startX = width - (candleWidth + spacing) * (candles.length) - offsetPx;
      let x = startX;
      for (let i = 0; i < candles.length; i++) {
        const c = candles[i];
        x += candleWidth + spacing;
        const o = height - ((c.open - min) / range) * (height - 20) - 10;
        const cl = height - ((c.close - min) / range) * (height - 20) - 10;
        const h = height - ((c.high - min) / range) * (height - 20) - 10;
        const l = height - ((c.low - min) / range) * (height - 20) - 10;

          // Determine coloring strategy:
          // - 'open' (standard): green when close >= open, red otherwise
          // - 'slope' (requested): green when close >= previous candle's close, red otherwise
          let isUp = cl >= o; // fallback to open-based
          if (colorBy === 'slope') {
            const prev = i > 0 ? candles[i - 1] : null;
            if (prev) {
              isUp = c.close >= prev.close;
            } else {
              isUp = cl >= o;
            }
          }
        // wick
        ctx.beginPath();
        ctx.strokeStyle = isUp ? '#22c55e' : '#ef4444';
        ctx.lineWidth = 1;
        ctx.moveTo(x + candleWidth / 2 + 0.5, h);
        ctx.lineTo(x + candleWidth / 2 + 0.5, l);
        ctx.stroke();

        // body
        const bodyTop = Math.min(o, cl);
        const bodyHeight = Math.max(1, Math.abs(cl - o));
        ctx.fillStyle = isUp ? 'rgba(34,197,94,0.95)' : 'rgba(239,68,68,0.95)';
        ctx.fillRect(x + 0.5, bodyTop, candleWidth - 1, bodyHeight);
      }
    }

    function step(now) {
      const dt = now - lastTime;
      lastTime = now;
      nextCandleTimer += dt;

      // progress for smooth left translation
      progressOffset = Math.min(1, nextCandleTimer / tickInterval);

      // draw
      drawGrid();
      const offsetPx = progressOffset * (candleWidth + spacing);
      drawCandles(offsetPx);

      if (nextCandleTimer >= tickInterval) {
        // finalize step: produce and append next candle, remove oldest
        // derive next candle from last price
        const last = candles[candles.length - 1];
        let base = last.close;
        // gentle upward drift with noise
        const noise = (Math.random() - 0.45) * 1.8;
        const trend = 0.05 + Math.random() * 0.06; // upward bias
        const close = +(base + noise + trend).toFixed(2);
        const open = +(base + (Math.random() - 0.6) * 0.6).toFixed(2);
        const high = +(Math.max(open, close) + Math.random() * 1.2).toFixed(2);
        const low = +(Math.min(open, close) - Math.random() * 1.2).toFixed(2);
        candles.push({ open, close, high, low });
        if (candles.length > candleCount) candles.shift();
        // reset timer
        nextCandleTimer = 0;
        progressOffset = 0;
      }

      rafRef.current = requestAnimationFrame(step);
    }

    rafRef.current = requestAnimationFrame(step);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [width, height]);

  return (
    <div className="candlestick-wrapper" aria-hidden>
      <canvas ref={canvasRef} />
    </div>
  );
}
