const express = require('express');
const { uploadFile, upload } = require('../controllers/studentUploadController.js');

const StudentUploadRouter = express.Router();

// Route to upload files
StudentUploadRouter.post("/upload-files", upload.single("file"), uploadFile);

module.exports = { StudentUploadRouter };
