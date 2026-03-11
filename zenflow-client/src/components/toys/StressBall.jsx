import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { logSession } from '../../utils/reliefAPI';
import { playLightTick } from '../../utils/sounds';

const COLORS = [
  { start:'#f9a8d4', end:'#ec4899' },
  { start:'#6ee7b7', end:'#059669' },
  { start:'#a5b4fc', end:'#7c3aed' },
  { start:'#fde68a', end:'#d97706' },
];

const StressBall = () => {
  const [squeeze, setSqueeze] = useState(0); // 0–1
  const [colorIdx, setColorIdx] = useState(0);
  const [squeezes, setSqueezes] = useState(0);
  const sessionLogged = useRef(false);
  const intervalRef = useRef(null);
  const color = COLORS[colorIdx % COLORS.length];

  const startSqueeze = (e) => {
    e.preventDefault();
    setSqueeze(1);
    if (navigator.vibrate) navigator.vibrate([30, 20, 50]);
    setSqueezes(c => c + 1);
    if (!sessionLogged.current) { logSession('Stress Ball'); sessionLogged.current = true; }
  };
  const endSqueeze = () => setSqueeze(0);

  // Idle slow pulse
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setSqueeze(s => s > 0 ? s : 0);
    }, 2000);
    return () => clearInterval(intervalRef.current);
  }, []);

  const handleColorTap = (e) => {
    e.preventDefault();
    if (squeeze === 0) {
      setColorIdx(c => c + 1);
      playLightTick();
    }
  };

  // Morph shape using border-radius
  const getBorderRadius = () => {
    if (squeeze === 0) return '50%';
    return `${35 + Math.random() * 10}% ${65 - Math.random() * 8}% ${45 + Math.random() * 12}% ${55 - Math.random() * 10}% / ${50 + Math.random() * 8}% ${45 - Math.random() * 10}% ${55 + Math.random() * 8}% ${50 - Math.random() * 6}%`;
  };

  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', width:'100%' }}>
      <h2 style={{ fontSize:18, fontWeight:600, marginBottom:8, color:'rgba(67,56,202,0.85)' }}>
        🫷 Stress Ball
      </h2>
      <p style={{ fontSize:12, color:'rgba(79,70,229,0.45)', marginBottom:24, fontWeight:500 }}>
        Press and hold to squeeze · Tap to change colour
      </p>

      <motion.button
        onPointerDown={startSqueeze}
        onPointerUp={endSqueeze}
        onPointerLeave={endSqueeze}
        onTouchStart={startSqueeze}
        onTouchEnd={endSqueeze}
        onTouchCancel={endSqueeze}
        onContextMenu={handleColorTap}
        animate={{
          scale: squeeze ? 0.82 : [1, 1.03, 1],
          borderRadius: squeeze ? '38% 62% 44% 56% / 52% 46% 54% 48%' : '50%',
        }}
        transition={{
          scale: squeeze ? { duration:0.08 } : { duration:3, repeat:Infinity, ease:'easeInOut' },
          borderRadius: squeeze ? { duration:0.1 } : { duration:2, repeat:Infinity, ease:'easeInOut' },
        }}
        style={{
          width:180, height:180, borderRadius:'50%', flexShrink:0,
          touchAction:'manipulation', WebkitTapHighlightColor:'transparent',
          background:`radial-gradient(circle at 38% 32%, rgba(255,255,255,0.88) 0%, ${color.start} 45%, ${color.end} 100%)`,
          border:'3px solid rgba(255,255,255,0.7)',
          boxShadow: squeeze
            ? `inset 0 8px 24px rgba(0,0,0,0.2), 0 2px 8px rgba(0,0,0,0.1)`
            : `0 16px 40px ${color.end}44, inset 0 4px 16px rgba(255,255,255,0.7)`,
          cursor:'pointer', position:'relative', display:'flex', alignItems:'center', justifyContent:'center',
        }}>
        {/* Gloss */}
        <div style={{ position:'absolute', top:18, left:32, width:55, height:32,
          background:'rgba(255,255,255,0.5)', borderRadius:'50%', transform:'rotate(-28deg)',
          filter:'blur(5px)', pointerEvents:'none' }} />
        <span style={{ fontSize:44, userSelect:'none', pointerEvents:'none' }}>
          {squeeze ? '💥' : '😌'}
        </span>
      </motion.button>

      <div style={{ marginTop:20, display:'flex', gap:16, alignItems:'center' }}>
        {COLORS.map((c, i) => (
          <motion.button key={i} whileTap={{ scale:0.85 }}
            onPointerDown={() => { setColorIdx(i); playLightTick(); }}
            style={{ width:28, height:28, borderRadius:'50%', flexShrink:0,
              touchAction:'manipulation',
              background:`linear-gradient(135deg,${c.start},${c.end})`,
              border: colorIdx % COLORS.length === i ? '2.5px solid white' : '2px solid rgba(255,255,255,0.4)',
              boxShadow: colorIdx % COLORS.length === i ? `0 0 12px ${c.end}88` : 'none' }} />
        ))}
      </div>
      <p style={{ marginTop:12, fontSize:13, color:'rgba(79,70,229,0.5)', fontWeight:600 }}>
        {squeezes === 0 ? 'Squeeze away your stress' : `${squeezes} squeezes 💪`}
      </p>
    </div>
  );
};
export default StressBall;
