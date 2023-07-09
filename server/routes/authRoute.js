const express = require('express');
const router = express.Router();

//controllers
const authController = require('../app/http/controllers/authController');

router.post('/register', authController().register);
router.post('/login', authController().login);
router.delete('/logout', authController().logout);
router.post('/refresh-token', authController().refreshToken);

module.exports = router;