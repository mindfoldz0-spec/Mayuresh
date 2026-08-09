'use client';

import React from 'react';
import { Minus, Square, Copy, X } from 'lucide-react';
import { AppId } from '../../types';
import { useWindowStore } from '../../store/useWindowStore';

interface WindowControlsProps {
  id: AppId;
  isMaximized: boolean;
}

export const WindowControls: React.FC<WindowControlsProps> = ({ id, isMaximized }) => {
  const { minimizeWindow, maximizeWindow, closeWindow } = useWindowStore();

  return (
    <div className="flex items-center gap-1 select-none" onClick={(e) => e.stopPropagation()}>
      {/* Minimize Button */}
      <button
        onClick={() => minimizeWindow(id)}
        className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
        title="Minimize"
      >
        <Minus size={14} />
      </button>

      {/* Maximize / Restore Button */}
      <button
        onClick={() => maximizeWindow(id)}
        className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
        title={isMaximized ? 'Restore Down' : 'Maximize'}
      >
        {isMaximized ? <Copy size={13} /> : <Square size={13} />}
      </button>

      {/* Close Button */}
      <button
        onClick={() => closeWindow(id)}
        className="w-8 h-8 rounded-lg hover:bg-red-500/80 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
        title="Close"
      >
        <X size={15} />
      </button>
    </div>
  );
};
