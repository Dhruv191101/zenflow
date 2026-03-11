import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { triggerHaptic, HAPTICS } from '../../utils/haptics';
import { playBubblePop } from '../../utils/sounds';
import { logSession } from '../../utils/reliefAPI';

// Hexagonal Pop-It grid
const COLS = 5, ROWS = 4;
const HEX_SIZE = 34;
const HEX_COLORS = ['#a5b4fc','#f9a8d4','#6ee7b7','#fde68a','#c4b5fd','#93c5fd'];

const PopIt = () => {
  const total = COLS * ROWS;
  const [popped, setPopped] = useState(() => new Set());
  const sessionLogged = React.useRef(false);

  const popBubble = useCallback((idx) => {
    if (popped.has(idx)) return;
    setPopped(prev => new Set([...prev, idx]));
    triggerHaptic(HAPTICS.bubblePop);
    playBubblePop();
    if (!sessionLogged.current) { logSession('Pop It'); sessionLogged.current = true; }
    if (popped.size + 1 === total) setTimeout(() => setPopped(new Set()), 1200);
  }, [popped, total]);

  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', width:'100%' }}>
      <h2 style={{ fontSize:18, fontWeight:600, marginBottom:16, color:'rgba(67,56,202,0.85)' }}>
        🟣 Pop It
      </h2>
      <div style={{ padding:16, background:'rgba(255,255,255,0.15)', borderRadius:'1.5rem',
        border:'1.5px solid rgba(255,255,255,0.4)' }}>
        <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
          {Array.from({ length: ROWS }).map((_, r) => (
            <div key={r} style={{ display:'flex', gap:6, justifyContent:'center',
              marginLeft: r % 2 === 1 ? HEX_SIZE * 0.62 : 0 }}>
              {Array.from({ length: COLS }).map((_, c) => {
                const idx = r * COLS + c;
                const color = HEX_COLORS[(r + c) % HEX_COLORS.length];
                const isPopped = popped.has(idx);
                return (
                  <motion.button key={idx}
                    whileTap={{ scale: 0.82 }}
                    onPointerDown={() => popBubble(idx)}
                    style={{
                      width: HEX_SIZE * 1.4, height: HEX_SIZE * 1.6, flexShrink:0,
                      touchAction:'manipulation', WebkitTapHighlightColor:'transparent',
                      clipPath:'polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)',
                      background: isPopped
                        ? 'rgba(255,255,255,0.1)'
                        : `radial-gradient(circle at 40% 35%, rgba(255,255,255,0.85) 0%, ${color} 70%)`,
                      border:'none', cursor: isPopped ? 'default' : 'pointer',
                      boxShadow: isPopped ? 'none' : `inset 0 -4px 8px rgba(0,0,0,0.08)`,
                      transition:'background 0.2s, box-shadow 0.2s',
                    }} />
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <p style={{ marginTop:14, fontSize:11, color:'rgba(67,56,202,0.42)',
        textTransform:'uppercase', letterSpacing:'0.15em', fontWeight:500 }}>
        {popped.size === total ? '✓ All popped! Resetting…' : `${total - popped.size} left to pop`}
      </p>
    </div>
  );
};
export default PopIt;
