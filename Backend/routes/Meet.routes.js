const express = require("express");
const fetch = require("node-fetch"); // ✅ Import node-fetch
const meetRouter = express.Router();

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

module.exports = { meetRouter };
