const express = require('express');
const router = express.Router();
const db = require('../../../db');

router.get('/:address/balance', async (req, res) => {
  const address = req.params.address;
  let balance = 0;

  try {
    await db.iterateUTXOs((utxo) => {
      if (utxo.address === address) {
        balance += utxo.amount;
      }
    });

    res.json({ address, balance });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

module.exports = router;
