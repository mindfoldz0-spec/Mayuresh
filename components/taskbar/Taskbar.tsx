'use client';

import React from 'react';
import { StartButton } from './StartButton';
import { TaskbarApps } from './TaskbarApps';
import { SystemTray } from './SystemTray';
import { Clock } from './Clock';
import { useSystemStore } from '../../store/useSystemStore';
import { useSettingsStore } from '../../store/useSettingsStore';
import { Search } from 'lucide-react';

export const Taskbar: React.FC = () => {
  const { toggleSearch, isSearchOpen } = useSystemStore();
  const { theme } = useSettingsStore();

  const isLight = theme === 'light';

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={`fixed bottom-0 left-0 right-0 h-14 backdrop-blur-2xl border-t z-[9900] px-4 flex items-center justify-between shadow-2xl select-none font-sans transition-colors duration-300 ${
        isLight
          ? 'bg-white/80 border-slate-300/80 text-slate-800'
          : 'bg-slate-900/85 border-white/10 text-slate-200'
      }`}
    >
      {/* Left Spacer for Symmetry / Brand */}
      <div className="flex items-center gap-2">
        <StartButton />

        {/* Search trigger button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleSearch();
          }}
          className={`px-3 py-2 rounded-xl transition-all flex items-center gap-2 text-xs font-medium ${
            isSearchOpen
              ? 'bg-cyan-500/25 border border-cyan-400/40 text-cyan-600 dark:text-cyan-300'
              : isLight
              ? 'text-slate-700 hover:bg-slate-200/70 border border-slate-300/60'
              : 'text-slate-300 hover:bg-white/10 border border-transparent'
          }`}
        >
          <Search size={16} className={isLight ? 'text-cyan-600' : 'text-cyan-400'} />
          <span className="hidden sm:inline">Search apps & portfolio...</span>
        </button>
      </div>

      {/* Center Taskbar Apps */}
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center">
        <TaskbarApps />
      </div>

      {/* Right System Tray & Clock */}
      <div className="flex items-center gap-2">
        <SystemTray />
        <Clock />
      </div>
    </div>
  );
};
