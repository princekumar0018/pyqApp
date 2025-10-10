const express = require("express");
const fetch = require("node-fetch"); // ✅ Import node-fetch
const meetRouter = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { liveSummary } = require("../controllers/meetController");


const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    },
});

const upload = multer({ storage });

meetRouter.post("/create-room", async (req, res) => {
	try {
		const response = await fetch("https://api.videosdk.live/v2/rooms", {
			method: "POST",
			headers: {
				authorization: process.env.VIDEOSDK_TOKEN,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({}), // Empty body as per original axios request
		});

		if (!response.ok) {
			throw new Error(`VideoSDK API error: ${response.statusText}`);
		}

		const data = await response.json();
		console.log(data)

		res.json({ roomId: data.roomId });
	} catch (error) {
		console.error("Error creating VideoSDK room:", error.message);
		res.status(500).json({ error: "Failed to create meeting room" });
	}
});


meetRouter.post("/live-summary", upload.single("audio"), liveSummary)


module.exports = { meetRouter };
