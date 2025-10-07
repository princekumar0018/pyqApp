const pdf = require("pdf-parse");
const Tesseract = require("tesseract.js");
const poppler = require("pdf-poppler");
const fs = require("fs");
const path = require("path");
const os = require("os");

const extractText = async (buffer) => {
  try {
    // First, try extracting text directly (for text-based PDFs)
    const data = await pdf(buffer);

    // if (data.text && data.text.trim().length > 50) {
    //   console.log("✅ Extracted text without OCR");
    //   return data.text.replace(/\s+/g, " ").trim();
    // }

    console.log("📸 Performing OCR (Tesseract)...");

    // Write buffer to a temporary file
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "pdf-ocr-"));
    const tempPdf = path.join(tempDir, "input.pdf");
    fs.writeFileSync(tempPdf, buffer);

    // Convert PDF to images
    const options = {
      format: "png",
      out_dir: tempDir,
      out_prefix: "page",
      page: null, // all pages
    };
    await poppler.convert(tempPdf, options);

    // OCR each image and combine text
    const imageFiles = fs.readdirSync(tempDir).filter((f) => f.endsWith(".png"));
    let fullText = "";

    for (const img of imageFiles) {
      const imgPath = path.join(tempDir, img);
      console.log(`🔠 OCR on: ${img}`);
      const { data: { text } } = await Tesseract.recognize(imgPath, "eng");
      fullText += text + "\n";
      console.log(fullText)
    }

    // Cleanup temporary files
    fs.rmSync(tempDir, { recursive: true, force: true });

    return fullText.replace(/\s+/g, " ").trim();
  } catch (err) {
    console.error("❌ Text extraction error:", err);
    throw new Error("Failed to extract text");
  }
};

module.exports = { extractText };
