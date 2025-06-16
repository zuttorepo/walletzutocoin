const express = require('express');
const router = express.Router();
const db = require('../../../db');
const { sign, doubleSha256 } = require('../../../utils');

router.post('/', async (req, res) => {
  const { rawtx, privkey } = req.body;

  if (!rawtx || !privkey) {
    return res.status(400).json({ status: 'error', message: 'Missing parameters' });
  }

  try {
    // Copy TX tanpa scriptSig
    const txCopy = JSON.parse(JSON.stringify(rawtx));
    txCopy.inputs.forEach(i => i.scriptSig = '');

    const txHash = doubleSha256(Buffer.from(JSON.stringify(txCopy))).toString('hex');
    const signature = sign(privkey, txHash);

    // Isi setiap input dengan scriptSig
    rawtx.inputs.forEach(input => {
      input.scriptSig = signature;
    });

    res.json({ status: 'ok', signedtx: rawtx });

  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

module.exports = router;
