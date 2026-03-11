import React from 'react';
import { useTheme } from '../../utils/ThemeContext';

const Header = ({ title = '✦ ZenFlow', subtitle = 'Take a breath · Feel the calm' }) => {
  const { dark, toggle } = useTheme();
  return (
    <header className="app-header" style={{
      width:'100%', marginBottom:20,
      borderRadius: 999, padding:'10px 18px 10px 24px',
      display:'flex', alignItems:'center', justifyContent:'space-between',
    }}>
      <div style={{ flex:1, textAlign:'center' }}>
        <h1 style={{ fontSize:22, fontWeight:800,
          background:'linear-gradient(135deg,#4f46e5,#7c3aed)',
          WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
          backgroundClip:'text', letterSpacing:'-0.01em' }}>{title}</h1>
        <p style={{ marginTop:2, fontSize:10, color:'var(--text-muted)',
          fontWeight:500, letterSpacing:'0.14em', textTransform:'uppercase' }}>
          {subtitle}
        </p>
      </div>
      <button className="theme-toggle" onClick={toggle}
        aria-label="Toggle dark mode" title={dark ? 'Light mode' : 'Dark mode'}>
        {dark ? '☀️' : '🌙'}
      </button>
    </header>
  );
};
export default Header;
