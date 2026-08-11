'use client';

import React, { useState } from 'react';
import { WALLPAPERS } from '../../data/portfolio';
import { useSettingsStore } from '../../store/useSettingsStore';
import { useSystemStore } from '../../store/useSystemStore';
import { useWindowStore } from '../../store/useWindowStore';
import { AppIcon } from '../common/AppIcon';
import {
  Settings,
  Image as ImageIcon,
  Sun,
  Moon,
  Sparkles,
  RefreshCcw,
  Check,
  Minus,
  X,
  Play,
  Monitor,
  CheckCircle2,
} from 'lucide-react';

export const SettingsApp: React.FC = () => {
  const {
    wallpaperId,
    setWallpaper,
    theme,
    setTheme,
    animationsEnabled,
    toggleAnimations,
    resetSettings,
  } = useSettingsStore();

  const { addNotification, restartBootSequence } = useSystemStore();
  const { minimizeWindow, closeWindow } = useWindowStore();

  const [activeTab, setActiveTab] = useState<'wallpapers' | 'appearance' | 'system'>('wallpapers');

  // Currently active wallpaper item
  const activeWallpaper = WALLPAPERS.find((w) => w.id === wallpaperId) || WALLPAPERS[0];

  const getCleanUrl = (urlStr: string) => {
    const match = urlStr.match(/url\(['"]?([^'"]+)['"]?\)/);
    const rawUrl = match ? match[1] : urlStr;
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
    const cleanPath = rawUrl.startsWith('/') ? rawUrl : `/${rawUrl}`;
    return rawUrl.startsWith('http') ? rawUrl : `${basePath}${cleanPath}`;
  };

  const activeHeroUrl = getCleanUrl(activeWallpaper.thumbnail);

  return (
    <div
      className="w-full text-white shadow-2xl relative overflow-hidden flex flex-col justify-between select-none font-sans rounded-[36px] p-7 transition-all"
      style={{
        background: 'rgba(38, 52, 42, 0.52)',
        backdropFilter: 'blur(50px) saturate(180%)',
        WebkitBackdropFilter: 'blur(50px) saturate(180%)',
        border: '1px solid rgba(255, 255, 255, 0.25)',
        boxShadow: '0 30px 60px rgba(0, 0, 0, 0.5), inset 0 1.5px 1px rgba(255, 255, 255, 0.3)',
      }}
    >
      {/* Top Header Row (App Icon, Title, Tab Switcher, Window Controls) */}
      <div className="flex items-center justify-between gap-4 mb-6 cursor-move select-none border-b border-white/15 pb-4">
        {/* Top Left: App Icon & Title */}
        <div className="flex items-center gap-2.5">
          <AppIcon id="settings" size={22} />
          <div>
            <h2 className="text-sm font-bold text-white leading-none tracking-wide">Settings</h2>
            <span className="text-[10px] text-white/60 font-light">Personalization & Controls</span>
          </div>
        </div>

        {/* Center: Segmented Navigation Pills */}
        <div
          className="p-1 rounded-2xl flex items-center gap-1"
          style={{
            background: 'rgba(255, 255, 255, 0.10)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
          }}
        >
          <button
            onClick={() => setActiveTab('wallpapers')}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all duration-300 ${
              activeTab === 'wallpapers'
                ? 'bg-white text-slate-900 shadow-md font-bold'
                : 'text-white/80 hover:text-white'
            }`}
          >
            Wallpapers
          </button>
          <button
            onClick={() => setActiveTab('appearance')}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all duration-300 ${
              activeTab === 'appearance'
                ? 'bg-white text-slate-900 shadow-md font-bold'
                : 'text-white/80 hover:text-white'
            }`}
          >
            Appearance
          </button>
          <button
            onClick={() => setActiveTab('system')}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all duration-300 ${
              activeTab === 'system'
                ? 'bg-white text-slate-900 shadow-md font-bold'
                : 'text-white/80 hover:text-white'
            }`}
          >
            System
          </button>
        </div>

        {/* Top Right: Reset & Window Controls (Minimize & Close only) */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              resetSettings();
              addNotification('Settings Reset', 'Desktop configuration restored to defaults.', 'info');
            }}
            className="px-3 py-1.5 rounded-xl text-xs text-white/80 hover:text-white flex items-center gap-1.5 transition-all active:scale-95"
            style={{
              background: 'rgba(255, 255, 255, 0.12)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              backdropFilter: 'blur(12px)',
            }}
            title="Reset Settings"
          >
            <RefreshCcw size={13} />
            <span className="hidden sm:inline">Reset</span>
          </button>

          {/* Window Controls */}
          <div className="flex items-center gap-0.5" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => minimizeWindow('settings')}
              className="w-8 h-8 rounded-lg hover:bg-white/15 flex items-center justify-center text-white/80 hover:text-white transition-colors"
              title="Minimize"
            >
              <Minus size={14} />
            </button>
            <button
              onClick={() => closeWindow('settings')}
              className="w-8 h-8 rounded-lg hover:bg-red-500/80 flex items-center justify-center text-white/80 hover:text-white transition-colors"
              title="Close"
            >
              <X size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Body */}
      <div className="space-y-5 my-1 min-h-[380px]">
        {activeTab === 'wallpapers' && (
          <div className="space-y-4">
            {/* Live Active Desktop Preview Showcase Header */}
            <div
              className="relative h-36 rounded-2xl overflow-hidden border border-white/25 shadow-xl flex items-end p-4 group"
              style={{
                backgroundImage: `url("${activeHeroUrl}")`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none" />

              {/* Monitor Outline Graphic Badge */}
              <div className="relative z-10 flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white">
                    <Monitor size={18} />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-wider text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 size={11} /> Active Desktop Wallpaper
                    </span>
                    <h3 className="text-base font-bold text-white drop-shadow-md">
                      {activeWallpaper.name}
                    </h3>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-[10px] font-mono text-white/90">
                  4K Ultra HD
                </span>
              </div>
            </div>

            {/* Wallpaper Grid Showcase (Padded to prevent card selection clipping) */}
            <div>
              <div className="flex items-center justify-between mb-2 px-1">
                <span className="text-xs font-semibold text-white/80 uppercase tracking-wider flex items-center gap-1.5">
                  <ImageIcon size={14} className="text-emerald-400" />
                  Select Wallpaper ({WALLPAPERS.length})
                </span>
                <span className="text-[10px] text-white/50">Click to apply instantly</span>
              </div>

              {/* Added container padding (p-2) to avoid scale clipping */}
              <div className="grid grid-cols-3 gap-4 max-h-[230px] overflow-y-auto p-2 pr-2 custom-scrollbar">
                {WALLPAPERS.map((wall) => {
                  const isSelected = wallpaperId === wall.id;
                  const thumbUrl = getCleanUrl(wall.thumbnail);

                  return (
                    <button
                      key={wall.id}
                      onClick={() => setWallpaper(wall.id)}
                      className={`relative h-24 rounded-2xl p-3 flex flex-col justify-end text-left transition-all overflow-hidden group ${
                        isSelected
                          ? 'border-2 border-white shadow-[0_0_20px_rgba(255,255,255,0.4)]'
                          : 'border border-white/20 hover:border-white/40'
                      }`}
                      style={{
                        backgroundImage: `url("${thumbUrl}")`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }}
                    >
                      <img
                        src={thumbUrl}
                        alt={wall.name}
                        className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.currentTarget as HTMLElement).style.display = 'none';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

                      {isSelected && (
                        <div className="absolute top-2.5 right-2.5 p-1 rounded-full bg-white text-slate-950 shadow-lg z-10 font-bold">
                          <Check size={12} />
                        </div>
                      )}

                      <span className="text-xs font-semibold text-white drop-shadow-md leading-tight relative z-10 line-clamp-1">
                        {wall.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'appearance' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* System Theme Card */}
            <div
              className="p-5 rounded-2xl space-y-4"
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                backdropFilter: 'blur(15px)',
              }}
            >
              <h4 className="text-xs font-bold text-white/80 uppercase tracking-wider flex items-center gap-2">
                <Sun size={15} className="text-amber-400" />
                Color Theme
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setTheme('dark')}
                  className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                    theme === 'dark'
                      ? 'bg-white text-slate-950 font-bold border-white shadow-md'
                      : 'bg-black/30 text-white/80 border-white/15 hover:border-white/30'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Moon size={16} />
                    <span className="text-xs">Dark Mode</span>
                  </div>
                  {theme === 'dark' && <Check size={14} />}
                </button>

                <button
                  onClick={() => setTheme('light')}
                  className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                    theme === 'light'
                      ? 'bg-white text-slate-950 font-bold border-white shadow-md'
                      : 'bg-black/30 text-white/80 border-white/15 hover:border-white/30'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Sun size={16} />
                    <span className="text-xs">Light Mode</span>
                  </div>
                  {theme === 'light' && <Check size={14} />}
                </button>
              </div>
            </div>

            {/* Motion & Animations Card */}
            <div
              className="p-5 rounded-2xl space-y-4"
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                backdropFilter: 'blur(15px)',
              }}
            >
              <h4 className="text-xs font-bold text-white/80 uppercase tracking-wider flex items-center gap-2">
                <Sparkles size={15} className="text-emerald-400" />
                Motion Effects
              </h4>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-white">Framer Motion</div>
                  <div className="text-[11px] text-white/60">
                    {animationsEnabled ? 'Fluid transitions active' : 'Reduced motion mode'}
                  </div>
                </div>

                <button
                  onClick={toggleAnimations}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    animationsEnabled
                      ? 'bg-white text-slate-950 shadow-md'
                      : 'bg-black/30 text-white/70 border border-white/15'
                  }`}
                >
                  {animationsEnabled ? 'Enabled' : 'Disabled'}
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'system' && (
          <div className="space-y-4">
            <div
              className="p-5 rounded-2xl flex items-center justify-between"
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                backdropFilter: 'blur(15px)',
              }}
            >
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-2">
                  <Play size={15} className="text-red-400" />
                  Re-run Boot & Loader Experience
                </div>
                <div className="text-[11px] text-white/60 mt-0.5">
                  Re-trigger the Windows boot screen and lock screen.
                </div>
              </div>
              <button
                onClick={restartBootSequence}
                className="px-4 py-2 rounded-xl bg-white text-slate-950 font-bold text-xs hover:bg-white/90 shadow-md transition-all active:scale-95"
              >
                Run Boot
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Footer Note */}
      <div className="pt-3 border-t border-white/15 flex items-center justify-between text-[11px] text-white/60 font-mono">
        <span>Windows OS Portfolio v1.0</span>
        <span>Made with Next.js & Tailwind</span>
      </div>
    </div>
  );
};
