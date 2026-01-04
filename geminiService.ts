
import { GoogleGenAI } from "@google/genai";
import { ProductData, SimulationConfig, FrameOption } from "./types";

const fallbackSimulation = (product: ProductData, config: SimulationConfig): Promise<string> => {
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

            // Mock placement logic (Center of image)
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2.2;

            // Approximate scale
            let scaleFactor = 0.3;
            if (config.size.includes('175')) scaleFactor = 0.5;
            else if (config.size.includes('145')) scaleFactor = 0.45;
            else if (config.size.includes('115')) scaleFactor = 0.4;
            else if (config.size.includes('85')) scaleFactor = 0.35;
            else if (config.size.includes('55')) scaleFactor = 0.25;
            else if (config.size.includes('40')) scaleFactor = 0.2;

            const frameWidth = canvas.width * scaleFactor;
            const frameHeight = frameWidth * (config.size.includes('40x20') ? 0.5 :
                config.size.includes('x' + frameWidth) ? 1.5 : 1.4);

            const x = centerX - frameWidth / 2;
            const y = centerY - frameHeight / 2;

            // Simple Shadow
            ctx.shadowColor = "rgba(0,0,0,0.5)";
            ctx.shadowBlur = 30;
            ctx.shadowOffsetX = 10;
            ctx.shadowOffsetY = 20;

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
                const border = isFloating ? 0 : frameWidth * 0.05;
                ctx.shadowColor = "transparent";
                ctx.drawImage(artImg, x + border, y + border, frameWidth - (border * 2), frameHeight - (border * 2));

                if (config.glass) {
                    const gradient = ctx.createLinearGradient(x, y, x + frameWidth, y + frameHeight);
                    gradient.addColorStop(0, "rgba(255,255,255,0.1)");
                    gradient.addColorStop(0.5, "rgba(255,255,255,0)");
                    gradient.addColorStop(1, "rgba(255,255,255,0.05)");
                    ctx.fillStyle = gradient;
                    ctx.fillRect(x + border, y + border, frameWidth - (border * 2), frameHeight - (border * 2));
                }

                resolve(canvas.toDataURL('image/jpeg', 0.9));
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
    try {
        const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
        // Even if API key is missing, we can use fallback. 
        // We throw to trigger catch block for seamless fallback.
        if (!apiKey) throw new Error("API Key missing (using fallback)");

        const ai = new GoogleGenAI({ apiKey });

        // Prepare parts
        const roomPart = {
            inlineData: {
                mimeType: "image/jpeg",
                data: config.roomImage!.split(',')[1],
            },
        };

        const selectedFrame = product.frameOptions.find(f => f.frameId === config.selectedFrameId);

        // This prompt helps ONLY if we had an image generation model.
        // Since we are likely restricted to 1.5-Flash (text only), we will intentionally likely fail to parse image.
        // But we keep the structure in case a model becomes available.
        const prompt = `Task: Describe placement of frame ${selectedFrame?.frameName} in this room.`;

        const response = await ai.models.generateContent({
            model: "gemini-1.5-flash",
            contents: { parts: [roomPart, { text: prompt }] }
        });

        // Check for inlineData (Images). 1.5-Flash won't return this usually.
        for (const part of response.candidates?.[0]?.content?.parts || []) {
            if (part.inlineData) {
                return `data:image/png;base64,${part.inlineData.data}`;
            }
        }

        // If we got here, no image was generated. Throw to use fallback.
        throw new Error("No image generated by AI model");

    } catch (error) {
        console.warn("Nano Banana AI unavailable, switching to local simulation engine:", error);
        return fallbackSimulation(product, config);
    }
};
