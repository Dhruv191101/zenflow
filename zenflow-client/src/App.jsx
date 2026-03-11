import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import './index.css';

import { ThemeProvider } from './utils/ThemeContext';
import Header     from './components/shared/Header';
import BottomNav  from './components/shared/BottomNav';

import HomePage    from './pages/HomePage';
import ToysPage    from './pages/ToysPage';
import BreathePage from './pages/BreathePage';
import GroundingPage from './pages/GroundingPage';
import CheckInPage from './pages/CheckInPage';

const PAGE_META = {
  home:    { title:'✦ ZenFlow', subtitle:'Take a breath · Feel the calm' },
  toys:    { title:'🫧 Fidget Toys', subtitle:'10 toys to explore' },
  breathe: { title:'🌊 Breathwork', subtitle:'3 clinical protocols' },
  ground:  { title:'🌿 Grounding', subtitle:'Return to the present' },
  journal: { title:'💆 Check In', subtitle:'How are you feeling right now?' },
};

function App() {
  const [page, setPage] = useState('home');
  const { title, subtitle } = PAGE_META[page] || PAGE_META.home;

  const renderPage = () => {
    switch (page) {
      case 'home':    return <HomePage    onNavigate={setPage} />;
      case 'toys':    return <ToysPage    />;
      case 'breathe': return <BreathePage />;
      case 'ground':  return <GroundingPage />;
      case 'journal': return <CheckInPage />;
      default:        return <HomePage onNavigate={setPage} />;
    }
  };

  return (
    <ThemeProvider>
      <div className="page-root">
        <Header title={title} subtitle={subtitle} />
        <AnimatePresence mode="wait">
          <motion.div key={page} style={{ width:'100%' }}
            initial={{ opacity:0, y:14 }}
            animate={{ opacity:1, y:0 }}
            exit={{ opacity:0, y:-8 }}
            transition={{ duration:0.28, ease:[0.22,1,0.36,1] }}>
            {renderPage()}
          </motion.div>
        </AnimatePresence>
        <BottomNav active={page} onNavigate={setPage} />
      </div>
    </ThemeProvider>
  );
}
export default App;
