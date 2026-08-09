'use client';

import React from 'react';
import { StartButton } from './StartButton';
import { TaskbarApps } from './TaskbarApps';
import { SystemTray } from './SystemTray';
import { Clock } from './Clock';
import { useSystemStore } from '../../store/useSystemStore';
import { Search } from 'lucide-react';

export const Taskbar: React.FC = () => {
  const { toggleSearch, isSearchOpen } = useSystemStore();

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="fixed bottom-0 left-0 right-0 h-14 bg-slate-900/75 backdrop-blur-2xl border-t border-white/10 z-[9900] px-4 flex items-center justify-between shadow-2xl select-none font-sans"
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
          className={`px-3 py-2 rounded-xl transition-all flex items-center gap-2 text-xs font-medium text-slate-300 ${
            isSearchOpen ? 'bg-cyan-500/25 border border-cyan-400/40 text-cyan-300' : 'hover:bg-white/10'
          }`}
        >
          <Search size={16} className="text-cyan-400" />
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
