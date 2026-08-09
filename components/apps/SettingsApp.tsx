'use client';

import React from 'react';
import { WALLPAPERS } from '../../data/portfolio';
import { useSettingsStore } from '../../store/useSettingsStore';
import { useSystemStore } from '../../store/useSystemStore';
import { Settings, Image, Sun, Moon, Volume2, Sparkles, RefreshCcw, Check } from 'lucide-react';

export const SettingsApp: React.FC = () => {
  const {
    wallpaperId,
    setWallpaper,
    theme,
    toggleTheme,
    animationsEnabled,
    toggleAnimations,
    soundEnabled,
    toggleSound,
    resetSettings,
  } = useSettingsStore();

  const { addNotification, restartBootSequence } = useSystemStore();

  return (
    <div className="p-6 space-y-8 select-text font-sans">
      {/* Header */}
      <div className="border-b border-white/10 pb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Settings className="text-cyan-400" size={22} />
            System Settings & Personalization
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Customize wallpaper, visual themes, sound effects, and desktop performance options.
          </p>
        </div>

        <button
          onClick={() => {
            resetSettings();
            addNotification('Settings Reset', 'Desktop configuration restored to defaults.', 'info');
          }}
          className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 text-xs text-slate-300 border border-white/10 flex items-center gap-1.5 transition-colors"
        >
          <RefreshCcw size={14} />
          <span>Reset Defaults</span>
        </button>
      </div>

      {/* Wallpaper Personalization Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
          <Image size={16} />
          Desktop Wallpapers
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {WALLPAPERS.map((wall) => {
            const isSelected = wallpaperId === wall.id;

            return (
              <button
                key={wall.id}
                onClick={() => setWallpaper(wall.id)}
                className={`relative h-28 rounded-2xl p-3 flex flex-col justify-end text-left border transition-all overflow-hidden group shadow-md ${
                  isSelected
                    ? 'border-cyan-400 ring-2 ring-cyan-500/50 scale-105'
                    : 'border-white/10 hover:border-white/30'
                }`}
                style={{ background: wall.thumbnail }}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2 p-1 rounded-full bg-cyan-500 text-slate-950 shadow-md">
                    <Check size={12} />
                  </div>
                )}
                <span className="text-[11px] font-semibold text-white drop-shadow-md leading-tight">
                  {wall.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Visual Theme & Appearance Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/10">
        {/* Theme Mode Card */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 space-y-4 shadow-lg">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            System Theme
          </h4>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-300">
                {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
              </div>
              <div>
                <div className="text-xs font-semibold text-white">Color Mode</div>
                <div className="text-[11px] text-slate-400">Currently {theme} mode</div>
              </div>
            </div>

            <button
              onClick={toggleTheme}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs transition-all shadow-md"
            >
              Switch to {theme === 'dark' ? 'Light' : 'Dark'}
            </button>
          </div>
        </div>

        {/* Animations Toggle */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 space-y-4 shadow-lg">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Motion & Effects
          </h4>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-300">
                <Sparkles size={20} />
              </div>
              <div>
                <div className="text-xs font-semibold text-white">Framer Motion Animations</div>
                <div className="text-[11px] text-slate-400">
                  {animationsEnabled ? 'Smooth window transitions enabled' : 'Reduced motion'}
                </div>
              </div>
            </div>

            <button
              onClick={toggleAnimations}
              className={`px-4 py-2 rounded-xl font-semibold text-xs transition-all ${
                animationsEnabled
                  ? 'bg-cyan-500 text-slate-950'
                  : 'bg-white/10 text-slate-300 border border-white/15'
              }`}
            >
              {animationsEnabled ? 'Enabled' : 'Disabled'}
            </button>
          </div>
        </div>
      </div>

      {/* Boot Loader Action */}
      <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 flex items-center justify-between">
        <div>
          <div className="text-xs font-bold text-white">Re-run Boot & Loader Experience</div>
          <div className="text-[11px] text-slate-400">
            Re-trigger the 4-stage Windows boot screen and lock screen.
          </div>
        </div>
        <button
          onClick={restartBootSequence}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-white border border-slate-700 font-semibold transition-colors"
        >
          Run Boot Sequence
        </button>
      </div>
    </div>
  );
};
