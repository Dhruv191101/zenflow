import React, { useState } from 'react';
import { motion } from 'framer-motion';
import GlassCard from '../components/shared/GlassCard';
import BubbleWrap   from '../components/toys/BubbleWrap';
import ClickerToy   from '../components/toys/ClickerToy';
import KineticSand  from '../components/toys/KineticSand';
import FidgetCube   from '../components/toys/FidgetCube';
import MarbleMesh   from '../components/toys/MarbleMesh';
import FidgetSpinner from '../components/toys/FidgetSpinner';
import PopIt        from '../components/toys/PopIt';
import StressBall   from '../components/toys/StressBall';
import RipplePool   from '../components/toys/RipplePool';
import LavaLamp     from '../components/toys/LavaLamp';

const TOYS = [
  { id:'bubble',  icon:'🫧', label:'Bubble Wrap',   color:'#a5b4fc', desc:'Pop to release tension' },
  { id:'popit',   icon:'🟣', label:'Pop It',         color:'#f9a8d4', desc:'Hex grid — pop them all' },
  { id:'clicker', icon:'🎯', label:'Clicker',        color:'#6ee7b7', desc:'Press to ground yourself' },
  { id:'stress',  icon:'🫷', label:'Stress Ball',    color:'#fde68a', desc:'Squeeze and release stress' },
  { id:'sand',    icon:'🏖️', label:'Kinetic Sand',  color:'#c4b5fd', desc:'Draw with the particles' },
  { id:'ripple',  icon:'💧', label:'Ripple Pool',    color:'#93c5fd', desc:'Tap the water surface' },
  { id:'cube',    icon:'🎲', label:'Fidget Cube',    color:'#6ee7b7', desc:'Switch, dial and slide' },
  { id:'marble',  icon:'🔮', label:'Marble Mesh',    color:'#f9a8d4', desc:'Slide the marble slowly' },
  { id:'spinner', icon:'🌀', label:'Fidget Spinner', color:'#c4b5fd', desc:'Flick and watch it spin' },
  { id:'lava',    icon:'🫙', label:'Lava Lamp',      color:'#a5b4fc', desc:'Watch the blobs float' },
];

const COMPONENTS = {
  bubble: BubbleWrap, popit: PopIt, clicker: ClickerToy, stress: StressBall,
  sand: KineticSand, ripple: RipplePool, cube: FidgetCube,
  marble: MarbleMesh, spinner: FidgetSpinner, lava: LavaLamp,
};

const ToysPage = () => {
  const [active, setActive] = useState(null);
  const ActiveToy = active ? COMPONENTS[active] : null;

  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', width:'100%' }}>
      {active ? (
        <>
          <GlassCard style={{ width:'100%', padding:'24px 16px', marginBottom:14,
            minHeight:380, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <ActiveToy />
          </GlassCard>
          <motion.button whileTap={{ scale:0.95 }} onPointerDown={() => setActive(null)}
            style={{ padding:'14px 36px', borderRadius:999, fontWeight:600, fontSize:14,
              background:'rgba(255,255,255,0.3)', border:'1.5px solid rgba(255,255,255,0.6)',
              color:'rgba(79,70,229,0.7)', touchAction:'manipulation',
              WebkitTapHighlightColor:'transparent', backdropFilter:'blur(12px)',
              WebkitBackdropFilter:'blur(12px)' }}>
            ← All Toys
          </motion.button>
        </>
      ) : (
        <>
          <p style={{ fontSize:13, color:'rgba(79,70,229,0.5)', marginBottom:14, fontWeight:500 }}>
            10 toys to choose from
          </p>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, width:'100%' }}>
            {TOYS.map((toy, i) => (
              <motion.button key={toy.id}
                initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
                transition={{ delay: i * 0.04 }}
                whileTap={{ scale:0.91 }} onPointerDown={() => setActive(toy.id)}
                style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:7,
                  padding:'20px 10px', borderRadius:'1.75rem', textAlign:'center',
                  background:'rgba(255,255,255,0.22)', backdropFilter:'blur(20px)',
                  WebkitBackdropFilter:'blur(20px)',
                  border:`1.5px solid ${toy.color}55`,
                  boxShadow:`0 6px 20px ${toy.color}1a`,
                  touchAction:'manipulation', WebkitTapHighlightColor:'transparent',
                  transition:'all 0.2s' }}>
                <span style={{ fontSize:32 }}>{toy.icon}</span>
                <span style={{ fontSize:12, fontWeight:700, color:'rgba(30,27,75,0.8)', lineHeight:1.2 }}>{toy.label}</span>
                <span style={{ fontSize:10, color:'rgba(79,70,229,0.45)', fontWeight:500 }}>{toy.desc}</span>
              </motion.button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
export default ToysPage;
