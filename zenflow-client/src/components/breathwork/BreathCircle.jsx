import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { triggerHaptic, HAPTICS } from '../../utils/haptics';
import { playBreatheSwell } from '../../utils/sounds';
import { logSession } from '../../utils/reliefAPI';

const PROTOCOLS = [
  {
    id: 'cyclic', name: 'Cyclic Sighing', icon: '🌊',
    desc: 'Double inhale, long exhale — most effective for rapid calm',
    phases: [
      { label:'Inhale', dur:3, scale:1.2, haptic:() => triggerHaptic(HAPTICS.breatheIn) },
      { label:'Inhale more', dur:1.5, scale:1.35, haptic:() => triggerHaptic([5]) },
      { label:'Exhale slowly', dur:6, scale:0.65, haptic:() => triggerHaptic(HAPTICS.breatheOut) },
    ]
  },
  {
    id: 'box', name: 'Box Breathing', icon: '⬛',
    desc: '4–4–4–4 equal phases — used by Navy SEALs for focus',
    phases: [
      { label:'Inhale', dur:4, scale:1.2, haptic:() => triggerHaptic(HAPTICS.breatheIn) },
      { label:'Hold', dur:4, scale:1.2, haptic:() => triggerHaptic(HAPTICS.breatheHold) },
      { label:'Exhale', dur:4, scale:0.65, haptic:() => triggerHaptic(HAPTICS.breatheOut) },
      { label:'Hold', dur:4, scale:0.65, haptic:() => triggerHaptic(HAPTICS.breatheHold) },
    ]
  },
  {
    id: '478', name: '4-7-8 Breathing', icon: '🌙',
    desc: 'Natural tranquiliser — great for sleep and deep calm',
    phases: [
      { label:'Inhale', dur:4, scale:1.2, haptic:() => triggerHaptic(HAPTICS.breatheIn) },
      { label:'Hold', dur:7, scale:1.2, haptic:() => triggerHaptic(HAPTICS.breatheHold) },
      { label:'Exhale', dur:8, scale:0.65, haptic:() => triggerHaptic(HAPTICS.breatheOut) },
    ]
  },
];

const COLORS = ['#a5b4fc','#c4b5fd','#93c5fd'];

