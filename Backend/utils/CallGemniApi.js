const fetch = require("node-fetch")
require("dotenv").config()

const GEMINI_API_KEY = process.env.GEMNI_API_KEY
const GEMINI_API_URL = process.env.GEMNI_API

async function callGeminiAPI(prompt) {
    console.log("Gemni api called");

    if (!GEMINI_API_KEY || !GEMINI_API_URL) {
        throw new Error("API key or URL not configured")
    }

    const response = await fetch(GEMINI_API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": GEMINI_API_KEY,
        },
        body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
        }),
    })

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }))
        throw new Error(`Gemini API error: ${JSON.stringify(errorData)}`)
    }

    const data = await response.json()
    console.log(data)
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || null
}

module.exports = { callGeminiAPI }
