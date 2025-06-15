const express = require('express');
const router = express.Router();
const db = require('../../../db');
const { doubleSha256, verifySignature } = require('../../../utils');

// Validasi transaksi
async function validateTransaction(tx) {
  if (!tx.inputs || !tx.outputs) throw new Error('Invalid TX');

  for (const input of tx.inputs) {
    const utxoKey = `utxo_${input.txid}_${input.vout}`;
    const utxo = await db.get(utxoKey);
    if (!utxo) throw new Error(`UTXO not found: ${utxoKey}`);

    const txCopy = JSON.parse(JSON.stringify(tx));
    txCopy.inputs.forEach(i => i.scriptSig = '');
    const txHash = doubleSha256(Buffer.from(JSON.stringify(txCopy))).toString('hex');

    if (!verifySignature(utxo.pubKey, txHash, input.scriptSig)) {
      throw new Error('Invalid signature');
    }
  }

  let totalIn = 0;
  for (const input of tx.inputs) {
    const utxo = await db.get(`utxo_${input.txid}_${input.vout}`);
    totalIn += utxo.amount;
  }

  let totalOut = 0;
  for (const output of tx.outputs) {
    if (!output.address || output.amount <= 0) throw new Error('Invalid output');
    totalOut += output.amount;
  }

  if (totalOut > totalIn) throw new Error('Output > Input');
}

// POST /api/tx/send
router.post('/', async (req, res) => {
  const tx = req.body;
  try {
    await validateTransaction(tx);

    for (const input of tx.inputs) {
      const utxoKey = `utxo_${input.txid}_${input.vout}`;
      await db.del(utxoKey);
    }

    for (let i = 0; i < tx.outputs.length; i++) {
      const out = tx.outputs[i];
      const utxoKey = `utxo_${tx.txid}_${i}`;
      await db.put(utxoKey, {
        address: out.address,
        amount: out.amount,
        pubKey: out.pubKey || ''
      });
    }

    const txid = doubleSha256(Buffer.from(JSON.stringify(tx))).toString('hex');
    tx.txid = txid;
    await db.put(`tx_${txid}`, tx);

    res.json({ status: 'success', txid });
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
});

module.exports = router;

