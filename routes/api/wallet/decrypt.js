// routes/api/wallet/decrypt.js
const express = require('express');
const router = express.Router();
const { decryptPrivateKey, importPrivateKey } = require('../../../core/wallet');

router.post('/decrypt', (req, res) => {
  const { encrypted, password } = req.body;
  if (!encrypted || !password) {
    return res.status(400).json({ success: false, error: 'Data kurang' });
  }

  try {
    const privkey = decryptPrivateKey(encrypted, password);
    const wallet = importPrivateKey(privkey);
    res.json({ success: true, ...wallet });
  } catch (e) {
    res.status(500).json({ success: false, error: 'Gagal dekripsi' });
  }
});

module.exports = router;
