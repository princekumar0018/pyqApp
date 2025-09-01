const express = require('express');
const cors = require('cors');
const { getUnverifiedFiles } = require('../controllers/adminVerifyController.js');

const AdminVerifyRouter = express.Router();
AdminVerifyRouter.use(cors());

// Route to fetch unverified files
AdminVerifyRouter.post('/', getUnverifiedFiles);

module.exports = { AdminVerifyRouter };
