const fetch = require("node-fetch");
const FormData = require("form-data");

async function extractText(buffer) {
  try {
    const formData = new FormData();
    formData.append("file", buffer, "file.pdf");
    formData.append("apikey", process.env.OCR_API_KEY);

    const response = await fetch("https://api.ocr.space/parse/image", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (!result.ParsedResults || !result.ParsedResults[0]) {
      throw new Error("OCR API returned no results");
    }

    const ocrText = result.ParsedResults[0].ParsedText?.replace(/\s+/g, " ").trim();
    console.log("✅ Extracted text via OCR API", ocrText);

    return ocrText || "";
  } catch (err) {
    console.error("❌ OCR API error:", err);
    throw new Error("Failed to extract text");
  }
}

module.exports = { extractText };
