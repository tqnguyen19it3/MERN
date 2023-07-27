const express = require('express');
const router = express.Router();

// Controllers
const authController = require('../app/http/controllers/authController');

// Middleware

// Router
router.post('/register', authController().register);
router.post('/login', authController().login);
router.delete('/logout', authController().logout);
router.post('/refresh-token', authController().refreshToken);
router.post('/google', authController().authGoogle);
router.post('/forgot-password', authController().forgotPassword);

module.exports = router;