const BreathCircle = () => {
  const [selectedId, setSelectedId] = useState('cyclic');
  const [running, setRunning] = useState(false);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [cycle, setCycle] = useState(0);
  const timerRef = useRef(null);

  const protocol = PROTOCOLS.find(p => p.id === selectedId);

  const startNext = (idx, cyc) => {
    const phase = protocol.phases[idx % protocol.phases.length];
    phase.haptic?.();
    // Play a soft ambient tone matching the phase type
    const freq = phase.label.toLowerCase().includes('exhale') ? 130 : phase.label.toLowerCase().includes('hold') ? 160 : 200;
    playBreatheSwell(freq, phase.dur * 0.8);
    timerRef.current = setTimeout(() => {
      const nextIdx = (idx + 1) % protocol.phases.length;
      const nextCycle = nextIdx === 0 ? cyc + 1 : cyc;
      setPhaseIdx(nextIdx);
      setCycle(nextCycle);
      startNext(nextIdx, nextCycle);
    }, phase.dur * 1000);
  };

  const start = () => {
    setRunning(true); setPhaseIdx(0); setCycle(0);
    logSession(protocol.name);
    startNext(0, 0);
  };
  const stop = () => {
    setRunning(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    setPhaseIdx(0); setCycle(0);
  };

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  const currentPhase = protocol.phases[phaseIdx % protocol.phases.length];
  const color = COLORS[PROTOCOLS.indexOf(protocol)];

  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', width:'100%' }}>
      {/* Protocol selector */}
      {!running && (
        <div style={{ display:'flex', gap:8, marginBottom:24, width:'100%' }}>
          {PROTOCOLS.map(p => (
            <button key={p.id} onClick={() => setSelectedId(p.id)}
              style={{ flex:1, padding:'12px 6px', borderRadius:'1.25rem', textAlign:'center',
                fontSize:11, fontWeight:600, letterSpacing:'0.04em',
                color: selectedId === p.id ? '#4f46e5' : 'rgba(79,70,229,0.45)',
                background: selectedId === p.id ? 'white' : 'rgba(255,255,255,0.18)',
                border: '1.5px solid rgba(255,255,255,' + (selectedId === p.id ? '0.8' : '0.35') + ')',
                boxShadow: selectedId === p.id ? '0 4px 16px rgba(79,70,229,0.14)' : 'none',
                transition:'all 0.2s' }}>
              <div style={{ fontSize:20, marginBottom:4 }}>{p.icon}</div>
              {p.name}
            </button>
          ))}
        </div>
      )}

      {/* Description */}
      {!running && (
        <p style={{ fontSize:13, color:'rgba(79,70,229,0.55)', textAlign:'center',
          marginBottom:24, fontWeight:500 }}>{protocol.desc}</p>
      )}

      {/* Breathing circle */}
      <div style={{ position:'relative', width:200, height:200,
        display:'flex', alignItems:'center', justifyContent:'center', marginBottom:24 }}>
        {/* Outer glow rings */}
        {running && [0, 1, 2].map(i => (
          <motion.div key={i}
            animate={{ scale: running ? [currentPhase.scale + i * 0.15, currentPhase.scale + i * 0.18] : 1, opacity:[0.15, 0.05] }}
            transition={{ duration: currentPhase.dur, ease:'easeInOut', repeat:Infinity, repeatType:'reverse' }}
            style={{ position:'absolute', width:'100%', height:'100%', borderRadius:'50%',
              border:`1.5px solid ${color}`, opacity:0.15, pointerEvents:'none' }} />
        ))}

        {/* Main breathing circle */}
        <motion.div
          animate={{ scale: running ? currentPhase.scale : 0.8 }}
          transition={{ duration: running ? currentPhase.dur : 0.5, ease:'easeInOut' }}
          style={{ width:'100%', height:'100%', borderRadius:'50%',
            background: `radial-gradient(circle at 38% 35%, rgba(255,255,255,0.9) 0%, ${color}99 60%, ${color}55 100%)`,
            boxShadow: `0 0 40px ${color}55, inset 0 4px 16px rgba(255,255,255,0.7)`,
            border: `2px solid rgba(255,255,255,0.7)`,
            display:'flex', alignItems:'center', justifyContent:'center' }}>
          <div style={{ textAlign:'center' }}>
            <div style={{ fontSize:26, marginBottom:4 }}>{protocol.icon}</div>
            {running && (
              <p style={{ fontSize:13, fontWeight:700, color:'rgba(79,70,229,0.9)',
                letterSpacing:'0.04em' }}>{currentPhase.label}</p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Cycle counter */}
      {running && (
        <p style={{ fontSize:12, color:'rgba(79,70,229,0.5)', fontWeight:500,
          marginBottom:16, letterSpacing:'0.1em' }}>
          Cycle {cycle + 1}
        </p>
      )}

      {/* Start/Stop button */}
      <motion.button whileTap={{ scale: 0.93 }} onPointerDown={running ? stop : start}
        style={{ padding:'16px 48px', borderRadius:999, fontWeight:700, fontSize:15,
          letterSpacing:'0.04em', touchAction:'manipulation', WebkitTapHighlightColor:'transparent',
          background: running ? 'rgba(255,255,255,0.35)' : `linear-gradient(135deg,#4f46e5,#7c3aed)`,
          color: running ? '#4f46e5' : 'white',
          border: running ? '1.5px solid rgba(79,70,229,0.4)' : 'none',
          boxShadow: running ? 'none' : '0 8px 24px rgba(79,70,229,0.35)',
          transition:'all 0.25s' }}>
        {running ? 'Stop' : 'Start Breathing'}
      </motion.button>
    </div>
  );
};
export default BreathCircle;
