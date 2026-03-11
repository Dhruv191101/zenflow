import React, { useRef, useEffect, useCallback } from 'react';
import { logSession } from '../../utils/reliefAPI';

const RIPPLE_LIFETIME = 1200; // ms

const RipplePool = () => {
  const canvasRef = useRef(null);
  const ripples = useRef([]);
  const animRef = useRef(null);
  const sessionLogged = useRef(false);

  const W = 300, H = 280;

  useEffect(() => {
    const canvas = canvasRef.current;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    const loop = (ts) => {
      // Deep water background
      ctx.fillStyle = 'rgba(15,23,75,0.92)';
      ctx.fillRect(0, 0, W, H);

      // Draw caustic shimmer
      ctx.save();
      ctx.globalAlpha = 0.04;
      for (let i = 0; i < 12; i++) {
        const x = (Math.sin(ts * 0.0005 + i * 1.1) * 0.5 + 0.5) * W;
        const y = (Math.cos(ts * 0.0007 + i * 0.7) * 0.5 + 0.5) * H;
        const g = ctx.createRadialGradient(x, y, 0, x, y, 60);
        g.addColorStop(0, '#6ee7b7');
        g.addColorStop(1, 'transparent');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
      }
      ctx.restore();

      const now = Date.now();
      ripples.current = ripples.current.filter(r => now - r.ts < RIPPLE_LIFETIME);

      for (const r of ripples.current) {
        const age = now - r.ts;
        const t = age / RIPPLE_LIFETIME;
        for (let ring = 0; ring < 5; ring++) {
          const delay = ring * 0.18;
          const rt = Math.max(0, t - delay);
          if (rt <= 0) continue;
          const radius = rt * 120;
          const alpha = (1 - rt) * 0.55;
          ctx.save();
          ctx.strokeStyle = `rgba(110,231,183,${alpha})`;
          ctx.lineWidth = 1.5 * (1 - rt * 0.7);
          ctx.globalAlpha = alpha;
          ctx.beginPath();
          ctx.arc(r.x, r.y, radius, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }
        // Center drop
        if (t < 0.15) {
          const dropAlpha = 1 - t / 0.15;
          ctx.save();
          ctx.fillStyle = `rgba(167,243,208,${dropAlpha * 0.9})`;
          ctx.globalAlpha = dropAlpha;
          ctx.beginPath();
          ctx.arc(r.x, r.y, 4 * (1 - t / 0.15), 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      // Reflection shimmer
      ctx.save();
      ctx.globalAlpha = 0.03 + Math.sin(ts * 0.002) * 0.01;
      ctx.fillStyle = 'rgba(167,243,208,0.8)';
      ctx.fillRect(0, 0, W, H);
      ctx.restore();

      animRef.current = requestAnimationFrame(loop);
    };
    animRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  const addRipple = useCallback((e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const src = e.touches ? e.touches[0] : e;
    ripples.current.push({
      x: ((src.clientX - rect.left) / rect.width) * W,
      y: ((src.clientY - rect.top) / rect.height) * H,
      ts: Date.now(),
    });
    if (navigator.vibrate) navigator.vibrate([20]);
    if (!sessionLogged.current) { logSession('Ripple Pool'); sessionLogged.current = true; }
  }, []);

  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', width:'100%' }}>
      <h2 style={{ fontSize:18, fontWeight:600, marginBottom:16, color:'rgba(67,56,202,0.85)' }}>
        💧 Ripple Pool
      </h2>
      <div style={{ borderRadius:'1.5rem', overflow:'hidden',
        border:'1.5px solid rgba(99,102,241,0.35)',
        boxShadow:'0 12px 40px rgba(15,23,75,0.35)' }}>
        <canvas ref={canvasRef}
          onMouseDown={addRipple} onTouchStart={addRipple}
          style={{ display:'block', width:W, height:H,
            cursor:'crosshair', touchAction:'none', userSelect:'none' }} />
      </div>
      <p style={{ marginTop:14, fontSize:11, color:'rgba(67,56,202,0.42)',
        textTransform:'uppercase', letterSpacing:'0.15em', fontWeight:500 }}>
        Tap the water to make ripples
      </p>
    </div>
  );
};
export default RipplePool;
