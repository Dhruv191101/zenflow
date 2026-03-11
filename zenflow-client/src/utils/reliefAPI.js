// LocalStorage-based session tracking — no server required.
// Fully persists across app restarts using the browser's localStorage.

const KEY = 'zenflow_sessions';

const getSessions = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]');
  } catch {
    return [];
  }
};

export const logSession = (technique) => {
  try {
    const sessions = getSessions();
    sessions.push({ technique, date: new Date().toISOString() });
    localStorage.setItem(KEY, JSON.stringify(sessions.slice(-200)));
  } catch { /* private mode or storage full */ }
};

export const getStats = () => {
  const sessions = getSessions();
  const today = new Date().toDateString();
  const todaySessions = sessions.filter(s => new Date(s.date).toDateString() === today);

  // Streak: count consecutive days with sessions
  let streak = 0;
  let d = new Date();
  while (true) {
    const ds = d.toDateString();
    const hasSessions = sessions.some(s => new Date(s.date).toDateString() === ds);
    if (!hasSessions && ds !== today) break;
    if (hasSessions) streak++;
    d.setDate(d.getDate() - 1);
  }

  // Favorite technique
  const counts = {};
  sessions.forEach(s => { counts[s.technique] = (counts[s.technique] || 0) + 1; });
  const fav = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || null;

  return {
    total: sessions.length,
    todayCount: todaySessions.length,
    streak,
    favorite: fav,
    recentSessions: sessions.slice(-30).reverse(),
  };
};
