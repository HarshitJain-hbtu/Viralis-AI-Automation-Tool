"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateContent = void 0;
const generative_ai_1 = require("@google/generative-ai");
const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const generateContent = async (req, res) => {
    try {
        const { topic, type, tone } = req.body;
        if (!topic || !type) {
            return res.status(400).json({ error: 'Topic and Type are required' });
        }
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        let prompt = "";
        switch (type) {
            case 'video_ideas':
                prompt = `Generate 5 viral YouTube video ideas about "${topic}". 
                Tone: ${tone || 'Engaging'}.
                Format the output as a JSON array of objects with keys: title, description, hook.`;
                break;
            case 'twitter_thread':
                prompt = `Write a viral Twitter thread (5-7 tweets) about "${topic}".
                Tone: ${tone || 'Professional'}.
                Format as a list of strings.`;
                break;
            case 'instagram_caption':
                prompt = `Write 3 engaging Instagram captions for a post about "${topic}".
                Include hashtags. Tone: ${tone || 'Fun'}.`;
                break;
            case 'script':
                prompt = `Write a 60-second YouTube Short script about "${topic}".
                Tone: ${tone || 'Energetic'}.
                Include visual cues in brackets.`;
                break;
            case 'reel_script':
                prompt = `Create a viral Instagram Reel / TikTok script about "${topic}".
                Target Audience: ${req.body.targetAge || 'General'}, ${req.body.targetInterest || 'General'}.
                Tone: ${tone || 'Viral'}.
                
                You MUST return the response in valid, parseable JSON format ONLY. Do not add markdown code blocks.
                The JSON must follow this exact structure:
                {
                    "hook": "The main hook text",
                    "hookAlternatives": ["alt 1", "alt 2", "alt 3"],
                    "script": [
                        { "time": "0-3s", "type": "Hook", "text": "Speech text", "onScreenText": "Overlay text", "visual": "Detailed visual description for an AI image generator (photorealistic)" },
                        { "time": "3-8s", "type": "Problem", "text": "Speech text", "onScreenText": "Overlay text", "visual": "Detailed visual description" }
                        // ... continue for 30-60s
                    ],
                    "caption": "Viral caption with emojis",
                    "hashtags": ["#tag1", "#tag2"],
                    "voiceover": {
                        "script": "Full text combined",
                        "pacing": "Fast/Slow",
                        "tone": "Description"
                    },
                    "visualPlan": [
                        { "scene": 1, "shot": "Close up", "duration": "3s", "description": "Visual description to prompt an image generator" }
                         // ... match script scenes
                    ]
                }`;
                break;
            default:
                prompt = `Generate content about ${topic}. Type: ${type}.`;
        }
        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();
        // If asking for JSON, try to clean plain text if it includes markdown blocks
        if (type === 'reel_script') {
            text = text.replace(/```json/g, '').replace(/```/g, '').trim();
            try {
                // Validate it parses
                JSON.parse(text);
            }
            catch (e) {
                console.error("Failed to parse JSON from AI", text);
                // Fallback or error handling could go here
            }
        }
        return res.json({ result: text });
    }
    catch (error) {
        console.error('AI Generation Error:', error);
        return res.status(500).json({ error: 'Failed to generate content', details: error.message });
    }
};
exports.generateContent = generateContent;
//# sourceMappingURL=aiController.js.map