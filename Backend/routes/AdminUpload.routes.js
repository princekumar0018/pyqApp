const express = require('express');
const { uploadFile, upload } = require('../controllers/adminUploadController.js');

const AdminUploadRouter = express.Router();

// Route for file upload
AdminUploadRouter.post('/upload-files', upload.single('file'), uploadFile);

module.exports = { AdminUploadRouter };
