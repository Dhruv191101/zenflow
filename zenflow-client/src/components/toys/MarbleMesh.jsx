import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { triggerHaptic, HAPTICS } from '../../utils/haptics';
import { playMarbleRoll, playLightTick } from '../../utils/sounds';

const MarbleMesh = () => {
  const [marbleX, setMarbleX] = useState(50); // % along tube [0..100]
  const tubeRef = useRef(null);
  const dragging = useRef(false);

  const getPercent = (e) => {
    const tube = tubeRef.current;
    if (!tube) return marbleX;
    const rect = tube.getBoundingClientRect();
    const src = e.touches ? e.touches[0] : e;
    const pct = ((src.clientX - rect.left) / rect.width) * 100;
    return Math.max(5, Math.min(95, pct));
  };

  const onStart = (e) => { dragging.current = true; };
  const onMove = (e) => {
    if (!dragging.current) return;
    e.preventDefault();
    const newX = getPercent(e);
    const delta = Math.abs(newX - marbleX);
    setMarbleX(prev => prev + (newX - prev) * 0.25); // friction lag
    if (delta > 2) { triggerHaptic(HAPTICS.lightTap); playMarbleRoll(); }
    if (newX <= 6 || newX >= 94) { triggerHaptic(HAPTICS.heavyClick); playLightTick(); }
  };
  const onEnd = () => { dragging.current = false; };

  const tubeW = 300, tubeH = 72;
  const marbleR = 28;

  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', width:'100%' }}>
      <h2 style={{ fontSize:18, fontWeight:600, marginBottom:28, color:'rgba(67,56,202,0.85)' }}>
        🔮 Marble Mesh
      </h2>

      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:20 }}>
        {/* Tube */}
        <div ref={tubeRef}
          onMouseDown={onStart} onMouseMove={onMove} onMouseUp={onEnd} onMouseLeave={onEnd}
          onTouchStart={onStart} onTouchMove={onMove} onTouchEnd={onEnd}
          style={{ position:'relative', width:tubeW, height:tubeH,
            borderRadius:999, touchAction:'none', cursor:'grab',
            background:'linear-gradient(180deg,rgba(255,255,255,0.55) 0%,rgba(199,210,254,0.35) 100%)',
            border:'2px solid rgba(255,255,255,0.7)',
            boxShadow:'0 8px 24px rgba(79,70,229,0.15), inset 0 4px 12px rgba(255,255,255,0.6), inset 0 -4px 8px rgba(79,70,229,0.08)',
            userSelect:'none' }}>

          {/* Woven texture lines */}
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} style={{
              position:'absolute', top:0, bottom:0,
              left: `${(i / 12) * 100}%`, width:1,
              background:'rgba(255,255,255,0.35)', pointerEvents:'none'
            }} />
          ))}

          {/* Marble */}
          <div style={{
            position:'absolute', top:'50%', transform:'translateY(-50%)',
            left:`calc(${marbleX}% - ${marbleR}px)`,
            width:marbleR*2, height:marbleR*2, borderRadius:'50%',
            background:'radial-gradient(circle at 38% 32%, rgba(255,255,255,0.95) 0%, rgba(167,139,250,0.65) 45%, rgba(109,40,217,0.55) 100%)',
            boxShadow:'0 4px 16px rgba(79,70,229,0.4), inset 0 -3px 6px rgba(0,0,0,0.15), inset 0 3px 8px rgba(255,255,255,0.8)',
            transition:'left 0.08s linear',
            pointerEvents:'none',
          }}>
            <div style={{ position:'absolute', top:6, left:9,
              width:12, height:8, background:'rgba(255,255,255,0.8)',
              borderRadius:'50%', transform:'rotate(-30deg)', filter:'blur(2px)' }} />
          </div>

          {/* End caps */}
          {[0, 100].map(pos => (
            <div key={pos} style={{
              position:'absolute', top:'50%', transform:'translateY(-50%)',
              [pos === 0 ? 'left' : 'right']: -6,
              width:12, height:44, borderRadius:pos === 0 ? '6px 0 0 6px' : '0 6px 6px 0',
              background:'rgba(180,170,255,0.4)',
              border:'1.5px solid rgba(255,255,255,0.5)',
            }} />
          ))}
        </div>

        <p style={{ fontSize:11, color:'rgba(67,56,202,0.42)',
          textTransform:'uppercase', letterSpacing:'0.17em', fontWeight:500 }}>
          Drag the marble through the mesh
        </p>
      </div>
    </div>
  );
};
export default MarbleMesh;
