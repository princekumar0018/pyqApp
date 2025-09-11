const express = require('express');
const cors = require('cors');
const { getUnverifiedFiles } = require('../controllers/adminVerifyController.js');

const AdminVerifyRouter = express.Router();
AdminVerifyRouter.use(cors());


AdminVerifyRouter.post('/', getUnverifiedFiles);

module.exports = { AdminVerifyRouter };
