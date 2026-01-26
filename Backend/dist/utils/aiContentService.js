"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate30DayCalendar = generate30DayCalendar;
exports.generateDailyContent = generateDailyContent;
const generative_ai_1 = require("@google/generative-ai");
const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_API_KEY);
async function generate30DayCalendar(params) {
    const { niche, city, platform, description = '', brand = { name: 'Your Brand' } } = params;
    const brandInfo = `Brand: "${brand.name}", Logo: ${brand.logo_url || 'add in bottom-right'}, Colors: ${brand.colors?.join(', ') || 'warm tones'}`;
    const prompt = `
Generate 30-day Instagram content calendar for ${niche} in ${city}.

Business description: ${description}
${brandInfo}

REQUIREMENTS:
- 30 UNIQUE posts (no repetition)
- Hyper-local to ${city} (monsoon, festivals, local landmarks)
- Platform-optimized for ${platform}
- Each post must be scroll-stopping, emotionally engaging
- visual_prompt: PERFECT for gemini-2.5-flash-image API:
  * photorealistic Instagram post card
  * 16:9 aspect ratio  
  * brand logo bottom-right, brand colors
  * text "${brand.name}, ${city}" integrated
  * trending aesthetic, warm lighting, professional

Return EXACTLY this JSON array format (no extra text):

[
  {
    "day": 1,
    "hook": "short scroll-stopping line",
    "caption": "full Hinglish caption (120 chars)",
    "hashtags": ["8-12 hashtags"],
    "visual_prompt": "detailed image prompt for gemini-2.5-flash-image"
  },
  // ... 30 total
]
`;
    const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash'
    });
    const result = await model.generateContent(prompt);
    return JSON.parse(await result.response.text());
}
async function generateDailyContent(params) {
    const { niche, city, platform, description = '', brand = { name: 'Your Brand' } } = params;
    const brandInfo = `Brand: "${brand.name}", Logo: ${brand.logo_url || 'add in bottom-right'}, Colors: ${brand.colors?.join(', ') || 'warm tones'}`;
    const prompt = `
Generate a single social media post for ${niche} in ${city}.

Business description: ${description}
${brandInfo}

REQUIREMENTS:
- Hyper-local to ${city} (current events, local references)
- Platform-optimized for ${platform}
- Scroll-stopping and emotionally engaging
- visual_prompt: PERFECT for gemini-2.5-flash-image API:
  * photorealistic Instagram post card
  * 16:9 aspect ratio  
  * brand logo bottom-right, brand colors
  * text "${brand.name}, ${city}" integrated
  * trending aesthetic, warm lighting, professional

Return EXACTLY this JSON format (no extra text):

{
  "hook": "short scroll-stopping line",
  "caption": "full Hinglish caption (120 chars)",
  "hashtags": ["8-12 hashtags"],
  "visual_prompt": "detailed image prompt for gemini-2.5-flash-image"
}
`;
    const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash'
    });
    const result = await model.generateContent(prompt);
    return JSON.parse(await result.response.text());
}
//# sourceMappingURL=aiContentService.js.map