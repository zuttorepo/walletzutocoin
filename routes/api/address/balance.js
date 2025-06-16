const express = require('express');
const router = express.Router();
const db = require('../../../db'); // Pastikan path ini sesuai

router.get('/:address/balance', async (req, res) => {
  const address = req.params.address;
  let balance = 0;

  try {
    db.db.createReadStream()
      .on('data', ({ key, value }) => {
        try {
          const data = typeof value === 'string' ? JSON.parse(value) : value;
          if (data.address === address) {
            balance += data.amount;
          }
        } catch (e) {
          // Lewati data corrupt
        }
      })
      .on('error', (err) => {
        res.status(500).json({ error: 'Database read error', details: err.toString() });
      })
      .on('end', () => {
        res.json({ address, balance });
      });
  } catch (e) {
    res.status(500).json({ error: 'Server error', details: e.toString() });
  }
});

module.exports = router;
