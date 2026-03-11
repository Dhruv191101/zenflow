import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { logSession } from '../../utils/reliefAPI';

// Fully self-contained — creates its own AudioContext on Start press (user gesture)
const HapticHeartbeat = () => {
  const [bpm, setBpm] = useState(60);
  const [active, setActive] = useState(false);
  const [beat, setBeat] = useState(false);
  const intervalRef = useRef(null);
  const acRef = useRef(null);
  const sessionLogged = useRef(false);

  // Synthesized lub-dub sound — created fresh per beat
  const playLubDub = useCallback(() => {
    try {
      if (!acRef.current) return;
      const ac = acRef.current;
      if (ac.state === 'suspended') ac.resume();

      const playThud = (time, freq, gainVal, dur) => {
        const osc = ac.createOscillator();
        const gainNode = ac.createGain();
        const filter = ac.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = freq * 3;
        osc.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(ac.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, time);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.4, time + dur);
        gainNode.gain.setValueAtTime(gainVal, time);
        gainNode.gain.exponentialRampToValueAtTime(0.001, time + dur);
        osc.start(time);
        osc.stop(time + dur + 0.01);
      };

      // "Lub" — lower, stronger
      playThud(ac.currentTime, 80, 0.5, 0.12);
      // "Dub" — higher, softer, delayed by 90ms
      playThud(ac.currentTime + 0.09, 60, 0.3, 0.10);
    } catch { /* silent fail */ }
  }, []);

  // Vibrate using lub-dub pattern
  const vibrateHeart = useCallback(() => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([60, 80, 40]);
    }
  }, []);

  const tick = useCallback(() => {
    setBeat(true);
    playLubDub();
    vibrateHeart();
    setTimeout(() => setBeat(false), 250);
  }, [playLubDub, vibrateHeart]);

  const start = useCallback(() => {
    // MUST create/resume AudioContext inside user gesture handler
    if (!acRef.current) {
      acRef.current = new (window.AudioContext || window.webkitAudioContext)();
    } else if (acRef.current.state === 'suspended') {
      acRef.current.resume();
    }
    setActive(true);
    if (!sessionLogged.current) { logSession('Haptic Heartbeat'); sessionLogged.current = true; }
  }, []);

  const stop = useCallback(() => {
    setActive(false);
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
  }, []);

  // Re-create interval whenever bpm changes or active toggles
  useEffect(() => {
    if (!active) { if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; } return; }
    if (intervalRef.current) clearInterval(intervalRef.current);
    tick(); // immediate first beat
    intervalRef.current = setInterval(tick, Math.round(60000 / bpm));
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [active, bpm, tick]);

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current); }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8, color: 'rgba(67,56,202,0.85)' }}>
        💓 Haptic Heartbeat
      </h2>
      <p style={{ fontSize: 12, color: 'rgba(79,70,229,0.5)', textAlign: 'center', marginBottom: 24 }}>
        Vagus nerve entrainment — hold your phone to feel the beat
      </p>

      {/* Animated heart */}
      <motion.div
        animate={{ scale: beat ? 1.18 : 1, filter: beat ? 'drop-shadow(0 0 18px rgba(236,72,153,0.7))' : 'drop-shadow(0 4px 8px rgba(236,72,153,0.2))' }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
        style={{ fontSize: 76, marginBottom: 20, lineHeight: 1, userSelect: 'none' }}>
        ❤️
      </motion.div>

      {/* BPM Display */}
      <div style={{ fontSize: 44, fontWeight: 800, color: '#4f46e5', marginBottom: 4, letterSpacing: '-0.02em' }}>
        {bpm}
      </div>
      <p style={{ fontSize: 11, color: 'rgba(79,70,229,0.45)', fontWeight: 700,
        textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 22 }}>BPM</p>

      {/* BPM Slider */}
      <div style={{ width: '100%', marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 11, color: 'rgba(79,70,229,0.4)', fontWeight: 500 }}>30 (very calm)</span>
          <span style={{ fontSize: 11, color: 'rgba(79,70,229,0.4)', fontWeight: 500 }}>75 BPM</span>
        </div>
        <input type="range" min={30} max={75} value={bpm}
          onChange={e => setBpm(Number(e.target.value))}
          style={{ width: '100%', height: 8, borderRadius: 99, cursor: 'pointer', appearance: 'none',
            WebkitAppearance: 'none', outline: 'none',
            background: `linear-gradient(to right,#4f46e5 0%,#4f46e5 ${((bpm-30)/45)*100}%,rgba(220,215,255,0.8) ${((bpm-30)/45)*100}%,rgba(220,215,255,0.8) 100%)` }} />
      </div>

      <p style={{ fontSize: 12, color: 'rgba(79,70,229,0.4)', textAlign: 'center', marginBottom: 22 }}>
        📱 Hold phone to chest — no screen needed
      </p>

      <motion.button whileTap={{ scale: 0.94 }}
        onPointerDown={active ? stop : start}
        style={{ padding: '16px 48px', borderRadius: 999, fontWeight: 700, fontSize: 15,
          touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent',
          background: active ? 'rgba(255,255,255,0.35)' : 'linear-gradient(135deg,#ec4899,#be185d)',
          color: active ? '#ec4899' : 'white',
          border: active ? '1.5px solid rgba(236,72,153,0.5)' : 'none',
          boxShadow: active ? 'none' : '0 8px 24px rgba(236,72,153,0.35)',
          transition: 'all 0.25s' }}>
        {active ? '⏸ Pause' : '▶ Start Heartbeat'}
      </motion.button>
    </div>
  );
};

export default HapticHeartbeat;
