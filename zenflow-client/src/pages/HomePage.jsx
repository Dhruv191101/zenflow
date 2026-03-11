import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const GREETINGS = () => {
  const h = new Date().getHours();
  if (h < 5)  return { text:'Still awake?', sub:'This moment belongs to you.' };
  if (h < 12) return { text:'Good morning', sub:'A calm start sets the whole day.' };
  if (h < 17) return { text:'Good afternoon', sub:'Take a breath. You\'re doing well.' };
  if (h < 21) return { text:'Good evening', sub:'Time to let the day go.' };
  return { text:'Good night', sub:'Wind down slowly. You deserve rest.' };
};

const FEATURE_CARDS = [
  { icon:'🫧', title:'10 Fidget Toys', desc:'Physical engagement to break the anxiety loop', color:'#a5b4fc', tab:'toys' },
  { icon:'🌊', title:'Breathwork',     desc:'3 clinical protocols for instant calm',          color:'#6ee7b7', tab:'breathe' },
  { icon:'🌿', title:'Grounding',      desc:'5-4-3-2-1 sensory anchor + heartbeat sync',     color:'#f9a8d4', tab:'ground' },
  { icon:'💆', title:'Check In',       desc:'Find the right technique for how you feel',     color:'#fde68a', tab:'journal' },
];

const MOODS = [
  { emoji:'😰', id:'anxious' }, { emoji:'😤', id:'stressed' }, { emoji:'😔', id:'sad' },
  { emoji:'😬', id:'restless' }, { emoji:'😶', id:'numb' }, { emoji:'😌', id:'calm' },
];

// Floating orb component
const Orb = ({ x, y, size, color, delay }) => (
  <motion.div
    initial={{ opacity:0, scale:0.3 }}
    animate={{ opacity:[0.4, 0.65, 0.4], scale:[1, 1.12, 1], y:[0, -18, 0] }}
    transition={{ duration: 5 + delay, repeat:Infinity, ease:'easeInOut', delay }}
    style={{ position:'absolute', left:`${x}%`, top:`${y}%`,
      width:size, height:size, borderRadius:'50%',
      background:`radial-gradient(circle at 35% 32%, rgba(255,255,255,0.6) 0%, ${color}88 55%, transparent 100%)`,
      filter:'blur(4px)', pointerEvents:'none', zIndex:0 }} />
);

const ORBS = [
  { x:8,  y:10, size:90,  color:'#a5b4fc', delay:0 },
  { x:75, y:5,  size:70,  color:'#f9a8d4', delay:1.5 },
  { x:55, y:30, size:110, color:'#6ee7b7', delay:0.8 },
  { x:5,  y:50, size:60,  color:'#fde68a', delay:2.2 },
  { x:80, y:55, size:80,  color:'#c4b5fd', delay:1.1 },
  { x:40, y:70, size:50,  color:'#93c5fd', delay:3.0 },
];

