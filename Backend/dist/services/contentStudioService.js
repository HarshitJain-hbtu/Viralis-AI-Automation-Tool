"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateStudioContent = generateStudioContent;
const generative_ai_1 = require("@google/generative-ai");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const imageService_1 = require("./imageService");
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../.env') });
dotenv_1.default.config();
function getGenAI() {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
        throw new Error('GEMINI_API_KEY is not set in environment.');
    }
    return new generative_ai_1.GoogleGenerativeAI(key);
}
/**
 * Builds tailored prompt based on platform and real business profile
 */
function buildPlatformPrompt(platform, business, date) {
    const servicesText = business.services && business.services.length > 0
        ? business.services.map(s => `- ${s.name}: ${s.price}`).join('\n')
        : 'General professional services';
    const baseContext = `
BUSINESS IDENTITY (USE THIS REAL INFORMATION - NEVER INVENT FAKE DATA):
- Business Name: "${business.name}"
- Industry / Niche: "${business.niche}"
- Location: "${business.location || 'Local market'}"
- Description: "${business.description || 'Modern service business'}"
- Tone: "${business.brandVoiceTone || 'Professional & Engaging'}"
- Services & Offerings:
${servicesText}
- Specific Focus / Context for This Post: "${business.customContext || 'General brand growth and client engagement'}"
- Target Date: "${date}"
- Target Platform: "${platform}"
`;
    let platformSpecificGuidance = "";
    switch (platform) {
        case 'Instagram Reel':
        case 'YouTube Shorts':
            platformSpecificGuidance = `
FORMAT REQUIREMENTS FOR VERTICAL SHORT-FORM VIDEO (${platform}):
- Generate a high-retention 30-60 second video plan.
- hook: A 3-second scroll-stopping opening hook.
- hookAlternatives: 3 alternate hooks with different angles (curiosity, controversial, educational).
- storyboard: An array of 4 to 6 scenes covering 0 to 60 seconds with:
  * "time": e.g. "0-3s", "3-10s", "10-25s", "25-45s", "45-60s"
  * "type": "Hook" | "Problem" | "Solution" | "Proof" | "Call to Action"
  * "text": Spoken dialogue
  * "onScreenText": Bold overlay text for the screen
  * "visual": Specific camera shot, lighting, and action description
- voiceoverScript: Full complete audio narration script for voiceover.
- caption: Natural, readable caption with emojis and spacing.
- hashtags: 8 to 12 targeted hashtags.
- cta: Specific call to action (e.g., "Comment 'INFO' below", "Link in bio to book").
- visualPrompt: Detailed prompt for generating a vertical 9:16 cover image.
`;
            break;
        case 'YouTube Video':
            platformSpecificGuidance = `
FORMAT REQUIREMENTS FOR LONG-FORM YOUTUBE VIDEO:
- youtubeTitles: 3 high-CTR, search-optimized title variations.
- hook: The first 15 seconds of the video intro to lock in viewers.
- caption: The complete structured script outline (Hook, Act 1: The Problem, Act 2: Practical Solutions / Demonstration, Act 3: Key Takeaway & Outro).
- youtubeDescription: SEO description with video summary, timestamps (00:00 Intro, 01:30 ..., 04:00 ...), and business links.
- thumbnailPrompt: A vivid visual description for a high-CTR YouTube thumbnail image.
- thumbnailText: 2 to 4 words of bold high-impact text for the thumbnail.
- hashtags: 5 to 8 relevant YouTube tags.
- cta: Channel subscribe, like, and visit business website/booking link.
- visualPrompt: Cinematic 16:9 landscape visual description for the video thumbnail.
`;
            break;
        case 'LinkedIn':
            platformSpecificGuidance = `
FORMAT REQUIREMENTS FOR LINKEDIN POST:
- hook: A strong, professional one-line opening that encourages clicking "see more".
- caption: Thought-leadership post with white space, bullet points, and actionable business insights.
- linkedinTakeaways: 3 concise bullet points with business value.
- discussionQuestion: An engaging open-ended question at the end to drive meaningful comment discussion.
- hashtags: 3 to 5 targeted professional hashtags (e.g. #BusinessStrategy, #LocalBusiness).
- cta: Professional call to action (e.g. "Connect with us", "Share your thoughts below").
- visualPrompt: Professional, clean aesthetic visual description for an editorial graphic.
`;
            break;
        case 'Facebook':
            platformSpecificGuidance = `
FORMAT REQUIREMENTS FOR FACEBOOK POST:
- hook: Relatable community question or observation.
- caption: Storytelling, conversational body copy that feels personal and warm.
- discussionQuestion: Question prompting local community members to comment.
- cta: Direct action (e.g., "Send us a message", "Tag a friend who needs this", "Call us today").
- hashtags: 2 to 4 minimal local hashtags.
- visualPrompt: Relatable, friendly, real-life photography prompt (1:1 square).
`;
            break;
        case 'Instagram Post':
        default:
            platformSpecificGuidance = `
FORMAT REQUIREMENTS FOR INSTAGRAM POST:
- hook: Eye-catching first line that sparks curiosity.
- caption: Engaging caption with line breaks, emojis, and valuable tips/story.
- cta: Clear save/share/comment prompt (e.g., "Save this for later", "DM us to get started").
- hashtags: 10 to 15 strategic hashtags mixing local (${business.location || 'local'}), niche, and industry terms.
- visualPrompt: High-fashion, aesthetic commercial photography prompt (1:1 square).
`;
            break;
    }
    return `
You are VIRALIS Content Studio AI, an elite social media content director for fast-growing businesses.
Your job is to generate THREE completely distinct, publication-ready content strategies for the specified business and platform.

${baseContext}

${platformSpecificGuidance}

GENERATE 3 UNIQUE STRATEGIES:
1. "viral": High-energy, bold, unexpected angle, maximum shareability.
2. "reach": Broadly relatable, trending concept, designed to attract new potential clients.
3. "niche": Authority-building, educational, demonstrating deep domain mastery for high conversion.

GUARDRAILS:
- Always use the real business details provided.
- Do NOT invent fake customer reviews, fake awards, or fabricated statistics.
- Ensure all text is completely publication-ready (no placeholders like "[insert name]").
- Return ONLY valid, parseable JSON conforming strictly to the format below. No markdown fences, no preamble.

OUTPUT JSON STRUCTURE:
{
  "viral": {
    "hook": "string",
    "hookAlternatives": ["alt 1", "alt 2", "alt 3"],
    "caption": "string",
    "hashtags": ["string"],
    "cta": "string",
    "bestTime": "string",
    "visualPrompt": "string",
    "storyboard": [
      { "time": "0-3s", "type": "Hook", "text": "...", "onScreenText": "...", "visual": "..." }
    ],
    "voiceoverScript": "string",
    "youtubeTitles": ["title 1", "title 2", "title 3"],
    "youtubeDescription": "string",
    "thumbnailPrompt": "string",
    "thumbnailText": "string",
    "linkedinTakeaways": ["takeaway 1", "takeaway 2", "takeaway 3"],
    "discussionQuestion": "string"
  },
  "reach": { ...same schema },
  "niche": { ...same schema }
}
`.trim();
}
/**
 * Generates tailored publication-ready content using Gemini and attaches AI images
 */
