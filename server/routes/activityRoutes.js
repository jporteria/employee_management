const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/activity-logs', async (req, res) => {
  try {
    const [logs] = await db.query('SELECT * FROM activity_logs ORDER BY timestamp DESC');
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch activity logs' });
  }
});

module.exports = router;
