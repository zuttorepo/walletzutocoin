const express = require('express');
const crypto = require('crypto');
const router = express.Router();

// AES256-CBC
function decrypt(encrypted, password, ivBase64) {
  const key = crypto.scryptSync(password, 'ztcsalt', 32);
  const iv = Buffer.from(ivBase64, 'base64');
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  let decrypted = decipher.update(encrypted, 'base64', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

router.post('/decrypt', (req, res) => {
  const { encrypted, password, iv } = req.body;
  if (!encrypted || !password || !iv) {
    return res.status(400).json({ error: 'encrypted, password & iv required' });
  }

  try {
    const decrypted = decrypt(encrypted, password, iv);
    res.json({ privateKey: decrypted });
  } catch (e) {
    res.status(400).json({ error: 'Decryption failed' });
  }
});

module.exports = router;
