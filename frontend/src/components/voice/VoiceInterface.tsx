'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  Wifi,
  Volume2,
  VolumeX,
  User,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  Sparkles,
  AlertCircle,
  Loader2,
  Bot,
  RotateCcw
} from 'lucide-react';
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
type VoiceState = 'idle' | 'listening' | 'processing' | 'speaking';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: number;
}

export default function VoiceInterface({ brand, brandId }: VoiceInterfaceProps) {
  const [status, setStatus] = useState<ConnectionStatus>('IDLE');
  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const [isMicActive, setIsMicActive] = useState<boolean>(true);
  const [micPermissionDenied, setMicPermissionDenied] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isSendingText, setIsSendingText] = useState(false);
  const [showContact, setShowContact] = useState(false);

  // Lead capture state
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [userInterested, setUserInterested] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [leadFormData, setLeadFormData] = useState({ name: '', phone: '', email: '' });

  // Audio & WebSocket Refs
  const wsRef = useRef<WebSocket | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const processorNodeRef = useRef<ScriptProcessorNode | null>(null);
  const currentAudioSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const currentHtmlAudioRef = useRef<HTMLAudioElement | null>(null);
  const isAiSpeakingRef = useRef<boolean>(false);
  const isMicActiveRef = useRef<boolean>(true);
  const callStartTimeRef = useRef<number>(0);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  // Keep ref synchronized with state
  useEffect(() => {
    isMicActiveRef.current = isMicActive;
  }, [isMicActive]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, voiceState]);

  // Immediately stop any currently playing AI audio
  const stopCurrentAudio = useCallback(() => {
    try {
      if (currentAudioSourceRef.current) {
        currentAudioSourceRef.current.stop();
        currentAudioSourceRef.current.disconnect();
        currentAudioSourceRef.current = null;
      }
    } catch {
      // ignore
    }
    try {
      if (currentHtmlAudioRef.current) {
        currentHtmlAudioRef.current.pause();
        currentHtmlAudioRef.current.currentTime = 0;
        currentHtmlAudioRef.current = null;
      }
    } catch {
      // ignore
    }
    isAiSpeakingRef.current = false;
    setVoiceState('listening');
  }, []);

  // Handle user interrupting speech
  const handleInterruptSpeech = () => {
    stopCurrentAudio();
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'interrupt' }));
    }
    toast.info('AI speech stopped. Listening for your question.');
  };

  // Safe end-call cleanup
  const endCall = useCallback(() => {
    stopCurrentAudio();

    if (processorNodeRef.current) {
      try {
        processorNodeRef.current.disconnect();
      } catch {
        // ignore
      }
      processorNodeRef.current = null;
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch {
          // ignore
        }
      });
      mediaStreamRef.current = null;
    }

    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      try {
        audioContextRef.current.close();
      } catch {
        // ignore
      }
      audioContextRef.current = null;
    }

    if (wsRef.current) {
      try {
        wsRef.current.close();
      } catch {
        // ignore
      }
      wsRef.current = null;
    }

    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    setStatus('IDLE');
    setVoiceState('idle');
  }, [stopCurrentAudio]);

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      endCall();
    };
  }, [endCall]);

  // Downsample audio buffer to 16kHz PCM
  const downsampleBuffer = (buffer: Float32Array, sampleRate: number, outSampleRate: number) => {
    if (outSampleRate === sampleRate || outSampleRate > sampleRate) return buffer;
    const sampleRateRatio = sampleRate / outSampleRate;
    const newLength = Math.round(buffer.length / sampleRateRatio);
    const result = new Float32Array(newLength);
    let offsetResult = 0;
    let offsetBuffer = 0;
    while (offsetResult < result.length) {
      const nextOffsetBuffer = Math.round((offsetResult + 1) * sampleRateRatio);
      let accum = 0;
      let count = 0;
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

  // Setup microphone streaming
  const setupAudioProcessing = async (stream: MediaStream) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const audioContext = new AudioCtx();
      audioContextRef.current = audioContext;

      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }

      const source = audioContext.createMediaStreamSource(stream);
      const processor = audioContext.createScriptProcessor(4096, 1, 1);
      processorNodeRef.current = processor;

      // Muted Gain node to prevent microphone feedback loop to speakers
      const muteGain = audioContext.createGain();
      muteGain.gain.value = 0;

      source.connect(processor);
      processor.connect(muteGain);
      muteGain.connect(audioContext.destination);

      processor.onaudioprocess = (e) => {
        // Drop mic streaming if AI is speaking or if user explicitly muted mic
        if (isAiSpeakingRef.current || !isMicActiveRef.current) {
          return;
        }

        if (wsRef.current?.readyState === WebSocket.OPEN) {
          const inputData = e.inputBuffer.getChannelData(0);
          const downsampled = downsampleBuffer(inputData, audioContext.sampleRate, 16000);
          const buffer = convertFloat32ToInt16(downsampled);
          wsRef.current.send(buffer);
        }
      };
    } catch (err) {
      console.error('Error initializing AudioContext:', err);
    }
  };

  // Play incoming TTS MP3 audio
  const playAudioArrayBuffer = async (arrayBuffer: ArrayBuffer) => {
    stopCurrentAudio();

    // 1. Try HTML5 Audio Blob playback
    try {
      const blob = new Blob([arrayBuffer], { type: 'audio/mp3' });
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      currentHtmlAudioRef.current = audio;

      isAiSpeakingRef.current = true;
      setVoiceState('speaking');

      audio.onended = () => {
        isAiSpeakingRef.current = false;
        setVoiceState('listening');
        currentHtmlAudioRef.current = null;
        URL.revokeObjectURL(url);
      };

      audio.onerror = () => {
        isAiSpeakingRef.current = false;
        setVoiceState('listening');
        currentHtmlAudioRef.current = null;
        URL.revokeObjectURL(url);
      };

      await audio.play();
      return;
    } catch (html5Err) {
      console.warn('HTML5 audio play failed, trying Web Audio API:', html5Err);
    }

    // 2. Web Audio API Fallback
    try {
      if (audioContextRef.current) {
        if (audioContextRef.current.state === 'suspended') {
          await audioContextRef.current.resume();
        }

        const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer.slice(0));
        const source = audioContextRef.current.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContextRef.current.destination);

        currentAudioSourceRef.current = source;
        isAiSpeakingRef.current = true;
        setVoiceState('speaking');

        source.onended = () => {
          isAiSpeakingRef.current = false;
          setVoiceState('listening');
          currentAudioSourceRef.current = null;
        };

        source.start(0);
      }
    } catch (webAudioErr) {
      console.error('Web Audio API playback failed:', webAudioErr);
      isAiSpeakingRef.current = false;
      setVoiceState('listening');
    }
  };

  // Toggle Microphone recording
  const toggleMicrophone = async () => {
    if (!isMicActive) {
      // Unmuting: If no media stream exists yet, request it
      if (!mediaStreamRef.current) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            audio: {
              echoCancellation: true,
              noiseSuppression: true,
              autoGainControl: true,
              channelCount: 1,
            }
          });
          mediaStreamRef.current = stream;
          setMicPermissionDenied(false);
          await setupAudioProcessing(stream);
        } catch {
          toast.error('Microphone access blocked. You can still chat by typing below.');
          return;
        }
      }
      setIsMicActive(true);
      toast.success('Microphone activated. Speak freely.');
    } else {
      setIsMicActive(false);
      toast.info('Microphone muted. Click un-mute or type your message.');
    }
  };

  // Start Call & Connect WebSocket
  const startCall = async () => {
    setStatus('CONNECTING');
    setVoiceState('idle');
    setUserInterested(false);
    setShowLeadForm(false);
    setLeadSubmitted(false);
    setCallDuration(0);
    setMessages([]);

    let stream: MediaStream | null = null;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          channelCount: 1,
        }
      });
      mediaStreamRef.current = stream;
      setMicPermissionDenied(false);
      setIsMicActive(true);
    } catch (micErr) {
      console.warn('Microphone permission not granted:', micErr);
      setMicPermissionDenied(true);
      setIsMicActive(false);
      toast.warning('Microphone unavailable. Entering interactive text mode.');
    }

    try {
      // Build WebSocket URL
      let voiceUrl = process.env.NEXT_PUBLIC_VOICE_URL;
      if (!voiceUrl) {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        voiceUrl = apiUrl
          .replace(/^http/, 'ws')
          .replace(/\/api\/?$/, '');
      }

      console.log('🔌 Connecting Voice WebSocket:', voiceUrl);
      const ws = new WebSocket(`${voiceUrl}?brandId=${brandId}`);
      wsRef.current = ws;

      ws.onopen = () => {
        setStatus('LIVE');
        setVoiceState('listening');
        callStartTimeRef.current = Date.now();

        if (stream) {
          setupAudioProcessing(stream);
        }

        // Timer interval
        timerIntervalRef.current = setInterval(() => {
          setCallDuration(Math.floor((Date.now() - callStartTimeRef.current) / 1000));
        }, 1000);
      };

      ws.onmessage = async (event) => {
        // Binary MP3 Audio from AI
        if (event.data instanceof Blob || event.data instanceof ArrayBuffer) {
          const arrayBuffer = event.data instanceof Blob
            ? await event.data.arrayBuffer()
            : event.data;

          playAudioArrayBuffer(arrayBuffer);
          return;
        }

        // JSON Messages
        if (typeof event.data === 'string') {
          try {
            const data = JSON.parse(event.data);

            if (data.type === 'transcript') {
              setMessages((prev) => [
                ...prev,
                {
                  id: `${data.sender}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
                  sender: data.sender,
                  text: data.text,
                  timestamp: data.timestamp || Date.now(),
                }
              ]);
            } else if (data.type === 'state') {
              setVoiceState(data.state);
            } else if (data.type === 'interest_detected') {
              setUserInterested(true);
              setShowLeadForm(true);
              toast.success('Interest detected! Form opened.');
            } else if (data.type === 'error') {
              toast.error(data.message || 'An error occurred in voice processing');
            }
          } catch (jsonErr) {
            console.log('Raw WS message:', event.data);
          }
        }
      };

      ws.onerror = (err) => {
        console.error('WebSocket Error:', err);
        setStatus('ERROR');
        toast.error('Connection interrupted. Please try re-connecting.');
      };

      ws.onclose = () => {
        if (timerIntervalRef.current) {
          clearInterval(timerIntervalRef.current);
        }
        if (status === 'LIVE') {
          if (userInterested) {
            setShowLeadForm(true);
            toast.success('Thank you for connecting! Please leave your details.');
          } else {
            toast.info('Conversation concluded. Thank you!');
          }
        }
        setStatus('IDLE');
        setVoiceState('idle');
      };

    } catch (connErr) {
      console.error('Connection setup failed:', connErr);
      setStatus('ERROR');
      toast.error('Unable to connect to AI Voice Receptionist.');
    }
  };

  // Send manual text message
  const handleSendTextMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = inputText.trim();
    if (!trimmed) return;

    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      toast.error('Voice Assistant is not connected. Click "Start Conversation" first.');
      return;
    }

    setIsSendingText(true);

    // Send JSON to backend
    wsRef.current.send(JSON.stringify({
      type: 'user_message',
      text: trimmed,
    }));

    setInputText('');
    setIsSendingText(false);
  };

  // Submit Lead Form
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
          transcript: messages.map(m => `${m.sender.toUpperCase()}: ${m.text}`).join('\n') || 'Lead captured via web receptionist',
          duration: callDuration,
          sentiment: 'positive',
          status: 'lead_captured',
          userInterested: true
        })
      });

      if (response.ok) {
        setLeadSubmitted(true);
        toast.success('Thank you! We will get in touch with you shortly.');
      } else {
        toast.error('Failed to submit details. Please try again.');
      }
    } catch (err) {
      console.error('Lead submit error:', err);
      toast.error('Network error. Please try again.');
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col h-[100dvh] bg-[#FAF9FC] text-gray-900 overflow-hidden relative font-sans selection:bg-purple-100">
      {/* Background Ambience */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[450px] h-[450px] bg-purple-200/40 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[450px] h-[450px] bg-blue-200/40 rounded-full blur-[120px]" />
      </div>

      {/* Top Header */}
      <header className="relative w-full px-6 py-4 flex items-center justify-between z-20 border-b border-gray-100 bg-white/70 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold tracking-tight text-gray-900">
              {brand.name || 'AI Voice Receptionist'}
            </h1>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Verified AI Agent
            </span>
          </div>
          <p className="text-xs text-gray-500 font-medium mt-0.5">
            {brand.knowledgeBase?.address || brand.location?.city ? `Kanpur • ${brand.name}` : 'Ready to answer questions 24/7'}
          </p>
        </div>

        {/* State Badges & Call Duration */}
        <div className="flex items-center gap-3">
          {status === 'LIVE' && (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border bg-white shadow-sm">
              {voiceState === 'listening' && (
                <>
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-emerald-700 font-semibold">Listening...</span>
                </>
              )}
              {voiceState === 'processing' && (
                <>
                  <Loader2 className="w-3.5 h-3.5 text-amber-500 animate-spin" />
                  <span className="text-amber-700 font-semibold">AI Thinking...</span>
                </>
              )}
              {voiceState === 'speaking' && (
                <>
                  <span className="h-2 w-2 rounded-full bg-purple-500 animate-pulse" />
                  <span className="text-purple-700 font-semibold">AI Speaking...</span>
                </>
              )}
              {voiceState === 'idle' && (
                <>
                  <span className="h-2 w-2 rounded-full bg-gray-400" />
                  <span className="text-gray-600 font-semibold">Ready</span>
                </>
              )}
              <span className="text-gray-300">|</span>
              <span className="font-mono text-gray-700 font-bold">{formatDuration(callDuration)}</span>
            </div>
          )}

          {status === 'LIVE' ? (
            <Button
              variant="destructive"
              size="sm"
              onClick={endCall}
              className="rounded-full px-4 h-9 shadow-sm font-semibold gap-1.5 bg-red-600 hover:bg-red-700"
            >
              <PhoneOff className="w-4 h-4" />
              End Call
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowContact(true)}
              className="rounded-full px-3.5 h-9 text-xs font-medium border-gray-200 text-gray-700 hover:bg-gray-100"
            >
              <User className="w-3.5 h-3.5 mr-1 text-gray-400" />
              Human Contact
            </Button>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col max-w-4xl w-full mx-auto p-4 md:p-6 overflow-hidden relative z-10">

        {/* Permission Denied Notice */}
        {micPermissionDenied && status === 'LIVE' && (
          <div className="mb-4 bg-amber-50 border border-amber-200 rounded-2xl p-3 text-xs text-amber-800 flex items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Microphone access is blocked in your browser. You can type below to talk with the AI!</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleMicrophone()}
              className="text-xs h-7 text-amber-900 hover:bg-amber-100"
            >
              Retry Mic
            </Button>
          </div>
        )}

        {/* When IDLE: Prominent Call Starter Hero */}
        {status === 'IDLE' && (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 my-auto">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative cursor-pointer mb-8"
              onClick={startCall}
            >
              <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-2xl animate-pulse" />
              <div className="w-36 h-36 md:w-44 md:h-44 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center shadow-xl text-white relative border-4 border-white">
                <Mic className="w-14 h-14 md:w-16 md:h-16" />
              </div>
            </motion.div>

            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-3 tracking-tight">
              Talk to {brand.name}
            </h2>
            <p className="text-sm md:text-base text-gray-600 max-w-md mb-8 leading-relaxed">
              Have questions about our memberships, services, timings or location? Tap the button to start a voice conversation.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-xs">
              <Button
                onClick={startCall}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-6 rounded-2xl shadow-lg shadow-purple-600/20 text-base"
              >
                <Mic className="w-5 h-5 mr-2" />
                Start Conversation
              </Button>
            </div>
          </div>
        )}

        {/* When CONNECTING */}
        {status === 'CONNECTING' && (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center animate-bounce mb-4">
              <Wifi className="w-10 h-10" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Connecting to {brand.name}...</h3>
            <p className="text-xs text-gray-500 mt-1">Initializing Deepgram Voice Engine & Gemini AI...</p>
          </div>
        )}

        {/* When LIVE: Interactive Voice & Chat Experience */}
        {status === 'LIVE' && (
          <div className="flex-1 flex flex-col overflow-hidden bg-white/80 backdrop-blur-xl border border-gray-200/80 rounded-3xl shadow-xl">

            {/* Voice Control Toolbar */}
            <div className="px-5 py-3 border-b border-gray-100 bg-gray-50/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant={isMicActive ? "default" : "outline"}
                  onClick={toggleMicrophone}
                  className={cn(
                    "rounded-xl h-8 px-3 text-xs font-semibold gap-1.5 transition-all",
                    isMicActive
                      ? "bg-purple-600 hover:bg-purple-700 text-white shadow-sm"
                      : "border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100"
                  )}
                >
                  {isMicActive ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5 text-amber-600" />}
                  {isMicActive ? "Mic Active" : "Mic Muted"}
                </Button>

                {voiceState === 'speaking' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleInterruptSpeech}
                    className="rounded-xl h-8 px-3 text-xs font-semibold gap-1.5 border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100 transition-all"
                  >
                    <VolumeX className="w-3.5 h-3.5" />
                    Interrupt AI
                  </Button>
                )}
              </div>

              {/* Waveform indicator */}
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <motion.div
                    key={i}
                    animate={{
                      height: voiceState === 'speaking'
                        ? [8, 22, 8]
                        : voiceState === 'listening'
                          ? [4, 12, 4]
                          : 4
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: voiceState === 'speaking' ? 0.6 : 1.2,
                      delay: i * 0.1
                    }}
                    className={cn(
                      "w-1 rounded-full transition-colors",
                      voiceState === 'speaking'
                        ? "bg-purple-600"
                        : voiceState === 'listening'
                          ? "bg-emerald-500"
                          : "bg-gray-300"
                    )}
                  />
                ))}
                <span className="text-[11px] font-medium text-gray-500 ml-2">
                  {voiceState === 'speaking' ? 'Speaking' : voiceState === 'processing' ? 'Thinking' : 'Listening'}
                </span>
              </div>
            </div>

            {/* Chat Transcript Stream */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-400">
                  <Bot className="w-12 h-12 mb-3 text-purple-300" />
                  <p className="text-sm font-medium text-gray-600">Conversation started!</p>
                  <p className="text-xs text-gray-400 mt-1">Speak into your microphone or type below.</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "flex gap-3 max-w-[85%] md:max-w-[75%]",
                      msg.sender === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
                    )}
                  >
                    {/* Avatar */}
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold shadow-sm",
                        msg.sender === 'user'
                          ? "bg-indigo-600 text-white"
                          : "bg-gradient-to-tr from-purple-600 to-indigo-600 text-white"
                      )}
                    >
                      {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>

                    {/* Bubble */}
                    <div
                      className={cn(
                        "rounded-2xl px-4 py-3 text-sm shadow-sm",
                        msg.sender === 'user'
                          ? "bg-indigo-600 text-white rounded-tr-none"
                          : "bg-gray-100/90 text-gray-900 border border-gray-200/60 rounded-tl-none"
                      )}
                    >
                      <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                      <span
                        className={cn(
                          "block text-[10px] mt-1.5 font-medium",
                          msg.sender === 'user' ? "text-indigo-200 text-right" : "text-gray-400"
                        )}
                      >
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </motion.div>
                ))
              )}

              {/* Typing / Thinking indicator */}
              {voiceState === 'processing' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2 text-xs text-gray-500 font-medium p-2 bg-gray-50 rounded-xl w-fit"
                >
                  <Loader2 className="w-3.5 h-3.5 text-purple-600 animate-spin" />
                  <span>AI Receptionist is drafting a response...</span>
                </motion.div>
              )}

              <div ref={chatBottomRef} />
            </div>

            {/* Manual Text Input & Send Bar */}
            <form
              onSubmit={handleSendTextMessage}
              className="p-3 md:p-4 bg-white border-t border-gray-100 flex items-center gap-2"
            >
              <Input
                placeholder="Ask about membership pricing, facilities, timings, location..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                disabled={isSendingText}
                className="h-11 rounded-xl bg-gray-50 border-gray-200 text-sm focus-visible:ring-purple-500"
              />
              <Button
                type="submit"
                disabled={!inputText.trim() || isSendingText}
                className="h-11 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-medium shrink-0 gap-1.5 shadow-sm"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">Send</span>
              </Button>
            </form>
          </div>
        )}
      </main>

      {/* Lead Capture Dialog */}
      <Dialog open={showLeadForm && !leadSubmitted} onOpenChange={setShowLeadForm}>
        <DialogContent className="sm:max-w-md bg-white border-0 shadow-2xl rounded-3xl overflow-hidden">
          <div className="absolute inset-0 h-28 bg-gradient-to-br from-emerald-500/10 to-indigo-500/10 z-0 pointer-events-none" />

          <DialogHeader className="relative z-10 pt-4 px-2">
            <DialogTitle className="text-xl font-bold text-gray-900 text-center">
              Connect with {brand.name}
            </DialogTitle>
            <DialogDescription className="text-center text-gray-500 text-xs mt-1">
              Leave your contact details so our management team can follow up with your offer.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleLeadSubmit} className="grid gap-3.5 py-4 relative z-10 px-2">
            <Input
              placeholder="Your Name"
              value={leadFormData.name}
              onChange={(e) => setLeadFormData({ ...leadFormData, name: e.target.value })}
              className="h-11 rounded-xl text-sm"
              required
            />
            <Input
              placeholder="Phone Number"
              type="tel"
              value={leadFormData.phone}
              onChange={(e) => setLeadFormData({ ...leadFormData, phone: e.target.value })}
              className="h-11 rounded-xl text-sm"
              required
            />
            <Input
              placeholder="Email Address (optional)"
              type="email"
              value={leadFormData.email}
              onChange={(e) => setLeadFormData({ ...leadFormData, email: e.target.value })}
              className="h-11 rounded-xl text-sm"
            />
            <Button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-5 rounded-xl font-semibold gap-2 shadow-md shadow-emerald-600/20"
            >
              <Send className="w-4 h-4" />
              Submit Details
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Lead Success Dialog */}
      <Dialog open={leadSubmitted} onOpenChange={() => setLeadSubmitted(false)}>
        <DialogContent className="sm:max-w-sm bg-white border-0 shadow-2xl rounded-3xl text-center p-8">
          <div className="flex flex-col items-center gap-4">
            <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-7 h-7 text-emerald-600" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">Details Received!</h2>
            <p className="text-gray-500 text-xs">Our team has received your inquiry and will reach out shortly.</p>
            <Button
              onClick={() => setLeadSubmitted(false)}
              className="mt-2 bg-gray-900 hover:bg-gray-800 text-white rounded-xl px-6 text-xs h-9"
            >
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Human Contact Business Dialog */}
      <Dialog open={showContact} onOpenChange={setShowContact}>
        <DialogContent className="sm:max-w-md bg-white border-0 shadow-2xl rounded-3xl overflow-hidden">
          <div className="absolute inset-0 h-28 bg-gradient-to-br from-purple-500/10 to-blue-500/10 z-0 pointer-events-none" />

          <DialogHeader className="relative z-10 pt-4 px-2">
            <DialogTitle className="text-xl font-bold text-gray-900 text-center">Contact {brand.name}</DialogTitle>
            <DialogDescription className="text-center text-gray-500 text-xs mt-1">
              Direct contact details for staff and front desk.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-3.5 py-4 relative z-10 px-2">
            {/* Phone Card */}
            <div className="flex items-center gap-3.5 bg-emerald-50/50 p-3.5 rounded-2xl border border-emerald-100">
              <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shrink-0">
                <Phone className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-emerald-800">Direct Front Desk</p>
                <a href={`tel:${brand.knowledgeBase?.contactPhone}`} className="text-base font-bold text-gray-900 hover:underline">
                  {brand.knowledgeBase?.contactPhone || 'Not Available'}
                </a>
              </div>
            </div>

            {/* Address Card */}
            <div className="flex items-center gap-3.5 bg-gray-50 p-3.5 rounded-2xl border border-gray-100">
              <div className="w-10 h-10 bg-white text-gray-500 border border-gray-200 rounded-full flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">Address / Location</p>
                <p className="text-sm font-semibold text-gray-900">
                  {brand.knowledgeBase?.address ||
                    [brand.location?.address, brand.location?.city, brand.location?.country].filter(Boolean).join(', ') ||
                    'Kanpur, Uttar Pradesh'}
                </p>
              </div>
            </div>

            {/* Hours Card */}
            <div className="flex items-center gap-3.5 bg-gray-50 p-3.5 rounded-2xl border border-gray-100">
              <div className="w-10 h-10 bg-white text-gray-500 border border-gray-200 rounded-full flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">Operating Hours</p>
                <p className="text-sm font-semibold text-gray-900">
                  {brand.knowledgeBase?.businessHours || 'Open 6:00 AM - 10:00 PM'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-center pb-2">
            <Button variant="ghost" onClick={() => setShowContact(false)} className="text-gray-400 hover:text-gray-600 text-xs">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
