import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '../components/shared/GlassCard';

// Purely in-memory — no storage, resets each visit. Just pure UI therapy.

const EMOTIONS = [
  { id:'anxious',  emoji:'😰', label:'Anxious',    color:'#f87171', bg:'#fee2e2' },
  { id:'stressed', emoji:'😤', label:'Stressed',   color:'#fb923c', bg:'#ffedd5' },
  { id:'sad',      emoji:'😔', label:'Low',        color:'#818cf8', bg:'#e0e7ff' },
  { id:'restless', emoji:'😬', label:'Restless',   color:'#f59e0b', bg:'#fef3c7' },
  { id:'numb',     emoji:'😶', label:'Numb',       color:'#6ee7b7', bg:'#d1fae5' },
  { id:'calm',     emoji:'😌', label:'Calm',       color:'#34d399', bg:'#d1fae5' },
];

const SUGGESTIONS = {
  anxious:  { headline:'Try rapid calming', desc:'Anxiety spikes respond best to cyclic sighing and physical grounding.', tools:[
    { icon:'🌊', label:'Cyclic Sighing',  hint:'3-second double inhale, 6-second exhale — fastest anxiety reducer', color:'#a5b4fc' },
    { icon:'🌿', label:'5-4-3-2-1',       hint:'Anchor to your senses and return to the present moment',            color:'#6ee7b7' },
    { icon:'🫧', label:'Bubble Wrap',     hint:'Physical popping discharges nervous energy quickly',                  color:'#f9a8d4' },
  ]},
  stressed: { headline:'Release the pressure', desc:'Stress needs a physical outlet — tactile toys and breathwork work best.',tools:[
    { icon:'🌊', label:'Box Breathing',    hint:'4-4-4-4 Navy SEAL technique resets your nervous system',            color:'#a5b4fc' },
    { icon:'🎯', label:'Clicker',          hint:'Repetitive pressing reduces cortisol and builds focus',             color:'#f9a8d4' },
    { icon:'🏖️', label:'Kinetic Sand',    hint:'Slow drawing grounds racing thoughts through texture',              color:'#fde68a' },
  ]},
  sad: { headline:'Gentle re-engagement', desc:'Low mood benefits from slow-paced rhythm and physical warmth.', tools:[
    { icon:'💓', label:'Heartbeat',        hint:'Vagus nerve stimulation via rhythmic vibration gently lifts mood',  color:'#f9a8d4' },
    { icon:'🌙', label:'4-7-8 Breathing', hint:'Deeply relaxing — helps process difficult emotions safely',         color:'#c4b5fd' },
    { icon:'🔮', label:'Marble Mesh',     hint:'Soft, slow dragging feels soothing and tactile',                    color:'#a5b4fc' },
  ]},
  restless: { headline:'Channel the energy', desc:'Restlessness needs motion — spinners and fast fidgets help most.',tools:[
    { icon:'🌀', label:'Fidget Spinner',  hint:'Physical momentum gives restless energy somewhere to go',           color:'#c4b5fd' },
    { icon:'🎲', label:'Fidget Cube',     hint:'Multi-face switching keeps hands busy and mind focused',            color:'#6ee7b7' },
    { icon:'⬛', label:'Box Breathing',  hint:'Equal phases give your restless mind structure to hold on to',       color:'#a5b4fc' },
  ]},
  numb: { headline:'Gentle sensory wake-up', desc:'Numbness responds to soft multi-sensory stimulation.', tools:[
    { icon:'🌿', label:'5-4-3-2-1',      hint:'Re-engaging all 5 senses breaks through emotional numbness',        color:'#6ee7b7' },
    { icon:'🏖️', label:'Kinetic Sand',   hint:'Touching and drawing re-activates tactile sensory pathways',        color:'#fde68a' },
    { icon:'💓', label:'Heartbeat',       hint:'Feeling your own heartbeat can restore a sense of being present',  color:'#f9a8d4' },
  ]},
  calm: { headline:'You\'re doing great 🌸', desc:'Stay here — use this moment to reinforce the calm.', tools:[
    { icon:'🌙', label:'4-7-8 Breathing',hint:'Deepen this calm and let it anchor into your nervous system',       color:'#a5b4fc' },
    { icon:'🌀', label:'Fidget Spinner', hint:'A slow spin to stay present and in the moment',                     color:'#c4b5fd' },
    { icon:'🔮', label:'Marble Mesh',   hint:'Gentle, slow movement to maintain your grounded state',             color:'#6ee7b7' },
  ]},
};

