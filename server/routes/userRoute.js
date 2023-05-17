const express = require('express');
const router = express.Router();

router.use('/', (req, res) => {
    res.send('users');
});

module.exports = router;