import { WebSocket } from 'ws';
import { Request } from 'express';
import axios from 'axios';
import { createClient, LiveTranscriptionEvents } from '@deepgram/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';


import path from 'path';

// Explicitly load .env from Backend root (src/controllers/../..)
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Configuration
const DEEPGRAM_API_KEY = process.env.DEEPGRAM_API_KEY!;
// Use existing env config or fallback to process.env
const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;
// Since we are now IN the backend, we don't need an external URL for self-calls usually, 
// but for the public API fetch we might still use it or refactor to internal calls.
// For simplicity of migration, we'll keep the http fetch but point to localhost:PORT if not defined.
const PORT = process.env.PORT || 8080;
const BACKEND_URL = process.env.BACKEND_URL || `http://localhost:${PORT}`;

if (!DEEPGRAM_API_KEY || !GEMINI_API_KEY) {
    console.warn('❌ Missing API Keys for Voice Service');
}

const deepgram = DEEPGRAM_API_KEY ? createClient(DEEPGRAM_API_KEY) : null;
const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

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

interface BrandData {
    name: string;
    description?: string;
    industryMode?: string;
    businessHours?: string;
    brandVoice?: {
        tone?: string;
    };
    knowledgeBase?: {
        services?: Array<{ name: string; price: string }>;
        customInstructions?: string;
        contactPhone?: string;
        businessHours?: string;
        address?: string;
    };
    location?: {
        address?: string;
        city?: string;
        country?: string;
    };
}

// Helper: Fetch Brand Data from Public Backend API
async function fetchBrandData(brandId: string): Promise<BrandData | null> {
    try {
        // Optimization: Could we call the controller directly? 
        // For now, HTTP loopback is safer to ensure all middleware runs.
        const response = await axios.get(`${BACKEND_URL}/api/public/brand/${brandId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching brand ${brandId}:`, error);
        return null;
    }
}

