const express = require('express');
const router = express.Router();
const { db } = require('../../../db');
const { isValidAddress } = require('../../../core/wallet');

router.get('/history/:address', async (req, res) => {
  const address = req.params.address;

  if (!isValidAddress(address)) {
    return res.status(400).json({ success: false, error: 'Address tidak valid' });
  }

  const history = [];

  try {
    const stream = db.createReadStream();
    stream
      .on('data', ({ key, value }) => {
        try {
          const utxo = JSON.parse(value);
          if (utxo.address === address) {
            history.push({
              txid: key,
              amount: utxo.amount,
              status: 'unspent' // kamu bisa ubah ini jika punya sistem tracking status
            });
          }
        } catch (e) {
          // abaikan data yang rusak
        }
      })
      .on('end', () => {
        res.json({ success: true, address, history });
      })
      .on('error', (err) => {
        res.status(500).json({ success: false, error: 'Gagal membaca data' });
      });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Kesalahan internal' });
  }
});

module.exports = router;
