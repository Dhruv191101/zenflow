// Web Audio API synthesized ASMR sounds
// All sounds generated in-browser — no audio file downloads required.
// AudioContext is created lazily on first user interaction (required by browsers).

let ctx = null;

const getCtx = () => {
  if (!ctx) {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
  }
  // Resume if suspended (mobile browsers require this after inactivity)
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
};

// ── Core helpers ──────────────────────────────────────────
const fadeOut = (gainNode, duration, ac) => {
  gainNode.gain.setValueAtTime(gainNode.gain.value, ac.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + duration);
};

// ── Sound definitions ──────────────────────────────────────

// Crisp bubble pop — descending sine (800→200Hz, 0.12s)
export const playBubblePop = () => {
  try {
    const ac = getCtx();
    const osc = ac.createOscillator();
    const gain = ac.createGain();

    osc.connect(gain);
    gain.connect(ac.destination);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(700, ac.currentTime);
    osc.frequency.exponentialRampToValueAtTime(180, ac.currentTime + 0.1);

    gain.gain.setValueAtTime(0.35, ac.currentTime);
    fadeOut(gain, 0.12, ac);

    osc.start(ac.currentTime);
    osc.stop(ac.currentTime + 0.14);
  } catch (e) { /* silent fail */ }
};

// Heavy button thud — low noise with low-pass filter (0.08s)
export const playHeavyClick = () => {
  try {
    const ac = getCtx();
    const bufLen = ac.sampleRate * 0.08;
    const buffer = ac.createBuffer(1, bufLen, ac.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufLen; i++) data[i] = Math.random() * 2 - 1;

    const source = ac.createBufferSource();
    source.buffer = buffer;

    const filter = ac.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 180;

    const gain = ac.createGain();
    gain.gain.setValueAtTime(0.7, ac.currentTime);
    fadeOut(gain, 0.08, ac);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(ac.destination);

    source.start();
  } catch (e) { /* silent fail */ }
};

// Light tick — quick high-freq sine (1200Hz, 0.04s)
export const playLightTick = () => {
  try {
    const ac = getCtx();
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.connect(gain);
    gain.connect(ac.destination);
    osc.type = 'sine';
    osc.frequency.value = 1200;
    gain.gain.setValueAtTime(0.2, ac.currentTime);
    fadeOut(gain, 0.04, ac);
    osc.start(ac.currentTime);
    osc.stop(ac.currentTime + 0.05);
  } catch (e) { /* silent fail */ }
};

// Toggle switch — two-stage click sweep
export const playToggle = () => {
  try {
    const ac = getCtx();
    [0, 0.06].forEach((delay, i) => {
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.connect(gain);
      gain.connect(ac.destination);
      osc.type = 'square';
      osc.frequency.value = i === 0 ? 600 : 900;
      gain.gain.setValueAtTime(0.15, ac.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + delay + 0.05);
      osc.start(ac.currentTime + delay);
      osc.stop(ac.currentTime + delay + 0.06);
    });
  } catch (e) { /* silent fail */ }
};

// Breathe ambient — soft sine swell (used externally to trigger via timing)
export const playBreatheSwell = (freq = 180, duration = 0.5) => {
  try {
    const ac = getCtx();
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.connect(gain);
    gain.connect(ac.destination);
    osc.type = 'sine';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, ac.currentTime);
    gain.gain.linearRampToValueAtTime(0.08, ac.currentTime + duration * 0.3);
    gain.gain.linearRampToValueAtTime(0.0001, ac.currentTime + duration);
    osc.start(ac.currentTime);
    osc.stop(ac.currentTime + duration + 0.05);
  } catch (e) { /* silent fail */ }
};

// Sand crinkling — very short white noise burst (continuous feel when called repeatedly)
export const playSandCrinkle = () => {
  try {
    const ac = getCtx();
    const bufLen = ac.sampleRate * 0.04;
    const buffer = ac.createBuffer(1, bufLen, ac.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufLen; i++) data[i] = (Math.random() * 2 - 1) * 0.3;
    const source = ac.createBufferSource();
    source.buffer = buffer;
    const gain = ac.createGain();
    gain.gain.setValueAtTime(0.4, ac.currentTime);
    fadeOut(gain, 0.04, ac);
    source.connect(gain);
    gain.connect(ac.destination);
    source.start();
  } catch (e) { /* silent fail */ }
};

// Marble roll — smooth low sine tap
export const playMarbleRoll = () => {
  try {
    const ac = getCtx();
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.connect(gain);
    gain.connect(ac.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, ac.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, ac.currentTime + 0.08);
    gain.gain.setValueAtTime(0.2, ac.currentTime);
    fadeOut(gain, 0.09, ac);
    osc.start(ac.currentTime);
    osc.stop(ac.currentTime + 0.1);
  } catch (e) { /* silent fail */ }
};
