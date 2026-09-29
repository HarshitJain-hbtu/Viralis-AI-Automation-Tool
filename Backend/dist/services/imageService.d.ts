/**
 * AI Image Generation Service
 * Generates platform-appropriate images using Pollinations AI (Flux engine)
 * Supports dynamic aspect ratios: 1:1 (Square), 9:16 (Vertical Reels/Shorts), 16:9 (YouTube Landscape)
 */
export interface ImageGenerationOptions {
    prompt: string;
    platform: string;
    seed?: number;
}
export declare function generateImageUrl(options: ImageGenerationOptions): string;
//# sourceMappingURL=imageService.d.ts.map