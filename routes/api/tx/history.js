// routes/api/tx/history.js
const express = require('express');
const router = express.Router();
const db = require('../../../db');

router.get('/:address/history', async (req, res) => {
  const address = req.params.address;

  try {
    const history = await db.get(`txlog/${address}`) || [];
    res.json({ address, history });
  } catch (e) {
    res.status(500).json({ error: 'Failed to retrieve TX history.' });
  }
});

module.exports = router;
