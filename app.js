// app.js

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const walletRoutes = require('./routes/api/wallet');
const balanceRoutes = require('./routes/api/balance');
const sendRoutes = require('./routes/api/send');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/wallet', walletRoutes);
app.use('/api', balanceRoutes); // misal: GET /api/:address/balance
app.use('/api/send', sendRoutes); // misal: POST /api/send

// Root Endpoint
app.get('/', (req, res) => {
  res.send('Zuttocoin Wallet API is running...');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