// Helper: Construct System Prompt
function createSystemPrompt(brand: BrandData): string {
    const kb = brand.knowledgeBase || {};
    const servicesList = kb.services
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
Role: You are the AI Receptionist for ${brand.name}.
${industryContext}
${businessDesc}
${toneInstruction}

Context: ${kb.customInstructions || 'Be polite and helpful.'}

Facts:
- Business Hours: ${kb.businessHours || brand.businessHours || 'Not specified'}
- Address: ${kb.address || brand.location?.address || 'Not specified'} ${brand.location?.city ? `(${brand.location.city})` : ''}
- Contact/Handoff: ${kb.contactPhone || 'Not specified'}

Services & Pricing:
${servicesList}

Guardrails:
- Keep responses brief (1-2 sentences).
- Never invent prices. Only quote from the list above.
- If the user wants to **BUY**, **PURCHASE**, **CONNECT**, or **SCHEDULE**, you MUST say: "Great! Please fill out the form so we can assist you with that." or "Please provide your details in the form."
- If you don't know, offer to take a message.
- If the user is NOT interested, just say goodbye politely. Do NOT ask for the form.
    `.trim();
}

// Helper: Check if response indicates interest
function detectInterest(text: string): boolean {
    const lowerText = text.toLowerCase();
    return INTEREST_PHRASES.some(phrase => lowerText.includes(phrase));
}

// Main Handler
export const handleWebConnection = async (ws: WebSocket, req: Request) => {
    console.log('📞 New Voice Call Connection');

    // === CALL STATE TRACKING ===
    const callStartTime = Date.now();
    const conversationLog: string[] = [];
    let userInterested = false;
    let brandId: string | null = null;
    let disconnectTimer: NodeJS.Timeout | null = null;

    // 1. Parse Params
    const url = new URL(req.url!, `http://${req.headers.host}`);
    brandId = url.searchParams.get('brandId');

    if (!brandId) {
        console.error('❌ Missing brandId');
        ws.close(1008, 'Missing brandId');
        return;
    }

    // 2. Fetch Data
    const brand = await fetchBrandData(brandId);

    // Check if services are available
    if (!deepgram || !genAI) {
        console.error('❌ Voice Service unavailable: Missing API Keys');
        ws.close(1011, 'Voice Service Unavailable (Missing Keys)');
        return;
    }

    if (!brand) {
        console.error('❌ Brand not found or API error');
        ws.close(1011, 'Brand Data Unavailable');
        return;
    }

    console.log(`✅ Loaded Persona: ${brand.name}`);
    console.log('🔍 Debug KnowledgeBase:', JSON.stringify(brand.knowledgeBase, null, 2));

    const systemPrompt = createSystemPrompt(brand);
    console.log('📝 System Prompt:', systemPrompt);

    // 3. Setup Gemini
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });
    const chat = model.startChat({
        history: [
            {
                role: 'user',
                parts: [{ text: systemPrompt }]
            },
            {
                role: 'model',
                parts: [{ text: 'Understood. I am ready to act as the receptionist.' }]
            }
        ]
    });

    // 4. Setup Deepgram STT (Listen)
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
        live.on(LiveTranscriptionEvents.Transcript, async (data) => {
            const transcript = data.channel.alternatives[0].transcript;

            if (transcript && data.is_final) {
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
                    // Check if new interest found OR if we should close (because we already have interest and are saying bye)
                    const isClosing = userInterested && CLOSING_PHRASES.some(p => responseText.toLowerCase().includes(p));
                    const isNewInterest = detectInterest(responseText);

                    if (isNewInterest || isClosing) {
                        if (isNewInterest) {
                            userInterested = true;
                            console.log('✅ Interest detected! User wants to connect.');
                        }

                        // Send signal to client
                        if (ws.readyState === WebSocket.OPEN) {
                            // Only send 'interest' event if it's new, but always schedule disconnect
                            if (isNewInterest) {
                                ws.send(JSON.stringify({ type: 'interest_detected', interested: true }));
                            }

                            // Auto-disconnect after 10 seconds (allow TTS to finish)
                            // Only set if not already pending
                            if (!disconnectTimer) {
                                console.log('⏳ Scheduling auto-disconnect in 10s...');
                                disconnectTimer = setTimeout(() => {
                                    if (ws.readyState === WebSocket.OPEN) {
                                        console.log('🤖 Auto-disconnecting call to show form...');
                                        ws.close(1000, 'Goal Reached');
                                    }
                                }, 10000);
                            }
                        }
                    }

                    // 6. Generate TTS (Speak)
                    console.log('🗣️ Requesting TTS from Deepgram...');
                    const ttsResponse = await deepgram.speak.request(
                        { text: responseText },
                        { model: 'aura-asteria-en' }
                    );

                    const stream = await ttsResponse.getStream();
                    if (stream) {
                        console.log('🌊 TTS Stream received, buffering...');
                        const reader = stream.getReader();
                        const chunks = [];

                        while (true) {
                            const { done, value } = await reader.read();
                            if (done) break;
                            chunks.push(value);
                        }

                        // Combine chunks into one buffer
                        const combinedBuffer = Buffer.concat(chunks);
                        console.log(`🔊 Sending TTS Audio Loop: ${combinedBuffer.length} bytes`);

                        if (ws.readyState === WebSocket.OPEN) {
                            ws.send(combinedBuffer);
                            console.log('✅ Audio sent to client');
                        } else {
                            console.warn('⚠️ WebSocket closed before audio could be sent');
                        }
                    } else {
                        console.error('❌ No stream in TTS response');
                    }

                } catch (err) {
                    console.error('❌ Error in AI processing pipeline:', err);
                }
            }
        });
    });

    // Event: Error
    live.on('error', (err) => {
        console.error('Deepgram Error:', err);
    });

    // 7. Pipe Client Audio -> Deepgram
    ws.on('message', (data) => {
        if (Buffer.isBuffer(data)) {
            if (live.getReadyState() === 1) { // OPEN
                live.send(data as any);
            }
        } else {
            console.log('📩 Received Text/Other:', data);
        }
    });

    // === ON CALL CLOSE: POST WEBHOOK ===
    ws.on('close', async () => {
        console.log('📴 Call Ended');
        live.finish();

        const callDuration = Math.round((Date.now() - callStartTime) / 1000);
        console.log(`⏱️ Call Duration: ${callDuration} seconds`);
        console.log(`📋 Conversation:\n${conversationLog.join('\n')}`);
        console.log(`💡 User Interested: ${userInterested}`);

        // POST to Backend Webhook to create Lead/Transcript
        try {
            const webhookPayload = {
                callerNumber: 'web-call',
                callerName: 'Web Visitor',
                transcript: conversationLog.join('\n'),
                duration: callDuration,
                sentiment: 'neutral', // Could be enhanced with AI analysis
                status: 'completed',
                userInterested: userInterested
            };

            console.log('📤 Posting to Backend Webhook:', JSON.stringify(webhookPayload, null, 2));
            await axios.post(`${BACKEND_URL}/api/voice/webhook`, webhookPayload);
            console.log('✅ Webhook POST successful');
        } catch (err) {
            console.error('❌ Failed to post webhook:', err);
        }
    });
};
