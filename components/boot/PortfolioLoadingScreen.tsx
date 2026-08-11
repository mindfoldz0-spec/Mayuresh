'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useSystemStore } from '../../store/useSystemStore';
import { preloadAllAssets } from '../../utils/preloadAssets';

export const PortfolioLoadingScreen: React.FC = () => {
  const { setBootStage } = useSystemStore();
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    // Silently pre-cache all assets in background
    preloadAllAssets();

    // Stage 2 duration timer (2.2 seconds)
    const timer = setTimeout(() => {
      setBootStage('lockscreen');
    }, 2200);

    return () => clearTimeout(timer);
  }, [setBootStage]);

  const handleSkip = () => {
    setBootStage('lockscreen');
  };

  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  const logoSrc = `${basePath}/loadingportfolioicon.png`;

  return (
    <div
      onClick={handleSkip}
      className="fixed inset-0 z-[9999] bg-black flex items-center justify-center select-none overflow-hidden cursor-pointer p-6"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="flex items-center justify-center w-full"
      >
        {!imageError ? (
          <img
            src={logoSrc}
            alt="Portfolio Loader"
            onError={() => setImageError(true)}
            className="w-[85vw] max-w-[800px] md:max-w-[950px] h-auto object-contain select-none drop-shadow-[0_20px_50px_rgba(226,35,26,0.3)]"
          />
        ) : (
          <div
            style={{
              background: '#E2231A',
              padding: '48px 120px',
            }}
            className="shadow-2xl flex items-center justify-center rounded-none"
          >
            <span
              style={{
                color: 'white',
                fontSize: '100px',
                fontWeight: 900,
                letterSpacing: '2px',
                fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif',
                lineHeight: 1,
              }}
            >
              Portfolio
            </span>
          </div>
        )}
      </motion.div>
    </div>
  );
};
