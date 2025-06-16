const express = require('express');
const router = express.Router();
const { importPrivateKey } = require('../../../core/wallet');

router.post('/import', (req, res) => {
  const { privkey } = req.body;

  if (!privkey) {
    return res.status(400).json({ success: false, error: 'Private key tidak ditemukan' });
  }

  try {
    const wallet = importPrivateKey(privkey);

    res.json({
      success: true,
      address: wallet.address,
      pubkey: wallet.publicKey,
      privkey: wallet.privateKey
    });
  } catch (e) {
    res.status(400).json({ success: false, error: 'Private key tidak valid' });
  }
});

module.exports = router;
