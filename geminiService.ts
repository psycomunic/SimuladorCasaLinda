import { GoogleGenAI } from "@google/genai";
import { ProductData, SimulationConfig } from "./types";

interface AIAnalysis {
    wallAvailable: boolean;
    wallCenter: { x: number, y: number };
    scaleEstimate: number;
    shadowDirection: 'left' | 'right' | 'top' | 'none';
    ambientHexColor?: string;
    brightness?: number;
}

// --- STEP 1: PRE-PROCESSING (COMPOSITING) ---
const createComposite = (
    product: ProductData,
    config: SimulationConfig,
    analysis?: AIAnalysis
): Promise<string> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if (!ctx) return reject("No Context");

            // Draw Room
            ctx.drawImage(img, 0, 0);

            // Calculate Geometry
            const { x, y, width, height } = calculateGeometry(canvas.width, canvas.height, config, analysis);

            // Draw Shadows (Nano Banana Pro)
            drawShadows(ctx, x, y, width, height, analysis);

            // Draw Frame
            drawFrame(ctx, x, y, width, height, product, config);

            // Draw Artwork
            const artImg = new Image();
            artImg.crossOrigin = "anonymous";
            artImg.onload = () => {
                drawArtwork(ctx, artImg, x, y, width, height, config, analysis);
                resolve(canvas.toDataURL('image/jpeg', 0.95));
            };
            artImg.onerror = () => {
                // Return room only if art fails
                resolve(config.roomImage!);
            };
            artImg.src = product.productImageUrl;
        };
        img.onerror = () => reject("Failed to load room");
        img.src = config.roomImage!;
    });
};

// --- STEP 1.5: MASK GENERATION ---
const createMask = (
    roomWidth: number,
    roomHeight: number,
    config: SimulationConfig,
    analysis?: AIAnalysis
): Promise<string> => {
    return new Promise((resolve) => {
        const canvas = document.createElement('canvas');
        canvas.width = roomWidth;
        canvas.height = roomHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve("");

        // Black Background
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, roomWidth, roomHeight);

        // White Rectangle (The Frame Area)
        const { x, y, width, height } = calculateGeometry(roomWidth, roomHeight, config, analysis);

        ctx.fillStyle = "#FFFFFF";
        // Make mask slightly larger to blend edges
        ctx.fillRect(x - 2, y - 2, width + 4, height + 4);

        resolve(canvas.toDataURL('image/png'));
    });
};

// --- HELPER: GEOMETRY CALCULATION ---
function calculateGeometry(cw: number, ch: number, config: SimulationConfig, analysis?: AIAnalysis) {
    let centerX = cw / 2;
    let centerY = ch / 2.5; // Default slightly high
    let frameWidthRatio = 0.3;

    // 1. Manual Override (Highest Priority)
    if (config.manualPosition) {
        centerX = cw * config.manualPosition.x;
        centerY = ch * config.manualPosition.y;
    }
    // 2. AI Analysis (Medium Priority)
    else if (analysis && analysis.wallAvailable) {
        if (analysis.wallCenter.x > 0.1 && analysis.wallCenter.x < 0.9) centerX = cw * analysis.wallCenter.x;
        if (analysis.wallCenter.y > 0.1 && analysis.wallCenter.y < 0.9) centerY = ch * analysis.wallCenter.y;
        if (analysis.scaleEstimate > 0.1 && analysis.scaleEstimate < 0.9) frameWidthRatio = analysis.scaleEstimate;
    }

    if (config.size.includes('175')) frameWidthRatio = Math.max(frameWidthRatio, 0.45);
    else if (config.size.includes('55')) frameWidthRatio = Math.min(frameWidthRatio, 0.25);

    const width = cw * frameWidthRatio;
    const height = width * (config.size.includes('40x20') ? 0.5 :
        config.size.includes('x' + width) ? 1.5 : 1.4);

    return {
        x: centerX - width / 2,
        y: centerY - height / 2,
        width,
        height
    };
}

// --- HELPER: DRAWING FUNCTIONS ---
function drawShadows(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, analysis?: AIAnalysis) {
    ctx.save();
    ctx.globalCompositeOperation = 'multiply';

    // Contact Shadow
    ctx.shadowColor = "rgba(0,0,0,0.85)";
    ctx.shadowBlur = w * 0.02;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = w * 0.01;
    ctx.fillStyle = "rgba(0,0,0,0.1)";
    ctx.fillRect(x + w * 0.01, y + w * 0.01, w * 0.98, h * 0.98);

    // Cast Shadow
    let sX = w * 0.05, sY = w * 0.08;
    if (analysis?.shadowDirection === 'left') sX = -sX;
    else if (analysis?.shadowDirection === 'top') sY = -sY;

    ctx.shadowColor = "rgba(0,0,0,0.5)";
    ctx.shadowBlur = w * 0.1;
    ctx.shadowOffsetX = sX;
    ctx.shadowOffsetY = sY;
    ctx.fillRect(x + w * 0.02, y + w * 0.02, w * 0.96, h * 0.96);
    ctx.restore();
}

function drawFrame(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, product: ProductData, config: SimulationConfig) {
    const selectedFrame = product.frameOptions.find(f => f.frameId === config.selectedFrameId);
    if (!selectedFrame || selectedFrame.category === 'none') return; // Floating

    const frameColor = selectedFrame.id.includes('gold') ? '#C5A059' :
        selectedFrame.id.includes('wood') ? '#8B5A2B' :
            selectedFrame.id.includes('white') ? '#FDFCFB' : '#1A1A1A';

    const grad = ctx.createLinearGradient(x, y, x + w, y + h);
    grad.addColorStop(0, frameColor);
    grad.addColorStop(1, shadeColor(frameColor, -25));

    ctx.fillStyle = grad;
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = "rgba(255,255,255,0.15)";
    ctx.strokeRect(x, y, w, h);
}

