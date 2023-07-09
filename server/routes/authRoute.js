const express = require('express');
const router = express.Router();

//controllers
const authController = require('../app/http/controllers/authController');

router.post('/register', authController().register);
router.post('/login', authController().login);
router.post('/logout', authController().logout);

module.exports = router;