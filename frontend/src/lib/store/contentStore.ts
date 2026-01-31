import { create } from 'zustand';
import api from '../api/client';

interface ContentState {
    isGenerating: boolean;
    generatedResult: string | null;
    error: string | null;
    generateContent: (topic: string, type: string, tone: string, extraParams?: any) => Promise<void>;
    clearResult: () => void;
}

export const useContentStore = create<ContentState>((set) => ({
    isGenerating: false,
    generatedResult: null,
    error: null,

    generateContent: async (topic, type, tone, extraParams = {}) => {
        set({ isGenerating: true, error: null, generatedResult: null });

        // MOCK MODE: Bypass Backend API
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate generation time

        try {
            let mockResponse;

            // Dynamic Mock Data Generation
            if (tone === 'Funny' || tone === 'Humorous') {
                mockResponse = {
                    hook: `Why your ${topic} is actually a cry for help 😂`,
                    hookAlternatives: [
                        `Stop doing ${topic} like a grandma 👵`,
                        `I tried ${topic} and instantly regretted it... here's why`,
                        `The funniest thing about ${topic} is...`
                    ],
                    script: [
                        { time: "0-3s", type: "Hook", text: `Why your ${topic} is actually a cry for help`, onScreenText: "CRY FOR HELP 😂", visual: "Chaotic close-up, confused face" },
                        { time: "3-8s", type: "Roast", text: "You think you're cool, but really you just look like this...", onScreenText: "REALITY CHECK", visual: "Clown filter or funny awkward silence" },
                        { time: "8-15s", type: "Twist", text: "But seriously, if you want to win, just do the opposite.", onScreenText: "THE TRUTH", visual: "Sudden realization, mind blown effect" },
                        { time: "15-30s", type: "CTA", text: "Follow for more ${topic} disasters to avoid!", onScreenText: "FOLLOW FOR CHAOS", visual: "Pointing to follow button violently" }
                    ],
                    caption: `Don't let this be you 💀 #${topic} #fail #funny`,
                    hashtags: [`#${topic.replace(/\s/g, '')}`, "#comedy", "#relatable", "#trending"],
                    voiceover: { script: `Why your ${topic} is actually a cry for help. You think you're cool, but really you just look like this... But seriously, if you want to win, just do the opposite. Follow for more ${topic} disasters to avoid!`, pacing: "Comedic, deadpan", tone: "Sarcastic" },
                    visualPlan: [{ scene: 1, shot: "Close up", duration: "3s", description: "Confused face with math equations overlay" }]
                };
            } else if (tone === 'Educational' || tone === 'Professional') {
                mockResponse = {
                    hook: `3 Secrets to Master ${topic} in 2026 🚀`,
                    hookAlternatives: [
                        `Stop getting ${topic} wrong. Do this instead.`,
                        `The ultimate guide to ${topic} for beginners`,
                        `How I mastered ${topic} in 30 days`
                    ],
                    script: [
                        { time: "0-3s", type: "Hook", text: `3 Secrets to Master ${topic} in 2026`, onScreenText: "3 SECRETS 🤫", visual: "Clean background, professional lighting, holding up 3 fingers" },
                        { time: "3-10s", type: "Tip 1", text: "First, forget everything you know about the old way. Usage has changed.", onScreenText: "FORGET THE OLD WAY", visual: "Swiping away old text/graphic" },
                        { time: "10-20s", type: "Tip 2", text: "Second, consistency beats intensity. Do it daily, not perfectly.", onScreenText: "CONSISTENCY > INTENSITY", visual: "Calendar animation filling up" },
                        { time: "20-30s", type: "CTA", text: "Comment 'GUIDE' and I'll send you my full blueprint.", onScreenText: "COMMENT 'GUIDE' 👇", visual: "Pointing down to comments" }
                    ],
                    caption: `Save this for later! 📌 Here is how to crush ${topic} this year. \n\nWhich tip was your favorite? Let me know below! 👇`,
                    hashtags: [`#${topic.replace(/\s/g, '')}`, "#education", "#tips", "#growth"],
                    voiceover: { script: "3 Secrets to Master ${topic} in 2026. First, forget everything you know about the old way. Second, consistency beats intensity. Comment 'GUIDE' and I'll send you my full blueprint.", pacing: "Clear, authoritative", tone: "Professional" },
                    visualPlan: [{ scene: 1, shot: "Medium shot", duration: "3s", description: "Speaker addressing camera with clean desk background" }]
                };
            } else {
                // Default / Viral / Inspirational
                mockResponse = {
                    hook: `This one hack changed my entire approach to ${topic} 🤯`,
                    hookAlternatives: [
                        `You are overcomplicating ${topic}. Keep it simple.`,
                        `What nobody tells you about ${topic}...`,
                        `The dark side of ${topic} exposed`
                    ],
                    script: [
                        { time: "0-3s", type: "Hook", text: `This one hack changed my entire approach to ${topic}`, onScreenText: "GAME CHANGER 🤯", visual: "Fast zoom in, shocked expression" },
                        { time: "3-8s", type: "Story", text: "I used to struggle for hours, until I discovered this...", onScreenText: "THE STRUGGLE", visual: "Black and white sad montage" },
                        { time: "8-20s", type: "Reveal", text: "It's called the 'Reverse ${topic} Method'. Here is how it works...", onScreenText: "THE METHOD", visual: "Fast paced tutorial/screen recording" },
                        { time: "20-30s", type: "CTA", text: "Try it today and tag me in your results!", onScreenText: "TRY IT NOW", visual: "High energy transition to result" }
                    ],
                    caption: `This actually works. 🤯 Try it and thank me later. #${topic} #hack`,
                    hashtags: [`#${topic.replace(/\s/g, '')}`, "#lifehack", "#viral", "#trend"],
                    voiceover: { script: "This one hack changed my entire approach to ${topic}. I used to struggle for hours, until I discovered this... It's called the 'Reverse Method'. Try it today and tag me!", pacing: "Fast, high energy", tone: "Excited" },
                    visualPlan: [{ scene: 1, shot: "Selfie style", duration: "3s", description: "Walking down street talking to camera" }]
                };
            }

            // Return stringified JSON as the backend would
            set({ generatedResult: JSON.stringify(mockResponse), isGenerating: false });
        } catch (error: any) {
            set({
                error: 'Failed to generate content (Mock Error)',
                isGenerating: false
            });
            console.error(error);
        }
    },

    clearResult: () => set({ generatedResult: null, error: null })
}));
