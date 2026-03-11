import React from 'react';

const TABS = [
  { id: 'home',    icon: '✦',  label: 'Home' },
  { id: 'toys',    icon: '🫧', label: 'Toys' },
  { id: 'breathe', icon: '🌊', label: 'Breathe' },
  { id: 'ground',  icon: '🌿', label: 'Ground' },
  { id: 'journal', icon: '💆', label: 'Check In' },
];

const BottomNav = ({ active, onNavigate }) => (
  <nav className="bottom-nav" style={{
    position: 'fixed',
    bottom: 16,
    left: '50%',
    transform: 'translateX(-50%)',
    width: 'calc(100% - 32px)',
    maxWidth: 480,
    zIndex: 100,
    display: 'flex',
    borderRadius: '1.75rem',
    padding: 8,
    gap: 4,
  }}>
    {TABS.map(tab => (
      <button
        key={tab.id}
        className={`tab-btn${active === tab.id ? ' active' : ''}`}
        /* onClick instead of onPointerDown — prevents firing on scroll start */
        onClick={() => onNavigate(tab.id)}
        style={{
          flex:1, display:'flex', flexDirection:'column',
          alignItems:'center', justifyContent:'center',
          gap:2, padding:'10px 4px', borderRadius:'1.25rem',
          fontWeight: active === tab.id ? 700 : 500,
          fontSize: 10,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          transition: 'all 0.2s ease',
        }}
      >
        <span style={{ fontSize: 18, lineHeight: 1 }}>{tab.icon}</span>
        {tab.label}
      </button>
    ))}
  </nav>
);

export default BottomNav;
