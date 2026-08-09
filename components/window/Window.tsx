'use client';

import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppId, WindowState } from '../../types';
import { useWindowStore } from '../../store/useWindowStore';
import { WindowControls } from './WindowControls';
import * as LucideIcons from 'lucide-react';

interface WindowProps {
  windowState: WindowState;
  children: React.ReactNode;
}

export const Window: React.FC<WindowProps> = ({ windowState, children }) => {
  const { id, title, iconName, isOpen, isMinimized, isMaximized, zIndex, position, size } =
    windowState;
  const { focusWindow, maximizeWindow, activeWindowId, updatePosition } = useWindowStore();
  const windowRef = useRef<HTMLDivElement>(null);

  if (!isOpen || isMinimized) return null;

  const isActive = activeWindowId === id;

  const IconComponent =
    (LucideIcons as unknown as Record<string, React.ElementType>)[iconName] || LucideIcons.AppWindow;

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
        className={`fixed flex flex-col font-sans select-none overflow-hidden transition-shadow ${
          isMaximized ? 'rounded-none' : 'rounded-2xl border'
        } ${
          isActive
            ? 'bg-slate-900/90 backdrop-blur-2xl border-cyan-500/40 shadow-[0_20px_50px_rgba(0,0,0,0.5)]'
            : 'bg-slate-900/75 backdrop-blur-md border-white/10 shadow-lg'
        }`}
      >
        {/* Title Bar Drag Handle */}
        <div
          onDoubleClick={() => maximizeWindow(id)}
          className={`h-11 px-4 flex items-center justify-between cursor-move border-b select-none transition-colors ${
            isActive
              ? 'bg-gradient-to-r from-slate-900 via-slate-800/80 to-slate-900 border-white/15'
              : 'bg-slate-950/60 border-white/5'
          }`}
        >
          {/* Left Title & App Icon */}
          <div className="flex items-center gap-2.5">
            <div
              className={`p-1.5 rounded-lg flex items-center justify-center ${
                isActive ? 'bg-cyan-500/20 text-cyan-300' : 'bg-white/5 text-slate-400'
              }`}
            >
              <IconComponent size={16} />
            </div>
            <span className="text-xs font-semibold text-slate-200 tracking-wide">{title}</span>
          </div>

          {/* Right Window Control Buttons */}
          <WindowControls id={id} isMaximized={isMaximized} />
        </div>

        {/* Window Content Body */}
        <div className="flex-1 w-full h-[calc(100%-44px)] overflow-auto bg-slate-950/60 text-slate-100 font-sans custom-scrollbar">
          {children}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
