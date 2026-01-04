
import { GoogleGenAI } from "@google/genai";
import { ProductData, SimulationConfig, FrameOption } from "./types";

interface AIAnalysis {
    wallAvailable: boolean;
    wallCenter: { x: number, y: number }; // 0-1 coordinates
    scaleEstimate: number; // 0-1 width relative to image width
    lightingQuality: 'low' | 'medium' | 'high';
    shadowDirection: 'left' | 'right' | 'top' | 'none';
}

const renderCanvas = (
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

            if (!ctx) {
                reject("Canvas context not available");
                return;
            }

            // Draw Room
            ctx.drawImage(img, 0, 0);

            // Determine Position (AI or Default)
            let centerX = canvas.width / 2;
            let centerY = canvas.height / 2.2;
            let frameWidthRatio = 0.3; // Default 30% width

            if (analysis && analysis.wallAvailable) {
                // Use AI suggestions with sanity checks
                if (analysis.wallCenter.x > 0.1 && analysis.wallCenter.x < 0.9) {
                    centerX = canvas.width * analysis.wallCenter.x;
                }
                if (analysis.wallCenter.y > 0.1 && analysis.wallCenter.y < 0.9) {
                    centerY = canvas.height * analysis.wallCenter.y;
                }
                if (analysis.scaleEstimate > 0.1 && analysis.scaleEstimate < 0.9) {
                    // Blend AI estimate with config size hint
                    frameWidthRatio = analysis.scaleEstimate;
                }
            }

            // Adjust scale based on user selection config (refining AI guess)
            if (config.size.includes('175')) frameWidthRatio = Math.max(frameWidthRatio, 0.45);
            else if (config.size.includes('55')) frameWidthRatio = Math.min(frameWidthRatio, 0.25);

            const frameWidth = canvas.width * frameWidthRatio;
            const frameHeight = frameWidth * (config.size.includes('40x20') ? 0.5 :
                config.size.includes('x' + frameWidth) ? 1.5 : 1.4);

            const x = centerX - frameWidth / 2;
            const y = centerY - frameHeight / 2;

            // Draw Shadow (AI Direction)
            ctx.shadowColor = "rgba(0,0,0,0.6)";
            ctx.shadowBlur = 40;
            let sX = 15, sY = 25;

            if (analysis?.shadowDirection === 'left') sX = -15;
            if (analysis?.shadowDirection === 'top') sY = -15;

            ctx.shadowOffsetX = sX;
            ctx.shadowOffsetY = sY;

            // Draw Frame
            const selectedFrame = product.frameOptions.find(f => f.frameId === config.selectedFrameId);
            const isFloating = selectedFrame?.category === 'none';
            const frameColor = selectedFrame?.id.includes('gold') ? '#C5A059' :
                selectedFrame?.id.includes('wood') ? '#8B5A2B' :
                    selectedFrame?.id.includes('white') ? '#FDFCFB' : '#1A1A1A';

            if (!isFloating) {
                ctx.fillStyle = frameColor;
                ctx.fillRect(x, y, frameWidth, frameHeight);
            }

            // Draw Artwork
            const artImg = new Image();
            artImg.crossOrigin = "anonymous";
            artImg.onload = () => {
                try {
                    const border = isFloating ? 0 : frameWidth * 0.05;
                    ctx.shadowColor = "transparent";
                    ctx.drawImage(artImg, x + border, y + border, frameWidth - (border * 2), frameHeight - (border * 2));

                    // Glass Effect
                    if (config.glass) {
                        const gradient = ctx.createLinearGradient(x, y, x + frameWidth, y + frameHeight);
                        gradient.addColorStop(0, "rgba(255,255,255,0.15)");
                        gradient.addColorStop(0.4, "rgba(255,255,255,0)");
                        gradient.addColorStop(0.6, "rgba(255,255,255,0)");
                        gradient.addColorStop(1, "rgba(255,255,255,0.1)");
                        ctx.fillStyle = gradient;
                        ctx.fillRect(x + border, y + border, frameWidth - (border * 2), frameHeight - (border * 2));
                    }

                    // Add Nano Banana Watermark (if AI was used)
                    if (analysis) {
                        ctx.font = "bold 12px sans-serif";
                        ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
                        ctx.textAlign = "right";
                        ctx.fillText("✨ Enhanced by Nano Banana AI", canvas.width - 20, canvas.height - 20);
                    }

                    resolve(canvas.toDataURL('image/jpeg', 0.9));
                } catch (e) {
                    console.error("Canvas export failed (likely CORS):", e);
                    resolve(config.roomImage!);
                }
            };
            artImg.onerror = () => {
                // Fallback if art fails
                resolve(config.roomImage!);
            };
            artImg.src = product.productImageUrl;
        };
        img.onerror = () => reject("Failed to load room image");
        img.src = config.roomImage!;
    });
};

export const generateSimulation = async (
    product: ProductData,
    config: SimulationConfig
): Promise<string> => {

    // 1. Check Key
    const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
    if (!apiKey) {
        console.warn("API Key missing. Using standard layout engine.");
        return renderCanvas(product, config);
    }

    try {
        const ai = new GoogleGenAI({ apiKey });

        // 2. Prepare for Analysis
        const roomPart = {
            inlineData: {
                mimeType: "image/jpeg",
                data: config.roomImage!.split(',')[1],
            },
        };

        // 3. Ask Nano Banana for Coordinates (JSON)
        // We use gemini-1.5-flash which is fast and supports JSON schema often (or loose JSON).
        const prompt = `
            You are Nano Banana, an expert interior design AI. 
            Analyze this room image to place a wall art frame.
            
            Return ONLY a valid JSON object with this exact structure:
            {
                "wallAvailable": boolean, // Is there a good empty wall space?
                "wallCenter": { "x": number, "y": number }, // 0.0 to 1.0 coordinates of the best center point for the art
                "scaleEstimate": number, // 0.1 to 0.8 estimate of how wide the frame should be relative to image width
                "shadowDirection": "left" | "right" | "top" | "none" // estimated light direction
            }
            Do not include markdown formatting. Just the JSON.
        `;

        const response = await ai.models.generateContent({
            model: "gemini-1.5-flash",
            contents: { parts: [roomPart, { text: prompt }] }
        });

        const text = response.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
        console.log("Nano Banana Analysis:", text);

        // 4. Parse JSON
        let analysis: AIAnalysis | undefined;
        try {
            // Clean up markdown if present
            const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
            analysis = JSON.parse(jsonStr);
        } catch (e) {
            console.warn("Failed to parse Nano Banana JSON, using standard engine.", e);
        }

        // 5. Render with AI Data
        return renderCanvas(product, config, analysis);

    } catch (error) {
        console.error("Nano Banana AI failed (network/quota), switching to standard engine:", error);
        return renderCanvas(product, config);
    }
};
