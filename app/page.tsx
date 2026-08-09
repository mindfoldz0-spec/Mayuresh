'use client';

import React from 'react';
import { useSystemStore } from '../store/useSystemStore';
import { BootLoader } from '../components/boot/BootLoader';
import { PortfolioLoadingScreen } from '../components/boot/PortfolioLoadingScreen';
import { LockScreen } from '../components/boot/LockScreen';
import { Desktop } from '../components/desktop/Desktop';
import { Taskbar } from '../components/taskbar/Taskbar';
import { StartMenu } from '../components/start-menu/StartMenu';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, Info, AlertTriangle, X } from 'lucide-react';

export default function Home() {
  const { bootStage, notifications, dismissNotification } = useSystemStore();

  return (
    <main className="relative w-screen h-screen overflow-hidden select-none bg-slate-950 font-sans">
      <AnimatePresence>
        {bootStage === 'booting' && (
          <motion.div key="booting" initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <BootLoader />
          </motion.div>
        )}

        {bootStage === 'loading' && (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <PortfolioLoadingScreen />
          </motion.div>
        )}

        {bootStage === 'lockscreen' && (
          <motion.div key="lockscreen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <LockScreen />
          </motion.div>
        )}

        {bootStage === 'desktop' && (
          <motion.div
            key="desktop"
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="w-full h-full relative"
          >
            {/* Desktop Environment Workspace */}
            <Desktop />

            {/* Taskbar */}
            <Taskbar />

            {/* Start Menu */}
            <StartMenu />

            {/* Global Windows Notifications / Toasts */}
            <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-2 max-w-sm pointer-events-none">
              <AnimatePresence>
                {notifications.map((n) => (
                  <motion.div
                    key={n.id}
                    initial={{ opacity: 0, x: 50, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 50, scale: 0.95 }}
                    className="pointer-events-auto p-4 rounded-2xl bg-slate-900/90 backdrop-blur-2xl border border-white/15 shadow-2xl text-white flex items-start gap-3"
                  >
                    <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 shrink-0">
                      {n.type === 'success' ? (
                        <CheckCircle size={18} className="text-emerald-400" />
                      ) : n.type === 'warning' ? (
                        <AlertTriangle size={18} className="text-amber-400" />
                      ) : (
                        <Info size={18} className="text-cyan-400" />
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-white">{n.title}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{n.time}</span>
                      </div>
                      <p className="text-xs text-slate-300 mt-0.5 leading-snug">{n.message}</p>
                    </div>

                    <button
                      onClick={() => dismissNotification(n.id)}
                      className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white shrink-0"
                    >
                      <X size={14} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
