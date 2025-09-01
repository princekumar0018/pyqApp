const { MongoClient, GridFSBucket } = require('mongodb');
require('dotenv').config();

const dbName = 'realPyq';
const connectToDatabase = require('../config/dbVerified.js');

const mongoURI = process.env.mongoURL;
const client = new MongoClient(mongoURI);

let gridFSBucket;

// Initialize GridFSBucket
async function initializeGridFSBucket() {
    const db = await connectToDatabase();
    gridFSBucket = new GridFSBucket(db);
}
initializeGridFSBucket();

// Controller function for searching files
const searchFiles = async (req, res) => {
    try {
        const fileName = req.body.filename;
        if (!fileName) {
            return res.status(400).send('Filename is required.');
        }

        if (!gridFSBucket) {
            return res.status(500).send('GridFSBucket is not initialized.');
        }

        const collection = client.db(dbName).collection('fs.files');
        const collectionChunks = client.db(dbName).collection('fs.chunks');

        const cursor = await collection.find({ filename: fileName });
        const docs = await cursor.toArray();

        if (docs.length === 0) {
            return res.status(404).send('No file found');
        }

        const file = docs[0];
        const chunks = await collectionChunks
            .find({ files_id: file._id })
            .sort({ n: 1 })
            .toArray();

        if (!chunks || chunks.length === 0) {
            return res.status(404).send('No data found');
        }

        let fileData = [];
        chunks.forEach(chunk => {
            fileData.push(chunk.data.buffer);
        });

        const pdfData = Buffer.concat(fileData);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${file.filename}"`);
        res.send(pdfData);

    } catch (error) {
        console.error('Error searching or sending files in MongoDB:', error);
        res.status(500).send('Error searching or sending files in MongoDB.');
    }
};

module.exports = { searchFiles };
