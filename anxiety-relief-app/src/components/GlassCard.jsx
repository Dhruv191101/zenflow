import React from 'react';
import { motion } from 'framer-motion';

const GlassCard = ({ children, style = {}, ...props }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: 'relative',
        background: 'rgba(255,255,255,0.22)',
        backdropFilter: 'blur(28px)',
        WebkitBackdropFilter: 'blur(28px)',
        border: '1.5px solid rgba(255,255,255,0.55)',
        borderRadius: '2rem',
        boxShadow: '0 20px 60px rgba(79,70,229,0.15), 0 4px 16px rgba(79,70,229,0.08), inset 0 1px 0 rgba(255,255,255,0.7)',
        overflow: 'hidden',
        ...style,
      }}
      {...props}
    >
      {/* Top specular highlight (simulates light hitting glass edge) */}
      <div style={{
        position: 'absolute',
        top: 0, left: '10%',
        width: '80%', height: '2px',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.9), transparent)',
        borderRadius: '100%',
        pointerEvents: 'none',
      }} />
      {/* Inner frosted sheen */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(140deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.05) 60%, transparent 100%)',
        pointerEvents: 'none',
        borderRadius: '2rem',
      }} />
      <div style={{ position: 'relative', zIndex: 1, width: '100%', height: '100%' }}>
        {children}
      </div>
    </motion.div>
  );
};

export default GlassCard;
