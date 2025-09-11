const express = require('express');
const { loginUser } = require('../controllers/loginController.js');

const LoginRouter = express.Router();


LoginRouter.post('/', loginUser);

module.exports = { LoginRouter };
