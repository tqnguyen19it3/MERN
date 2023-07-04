const express = require('express');
const router = express.Router();

//controllers
const userController = require('../app/http/controllers/userController');

router.use('/user', userController().getListUser);

module.exports = router;