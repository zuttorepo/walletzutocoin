const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());

// Routing modular - Pastikan semua sudah dihubungkan dengan benar
app.use('/api/wallet', require('./routes/api/wallet/create'));
app.use('/api/wallet', require('./routes/api/wallet/import'));
app.use('/api/tx', require('./routes/api/tx/send'));
app.use('/api/tx', require('./routes/api/tx/history'));
app.use('/api/address', require('./routes/api/address/balance'));

// Root
app.get('/', (req, res) => {
  res.send('✅ Zuttocoin ZTC Node API aktif');
});

// Jalankan server
app.listen(PORT, () => {
  console.log(`🚀 ZTC Node API running on http://localhost:${PORT}`);
});
