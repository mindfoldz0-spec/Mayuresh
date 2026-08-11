'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSystemStore } from '../../store/useSystemStore';
import { PROJECTS, PHOTOS } from '../../data/portfolio';

export const PortfolioLoadingScreen: React.FC = () => {
  const { setBootStage } = useSystemStore();

  useEffect(() => {
    // Parallel Image Preloading Engine
    // Pre-cache all project images & photo assets into browser HTTP memory cache
    const urlsToPreload = [
      ...PROJECTS.map((p) => p.imageUrl),
      ...PHOTOS.map((ph) => ph.url),
    ];

    urlsToPreload.forEach((url) => {
      if (url && typeof window !== 'undefined') {
        const img = new Image();
        img.src = url;
      }
    });

    const timer = setTimeout(() => {
      setBootStage('lockscreen');
    }, 2200);

    return () => clearTimeout(timer);
  }, [setBootStage]);

  const handleSkip = () => {
    setBootStage('lockscreen');
  };

  return (
    <div
      onClick={handleSkip}
      className="fixed inset-0 z-[9999] bg-black flex items-center justify-center select-none overflow-hidden cursor-pointer"
    >
      {/* Red Logo — Lenovo style */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={{
          background: '#E2231A',
          padding: '28px 64px',
          borderRadius: '0px',
        }}
      >
        <span
          style={{
            color: 'white',
            fontSize: '64px',
            fontWeight: 800,
            letterSpacing: '1px',
            fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif',
            lineHeight: 1,
          }}
        >
          Portfolio
        </span>
      </motion.div>
    </div>
  );
};
