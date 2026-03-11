import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import GlassCard from '../components/shared/GlassCard';
import { moodAPI } from '../utils/api';
import { getUserId } from '../utils/userId';

const EMOJI = ['😰','😟','😐','🙂','😄'];
const COLOR  = ['#f87171','#fb923c','#fbbf24','#34d399','#60a5fa'];

const MoodPage = () => {
  const [log, setLog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setError(true);
      setLoading(false);
    }, 5000);
    moodAPI.getHistory(getUserId())
      .then(res => { setLog(res.data.moodLog || []); })
      .catch(() => setError(true))
      .finally(() => { clearTimeout(timeout); setLoading(false); });
    return () => clearTimeout(timeout);
  }, []);

  const avg = log.length ? (log.reduce((s, e) => s + e.score, 0) / log.length).toFixed(1) : '--';
  const recent = log.slice(0, 14).reverse();
  const maxH = 100;

  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', width:'100%', gap:16 }}>
      {/* Stats row */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, width:'100%' }}>
        {[
          { label:'Total Logs', value: log.length, color:'#a5b4fc' },
          { label:'Avg Mood', value: `${avg}/10`, color:'#6ee7b7' },
        ].map(s => (
          <GlassCard key={s.label} style={{ padding:'18px 14px', textAlign:'center' }} animate={false}>
            <div style={{ fontSize:26, fontWeight:800, color: s.color, letterSpacing:'-0.01em' }}>{s.value}</div>
            <div style={{ fontSize:11, color:'rgba(79,70,229,0.5)', fontWeight:600,
              textTransform:'uppercase', letterSpacing:'0.12em', marginTop:4 }}>{s.label}</div>
          </GlassCard>
        ))}
      </div>

      {/* Bar Chart */}
      <GlassCard style={{ width:'100%', padding:'20px' }}>
        <h3 style={{ fontSize:13, fontWeight:700, color:'rgba(79,70,229,0.65)',
          textTransform:'uppercase', letterSpacing:'0.12em', marginBottom:16 }}>
          Recent Mood 📊
        </h3>
        {loading && <p style={{ textAlign:'center', color:'rgba(79,70,229,0.4)', fontSize:14 }}>Loading...</p>}
        {error && <p style={{ textAlign:'center', color:'rgba(79,70,229,0.4)', fontSize:14 }}>
          Could not reach server. Log a mood from Home first!
        </p>}
        {!loading && !error && log.length === 0 && (
          <p style={{ textAlign:'center', color:'rgba(79,70,229,0.4)', fontSize:14 }}>
            No mood entries yet. Check in from the Home tab!
          </p>
        )}
        {!loading && recent.length > 0 && (
          <div style={{ display:'flex', alignItems:'flex-end', gap:6, height:maxH + 40,
            paddingBottom:30, position:'relative' }}>
            {recent.map((entry, i) => {
              const pct = entry.score / 10;
              const h = Math.max(8, pct * maxH);
              const col = COLOR[Math.min(Math.round(pct * 4), 4)];
              const em  = EMOJI[Math.min(Math.round(pct * 4), 4)];
              return (
                <div key={i} style={{ flex:1, display:'flex', flexDirection:'column',
                  alignItems:'center', justifyContent:'flex-end', height:'100%', gap:4 }}>
                  <span style={{ fontSize:14 }}>{em}</span>
                  <motion.div initial={{ height:0 }} animate={{ height:h }}
                    transition={{ duration:0.6, delay: i * 0.04, ease:'easeOut' }}
                    style={{ width:'100%', borderRadius:6, background:col, minWidth:12,
                      boxShadow:`0 4px 12px ${col}55` }} />
                  <span style={{ fontSize:9, color:'rgba(79,70,229,0.35)', fontWeight:600,
                    position:'absolute', bottom:8 }}>{entry.score}</span>
                </div>
              );
            })}
          </div>
        )}
      </GlassCard>

      {/* Log list */}
      {!loading && log.length > 0 && (
        <GlassCard style={{ width:'100%', padding:'20px' }}>
          <h3 style={{ fontSize:13, fontWeight:700, color:'rgba(79,70,229,0.65)',
            textTransform:'uppercase', letterSpacing:'0.12em', marginBottom:14 }}>
            History
          </h3>
          <div style={{ display:'flex', flexDirection:'column', gap:10, maxHeight:240, overflowY:'auto' }}>
            {log.map((e, i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:12,
                padding:'10px 14px', borderRadius:'1rem',
                background:'rgba(255,255,255,0.25)', border:'1px solid rgba(255,255,255,0.4)' }}>
                <span style={{ fontSize:22 }}>{EMOJI[Math.min(Math.round((e.score-1)/9 * 4), 4)]}</span>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:600, color:'rgba(30,27,75,0.8)' }}>
                    Score: {e.score}/10 {e.note && `· "${e.note}"`}
                  </div>
                  <div style={{ fontSize:11, color:'rgba(79,70,229,0.4)', marginTop:2 }}>
                    {new Date(e.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      )}
    </div>
  );
};
export default MoodPage;
