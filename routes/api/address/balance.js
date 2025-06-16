const express = require('express');
const router = express.Router();
const db = require('../../../db'); // Cek file db.js ada!

router.get('/:address/balance', async (req, res) => {
  const address = req.params.address;
  let balance = 0;

  try {
    db.db.createReadStream()
      .on('data', ({ key, value }) => {
        try {
          const utxo = typeof value === 'string' ? JSON.parse(value) : value;
          if (utxo.address === address) {
            balance += utxo.amount;
          }
        } catch (e) {}
      })
      .on('end', () => {
        res.json({ address, balance });
      })
      .on('error', (err) => {
        res.status(500).json({ error: 'Read error', details: err.toString() });
      });
  } catch (e) {
    res.status(500).json({ error: e.toString() });
  }
});

module.exports = router;
