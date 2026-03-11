import React, { useRef, useEffect } from 'react';
import { logSession } from '../../utils/reliefAPI';

// Lava Lamp — canvas-based metaball blobs that slowly rise and fall
const BLOB_COUNT = 6;
const BLOB_COLORS = [
  [165, 180, 252], // indigo
  [249, 168, 212], // pink
  [110, 231, 183], // green
  [196, 181, 253], // violet
  [253, 230, 138], // yellow
  [147, 197, 253], // blue
];

const LavaLamp = () => {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const sessionLogged = useRef(false);

  const W = 180, H = 340;

  useEffect(() => {
    const canvas = canvasRef.current;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    // Initialize blobs with unique rise/fall cycles
    const blobs = Array.from({ length: BLOB_COUNT }, (_, i) => ({
      x: W * 0.15 + Math.random() * W * 0.7,
      y: H * 0.4 + Math.random() * H * 0.5,
      vy: -0.18 - Math.random() * 0.14,   // start rising
      vx: (Math.random() - 0.5) * 0.25,
      r: 28 + Math.random() * 18,
      phase: Math.random() * Math.PI * 2,
      speed: 0.0005 + Math.random() * 0.0008,
      color: BLOB_COLORS[i % BLOB_COLORS.length],
    }));

    const loop = (ts) => {
      // Lamp glass bg
      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, 'rgba(30,15,60,0.98)');
      bg.addColorStop(1, 'rgba(15,8,40,0.98)');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      for (const b of blobs) {
        // Wavy horizontal drift
        b.x += b.vx + Math.sin(ts * 0.0007 + b.phase) * 0.3;
        b.y += b.vy;

        // Bounce at top/bottom with velocity reversal + natural float
        if (b.y - b.r < 0) { b.y = b.r; b.vy = Math.abs(b.vy) * 0.6; }
        if (b.y + b.r > H) { b.y = H - b.r; b.vy = -Math.abs(b.vy) * 0.8; }

        // Gravity towards center height + natural rise when at bottom
        const targetY = H * 0.3;
        b.vy += (b.y > H * 0.65) ? -0.004 : (b.y < H * 0.15) ? 0.003 : 0;
        b.vy *= 0.995; // dampen

        // Bounce off walls
        if (b.x - b.r < 8) { b.x = 8 + b.r; b.vx = Math.abs(b.vx); }
        if (b.x + b.r > W - 8) { b.x = W - 8 - b.r; b.vx = -Math.abs(b.vx); }

        // Blob glow
        const [r, g, bl] = b.color;
        const grd = ctx.createRadialGradient(b.x - b.r * 0.25, b.y - b.r * 0.25, 0, b.x, b.y, b.r * 1.3);
        grd.addColorStop(0, `rgba(255,255,255,0.55)`);
        grd.addColorStop(0.3, `rgba(${r},${g},${bl},0.85)`);
        grd.addColorStop(1, `rgba(${r/2},${g/2},${bl/2},0)`);
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();
      }

      // Lamp glass rim
      const rim = ctx.createLinearGradient(0, 0, W, 0);
      rim.addColorStop(0, 'rgba(255,255,255,0.15)');
      rim.addColorStop(0.5, 'rgba(255,255,255,0)');
      rim.addColorStop(1, 'rgba(255,255,255,0.08)');
      ctx.fillStyle = rim;
      ctx.fillRect(0, 0, W, H);

      animRef.current = requestAnimationFrame(loop);
    };
    animRef.current = requestAnimationFrame(loop);
    if (!sessionLogged.current) { logSession('Lava Lamp'); sessionLogged.current = true; }
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', width:'100%' }}>
      <h2 style={{ fontSize:18, fontWeight:600, marginBottom:16, color:'rgba(67,56,202,0.85)' }}>
        🫙 Lava Lamp
      </h2>
      <div style={{ borderRadius:'3rem', overflow:'hidden',
        border:'2px solid rgba(255,255,255,0.2)',
        boxShadow:'0 16px 48px rgba(15,8,40,0.5), 0 0 60px rgba(165,180,252,0.15)' }}>
        <canvas ref={canvasRef} style={{ display:'block', width:W, height:H }} />
      </div>
      <p style={{ marginTop:14, fontSize:11, color:'rgba(67,56,202,0.42)',
        textTransform:'uppercase', letterSpacing:'0.15em', fontWeight:500 }}>
        Watch the blobs float — just breathe
      </p>
    </div>
  );
};
export default LavaLamp;
