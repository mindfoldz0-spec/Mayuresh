'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSystemStore } from '../../store/useSystemStore';
import { Lock, ArrowRight, ShieldCheck, Power, Sparkles, UserCheck } from 'lucide-react';

export const LockScreen: React.FC = () => {
  const { setBootStage } = useSystemStore();
  const [showLoginPrompt, setShowLoginPrompt] = useState(true); // Default to showing login prompt directly so user is never stuck
  const [currentTime, setCurrentTime] = useState(() => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  });
  const [currentDate, setCurrentDate] = useState(() => {
    const now = new Date();
    return now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
      );
      setCurrentDate(
        now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
      );
    };
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Enter key to sign in
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleSignIn();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSignIn = () => {
    setBootStage('desktop');
  };

  return (
    <div
      className="fixed inset-0 z-[9999] select-none text-white font-sans overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-blue-950 flex flex-col items-center justify-between p-6 md:p-12"
    >
      {/* Ambient Radial Background Glows - Ensures vibrant screen even without external image */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-cyan-600/20 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] rounded-full bg-purple-600/20 blur-[130px] pointer-events-none" />
      <div className="absolute top-10 left-10 w-[450px] h-[450px] rounded-full bg-blue-600/20 blur-[120px] pointer-events-none" />

      {/* Top Clock Display */}
      <div className="relative z-10 flex flex-col items-center text-center pt-4 md:pt-8">
        <h1 className="text-5xl md:text-7xl font-extralight tracking-tight text-white drop-shadow-[0_4px_20px_rgba(0,120,212,0.5)]">
          {currentTime}
        </h1>
        <p className="text-sm md:text-lg font-light text-cyan-200 mt-2 tracking-wide font-mono">
          {currentDate}
        </p>
      </div>

      {/* Center Interactive Login Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-sm my-auto"
      >
        <div className="w-full bg-slate-900/80 backdrop-blur-3xl border border-cyan-500/30 rounded-3xl p-8 shadow-[0_20px_60px_rgba(0,0,0,0.7)] flex flex-col items-center text-center">
          {/* Mayuresh Avatar */}
          <div className="relative mb-5">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-cyan-400 via-blue-500 to-indigo-600 p-1 shadow-xl shadow-cyan-500/40">
              <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400 border border-cyan-400/30">
                M
              </div>
            </div>
            <div className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-slate-950 flex items-center justify-center text-slate-950 shadow-md">
              <UserCheck size={12} />
            </div>
          </div>

          {/* Name & Role */}
          <h2 className="text-2xl font-bold text-white tracking-tight mb-1">
            Mayuresh
          </h2>
          <p className="text-xs text-cyan-300 font-mono mb-6 flex items-center gap-1.5 justify-center">
            <ShieldCheck size={14} className="text-cyan-400" />
            Full Stack Software Engineer
          </p>

          {/* Sign In Action Button */}
          <button
            onClick={handleSignIn}
            className="w-full py-3.5 px-6 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 active:scale-[0.98] text-slate-950 font-bold rounded-2xl shadow-xl shadow-cyan-500/30 transition-all flex items-center justify-center gap-2 group cursor-pointer"
          >
            <span>Enter Mayuresh Desktop</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>

          <p className="mt-4 text-[11px] text-slate-400 font-mono">
            Press <span className="text-cyan-300 font-bold">Enter ↵</span> or click button to sign in
          </p>
        </div>
      </motion.div>

      {/* Bottom Footer Options */}
      <div className="relative z-10 w-full flex justify-between items-center text-xs text-slate-400 font-mono">
        <span className="flex items-center gap-1.5">
          <Sparkles size={14} className="text-cyan-400" />
          Mayuresh Portfolio OS
        </span>

        <button
          onClick={() => setBootStage('booting')}
          title="Restart System"
          className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-slate-200 transition-all flex items-center gap-2"
        >
          <Power size={16} className="text-cyan-400" />
          <span className="hidden sm:inline">Restart Boot</span>
        </button>
      </div>
    </div>
  );
};
