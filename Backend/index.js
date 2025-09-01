// // Import necessary modules
// const express = require('express');
// const cors = require('cors');
// const multer = require('multer');
// const { MongoClient } = require('mongodb');
// const { GridFSBucket } = require('mongodb');
// const { StudentUploadRouter } = require('./routes/StudentuploadPyq.routes');
// const { AdminUploadRouter } = require('./routes/AdminUpload.routes');
// require('dotenv').config();
// const { db } = require('./dbVerified');
// const { SearchRouter } = require('./routes/searchRouter.route');
// const { AdminSearchRouter } = require('./routes/AdminDownload.routes');
// const { LoginRouter } = require('./routes/Login.routes');
// const connectToDatabase = require('./dbVerified');
// const { AdminVerifyRouter } = require('./routes/AdminVerifyRouter.routes');

// // Create an Express application
// const app = express();
// const port = process.env.PORT || 3000;


// // Middleware setup
// app.use(cors(
//     { origin: ["https://princepyq.netlify.app","https://ankitpyq.netlify.app","https://mohitpyq.netlify.app", "http://localhost:3000", "http://localhost:5173", "http://localhost:3001", "http://localhost:5173/admin"] }
// )); // Enable Cross-Origin Resource Sharing
// app.use(express.json()); // Parse incoming JSON requests
// // app.use(cors(
// //     { origin: ["https://princepyq.netlify.app","https://ankitpyq.netlify.app","https://mohitpyq.netlify.app", "http://localhost:3000", "http://localhost:5173", "http://localhost:3001", "http://localhost:5173/admin"] }
// // )); // Enable Cross-Origin Resource Sharing
// // app.use(express.json()); // Parse incoming JSON requests

// // connectToDatabase;

// // Basic route for server status check
// app.get('/', (req, res) => {
//     res.send({
//         message: "Server is working!"
//     });
// });


// // Use routers for different functionalities
// app.use('/student', StudentUploadRouter); // Handle student-related routes
// app.use('/admindownload', AdminSearchRouter); // Handle admin search/download routes
// app.use('/adminupload', AdminUploadRouter); // Handle admin upload routes
// app.use('/search', SearchRouter); // Handle search routes
// app.use('/login', LoginRouter); // Handle login routes
// app.use('/adminverifydownload', AdminVerifyRouter);

// // Start the server
// app.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
// });


// =========================
// 📌 Imports
// =========================
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// MongoDB
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

// =========================
// 📌 Inputs & Config
// =========================

// Allowed frontend origins
const allowedOrigins = [
    "https://princepyq.netlify.app",
    "https://ankitpyq.netlify.app",
    "https://mohitpyq.netlify.app",
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:3001",
    "http://localhost:5173/admin"
];

// Server Port
const port = process.env.PORT || 3000;

// Admin credentials (from .env)
const ADMIN_EMAIL = process.env.email;
const ADMIN_PASSWORD = process.env.password;

// =========================
// 📌 App Initialization
// =========================
const app = express();

// =========================
// 📌 Middleware
// =========================
app.use(cors({ origin: allowedOrigins }));
app.use(express.json()); // Parse JSON requests

// =========================
// 📌 Routes
// =========================

// Health Check
app.get('/', (req, res) => {
    res.send({ message: "✅ Server is working!" });
});

// Student routes
app.use('/student', StudentUploadRouter);

// Admin routes
app.use('/adminupload', AdminUploadRouter);
app.use('/admindownload', AdminSearchRouter);
app.use('/adminverifydownload', AdminVerifyRouter);

// Search routes
app.use('/search', SearchRouter);

// Auth routes
app.use('/login', LoginRouter);

// =========================
// 📌 Server Start
// =========================
app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
    console.log(`✅ Allowed Origins:`, allowedOrigins);
    console.log(`✅ Admin Email: ${ADMIN_EMAIL ? "Loaded" : "Not Found in .env"}`);
});
