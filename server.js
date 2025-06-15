const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());

// Routing modular
app.use('/api/tx', require('./routes/api/tx/send'));
app.use('/api/address', require('./routes/api/address/balance'));

// Root
app.get('/', (req, res) => {
  res.send('✅ Zuttocoin ZTC Node API aktif');
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 ZTC Node API running on http://localhost:${PORT}`);
});
