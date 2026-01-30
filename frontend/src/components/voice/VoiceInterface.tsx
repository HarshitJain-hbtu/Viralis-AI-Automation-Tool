'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Phone, Wifi, Video, VideoOff, Volume2, User, MicOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

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
    <div className="flex flex-col h-[100dvh] bg-slate-950 text-white overflow-hidden relative font-sans">
      {/* Background Ambience */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px]" />
      </div>

      {/* Header */}
      <header className="absolute top-0 w-full p-6 flex justify-between items-start z-10">
        <div>
          <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            {brand.name || 'AI Assistant'}
          </h1>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="flex h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
            <span className="text-xs text-slate-400 font-medium tracking-wider uppercase">Verified AI Agent</span>
          </div>
        </div>
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-full px-3 py-1.5 flex items-center gap-2">
            <div className={cn("w-2 h-2 rounded-full", status === 'LIVE' ? "bg-green-500 animate-pulse" : "bg-slate-500")} />
            <span className="text-xs font-mono text-slate-300">
                {status === 'LIVE' ? '00:00' : status}
            </span>
        </div>
      </header>

      {/* Main Content (Orb) */}
      <main className="flex-1 flex flex-col items-center justify-center relative z-0">
        
        {/* The Orb */}
        <div className="relative">
            {/* Ping Animations */}
            {status === 'LIVE' && (
                <>
                    <motion.div 
                        animate={{ scale: [1, 2.5], opacity: [0.3, 0] }}
                        transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }}
                        className="absolute inset-0 bg-cyan-500/20 rounded-full blur-md"
                    />
                     <motion.div 
                        animate={{ scale: [1, 1.8], opacity: [0.5, 0] }}
                        transition={{ repeat: Infinity, duration: 2, ease: "easeOut", delay: 0.5 }}
                        className="absolute inset-0 bg-blue-500/20 rounded-full blur-md"
                    />
                </>
            )}

            {/* Core Orb Button */}
            <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={status === 'IDLE' ? startCall : undefined}
                className={cn(
                    "w-40 h-40 rounded-full relative flex items-center justify-center transition-all duration-500",
                    status === 'IDLE' && "bg-slate-900 border-2 border-slate-700 shadow-[0_0_30px_rgba(0,0,0,0.5)]",
                    status === 'CONNECTING' && "bg-slate-800 border-2 border-white/20 animate-pulse",
                    status === 'LIVE' && "bg-cyan-950 border-2 border-cyan-500/50 shadow-[0_0_50px_rgba(6,182,212,0.4)]"
                )}
            >
                {status === 'IDLE' && <Mic className="w-10 h-10 text-slate-400" />}
                {status === 'CONNECTING' && <Wifi className="w-10 h-10 text-slate-500 animate-bounce" />}
                
                {status === 'LIVE' && (
                    <motion.div 
                        animate={isTalking ? { height: [20, 40, 20] } : { height: 20 }}
                        transition={{ repeat: Infinity, duration: 0.5 }}
                        className="flex items-center gap-1"
                    >
                        {/* Fake Waveform */}
                        {[1,2,3,4,5].map(i => (
                            <motion.div 
                                key={i}
                                animate={{ height: isTalking ? [10, 30, 10] : [8, 12, 8] }}
                                transition={{ repeat: Infinity, duration: 1, delay: i * 0.1 }}
                                className="w-1.5 bg-cyan-400 rounded-full"
                            />
                        ))}
                    </motion.div>
                )}
            </motion.button>
        </div>

        {/* Status Text / Transcript */}
        <div className="mt-12 px-8 text-center max-w-md h-20">
            {status === 'IDLE' && (
                <p className="text-slate-400 text-sm animate-pulse">Tap the orb to start speaking</p>
            )}
            {status === 'CONNECTING' && (
                <p className="text-slate-400 text-sm">Establishing secure connection...</p>
            )}
            {status === 'LIVE' && (
                <motion.p 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-cyan-200/80 text-lg font-medium leading-relaxed"
                >
                    {isTalking ? "AI is speaking..." : "Listening..."}
                </motion.p>
            )}
        </div>

      </main>

      {/* Footer Actions */}
      <footer className="p-8 pb-10 flex flex-col gap-4 z-10 w-full max-w-md mx-auto">
        {status === 'LIVE' ? (
            <Button 
                onClick={endCall}
                className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 py-6 text-lg rounded-xl transition-all"
            >
                <Phone className="w-5 h-5 mr-2 rotate-[135deg]" />
                End Call
            </Button>
        ) : (
             <Button 
                variant="outline"
                className="w-full border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 py-6 rounded-xl backdrop-blur-md"
            >
                <User className="w-5 h-5 mr-2" />
                Request Human Callback
            </Button>
        )}
      </footer>
    </div>
  );
}
