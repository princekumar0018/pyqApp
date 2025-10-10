const fetch = require("node-fetch");
require("dotenv").config();

const GEMINI_API_KEY = process.env.GEMNI_API_KEY;
const GEMINI_API_URL = process.env.GEMNI_API;

async function callGeminiAPIAudio(audioBase64, mimeType) {
    console.log("Gemini API called on audio base64 ->", audioBase64);
    // return "Hit succesful lkjhbnj";

    if (!GEMINI_API_KEY || !GEMINI_API_URL) {
        clg(GEMINI_API_KEY, GEMINI_API_URL)
        throw new Error("API key or URL not configured");
    }

    const response = await fetch(GEMINI_API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": GEMINI_API_KEY,
        },
        body: JSON.stringify({
            contents: [
                {
                    parts: [
                        {
                            text: `You are an AI teaching assistant. 
Listen to this short audio clip from a live class and summarize it in 2–3 sentences. 
Do not transcribe it word-for-word — give a clean summary of what was said.and dont give disclaimers also if audio is empty return null directly`,
                        },
                        {
                            inlineData: {
                                mimeType,
                                data: audioBase64,
                            },
                        },
                    ],
                },
            ],
        }),
    });

    // if (!response.ok) {
    //     const errorData = await response.json().catch(() => ({ message: response.statusText }));
    //     throw new Error(`Gemini API error: ${JSON.stringify(errorData)}`);
    // }

    const data = await response.json();
    console.log("Gemini API response:", data);

    return data?.candidates?.[0]?.content?.parts?.[0]?.text || null;
}

module.exports = { callGeminiAPIAudio };
