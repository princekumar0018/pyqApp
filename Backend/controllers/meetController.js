const UserModel = require('../models/userModel');
const { callGeminiAPIAudio } = require('../utils/CallGemniApiAudio');
const { callGeminiAPI } = require('../utils/CallGemniApiPrompt');
require('dotenv').config();
const fs = require("fs");
const path = require("path");


const liveSummary = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No audio file uploaded" });
    }

    const filePath = req.file.path;
    const mimeType = req.file.mimetype || "audio/webm";

    const fileBuffer = fs.readFileSync(filePath);

    const audioBase64 = fileBuffer.toString("base64");

    const result = await callGeminiAPIAudio(audioBase64, mimeType);
    console.log(result)

    res.status(200).json({
        message: "Audio processed and deleted successfully",
        result: result
    });

    if (filePath && fs.existsSync(filePath)) {
        try {
            fs.unlinkSync(filePath);
            console.log("🗑️ Temporary file deleted:", filePath);
        } catch (err) {
            console.error("⚠️ Failed to delete temp file:", err);
        }
    }
}

module.exports = { liveSummary };