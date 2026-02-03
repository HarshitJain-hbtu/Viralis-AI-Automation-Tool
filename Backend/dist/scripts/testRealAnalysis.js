"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const platformApi_1 = require("../utils/platformApi");
const chatgptAnalysis_1 = require("../utils/chatgptAnalysis");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
async function testRealFlow() {
    const testUrl = 'https://www.instagram.com/p/DUDevIVkvcF/';
    const platform = 'instagram';
    console.log('--- STARTING REAL INTEGRATION TEST ---');
    console.log(`URL: ${testUrl}`);
    console.log(`Platform: ${platform}`);
    try {
        // 1. Fetch Real Stats from Instagram
        console.log('\nStep 1: Fetching real stats from Instagram...');
        const stats = await (0, platformApi_1.fetchPlatformStats)(testUrl, platform);
        console.log('Real Stats Found:', JSON.stringify(stats, null, 2));
        if (Object.keys(stats).length === 0) {
            console.warn('⚠️ No stats found. Check your INSTAGRAM_ACCESS_TOKEN or if the post is public.');
        }
        // 2. Analyze with OpenAI
        console.log('\nStep 2: Sending data to OpenAI for analysis...');
        const aiResult = await (0, chatgptAnalysis_1.analyzeVideoWithChatGPT)(testUrl, platform, stats);
        if (aiResult) {
            console.log('\n--- SUCCESS: REAL ANALYSIS RESULT ---');
            console.log('Summary:', aiResult.summary);
            console.log('Lead Quality Score:', aiResult.leadQualityScore);
            console.log('Audience Sentiment:', aiResult.audienceSentiment);
            console.log('Key Insights:', aiResult.keyInsights.join(', '));
        }
        else {
            console.error('❌ AI Analysis failed. Check your OPENAI_API_KEY.');
        }
    }
    catch (error) {
        console.error('❌ Integration test failed:', error);
    }
    finally {
        console.log('\n--- TEST COMPLETED ---');
        process.exit(0);
    }
}
testRealFlow();
//# sourceMappingURL=testRealAnalysis.js.map