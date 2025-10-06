const express = require('express');
const { login,register } = require('../controllers/userController.js');

const userRouter = express.Router();

userRouter.post('/login', login);
userRouter.post('/register', register);

module.exports = { userRouter };
