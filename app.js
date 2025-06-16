const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const walletRoutes = require('./routes/api/wallet');
const balanceRoutes = require('./routes/api/address/balance');
const sendRoutes = require('./routes/api/tx/send');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(morgan('dev'));

// Routes
app.use('/api/wallet', walletRoutes);
app.use('/api/address', balanceRoutes);
app.use('/api/tx', sendRoutes);

// Root
app.get('/', (req, res) => {
  res.send('✅ Zuttocoin ZTC Node API aktif');
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 ZTC Node API running on http://localhost:${PORT}`);
});
