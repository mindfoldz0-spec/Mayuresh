'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useSystemStore } from '../../store/useSystemStore';
import { ArrowRight, ChevronRight } from 'lucide-react';

export const BootLoader: React.FC = () => {
  const { setBootStage, setBootProgress } = useSystemStore();
  const [subtextIndex, setSubtextIndex] = useState(0);

  const subtexts = [
    'Starting Mayuresh OS...',
    'Loading system kernel and core modules...',
    'Preparing Mayuresh Portfolio experience...',
    'Initializing visual workspace environment...',
  ];

  useEffect(() => {
    // Cycle text
    const textInterval = setInterval(() => {
      setSubtextIndex((prev) => (prev + 1) % subtexts.length);
    }, 700);

    // Stage 1 duration timer (2.8 seconds)
    const stageTimer = setTimeout(() => {
      setBootProgress(0, 'Initializing Portfolio Environment...');
      setBootStage('loading');
    }, 2800);

    return () => {
      clearInterval(textInterval);
      clearTimeout(stageTimer);
    };
  }, [setBootStage, setBootProgress]);

  const handleSkip = () => {
    setBootStage('loading');
  };

  return (
    <div
      onClick={handleSkip}
      className="fixed inset-0 z-[9999] bg-[#050914] flex flex-col items-center justify-between p-8 md:p-12 select-none overflow-hidden text-white font-sans cursor-pointer"
    >
      {/* Top Header branding */}
      <div className="w-full flex justify-between items-center text-xs tracking-widest text-slate-400 opacity-70 font-mono">
        <span>MAYURESH OS v4.2.0</span>
        <span>UEFI SECURE BOOT ENABLED</span>
      </div>

      {/* Main Logo & Loader */}
      <div className="flex flex-col items-center justify-center my-auto z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative mb-8 flex items-center justify-center"
        >
          {/* Custom Windows-inspired 4-panel "M" Logo */}
          <div className="grid grid-cols-2 gap-2 w-28 h-28 p-2 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-cyan-500/30 shadow-[0_0_60px_rgba(0,120,212,0.4)]">
            <motion.div
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
              className="bg-gradient-to-br from-cyan-400 to-blue-600 rounded-tl-xl rounded-br-sm shadow-md flex items-end justify-end p-1.5"
            >
              <div className="w-2 h-5 bg-white/40 rounded-full" />
            </motion.div>
            <motion.div
              animate={{ opacity: [1, 0.7, 1] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut', delay: 0.3 }}
              className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-tr-xl rounded-bl-sm shadow-md flex items-end justify-start p-1.5"
            >
              <div className="w-2 h-5 bg-white/40 rounded-full" />
            </motion.div>
            <motion.div
              animate={{ opacity: [0.8, 1, 0.8] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut', delay: 0.6 }}
              className="bg-gradient-to-br from-blue-600 to-sky-500 rounded-bl-xl rounded-tr-sm shadow-md flex items-start justify-end p-1.5"
            >
              <div className="w-2 h-4 bg-white/40 rounded-full" />
            </motion.div>
            <motion.div
              animate={{ opacity: [1, 0.8, 1] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut', delay: 0.9 }}
              className="bg-gradient-to-br from-sky-400 to-cyan-500 rounded-br-xl rounded-tl-sm shadow-md flex items-start justify-start p-1.5"
            >
              <div className="w-2 h-4 bg-white/40 rounded-full" />
            </motion.div>
          </div>
        </motion.div>

        {/* Title */}
        <h1 className="text-3xl font-bold tracking-wide text-white mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-cyan-200">
          Mayuresh Portfolio
        </h1>

        {/* Windows-style Loading Ring Spinner */}
        <div className="mt-6 mb-6 relative w-12 h-12 flex items-center justify-center">
          <div className="w-10 h-10 rounded-full border-2 border-t-cyan-400 border-r-blue-500 border-b-transparent border-l-transparent animate-bootSpinner" />
        </div>

        {/* Animated Subtext */}
        <motion.p
          key={subtextIndex}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.3 }}
          className="text-sm text-cyan-300 font-mono tracking-wide h-6 text-center"
        >
          {subtexts[subtextIndex]}
        </motion.p>
      </div>

      {/* Footer hint & skip button */}
      <div className="w-full flex flex-col sm:flex-row justify-between items-center text-xs text-slate-400 font-mono gap-2">
        <span>Mayuresh Engineering OS</span>
        <button
          onClick={handleSkip}
          className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-cyan-500/20 text-cyan-300 border border-white/15 flex items-center gap-1.5 transition-all"
        >
          <span>Click anywhere to skip</span>
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};
