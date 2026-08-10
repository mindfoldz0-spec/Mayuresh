'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useWindowStore } from '../../store/useWindowStore';
import { APPS_CONFIG } from '../../data/apps';
import { AppId } from '../../types';
import { AppIcon } from '../common/AppIcon';

export const TaskbarApps: React.FC = () => {
  const { windows, activeWindowId, toggleWindow } = useWindowStore();

  // Combine pinned apps and currently open apps
  const pinnedApps = APPS_CONFIG.filter((app) => app.isPinnedToTaskbar);
  const openAppIds = Object.values(windows)
    .filter((w) => w.isOpen)
    .map((w) => w.id);

  const displayedAppIds = Array.from(
    new Set([...pinnedApps.map((a) => a.id), ...openAppIds])
  ) as AppId[];

  return (
    <div className="flex items-center gap-1 overflow-x-auto max-w-[50vw] no-scrollbar">
      {displayedAppIds.map((id) => {
        const config = APPS_CONFIG.find((a) => a.id === id);
        if (!config) return null;

        const windowState = windows[id];
        const isOpen = windowState?.isOpen;
        const isActive = activeWindowId === id && isOpen && !windowState?.isMinimized;

        return (
          <motion.button
            key={id}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              toggleWindow(id);
            }}
            title={config.title}
            className={`relative p-2 rounded-xl transition-all flex items-center justify-center group ${
              isActive
                ? 'bg-cyan-500/25 backdrop-blur-md border border-cyan-400/40 shadow-md text-cyan-300'
                : isOpen
                ? 'bg-white/10 hover:bg-white/15 text-slate-100'
                : 'hover:bg-white/10 text-slate-300'
            }`}
          >
            <AppIcon id={config.id} iconName={config.iconName} size={24} />

            {/* Active Indicator Dot / Pill */}
            {isOpen && (
              <span
                className={`absolute bottom-0.5 left-1/2 -translate-x-1/2 rounded-full transition-all ${
                  isActive
                    ? 'w-4 h-1 bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]'
                    : 'w-1.5 h-1.5 bg-slate-400'
                }`}
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
};
