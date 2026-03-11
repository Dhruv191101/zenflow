import React, { useRef, useEffect } from 'react';
import { logSession } from '../../utils/reliefAPI';
import { playSandCrinkle } from '../../utils/sounds';

const KineticSand = () => {
  const canvasRef = useRef(null);
  const drawing = useRef(false);
  const particles = useRef([]);
  const lastPos = useRef(null);
  const animRef = useRef(null);
  const sessionLogged = useRef(false);
  const soundThrottle = useRef(0);

  const CSS_W = 300, CSS_H = 300;

  useEffect(() => {
    const canvas = canvasRef.current;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = CSS_W * dpr;
    canvas.height = CSS_H * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    ctx.fillStyle = '#ede9ff';
    ctx.fillRect(0, 0, CSS_W, CSS_H);

    const loop = () => {
      ctx.fillStyle = 'rgba(237,233,255,0.04)';
      ctx.fillRect(0, 0, CSS_W, CSS_H);
      particles.current = particles.current.filter(p => p.life > 0.02);
      for (const p of particles.current) {
        p.x += p.vx; p.y += p.vy;
        p.vy += 0.055; p.vx *= 0.96; p.vy *= 0.98;
        p.life -= p.decay;
        ctx.save();
        ctx.globalAlpha = Math.min(p.life, 0.9);
        const r = p.size * Math.max(p.life, 0.1);
        const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
        grd.addColorStop(0, `hsla(${p.hue},72%,72%,1)`);
        grd.addColorStop(1, `hsla(${p.hue},60%,58%,0)`);
        ctx.fillStyle = grd;
        ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }
      animRef.current = requestAnimationFrame(loop);
    };
    animRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  const getXY = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const src = e.touches ? e.touches[0] : e;
    return {
      x: ((src.clientX - rect.left) / rect.width) * CSS_W,
      y: ((src.clientY - rect.top) / rect.height) * CSS_H,
    };
  };

  const spawnAt = (x, y, vx, vy) => {
    for (let i = 0; i < 10; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 1.8 + 0.4;
      particles.current.push({
        x, y,
        vx: Math.cos(angle) * speed + vx * 0.35,
        vy: Math.sin(angle) * speed + vy * 0.35,
        life: 1, decay: 0.012 + Math.random() * 0.016,
        size: 3.5 + Math.random() * 4, hue: 255 + Math.random() * 55,
      });
    }
  };

  const handleStart = (e) => {
    e.preventDefault();
    drawing.current = true;
    lastPos.current = null;
    const pos = getXY(e);
    spawnAt(pos.x, pos.y, 0, 0);
    lastPos.current = pos;
    if (!sessionLogged.current) { logSession('Kinetic Sand'); sessionLogged.current = true; }
  };

  const handleMove = (e) => {
    if (!drawing.current) return;
    e.preventDefault();
    const pos = getXY(e);
    const vx = lastPos.current ? (pos.x - lastPos.current.x) * 0.5 : 0;
    const vy = lastPos.current ? (pos.y - lastPos.current.y) * 0.5 : 0;
    spawnAt(pos.x, pos.y, vx, vy);
    const speed = Math.abs(vx) + Math.abs(vy);
    if (speed > 3) {
      const now = Date.now();
      if (now - soundThrottle.current > 60) { playSandCrinkle(); soundThrottle.current = now; }
    }
    lastPos.current = pos;
  };

  const handleEnd = () => { drawing.current = false; lastPos.current = null; };

  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', width:'100%' }}>
      <h2 style={{ fontSize:18, fontWeight:600, marginBottom:22, color:'rgba(67,56,202,0.85)' }}>
        🏖️ Kinetic Sand
      </h2>
      <div style={{ borderRadius:'1.5rem', overflow:'hidden',
        border:'1.5px solid rgba(255,255,255,0.55)',
        boxShadow:'0 12px 40px rgba(79,70,229,0.14)' }}>
        <canvas ref={canvasRef}
          onMouseDown={handleStart} onMouseMove={handleMove}
          onMouseUp={handleEnd} onMouseLeave={handleEnd}
          onTouchStart={handleStart} onTouchMove={handleMove}
          onTouchEnd={handleEnd}
          style={{ display:'block', width:CSS_W, height:CSS_H,
            cursor:'crosshair', touchAction:'none',
            userSelect:'none', WebkitUserSelect:'none' }} />
      </div>
      <p style={{ marginTop:18, fontSize:11, color:'rgba(67,56,202,0.42)',
        textTransform:'uppercase', letterSpacing:'0.17em', fontWeight:500 }}>
        Draw slowly to feel the sand flow
      </p>
    </div>
  );
};
export default KineticSand;
