import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { triggerHaptic, HAPTICS } from '../../utils/haptics';
import { playLightTick } from '../../utils/sounds';
import { logSession } from '../../utils/reliefAPI';

const ARM_COUNT = 3;
const SPINNER_COLORS = [
  'linear-gradient(135deg,#a5b4fc,#7c3aed)',
  'linear-gradient(135deg,#f9a8d4,#ec4899)',
  'linear-gradient(135deg,#6ee7b7,#059669)',
];

const FidgetSpinner = () => {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [colorIdx, setColorIdx] = useState(0);
  const angleRef = useRef(0);
  const velRef = useRef(0);
  const rafRef = useRef(null);
  const lastAngleRef = useRef(null);
  const lastTimeRef = useRef(null);
  const pointerDownRef = useRef(null);
  const sessionLogged = useRef(false);
  const clickCountRef = useRef(0);
  const lastClickTime = useRef(0);

  // Physics loop
  const startPhysics = useCallback(() => {
    const FRICTION = 0.988;
    const CLICK_INTERVAL_DEG = 72; // haptic every 72°
    let lastClickAngle = 0;

    const loop = () => {
      velRef.current *= FRICTION;
      angleRef.current += velRef.current;

      // Virtual "click" haptic/sound per blade pass
      const passed = Math.floor(Math.abs(angleRef.current - lastClickAngle) / CLICK_INTERVAL_DEG);
      if (passed > 0) {
        lastClickAngle = angleRef.current;
        if (Math.abs(velRef.current) > 0.5) {
          playLightTick();
          triggerHaptic([8]);
        }
      }

      setRotation(angleRef.current % 360);

      if (Math.abs(velRef.current) < 0.05) {
        velRef.current = 0;
        setSpinning(false);
        cancelAnimationFrame(rafRef.current);
        return;
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
  }, []);

  const getPolarAngle = (e, el) => {
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const src = e.touches ? e.touches[0] : e;
    return Math.atan2(src.clientY - cy, src.clientX - cx) * (180 / Math.PI);
  };

  const onStart = useCallback((e) => {
    e.preventDefault();
    cancelAnimationFrame(rafRef.current);
    const angle = getPolarAngle(e, e.currentTarget);
    lastAngleRef.current = angle;
    lastTimeRef.current = Date.now();
    pointerDownRef.current = { angle };
    if (!sessionLogged.current) { logSession('Fidget Spinner'); sessionLogged.current = true; }
  }, []);

  const onMove = useCallback((e) => {
    if (lastAngleRef.current === null) return;
    e.preventDefault();
    const angle = getPolarAngle(e, e.currentTarget.closest('[data-spinner]') || e.currentTarget);
    const delta = angle - lastAngleRef.current;
    // Handle wraparound at ±180°
    const dd = delta > 180 ? delta - 360 : delta < -180 ? delta + 360 : delta;
    velRef.current = dd * 0.3;
    angleRef.current += dd;
    setRotation(angleRef.current % 360);
    lastAngleRef.current = angle;
    lastTimeRef.current = Date.now();
  }, []);

  const onEnd = useCallback((e) => {
    if (lastAngleRef.current === null) return;
    lastAngleRef.current = null;
    const speed = Math.abs(velRef.current);
    if (speed > 0.5) {
      setSpinning(true);
      velRef.current = Math.min(velRef.current * 4, 25);
      startPhysics();
    } else {
      velRef.current = 0;
    }
  }, [startPhysics]);

  // Flick button
  const flick = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    velRef.current = 18 + Math.random() * 6;
    setSpinning(true);
    triggerHaptic(HAPTICS.heavyClick);
    startPhysics();
    if (!sessionLogged.current) { logSession('Fidget Spinner'); sessionLogged.current = true; }
  }, [startPhysics]);

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  const SIZE = 200;
  const CENTER = SIZE / 2;
  const ARM_LEN = 75;
  const BALL_R = 28;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8, color: 'rgba(67,56,202,0.85)' }}>
        🌀 Fidget Spinner
      </h2>
      <p style={{ fontSize: 12, color: 'rgba(79,70,229,0.45)', marginBottom: 20, textTransform: 'uppercase',
        letterSpacing: '0.12em', fontWeight: 500 }}>
        Drag to spin · Flick to launch
      </p>

      {/* Spinner SVG */}
      <div data-spinner="true"
        onPointerDown={onStart} onPointerMove={onMove} onPointerUp={onEnd}
        onTouchStart={onStart} onTouchMove={onMove} onTouchEnd={onEnd}
        style={{ width: SIZE, height: SIZE, touchAction: 'none',
          cursor: spinning ? 'grab' : 'pointer', userSelect: 'none',
          WebkitUserSelect: 'none' }}>
        <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}
          style={{ transform: `rotate(${rotation}deg)`, transition: spinning ? 'none' : 'transform 0.05s' }}>
          {/* Arms */}
          {Array.from({ length: ARM_COUNT }).map((_, i) => {
            const a = (i * 360) / ARM_COUNT;
            const rad = a * (Math.PI / 180);
            const bx = CENTER + Math.cos(rad) * ARM_LEN;
            const by = CENTER + Math.sin(rad) * ARM_LEN;
            return (
              <g key={i}>
                <line x1={CENTER} y1={CENTER} x2={bx} y2={by}
                  stroke="rgba(167,139,250,0.55)" strokeWidth={18} strokeLinecap="round" />
                {/* Ball at tip */}
                <circle cx={bx} cy={by} r={BALL_R}
                  fill="url(#ballGrad)" stroke="rgba(255,255,255,0.7)" strokeWidth={2} />
                {/* Ball gloss */}
                <circle cx={bx - 8} cy={by - 8} r={8} fill="rgba(255,255,255,0.55)" />
              </g>
            );
          })}
          {/* Center hub */}
          <circle cx={CENTER} cy={CENTER} r={28}
            fill="url(#hubGrad)" stroke="rgba(255,255,255,0.8)" strokeWidth={3} />
          <circle cx={CENTER - 7} cy={CENTER - 7} r={9} fill="rgba(255,255,255,0.6)" />

          <defs>
            <radialGradient id="ballGrad" cx="38%" cy="35%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.95)" />
              <stop offset="45%" stopColor={colorIdx === 0 ? '#a5b4fc' : colorIdx === 1 ? '#f9a8d4' : '#6ee7b7'} />
              <stop offset="100%" stopColor={colorIdx === 0 ? '#7c3aed' : colorIdx === 1 ? '#ec4899' : '#059669'} stopOpacity={0.9} />
            </radialGradient>
            <radialGradient id="hubGrad" cx="35%" cy="32%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.98)" />
              <stop offset="50%" stopColor="#c4b5fd" />
              <stop offset="100%" stopColor="#7c3aed" stopOpacity={0.85} />
            </radialGradient>
          </defs>
        </svg>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
        <motion.button whileTap={{ scale: 0.92 }} onPointerDown={flick}
          style={{ padding: '14px 32px', borderRadius: 999, fontWeight: 700, fontSize: 15,
            background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', color: 'white',
            boxShadow: '0 8px 24px rgba(79,70,229,0.35)',
            touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}>
          ⚡ Flick
        </motion.button>
        <motion.button whileTap={{ scale: 0.92 }}
          onPointerDown={() => { setColorIdx(i => (i + 1) % SPINNER_COLORS.length); playLightTick(); }}
          style={{ padding: '14px 18px', borderRadius: 999, fontWeight: 600, fontSize: 18,
            background: 'rgba(255,255,255,0.30)', border: '1.5px solid rgba(255,255,255,0.6)',
            color: 'rgba(79,70,229,0.7)',
            touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}>
          🎨
        </motion.button>
      </div>
      <p style={{ marginTop: 14, fontSize: 11, color: 'rgba(67,56,202,0.4)', fontWeight: 500,
        letterSpacing: '0.08em' }}>
        {spinning ? `${Math.abs(velRef.current).toFixed(1)} RPM/s` : 'Flick to spin'}
      </p>
    </div>
  );
};

export default FidgetSpinner;
