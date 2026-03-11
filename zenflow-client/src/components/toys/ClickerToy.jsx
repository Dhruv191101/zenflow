import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { triggerHaptic, HAPTICS } from '../../utils/haptics';
import { playHeavyClick, playToggle, playLightTick } from '../../utils/sounds';

const ClickerToy = () => {
  const [isOn, setIsOn] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [count, setCount] = useState(0);

  const handleToggle = () => {
    setIsOn(p => !p);
    triggerHaptic(isOn ? HAPTICS.switchOff : HAPTICS.switchOn);
    playToggle();
  };
  const handleDown = (e) => {
    e.preventDefault();
    setPressed(true);
    setCount(c => c + 1);
    triggerHaptic(HAPTICS.heavyClick);
    playHeavyClick();
  };
  const handleUp = () => {
    setPressed(false);
    playLightTick();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 24, color: 'rgba(67,56,202,0.85)' }}>
        🎯 Clicker
      </h2>
      <div style={{
        width: '100%', background: 'rgba(255,255,255,0.12)', borderRadius: '2.5rem',
        border: '1px solid rgba(255,255,255,0.3)', padding: '32px 24px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32,
      }}>
        {/* Toggle */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          <p style={{ fontSize: 11, fontWeight: 500, color: 'rgba(99,102,241,0.5)', textTransform: 'uppercase', letterSpacing: '0.16em' }}>Toggle Switch</p>
          <button
            onPointerDown={handleToggle}
            style={{
              position: 'relative', width: 128, height: 64, flexShrink: 0,
              borderRadius: 999, touchAction: 'manipulation',
              WebkitTapHighlightColor: 'transparent',
              background: isOn ? 'linear-gradient(135deg,#818cf8,#6d28d9)' : 'rgba(255,255,255,0.45)',
              border: '1.5px solid rgba(255,255,255,0.6)',
              boxShadow: isOn ? '0 0 24px rgba(99,102,241,0.4),inset 0 4px 10px rgba(0,0,0,0.12)' : '0 4px 16px rgba(99,102,241,0.1)',
              transition: 'all 0.3s',
            }}>
            <motion.div
              animate={{ left: isOn ? 'calc(100% - 58px)' : '4px' }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              style={{
                position: 'absolute', top: '50%', transform: 'translateY(-50%)',
                width: 54, height: 54, borderRadius: '50%', background: 'white',
                boxShadow: '0 3px 12px rgba(0,0,0,0.18)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
              <div style={{
                width: 16, height: 16, borderRadius: '50%',
                background: isOn ? 'rgba(99,102,241,0.2)' : 'rgba(200,200,200,0.3)',
                boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.08)', transition: 'all 0.3s',
              }} />
            </motion.div>
          </button>
        </div>

        {/* Big button */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <p style={{ fontSize: 11, fontWeight: 500, color: 'rgba(99,102,241,0.5)', textTransform: 'uppercase', letterSpacing: '0.16em' }}>Press Button</p>
          <motion.button
            whileTap={{ scale: 0.91, y: 6 }}
            onPointerDown={handleDown}
            onPointerUp={handleUp}
            onPointerLeave={() => { if (pressed) handleUp(); }}
            style={{
              position: 'relative', width: 160, height: 160, flexShrink: 0,
              borderRadius: '50%', border: '3px solid rgba(255,255,255,0.65)',
              touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent',
              background: pressed
                ? 'linear-gradient(160deg,#a5b4fc 0%,#7c3aed 100%)'
                : 'linear-gradient(160deg,rgba(255,255,255,0.82) 0%,rgba(199,210,254,0.65) 100%)',
              boxShadow: pressed
                ? 'inset 0 12px 28px rgba(0,0,0,0.2),0 0 20px rgba(99,102,241,0.4)'
                : '0 16px 40px rgba(99,102,241,0.22),inset 0 6px 18px rgba(255,255,255,0.85)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.15s,box-shadow 0.15s',
            }}>
            {!pressed && (
              <div style={{
                position: 'absolute', top: 14, left: 26, width: 68, height: 30,
                background: 'rgba(255,255,255,0.72)', borderRadius: '50%',
                transform: 'rotate(-28deg)', filter: 'blur(3px)', pointerEvents: 'none',
              }} />
            )}
            <div style={{
              width: 60, height: 60, borderRadius: '50%',
              background: pressed ? 'rgba(109,40,217,0.25)' : 'rgba(255,255,255,0.4)',
              boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.1)', transition: 'all 0.15s',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{
                width: 22, height: 22, borderRadius: '50%',
                background: pressed ? 'rgba(167,139,250,0.5)' : 'rgba(255,255,255,0.65)',
                transition: 'all 0.15s',
              }} />
            </div>
          </motion.button>
          <motion.p
            key={count}
            initial={{ scale: 1.3, opacity: 0.6 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{ fontSize: 13, fontWeight: 600, color: 'rgba(99,102,241,0.65)', letterSpacing: '0.08em' }}>
            {count === 0 ? 'Press to ground yourself' : `${count} press${count === 1 ? '' : 'es'} — you got this!`}
          </motion.p>
        </div>
      </div>
    </div>
  );
};

export default ClickerToy;
