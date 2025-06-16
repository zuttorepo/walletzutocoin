const express = require('express');
const router = express.Router();

router.use('/address', require('./address'));
router.use('/tx', require('./tx')); // kalau ada tx.js
// Tambahkan routes lain sesuai kebutuhan

module.exports = router;
