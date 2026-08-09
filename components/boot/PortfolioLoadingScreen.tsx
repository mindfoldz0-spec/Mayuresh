'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useSystemStore } from '../../store/useSystemStore';
import { Code, Sparkles, Cpu, Layers, ChevronRight } from 'lucide-react';

export const PortfolioLoadingScreen: React.FC = () => {
  const { setBootStage } = useSystemStore();
  const [progress, setProgress] = useState(15);
  const [loadingStep, setLoadingStep] = useState(0);

  const steps = [
    { text: 'Initializing Portfolio Assets...', icon: Layers },
    { text: 'Loading Projects & Code Repositories...', icon: Code },
    { text: 'Loading Technical Skills & Mastery...', icon: Cpu },
    { text: 'Loading Work Experience & Timeline...', icon: Sparkles },
    { text: 'Preparing Desktop Environment...', icon: Layers },
  ];

  useEffect(() => {
    // Smooth progress timer over ~1.8 seconds
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const next = prev + Math.floor(Math.random() * 12) + 8;
        const bounded = next > 100 ? 100 : next;

        if (bounded < 25) setLoadingStep(0);
        else if (bounded < 50) setLoadingStep(1);
        else if (bounded < 75) setLoadingStep(2);
        else if (bounded < 95) setLoadingStep(3);
        else setLoadingStep(4);

        return bounded;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      const timer = setTimeout(() => {
        setBootStage('lockscreen');
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [progress, setBootStage]);

  const handleSkip = () => {
    setBootStage('lockscreen');
  };

  const CurrentIcon = steps[loadingStep].icon;

  return (
    <div
      onClick={handleSkip}
      className="fixed inset-0 z-[9999] bg-slate-950 flex flex-col items-center justify-between p-8 select-none text-white font-sans overflow-hidden cursor-pointer"
    >
      {/* Background ambient radial glow */}
      <div className="absolute w-[600px] h-[600px] rounded-full bg-cyan-600/15 blur-[120px] pointer-events-none" />
      <div className="absolute w-[450px] h-[450px] rounded-full bg-blue-600/15 blur-[100px] pointer-events-none" />

      {/* Top Header */}
      <div className="w-full flex justify-between items-center text-xs text-slate-400 font-mono">
        <span>MAYURESH PORTFOLIO LOADER</span>
        <span>STEP {loadingStep + 1} OF 5</span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md flex flex-col items-center z-10 my-auto"
      >
        {/* Avatar / Brand Icon */}
        <div className="relative mb-8">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-cyan-400 via-blue-500 to-indigo-600 p-0.5 shadow-2xl shadow-cyan-500/30">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400">
              M
            </div>
          </div>
          <div className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-cyan-500/20 backdrop-blur-md border border-cyan-400/40 flex items-center justify-center text-cyan-300">
            <CurrentIcon size={14} className="animate-pulse" />
          </div>
        </div>

        {/* Header */}
        <h2 className="text-2xl font-bold text-slate-100 tracking-wide mb-1">
          Mayuresh Portfolio
        </h2>
        <p className="text-xs text-cyan-400 font-mono mb-8">
          Full Stack Software Engineer & UI/UX Craftsman
        </p>

        {/* Progress Bar Container */}
        <div className="w-full bg-slate-900/90 backdrop-blur-md border border-cyan-500/30 rounded-2xl p-6 shadow-2xl mb-6">
          <div className="flex justify-between items-center text-xs font-mono mb-3 text-slate-200">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              {steps[loadingStep].text}
            </span>
            <span className="text-cyan-400 font-bold">{progress}%</span>
          </div>

          {/* Progress Bar Track */}
          <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden relative">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 rounded-full shadow-[0_0_14px_rgba(6,182,212,0.9)]"
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Live System Tip Card */}
        <div className="w-full bg-slate-900/40 border border-slate-800 rounded-xl p-4 text-center backdrop-blur-sm">
          <p className="text-[11px] text-slate-300 italic">
            &ldquo;Crafting performant web experiences with Next.js, TypeScript, and elegant micro-interactions.&rdquo;
          </p>
        </div>
      </motion.div>

      {/* Footer Skip Action */}
      <div className="w-full flex justify-end items-center">
        <button
          onClick={handleSkip}
          className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-cyan-500/20 text-cyan-300 text-xs font-mono border border-white/15 flex items-center gap-1.5 transition-all"
        >
          <span>Skip to Lock Screen</span>
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};
