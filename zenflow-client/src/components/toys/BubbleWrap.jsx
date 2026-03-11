import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { triggerHaptic, HAPTICS } from '../../utils/haptics';
import { playBubblePop } from '../../utils/sounds';

const BSZ = 52, GAP = 10, COLS = 5, ROWS = 5;
const GW = COLS * BSZ + (COLS - 1) * GAP;
const GH = ROWS * BSZ + (ROWS - 1) * GAP;

const Bubble = () => {
  const [popped, setPopped] = useState(false);

  // Use onPointerDown for reliable cross-platform (iOS + Android) touch handling
  const pop = useCallback((e) => {
    e.preventDefault();
    if (popped) return;
    setPopped(true);
    triggerHaptic(HAPTICS.bubblePop);
    playBubblePop();
    setTimeout(() => setPopped(false), 3500);
  }, [popped]);

  return (
    <motion.button
      onPointerDown={pop}
      style={{
        width: BSZ, height: BSZ, minWidth: BSZ, minHeight: BSZ,
        borderRadius: '50%', padding: 0,
        cursor: popped ? 'default' : 'pointer',
        flexShrink: 0, position: 'relative', overflow: 'hidden',
        touchAction: 'manipulation',
        WebkitTapHighlightColor: 'transparent',
        opacity: popped ? 0.35 : 1,
        border: popped ? '1.5px solid rgba(255,255,255,0.22)' : '1.5px solid rgba(255,255,255,0.78)',
        background: popped
          ? 'rgba(255,255,255,0.06)'
          : 'radial-gradient(circle at 38% 30%, rgba(255,255,255,0.95) 0%, rgba(210,204,255,0.55) 48%, rgba(180,168,255,0.28) 100%)',
        boxShadow: popped
          ? 'inset 0 2px 6px rgba(0,0,0,0.07)'
          : '0 5px 18px rgba(99,102,241,0.26), inset 0 -3px 6px rgba(255,255,255,0.35), inset 0 3px 10px rgba(255,255,255,0.78)',
        transition: 'background 0.2s, box-shadow 0.2s, opacity 0.25s',
        userSelect: 'none',
      }}>
      {!popped && (
        <>
          <div style={{
            position: 'absolute', top: 7, left: 9, width: 17, height: 9,
            background: 'rgba(255,255,255,0.82)', borderRadius: '50%',
            transform: 'rotate(-38deg)', filter: 'blur(2px)', pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', bottom: 8, right: 8, width: 7, height: 7,
            background: 'rgba(255,255,255,0.5)', borderRadius: '50%',
            filter: 'blur(1px)', pointerEvents: 'none',
          }} />
        </>
      )}
      <AnimatePresence>
        {popped && (
          <motion.div
            key="ripple"
            initial={{ scale: 0.4, opacity: 0.9 }}
            animate={{ scale: 2.5, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.36, ease: 'easeOut' }}
            style={{
              position: 'absolute', inset: 0, borderRadius: '50%',
              border: '2.5px solid rgba(99,102,241,0.55)', pointerEvents: 'none',
            }}
          />
        )}
      </AnimatePresence>
    </motion.button>
  );
};

const BubbleWrap = () => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
    <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 22, color: 'rgba(67,56,202,0.85)' }}>
      🫧 Bubble Wrap
    </h2>
    <div style={{
      padding: 20,
      background: 'rgba(255,255,255,0.14)',
      borderRadius: '1.5rem',
      border: '1px solid rgba(255,255,255,0.28)',
      touchAction: 'none',
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${COLS}, ${BSZ}px)`,
        gridTemplateRows: `repeat(${ROWS}, ${BSZ}px)`,
        gap: GAP,
        width: GW,
        height: GH,
      }}>
        {Array.from({ length: COLS * ROWS }).map((_, i) => <Bubble key={i} />)}
      </div>
    </div>
    <p style={{
      marginTop: 18, fontSize: 11, color: 'rgba(67,56,202,0.42)',
      textTransform: 'uppercase', letterSpacing: '0.17em', fontWeight: 500,
    }}>
      Pop each bubble to release tension
    </p>
  </div>
);

export default BubbleWrap;
