"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleWebConnection = void 0;
const ws_1 = require("ws");
const sdk_1 = require("@deepgram/sdk");
const generative_ai_1 = require("@google/generative-ai");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const Business_1 = require("../models/Business");
const Lead_1 = require("../models/Lead");
const Transcript_1 = require("../models/Transcript");
// Explicitly load .env from Backend root (src/controllers/../..)
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../.env') });
// Configuration
const DEEPGRAM_API_KEY = process.env.DEEPGRAM_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!DEEPGRAM_API_KEY || !GEMINI_API_KEY) {
    console.warn('❌ Missing API Keys for Voice Service');
}
const deepgram = DEEPGRAM_API_KEY ? (0, sdk_1.createClient)(DEEPGRAM_API_KEY) : null;
const genAI = GEMINI_API_KEY ? new generative_ai_1.GoogleGenerativeAI(GEMINI_API_KEY) : null;
// Phrases that indicate user interest/intent to connect
const INTEREST_PHRASES = [
    "connect you",
    "someone will call",
    "call you back",
    "schedule",
    "appointment",
    "book",
    "leave your details",
    "drop your details",
    "get back to you",
    "take a message",
    "our team will",
    "fill the form",
    "fill out the form",
    "provide your details"
];
const CLOSING_PHRASES = [
    "thank you",
    "thanks",
    "bye",
    "goodbye",
    "see you",
    "have a great day",
    "wonderful day"
];
// Helper: Fetch Brand Data directly from MongoDB (eliminates HTTP loopback failure)
async function fetchBrandData(brandId) {
    try {
        if (!brandId || !brandId.match(/^[0-9a-fA-F]{24}$/)) {
            console.error(`❌ Invalid brandId format: ${brandId}`);
            return null;
        }
        const business = await Business_1.Business.findById(brandId)
            .select('name businessHours knowledgeBase location industry industryMode brandVoice description voiceAgent')
            .lean();
        if (!business) {
            console.warn(`❌ Brand not found in DB: ${brandId}`);
            return null;
        }
        return business;
    }
    catch (error) {
        console.error(`❌ Error fetching brand ${brandId} from database:`, error);
        return null;
    }
}
// Helper: Construct System Prompt
function createSystemPrompt(brand) {
    const kb = brand.knowledgeBase || {};
    const servicesList = kb.services && kb.services.length > 0
        ? kb.services.map(s => `- ${s.name}: ${s.price}`).join('\n')
        : 'No specific services listed.';
    const toneInstruction = brand.brandVoice?.tone
        ? `Tone: Adopt a ${brand.brandVoice.tone} persona.`
        : 'Tone: Professional and helpful.';
    const industryContext = brand.industryMode
        ? `Industry: ${brand.industryMode}`
        : '';
    const businessDesc = brand.description
        ? `About Business: ${brand.description}`
        : '';
    return `
Role: You are the AI Voice Receptionist for ${brand.name}.
${industryContext}
${businessDesc}
${toneInstruction}

Context: ${kb.customInstructions || 'Be polite, friendly, and helpful.'}

Facts:
- Business Hours: ${kb.businessHours || brand.businessHours || 'Not specified'}
- Address: ${kb.address || brand.location?.address || 'Not specified'} ${brand.location?.city ? `(${brand.location.city})` : ''}
- Contact/Handoff: ${kb.contactPhone || 'Not specified'}

Services & Pricing:
${servicesList}

Guardrails:
- Keep responses brief (1-2 sentences at most). Speak naturally as if on a phone call.
- Never invent prices. Only quote from the list above.
- If the user wants to **BUY**, **PURCHASE**, **CONNECT**, or **SCHEDULE**, you MUST say: "Great! Please fill out the form so we can assist you with that." or "Please provide your details in the form."
- If you don't know the answer, politely offer to take a message or have someone follow up.
- If the user is concluding the call or says goodbye, say goodbye warmly.
    `.trim();
}
// Helper: Check if response indicates interest
function detectInterest(text) {
    const lowerText = text.toLowerCase();
    return INTEREST_PHRASES.some(phrase => lowerText.includes(phrase));
}
// Main Handler
const handleWebConnection = async (ws, req) => {
    console.log('📞 New Voice Call Connection');
    // === CALL STATE TRACKING ===
    const callStartTime = Date.now();
    const conversationLog = [];
    let userInterested = false;
    let brandId = null;
    let disconnectTimer = null;
    // 1. Parse Params
    try {
        const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
        brandId = url.searchParams.get('brandId');
    }
    catch (e) {
        console.error('Failed to parse URL:', e);
    }
    if (!brandId) {
        console.error('❌ Missing brandId');
        ws.close(1008, 'Missing brandId');
        return;
    }
    // 2. Fetch Brand Data directly from MongoDB
    const brand = await fetchBrandData(brandId);
    // Check if services are available
    if (!deepgram || !genAI) {
        console.error('❌ Voice Service unavailable: Missing API Keys');
        ws.close(1011, 'Voice Service Unavailable (Missing Keys)');
        return;
    }
    if (!brand) {
        console.error('❌ Brand not found in DB');
        ws.close(1011, 'Brand Data Unavailable');
        return;
    }
    console.log(`✅ Loaded Persona: ${brand.name}`);
    const systemPrompt = createSystemPrompt(brand);
    // Initial greeting
    const greetingText = brand.voiceAgent?.greeting ||
        `Hello! Thank you for calling ${brand.name}. How can I assist you today?`;
    // 3. Setup Gemini
    const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash-lite' });
    const chat = model.startChat({
        history: [
            {
                role: 'user',
                parts: [{ text: systemPrompt }]
            },
            {
                role: 'model',
                parts: [{ text: `Understood. I am acting as the receptionist. My opening line is: "${greetingText}"` }]
            }
        ]
    });
    conversationLog.push(`AI: ${greetingText}`);
    // Helper function to synthesize and send TTS audio
    const sendTTSResponse = async (text) => {
        try {
            console.log(`🗣️ Requesting TTS from Deepgram for: "${text}"`);
            const ttsResponse = await deepgram.speak.request({ text }, { model: 'aura-asteria-en' });
            const stream = await ttsResponse.getStream();
            if (stream) {
                const reader = stream.getReader();
                const chunks = [];
                while (true) {
                    const { done, value } = await reader.read();
                    if (done)
                        break;
                    if (value)
                        chunks.push(value);
                }
                const combinedBuffer = Buffer.concat(chunks);
                console.log(`🔊 Sending TTS Audio: ${combinedBuffer.length} bytes`);
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
        catch (ttsErr) {
            console.error('❌ Error generating TTS:', ttsErr);
        }
    };
    // Send spoken greeting to client after connection establishes
    setTimeout(() => {
        if (ws.readyState === ws_1.WebSocket.OPEN) {
            sendTTSResponse(greetingText);
        }
    }, 600);
    // 4. Setup Deepgram STT (Listen)
    const live = deepgram.listen.live({
        model: 'nova-2',
        language: 'en-US',
        smart_format: true,
        encoding: 'linear16',
        sample_rate: 16000,
        endpointing: 300,
        interim_results: false,
    });
    // Event: Deepgram Connection Open
    live.on('open', () => {
        console.log('🎤 Deepgram STT Connected');
        // Listen for Transcript
        live.on(sdk_1.LiveTranscriptionEvents.Transcript, async (data) => {
            const transcript = data.channel?.alternatives?.[0]?.transcript?.trim();
            const isFinal = data.is_final || data.speech_final;
            if (transcript && isFinal) {
                // Clear any pending disconnect if user speaks again
                if (disconnectTimer) {
                    clearTimeout(disconnectTimer);
                    disconnectTimer = null;
                    console.log('🔄 User spoke, cancelled auto-disconnect.');
                }
                console.log(`🗣️ User: ${transcript}`);
                conversationLog.push(`User: ${transcript}`);
                // 5. Send to Gemini
                try {
                    console.log(`➡️ Sending to Gemini: "${transcript}"`);
                    const result = await chat.sendMessage(transcript);
                    const responseText = result.response.text();
                    console.log(`🤖 AI Response: "${responseText}"`);
                    conversationLog.push(`AI: ${responseText}`);
                    if (!responseText) {
                        console.warn('⚠️ Gemini returned empty response');
                        return;
                    }
                    // === INTEREST DETECTION ===
                    const isClosing = userInterested && CLOSING_PHRASES.some(p => responseText.toLowerCase().includes(p));
                    const isNewInterest = detectInterest(responseText);
                    if (isNewInterest || isClosing) {
                        if (isNewInterest) {
                            userInterested = true;
                            console.log('✅ Interest detected! User wants to connect.');
                        }
                        // Send signal to client
                        if (ws.readyState === ws_1.WebSocket.OPEN) {
                            if (isNewInterest) {
                                ws.send(JSON.stringify({ type: 'interest_detected', interested: true }));
                            }
                            // Auto-disconnect after 10 seconds to allow TTS to finish
                            if (!disconnectTimer) {
                                console.log('⏳ Scheduling auto-disconnect in 10s...');
                                disconnectTimer = setTimeout(() => {
                                    if (ws.readyState === ws_1.WebSocket.OPEN) {
                                        console.log('🤖 Auto-disconnecting call to show lead form...');
                                        ws.close(1000, 'Goal Reached');
                                    }
                                }, 10000);
                            }
                        }
                    }
                    // 6. Generate and send TTS Audio back to client
                    await sendTTSResponse(responseText);
                }
                catch (err) {
                    console.error('❌ Error in AI processing pipeline:', err);
                }
            }
        });
    });
    // Event: Error
    live.on('error', (err) => {
        console.error('Deepgram STT Error:', err);
    });
    // 7. Pipe Client Audio -> Deepgram
    ws.on('message', (data) => {
        try {
            const buf = Buffer.isBuffer(data) ? data : Buffer.from(data);
            if (live.getReadyState() === 1) { // OPEN
                live.send(buf);
            }
        }
        catch (err) {
            console.error('Error forwarding audio to Deepgram:', err);
        }
    });
    // === ON CALL CLOSE: SAVE DIRECTLY TO DATABASE ===
    ws.on('close', async () => {
        console.log('📴 Call Ended');
        try {
            live.finish();
        }
        catch (e) {
            // ignore
        }
        const callDuration = Math.round((Date.now() - callStartTime) / 1000);
        console.log(`⏱️ Call Duration: ${callDuration} seconds`);
        console.log(`📋 Conversation:\n${conversationLog.join('\n')}`);
        console.log(`💡 User Interested: ${userInterested}`);
        if (conversationLog.length > 0 && brandId && brandId.match(/^[0-9a-fA-F]{24}$/)) {
            try {
                let lead = await Lead_1.Lead.findOne({ businessId: brandId, phone: 'web-call' });
                if (!lead) {
                    lead = await Lead_1.Lead.create({
                        businessId: brandId,
                        name: 'Web Caller',
                        phone: 'web-call',
                        email: '',
                        status: userInterested ? 'contacted' : 'new',
                        source: 'Voice Call',
                        score: userInterested ? 70 : 30,
                        notes: 'Call conducted via Web Voice Agent'
                    });
                }
                else {
                    lead.updatedAt = new Date();
                    if (userInterested)
                        lead.status = 'contacted';
                    await lead.save();
                }
                await Transcript_1.Transcript.create({
                    businessId: brandId,
                    leadId: lead._id,
                    text: conversationLog.join('\n'),
                    durationSeconds: callDuration,
                    sentiment: userInterested ? 'positive' : 'neutral',
                    intent: userInterested ? 'Sales/Inquiry' : 'General Question'
                });
                console.log('✅ Lead & Transcript saved directly to MongoDB');
            }
            catch (err) {
                console.error('❌ Failed to save lead/transcript:', err);
            }
        }
    });
};
exports.handleWebConnection = handleWebConnection;
//# sourceMappingURL=webCallController.js.map