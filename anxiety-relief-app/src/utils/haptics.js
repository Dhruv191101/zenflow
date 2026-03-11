/**
 * Utility for providing haptic feedback.
 * Uses the navigator.vibrate API, gracefully degrading if not supported (e.g., desktop/iOS Safari without workarounds).
 */

export const isHapticsSupported = () => {
    return typeof navigator !== 'undefined' && 'vibrate' in navigator;
  };
  
  export const triggerHaptic = (pattern) => {
    if (!isHapticsSupported()) return;
    try {
      navigator.vibrate(pattern);
    } catch (e) {
      console.warn('Haptics failed', e);
    }
  };
  
  export const HAPTIC_PATTERNS = {
    // Very short, sharp tap for simple interactions (like a gentle pop)
    lightTap: 10,
    
    // Medium tap, slightly more pronounced
    mediumTap: 25,
    
    // Deeper, heavier thud for significant mechanical actions (toggles, switches)
    heavyClick: 50,
  
    // Specific compound feeling for bubble wrap popping: sharp entry, quick fade
    bubblePop: [15, 30, 10], 
    
    // Specific feeling for mechanical switch toggling on and off
    switchOn: [20, 10, 30],
    switchOff: [30, 20, 15]
  };
