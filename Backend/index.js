
const express = require('express');
const cors = require('cors');
require('dotenv').config();


const { MongoClient, GridFSBucket } = require('mongodb');

// Routers
const { StudentUploadRouter } = require('./routes/StudentuploadPyq.routes');
const { AdminUploadRouter } = require('./routes/AdminUpload.routes');
const { SearchRouter } = require('./routes/searchRouter.route');
const { AdminSearchRouter } = require('./routes/AdminDownload.routes');
const { LoginRouter } = require('./routes/Login.routes');
const { AdminVerifyRouter } = require('./routes/AdminVerifyRouter.routes');

// Database connection helper
const connectToDatabase = require('./config/dbVerified');
const { db } = require('./config/dbVerified');
const port = process.env.PORT || 3000;

const ADMIN_EMAIL = process.env.email;
const ADMIN_PASSWORD = process.env.password;
const app = express();


app.use(cors({ origin: "*" }));
app.use(express.json());




app.get('/', (req, res) => {
    res.send({ message: "✅ Server is working!" });
});


app.use('/student', StudentUploadRouter);


app.use('/adminupload', AdminUploadRouter);
app.use('/admindownload', AdminSearchRouter);
app.use('/adminverifydownload', AdminVerifyRouter);


app.use('/search', SearchRouter);


app.use('/login', LoginRouter);


app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
    console.log(`✅ Admin Email: ${ADMIN_EMAIL ? "Loaded" : "Not Found in .env"}`);
});
