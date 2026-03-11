import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { triggerHaptic, HAPTICS } from '../../utils/haptics';
import { playLightTick, playHeavyClick, playToggle } from '../../utils/sounds';
import { logSession } from '../../utils/reliefAPI';

// ── Face 1: Magnetic Switch ───────────────────────────────────────────────────
const SwitchFace = ({ onAction }) => {
  const [on, setOn] = useState(false);
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:16 }}>
      <p style={{ fontSize:13, color:'rgba(99,102,241,0.6)', fontWeight:600 }}>Magnetic Switch</p>
      <button onPointerDown={() => { setOn(p=>!p); onAction([20,10,30]); playToggle(); }}
        style={{ position:'relative', width:128, height:64, borderRadius:999, flexShrink:0,
          touchAction:'manipulation', WebkitTapHighlightColor:'transparent',
          background: on ? 'linear-gradient(135deg,#818cf8,#6d28d9)' : 'rgba(255,255,255,0.5)',
          border:'1.5px solid rgba(255,255,255,0.7)',
          boxShadow: on ? '0 0 24px rgba(99,102,241,0.4),inset 0 4px 10px rgba(0,0,0,0.1)' : '0 4px 16px rgba(99,102,241,0.1)',
          transition:'all 0.3s' }}>
        <motion.div animate={{ left: on ? 'calc(100% - 58px)' : '4px' }}
          transition={{ type:'spring', stiffness:500, damping:30 }}
          style={{ position:'absolute', top:'50%', transform:'translateY(-50%)',
            width:54, height:54, borderRadius:'50%', background:'white',
            boxShadow:'0 3px 12px rgba(0,0,0,0.18)', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <div style={{ width:14, height:14, borderRadius:'50%',
            background: on ? 'rgba(99,102,241,0.25)' : 'rgba(180,180,200,0.3)', transition:'all 0.3s' }} />
        </motion.div>
      </button>
      <p style={{ fontSize:12, color:'rgba(99,102,241,0.45)', fontWeight:500 }}>
        {on ? '● ON — feel the snap' : '○ Flip the switch'}
      </p>
    </div>
  );
};

// ── Face 2: Zen Dial ──────────────────────────────────────────────────────────
const ZEN_NOTCHES = 12;
const ZenDialFace = ({ onAction }) => {
  const [deg, setDeg] = useState(0);
  const [label, setLabel] = useState('Turn to find calm');
  const prevNotchRef = useRef(0);
  const lastAngle = useRef(null);
  const elRef = useRef(null);

  const getAngle = (e) => {
    const el = elRef.current;
    if (!el) return 0;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const src = e.touches ? e.touches[0] : e;
    return Math.atan2(src.clientY - cy, src.clientX - cx) * (180 / Math.PI);
  };

  const CALM_LABELS = ['Breathe deep…','Feel the earth…','You are safe…','Let go…','Softer now…',
    'Peace is near…','Be still…','Nothing to fix…','Just this moment…','All is well…','Calm…','✦ Centred'];

  const onStart = (e) => { e.preventDefault(); lastAngle.current = getAngle(e); };
  const onMove = (e) => {
    if (lastAngle.current === null) return;
    e.preventDefault();
    const a = getAngle(e);
    let d = a - lastAngle.current;
    if (d > 180) d -= 360; if (d < -180) d += 360;
    const newDeg = deg + d;
    setDeg(newDeg);
    lastAngle.current = a;
    const notch = Math.round(((newDeg % 360) + 360) % 360 / (360 / ZEN_NOTCHES)) % ZEN_NOTCHES;
    if (notch !== prevNotchRef.current) {
      prevNotchRef.current = notch;
      onAction([10]); playLightTick();
      setLabel(CALM_LABELS[notch]);
    }
  };
  const onEnd = () => { lastAngle.current = null; };

  const DIAL_SIZE = 170;
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:14 }}>
      <p style={{ fontSize:13, color:'rgba(99,102,241,0.6)', fontWeight:600 }}>Zen Dial</p>
      <div ref={elRef}
        onMouseDown={onStart} onMouseMove={onMove} onMouseUp={onEnd} onMouseLeave={onEnd}
        onTouchStart={onStart} onTouchMove={onMove} onTouchEnd={onEnd}
        style={{ width:DIAL_SIZE, height:DIAL_SIZE, borderRadius:'50%', cursor:'grab',
          touchAction:'none', userSelect:'none', position:'relative',
          background:'conic-gradient(from 0deg, #a5b4fc, #f9a8d4, #6ee7b7, #fde68a, #c4b5fd, #a5b4fc)',
          border:'3px solid rgba(255,255,255,0.8)',
          boxShadow:'0 8px 32px rgba(99,102,241,0.25), inset 0 2px 8px rgba(255,255,255,0.4)',
          transform:`rotate(${deg}deg)`, transition:'none',
          display:'flex', alignItems:'center', justifyContent:'center' }}>
        {/* Notch marks */}
        {Array.from({ length: ZEN_NOTCHES }).map((_, i) => (
          <div key={i} style={{ position:'absolute', top:6, left:'50%',
            width:3, height:14, marginLeft:-1.5, borderRadius:99,
            background:'rgba(255,255,255,0.7)',
            transform:`rotate(${i*(360/ZEN_NOTCHES)}deg)`, transformOrigin:`1.5px ${DIAL_SIZE/2 - 6}px` }} />
        ))}
        {/* Grip dot */}
        <div style={{ width:32, height:32, borderRadius:'50%', background:'rgba(255,255,255,0.92)',
          boxShadow:'0 2px 8px rgba(0,0,0,0.12)', position:'absolute', top:14, left:'50%', transform:'translateX(-50%)' }} />
        {/* Center hub */}
        <div style={{ width:44, height:44, borderRadius:'50%',
          background:'rgba(255,255,255,0.95)', boxShadow:'0 2px 12px rgba(0,0,0,0.12)',
          transform:`rotate(${-deg}deg)`, transition:'none',
          display:'flex', alignItems:'center', justifyContent:'center', fontSize:20 }}>☯</div>
      </div>
      <p style={{ fontSize:13, color:'rgba(79,70,229,0.7)', fontWeight:600,
        fontStyle:'italic', textAlign:'center', maxWidth:200, lineHeight:1.4 }}>{label}</p>
    </div>
  );
};

