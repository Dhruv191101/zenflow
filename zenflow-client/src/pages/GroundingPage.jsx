import React, { useState } from 'react';
import GlassCard from '../components/shared/GlassCard';
import Grounding54321 from '../components/grounding/Grounding54321';
import HapticHeartbeat from '../components/grounding/HapticHeartbeat';

const TABS = [
  { id:'ground', label:'5-4-3-2-1', icon:'🌿' },
  { id:'heart',  label:'Heartbeat', icon:'💓' },
];

const GroundingPage = () => {
  const [active, setActive] = useState('ground');
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', width:'100%', gap:16 }}>
      <div style={{ display:'flex', gap:10, width:'100%', background:'rgba(255,255,255,0.22)',
        backdropFilter:'blur(20px)', WebkitBackdropFilter:'blur(20px)',
        padding:8, borderRadius:'1.5rem', border:'1.5px solid rgba(255,255,255,0.55)' }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setActive(t.id)}
            style={{ flex:1, padding:'12px', borderRadius:'1rem', fontWeight:600, fontSize:14,
              color: active===t.id ? '#4f46e5' : 'rgba(79,70,229,0.45)',
              background: active===t.id ? 'white' : 'transparent',
              boxShadow: active===t.id ? '0 4px 16px rgba(79,70,229,0.14)' : 'none',
              transition:'all 0.2s' }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>
      <GlassCard style={{ width:'100%', padding:'28px 20px', minHeight:450,
        overflow:'visible',
        display:'flex', alignItems:'center', justifyContent:'center' }}>
        {active === 'ground' ? <Grounding54321 /> : <HapticHeartbeat />}
      </GlassCard>
    </div>
  );
};
export default GroundingPage;
