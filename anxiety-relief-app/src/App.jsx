import React, { useState } from 'react';
import GlassCard from './components/GlassCard';
import BubbleWrap from './components/BubbleWrap';
import ClickerToy from './components/ClickerToy';
import './index.css';

const TAB_DATA = [
  { id: 'bubble', label: '🫧  Bubble Wrap' },
  { id: 'clicker', label: '🎯  Clicker Toy' },
];

function App() {
  const [activeTab, setActiveTab] = useState('bubble');

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 16px',
      maxWidth: 480,
      margin: '0 auto',
      width: '100%',
    }}>
      {/* Header */}
      <header style={{
        width: '100%',
        marginBottom: 24,
        background: 'rgba(255,255,255,0.22)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRadius: '999px',
        padding: '16px 28px',
        border: '1.5px solid rgba(255,255,255,0.55)',
        boxShadow: '0 8px 32px rgba(99,102,241,0.12), inset 0 1px 0 rgba(255,255,255,0.7)',
        textAlign: 'center',
      }}>
        <h1 style={{
          fontSize: 28,
          fontWeight: 700,
          background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          letterSpacing: '-0.01em',
          lineHeight: 1.2,
        }}>
          ✦ ZenFlow
        </h1>
        <p style={{
          marginTop: 4,
          fontSize: 12.5,
          color: 'rgba(79,70,229,0.55)',
          fontWeight: 500,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
        }}>
          Take a breath · Feel the calm
        </p>
      </header>

      {/* Main glass card with active toy */}
      <GlassCard style={{ width: '100%', padding: '32px 24px', minHeight: 440, marginBottom: 20, display:'flex', alignItems:'center', justifyContent:'center' }}>
        {activeTab === 'bubble' && <BubbleWrap />}
        {activeTab === 'clicker' && <ClickerToy />}
      </GlassCard>

      {/* Bottom navigation tabs */}
      <nav style={{
        display: 'flex',
        gap: 10,
        width: '100%',
        background: 'rgba(255,255,255,0.22)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        padding: 8,
        borderRadius: '1.5rem',
        border: '1.5px solid rgba(255,255,255,0.55)',
        boxShadow: '0 8px 32px rgba(99,102,241,0.12)',
      }}>
        {TAB_DATA.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1,
              padding: '14px 16px',
              borderRadius: '1rem',
              fontWeight: 600,
              fontSize: 13.5,
              letterSpacing: '0.01em',
              transition: 'all 0.25s ease',
              color: activeTab === tab.id ? '#4f46e5' : 'rgba(79,70,229,0.5)',
              background: activeTab === tab.id ? 'white' : 'transparent',
              boxShadow: activeTab === tab.id
                ? '0 4px 16px rgba(99,102,241,0.18), inset 0 1px 0 rgba(255,255,255,0.8)'
                : 'none',
            }}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
}

export default App;
