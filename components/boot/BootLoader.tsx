'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSystemStore } from '../../store/useSystemStore';
import { AppIcon } from '../common/AppIcon';

export const BootLoader: React.FC = () => {
  const { setBootStage, setBootProgress } = useSystemStore();

  useEffect(() => {
    // Stage 1 duration timer (2.8 seconds)
    const stageTimer = setTimeout(() => {
      setBootProgress(0, 'Initializing Portfolio Environment...');
      setBootStage('loading');
    }, 2800);

    return () => {
      clearTimeout(stageTimer);
    };
  }, [setBootStage, setBootProgress]);

  const handleSkip = () => {
    setBootStage('loading');
  };

  return (
    <div
      onClick={handleSkip}
      className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center select-none overflow-hidden text-white font-sans cursor-pointer"
    >
      {/* Main Logo & Loader */}
      <div className="flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mb-8 flex items-center justify-center"
        >
          <AppIcon id="windows" size={80} alt="Windows Boot Logo" />
        </motion.div>

        {/* Windows-style Loading Ring Spinner */}
        <div className="mt-2 mb-6 relative w-12 h-12 flex items-center justify-center">
          <div className="w-10 h-10 rounded-full border-2 border-t-white border-r-white/40 border-b-transparent border-l-transparent animate-bootSpinner" />
        </div>
      </div>
    </div>
  );
};