// ── Face 3: Worry Beads ───────────────────────────────────────────────────────
const BEAD_COUNT = 5;
const BEAD_COLORS = ['#a5b4fc','#f9a8d4','#6ee7b7','#fde68a','#c4b5fd'];
// Evenly spaced initial positions (as % of track width), 10%..90%
const INITIAL_POS = Array.from({length:BEAD_COUNT}, (_,i) => 10 + i * (80/(BEAD_COUNT-1)));

const WorryBeadsFace = ({ onAction }) => {
  const posRef = useRef([...INITIAL_POS]);
  const [posDraw, setPosDraw] = useState([...INITIAL_POS]);
  const activeRef = useRef(null);
  const trackRef = useRef(null);
  const lastSnapRef = useRef(-1);

  const getPct = (e) => {
    const track = trackRef.current;
    if (!track) return 50;
    const rect = track.getBoundingClientRect();
    const src = e.touches ? e.touches[0] : e;
    return Math.max(0, Math.min(100, ((src.clientX - rect.left) / rect.width) * 100));
  };

  const handleBeadDown = (idx, e) => {
    e.preventDefault();
    e.stopPropagation();
    activeRef.current = idx;
    lastSnapRef.current = Math.round(posRef.current[idx] / 20);
  };

  const handleTrackMove = (e) => {
    if (activeRef.current === null) return;
    e.preventDefault();
    const pct = getPct(e);
    const idx = activeRef.current;
    const newPos = [...posRef.current];
    newPos[idx] = pct;
    posRef.current = newPos;
    setPosDraw([...newPos]);
    const snap = Math.round(pct / 20);
    if (snap !== lastSnapRef.current) {
      lastSnapRef.current = snap;
      onAction([15]); playLightTick();
    }
  };

  const handleUp = () => { activeRef.current = null; };

  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:14 }}>
      <p style={{ fontSize:13, color:'rgba(99,102,241,0.6)', fontWeight:600 }}>Worry Beads</p>
      <div ref={trackRef}
        onMouseMove={handleTrackMove} onMouseUp={handleUp} onMouseLeave={handleUp}
        onTouchMove={handleTrackMove} onTouchEnd={handleUp} onTouchCancel={handleUp}
        style={{ position:'relative', width:280, height:72, borderRadius:999,
          touchAction:'none', userSelect:'none', WebkitUserSelect:'none',
          background:'rgba(255,255,255,0.3)',
          border:'1.5px solid rgba(255,255,255,0.6)',
          boxShadow:'0 4px 16px rgba(79,70,229,0.1), inset 0 2px 8px rgba(0,0,0,0.05)' }}>
        {/* String */}
        <div style={{ position:'absolute', top:'50%', left:16, right:16, height:3,
          transform:'translateY(-50%)', background:'rgba(167,139,250,0.4)', borderRadius:99,
          pointerEvents:'none' }} />
        {/* Beads */}
        {posDraw.map((pct, i) => (
          <div key={i}
            onMouseDown={(e) => handleBeadDown(i, e)}
            onTouchStart={(e) => handleBeadDown(i, e)}
            style={{ position:'absolute', top:'50%',
              left:`calc(${pct}% - 21px)`, transform:'translateY(-50%)',
              width:42, height:42, borderRadius:'50%',
              touchAction:'none', WebkitTapHighlightColor:'transparent',
              background:`radial-gradient(circle at 38% 35%, rgba(255,255,255,0.95) 0%, ${BEAD_COLORS[i]} 65%)`,
              border:'2px solid rgba(255,255,255,0.8)',
              boxShadow:`0 4px 16px ${BEAD_COLORS[i]}66, inset 0 2px 6px rgba(255,255,255,0.7)`,
              cursor:'grab', zIndex: activeRef.current === i ? 10 : i+1,
              transition: activeRef.current === i ? 'none' : 'left 0.05s' }}>
            <div style={{ position:'absolute', top:6, left:8, width:12, height:8,
              background:'rgba(255,255,255,0.75)', borderRadius:'50%',
              transform:'rotate(-30deg)', filter:'blur(1px)', pointerEvents:'none' }} />
          </div>
        ))}
      </div>
      <p style={{ fontSize:11, color:'rgba(99,102,241,0.4)', fontWeight:500, letterSpacing:'0.08em' }}>
        Slide each bead — feel the click
      </p>
    </div>
  );
};

