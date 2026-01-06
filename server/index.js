require('dotenv').config({ path: '../.env' }); // Load from root .env
const express = require('express');
const cors = require('cors');
const { GoogleGenAI } = require('@google/genai');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Allow large image payloads

// Routes

// 1. Health Check
app.get('/api/nanobanana/health', (req, res) => {
    res.json({ status: 'ok', message: 'Nano Banana Backend Online 🍌' });
});

// 2. Generate (Analyze)
app.post('/api/nanobanana/generate', async (req, res) => {
    console.log("🍌 [POST] /generate called");

    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
        console.error("❌ GOOGLE_API_KEY missing in .env");
        return res.status(500).json({ error: "Server misconfigured: Missing API Key" });
    }

    try {
        const { roomImage } = req.body;
        if (!roomImage) {
            return res.status(400).json({ error: "Missing roomImage" });
        }

        console.log("Analyzing image with Gemini...");
        const ai = new GoogleGenAI({ apiKey });

        // Remove base64 header if present
        const base64Data = roomImage.includes('base64,') ? roomImage.split('base64,')[1] : roomImage;

        const roomPart = {
            inlineData: {
                mimeType: "image/jpeg",
                data: base64Data,
            },
        };

        const prompt = `
            Analyze this room image for the most realistic wall art placement.
            
            ARCHITECTURAL INTELLIGENCE - CRITICAL RULES:
            1. **Detect Wall Divisions**: Look for wainscoting, half-painted walls, or huge headboards that cover half the wall.
            2. **Zone Selection**: Choose ONE distinct vertical zone for the art. 
               - If there is a high paneled headboard (dark) and a white wall above, place the art FULLY on the white wall above (centered vertically in that empty space).
               - Do NOT bridge the gap between two different colors/textures. It looks fake.
            3. **Furniture Context**: Center the art relative to the main furniture below it (e.g., bed, sofa), not necessarily the center of the photo.
            
            lighting:
            - Analyze the lighting color ON THE CHOSEN WALL ZONE (warm/cool). 

            Return ONLY a valid JSON object with this exact structure:
            {
                "wallAvailable": boolean,
                "wallCenter": { "x": number, "y": number }, // 0.0-1.0 coords of the CENTER of the sweet spot
                "scaleEstimate": number, // 0.1-0.9 width relative to image. Keep it realistic (not too huge).
                "shadowDirection": "left" | "right" | "top" | "none", // Look at the shadows of lamps/legs to guess.
                "ambientHexColor": string, // The average color of the light hitting the wall.
                "brightness": number
            }
            Do not include markdown formatting. Just the JSON.
        `;

        const response = await ai.models.generateContent({
            model: "gemini-1.5-flash",
            contents: { parts: [roomPart, { text: prompt }] }
        });

        const text = response.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
        console.log("Gemini Raw Response:", text);

        // Robust JSON extraction
        const start = text.indexOf('{');
        const end = text.lastIndexOf('}') + 1;
        let analysis = {};

        if (start !== -1 && end !== -1) {
            const jsonStr = text.substring(start, end);
            analysis = JSON.parse(jsonStr);
        }

        console.log("✅ Analysis Success:", analysis);
        res.json(analysis);

    } catch (error) {
        console.error("❌ Gemini API Error:", error);
        res.status(500).json({ error: "AI Generation Failed", details: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`🍌 Nano Banana Server running on http://localhost:${PORT}`);
    console.log(`🔑 API Key Configured: ${process.env.GOOGLE_API_KEY ? 'YES' : 'NO'}`);
});