function drawArtwork(ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, w: number, h: number, config: SimulationConfig, analysis?: AIAnalysis) {
    const selectedFrame = config.frameCategory === 'none' ? null : 'frame';
    const border = selectedFrame ? w * 0.035 : 0;

    const artX = x + border;
    const artY = y + border;
    const artW = w - (border * 2);
    const artH = h - (border * 2);

    // Brightness Adjustment
    const isWhiteWall = analysis?.brightness && analysis.brightness > 0.8;
    const brightness = isWhiteWall ? 0.96 : 0.92;
    ctx.filter = `brightness(${brightness})`;
    ctx.drawImage(img, artX, artY, artW, artH);
    ctx.filter = "none";

    // Tone Mapping
    if (analysis?.ambientHexColor) {
        ctx.save();
        ctx.globalCompositeOperation = 'soft-light';
        ctx.fillStyle = analysis.ambientHexColor;
        ctx.globalAlpha = 0.35;
        ctx.fillRect(artX, artY, artW, artH);
        ctx.restore();
    }

    // Glass
    if (config.glass) {
        const grad = ctx.createLinearGradient(x, y, x + w, y + h * 1.5);
        grad.addColorStop(0, "rgba(255,255,255,0.2)");
        grad.addColorStop(0.5, "rgba(255,255,255,0)");
        grad.addColorStop(1, "rgba(255,255,255,0.1)");
        ctx.fillStyle = grad;
        ctx.fillRect(artX, artY, artW, artH);
    }
}

function shadeColor(color: string, percent: number) {
    let R = parseInt(color.substring(1, 3), 16);
    let G = parseInt(color.substring(3, 5), 16);
    let B = parseInt(color.substring(5, 7), 16);
    R = parseInt(String(R * (100 + percent) / 100));
    G = parseInt(String(G * (100 + percent) / 100));
    B = parseInt(String(B * (100 + percent) / 100));
    R = (R < 255) ? R : 255; G = (G < 255) ? G : 255; B = (B < 255) ? B : 255;
    const RR = ((R.toString(16).length == 1) ? "0" + R.toString(16) : R.toString(16));
    const GG = ((G.toString(16).length == 1) ? "0" + G.toString(16) : G.toString(16));
    const BB = ((B.toString(16).length == 1) ? "0" + B.toString(16) : B.toString(16));
    return "#" + RR + GG + BB;
}

// --- STEP 2 & 3: API PAYLOAD CONFIGURATION & ERROR HANDLING ---
const callNanoBananaInpainting = async (compositeBase64: string, maskBase64: string): Promise<string> => {
    // NOTE: This function simulates the call. Since we don't have the explicit URL/Key for the Inpainting service
    // (only Google GenAI for analysis), we will simulate the "Try" block and then fallback to the composite
    // as per the architect's instructions for robust error handling.

    // In a real scenario, this would be:
    // const response = await fetch('https://api.nano-banana.com/v1/inpainting', { ... });

    console.log("Configuring Nano Banana Payload...");
    console.log("Input Image:", compositeBase64.substring(0, 30) + "...");
    console.log("Mask Image:", maskBase64.substring(0, 30) + "...");
    console.log("Prompt:", "High quality interior design photo, realistic lighting, soft shadows creating depth behind the frame, 8k resolution, photorealistic.");
    console.log("Negative Prompt:", "deformed, blurry, floating objects, cartoon, text, watermark, bad perspective.");
    console.log("Denoising Strength:", 0.35);

    // Simulate API Unavailable / Error 500 handling
    try {
        // Mocking an error because we don't have the endpoint yet
        throw new Error("Nano Banana API Endpoint not configured (500)");
    } catch (e) {
        console.error("Nano Banana API Error:", e);
        // Step 4: Fallback to Composite
        return compositeBase64;
    }
};


// --- MAIN ORCHESTRATOR ---
export const generateSimulation = async (
    product: ProductData,
    config: SimulationConfig
): Promise<string> => {

    // 0. AI Analysis (Coordinates & Lighting) - Helper for Step 1
    let analysis: AIAnalysis | undefined;
    const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;

    if (apiKey && !config.manualPosition && config.roomImage) {
        try {
            const ai = new GoogleGenAI({ apiKey });
            const roomPart = { inlineData: { mimeType: "image/jpeg", data: config.roomImage.split(',')[1] } };
            const prompt = `
                Analyze room for wall art placement. Return JSON:
                { "wallAvailable": boolean, "wallCenter": { "x": number, "y": number }, 
                  "scaleEstimate": number, "shadowDirection": "left"|"right"|"top"|"none",
                  "ambientHexColor": string, "brightness": number }
            `;
            const resp = await ai.models.generateContent({ model: "gemini-1.5-flash", contents: { parts: [roomPart, { text: prompt }] } });
            const text = resp.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
            const start = text.indexOf('{'), end = text.lastIndexOf('}') + 1;
            if (start !== -1) analysis = JSON.parse(text.substring(start, end));
        } catch (e) { console.warn("AI Analysis failed, ignoring.", e); }
    }

    // 1. Create Composite (Input Image)
    const composite = await createComposite(product, config, analysis);

    // 2. Create Mask (Mask Image)
    const img = new Image();
    img.src = config.roomImage!;
    await new Promise(r => img.onload = r); // Wait to get dims
    const mask = await createMask(img.width, img.height, config, analysis);

    // 3. Call API (Inpainting)
    // This logs the precise payload as requested and handles errors
    return await callNanoBananaInpainting(composite, mask);
};
