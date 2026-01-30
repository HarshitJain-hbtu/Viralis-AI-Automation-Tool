import { GoogleGenerativeAI } from "@google/generative-ai";

// Define the shape of a single day's post
export interface DayPost {
  day: number;
  hook: string;
  caption: string;
  hashtags: string[];
  post_type: "carousel" | "reel" | "story" | "static";
  best_time: string;
  cta: string;
  visual_prompt: string;
}

// Input shape for the generation function
export interface CalendarInput {
  niche: string;
  platform: string;
  city: string;
  description?: string;
  brandName?: string;
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

function buildPrompt(input: CalendarInput): string {
  const { niche, platform, city, description, brandName } = input;

  return `
    You are VIRALIS AI, an expert social media content strategist.
    Your task is to generate a detailed 30-day social media content calendar, returned as a valid JSON array.

    INPUTS:
    - Niche: "${niche}"
    - Platform: "${platform}"
    - Location: "${city}"
    - Brand Name: "${brandName || 'the brand'}"
    - Extra Description: "${description || 'No extra description provided.'}"

    REQUIREMENTS FOR EACH OF THE 30 DAYS:
    1.  day: day number (1–30)
    2.  hook: an attention-grabbing first line (max 10 words).
    3.  caption: a 50–120 word caption. It must be conversational and use emojis and clear line breaks for readability.
    4.  hashtags: an array of 8–12 relevant hashtags. Mix niche, local ("${city}"), and broad hashtags. Do not include spaces or '#' in the strings.
    5.  post_type: one of ["carousel", "reel", "story", "static"].
    6.  best_time: a human-readable time window in the local timezone (e.g., "6–8 PM", "11 AM - 1 PM").
    7.  cta: a short, clear call-to-action sentence.
    8.  visual_prompt: A TEXT description of the ideal visual for the post. This is a suggestion for a human designer, not for an image generation AI.

    THEMES TO FOLLOW:
    - Days 1–5: Focus on the brand's story, mission, and the 'why' behind the business.
    - Days 6–10: Highlight hero products/services, their benefits, and use cases.
    - Days 11–15: Show behind-the-scenes content, introduce the team, and explain the process.
    - Days 16–20: Use testimonials, social proof, and user-generated content (UGC) ideas.
    - Days 21–25: Provide educational tips, how-tos, and solve common problems for the audience.
    - Days 26–30: Focus on offers, promotions, and engaging content like polls, questions, or contests.

    OUTPUT FORMAT:
    Return ONLY a valid JSON array containing exactly 30 objects. Do not include any extra text, markdown, or explanations before or after the JSON array. The structure of each object must be:
    {
      "day": number,
      "hook": "string",
      "caption": "string",
      "hashtags": ["string"],
      "post_type": "carousel" | "reel" | "story" | "static",
      "best_time": "string",
      "cta": "string",
      "visual_prompt": "string"
    }
  `;
}

/**
 * Generates a 30-day social media calendar using the Gemini API.
 * @param input - The user's requirements for the calendar.
 * @returns A promise that resolves to an array of 30 DayPost objects.
 */
export async function generate30DayCalendar(input: CalendarInput): Promise<DayPost[]> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  const prompt = buildPrompt(input);

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Extract the JSON array from the response text, which might be wrapped in markdown
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error("Failed to extract JSON array from Gemini response.");
    }

    const parsedJson = JSON.parse(jsonMatch[0]);

    if (!Array.isArray(parsedJson) || parsedJson.length !== 30) {
      throw new Error(`Validation failed: Expected 30 items, but got ${parsedJson.length}.`);
    }
    
    // Simple validation of the first item to increase confidence
    const firstItem = parsedJson[0];
    if (!firstItem.day || !firstItem.hook || !firstItem.caption) {
        throw new Error("Validation failed: The first item in the array has a missing property.");
    }

    return parsedJson as DayPost[];
  } catch (error) {
    console.error("Error generating content with Gemini:", error);
    throw new Error("Failed to generate content from AI service.");
  }
}