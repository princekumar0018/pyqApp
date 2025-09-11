const express = require('express');
const cors = require('cors');
const { searchAndVerifyFile } = require('../controllers/adminSearchController.js');

const AdminSearchRouter = express.Router();
AdminSearchRouter.use(cors());


AdminSearchRouter.post('/search-files', searchAndVerifyFile);

module.exports = { AdminSearchRouter };
