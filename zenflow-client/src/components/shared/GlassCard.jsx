import React from 'react';
import { motion } from 'framer-motion';

const GlassCard = ({ children, style = {}, animate = true, className = '', ...rest }) => {
  const Comp = animate ? motion.div : 'div';
  const motionProps = animate
    ? { initial: { opacity: 0, y: 22 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
    : {};

  return (
    <Comp
      {...motionProps}
      className={`glass-card ${className}`}
      style={{ ...style }}
      {...rest}
    >
      {/* Specular top highlight */}
      <div style={{ position:'absolute', top:0, left:'10%', width:'80%', height:2,
        background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.8),transparent)',
        borderRadius:'100%', pointerEvents:'none', zIndex:0 }} />
      {/* Frosted inner sheen */}
      <div style={{ position:'absolute', inset:0,
        background:'linear-gradient(140deg,var(--glass-sheen) 0%,rgba(255,255,255,0.02) 60%,transparent 100%)',
        pointerEvents:'none', borderRadius:'2rem', zIndex:0 }} />
      <div style={{ position:'relative', zIndex:1, width:'100%', height:'100%' }}>
        {children}
      </div>
    </Comp>
  );
};
export default GlassCard;
