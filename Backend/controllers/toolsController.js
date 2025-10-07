const UserModel = require("../models/userModel");
const { callGeminiAPI } = require("../utils/CallGemniApi");
const { extractText } = require("../utils/extractText");
const JSON5 = require("json5");

//
// ✅ Get all verified colleges
//
const allVerifiedColleges = async (req, res) => {
    try {
        const colleges = await UserModel.find({ verified: true }).select("name email");
        const idx = colleges.findIndex((u) => u.email === process.env.SUPER_ADMIN);
        if (idx !== -1) colleges.splice(idx, 1);

        return res.send({
            success: true,
            status: 200,
            value: colleges,
        });
    } catch (error) {
        console.error("❌ allVerifiedColleges error:", error);
        return res.status(500).send({ success: false, message: "Server error" });
    }
};

//
// ✅ Get all colleges
//
const allColleges = async (req, res) => {
    try {
        const colleges = await UserModel.find().select("name email verified createdAt");

        const idx = colleges.findIndex((u) => u.email === process.env.SUPER_ADMIN);
        if (idx !== -1) colleges.splice(idx, 1);

        return res.status(200).send({
            success: true,
            value: colleges,
        });
    } catch (error) {
        console.error("❌ allColleges error:", error);
        return res.status(500).send({ success: false, message: "Server error" });
    }
};

//
// 🧠 Evaluate a paper (delegates text + AI processing to services)
//
const evaluatePaper = async (req, res) => {
    try {
        const modelFile = req.files?.["model"]?.[0];
        const studentFile = req.files?.["student"]?.[0];

        if (!modelFile || !studentFile) {
            return res.status(400).json({ error: "Please upload both files" });
        }

        console.log("object");
        const modelText = await extractText(modelFile.buffer);
        const studentText = await extractText(studentFile.buffer);

        // 🧠 Step 2. Build a structured evaluation prompt
        const prompt = `
You are an intelligent exam evaluator.
Compare the student's answer to the model answer below.
Think step by step and explain your reasoning.

MODEL ANSWER:
${modelText}

STUDENT ANSWER:
${studentText}

Return JSON:
{
  "marks": <0-10>/outOf,
  "reasoning": ["step1...", "step2...", "final decision...","marks Of This Question..."]
}
 make it a little small like 3 lines of reasoning for each question and marks of each question and dont give exclaimer in the start`
            ;

        const result = await callGeminiAPI(prompt);

        let cleanText = result.replace(/```json|```/g, "").trim();

        // Try to extract only the JSON part
        const jsonMatch = cleanText.match(/\{[\s\S]*\}/); // anything between first and last curly brace
        let parsedSummary;

        try {
            if (jsonMatch) {
                // ✅ Use JSON5 instead of JSON for forgiving parsing
                parsedSummary = JSON5.parse(jsonMatch[0]);
            } else {
                throw new Error("No valid JSON found in response");
            }
        } catch (error) {
            console.error("❌ JSON parsing failed:", error.message);
            // return res.status(500).json({
            //     error: "Invalid JSON format from model",
            //     rawResponse: cleanText,
            // });
        return res.json({ result: result });

        }

        // ✅ Return parsed data safely
        return res.json({ result: parsedSummary });

        // const result = await callGeminiAPI(prompt);

        // let cleanText = result.replace(/```json|```/g, "").trim();

        // // Try to extract only the JSON part
        // const jsonMatch = cleanText.match(/\{[\s\S]*\}/); // anything between the first and last curly brace
        // let parsedSummary;

        // try {
        //     if (jsonMatch) {
        //         parsedSummary = JSON.parse(jsonMatch[0]);
        //     } else {
        //         throw new Error("No valid JSON found in response");
        //     }
        // } catch (error) {
        //     console.error("❌ JSON parsing failed:", error.message);
        //     return res.status(500).json({
        //         error: "Invalid JSON format from model",
        //         rawResponse: cleanText,
        //     });
        // }

        // return res.json({ result: parsedSummary });

    } catch (error) {
        console.error("❌ evaluatePaper error:", error);
        return res.status(500).json({ error: "Failed to evaluate paper" });
    }
};

module.exports = { evaluatePaper, allColleges, allVerifiedColleges };