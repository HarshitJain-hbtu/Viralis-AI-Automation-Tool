'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Phone, Wifi, Volume2, User, MapPin, Clock, Send, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface VoiceInterfaceProps {
  brand: any;
  brandId: string;
}

type ConnectionStatus = 'IDLE' | 'CONNECTING' | 'LIVE' | 'ERROR';

export default function VoiceInterface({ brand, brandId }: VoiceInterfaceProps) {
  const [status, setStatus] = useState<ConnectionStatus>('IDLE');
  const [micPermission, setMicPermission] = useState<boolean>(false);
  const [isTalking, setIsTalking] = useState(false);
  const [showContact, setShowContact] = useState(false);

  // New State for Lead Capture
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [userInterested, setUserInterested] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [leadFormData, setLeadFormData] = useState({ name: '', phone: '', email: '' });

  // Refs
  const wsRef = useRef<WebSocket | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const callStartTimeRef = useRef<number>(0);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const endCall = () => {
    wsRef.current?.close();
    mediaStreamRef.current?.getTracks().forEach(track => track.stop());
    audioContextRef.current?.close();
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    setStatus('IDLE');
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      endCall();
    };
  }, []);

  const startCall = async () => {
    setStatus('CONNECTING');
    setUserInterested(false);
    setShowLeadForm(false);
    setLeadSubmitted(false);
    setCallDuration(0);

    try {
      // 1. Get Mic Permission
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      setMicPermission(true);

      // 2. Connect WebSocket
      // 2. Connect WebSocket
      let voiceUrl = process.env.NEXT_PUBLIC_VOICE_URL;

      // Smart Fallback: Derive WS URL from API URL if explicit Voice URL is missing
      if (!voiceUrl) {
        // Default to localhost if neither is set
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        // transform https://.../api -> wss://...
        // transform http://.../api -> ws://...
        voiceUrl = apiUrl
          .replace(/^http/, 'ws')       // http->ws, https->wss
          .replace(/\/api\/?$/, '');    // remove '/api' suffix
      }

      console.log('🔌 Connecting to Voice Server:', voiceUrl);
      const wsUrl = `${voiceUrl}?brandId=${brandId}`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setStatus('LIVE');
        callStartTimeRef.current = Date.now();
        setupAudioProcessing(stream);

        // Start timer
        timerIntervalRef.current = setInterval(() => {
          setCallDuration(Math.floor((Date.now() - callStartTimeRef.current) / 1000));
        }, 1000);
      };

      ws.onmessage = async (event) => {
        if (event.data instanceof Blob) {
          // Received Audio Blob from AI
          playAudioBlob(event.data);
          setIsTalking(true);
          setTimeout(() => setIsTalking(false), 2000);
        } else if (typeof event.data === 'string') {
          // Check for JSON signals
          try {
            const msg = JSON.parse(event.data);
            if (msg.type === 'interest_detected' && msg.interested) {
              console.log('📩 Interest signal received from server');
              setUserInterested(true);
              // Show form immediately so user doesn't have to wait for call to end
              if (!showLeadForm) {
                setShowLeadForm(true);
                toast.success('Interest detected! Form opened.');
              }
            }
          } catch {
            console.log('Received text:', event.data);
          }
        }
      };

      ws.onerror = (err) => {
        console.error('WebSocket Error', err);
        setStatus('ERROR');
        toast.error('Connection failed. Please try again.');
      };

      ws.onclose = () => {
        if (timerIntervalRef.current) {
          clearInterval(timerIntervalRef.current);
        }
        if (status === 'LIVE') {
          // Show lead form if user was interested
          if (userInterested) {
            setShowLeadForm(true);
            toast.success('Thank you for connecting! Please leave your details.');
          } else {
            toast.info('Call ended. Thank you!');
          }
          setStatus('IDLE');
        }
      };

    } catch (err) {
      console.error('Mic Error', err);
      setStatus('ERROR');
      toast.error('Microphone access denied or error.');
    }
  };

  const setupAudioProcessing = async (stream: MediaStream) => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    audioContextRef.current = audioContext;

    await audioContext.resume();
    console.log(`🎤 Native Sample Rate: ${audioContext.sampleRate}`);

    const source = audioContext.createMediaStreamSource(stream);
    const processor = audioContext.createScriptProcessor(4096, 1, 1);

    source.connect(processor);
    processor.connect(audioContext.destination);

    processor.onaudioprocess = (e) => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        const inputData = e.inputBuffer.getChannelData(0);
        const downsampled = downsampleBuffer(inputData, audioContext.sampleRate, 16000);
        const buffer = convertFloat32ToInt16(downsampled);
        wsRef.current.send(buffer);
      }
    };
  };

  const downsampleBuffer = (buffer: Float32Array, sampleRate: number, outSampleRate: number) => {
    if (outSampleRate === sampleRate) return buffer;
    if (outSampleRate > sampleRate) return buffer;
    const sampleRateRatio = sampleRate / outSampleRate;
    const newLength = Math.round(buffer.length / sampleRateRatio);
    const result = new Float32Array(newLength);
    let offsetResult = 0;
    let offsetBuffer = 0;
    while (offsetResult < result.length) {
      const nextOffsetBuffer = Math.round((offsetResult + 1) * sampleRateRatio);
      let accum = 0, count = 0;
      for (let i = offsetBuffer; i < nextOffsetBuffer && i < buffer.length; i++) {
        accum += buffer[i];
        count++;
      }
      result[offsetResult] = accum / count;
      offsetResult++;
      offsetBuffer = nextOffsetBuffer;
    }
    return result;
  };

  const convertFloat32ToInt16 = (buffer: Float32Array) => {
    let l = buffer.length;
    const buf = new Int16Array(l);
    while (l--) {
      const s = Math.max(-1, Math.min(1, buffer[l]));
      buf[l] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }
    return buf.buffer;
  };

  const playAudioBlob = async (blob: Blob) => {
    try {
      const arrayBuffer = await blob.arrayBuffer();
      if (!audioContextRef.current) return;

      const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer);
      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContextRef.current.destination);
      source.start(0);
    } catch (e) {
      console.error('Audio Playback Error', e);
    }
  };



  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/voice/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          callerNumber: leadFormData.phone || 'web-form',
          callerName: leadFormData.name || 'Web Visitor',
          email: leadFormData.email,
          transcript: 'Lead captured via form after voice call',
          duration: callDuration,
          sentiment: 'positive',
          status: 'lead_captured',
          userInterested: true
        })
      });

      if (response.ok) {
        setLeadSubmitted(true);
        toast.success('Thank you! We will contact you soon.');
      } else {
        toast.error('Failed to submit. Please try again.');
      }
    } catch (err) {
      console.error('Lead submit error:', err);
      toast.error('Connection error. Please try again.');
    }
  };

  return (
    <div className="flex flex-col h-[100dvh] bg-[#FDFCFF] text-gray-900 overflow-hidden relative font-sans selection:bg-purple-100">
      {/* Background Ambience */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-purple-200/40 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-200/40 rounded-full blur-[120px]" />
      </div>

      {/* Header */}
      <header className="absolute top-0 w-full p-6 flex justify-between items-start z-10">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900">
            {brand.name || 'AI Assistant'}
          </h1>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="flex h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]"></span>
            <span className="text-xs text-gray-500 font-medium tracking-wider uppercase">Verified AI Agent</span>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-md border border-gray-200 shadow-sm rounded-full px-3 py-1.5 flex items-center gap-2">
          <div className={cn("w-2 h-2 rounded-full transition-colors duration-300", status === 'LIVE' ? "bg-green-500 animate-pulse" : "bg-gray-300")} />
          <span className="text-xs font-mono text-gray-500 font-medium">
            {status === 'LIVE' ? formatDuration(callDuration) : status}
          </span>
        </div>
      </header>

      {/* Main Content (Orb) */}
      <main className="flex-1 flex flex-col items-center justify-center relative z-0">

        {/* The Orb */}
        <div className="relative group cursor-pointer" onClick={status === 'IDLE' ? startCall : undefined}>
          {/* Ping Animations */}
          {status === 'LIVE' && (
            <>
              <motion.div
                animate={{ scale: [1, 2.5], opacity: [0.3, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }}
                className="absolute inset-0 bg-purple-500/10 rounded-full blur-md"
              />
              <motion.div
                animate={{ scale: [1, 1.8], opacity: [0.5, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeOut", delay: 0.5 }}
                className="absolute inset-0 bg-blue-500/10 rounded-full blur-md"
              />
            </>
          )}

          {/* Core Orb Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            className={cn(
              "w-48 h-48 rounded-full relative flex items-center justify-center transition-all duration-500 shadow-xl",
              status === 'IDLE' && "bg-white border text-gray-300 hover:border-purple-200 hover:shadow-2xl hover:scale-105",
              status === 'CONNECTING' && "bg-white border-2 border-purple-100 animate-pulse",
              status === 'LIVE' && "bg-gradient-to-br from-white to-purple-50 border border-purple-100 shadow-[0_10px_40px_rgba(168,85,247,0.15)]"
            )}
          >
            {status === 'IDLE' && <Mic className="w-12 h-12 text-gray-300 group-hover:text-purple-500 transition-colors" />}
            {status === 'CONNECTING' && <Wifi className="w-12 h-12 text-purple-400 animate-bounce" />}

            {status === 'LIVE' && (
              <motion.div
                animate={isTalking ? { height: [20, 40, 20] } : { height: 20 }}
                transition={{ repeat: Infinity, duration: 0.5 }}
                className="flex items-center gap-1.5"
              >
                {[1, 2, 3, 4, 5].map(i => (
                  <motion.div
                    key={i}
                    animate={{ height: isTalking ? [15, 40, 15] : [10, 16, 10] }}
                    transition={{ repeat: Infinity, duration: 1, delay: i * 0.1 }}
                    className="w-2 bg-gradient-to-t from-purple-500 to-blue-500 rounded-full"
                  />
                ))}
              </motion.div>
            )}
          </motion.button>
        </div>

        {/* Status Text */}
        <div className="mt-12 px-8 text-center max-w-md h-20">
          {status === 'IDLE' && (
            <p className="text-gray-400 text-sm font-medium animate-pulse">Tap the microphone to start</p>
          )}
          {status === 'CONNECTING' && (
            <p className="text-gray-500 text-sm font-medium">Connecting to secure agent...</p>
          )}
          {status === 'LIVE' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-2"
            >
              <p className="text-gray-900 text-lg font-semibold leading-relaxed">
                {isTalking ? "Speaking..." : "Listening..."}
              </p>
              <p className="text-xs text-gray-400 font-medium">Powered by Viralis AI</p>
            </motion.div>
          )}
        </div>

      </main>

      {/* Footer Actions */}
      <footer className="p-8 pb-10 flex flex-col gap-4 z-10 w-full max-w-md mx-auto">
        {status === 'LIVE' ? (
          <Button
            onClick={endCall}
            className="w-full bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 py-6 text-lg rounded-2xl transition-all shadow-sm font-semibold"
          >
            <Phone className="w-5 h-5 mr-2 rotate-[135deg]" />
            End Conversation
          </Button>
        ) : (
          <Button
            variant="outline"
            onClick={() => setShowContact(true)}
            className="w-full border-gray-200 bg-white hover:bg-gray-50 text-gray-600 py-6 rounded-2xl shadow-sm transition-all font-semibold"
          >
            <User className="w-5 h-5 mr-2 text-gray-400" />
            Talk to Human
          </Button>
        )}
      </footer>

      {/* Lead Capture Form Dialog */}
      <Dialog open={showLeadForm && !leadSubmitted} onOpenChange={setShowLeadForm}>
        <DialogContent className="sm:max-w-md bg-white border-0 shadow-2xl rounded-3xl overflow-hidden">
          <div className="absolute inset-0 h-32 bg-gradient-to-br from-green-500/10 to-blue-500/10 z-0 pointer-events-none" />

          <DialogHeader className="relative z-10 pt-4 px-2">
            <DialogTitle className="text-2xl font-bold text-gray-900 text-center">Almost Done!</DialogTitle>
            <DialogDescription className="text-center text-gray-500">
              Thanks for connecting! Drop your details and we'll get back to you very soon.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleLeadSubmit} className="grid gap-4 py-4 relative z-10 px-2">
            <Input
              placeholder="Your Name"
              value={leadFormData.name}
              onChange={(e) => setLeadFormData({ ...leadFormData, name: e.target.value })}
              className="h-12 rounded-xl"
              required
            />
            <Input
              placeholder="Phone Number"
              type="tel"
              value={leadFormData.phone}
              onChange={(e) => setLeadFormData({ ...leadFormData, phone: e.target.value })}
              className="h-12 rounded-xl"
              required
            />
            <Input
              placeholder="Email (optional)"
              type="email"
              value={leadFormData.email}
              onChange={(e) => setLeadFormData({ ...leadFormData, email: e.target.value })}
              className="h-12 rounded-xl"
            />
            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white py-6 rounded-xl font-semibold gap-2">
              <Send className="w-4 h-4" />
              Submit
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={leadSubmitted} onOpenChange={() => setLeadSubmitted(false)}>
        <DialogContent className="sm:max-w-sm bg-white border-0 shadow-2xl rounded-3xl text-center p-8">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Thank You!</h2>
            <p className="text-gray-500 text-sm">We've received your details. Our team will reach out soon.</p>
            <Button onClick={() => setLeadSubmitted(false)} className="mt-4 bg-gray-900 hover:bg-gray-800 text-white rounded-xl px-8">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Contact Business Dialog (Original) */}
      <Dialog open={showContact} onOpenChange={setShowContact}>
        <DialogContent className="sm:max-w-md bg-white border-0 shadow-2xl rounded-3xl overflow-hidden">
          <div className="absolute inset-0 h-32 bg-gradient-to-br from-purple-500/10 to-blue-500/10 z-0 pointer-events-none" />

          <DialogHeader className="relative z-10 pt-4 px-2">
            <DialogTitle className="text-2xl font-bold text-gray-900 text-center">Contact {brand.name}</DialogTitle>
            <DialogDescription className="text-center text-gray-500">
              Prefer to speak with a real person? Details below.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-4 relative z-10 px-2">
            {/* Phone Card */}
            <div className="flex items-center gap-4 bg-green-50/50 p-4 rounded-2xl border border-green-100">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-green-800">Direct Line</p>
                <a href={`tel:${brand.knowledgeBase?.contactPhone}`} className="text-lg font-bold text-gray-900 hover:underline">
                  {brand.knowledgeBase?.contactPhone || 'Not Available'}
                </a>
              </div>
            </div>

            {/* Address Card */}
            <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <div className="w-12 h-12 bg-white text-gray-500 border border-gray-200 rounded-full flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Location</p>
                <p className="text-base font-semibold text-gray-900">
                  {brand.knowledgeBase?.address ||
                    [brand.location?.address, brand.location?.city, brand.location?.country].filter(Boolean).join(', ') ||
                    'Digital Only'}
                </p>
              </div>
            </div>

            {/* Hours Card */}
            <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <div className="w-12 h-12 bg-white text-gray-500 border border-gray-200 rounded-full flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Business Hours</p>
                <p className="text-base font-semibold text-gray-900">
                  {brand.knowledgeBase?.businessHours || 'Open 24/7'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-center pb-2">
            <Button variant="ghost" onClick={() => setShowContact(false)} className="text-gray-400 hover:text-gray-600">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
