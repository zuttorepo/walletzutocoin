const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());

// Routing
app.use('/api/address', require('./routes/api/address/balance'));
app.use('/api/tx', require('./routes/api/tx/send'));
app.use('/api/tx', require('./routes/api/tx/history'));
app.use('/api/wallet', require('./routes/api/wallet/encrypt'));
app.use('/api/wallet', require('./routes/api/wallet/decrypt'));

// Root
app.get('/', (req, res) => {
  res.send('✅ Zuttocoin ZTC Node API aktif');
});

// Jalankan server
app.listen(PORT, () => {
  console.log(`🚀 ZTC Node API running on http://localhost:${PORT}`);
});
