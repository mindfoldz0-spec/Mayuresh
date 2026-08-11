'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Plus,
  Mic,
  MicOff,
  ArrowUp,
  ChevronDown,
  X,
  Volume2,
  Sliders,
  Code,
  Briefcase,
  User,
  Mail,
  Bot,
  Play,
} from 'lucide-react';
import { MAYURESH_PROFILE, PROJECTS, SKILL_CATEGORIES } from '../../data/portfolio';
import { fetchGroqChatCompletion, fetchFishAudioTts } from '../../utils/aiServices';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const SkillsApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'chat' | 'voice'>('chat');
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState('Tap microphone to speak');
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [voiceAiReply, setVoiceAiReply] = useState('');

  const chatBottomRef = useRef<HTMLDivElement>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const vadIntervalRef = useRef<any>(null);
  const silenceTimerRef = useRef<any>(null);
  const hasSpeechRef = useRef<boolean>(false);
  const isSpeakingRef = useRef<boolean>(false);
  const isRecordingRef = useRef<boolean>(false);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoadingAi]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopRecording();
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
      }
    };
  }, []);

  // Fallback response if Groq API fails or offline
  const getLocalFallbackResponse = (query: string): string => {
    const q = query.toLowerCase();

    if (q.includes('skill') || q.includes('stack') || q.includes('technology')) {
      const skillsList = SKILL_CATEGORIES.map(
        (c) => `**${c.category}**:\n` + c.skills.map((s) => `• ${s.name} (${s.level}%)`).join('\n')
      ).join('\n\n');
      return `Here is Mayuresh's technical engineering stack:\n\n${skillsList}`;
    }

    if (q.includes('project') || q.includes('work') || q.includes('build')) {
      const projectsList = PROJECTS.map(
        (p) => `🚀 **${p.title}** (${p.category}): ${p.shortDescription}`
      ).join('\n\n');
      return `Here are Mayuresh's featured software engineering projects:\n\n${projectsList}`;
    }

    if (q.includes('experience') || q.includes('education') || q.includes('background') || q.includes('about')) {
      return `**${MAYURESH_PROFILE.name}** is a ${MAYURESH_PROFILE.title} located in ${MAYURESH_PROFILE.location}.\n\n` +
        `• **Bio**: ${MAYURESH_PROFILE.bio}\n` +
        `• **Availability**: Available for Full-Time & Contract Engineering Roles.`;
    }

    return `Thanks for asking! Mayuresh is a full-stack engineer proficient in React, Next.js, TypeScript, Node.js, and cloud deployments. Feel free to ask about his skills, projects, or email him at ${MAYURESH_PROFILE.email}!`;
  };

  // Transcribe audio blob via Groq Whisper server proxy
  const transcribeAudio = async (audioBlob: Blob): Promise<string | null> => {
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');

      const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
      const res = await fetch(`${basePath}/api/stt`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        console.error('STT API error:', res.status);
        return null;
      }

      const data = await res.json();
      return data.text || null;
    } catch (err) {
      console.error('Transcription error:', err);
      return null;
    }
  };

  const speakVoiceResponse = async (text: string) => {
    // Temporarily pause mic while AI speaks
    isSpeakingRef.current = true;

    setVoiceStatus('Generating voice...');
    setVoiceAiReply(text.replace(/[*#•🚀🎮🎓✉️💻⚡]/g, '').trim());
    const audioUrl = await fetchFishAudioTts(text);

    if (audioUrl) {
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
      }

      const audio = new Audio(audioUrl);
      currentAudioRef.current = audio;

      audio.onplay = () => {
        setIsSpeaking(true);
        setVoiceStatus('🔊 Speaking...');
      };

      audio.onended = () => {
        setIsSpeaking(false);
        isSpeakingRef.current = false;
        // Auto-restart hands-free listening loop!
        if (activeTab === 'voice') {
          setTimeout(() => {
            startRecording();
          }, 300);
        } else {
          setVoiceStatus('Tap microphone to speak');
        }
      };

      audio.onerror = () => {
        setIsSpeaking(false);
        isSpeakingRef.current = false;
        setVoiceStatus('Audio playback error');
      };

      audio.play().catch(() => {
        setIsSpeaking(false);
        isSpeakingRef.current = false;
        setVoiceStatus('Audio playback failed');
      });
    } else {
      isSpeakingRef.current = false;
      setVoiceStatus('Voice generation failed');
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsLoadingAi(true);

    const chatHistory = messages.map((m) => ({
      role: m.sender === 'user' ? ('user' as const) : ('assistant' as const),
      content: m.text,
    }));

    const groqResponse = await fetchGroqChatCompletion(text, chatHistory, activeTab === 'voice');
    const finalResponse = groqResponse || getLocalFallbackResponse(text);

    setIsLoadingAi(false);

    const aiMsg: Message = {
      id: `ai-${Date.now()}`,
      sender: 'assistant',
      text: finalResponse,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, aiMsg]);

    if (activeTab === 'voice') {
      speakVoiceResponse(finalResponse);
    }
  };

  // ===== HANDS-FREE AUTOMATIC VAD (Voice Activity Detection) ENGINE =====
  const startRecording = async () => {
    if (typeof window === 'undefined') return;

    try {
      // Stop any existing recorder/VAD loop
      stopRecording();

      if (currentAudioRef.current) currentAudioRef.current.pause();
      setIsSpeaking(false);
      isSpeakingRef.current = false;

      setVoiceStatus('Listening... Speak anytime');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      // Initialize Web Audio API Analyser Node for VAD
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      if (audioCtx.state === 'suspended') {
        await audioCtx.resume();
      }
      audioContextRef.current = audioCtx;
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      // Choose best available audio format
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : 'audio/mp4';

      const recorder = new MediaRecorder(stream, { mimeType });
      audioChunksRef.current = [];
      hasSpeechRef.current = false;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = async () => {
        // Clean up VAD intervals
        cleanupAudioNodes();

        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        audioChunksRef.current = [];

        if (audioBlob.size < 400 || !hasSpeechRef.current) {
          setIsListening(false);
          isRecordingRef.current = false;
          // If no speech was detected, auto-restart listening
          if (activeTab === 'voice' && !isSpeakingRef.current) {
            startRecording();
          }
          return;
        }

        setIsListening(false);
        isRecordingRef.current = false;
        setVoiceStatus('Transcribing with Groq Whisper...');

        const transcript = await transcribeAudio(audioBlob);

        if (transcript && transcript.trim() && transcript.trim().length > 1) {
          setVoiceTranscript(transcript.trim());
          setVoiceStatus('Processing AI...');
          setVoiceAiReply('');
          handleSendMessage(transcript.trim());
        } else {
          setVoiceStatus('Listening... Speak anytime');
          setVoiceTranscript('');
          if (activeTab === 'voice' && !isSpeakingRef.current) {
            startRecording();
          }
        }
      };

      recorder.onerror = () => {
        setIsListening(false);
        isRecordingRef.current = false;
        cleanupAudioNodes();
      };

      mediaRecorderRef.current = recorder;
      recorder.start(100); // Collect audio chunks every 100ms
      isRecordingRef.current = true;
      setIsListening(true);

      // ===== ADAPTIVE VAD REAL-TIME MONITORING LOOP =====
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      let sampleCount = 0;
      let noiseSum = 0;
      let calculatedNoiseFloor = 15; // default fallback
      let speechStartTime = 0;

      vadIntervalRef.current = setInterval(() => {
        if (isSpeakingRef.current || !isRecordingRef.current) return;

        analyser.getByteFrequencyData(dataArray);
        const sum = dataArray.reduce((acc, val) => acc + val, 0);
        const volume = sum / dataArray.length;

        // 1. Calibrate background noise floor during first ~300ms
        if (sampleCount < 4) {
          sampleCount++;
          noiseSum += volume;
          calculatedNoiseFloor = Math.max(noiseSum / sampleCount, 5);
          return;
        }

        const speechThreshold = Math.max(calculatedNoiseFloor + 7, 12);
        const silenceThreshold = Math.max(calculatedNoiseFloor + 3, 8);

        // 2. Speech Detection
        if (volume > speechThreshold) {
          if (!hasSpeechRef.current) {
            hasSpeechRef.current = true;
            speechStartTime = Date.now();
            setVoiceStatus('🎙️ Hearing speech...');
          }
          if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current);
            silenceTimerRef.current = null;
          }

          // Safety Guardrail: Max 5 seconds continuous speech -> auto stop & process
          if (speechStartTime > 0 && Date.now() - speechStartTime > 5000) {
            if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
              mediaRecorderRef.current.stop();
            }
          }
        } else if (hasSpeechRef.current) {
          // 3. Silence Detection: Volume dropped back down near background noise floor
          setVoiceStatus('⏸️ Paused speaking...');
          if (!silenceTimerRef.current) {
            silenceTimerRef.current = setTimeout(() => {
              // 1.0s of silence after speech -> Automatically finish & transcribe!
              if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
                mediaRecorderRef.current.stop();
              }
            }, 1000);
          }
        }
      }, 80);

    } catch (err: any) {
      console.error('Microphone error:', err);
      setIsListening(false);
      isRecordingRef.current = false;
      setVoiceStatus(
        err?.name === 'NotAllowedError'
          ? '❌ Mic permission denied. Click 🔒 in address bar.'
          : `❌ Mic error: ${err?.message || 'Unknown'}`
      );
    }
  };

  const cleanupAudioNodes = () => {
    if (vadIntervalRef.current) {
      clearInterval(vadIntervalRef.current);
      vadIntervalRef.current = null;
    }
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      try { audioContextRef.current.close(); } catch {}
      audioContextRef.current = null;
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try { mediaRecorderRef.current.stop(); } catch {}
    }
    cleanupAudioNodes();
    setIsListening(false);
    isRecordingRef.current = false;
  };

  const toggleVoiceRecognition = () => {
    if (isRecordingRef.current) {
      stopRecording();
      setVoiceStatus('Listening paused. Tap mic to resume.');
    } else {
      startRecording();
    }
  };

  const switchToVoiceTab = () => {
    setActiveTab('voice');
    setTimeout(() => {
      startRecording();
    }, 200);
  };

  return (
    <div className="w-full h-full bg-slate-50 text-slate-900 font-sans select-none flex flex-col justify-between overflow-hidden">
      {/* Top Header Row */}
      <div className="h-14 px-6 border-b border-slate-200/80 bg-white flex items-center justify-between shrink-0">
        {/* Top Left: Get Plus Pill */}
        <div className="flex items-center gap-2">
          <button className="bg-purple-50 hover:bg-purple-100 border border-purple-200/80 text-purple-700 text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-colors shadow-sm">
            <Sparkles size={14} className="text-purple-600 fill-purple-600/30" />
            <span>Get Plus</span>
          </button>
        </div>

        {/* Top Center: Segmented Pill Switcher */}
        <div className="bg-slate-100 p-1 rounded-full flex items-center border border-slate-200/60 shadow-inner">
          <button
            onClick={() => {
              stopRecording();
              if (currentAudioRef.current) currentAudioRef.current.pause();
              if (typeof window !== 'undefined' && window.speechSynthesis) window.speechSynthesis.cancel();
              setIsSpeaking(false);
              setActiveTab('chat');
            }}
            className={`px-6 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 ${
              activeTab === 'chat'
                ? 'bg-white text-slate-900 shadow-md font-bold'
                : 'text-slate-600 hover:text-slate-900 font-medium'
            }`}
          >
            Chat
          </button>
          <button
            onClick={switchToVoiceTab}
            className={`px-6 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 flex items-center gap-1.5 ${
              activeTab === 'voice'
                ? 'bg-white text-slate-900 shadow-md font-bold'
                : 'text-slate-600 hover:text-slate-900 font-medium'
            }`}
          >
            <Mic size={13} className={activeTab === 'voice' ? 'text-amber-500' : 'text-slate-500'} />
            <span>Voice</span>
          </button>
        </div>

        {/* Top Right: Groq & Fish Audio Badge */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-full border border-slate-200/60 shadow-sm">
            <Bot size={14} className="text-emerald-600" />
            <span>Groq Whisper + Llama-3 AI</span>
          </div>
        </div>
      </div>

      {/* Main View Area */}
      {activeTab === 'chat' ? (
        /* CHAT MODE VIEW */
        <div className="flex-1 flex flex-col justify-between p-6 overflow-hidden max-w-4xl w-full mx-auto">
          {/* Chat Messages / Hero Landing */}
          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-6 pr-2 py-4">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center my-auto space-y-8">
                {/* Hero Title */}
                <h1 className="text-3xl md:text-4xl font-normal text-slate-800 tracking-tight">
                  What’s on your mind today?
                </h1>

                {/* Preset Recruiter Query Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl w-full text-left">
                  <button
                    onClick={() => handleSendMessage("What are Mayuresh's technical skills & engineering stack?")}
                    className="p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-slate-400 hover:shadow-md transition-all text-xs font-medium text-slate-700 flex items-center gap-3"
                  >
                    <div className="p-2 rounded-xl bg-cyan-50 text-cyan-600 shrink-0">
                      <Code size={16} />
                    </div>
                    <span>What are Mayuresh&apos;s technical skills &amp; engineering stack?</span>
                  </button>

                  <button
                    onClick={() => handleSendMessage("Show me Mayuresh's top featured software projects")}
                    className="p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-slate-400 hover:shadow-md transition-all text-xs font-medium text-slate-700 flex items-center gap-3"
                  >
                    <div className="p-2 rounded-xl bg-purple-50 text-purple-600 shrink-0">
                      <Briefcase size={16} />
                    </div>
                    <span>Show me Mayuresh&apos;s top featured software projects</span>
                  </button>

                  <button
                    onClick={() => handleSendMessage("What is Mayuresh's educational & diploma background?")}
                    className="p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-slate-400 hover:shadow-md transition-all text-xs font-medium text-slate-700 flex items-center gap-3"
                  >
                    <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 shrink-0">
                      <User size={16} />
                    </div>
                    <span>What is Mayuresh&apos;s educational &amp; diploma background?</span>
                  </button>

                  <button
                    onClick={() => handleSendMessage("How can I contact or hire Mayuresh?")}
                    className="p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-slate-400 hover:shadow-md transition-all text-xs font-medium text-slate-700 flex items-center gap-3"
                  >
                    <div className="p-2 rounded-xl bg-amber-50 text-amber-600 shrink-0">
                      <Mail size={16} />
                    </div>
                    <span>How can I contact or hire Mayuresh?</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Message Trajectory */
              <div className="space-y-4">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl p-4 text-xs leading-relaxed shadow-sm ${
                        m.sender === 'user'
                          ? 'bg-slate-900 text-white rounded-br-none font-medium'
                          : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-none'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{m.text}</p>
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 px-1">{m.timestamp}</span>
                  </div>
                ))}

                {isLoadingAi && (
                  <div className="flex items-center gap-2 text-xs text-slate-500 bg-white border border-slate-200 px-3.5 py-2 rounded-2xl w-fit shadow-sm">
                    <div className="w-2 h-2 bg-amber-500 rounded-full animate-ping" />
                    <span>Mayuresh AI is thinking...</span>
                  </div>
                )}

                <div ref={chatBottomRef} />
              </div>
            )}
          </div>

          {/* Bottom Chat Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="mt-2 shrink-0"
          >
            <div className="relative bg-white border border-slate-300/80 rounded-full p-1.5 pl-5 flex items-center shadow-lg hover:border-slate-400 transition-colors">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask Mayuresh AI anything..."
                className="w-full bg-transparent text-xs text-slate-900 placeholder-slate-400 outline-none pr-4"
              />

              <button
                type="button"
                onClick={switchToVoiceTab}
                className="p-2 text-slate-500 hover:text-slate-900 transition-colors shrink-0"
                title="Voice Mode"
              >
                <Mic size={18} />
              </button>

              <button
                type="submit"
                disabled={!inputText.trim() || isLoadingAi}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all shrink-0 ${
                  inputText.trim() && !isLoadingAi
                    ? 'bg-slate-900 text-white shadow-md hover:bg-slate-800 active:scale-95'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <ArrowUp size={18} />
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* VOICE MODE VIEW */
        <div className="flex-1 bg-slate-50 relative flex flex-col items-center justify-between p-8 text-slate-900 overflow-hidden">
          {/* Top Voice Header */}
          <div className="w-full flex items-center justify-between z-10">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 bg-white border border-slate-200 px-3.5 py-1.5 rounded-full shadow-sm">
              <Bot size={15} className="text-emerald-600" />
              <span>Groq Whisper Hands-Free Voice Mode</span>
            </div>

            <button className="p-2.5 rounded-full bg-white border border-slate-200 text-slate-700 shadow-sm hover:bg-slate-100 transition-all">
              <Sliders size={18} />
            </button>
          </div>

          {/* PERFECT FLUID CIRCLE + LIVE TRANSCRIPT */}
          <div className="relative flex flex-col items-center justify-center my-auto space-y-4">
            <div className="relative flex items-center justify-center">
              <motion.div
                animate={{
                  scale: isListening || isSpeaking ? [1, 1.25, 1] : [1, 1.05, 1],
                  opacity: isListening || isSpeaking ? [0.6, 0.9, 0.6] : [0.2, 0.4, 0.2],
                }}
                transition={{ repeat: Infinity, duration: isListening || isSpeaking ? 1.5 : 4, ease: 'easeInOut' }}
                className="absolute w-52 h-52 rounded-full bg-gradient-to-r from-amber-400/40 via-orange-500/30 to-red-400/40 blur-3xl pointer-events-none"
              />

              <div
                onClick={toggleVoiceRecognition}
                className="w-44 h-44 md:w-48 md:h-48 rounded-full overflow-hidden shadow-[0_20px_50px_rgba(255,106,0,0.35)] relative flex items-center justify-center cursor-pointer border-4 border-white/80 shrink-0"
                style={{
                  background: 'linear-gradient(135deg, #ff7e5f 0%, #feb47b 45%, #ff6a00 100%)',
                  borderRadius: '50%',
                }}
              >
                <motion.div
                  animate={{
                    rotate: [0, 360],
                    scale: isListening || isSpeaking ? [1, 1.3, 1] : [1, 1.1, 1],
                  }}
                  transition={{ repeat: Infinity, duration: isListening || isSpeaking ? 2.5 : 8, ease: 'linear' }}
                  className="absolute inset-[-30%] rounded-full opacity-80 pointer-events-none"
                  style={{
                    background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.95) 0%, rgba(255,180,100,0.8) 35%, rgba(255,106,0,0) 70%)',
                    filter: 'blur(16px)',
                  }}
                />

                <motion.div
                  animate={{
                    x: [-35, 35, -35],
                    y: [-25, 25, -25],
                    rotate: [360, 0],
                  }}
                  transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
                  className="absolute inset-[-20%] rounded-full opacity-70 pointer-events-none"
                  style={{
                    background: 'radial-gradient(circle at 70% 70%, rgba(254,180,123,0.9) 0%, rgba(255,126,95,0.85) 45%, rgba(255,106,0,0) 80%)',
                    filter: 'blur(20px)',
                  }}
                />
              </div>
            </div>

            {/* Live Transcript & AI Reply Display */}
            <div className="w-full max-w-sm space-y-2 text-center min-h-[60px]">
              {/* User's speech transcript */}
              {voiceTranscript && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/90 backdrop-blur-sm border border-slate-200 rounded-2xl px-4 py-2.5 shadow-sm"
                >
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">You said</p>
                  <p className="text-sm text-slate-800 font-medium leading-relaxed">{voiceTranscript}</p>
                </motion.div>
              )}

              {/* AI response text */}
              {voiceAiReply && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/60 rounded-2xl px-4 py-2.5 shadow-sm max-h-24 overflow-y-auto custom-scrollbar"
                >
                  <p className="text-[10px] font-semibold text-amber-500 uppercase tracking-wider mb-1">
                    {isSpeaking ? '🔊 Speaking' : isLoadingAi ? '⏳ Thinking...' : '✦ AI Reply'}
                  </p>
                  <p className="text-xs text-slate-700 leading-relaxed">{voiceAiReply}</p>
                </motion.div>
              )}

              {/* Loading indicator */}
              {isLoadingAi && !voiceAiReply && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-center gap-2 py-2"
                >
                  <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </motion.div>
              )}
            </div>

            {/* Instant Voice Test Buttons */}
            <div className="flex items-center justify-center gap-2 flex-wrap max-w-md">
              <button
                onClick={() => handleSendMessage("Tell me about Mayuresh Samel")}
                className="px-3.5 py-1.5 rounded-full bg-white border border-slate-200 hover:border-slate-400 text-xs text-slate-700 font-medium shadow-sm transition-all flex items-center gap-1.5 active:scale-95"
              >
                <Play size={11} className="text-amber-500 fill-amber-500" />
                <span>Tell me about Mayuresh</span>
              </button>

              <button
                onClick={() => handleSendMessage("What are Mayuresh's technical skills?")}
                className="px-3.5 py-1.5 rounded-full bg-white border border-slate-200 hover:border-slate-400 text-xs text-slate-700 font-medium shadow-sm transition-all flex items-center gap-1.5 active:scale-95"
              >
                <Play size={11} className="text-amber-500 fill-amber-500" />
                <span>What are Mayuresh&apos;s skills?</span>
              </button>

              <button
                onClick={() => handleSendMessage("Show me Mayuresh's software projects")}
                className="px-3.5 py-1.5 rounded-full bg-white border border-slate-200 hover:border-slate-400 text-xs text-slate-700 font-medium shadow-sm transition-all flex items-center gap-1.5 active:scale-95"
              >
                <Play size={11} className="text-amber-500 fill-amber-500" />
                <span>Show me software projects</span>
              </button>
            </div>
          </div>

          {/* Bottom Floating Control Bar */}
          <div className="w-full max-w-md bg-white border border-slate-300/80 shadow-2xl rounded-3xl p-4 flex items-center justify-between gap-4 z-10">
            {/* Status Text Indicator */}
            <div className="flex items-center gap-3 pl-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  isSpeaking
                    ? 'bg-emerald-500 animate-ping'
                    : isListening
                    ? 'bg-amber-500 animate-pulse'
                    : 'bg-slate-400'
                }`}
              />
              <span className="text-xs font-medium text-slate-700 font-mono">
                {voiceStatus}
              </span>
            </div>

            {/* Controls Right */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleVoiceRecognition}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-sm ${
                  isListening
                    ? 'bg-amber-500 text-white animate-pulse'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                }`}
                title={isListening ? 'Pause listening' : 'Start microphone'}
              >
                {isListening ? <MicOff size={18} /> : <Mic size={18} />}
              </button>

              <button
                onClick={() => {
                  stopRecording();
                  if (currentAudioRef.current) currentAudioRef.current.pause();
                  if (typeof window !== 'undefined' && window.speechSynthesis) window.speechSynthesis.cancel();
                  setIsSpeaking(false);
                  setActiveTab('chat');
                }}
                className="w-10 h-10 rounded-full bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center shadow-md transition-all active:scale-95"
                title="Exit Voice Mode"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
