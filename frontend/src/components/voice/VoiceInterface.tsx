'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Phone, Wifi, Video, VideoOff, Volume2, User, MicOff, MapPin, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
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
  const [transcript, setTranscript] = useState<string>('');
  const [isTalking, setIsTalking] = useState(false); // Validating if user or AI is talking for visuals
  const [showContact, setShowContact] = useState(false);


  // Refs
  const wsRef = useRef<WebSocket | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      endCall();
    };
  }, []);

  const startCall = async () => {
    setStatus('CONNECTING');
    try {
      // 1. Get Mic Permission
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      setMicPermission(true);

      // 2. Connect WebSocket
      const wsUrl = `ws://localhost:8080?brandId=${brandId}`; // Adjust if deployed
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setStatus('LIVE');
        setupAudioProcessing(stream);
      };

      ws.onmessage = async (event) => {
        if (event.data instanceof Blob) {
          // Received Audio Blob from AI
          playAudioBlob(event.data);
          setIsTalking(true);
          setTimeout(() => setIsTalking(false), 2000); // Simple visual fallback
        } else {
          // Maybe text?
          console.log('Received text:', event.data);
        }
      };

      ws.onerror = (err) => {
        console.error('WebSocket Error', err);
        setStatus('ERROR');
        toast.error('Connection failed. Please try again.');
      };

      ws.onclose = () => {
        if (status === 'LIVE') {
          setStatus('IDLE');
          toast.info('Call ended');
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
        // Downsample to 16kHz
        const downsampled = downsampleBuffer(inputData, audioContext.sampleRate, 16000);
        const buffer = convertFloat32ToInt16(downsampled);
        wsRef.current.send(buffer);
      }
    };
  };

  const downsampleBuffer = (buffer: Float32Array, sampleRate: number, outSampleRate: number) => {
    if (outSampleRate === sampleRate) {
      return buffer;
    }
    if (outSampleRate > sampleRate) {
      return buffer; // Cannot upsample effectively this way
    }
    const sampleRateRatio = sampleRate / outSampleRate;
    const newLength = Math.round(buffer.length / sampleRateRatio);
    const result = new Float32Array(newLength);
    let offsetResult = 0;
    let offsetBuffer = 0;
    while (offsetResult < result.length) {
      const nextOffsetBuffer = Math.round((offsetResult + 1) * sampleRateRatio);
      // Accumulate
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
      // Clamp the value between -1 and 1
      const s = Math.max(-1, Math.min(1, buffer[l]));
      // Convert to 16-bit PCM
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

  const endCall = () => {
    wsRef.current?.close();
    mediaStreamRef.current?.getTracks().forEach(track => track.stop());
    audioContextRef.current?.close();
    setStatus('IDLE');
  };

  return (
    <div className="flex flex-col h-[100dvh] bg-[#FDFCFF] text-gray-900 overflow-hidden relative font-sans selection:bg-purple-100">
      {/* Background Ambience (Light Mode) */}
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
            {status === 'LIVE' ? '00:00' : status}
          </span>
        </div>
      </header>

      {/* Main Content (Orb) */}
      <main className="flex-1 flex flex-col items-center justify-center relative z-0">

        {/* The Orb */}
        <div className="relative group cursor-pointer" onClick={status === 'IDLE' ? startCall : undefined}>
          {/* Ping Animations (Light Mode) */}
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
                {/* Fake Waveform */}
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

        {/* Status Text / Transcript */}
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

      <Dialog open={showContact} onOpenChange={setShowContact}>
        <DialogContent className="sm:max-w-md bg-white border-0 shadow-2xl rounded-3xl overflow-hidden">
          <div className="absolute inset-0 h-32 bg-gradient-to-br from-purple-500/10 to-blue-500/10 z-0 pointer-events-none" />

          <DialogHeader className="relative z-10 pt-4 px-2">
            <DialogTitle className="text-2xl font-bold text-gray-900 text-center">Contact {brand.name}</DialogTitle>
            <DialogDescription className="text-center text-gray-500">
              Prefer to speak with a real person? API details below.
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
              <a href={`tel:${brand.knowledgeBase?.contactPhone}`} className="bg-white p-2 rounded-full shadow-sm text-green-600 hover:bg-green-50 transition-colors">
                <Phone className="w-4 h-4" />
              </a>
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
                <p className="text-xs text-gray-400">
                  {brand.location?.city || ''} {brand.location?.country ? `, ${brand.location.country}` : ''}
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
