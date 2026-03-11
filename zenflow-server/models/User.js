const mongoose = require('mongoose');

const moodEntrySchema = new mongoose.Schema({
  score: { type: Number, required: true, min: 1, max: 10 },
  note: { type: String, default: '' },
  timestamp: { type: Date, default: Date.now },
});

const sessionEntrySchema = new mongoose.Schema({
  feature: { type: String, required: true },
  durationSeconds: { type: Number, default: 0 },
  timestamp: { type: Date, default: Date.now },
});

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  moodLog: [moodEntrySchema],
  sessionLog: [sessionEntrySchema],
});

module.exports = mongoose.model('User', userSchema);
