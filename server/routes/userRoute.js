const express = require('express');
const router = express.Router();

// Router
router.use('/', (req, res) => {
    res.send('users page');
});

module.exports = router;