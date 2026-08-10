'use client';

import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppId, WindowState } from '../../types';
import { useWindowStore } from '../../store/useWindowStore';
import { useSettingsStore } from '../../store/useSettingsStore';
import { WindowControls } from './WindowControls';
import { AppIcon } from '../common/AppIcon';

interface WindowProps {
  windowState: WindowState;
  children: React.ReactNode;
}

export const Window: React.FC<WindowProps> = ({ windowState, children }) => {
  const { id, title, iconName, isOpen, isMinimized, isMaximized, zIndex, position, size } =
    windowState;
  const { focusWindow, maximizeWindow, activeWindowId, updatePosition } = useWindowStore();
  const { theme } = useSettingsStore();
  const windowRef = useRef<HTMLDivElement>(null);

  if (!isOpen || isMinimized) return null;

  const isActive = activeWindowId === id;
  const isLight = theme === 'light';

  return (
    <AnimatePresence mode="wait">
      <motion.div
        ref={windowRef}
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
        drag={!isMaximized}
        dragMomentum={false}
        dragElastic={0}
        onDragEnd={(_, info) => {
          updatePosition(id, {
            x: Math.max(10, position.x + info.offset.x),
            y: Math.max(10, position.y + info.offset.y),
          });
        }}
        onClick={() => focusWindow(id)}
        style={{
          zIndex,
          left: isMaximized ? 0 : position.x,
          top: isMaximized ? 0 : position.y,
          width: isMaximized ? '100vw' : size.width,
          height: isMaximized ? 'calc(100vh - 56px)' : size.height,
        }}
        className={`fixed flex flex-col font-sans select-none overflow-hidden transition-shadow duration-300 ${
          isMaximized ? 'rounded-none' : 'rounded-2xl border'
        } ${
          isLight
            ? isActive
              ? 'bg-slate-100/95 backdrop-blur-2xl border-slate-300 shadow-[0_20px_50px_rgba(0,0,0,0.2)] text-slate-900'
              : 'bg-slate-100/80 backdrop-blur-md border-slate-200 shadow-md text-slate-800'
            : isActive
              ? 'bg-slate-900/90 backdrop-blur-2xl border-cyan-500/40 shadow-[0_20px_50px_rgba(0,0,0,0.5)] text-slate-100'
              : 'bg-slate-900/75 backdrop-blur-md border-white/10 shadow-lg text-slate-200'
        }`}
      >
        {/* Title Bar Drag Handle */}
        <div
          onDoubleClick={() => maximizeWindow(id)}
          className={`h-11 px-4 flex items-center justify-between cursor-move border-b select-none transition-colors ${
            isLight
              ? isActive
                ? 'bg-slate-200/90 border-slate-300'
                : 'bg-slate-100/60 border-slate-200'
              : isActive
                ? 'bg-gradient-to-r from-slate-900 via-slate-800/80 to-slate-900 border-white/15'
                : 'bg-slate-950/60 border-white/5'
          }`}
        >
          {/* Left Title & App Icon */}
          <div className="flex items-center gap-2.5">
            <div
              className={`p-1 rounded-lg flex items-center justify-center ${
                isActive
                  ? isLight
                    ? 'bg-cyan-500/15 text-cyan-700'
                    : 'bg-cyan-500/20 text-cyan-300'
                  : isLight
                    ? 'bg-slate-300/50 text-slate-600'
                    : 'bg-white/5 text-slate-400'
              }`}
            >
              <AppIcon id={id} iconName={iconName} size={18} />
            </div>
            <span className={`text-xs font-semibold tracking-wide ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
              {title}
            </span>
          </div>

          {/* Right Window Control Buttons */}
          <WindowControls id={id} isMaximized={isMaximized} />
        </div>

        {/* Window Content Body */}
        <div className={`flex-1 w-full h-[calc(100%-44px)] overflow-auto font-sans custom-scrollbar ${
          isLight ? 'bg-white/90 text-slate-900' : 'bg-slate-950/60 text-slate-100'
        }`}>
          {children}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
