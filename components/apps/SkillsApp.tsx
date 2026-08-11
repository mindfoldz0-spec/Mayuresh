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
  const [voiceStatus, setVoiceStatus] = useState('Listening... Speak now');

  const chatBottomRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const shouldListenRef = useRef<boolean>(false);
  const isSpeakingRef = useRef<boolean>(false);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoadingAi]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      shouldListenRef.current = false;
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
      }
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch {}
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

  const speakVoiceResponse = async (text: string) => {
    // Temporarily pause mic while AI speaks
    shouldListenRef.current = false;
    isSpeakingRef.current = true;
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
    }

    setVoiceStatus('Generating Fish Audio voice...');
    const audioUrl = await fetchFishAudioTts(text);

    if (audioUrl) {
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
      }

      const audio = new Audio(audioUrl);
      currentAudioRef.current = audio;

      audio.onplay = () => {
        setIsSpeaking(true);
        setVoiceStatus('Mayuresh AI Speaking...');
      };

      audio.onended = () => {
        setIsSpeaking(false);
        isSpeakingRef.current = false;
        setVoiceStatus('Listening... Speak now');
        // Auto-resume continuous mic after speaking
        startVoiceRecognition();
      };

      audio.onerror = () => {
        fallbackBrowserTts(text);
      };

      audio.play().catch(() => fallbackBrowserTts(text));
    } else {
      fallbackBrowserTts(text);
    }
  };

  const fallbackBrowserTts = (text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      setIsSpeaking(false);
      isSpeakingRef.current = false;
      startVoiceRecognition();
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*#•🚀🎮🎓✉️💻⚡]/g, '').trim();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    // Pick best natural English voice
    const voices = window.speechSynthesis.getVoices();
    const naturalVoice = voices.find(
      (v) => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('David'))
    ) || voices.find((v) => v.lang.startsWith('en'));

    if (naturalVoice) {
      utterance.voice = naturalVoice;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      setVoiceStatus('Mayuresh AI Speaking...');
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      isSpeakingRef.current = false;
      setVoiceStatus('Listening... Speak now');
      startVoiceRecognition();
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      isSpeakingRef.current = false;
      startVoiceRecognition();
    };

    window.speechSynthesis.speak(utterance);
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

    const groqResponse = await fetchGroqChatCompletion(text, chatHistory);
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

  // Continuous speech recognition engine with auto-restart on silent pause
  const startVoiceRecognition = async () => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceStatus('Speech Recognition not supported');
      return;
    }

    shouldListenRef.current = true;

    try {
      // 1. Explicitly request mic permission
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        await navigator.mediaDevices.getUserMedia({ audio: true });
      }

      if (currentAudioRef.current) currentAudioRef.current.pause();
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      setIsSpeaking(false);
      isSpeakingRef.current = false;

      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch {}
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceStatus('Listening... Speak now');
      };

      recognition.onresult = (event: any) => {
        const lastResultIndex = event.results.length - 1;
        const transcript = event.results[lastResultIndex][0].transcript;
        if (transcript && transcript.trim()) {
          setIsListening(false);
          shouldListenRef.current = false;
          setVoiceStatus('Processing Groq AI...');
          handleSendMessage(transcript);
        }
      };

      recognition.onerror = (e: any) => {
        console.warn('Speech recognition event:', e.error);
        // Ignore benign no-speech error & keep listening
        if (e.error === 'no-speech' || e.error === 'network') {
          if (shouldListenRef.current && !isSpeakingRef.current) {
            try { recognition.start(); } catch {}
          }
        } else {
          setIsListening(false);
          setVoiceStatus('Tap microphone to speak');
        }
      };

      recognition.onend = () => {
        // Auto-restart recognition if shouldListenRef is true & AI is not speaking
        if (shouldListenRef.current && !isSpeakingRef.current) {
          try {
            recognition.start();
            setIsListening(true);
          } catch {
            setIsListening(false);
          }
        } else {
          setIsListening(false);
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error('Microphone permission error:', err);
      setIsListening(false);
      shouldListenRef.current = false;
      setVoiceStatus('Microphone permission required');
    }
  };

  const stopVoiceRecognition = () => {
    shouldListenRef.current = false;
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
    }
    setIsListening(false);
    setVoiceStatus('Tap microphone to speak');
  };

  const toggleVoiceRecognition = () => {
    if (isListening) {
      stopVoiceRecognition();
    } else {
      startVoiceRecognition();
    }
  };

  const switchToVoiceTab = () => {
    setActiveTab('voice');
    setTimeout(() => {
      startVoiceRecognition();
    }, 150);
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
              stopVoiceRecognition();
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
            <span>Groq Llama-3 + Fish Audio</span>
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
                    <span>What are Mayuresh's technical skills & engineering stack?</span>
                  </button>

                  <button
                    onClick={() => handleSendMessage("Show me Mayuresh's top featured software projects")}
                    className="p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-slate-400 hover:shadow-md transition-all text-xs font-medium text-slate-700 flex items-center gap-3"
                  >
                    <div className="p-2 rounded-xl bg-purple-50 text-purple-600 shrink-0">
                      <Briefcase size={16} />
                    </div>
                    <span>Show me Mayuresh's top featured software projects</span>
                  </button>

                  <button
                    onClick={() => handleSendMessage("What is Mayuresh's educational & diploma background?")}
                    className="p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-slate-400 hover:shadow-md transition-all text-xs font-medium text-slate-700 flex items-center gap-3"
                  >
                    <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 shrink-0">
                      <User size={16} />
                    </div>
                    <span>What is Mayuresh's educational & diploma background?</span>
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
              messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {m.sender === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 mr-3 mt-1 shadow-md font-bold text-xs">
                      GPT
                    </div>
                  )}

                  <div
                    className={`p-4 rounded-2xl max-w-[85%] text-sm leading-relaxed ${
                      m.sender === 'user'
                        ? 'bg-slate-200 text-slate-900 rounded-br-none shadow-sm font-medium'
                        : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-sm whitespace-pre-wrap'
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))
            )}

            {isLoadingAi && (
              <div className="flex justify-start items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md font-bold text-xs">
                  GPT
                </div>
                <div className="p-3 rounded-2xl bg-white border border-slate-200 text-xs font-mono text-slate-500 animate-pulse">
                  Groq Llama-3 thinking...
                </div>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Chat Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="relative mt-2"
          >
            <div className="bg-white border border-slate-300/80 shadow-lg rounded-full px-4 py-3 flex items-center gap-3 transition-all focus-within:border-slate-400 focus-within:shadow-xl">
              <button
                type="button"
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors shrink-0"
              >
                <Plus size={20} />
              </button>

              <input
                type="text"
                placeholder="Message ChatGPT..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 bg-transparent border-none text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none select-text"
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
              <span>Groq Llama-3 + Fish Audio Human Voice</span>
            </div>

            <button className="p-2.5 rounded-full bg-white border border-slate-200 text-slate-700 shadow-sm hover:bg-slate-100 transition-all">
              <Sliders size={18} />
            </button>
          </div>

          {/* PERFECT FLUID CIRCLE */}
          <div className="relative flex items-center justify-center my-auto">
            <motion.div
              animate={{
                scale: isListening || isSpeaking ? [1, 1.25, 1] : [1, 1.05, 1],
                opacity: isListening || isSpeaking ? [0.6, 0.9, 0.6] : [0.2, 0.4, 0.2],
              }}
              transition={{ repeat: Infinity, duration: isListening || isSpeaking ? 1.5 : 4, ease: 'easeInOut' }}
              className="absolute w-72 h-72 rounded-full bg-gradient-to-r from-amber-400/40 via-orange-500/30 to-red-400/40 blur-3xl pointer-events-none"
            />

            <div
              onClick={toggleVoiceRecognition}
              className="w-60 h-60 md:w-64 md:h-64 rounded-full overflow-hidden shadow-[0_20px_50px_rgba(255,106,0,0.35)] relative flex items-center justify-center cursor-pointer border-4 border-white/80 shrink-0"
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
                title={isListening ? 'Stop listening' : 'Start microphone'}
              >
                {isListening ? <MicOff size={18} /> : <Mic size={18} />}
              </button>

              <button
                onClick={() => {
                  stopVoiceRecognition();
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
