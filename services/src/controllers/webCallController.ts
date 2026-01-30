import { WebSocket } from 'ws';
import { Request } from 'express';
import axios from 'axios';
import { createClient, LiveTranscriptionEvents } from '@deepgram/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

// Configuration
const DEEPGRAM_API_KEY = process.env.DEEPGRAM_API_KEY!;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

if (!DEEPGRAM_API_KEY || !GEMINI_API_KEY) {
    console.warn('❌ Missing API Keys for Voice Service');
}

const deepgram = createClient(DEEPGRAM_API_KEY);
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

interface BrandData {
    name: string;
    businessHours?: string;
    knowledgeBase?: {
        services?: Array<{ name: string; price: string }>;
        customInstructions?: string;
        contactPhone?: string;
        businessHours?: string;
    };
    location?: {
        address?: string;
    };
}

// Helper: Fetch Brand Data from Public Backend API
async function fetchBrandData(brandId: string): Promise<BrandData | null> {
    try {
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

    return `
Role: You are the AI Receptionist for ${brand.name}.
Context: ${kb.customInstructions || 'Be polite and helpful.'}

Facts:
- Business Hours: ${kb.businessHours || brand.businessHours || 'Not specified'}
- Address: ${brand.location?.address || 'Not specified'}
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
export const handleWebConnection = async (ws: WebSocket, req: Request) => {
    console.log('📞 New Voice Call Connection');

    // 1. Parse Params
    const url = new URL(req.url!, `http://${req.headers.host}`);
    const brandId = url.searchParams.get('brandId');

    if (!brandId) {
        console.error('❌ Missing brandId');
        ws.close(1008, 'Missing brandId');
        return;
    }

    // 2. Fetch Data
    const brand = await fetchBrandData(brandId);
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
        live.on(LiveTranscriptionEvents.Transcript, async (data) => {
            const transcript = data.channel.alternatives[0].transcript;
            
            if (transcript && data.is_final) {
                console.log(`🗣️ User: ${transcript}`);
                
                // 5. Send to Gemini
                try {
                    console.log(`➡️ Sending to Gemini: "${transcript}"`);
                    const result = await chat.sendMessage(transcript);
                    const responseText = result.response.text();
                    console.log(`🤖 AI Response: "${responseText}"`);

                    if (!responseText) {
                        console.warn('⚠️ Gemini returned empty response');
                        return;
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
           // console.log(`🎤 Received Audio Chunk: ${data.length} bytes`); // Uncomment for deep debug
            if (live.getReadyState() === 1) { // OPEN
                live.send(data as any);
            }
        } else {
            console.log('📩 Received Text/Other:', data);
        }
    });

    ws.on('close', () => {
        console.log('Call Ended');
        live.finish();
    });
};
