import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { triggerHaptic, HAPTIC_PATTERNS } from '../utils/haptics';

const BUBBLE_SIZE = 52;
const BUBBLE_GAP = 10;
const COLS = 5;
const ROWS = 5;
const TOTAL = COLS * ROWS;

const Bubble = ({ id }) => {
  const [popped, setPopped] = useState(false);

  const handlePop = useCallback(() => {
    if (popped) return;
    setPopped(true);
    triggerHaptic(HAPTIC_PATTERNS.bubblePop);
    setTimeout(() => setPopped(false), 3500);
  }, [popped]);

  return (
    <motion.button
      whileHover={popped ? {} : { scale: 1.12 }}
      whileTap={popped ? {} : { scale: 0.80 }}
      onClick={handlePop}
      aria-label="Bubble"
      style={{
        width: BUBBLE_SIZE,
        height: BUBBLE_SIZE,
        minWidth: BUBBLE_SIZE,
        minHeight: BUBBLE_SIZE,
        borderRadius: '50%',
        cursor: popped ? 'default' : 'pointer',
        border: popped ? '1.5px solid rgba(255,255,255,0.25)' : '1.5px solid rgba(255,255,255,0.75)',
        background: popped
          ? 'rgba(255,255,255,0.06)'
          : 'radial-gradient(circle at 38% 32%, rgba(255,255,255,0.95) 0%, rgba(210,204,255,0.55) 50%, rgba(180,168,255,0.30) 100%)',
        boxShadow: popped
          ? 'inset 0 2px 6px rgba(0,0,0,0.08)'
          : '0 5px 18px rgba(99,102,241,0.28), inset 0 -3px 6px rgba(255,255,255,0.35), inset 0 3px 10px rgba(255,255,255,0.75)',
        position: 'relative',
        overflow: 'hidden',
        opacity: popped ? 0.4 : 1,
        transition: 'background 0.2s, box-shadow 0.2s, opacity 0.2s, border 0.2s',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
        userSelect: 'none',
        WebkitUserSelect: 'none',
        touchAction: 'manipulation',
      }}
    >
      {/* Gloss highlight spot */}
      {!popped && (
        <>
          <div style={{
            position: 'absolute',
            top: 7, left: 9,
            width: 17, height: 9,
            background: 'rgba(255,255,255,0.82)',
            borderRadius: '50%',
            transform: 'rotate(-38deg)',
            filter: 'blur(2px)',
            pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute',
            bottom: 8, right: 8,
            width: 7, height: 7,
            background: 'rgba(255,255,255,0.5)',
            borderRadius: '50%',
            filter: 'blur(1px)',
            pointerEvents: 'none',
          }} />
        </>
      )}
      {/* Pop ripple burst */}
      <AnimatePresence>
        {popped && (
          <motion.div
            key="ripple"
            initial={{ scale: 0.4, opacity: 0.9 }}
            animate={{ scale: 2.5, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.38, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              border: '2.5px solid rgba(99,102,241,0.55)',
              pointerEvents: 'none',
            }}
          />
        )}
      </AnimatePresence>
    </motion.button>
  );
};

const GRID_WIDTH = COLS * BUBBLE_SIZE + (COLS - 1) * BUBBLE_GAP;
const GRID_HEIGHT = ROWS * BUBBLE_SIZE + (ROWS - 1) * BUBBLE_GAP;

const BubbleWrap = () => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  }}>
    <h2 style={{
      fontSize: 18,
      fontWeight: 600,
      marginBottom: 22,
      color: 'rgba(67,56,202,0.85)',
      letterSpacing: '0.02em',
    }}>
      🫧 Bubble Wrap
    </h2>

    {/* Fixed-size grid container */}
    <div style={{
      width: GRID_WIDTH + 40,
      padding: 20,
      background: 'rgba(255,255,255,0.14)',
      borderRadius: '1.5rem',
      border: '1px solid rgba(255,255,255,0.28)',
      boxSizing: 'content-box',
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${COLS}, ${BUBBLE_SIZE}px)`,
        gridTemplateRows: `repeat(${ROWS}, ${BUBBLE_SIZE}px)`,
        gap: BUBBLE_GAP,
        width: GRID_WIDTH,
        height: GRID_HEIGHT,
      }}>
        {Array.from({ length: TOTAL }).map((_, i) => (
          <Bubble key={i} id={i} />
        ))}
      </div>
    </div>

    <p style={{
      marginTop: 20,
      fontSize: 11,
      color: 'rgba(67,56,202,0.42)',
      textTransform: 'uppercase',
      letterSpacing: '0.17em',
      fontWeight: 500,
    }}>
      Pop each bubble to release tension
    </p>
  </div>
);

export default BubbleWrap;
