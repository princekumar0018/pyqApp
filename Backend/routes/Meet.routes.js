const express = require('express');
const meetRouter = express.Router();
const multer = require("multer");
const authenticateToken = require('../utils/auth');



meetRouter.get('/meet', authenticateToken , );

module.exports = { meetRouter };