// ── Main FidgetCube ───────────────────────────────────────────────────────────
const FACES = [
  { id:'switch', icon:'⚡', label:'Switch', tool: SwitchFace },
  { id:'dial',   icon:'☯',  label:'Dial',   tool: ZenDialFace },
  { id:'beads',  icon:'📿', label:'Beads',  tool: WorryBeadsFace },
];

const FidgetCube = () => {
  const [activeFace, setActiveFace] = useState(0);
  const sessionLogged = useRef(false);
  const Tool = FACES[activeFace].tool;

  const handleAction = (pattern) => {
    triggerHaptic(pattern);
    if (!sessionLogged.current) { logSession('Fidget Cube'); sessionLogged.current = true; }
  };

  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', width:'100%' }}>
      <h2 style={{ fontSize:18, fontWeight:600, marginBottom:20, color:'rgba(67,56,202,0.85)' }}>
        🎲 Fidget Cube
      </h2>
      <div style={{ display:'flex', gap:8, marginBottom:20 }}>
        {FACES.map((f, i) => (
          <button key={f.id} onPointerDown={() => { setActiveFace(i); playLightTick(); }}
            style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4,
              padding:'10px 18px', borderRadius:'1rem', fontSize:20,
              touchAction:'manipulation', WebkitTapHighlightColor:'transparent',
              background: activeFace===i ? 'white' : 'rgba(255,255,255,0.18)',
              border: activeFace===i ? '1.5px solid rgba(255,255,255,0.8)' : '1.5px solid rgba(255,255,255,0.35)',
              boxShadow: activeFace===i ? '0 4px 16px rgba(79,70,229,0.14)' : 'none',
              transition:'all 0.2s' }}>
            {f.icon}
            <span style={{ fontSize:9, fontWeight:700, color:'rgba(79,70,229,0.55)',
              textTransform:'uppercase', letterSpacing:'0.08em' }}>{f.label}</span>
          </button>
        ))}
      </div>
      <div style={{ width:'100%', minHeight:220, background:'rgba(255,255,255,0.12)',
        borderRadius:'2rem', border:'1px solid rgba(255,255,255,0.3)',
        padding:'28px 20px', display:'flex', alignItems:'center', justifyContent:'center' }}>
        <Tool onAction={handleAction} />
      </div>
      <p style={{ marginTop:16, fontSize:11, color:'rgba(67,56,202,0.42)',
        textTransform:'uppercase', letterSpacing:'0.17em', fontWeight:500 }}>
        Switch faces to explore
      </p>
    </div>
  );
};
export default FidgetCube;