export default function CheckInPage() {
  const [selected, setSelected] = useState(null);

  const suggestion = selected ? SUGGESTIONS[selected.id] : null;

  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:14, width:'100%' }}>
      <div style={{ textAlign:'center', marginBottom:4 }}>
        <h2 style={{ fontSize:20, fontWeight:700, color:'rgba(67,56,202,0.85)', marginBottom:6 }}>
          How are you right now?
        </h2>
        <p style={{ fontSize:13, color:'rgba(79,70,229,0.45)', fontWeight:500 }}>
          Pick what feels closest — get instant personalised guidance
        </p>
      </div>

      {/* Emotion grid */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10, width:'100%' }}>
        {EMOTIONS.map((e, i) => (
          <motion.button key={e.id}
            initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay: i*0.05 }}
            whileTap={{ scale:0.9 }}
            onPointerDown={() => setSelected(e)}
            style={{
              display:'flex', flexDirection:'column', alignItems:'center', gap:6,
              padding:'18px 8px', borderRadius:'1.5rem',
              touchAction:'manipulation', WebkitTapHighlightColor:'transparent',
              background: selected?.id === e.id ? `${e.color}22` : 'rgba(255,255,255,0.22)',
              border: `1.5px solid ${selected?.id === e.id ? e.color : 'rgba(255,255,255,0.5)'}`,
              boxShadow: selected?.id === e.id ? `0 0 20px ${e.color}44` : '0 4px 12px rgba(0,0,0,0.04)',
              transition:'all 0.2s',
            }}>
            <span style={{ fontSize:32 }}>{e.emoji}</span>
            <span style={{ fontSize:11, fontWeight:700, color: selected?.id === e.id ? e.color : 'rgba(79,70,229,0.55)',
              textTransform:'uppercase', letterSpacing:'0.08em' }}>{e.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Suggestions panel */}
      <AnimatePresence mode="wait">
        {suggestion && (
          <motion.div key={selected.id} style={{ width:'100%' }}
            initial={{ opacity:0, y:16, scale:0.97 }} animate={{ opacity:1, y:0, scale:1 }}
            exit={{ opacity:0, y:-8 }} transition={{ duration:0.3, ease:[0.22,1,0.36,1] }}>
            <GlassCard style={{ width:'100%', padding:'22px 18px' }}>
              <div style={{ fontSize:28, marginBottom:8 }}>{selected.emoji}</div>
              <h3 style={{ fontSize:16, fontWeight:700, color:'rgba(30,27,75,0.85)', marginBottom:4 }}>
                {suggestion.headline}
              </h3>
              <p style={{ fontSize:13, color:'rgba(79,70,229,0.5)', marginBottom:18, lineHeight:1.55 }}>
                {suggestion.desc}
              </p>
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {suggestion.tools.map((t, i) => (
                  <motion.div key={t.label}
                    initial={{ opacity:0, x:-8 }} animate={{ opacity:1, x:0 }}
                    transition={{ delay: i * 0.08 }}
                    style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 14px',
                      borderRadius:'1rem', background:`${t.color}18`,
                      border:`1px solid ${t.color}55` }}>
                    <span style={{ fontSize:24, flexShrink:0 }}>{t.icon}</span>
                    <div>
                      <div style={{ fontSize:13, fontWeight:700, color:'rgba(30,27,75,0.8)', marginBottom:2 }}>
                        {t.label}
                      </div>
                      <div style={{ fontSize:11, color:'rgba(79,70,229,0.5)', lineHeight:1.45 }}>
                        {t.hint}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
