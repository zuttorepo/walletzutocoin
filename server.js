const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');
const { doubleSha256, verifySignature } = require('./utils');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// Helper: Hitung saldo dari UTXO yang tersimpan
async function getBalance(address) {
  let balance = 0;
  return new Promise((resolve, reject) => {
    const stream = db.db.createReadStream();
    stream.on('data', (data) => {
      if (data.key.startsWith('utxo_')) {
        const utxo = JSON.parse(data.value);
        if (utxo.address === address) {
          balance += utxo.amount;
        }
      }
    });
    stream.on('error', (err) => reject(err));
    stream.on('end', () => resolve(balance));
  });
}

// Endpoint cek saldo
app.get('/api/address/:address/balance', async (req, res) => {
  try {
    const address = req.params.address;
    const balance = await getBalance(address);
    res.json({ address, balance });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// Fungsi validasi transaksi
async function validateTransaction(tx) {
  if (!tx.inputs || !tx.outputs) {
    throw new Error('Transaksi harus memiliki inputs dan outputs');
  }

  // Validasi input UTXO dan signature
  for (const input of tx.inputs) {
    const utxoKey = `utxo_${input.txid}_${input.vout}`;
    const utxo = await db.get(utxoKey);
    if (!utxo) {
      throw new Error(`UTXO tidak ditemukan: ${utxoKey}`);
    }

    // Hash transaksi tanpa scriptSig (simplifikasi)
    const txCopy = JSON.parse(JSON.stringify(tx));
    txCopy.inputs.forEach(i => i.scriptSig = '');
    const txHash = doubleSha256(Buffer.from(JSON.stringify(txCopy))).toString('hex');

    if (!verifySignature(utxo.pubKey, txHash, input.scriptSig)) {
      throw new Error('Signature input tidak valid');
    }
  }

  // Hitung total input dan output
  let totalIn = 0;
  for (const input of tx.inputs) {
    const utxoKey = `utxo_${input.txid}_${input.vout}`;
    const utxo = await db.get(utxoKey);
    totalIn += utxo.amount;
  }

  let totalOut = 0;
  for (const output of tx.outputs) {
    if (!output.address || output.amount <= 0) {
      throw new Error('Output transaksi tidak valid');
    }
    totalOut += output.amount;
  }

  if (totalOut > totalIn) {
    throw new Error('Output melebihi input');
  }
}

// Endpoint broadcast transaksi
app.post('/api/tx/send', async (req, res) => {
  const tx = req.body;
  try {
    await validateTransaction(tx);

    // Hapus UTXO input
    for (const input of tx.inputs) {
      const utxoKey = `utxo_${input.txid}_${input.vout}`;
      await db.del(utxoKey);
    }

    // Simpan output sebagai UTXO baru
    for (let index = 0; index < tx.outputs.length; index++) {
      const output = tx.outputs[index];
      const utxoKey = `utxo_${tx.txid}_${index}`;
      await db.put(utxoKey, {
        address: output.address,
        amount: output.amount,
        pubKey: output.pubKey || ''
      });
    }

    // Simpan transaksi
    const txid = doubleSha256(Buffer.from(JSON.stringify(tx))).toString('hex');
    tx.txid = txid;
    await db.put(`tx_${txid}`, tx);

    res.json({ status: 'success', txid });
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`ZTC Node API running on http://localhost:${PORT}`);
});
