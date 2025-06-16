const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Routes
app.use('/api', require('./routes/api'));  // Akan memuat index.js dari ./routes/api/

// Root
app.get('/', (req, res) => {
  res.send('Zuttocoin API backend is running.');
});

// Start server
app.listen(PORT, () => {
  console.log(`Zuttocoin API server running on port ${PORT}`);
});
