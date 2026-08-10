'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSystemStore } from '../../store/useSystemStore';
import { Wallpaper } from '../desktop/Wallpaper';
import { ArrowRight, Power } from 'lucide-react';

export const LockScreen: React.FC = () => {
  const { setBootStage } = useSystemStore();
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
      className="fixed inset-0 z-[9999] select-none text-white font-sans overflow-hidden bg-slate-950 flex flex-col items-center justify-between p-6 md:p-12"
    >
      {/* Background Desktop Wallpaper */}
      <Wallpaper />
      <div className="absolute inset-0 bg-black/30 backdrop-blur-xl pointer-events-none" />

      {/* Top Clock Display */}
      <div className="relative z-10 flex flex-col items-center text-center pt-4 md:pt-8">
        <h1 className="text-5xl md:text-7xl font-extralight tracking-tight text-white drop-shadow-lg">
          {currentTime}
        </h1>
        <p className="text-sm md:text-lg font-light text-white/70 mt-2 tracking-wide">
          {currentDate}
        </p>
      </div>

      {/* Center Interactive Login Card — Liquid Glass */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-sm my-auto"
      >
        <div
          className="w-full rounded-3xl p-8 flex flex-col items-center text-center"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.05) 100%)',
            backdropFilter: 'blur(40px) saturate(1.8)',
            WebkitBackdropFilter: 'blur(40px) saturate(1.8)',
            border: '1px solid rgba(255,255,255,0.18)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.15)',
          }}
        >
          {/* Mayuresh Avatar — full cover, no frame line */}
          <div className="relative mb-5">
            <div className="w-28 h-28 rounded-full overflow-hidden shadow-lg ring-2 ring-white/20">
              <img
                src="/mayuresh.png"
                alt="Mayuresh Avatar"
                className="w-full h-full object-cover scale-110"
              />
            </div>
          </div>

          {/* Name & Role */}
          <h2 className="text-2xl font-semibold text-white tracking-tight mb-1">
            Mayuresh
          </h2>
          <p className="text-xs text-white/50 font-light mb-7 tracking-wide">
            Full Stack Software Engineer
          </p>

          {/* Sign In Action Button — clean white glass */}
          <button
            onClick={handleSignIn}
            className="w-full py-3.5 px-6 rounded-2xl font-semibold text-sm transition-all flex items-center justify-center gap-2 group cursor-pointer active:scale-[0.97]"
            style={{
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.25)',
              color: 'white',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.25)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
            }}
          >
            <span>Sign In</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>

          <p className="mt-4 text-[11px] text-white/30">
            Press <span className="text-white/60 font-medium">Enter ↵</span> or click to continue
          </p>
        </div>
      </motion.div>

      {/* Bottom Footer — minimal */}
      <div className="relative z-10 w-full flex justify-end items-center">
        <button
          onClick={() => setBootStage('booting')}
          title="Restart System"
          className="p-2.5 rounded-xl transition-all flex items-center gap-2 text-white/40 hover:text-white/70"
          style={{
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <Power size={16} />
        </button>
      </div>
    </div>
  );
};
