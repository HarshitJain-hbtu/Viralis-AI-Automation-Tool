"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleWebConnection = void 0;
const ws_1 = require("ws");
const axios_1 = __importDefault(require("axios"));
const sdk_1 = require("@deepgram/sdk");
const generative_ai_1 = require("@google/generative-ai");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Configuration
const DEEPGRAM_API_KEY = process.env.DEEPGRAM_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';
if (!DEEPGRAM_API_KEY || !GEMINI_API_KEY) {
    console.warn('❌ Missing API Keys for Voice Service');
}
const deepgram = (0, sdk_1.createClient)(DEEPGRAM_API_KEY);
const genAI = new generative_ai_1.GoogleGenerativeAI(GEMINI_API_KEY);
// Helper: Fetch Brand Data from Public Backend API
function fetchBrandData(brandId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get(`${BACKEND_URL}/api/public/brand/${brandId}`);
            return response.data;
        }
        catch (error) {
            console.error(`Error fetching brand ${brandId}:`, error);
            return null;
        }
    });
}
// Helper: Construct System Prompt
function createSystemPrompt(brand) {
    var _a;
    const kb = brand.knowledgeBase || {};
    const servicesList = kb.services
        ? kb.services.map(s => `- ${s.name}: ${s.price}`).join('\n')
        : 'No specific services listed.';
    return `
Role: You are the AI Receptionist for ${brand.name}.
Context: ${kb.customInstructions || 'Be polite and helpful.'}

Facts:
- Business Hours: ${kb.businessHours || brand.businessHours || 'Not specified'}
- Address: ${((_a = brand.location) === null || _a === void 0 ? void 0 : _a.address) || 'Not specified'}
- Contact/Handoff: ${kb.contactPhone || 'Not specified'}

Services & Pricing:
${servicesList}

Guardrails:
- Keep responses brief (1-2 sentences).
- Never invent prices. Only quote from the list above.
- If you don't know, offer to take a message or have a human call back.
    `.trim();
}
// Main Handler
const handleWebConnection = (ws, req) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('📞 New Voice Call Connection');
    // 1. Parse Params
    const url = new URL(req.url, `http://${req.headers.host}`);
    const brandId = url.searchParams.get('brandId');
    if (!brandId) {
        console.error('❌ Missing brandId');
        ws.close(1008, 'Missing brandId');
        return;
    }
    // 2. Fetch Data
    const brand = yield fetchBrandData(brandId);
    if (!brand) {
        console.error('❌ Brand not found or API error');
        ws.close(1011, 'Brand Data Unavailable');
        return;
    }
    console.log(`✅ Loaded Persona: ${brand.name}`);
    // 3. Setup Gemini
    const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' });
    const chat = model.startChat({
        history: [
            {
                role: 'user',
                parts: [{ text: createSystemPrompt(brand) }]
            },
            {
                role: 'model',
                parts: [{ text: 'Understood. I am ready to act as the receptionist.' }]
            }
        ]
    });
    // 4. Setup Deepgram STT (Listen)
    // Using standard 16k for VoIP stability
    const live = deepgram.listen.live({
        model: 'nova-2',
        language: 'en-US',
        smart_format: true,
        encoding: 'linear16',
        sample_rate: 16000,
    });
    // Event: Deepgram Connection Open
    live.on('open', () => {
        console.log('🎤 Deepgram STT Connected');
        // Listen for Transcript
        live.on(sdk_1.LiveTranscriptionEvents.Transcript, (data) => __awaiter(void 0, void 0, void 0, function* () {
            const transcript = data.channel.alternatives[0].transcript;
            if (transcript && data.is_final) {
                console.log(`🗣️ User: ${transcript}`);
                // 5. Send to Gemini
                try {
                    console.log(`➡️ Sending to Gemini: "${transcript}"`);
                    const result = yield chat.sendMessage(transcript);
                    const responseText = result.response.text();
                    console.log(`🤖 AI Response: "${responseText}"`);
                    if (!responseText) {
                        console.warn('⚠️ Gemini returned empty response');
                        return;
                    }
                    // 6. Generate TTS (Speak)
                    console.log('🗣️ Requesting TTS from Deepgram...');
                    const ttsResponse = yield deepgram.speak.request({ text: responseText }, { model: 'aura-asteria-en' });
                    const stream = yield ttsResponse.getStream();
                    if (stream) {
                        console.log('🌊 TTS Stream received, buffering...');
                        const reader = stream.getReader();
                        const chunks = [];
                        while (true) {
                            const { done, value } = yield reader.read();
                            if (done)
                                break;
                            chunks.push(value);
                        }
                        // Combine chunks into one buffer
                        const combinedBuffer = Buffer.concat(chunks);
                        console.log(`🔊 Sending TTS Audio Loop: ${combinedBuffer.length} bytes`);
                        if (ws.readyState === ws_1.WebSocket.OPEN) {
                            ws.send(combinedBuffer);
                            console.log('✅ Audio sent to client');
                        }
                        else {
                            console.warn('⚠️ WebSocket closed before audio could be sent');
                        }
                    }
                    else {
                        console.error('❌ No stream in TTS response');
                    }
                }
                catch (err) {
                    console.error('❌ Error in AI processing pipeline:', err);
                }
            }
        }));
    });
    // Event: Error
    live.on('error', (err) => {
        console.error('Deepgram Error:', err);
    });
    // 7. Pipe Client Audio -> Deepgram
    ws.on('message', (data) => {
        if (Buffer.isBuffer(data)) {
            // console.log(`🎤 Received Audio Chunk: ${data.length} bytes`); // Uncomment for deep debug
            if (live.getReadyState() === 1) { // OPEN
                live.send(data);
            }
        }
        else {
            console.log('📩 Received Text/Other:', data);
        }
    });
    ws.on('close', () => {
        console.log('Call Ended');
        live.finish();
    });
});
exports.handleWebConnection = handleWebConnection;