const HomePage = ({ onNavigate }) => {
  const { text: greet, sub: greetSub } = GREETINGS();
  const [selectedMood, setSelectedMood] = useState(null);

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:18, width:'100%',
      position:'relative', overflow:'hidden', paddingBottom:8 }}>

      {/* Floating orbs background */}
      <div style={{ position:'absolute', inset:0, pointerEvents:'none', zIndex:0 }}>
        {ORBS.map((o, i) => <Orb key={i} {...o} />)}
      </div>

      {/* Hero section */}
      <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
        transition={{ duration:0.7, ease:[0.22,1,0.36,1] }}
        style={{ position:'relative', zIndex:1, textAlign:'center',
          padding:'28px 20px 24px', borderRadius:'2.5rem',
          background:'rgba(255,255,255,0.18)', backdropFilter:'blur(32px)',
          WebkitBackdropFilter:'blur(32px)',
          border:'1.5px solid rgba(255,255,255,0.65)',
          boxShadow:'0 20px 60px rgba(79,70,229,0.13), inset 0 1px 0 rgba(255,255,255,0.8)' }}>

        {/* Animated logo badge */}
        <motion.div animate={{ rotate:[0,5,-5,0] }} transition={{ duration:6, repeat:Infinity, ease:'easeInOut' }}
          style={{ fontSize:48, marginBottom:8, display:'inline-block' }}>✦</motion.div>

        <motion.h1 initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.15 }}
          style={{ fontSize:34, fontWeight:900, letterSpacing:'-0.03em', lineHeight:1.1,
            background:'linear-gradient(135deg,#4f46e5 0%,#7c3aed 40%,#ec4899 100%)',
            WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
            backgroundClip:'text', marginBottom:6 }}>
          ZenFlow
        </motion.h1>

        <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.25 }}
          style={{ fontSize:13, fontWeight:700, color:'rgba(79,70,229,0.55)',
            textTransform:'uppercase', letterSpacing:'0.22em', marginBottom:14 }}>
          {greet} · {greetSub}
        </motion.p>

        <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.35 }}
          style={{ fontSize:15, color:'rgba(30,27,75,0.7)', fontWeight:500,
            lineHeight:1.55, maxWidth:280, margin:'0 auto 20px' }}>
          Your personal anxiety relief toolkit — toys, breath, and grounding in one beautiful app.
        </motion.p>

        {/* CTA buttons */}
        <div style={{ display:'flex', gap:10, justifyContent:'center', flexWrap:'wrap' }}>
          <motion.button whileTap={{ scale:0.93 }} onClick={() => onNavigate('toys')}
            initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.4 }}
            style={{ padding:'14px 28px', borderRadius:999, fontWeight:700, fontSize:14,
              background:'linear-gradient(135deg,#4f46e5,#7c3aed)',
              color:'white', boxShadow:'0 8px 24px rgba(79,70,229,0.35)',
              touchAction:'manipulation', WebkitTapHighlightColor:'transparent' }}>
            🫧 Explore Toys
          </motion.button>
          <motion.button whileTap={{ scale:0.93 }} onClick={() => onNavigate('breathe')}
            initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.48 }}
            style={{ padding:'14px 28px', borderRadius:999, fontWeight:700, fontSize:14,
              background:'rgba(255,255,255,0.35)', border:'1.5px solid rgba(255,255,255,0.7)',
              color:'rgba(79,70,229,0.8)', backdropFilter:'blur(12px)',
              webkitBackdropFilter:'blur(12px)',
              touchAction:'manipulation', WebkitTapHighlightColor:'transparent' }}>
            🌊 Breathe Now
          </motion.button>
        </div>
      </motion.div>

      {/* How are you feeling? */}
      <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }}
        transition={{ delay:0.3, duration:0.5 }}
        style={{ position:'relative', zIndex:1,
          background:'rgba(255,255,255,0.2)', backdropFilter:'blur(24px)',
          WebkitBackdropFilter:'blur(24px)',
          border:'1.5px solid rgba(255,255,255,0.6)',
          borderRadius:'2rem', padding:'18px 16px',
          boxShadow:'0 8px 24px rgba(79,70,229,0.07)' }}>
        <p style={{ fontSize:13, fontWeight:700, color:'rgba(79,70,229,0.6)',
          textTransform:'uppercase', letterSpacing:'0.14em', marginBottom:12, textAlign:'center' }}>
          How are you feeling?
        </p>
        <div style={{ display:'flex', justifyContent:'space-between' }}>
          {MOODS.map(m => (
            <motion.button key={m.id} whileTap={{ scale:0.82 }}
              onPointerDown={() => { setSelectedMood(m.id); onNavigate('journal'); }}
              style={{ fontSize:26, background:'none', borderRadius:999, padding:'4px 6px',
                border: selectedMood === m.id ? '2px solid rgba(79,70,229,0.4)' : '2px solid transparent',
                touchAction:'manipulation', WebkitTapHighlightColor:'transparent',
                transition:'all 0.15s' }}>
              {m.emoji}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Feature cards */}
      <div style={{ position:'relative', zIndex:1, display:'grid',
        gridTemplateColumns:'1fr 1fr', gap:10 }}>
        {FEATURE_CARDS.map((card, i) => (
          <motion.button key={card.tab}
            initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
            transition={{ delay: 0.35 + i * 0.07 }}
            whileTap={{ scale:0.92 }} onClick={() => onNavigate(card.tab)}
            style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8,
              padding:'18px 12px', borderRadius:'1.75rem', textAlign:'center',
              background:'rgba(255,255,255,0.22)', backdropFilter:'blur(20px)',
              WebkitBackdropFilter:'blur(20px)',
              border:`1.5px solid ${card.color}55`,
              boxShadow:`0 8px 24px ${card.color}1a`,
              touchAction:'manipulation', WebkitTapHighlightColor:'transparent' }}>
            <motion.span
              animate={{ scale:[1, 1.12, 1] }}
              transition={{ duration:3.5 + i, repeat:Infinity, ease:'easeInOut', delay: i * 0.5 }}
              style={{ fontSize:32, display:'block' }}>{card.icon}</motion.span>
            <div style={{ fontSize:13, fontWeight:700, color:'rgba(30,27,75,0.82)' }}>{card.title}</div>
            <div style={{ fontSize:10, color:'rgba(79,70,229,0.5)', fontWeight:500,
              lineHeight:1.4 }}>{card.desc}</div>
          </motion.button>
        ))}
      </div>

      {/* Quick stats bar */}
      <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.65 }}
        style={{ position:'relative', zIndex:1, display:'flex', gap:8 }}>
        {[
          { label:'Toys', value:'10', icon:'🎮' },
          { label:'Techniques', value:'6+', icon:'🧠' },
          { label:'No account', value:'needed', icon:'🔓' },
        ].map((s, i) => (
          <div key={i} style={{ flex:1, textAlign:'center', padding:'12px 8px',
            background:'rgba(255,255,255,0.2)', borderRadius:'1.25rem',
            border:'1px solid rgba(255,255,255,0.5)' }}>
            <div style={{ fontSize:16 }}>{s.icon}</div>
            <div style={{ fontSize:15, fontWeight:800, color:'rgba(79,70,229,0.8)', letterSpacing:'-0.01em' }}>{s.value}</div>
            <div style={{ fontSize:9, color:'rgba(79,70,229,0.45)', fontWeight:600,
              textTransform:'uppercase', letterSpacing:'0.1em' }}>{s.label}</div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};
export default HomePage;
