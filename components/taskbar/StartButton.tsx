'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useSystemStore } from '../../store/useSystemStore';

import { AppIcon } from '../common/AppIcon';

export const StartButton: React.FC = () => {
  const { isStartMenuOpen, toggleStartMenu } = useSystemStore();

  return (
    <motion.button
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      onClick={(e) => {
        e.stopPropagation();
        toggleStartMenu();
      }}
      title="Start (Mayuresh OS)"
      className={`p-2 rounded-xl transition-all flex items-center justify-center ${
        isStartMenuOpen
          ? 'bg-cyan-500/30 backdrop-blur-md border border-cyan-400/50 shadow-lg shadow-cyan-500/20'
          : 'hover:bg-white/10 active:bg-white/20 border border-transparent'
      }`}
    >
      <AppIcon id="windows" size={24} alt="Windows Start" />
    </motion.button>
  );
};
