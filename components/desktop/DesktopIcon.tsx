'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AppId } from '../../types';
import { useWindowStore } from '../../store/useWindowStore';
import * as LucideIcons from 'lucide-react';

interface DesktopIconProps {
  id: AppId;
  title: string;
  iconName: string;
  isSelected: boolean;
  onSelect: (id: AppId) => void;
}

export const DesktopIcon: React.FC<DesktopIconProps> = ({
  id,
  title,
  iconName,
  isSelected,
  onSelect,
}) => {
  const { openWindow } = useWindowStore();
  const [clickCount, setClickCount] = useState(0);

  // Dynamic Lucide icon lookup
  const IconComponent = (LucideIcons as unknown as Record<string, React.ElementType>)[iconName] || LucideIcons.AppWindow;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(id);

    setClickCount((prev) => prev + 1);
    setTimeout(() => setClickCount(0), 300);

    // Double click handler for desktop
    if (clickCount >= 1) {
      openWindow(id);
      setClickCount(0);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.stopPropagation();
    onSelect(id);
    openWindow(id);
  };

  // Icon color schemes based on App ID
  const getIconBg = () => {
    switch (id) {
      case 'about': return 'bg-gradient-to-tr from-cyan-600 to-blue-500 text-white';
      case 'projects': return 'bg-gradient-to-tr from-indigo-600 to-violet-500 text-white';
      case 'skills': return 'bg-gradient-to-tr from-emerald-600 to-teal-500 text-white';
      case 'experience': return 'bg-gradient-to-tr from-amber-600 to-orange-500 text-white';
      case 'contact': return 'bg-gradient-to-tr from-rose-600 to-pink-500 text-white';
      case 'explorer': return 'bg-gradient-to-tr from-blue-600 to-sky-400 text-white';
      case 'terminal': return 'bg-slate-900 text-emerald-400 border border-slate-700';
      case 'calculator': return 'bg-slate-800 text-blue-300 border border-slate-600';
      case 'notepad': return 'bg-gradient-to-tr from-sky-500 to-blue-600 text-white';
      case 'settings': return 'bg-slate-700 text-slate-200';
      case 'browser': return 'bg-gradient-to-tr from-blue-500 to-cyan-400 text-white';
      case 'photos': return 'bg-gradient-to-tr from-purple-600 to-pink-500 text-white';
      case 'recycle-bin': return 'bg-slate-800 text-slate-300 border border-slate-600';
      default: return 'bg-blue-600 text-white';
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      onTouchEnd={handleTouchEnd}
      className={`group w-24 h-24 p-2 rounded-xl flex flex-col items-center justify-center gap-1.5 cursor-pointer select-none transition-all ${
        isSelected
          ? 'bg-cyan-500/25 backdrop-blur-md border border-cyan-400/50 shadow-md'
          : 'hover:bg-white/10 hover:backdrop-blur-sm border border-transparent'
      }`}
    >
      {/* Icon Graphic Container */}
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-105 ${getIconBg()}`}>
        <IconComponent size={24} />
      </div>

      {/* Label */}
      <span className="text-[11px] font-medium text-white text-center leading-tight line-clamp-2 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] px-1">
        {title}
      </span>
    </motion.div>
  );
};
