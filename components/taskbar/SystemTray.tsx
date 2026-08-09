'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSystemStore } from '../../store/useSystemStore';
import { useSettingsStore } from '../../store/useSettingsStore';
import { Wifi, WifiOff, Volume2, VolumeX, BatteryCharging, Sun, Moon, Bluetooth, Plane, Bell } from 'lucide-react';

export const SystemTray: React.FC = () => {
  const {
    isControlCenterOpen,
    toggleControlCenter,
    wifiConnected,
    toggleWifi,
    volume,
    setVolume,
    isMuted,
    toggleMute,
    batteryLevel,
    isCharging,
    notifications,
  } = useSystemStore();

  const { theme, toggleTheme } = useSettingsStore();

  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleControlCenter();
        }}
        className={`px-2.5 py-1.5 rounded-xl transition-all flex items-center gap-2 text-slate-200 ${
          isControlCenterOpen ? 'bg-cyan-500/25 border border-cyan-400/40 text-cyan-300' : 'hover:bg-white/10'
        }`}
      >
        {wifiConnected ? <Wifi size={16} /> : <WifiOff size={16} className="text-red-400" />}
        {isMuted || volume === 0 ? <VolumeX size={16} className="text-amber-400" /> : <Volume2 size={16} />}
        <div className="flex items-center gap-1">
          <BatteryCharging size={16} className="text-emerald-400" />
          <span className="text-[10px] font-mono">{batteryLevel}%</span>
        </div>

        {notifications.length > 0 && (
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
        )}
      </button>

      {/* Quick Settings Flyout Panel */}
      <AnimatePresence>
        {isControlCenterOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-14 right-0 w-80 bg-slate-900/90 backdrop-blur-2xl border border-white/15 rounded-2xl shadow-2xl p-4 text-white z-[9990] font-sans"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-2">
              <span className="text-xs font-semibold tracking-wider text-slate-300">QUICK SETTINGS</span>
              <span className="text-[11px] text-cyan-400 font-mono">Mayuresh OS</span>
            </div>

            {/* Grid of Toggle Buttons */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              {/* Wi-Fi Tile */}
              <button
                onClick={toggleWifi}
                className={`p-3 rounded-xl flex items-center gap-3 transition-all text-left ${
                  wifiConnected
                    ? 'bg-cyan-500 text-slate-950 font-medium shadow-md shadow-cyan-500/20'
                    : 'bg-white/5 border border-white/10 text-slate-400'
                }`}
              >
                {wifiConnected ? <Wifi size={18} /> : <WifiOff size={18} />}
                <div>
                  <div className="text-xs font-semibold">Wi-Fi</div>
                  <div className="text-[10px] opacity-80">{wifiConnected ? 'Connected' : 'Off'}</div>
                </div>
              </button>

              {/* Theme Tile */}
              <button
                onClick={toggleTheme}
                className={`p-3 rounded-xl flex items-center gap-3 transition-all text-left ${
                  theme === 'dark'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'bg-amber-500 text-slate-950 font-medium'
                }`}
              >
                {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
                <div>
                  <div className="text-xs font-semibold">Theme</div>
                  <div className="text-[10px] opacity-80">{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</div>
                </div>
              </button>

              {/* Bluetooth Tile */}
              <button className="p-3 rounded-xl bg-cyan-500 text-slate-950 font-medium flex items-center gap-3 transition-all text-left shadow-md shadow-cyan-500/20">
                <Bluetooth size={18} />
                <div>
                  <div className="text-xs font-semibold">Bluetooth</div>
                  <div className="text-[10px] opacity-80">On</div>
                </div>
              </button>

              {/* Airplane Mode Tile */}
              <button className="p-3 rounded-xl bg-white/5 border border-white/10 text-slate-400 flex items-center gap-3 transition-all text-left hover:bg-white/10">
                <Plane size={18} />
                <div>
                  <div className="text-xs font-semibold">Airplane</div>
                  <div className="text-[10px] opacity-80">Off</div>
                </div>
              </button>
            </div>

            {/* Volume Control Slider */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 mb-3">
              <div className="flex justify-between items-center text-xs text-slate-300 mb-2">
                <span className="flex items-center gap-2">
                  <button onClick={toggleMute}>
                    {isMuted || volume === 0 ? <VolumeX size={16} className="text-red-400" /> : <Volume2 size={16} />}
                  </button>
                  Audio Volume
                </span>
                <span className="font-mono text-cyan-400">{isMuted ? 0 : volume}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={isMuted ? 0 : volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
              />
            </div>

            {/* Notifications Footer */}
            <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-white/10">
              <span className="flex items-center gap-1.5">
                <Bell size={14} className="text-cyan-400" />
                {notifications.length} Notification{notifications.length === 1 ? '' : 's'}
              </span>
              <span className="text-[10px] font-mono text-emerald-400">Battery {isCharging ? '⚡ Charging' : '100%'}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
