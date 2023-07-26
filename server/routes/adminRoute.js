const express = require('express');
const router = express.Router();

// Controllers
const userController = require('../app/http/controllers/userController');

// Middleware
const auth = require('../app/http/middlewares/auth');

// Router
router.post('/user/create-user', [auth.isAuthentication, auth.isAdmin], userController().createUser);
router.delete('/user/soft-delete-user/:userID', [auth.isAuthentication, auth.isAdmin], userController().softDeleteUser);
router.get('/user/trash-user', [auth.isAuthentication, auth.isAdmin], userController().trashUser);
router.patch('/user/restore-user/:userID', [auth.isAuthentication, auth.isAdmin], userController().restoreUser);
router.delete('/user/destroy-user/:userID', [auth.isAuthentication, auth.isAdmin], userController().destroyUser);
router.use('/user', [auth.isAuthentication, auth.isAdmin], userController().getListUser);

module.exports = router;