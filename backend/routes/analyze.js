const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const Tesseract = require("tesseract.js");
const { createCanvas, Image } = require("@napi-rs/canvas");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// OCR for images
async function extractImageText(filePath) {
  const result = await Tesseract.recognize(filePath, "eng");
  return result.data.text;
}

// OCR for PDFs (simple, safe, no pdf-parse)
async function extractPDFText(filePath) {
  const buffer = fs.readFileSync(filePath);
  const result = await Tesseract.recognize(buffer, "eng");
  return result.data.text;
}

router.post("/", upload.array("files"), async (req, res) => {
  try {
    let finalText = "";

    for (const file of req.files) {
      const ext = path.extname(file.originalname).toLowerCase();

      let text = "";

      if (ext === ".pdf") {
        text = await extractPDFText(file.path);   // FIXED
      } else {
        text = await extractImageText(file.path);
      }

      finalText += "\n" + text;

      fs.unlinkSync(file.path); // remove uploaded file
    }

    if (!finalText.trim()) finalText = "No text detected.";

    const analysis = await analyzeWithOpenAI(finalText);

    return res.json({
      success: true,
      extractedText: finalText,
      analysis
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "OCR failed", details: err.message });
  }
});

module.exports = router;
function defaultAnalysis(text) {
  return {
    sentiment: "Neutral",
    keywords: [],
    suggestions: [
      "Keep captions concise",
      "Include a call-to-action",
      "Add 3–5 relevant hashtags"
    ],
    hashtags: [],
    topics: [],
    language: "auto",
    entities: [],
    summary: text ? (text.slice(0, 200) + (text.length > 200 ? "…" : "")) : "",
  };
}

async function analyzeWithOpenAI(text) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey || !text?.trim()) return defaultAnalysis(text);

    const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

    const body = {
      model,
      messages: [
        {
          role: "system",
          content:
            "You are a social media content analyst. Return STRICT JSON only. Schema: {sentiment: string one of Positive/Neutral/Negative, keywords: string[], suggestions: string[], hashtags: string[], topics: string[], language: string, entities: {type:string, text:string}[], summary: string}. Keep hashtags short and popular; 5–10 max.",
        },
        {
          role: "user",
          content: `Analyze the following text and produce the JSON schema only. Text:\n\n${text}`,
        },
      ],
      temperature: 0.2,
    };

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      return defaultAnalysis(text);
    }

    const json = await res.json();
    const content = json?.choices?.[0]?.message?.content || "";
    try {
      const parsed = JSON.parse(content);
      return {
        ...defaultAnalysis(text),
        ...parsed,
      };
    } catch (e) {
      return defaultAnalysis(text);
    }
  } catch (e) {
    return defaultAnalysis(text);
  }
}
