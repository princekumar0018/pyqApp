const express = require('express');
const { loginUser } = require('../controllers/loginController.js');

const LoginRouter = express.Router();

// Login route
LoginRouter.post('/', loginUser);

module.exports = { LoginRouter };
