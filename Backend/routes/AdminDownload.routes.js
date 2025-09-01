const express = require('express');
const cors = require('cors');
const { searchAndVerifyFile } = require('../controllers/adminSearchController.js');

const AdminSearchRouter = express.Router();
AdminSearchRouter.use(cors());

// Route for searching and verifying file
AdminSearchRouter.post('/search-files', searchAndVerifyFile);

module.exports = { AdminSearchRouter };
