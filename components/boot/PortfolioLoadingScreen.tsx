'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSystemStore } from '../../store/useSystemStore';

export const PortfolioLoadingScreen: React.FC = () => {
  const { setBootStage } = useSystemStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      setBootStage('lockscreen');
    }, 2500);

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
