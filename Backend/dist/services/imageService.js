"use strict";
/**
 * AI Image Generation Service
 * Generates platform-appropriate images using Pollinations AI (Flux engine)
 * Supports dynamic aspect ratios: 1:1 (Square), 9:16 (Vertical Reels/Shorts), 16:9 (YouTube Landscape)
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateImageUrl = generateImageUrl;
function generateImageUrl(options) {
    const { prompt, platform, seed } = options;
    const currentSeed = seed ?? Math.floor(Math.random() * 1000000);
    const lowerPlatform = (platform || '').toLowerCase();
    let width = 1024;
    let height = 1024;
    if (lowerPlatform.includes('reel') || lowerPlatform.includes('short')) {
        // 9:16 vertical for Instagram Reels and YouTube Shorts
        width = 576;
        height = 1024;
    }
    else if (lowerPlatform.includes('youtube video')) {
        // 16:9 landscape for YouTube Long-form Videos
        width = 1024;
        height = 576;
    }
    else if (lowerPlatform.includes('linkedin')) {
        // 1200x628 or 1024x1024 for LinkedIn
        width = 1024;
        height = 1024;
    }
    else {
        // 1:1 square for Instagram Post and Facebook
        width = 1024;
        height = 1024;
    }
    // Enhance prompt for maximum visual quality and realism
    const enhancedPrompt = `${prompt}, commercial advertising photography, studio lighting, hyper-realistic, 8k, sharp focus, vibrant colors, professional grade`;
    const encoded = encodeURIComponent(enhancedPrompt);
    return `https://image.pollinations.ai/prompt/${encoded}?width=${width}&height=${height}&model=flux&nologo=true&seed=${currentSeed}`;
}
//# sourceMappingURL=imageService.js.map