async function generateStudioContent(platform, business, date) {
    const model = getGenAI().getGenerativeModel({ model: 'gemini-3.5-flash-lite' });
    const prompt = buildPlatformPrompt(platform, business, date);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();
    // Clean JSON if wrapped in markdown
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
        throw new Error('Failed to parse structured JSON from AI response.');
    }
    const parsed = JSON.parse(jsonMatch[0]);
    // Attach generated images with platform aspect ratio and format output
    const enrichStrategy = (data, strategyType, seedOffset) => {
        const visualPrompt = data.visualPrompt ||
            data.thumbnailPrompt ||
            `${business.niche} professional presentation for ${business.name} in ${business.location || ''}`;
        const imageUrl = (0, imageService_1.generateImageUrl)({
            prompt: visualPrompt,
            platform,
            seed: Date.now() + seedOffset
        });
        return {
            platform,
            targetDate: date,
            strategyType,
            hook: data.hook || `Discover ${business.name}`,
            hookAlternatives: data.hookAlternatives || [],
            caption: data.caption || '',
            hashtags: data.hashtags || [],
            cta: data.cta || `Contact ${business.name} today.`,
            bestTime: data.bestTime || '18:00',
            visualPrompt,
            imageUrl,
            storyboard: data.storyboard || undefined,
            voiceoverScript: data.voiceoverScript || undefined,
            youtubeTitles: data.youtubeTitles || undefined,
            youtubeDescription: data.youtubeDescription || undefined,
            thumbnailPrompt: data.thumbnailPrompt || undefined,
            thumbnailText: data.thumbnailText || undefined,
            linkedinTakeaways: data.linkedinTakeaways || undefined,
            discussionQuestion: data.discussionQuestion || undefined,
        };
    };
    return {
        viral: enrichStrategy(parsed.viral || {}, 'viral', 1),
        reach: enrichStrategy(parsed.reach || {}, 'reach', 2),
        niche: enrichStrategy(parsed.niche || {}, 'niche', 3)
    };
}
//# sourceMappingURL=contentStudioService.js.map