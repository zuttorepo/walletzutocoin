const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { decryptPrivateKey, isValidAddress } = require('../../../core/wallet');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const crypto = require('crypto');

// Endpoint: POST /api/tx/send
router.post(
  '/',
  [
    body('to').isString().custom(isValidAddress).withMessage('Address tujuan tidak valid'),
    body('amount').isNumeric().withMessage('Jumlah harus numerik'),
    body('encryptedPrivateKey').isString().withMessage('Private key terenkripsi wajib'),
    body('password').isString().withMessage('Password wajib')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const { to, amount, encryptedPrivateKey, password } = req.body;

      // 1. Dekripsi private key
      const privateKey = decryptPrivateKey(encryptedPrivateKey, password);

      // 2. Buat keypair dari private key
      const keyPair = ec.keyFromPrivate(privateKey, 'hex');
      const publicKey = keyPair.getPublic('hex');

      // 3. Siapkan data transaksi (sederhana dulu)
      const txData = {
        from: publicKey,  // atau bisa address dari pubkey
        to,
        amount,
        timestamp: Date.now()
      };

      // 4. Buat hash transaksi
      const txHash = crypto.createHash('sha256').update(JSON.stringify(txData)).digest('hex');

      // 5. Sign transaksi
      const signature = keyPair.sign(txHash).toDER('hex');

      // 6. Return hasil transaksi (belum broadcast karena kita belum punya jaringan node)
      return res.status(200).json({
        success: true,
        tx: {
          from: txData.from,
          to: txData.to,
          amount: txData.amount,
          timestamp: txData.timestamp,
          hash: txHash,
          signature
        },
        message: '✅ Transaksi berhasil ditandatangani.'
      });

    } catch (err) {
      console.error('Gagal mengirim transaksi:', err);
      return res.status(500).json({
        success: false,
        error: '❌ Terjadi kesalahan saat proses transaksi.'
      });
    }
  }
);

module.exports = router;
