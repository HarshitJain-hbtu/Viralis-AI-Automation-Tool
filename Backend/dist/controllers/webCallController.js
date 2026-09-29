"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleVoiceChatMessage = exports.handleWebConnection = void 0;
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
    // 3. Setup Gemini with systemInstruction for accurate persona grounding
    const model = genAI.getGenerativeModel({
        model: 'gemini-3.5-flash-lite',
        systemInstruction: systemPrompt
    });
    const chat = model.startChat();
    conversationLog.push(`AI: ${greetingText}`);
    // Helper: Safely send JSON payload to client
    const sendJsonSafe = (payload) => {
        if (ws.readyState === ws_1.WebSocket.OPEN) {
            try {
                ws.send(JSON.stringify(payload));
            }
            catch (e) {
                console.error('Failed to send JSON over WebSocket:', e);
            }
        }
    };
    // Helper: Synthesize and send TTS audio
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
            console.error('❌ Error generating TTS:', ttsErr?.message || ttsErr);
            sendJsonSafe({
                type: 'error',
                message: 'Voice synthesis temporarily unavailable, but message was processed.'
            });
        }
    };
    // Concurrency lock for AI processing
    let isProcessing = false;
    // Core handler: Process user input (from Voice STT or Manual Text Input)
    const processUserMessage = async (userInput, source) => {
        const trimmed = userInput?.trim();
        if (!trimmed)
            return;
        if (isProcessing) {
            console.log(`⏳ Busy processing another message. Skipping duplicate: "${trimmed}"`);
            return;
        }
        isProcessing = true;
        // Clear any pending auto-disconnect
        if (disconnectTimer) {
            clearTimeout(disconnectTimer);
            disconnectTimer = null;
            console.log('🔄 User active, cancelled auto-disconnect.');
        }
        console.log(`🗣️ [${source.toUpperCase()}] User: ${trimmed}`);
        conversationLog.push(`User: ${trimmed}`);
        // 1. Emit user transcript and processing state to frontend
        sendJsonSafe({
            type: 'transcript',
            sender: 'user',
            text: trimmed,
            timestamp: Date.now()
        });
        sendJsonSafe({ type: 'state', state: 'processing' });
        try {
            // 2. Query Gemini chat
            console.log(`➡️ Sending to Gemini: "${trimmed}"`);
            const result = await chat.sendMessage(trimmed);
            const responseText = result.response.text()?.trim() ||
                `Thank you for reaching out to ${brand.name}. How else can I assist you?`;
            console.log(`🤖 AI Response: "${responseText}"`);
            conversationLog.push(`AI: ${responseText}`);
            // 3. Emit AI transcript to frontend chat
            sendJsonSafe({
                type: 'transcript',
                sender: 'ai',
                text: responseText,
                timestamp: Date.now()
            });
            // 4. Check for customer interest / lead conversion trigger
            const isClosing = userInterested && CLOSING_PHRASES.some(p => responseText.toLowerCase().includes(p));
            const isNewInterest = detectInterest(responseText) || detectInterest(trimmed);
            if (isNewInterest || isClosing) {
                if (isNewInterest) {
                    userInterested = true;
                    console.log('✅ Lead intent detected! Opening lead modal.');
                }
                sendJsonSafe({ type: 'interest_detected', interested: true });
                if (!disconnectTimer) {
                    console.log('⏳ Scheduling auto-disconnect in 15s for lead capture...');
                    disconnectTimer = setTimeout(() => {
                        if (ws.readyState === ws_1.WebSocket.OPEN) {
                            console.log('🤖 Auto-disconnecting call to prioritize lead form...');
                            ws.close(1000, 'Lead Intent Reached');
                        }
                    }, 15000);
                }
            }
            // 5. Emit speaking state and synthesize voice audio
            sendJsonSafe({ type: 'state', state: 'speaking' });
            await sendTTSResponse(responseText);
        }
        catch (err) {
            console.error('❌ Error in AI conversational pipeline:', err?.message || err);
            const fallbackText = "I'm having a brief connection issue. Could you please repeat that or send a message?";
            sendJsonSafe({
                type: 'transcript',
                sender: 'ai',
                text: fallbackText,
                timestamp: Date.now()
            });
            await sendTTSResponse(fallbackText);
        }
        finally {
            isProcessing = false;
            sendJsonSafe({ type: 'state', state: 'listening' });
        }
    };
    // Send initial spoken greeting and chat bubble when client connects
    setTimeout(async () => {
        if (ws.readyState === ws_1.WebSocket.OPEN) {
            sendJsonSafe({
                type: 'transcript',
                sender: 'ai',
                text: greetingText,
                timestamp: Date.now()
            });
            sendJsonSafe({ type: 'state', state: 'speaking' });
            await sendTTSResponse(greetingText);
            sendJsonSafe({ type: 'state', state: 'listening' });
        }
    }, 500);
    // 4. Setup Deepgram STT (Live Transcription)
    const live = deepgram.listen.live({
        model: 'nova-2',
        language: 'en-US',
        smart_format: true,
        encoding: 'linear16',
        sample_rate: 16000,
        endpointing: 300,
        interim_results: false,
    });
    live.on(sdk_1.LiveTranscriptionEvents.Open, () => {
        console.log('🎤 Deepgram STT Connected and Listening');
        sendJsonSafe({ type: 'stt_ready' });
    });
    live.on(sdk_1.LiveTranscriptionEvents.Transcript, async (data) => {
        const transcript = data.channel?.alternatives?.[0]?.transcript?.trim();
        const isFinal = data.is_final || data.speech_final;
        if (transcript && isFinal) {
            console.log(`🎙️ Deepgram recognized speech: "${transcript}"`);
            await processUserMessage(transcript, 'voice');
        }
    });
    live.on(sdk_1.LiveTranscriptionEvents.Error, (err) => {
        console.error('Deepgram STT Error:', err);
        sendJsonSafe({ type: 'error', message: 'Speech recognition error. You can still type below.' });
    });
    live.on(sdk_1.LiveTranscriptionEvents.Close, () => {
        console.log('Deepgram STT closed');
    });
    // 5. Handle Incoming Messages from Client (Audio PCM Chunks OR JSON Controls)
    ws.on('message', async (data) => {
        try {
            // Check if incoming payload is a JSON command or text message
            let textCandidate = null;
            if (typeof data === 'string') {
                textCandidate = data.trim();
            }
            else if (Buffer.isBuffer(data)) {
                // If it starts with ASCII for '{' (123) or '[' (91)
                const firstByte = data[0];
                if (firstByte === 123 || firstByte === 91) {
                    try {
                        textCandidate = data.toString('utf-8').trim();
                    }
                    catch {
                        textCandidate = null;
                    }
                }
            }
            if (textCandidate && (textCandidate.startsWith('{') || textCandidate.startsWith('['))) {
                try {
                    const parsed = JSON.parse(textCandidate);
                    if (parsed.type === 'user_message' && parsed.text) {
                        console.log(`📩 [WS] Received manual user query: "${parsed.text}"`);
                        await processUserMessage(parsed.text, 'text');
                        return;
                    }
                    else if (parsed.type === 'interrupt') {
                        console.log('🛑 Client interrupted audio playback');
                        sendJsonSafe({ type: 'state', state: 'listening' });
                        return;
                    }
                    else if (parsed.type === 'ping') {
                        sendJsonSafe({ type: 'pong' });
                        return;
                    }
                }
                catch {
                    // Not valid JSON, continue to audio forwarding
                }
            }
            // Case B: Binary PCM audio chunk from microphone
            const buf = Buffer.isBuffer(data) ? data : Buffer.from(data);
            if (live.getReadyState() === 1) { // OPEN
                live.send(buf);
            }
        }
        catch (err) {
            console.error('Error handling WebSocket incoming message:', err);
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
/**
 * REST Endpoint for Voice Receptionist Chat Messages
 * Provides an instant fallback if WebSockets are blocked by proxies or browser policies
 */
const handleVoiceChatMessage = async (req, res) => {
    try {
        const { brandId, message, conversationHistory } = req.body;
        if (!brandId || !message) {
            return res.status(400).json({ error: "brandId and message are required." });
        }
        const brand = await fetchBrandData(brandId);
        if (!brand) {
            return res.status(404).json({ error: "Brand profile not found." });
        }
        const systemPrompt = createSystemPrompt(brand);
        const model = genAI.getGenerativeModel({
            model: 'gemini-3.5-flash-lite',
            systemInstruction: systemPrompt
        });
        // Format history starting from user role
        const history = [];
        if (Array.isArray(conversationHistory) && conversationHistory.length > 0) {
            for (const item of conversationHistory) {
                if (item.text && item.sender) {
                    history.push({
                        role: item.sender === 'user' ? 'user' : 'model',
                        parts: [{ text: item.text }]
                    });
                }
            }
        }
        // Validate that first item is from 'user'
        const validHistory = history.length > 0 && history[0].role === 'user' ? history : [];
        const chat = model.startChat({ history: validHistory });
        const result = await chat.sendMessage(message);
        const responseText = result.response.text()?.trim() ||
            `Thank you for contacting ${brand.name}. How else can I help you today?`;
        // Synthesize TTS audio if Deepgram is configured
        let audioBase64 = null;
        if (deepgram) {
            try {
                const ttsResponse = await deepgram.speak.request({ text: responseText }, { model: 'aura-asteria-en' });
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
                    audioBase64 = Buffer.concat(chunks).toString('base64');
                }
            }
            catch (ttsErr) {
                console.warn("REST TTS generation warning:", ttsErr?.message || ttsErr);
            }
        }
        return res.status(200).json({
            sender: 'ai',
            text: responseText,
            audioBase64,
            timestamp: Date.now()
        });
    }
    catch (err) {
        console.error("Error in handleVoiceChatMessage:", err);
        return res.status(500).json({ error: "Failed to process chat message", details: err.message });
    }
};
exports.handleVoiceChatMessage = handleVoiceChatMessage;
//# sourceMappingURL=webCallController.js.map