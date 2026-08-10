'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AppId } from '../../types';
import { useWindowStore } from '../../store/useWindowStore';
import { AppIcon } from '../common/AppIcon';

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

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      onTouchEnd={handleTouchEnd}
      className={`group w-[86px] min-h-[80px] p-1.5 rounded-xl flex flex-col items-center justify-center gap-1.5 cursor-pointer select-none transition-all ${
        isSelected
          ? 'bg-cyan-500/30 backdrop-blur-md border border-cyan-400/60 shadow-lg ring-1 ring-cyan-400/40'
          : 'hover:bg-white/10 hover:backdrop-blur-sm border border-transparent'
      }`}
    >
      {/* Icon — background-image fills exact 48×48 box */}
      <div className="transition-transform group-hover:scale-110 drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)]">
        <AppIcon id={id} iconName={iconName} size={48} />
      </div>

      {/* Label */}
      <span className="text-[12px] font-semibold text-white text-center leading-tight line-clamp-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] px-0.5 tracking-tight w-full">
        {title}
      </span>
    </motion.div>
  );
};
