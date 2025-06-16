const express = require('express');
const router = express.Router();
const db = require('../../../db');
const { doubleSha256 } = require('../../../utils');

router.post('/', async (req, res) => {
  const { from, to, amount } = req.body;

  if (!from || !to || !amount) {
    return res.status(400).json({ status: 'error', message: 'Missing parameters' });
  }

  try {
    let utxos = [];
    let total = 0;

    await db.iterateUTXOs((utxo, key) => {
      if (utxo.address === from) {
        utxos.push({ ...utxo, key });
        total += utxo.amount;
      }
    });

    if (total < amount) {
      return res.status(400).json({ status: 'error', message: 'Insufficient balance' });
    }

    const inputs = utxos.map((utxo) => {
      const [_, txid, vout] = utxo.key.split('_');
      return {
        txid,
        vout: parseInt(vout),
        scriptSig: ''
      };
    });

    const outputs = [{ address: to, amount }];

    // Kembalian
    const change = total - amount;
    if (change > 0) {
      outputs.push({ address: from, amount: change });
    }

    const tx = {
      inputs,
      outputs
    };

    res.json({ status: 'ok', rawtx: tx });

  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

module.exports = router;
