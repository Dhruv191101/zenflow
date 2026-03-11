const express = require('express');
const router = express.Router();
const User = require('../models/User');

// POST /api/session — log a usage session
router.post('/', async (req, res) => {
  try {
    const { userId, feature, durationSeconds } = req.body;
    if (!userId || !feature) {
      return res.status(400).json({ error: 'userId and feature are required' });
    }

    let user = await User.findOne({ userId });
    if (!user) {
      user = new User({ userId });
    }
    user.sessionLog.push({ feature, durationSeconds: durationSeconds || 0 });
    await user.save();

    res.status(201).json({ success: true, sessionLog: user.sessionLog.slice(-10) });
  } catch (err) {
    console.error('POST /api/session error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/session/:userId — retrieve session history
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.params.userId });
    if (!user) return res.status(200).json({ sessionLog: [] });
    const log = [...user.sessionLog].sort((a, b) => b.timestamp - a.timestamp).slice(0, 20);
    res.json({ sessionLog: log });
  } catch (err) {
    console.error('GET /api/session error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
