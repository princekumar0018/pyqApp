const multer = require('multer');
const { GridFSBucket } = require('mongodb');
require('dotenv').config();

const connectToDatabase = require('../config/dbVerified.js');

// Configure Multer for in-memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// GridFSBucket instance
let gridFSBucket;

// Initialize GridFSBucket
async function initializeGridFSBucket() {
    const db = await connectToDatabase();
    gridFSBucket = new GridFSBucket(db);
}
initializeGridFSBucket();

// Controller function for uploading files
const uploadFile = async (req, res) => {
    try {
        const file = req.file;
        const fname = req.body.filename;

        if (!file) {
            return res.status(400).send('No file uploaded.');
        }

        if (!gridFSBucket) {
            return res.status(500).send('GridFSBucket is not initialized.');
        }

        const uploadStream = gridFSBucket.openUploadStream(fname);
        uploadStream.write(file.buffer);
        uploadStream.end();

        uploadStream.on('finish', () => {
            res.send('File uploaded successfully to MongoDB.');
        });

    } catch (error) {
        console.error('Error uploading file to MongoDB:', error);
        res.status(500).send('Error uploading file to MongoDB.');
    }
};

module.exports = { uploadFile, upload };
