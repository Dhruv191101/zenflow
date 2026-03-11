import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '../components/shared/GlassCard';
import { getStats } from '../utils/reliefAPI';

const TECHNIQUE_ICONS = {
  'Bubble Wrap': '🫧', 'Clicker': '🎯', 'Kinetic Sand': '🏖️',
  'Fidget Cube': '🎲', 'Marble Mesh': '🔮', 'Fidget Spinner': '🌀',
  'Cyclic Sighing': '🌊', 'Box Breathing': '⬛', '4-7-8 Breathing': '🌙',
  '5-4-3-2-1 Ground': '🌿', 'Haptic Heartbeat': '💓',
};

const STAT_COLOR = ['#a5b4fc', '#6ee7b7', '#f9a8d4', '#fde68a'];

export default function JournalPage() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    setStats(getStats());
    const t = setInterval(() => setStats(getStats()), 2000);
    return () => clearInterval(t);
  }, []);

  if (!stats) return null;

  const statCards = [
    { label: 'Total Sessions', value: stats.total, color: STAT_COLOR[0], icon: '✦' },
    { label: 'Today', value: stats.todayCount, color: STAT_COLOR[1], icon: '☀️' },
    { label: 'Day Streak', value: `${stats.streak}🔥`, color: STAT_COLOR[2], icon: '🔥' },
    { label: 'Favorite', value: TECHNIQUE_ICONS[stats.favorite] || '—', color: STAT_COLOR[3], icon: '⭐' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, width: '100%' }}>
      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {statCards.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            style={{ padding: '18px 14px', textAlign: 'center', borderRadius: '1.5rem',
              background: 'rgba(255,255,255,0.22)', backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: `1.5px solid ${s.color}55`,
              boxShadow: `0 4px 20px ${s.color}22` }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: s.color, letterSpacing: '-0.01em' }}>
              {s.value}
            </div>
            <div style={{ fontSize: 10, color: 'rgba(79,70,229,0.5)', fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '0.12em', marginTop: 4 }}>{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Session history */}
      <GlassCard style={{ width: '100%', padding: '20px' }}>
        <h3 style={{ fontSize: 13, fontWeight: 700, color: 'rgba(79,70,229,0.65)',
          textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 14 }}>
          Recent Sessions
        </h3>

        {stats.recentSessions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '28px 0' }}>
            <div style={{ fontSize: 44, marginBottom: 12 }}>🌱</div>
            <p style={{ fontSize: 14, color: 'rgba(79,70,229,0.45)', fontWeight: 500 }}>
              No sessions yet — start any toy, breathing, or grounding technique!
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 280, overflowY: 'auto' }}>
            <AnimatePresence initial={false}>
              {stats.recentSessions.map((s, i) => (
                <motion.div key={`${s.date}-${i}`}
                  initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  style={{ display: 'flex', alignItems: 'center', gap: 12,
                    padding: '10px 14px', borderRadius: '1rem',
                    background: 'rgba(255,255,255,0.25)', border: '1px solid rgba(255,255,255,0.4)' }}>
                  <span style={{ fontSize: 22 }}>{TECHNIQUE_ICONS[s.technique] || '✦'}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(30,27,75,0.8)' }}>{s.technique}</div>
                    <div style={{ fontSize: 11, color: 'rgba(79,70,229,0.4)', marginTop: 2 }}>
                      {new Date(s.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · {new Date(s.date).toLocaleDateString()}
                    </div>
                  </div>
                  <div style={{ width: 8, height: 8, borderRadius: '50%',
                    background: 'rgba(99,102,241,0.35)' }} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </GlassCard>

      {/* Motivation */}
      {stats.total > 0 && (
        <div style={{ textAlign: 'center', padding: '8px 0' }}>
          <p style={{ fontSize: 13, color: 'rgba(79,70,229,0.45)', fontWeight: 500, fontStyle: 'italic' }}>
            {stats.streak >= 3 ? `🔥 ${stats.streak}-day streak! Keep going.`
              : stats.todayCount >= 3 ? '✦ Great self-care day!'
              : 'Every session counts. 💙'}
          </p>
        </div>
      )}
    </div>
  );
}
