const { MongoClient, GridFSBucket } = require('mongodb');
require('dotenv').config();

const dbName = 'pyq';
const mongoURI = process.env.mongoURL;
const client = new MongoClient(mongoURI);

const connectToDatabase = require('../config/dbStudentUpload.js');

let gridFSBucket;

// Initialize GridFSBucket
async function initializeGridFSBucket() {
    const db = await connectToDatabase();
    gridFSBucket = new GridFSBucket(db);
}
initializeGridFSBucket();

// Controller function for searching and verifying files
const searchAndVerifyFile = async (req, res) => {
    try {
        const fileName = req.body.filename;
        console.log(fileName);

        if (!fileName) {
            return res.status(400).send('Filename is required.');
        }
        if (!gridFSBucket) {
            return res.status(500).send('GridFSBucket is not initialized.');
        }

        const collection = client.db(dbName).collection('fs.files');
        const collectionChunks = client.db(dbName).collection('fs.chunks');

        const docs = await collection.find({ filename: fileName }).toArray();
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
        chunks.forEach(chunk => fileData.push(chunk.data.buffer));

        const pdfData = Buffer.concat(fileData);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${file.filename}"`);
        res.send(pdfData);

        // Update verification status
        await collection.updateOne(
            { _id: file._id },
            { $set: { "metadata.verified": 1 } }
        );

        console.log(`File metadata.verified updated for file: ${fileName}`);
    } catch (error) {
        console.error('Error searching or sending files in MongoDB:', error);
        res.status(500).send('Error searching or sending files in MongoDB.');
    }
};

module.exports = { searchAndVerifyFile };
