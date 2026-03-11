# ZenFlow 🌊

> A science-backed, mobile-first anxiety relief app with fidget toys, breathwork, and grounding exercises — built with React, no account required.

[![License: MIT](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-7-green.svg)](https://vitejs.dev)
[![Live Demo](https://img.shields.io/badge/Demo-Netlify-teal.svg)](#)

---

## ✦ What Is ZenFlow?

ZenFlow is a digital anxiety relief toolkit grounded in clinical research on fidget mechanics, ASMR, and cognitive behavioural therapeutics. It runs entirely in the browser — no account, no download, no server required.

The app combines three evidence-based modalities:

| Category | Techniques | Research Basis |
|---|---|---|
| 🫧 **Fidget Toys** | 10 interactive toys | Sensory discharge, tactile grounding |
| 🌊 **Breathwork** | Cyclic Sighing, Box Breathing, 4-7-8 | Vagal nerve regulation |
| 🌿 **Grounding** | 5-4-3-2-1 Sensory & Haptic Heartbeat | Cognitive re-anchoring |

---

## 🚀 Features

### 10 Fidget Toys
- **🫧 Bubble Wrap** — Pop with sound + haptic feedback
- **🟣 Pop It** — Hexagonal silicone-style grid
- **🎯 Clicker** — Counter with toggle and click sounds
- **🫷 Stress Ball** — Morphing squeeze animation
- **🏖️ Kinetic Sand** — Canvas particle drawing with glow
- **💧 Ripple Pool** — Tap-to-ripple water simulation
- **🎲 Fidget Cube** — Switch / Zen Dial / Worry Beads
- **🔮 Marble Mesh** — Physics marble slide
- **🌀 Fidget Spinner** — Flick-to-spin with real angular momentum
- **🫙 Lava Lamp** — Physics metaball simulation

### Breathwork Protocols
- **Cyclic Sighing** — Double inhale + long exhale (fastest anxiety reducer per Stanford research)
- **Box Breathing** — 4-4-4-4 (used by Navy SEALs for acute stress)
- **4-7-8 Breathing** — Natural tranquiliser for sleep and deep calm

### Grounding Techniques
- **5-4-3-2-1** — Multi-sensory anchoring exercise
- **Haptic Heartbeat** — Synthesized lub-dub with vagus nerve entrainment

### UX & Design
- 🌙 **Dark / Light mode** — toggle with localStorage persistence
- 💆 **Emotional Check-In** — Pick your current state, get personalised technique suggestions
- 🎵 **Synthesized ASMR sounds** — All audio is generated via Web Audio API (no downloads)
- 📳 **Haptic feedback** — `navigator.vibrate` patterns synced to each interaction
- 📱 **Mobile-first** — Touch events, `touchAction: none`, pointer capture for all toys

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| UI Framework | React 18 + Vite 7 |
| Animation | Framer Motion |
| Styling | Vanilla CSS + CSS Variables (no Tailwind) |
| Audio | Web Audio API (synthesized, no audio files) |
| Haptics | Navigator Vibration API |
| State | React Context (ThemeContext) |
| Storage | `localStorage` for theme preference |
| Build | Vite production build → single `dist/` folder |

---

## 📦 Getting Started

### Prerequisites
- Node.js 18+ and npm

### Development

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/zenflow.git
cd zenflow/zenflow-client

# Install dependencies
npm install

# Start dev server (localhost:5173)
npm run dev

# Build production bundle
npm run build
```

### Deploy (Netlify Drop — no account needed)
1. Run `npm run build`
2. Drag the `dist/` folder to [netlify.com/drop](https://app.netlify.com/drop)
3. Get a shareable URL instantly

---

## 📁 Project Structure

```
zenflow-client/
├── src/
│   ├── components/
│   │   ├── breathwork/
│   │   │   └── BreathCircle.jsx      # Animated breathing circles
│   │   ├── grounding/
│   │   │   ├── Grounding54321.jsx    # 5-4-3-2-1 sensory steps
│   │   │   └── HapticHeartbeat.jsx   # Lub-dub rhythm + vibration
│   │   ├── shared/
│   │   │   ├── BottomNav.jsx         # Tab navigation
│   │   │   ├── GlassCard.jsx         # Reusable glass morphism card
│   │   │   └── Header.jsx            # App header + dark mode toggle
│   │   └── toys/
│   │       ├── BubbleWrap.jsx
│   │       ├── ClickerToy.jsx
│   │       ├── FidgetCube.jsx        # Switch + Zen Dial + Worry Beads
│   │       ├── FidgetSpinner.jsx     # Angular momentum physics
│   │       ├── KineticSand.jsx       # Canvas particle sim
│   │       ├── LavaLamp.jsx          # Canvas metaball physics
│   │       ├── MarbleMesh.jsx        # Marble slide
│   │       ├── PopIt.jsx             # Hexagonal grid
│   │       ├── RipplePool.jsx        # Canvas water ripples
│   │       └── StressBall.jsx        # Morphing SVG blob
│   ├── pages/
│   │   ├── BreathePage.jsx
│   │   ├── CheckInPage.jsx           # Emotional check-in (no storage)
│   │   ├── GroundingPage.jsx
│   │   ├── HomePage.jsx              # Animated landing page
│   │   └── ToysPage.jsx
│   └── utils/
│       ├── haptics.js                # Vibration API helpers
│       ├── reliefAPI.js              # localStorage session tracking
│       ├── sounds.js                 # Web Audio API synthesizer
│       └── ThemeContext.jsx          # Dark/light theme provider
├── index.html
├── package.json
└── vite.config.js
```

---

## 🎨 Design Philosophy

- **Glass Morphism** — `backdrop-filter: blur()` cards on animated gradient backgrounds
- **CSS Variables** — Full light/dark theme switching via `[data-theme]` attribute
- **No external audio files** — All sounds synthesized in-browser using oscillators, noise, and filters
- **Touch-first events** — `onMouseDown` + `onTouchStart` dual wiring for all canvas toys; `onClick` (not `onPointerDown`) for navigation to prevent scroll-triggered page changes

---

## 🧪 Browser Support

| Feature | Support |
|---|---|
| Web Audio API | Chrome 66+, Safari 14.1+, Firefox 76+ |
| Vibration API | Android Chrome; ❌ iOS Safari (silent fallback) |
| CSS backdrop-filter | All modern browsers |
| Canvas 2D | All modern browsers |

> **iOS note:** Audio requires a user gesture to unlock the AudioContext. The first tap on any interactive element will unlock all subsequent sounds.

---

## 📄 License

MIT © 2026 — see [LICENSE](LICENSE) for full text.

You are free to use, modify, and distribute this project for personal or commercial purposes.

---

## 🙏 Acknowledgments

- Breathwork protocols based on research by Andrew Huberman (Stanford) and Herbert Benson (Harvard)
- Fidget toy mechanics inspired by occupational therapy sensory integration studies
- ASMR sound synthesis techniques from the Web Audio API community

---

*Made with 💙 to make anxiety relief accessible to everyone.*
