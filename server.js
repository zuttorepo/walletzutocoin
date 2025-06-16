const express = require('express'); 
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());

// Modular Routing
app.use('/api/wallet/create', require('./routes/api/wallet/create'));
app.use('/api/wallet/import', require('./routes/api/wallet/import'));
app.use('/api/wallet/encrypt', require('./routes/api/wallet/encrypt'));
app.use('/api/wallet/decrypt', require('./routes/api/wallet/decrypt'));

app.use('/api/tx/send', require('./routes/api/tx/send'));
app.use('/api/tx/history', require('./routes/api/tx/history'));

app.use('/api/address/balance', require('./routes/api/address/balance'));
app.use('/api/address/utxos', require('./routes/api/address/utxos')); // opsional untuk sinkronisasi device

// Root
app.get('/', (req, res) => {
  res.send('✅ Zuttocoin ZTC Node API aktif');
});

// Jalankan server
app.listen(PORT, () => {
  console.log(`🚀 ZTC Node API running on http://localhost:${PORT}`);
});
