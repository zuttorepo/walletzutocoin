const express = require('express');
const crypto = require('crypto');
const router = express.Router();

// AES256-CBC
function encrypt(text, password) {
  const iv = crypto.randomBytes(16);
  const key = crypto.scryptSync(password, 'ztcsalt', 32);
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(text, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  return {
    encrypted,
    iv: iv.toString('base64')
  };
}

router.post('/encrypt', (req, res) => {
  const { privateKey, password } = req.body;
  if (!privateKey || !password) {
    return res.status(400).json({ error: 'privateKey & password required' });
  }

  const { encrypted, iv } = encrypt(privateKey, password);
  res.json({ encrypted, iv });
});

module.exports = router;
