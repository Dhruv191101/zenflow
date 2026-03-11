const express = require('express');
const router = express.Router();
const User = require('../models/User');

// POST /api/mood — log a mood entry for a user
router.post('/', async (req, res) => {
  try {
    const { userId, score, note } = req.body;
    if (!userId || score == null) {
      return res.status(400).json({ error: 'userId and score are required' });
    }

    let user = await User.findOne({ userId });
    if (!user) {
      user = new User({ userId });
    }
    user.moodLog.push({ score, note: note || '' });
    await user.save();

    res.status(201).json({ success: true, moodLog: user.moodLog });
  } catch (err) {
    console.error('POST /api/mood error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/mood/:userId — get mood history
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.params.userId });
    if (!user) {
      return res.status(200).json({ moodLog: [] });
    }
    // Return last 30 entries sorted by newest
    const log = [...user.moodLog].sort((a, b) => b.timestamp - a.timestamp).slice(0, 30);
    res.json({ moodLog: log });
  } catch (err) {
    console.error('GET /api/mood error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
