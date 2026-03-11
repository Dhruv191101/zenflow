import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { triggerHaptic, HAPTICS } from '../../utils/haptics';
import { logSession } from '../../utils/reliefAPI';

const STEPS = [
  { count: 5, sense: 'See',   icon: '👁️',  color: '#a5b4fc', prompt: 'Name 5 things you can SEE around you right now.' },
  { count: 4, sense: 'Touch', icon: '✋',  color: '#f9a8d4', prompt: 'Identify 4 things you can TOUCH. Feel their texture.' },
  { count: 3, sense: 'Hear',  icon: '👂',  color: '#6ee7b7', prompt: 'Listen for 3 sounds you can HEAR in this moment.' },
  { count: 2, sense: 'Smell', icon: '👃',  color: '#fde68a', prompt: 'Notice 2 things you can SMELL nearby.' },
  { count: 1, sense: 'Taste', icon: '👅',  color: '#c4b5fd', prompt: 'Find 1 thing you can TASTE or sense in your mouth.' },
];

const Grounding54321 = () => {
  const [step, setStep] = useState(-1); // -1 = intro
  const [done, setDone] = useState(false);

  const advance = () => {
    triggerHaptic(HAPTICS.groundStep);
    if (step >= STEPS.length - 1) { setDone(true); return; }
    if (step === -1) logSession('5-4-3-2-1 Ground');
    setStep(s => s + 1);
  };
  const restart = () => { setStep(-1); setDone(false); };

  const current = step >= 0 && step < STEPS.length ? STEPS[step] : null;
  const progress = step < 0 ? 0 : ((step + 1) / STEPS.length) * 100;

  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', width:'100%' }}>
      <h2 style={{ fontSize:18, fontWeight:600, marginBottom:8, color:'rgba(67,56,202,0.85)' }}>
        🌿 5-4-3-2-1 Ground
      </h2>
      <p style={{ fontSize:12, color:'rgba(79,70,229,0.5)', marginBottom:24, textAlign:'center' }}>
        Anchor yourself to the present moment
      </p>

      {/* Progress bar */}
      {step >= 0 && !done && (
        <div style={{ width:'100%', height:6, background:'rgba(255,255,255,0.3)',
          borderRadius:99, marginBottom:28, overflow:'hidden' }}>
          <motion.div animate={{ width:`${progress}%` }} transition={{ duration:0.5, ease:'easeOut' }}
            style={{ height:'100%', background:'linear-gradient(90deg,#a5b4fc,#7c3aed)',
              borderRadius:99 }} />
        </div>
      )}

      <AnimatePresence mode="wait">
        {done ? (
          <motion.div key="done"
            initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0}}
            style={{ textAlign:'center', padding:'32px 20px' }}>
            <div style={{ fontSize:60, marginBottom:16 }}>🌸</div>
            <h3 style={{ fontSize:20, fontWeight:700, color:'#4f46e5', marginBottom:8 }}>
              You're grounded
            </h3>
            <p style={{ fontSize:14, color:'rgba(79,70,229,0.6)', marginBottom:28 }}>
              You've successfully returned to the present moment. Take a deep breath.
            </p>
            <button onClick={restart}
              style={{ padding:'14px 36px', borderRadius:999, fontWeight:600, fontSize:14,
                background:'linear-gradient(135deg,#4f46e5,#7c3aed)', color:'white',
                boxShadow:'0 8px 24px rgba(79,70,229,0.35)' }}>
              Again
            </button>
          </motion.div>
        ) : step === -1 ? (
          <motion.div key="intro"
            initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-20}}
            style={{ textAlign:'center', padding:'20px' }}>
            <div style={{ fontSize:64, marginBottom:20 }}>🌿</div>
            <p style={{ fontSize:15, color:'rgba(79,70,229,0.65)', marginBottom:28, lineHeight:1.6 }}>
              When anxiety spikes, this technique quickly brings you back to the present by engaging all 5 senses.
            </p>
            <motion.button whileTap={{ scale:0.94 }} onClick={advance}
              style={{ padding:'16px 48px', borderRadius:999, fontWeight:700, fontSize:15,
                background:'linear-gradient(135deg,#4f46e5,#7c3aed)', color:'white',
                boxShadow:'0 8px 24px rgba(79,70,229,0.35)' }}>
              Begin
            </motion.button>
          </motion.div>
        ) : current ? (
          <motion.div key={step}
            initial={{opacity:0,scale:0.92}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:1.05}}
            transition={{ duration:0.4, ease:[0.22,1,0.36,1] }}
            style={{ display:'flex', flexDirection:'column', alignItems:'center', width:'100%' }}>

            {/* Step icon */}
            <div style={{ width:100, height:100, borderRadius:'50%',
              background:`${current.color}33`,
              border:`2px solid ${current.color}88`,
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:44, marginBottom:20,
              boxShadow:`0 0 32px ${current.color}44` }}>
              {current.icon}
            </div>

            {/* Count badge */}
            <div style={{ fontSize:13, fontWeight:700, color:current.color,
              backgroundColor:`${current.color}22`,
              padding:'6px 16px', borderRadius:99, marginBottom:16, letterSpacing:'0.08em' }}>
              {current.count} things to {current.sense.toUpperCase()}
            </div>

            <p style={{ fontSize:16, color:'rgba(30,27,75,0.8)', textAlign:'center',
              lineHeight:1.65, marginBottom:36, fontWeight:500 }}>
              {current.prompt}
            </p>

            <motion.button whileTap={{ scale:0.93 }} onClick={advance}
              style={{ padding:'16px 44px', borderRadius:999, fontWeight:700, fontSize:15,
                background:`linear-gradient(135deg,${current.color},#7c3aed)`, color:'white',
                boxShadow:`0 8px 24px ${current.color}66` }}>
              {step < STEPS.length - 1 ? `Next →` : 'Finish ✓'}
            </motion.button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};
export default Grounding54321;
