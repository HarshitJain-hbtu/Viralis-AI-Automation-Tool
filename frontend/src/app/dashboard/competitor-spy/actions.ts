'use server';

import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

interface Post {
  id: string;
  thumbnail: string;
  views: number;
  likes: number;
  comments: number;
  caption: string;
  date: string;
  type: string;
  // AI enrichment
  whyWorked?: string;
}

// Mock Data Generator (since we don't have real social APIs)
function generateMockProfile(username: string, platform: string) {
  const isYoutube = platform === 'youtube';
  const followers = Math.floor(Math.random() * 500000) + 10000;

  // Generate some mock posts
  const posts: Post[] = Array.from({ length: 12 }).map((_, i) => ({
    id: `post-${i}`,
    thumbnail: `https://source.unsplash.com/random/400x600?sig=${i}&${isYoutube ? 'youtube' : 'instagram'}`,
    views: Math.floor(Math.random() * 100000) + 5000,
    likes: Math.floor(Math.random() * 8000) + 100,
    comments: Math.floor(Math.random() * 200) + 10,
    caption: `This is a sample caption for post ${i}. #growth #marketing`,
    date: new Date(Date.now() - i * 86400000 * 2).toISOString(),
    type: ['Educational', 'Hook-based', 'Trend', 'Promo'][Math.floor(Math.random() * 4)]
  }));

  return {
    username,
    platform,
    followers,
    avgViews: Math.floor(posts.reduce((acc, p) => acc + p.views, 0) / posts.length),
    engagementRate: ((posts.reduce((acc, p) => acc + p.likes + p.comments, 0) / posts.length) / followers * 100).toFixed(2) + '%',
    postingFreq: "3-4 times/week",
    growthVelocity: "High",
    posts
  };
}

export async function analyzeCompetitorAction(username: string, platform: string) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  // 1. Get Data (Mocked for now)
  const profileData = generateMockProfile(username, platform);

  // 2. Prepare Prompt for Gemini
  const prompt = `
You are a sophisticated Social Media Growth Analyst using AI to reverse-engineer viral success.
Analyze the following competitor data for "${username}" on ${platform}.

DATA CONTEXT:
- Followers: ${profileData.followers}
- Avg Views: ${profileData.avgViews}
- Engagement Rate: ${profileData.engagementRate}
- Recent Posts Sample: ${JSON.stringify(profileData.posts.slice(0, 5).map(p => ({
    views: p.views,
    likes: p.likes,
    type: p.type,
    caption: p.caption,
    id: p.id
  })
  ))}

TASK:
Provide a deep, strategic analysis of why this account is successful and identify opportunities.
Also, analyzed the provided recent posts sample and explain briefly "why it worked" for each one based on its metrics.

OUTPUT FORMAT (JSON ONLY):
Return a single valid JSON object with this exact structure:
{
  "viralPatterns": {
    "hooks": ["Common hook style 1", "Common hook style 2"],
    "visuals": ["Visual pattern 1", "Visual pattern 2"],
    "cta": "Dominant CTA strategy",
    "postingTime": "Best predicted posting time"
  },
  "whyItWorks": {
    "psychology": "Psychological trigger usage",
    "structure": "Video structure analysis",
    "mistakesAvoided": "What they enable that others miss"
  },
  "opportunities": [
    {
      "title": "Opportunity Name",
      "description": "What they are missing or what can be improved",
      "difficulty": "Low/Medium/High"
    },
    {
      "title": "Content Gap",
      "description": "A topic they aren't covering well",
      "difficulty": "Medium"
    }
  ],
  "topHooks": [
    { "text": "Extracted or inferred top hook 1", "category": "Curiosity" },
    { "text": "Extracted or inferred top hook 2", "category": "Value" }
  ],
  "postsAnalysis": {
     "post-0": "Why this specific post likely worked",
     "post-1": "Why this specific post likely worked",
     "post-2": "Why this specific post likely worked",
     "post-3": "Why this specific post likely worked",
     "post-4": "Why this specific post likely worked"
  }
}
`;

  // MOCK MODE: Bypass Gemini API for stability
  await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay

  const aiAnalysis = {
    viralPatterns: {
      hooks: ["Stop scrolling!", "The secret nobody tells you", "Why you're failing at X"],
      visuals: ["High contrast overlays", "Fast cuts", "Face close-up"],
      cta: "Save this for later",
      postingTime: "6:00 PM - 8:00 PM"
    },
    whyItWorks: {
      psychology: "Uses urgency and fear of missing out (FOMO) effectively.",
      structure: "Hook -> Agitate -> Solution -> Proof -> CTA",
      mistakesAvoided: "Avoids long intros and gets straight to the point."
    },
    opportunities: [
      {
        title: "Behind the Scenes",
        description: "Show the raw process of creating your product/service to build trust.",
        difficulty: "Low"
      },
      {
        title: "Collaborations",
        description: "Partner with complementary influencers in your niche.",
        difficulty: "Medium"
      }
    ],
    topHooks: [
      { text: "Stop scrolling!", category: "Urgency" },
      { text: "The secret nobody tells you", category: "Curiosity" }
    ],
    postsAnalysis: {} as any
  };

  // Generate mock per-post analysis
  profileData.posts.forEach(p => {
    aiAnalysis.postsAnalysis[p.id] = ["High emotional hook", "Strong visual contrast", "Controversial take", "Relatable storytelling"][Math.floor(Math.random() * 4)];
  });

  // Merge specific post analysis back into the posts array
  const analyzedPosts = profileData.posts.map(p => ({
    ...p,
    whyWorked: aiAnalysis.postsAnalysis?.[p.id] || "High engagement detected due to strong hook."
  }));

  return {
    profile: { ...profileData, posts: analyzedPosts },
    analysis: aiAnalysis
  };
  /*
    try {
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json"
        }
      });
  
      const responseText = result.response.text();
      let aiAnalysis;
      try {
        aiAnalysis = JSON.parse(responseText);
      } catch (jsonError) {
        console.error("Failed to parse Gemini JSON. Raw text:", responseText);
        throw new Error("AI returned invalid data format. Please try again.");
      }
  
      // Merge specific post analysis back into the posts array
      const analyzedPosts = profileData.posts.map(p => ({
        ...p,
        whyWorked: aiAnalysis.postsAnalysis?.[p.id] || "High engagement detected due to strong hook."
      }));
  
      return {
        profile: { ...profileData, posts: analyzedPosts },
        analysis: aiAnalysis
      };
  
    } catch (error: any) {
      console.error("Competitor Analysis Failed:", error);
      if (error.message.includes("API_KEY")) {
         throw new Error("Server configuration error: Invalid API Key");
      }
      throw new Error(error.message || "Failed to analyze competitor");
    }
  */
}
