// Haptic feedback utility
// Gracefully degrades on unsupported browsers (iOS Safari, desktop)

export const isHapticsSupported = () =>
  typeof navigator !== 'undefined' && 'vibrate' in navigator;

export const triggerHaptic = (pattern) => {
  if (!isHapticsSupported()) return;
  try { navigator.vibrate(pattern); } catch (e) { /* silent */ }
};

export const HAPTICS = {
  bubblePop:    [15, 30, 10],     // Crisp pop burst
  lightTap:     10,               // Menu selection
  mediumTap:    25,               // Subtle confirmation  
  heavyClick:   50,               // Big button press
  switchOn:     [20, 10, 30],     // Toggle activate
  switchOff:    [30, 20, 15],     // Toggle deactivate
  breatheIn:    [5, 20, 5, 20, 5],// Swell on inhale
  breatheHold:  [10],             // Gentle hold pulse
  breatheOut:   [30, 50, 20],     // Taper on exhale
  groundStep:   [15, 30],         // 5-4-3-2-1 step advance
  heartbeat:    (bpm) => {        // Vagus entrainment
    const interval = Math.round(60000 / bpm);
    return [60, interval - 60, 60];
  },
};
