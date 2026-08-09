'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useSystemStore } from '../../store/useSystemStore';

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
      className={`p-2.5 rounded-xl transition-all flex items-center justify-center ${
        isStartMenuOpen
          ? 'bg-cyan-500/30 backdrop-blur-md border border-cyan-400/50 shadow-lg shadow-cyan-500/20'
          : 'hover:bg-white/10 active:bg-white/20 border border-transparent'
      }`}
    >
      {/* Windows 11 Style 4-Panel Custom Logo Icon */}
      <div className="grid grid-cols-2 gap-0.5 w-5 h-5">
        <div className="bg-cyan-400 rounded-tl-sm rounded-br-[1px]" />
        <div className="bg-blue-500 rounded-tr-sm rounded-bl-[1px]" />
        <div className="bg-blue-600 rounded-bl-sm rounded-tr-[1px]" />
        <div className="bg-sky-400 rounded-br-sm rounded-tl-[1px]" />
      </div>
    </motion.button>
  );
};
