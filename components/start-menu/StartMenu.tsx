'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSystemStore } from '../../store/useSystemStore';
import { useWindowStore } from '../../store/useWindowStore';
import { APPS_CONFIG } from '../../data/apps';
import { PROJECTS, SKILL_CATEGORIES } from '../../data/portfolio';
import { StartMenuSearch } from './StartMenuSearch';
import { AppId } from '../../types';
import { AppIcon } from '../common/AppIcon';
import { Power, RotateCcw, Lock, ExternalLink, Briefcase, ShieldCheck } from 'lucide-react';

import { useSettingsStore } from '../../store/useSettingsStore';

export const StartMenu: React.FC = () => {
  const { isStartMenuOpen, toggleStartMenu, setBootStage, restartBootSequence } = useSystemStore();
  const { openWindow } = useWindowStore();
  const { theme } = useSettingsStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [showPowerMenu, setShowPowerMenu] = useState(false);

  if (!isStartMenuOpen) return null;

  const isLight = theme === 'light';

  const filteredApps = APPS_CONFIG.filter(
    (app) =>
      app.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredProjects = PROJECTS.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.techStack.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleLaunchApp = (id: AppId) => {
    openWindow(id);
    toggleStartMenu(false);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.96 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        onClick={(e) => e.stopPropagation()}
        className={`fixed bottom-16 left-1/2 -translate-x-1/2 w-full max-w-2xl backdrop-blur-3xl rounded-3xl p-6 z-[9950] font-sans overflow-hidden select-none transition-colors duration-300 ${
          isLight
            ? 'bg-white/90 border border-slate-300/80 text-slate-900 shadow-[0_25px_60px_rgba(0,0,0,0.18)]'
            : 'bg-slate-900/90 border border-white/15 text-white shadow-[0_25px_60px_rgba(0,0,0,0.6)]'
        }`}
      >
        {/* Search Bar */}
        <StartMenuSearch
          value={searchQuery}
          onChange={setSearchQuery}
          onClear={() => setSearchQuery('')}
        />

        {searchQuery ? (
          /* Search Results Mode */
          <div className="max-h-96 overflow-y-auto pr-2 space-y-4 font-sans no-scrollbar">
            {/* Apps section */}
            <div>
              <h4 className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2">
                Apps ({filteredApps.length})
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {filteredApps.map((app) => (
                  <button
                    key={app.id}
                    onClick={() => handleLaunchApp(app.id)}
                    className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/15 flex items-center gap-3 transition-all text-left"
                  >
                    <div className="p-1.5 rounded-xl bg-slate-800/80 border border-white/10">
                      <AppIcon id={app.id} iconName={app.iconName} size={22} />
                    </div>
                    <span className="text-xs font-medium text-slate-100">{app.title}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Projects section */}
            {filteredProjects.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2">
                  Projects ({filteredProjects.length})
                </h4>
                <div className="space-y-2">
                  {filteredProjects.map((proj) => (
                    <button
                      key={proj.id}
                      onClick={() => handleLaunchApp('projects')}
                      className="w-full p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/15 flex items-center justify-between transition-all text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300">
                          <Briefcase size={18} />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-white">{proj.title}</div>
                          <div className="text-[11px] text-slate-400 line-clamp-1">
                            {proj.shortDescription}
                          </div>
                        </div>
                      </div>
                      <ExternalLink size={14} className="text-slate-400" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Normal Pinned & Recommended Mode */
          <div className="space-y-6">
            {/* Pinned Apps */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-semibold tracking-wider text-slate-300">PINNED APPS</span>
                <span className="text-[11px] text-cyan-400">All Apps ({APPS_CONFIG.length})</span>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                {APPS_CONFIG.map((app) => (
                  <button
                    key={app.id}
                    onClick={() => handleLaunchApp(app.id)}
                    className="p-3 rounded-2xl hover:bg-white/10 flex flex-col items-center gap-2 transition-all group"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-slate-800/60 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                      <AppIcon id={app.id} iconName={app.iconName} size={30} />
                    </div>
                    <span className="text-[11px] font-medium text-slate-200 text-center leading-tight line-clamp-1">
                      {app.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Recommended Portfolio Shortcuts */}
            <div>
              <div className="text-xs font-semibold tracking-wider text-slate-300 mb-3">
                RECOMMENDED FOR YOU
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  onClick={() => handleLaunchApp('about')}
                  className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/15 flex items-center gap-3 transition-all text-left"
                >
                  <div className="p-1 rounded-xl bg-slate-800/80 border border-white/10">
                    <AppIcon id="about" size={28} />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white">About Mayuresh</div>
                    <div className="text-[11px] text-slate-400">Full Stack Engineer Profile</div>
                  </div>
                </button>

                <button
                  onClick={() => handleLaunchApp('projects')}
                  className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/15 flex items-center gap-3 transition-all text-left"
                >
                  <div className="p-1 rounded-xl bg-slate-800/80 border border-white/10">
                    <AppIcon id="projects" size={28} />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white">Featured Projects</div>
                    <div className="text-[11px] text-slate-400">Explore Web & AI applications</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer Profile & Power Menu */}
        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between relative">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-800 border border-cyan-400/40 p-0.5 overflow-hidden shadow-md flex items-center justify-center">
              <AppIcon id="about" size={32} alt="User Avatar" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">Mayuresh</div>
              <div className="text-[11px] text-cyan-400 font-mono">mayuresh.dev</div>
            </div>
          </div>

          {/* Power Button */}
          <div className="relative">
            <button
              onClick={() => setShowPowerMenu(!showPowerMenu)}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-red-500/20 text-slate-200 hover:text-red-400 transition-colors"
              title="Power Options"
            >
              <Power size={18} />
            </button>

            {/* Power Menu Popover */}
            <AnimatePresence>
              {showPowerMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className="absolute right-0 bottom-12 w-48 bg-slate-950 border border-white/15 rounded-2xl shadow-2xl p-1.5 z-50 text-xs font-sans"
                >
                  <button
                    onClick={() => {
                      setShowPowerMenu(false);
                      toggleStartMenu(false);
                      setBootStage('lockscreen');
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/10 text-slate-200 text-left"
                  >
                    <Lock size={14} className="text-cyan-400" />
                    <span>Lock Screen</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowPowerMenu(false);
                      toggleStartMenu(false);
                      restartBootSequence();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/10 text-slate-200 text-left"
                  >
                    <RotateCcw size={14} className="text-amber-400" />
                    <span>Restart Boot Loader</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
