import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function generate30DayCalendar(input: {
  niche: string;
  platform: string;
  city: string;
  description?: string;
  brandName?: string;
  brandLogo?: string;
}) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `
You are VIRALIS AI, an expert social media content strategist.

Generate a 30-day content calendar for:
- Niche: ${input.niche}
- Platform: ${input.platform}
- Location: ${input.city}
- Brand Name: ${input.brandName || "Local Business"}
- Additional Details: ${input.description || "None provided"}

For EACH of the 30 days, generate:
1. **hook**: Attention-grabbing opening line (max 10 words)
2. **caption**: Engaging post caption (50-100 words, include emojis)
3. **hashtags**: Array of 8-12 relevant hashtags (trending + niche-specific)
4. **visual_prompt**: Detailed image generation prompt for Gemini (include: scene, lighting, colors, mood, style, aspect ratio 1:1 for Instagram/9:16 for Reels, include "${input.brandName || "brand logo"}" text overlay, photorealistic style)
5. **post_type**: "carousel" | "reel" | "story" | "static"
6. **best_time**: Optimal posting time for ${input.platform}
7. **cta**: Call-to-action phrase

Make each day UNIQUE with different themes:
- Day 1-5: Introduction & brand story
- Day 6-10: Product/service highlights
- Day 11-15: Behind-the-scenes & team
- Day 16-20: Customer testimonials & UGC ideas
- Day 21-25: Tips, tutorials & value content
- Day 26-30: Promotions, events & engagement posts

Return ONLY valid JSON array with exactly 30 objects:
[
  {
    "day": 1,
    "hook": "...",
    "caption": "...",
    "hashtags": ["#...", "#..."],
    "visual_prompt": "...",
    "post_type": "...",
    "best_time": "...",
    "cta": "..."
  },
  ...
]
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  
  // Extract JSON from response
  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    throw new Error("Failed to parse 30-day calendar");
  }
  
  const calendar = JSON.parse(jsonMatch[0]);
  return calendar;
}
