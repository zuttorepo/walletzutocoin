const express = require('express');
const router = express.Router();

router.use('/address', require('./address/balance'));
router.use('/tx/send', require('./tx/send'));
router.use('/tx/create', require('./tx/create'));
router.use('/tx/sign', require('./tx/sign'));

module.exports = router;
