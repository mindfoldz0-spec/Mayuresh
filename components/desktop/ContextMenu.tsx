'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Monitor, Terminal, FileText, Settings, Moon, Sun, Power } from 'lucide-react';
import { useWindowStore } from '../../store/useWindowStore';
import { useSettingsStore } from '../../store/useSettingsStore';
import { useSystemStore } from '../../store/useSystemStore';

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, onClose }) => {
  const { openWindow } = useWindowStore();
  const { theme, toggleTheme } = useSettingsStore();
  const { restartBootSequence } = useSystemStore();

  const handleAction = (action: () => void) => {
    action();
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.12 }}
      style={{ top: y, left: x }}
      onClick={(e) => e.stopPropagation()}
      className={`fixed z-[9990] w-56 backdrop-blur-2xl border rounded-2xl shadow-2xl p-1.5 text-xs select-none font-sans transition-colors duration-200 ${
        theme === 'light'
          ? 'bg-white/85 border-slate-300/80 text-slate-800 shadow-xl'
          : 'bg-slate-900/85 border-white/15 text-slate-100 shadow-2xl'
      }`}
    >
      <div className="flex flex-col gap-0.5">
        <button
          onClick={() => handleAction(() => window.location.reload())}
          className={`flex items-center gap-2.5 px-3 py-2 rounded-xl transition-colors text-left ${
            theme === 'light' ? 'hover:bg-slate-200/80' : 'hover:bg-white/10'
          }`}
        >
          <RefreshCw size={14} className="text-cyan-400" />
          <span>Refresh</span>
        </button>

        <div className={`h-px my-1 ${theme === 'light' ? 'bg-slate-300/80' : 'bg-white/10'}`} />

        <button
          onClick={() => handleAction(() => openWindow('about'))}
          className={`flex items-center gap-2.5 px-3 py-2 rounded-xl transition-colors text-left ${
            theme === 'light' ? 'hover:bg-slate-200/80' : 'hover:bg-white/10'
          }`}
        >
          <Monitor size={14} className="text-blue-400" />
          <span>About Mayuresh</span>
        </button>

        <button
          onClick={() => handleAction(() => openWindow('explorer'))}
          className={`flex items-center gap-2.5 px-3 py-2 rounded-xl transition-colors text-left ${
            theme === 'light' ? 'hover:bg-slate-200/80' : 'hover:bg-white/10'
          }`}
        >
          <FileText size={14} className="text-amber-400" />
          <span>File Explorer</span>
        </button>

        <button
          onClick={() => handleAction(() => openWindow('terminal'))}
          className={`flex items-center gap-2.5 px-3 py-2 rounded-xl transition-colors text-left ${
            theme === 'light' ? 'hover:bg-slate-200/80' : 'hover:bg-white/10'
          }`}
        >
          <Terminal size={14} className="text-emerald-400" />
          <span>Open Terminal</span>
        </button>

        <div className={`h-px my-1 ${theme === 'light' ? 'bg-slate-300/80' : 'bg-white/10'}`} />

        <button
          onClick={() => handleAction(() => openWindow('settings'))}
          className={`flex items-center gap-2.5 px-3 py-2 rounded-xl transition-colors text-left ${
            theme === 'light' ? 'hover:bg-slate-200/80' : 'hover:bg-white/10'
          }`}
        >
          <Settings size={14} className="text-purple-400" />
          <span>Personalize & Wallpaper</span>
        </button>

        <button
          onClick={() => handleAction(toggleTheme)}
          className={`flex items-center gap-2.5 px-3 py-2 rounded-xl transition-colors text-left ${
            theme === 'light' ? 'hover:bg-slate-200/80' : 'hover:bg-white/10'
          }`}
        >
          {theme === 'dark' ? (
            <Sun size={14} className="text-amber-500" />
          ) : (
            <Moon size={14} className="text-indigo-600" />
          )}
          <span>Switch to {theme === 'dark' ? 'Light' : 'Dark'} Mode</span>
        </button>

        <div className={`h-px my-1 ${theme === 'light' ? 'bg-slate-300/80' : 'bg-white/10'}`} />

        <button
          onClick={() => handleAction(restartBootSequence)}
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-red-500/20 hover:text-red-300 transition-colors text-left text-red-400"
        >
          <Power size={14} />
          <span>Restart Boot Loader</span>
        </button>
      </div>
    </motion.div>
  );
};
