'use client';

import React from 'react';
import { Search, X } from 'lucide-react';

interface StartMenuSearchProps {
  value: string;
  onChange: (val: string) => void;
  onClear: () => void;
}

export const StartMenuSearch: React.FC<StartMenuSearchProps> = ({
  value,
  onChange,
  onClear,
}) => {
  return (
    <div className="relative w-full mb-6">
      <div className="relative flex items-center w-full bg-slate-800/80 border border-white/15 focus-within:border-cyan-400/80 focus-within:ring-2 focus-within:ring-cyan-500/30 rounded-2xl px-4 py-2.5 shadow-inner transition-all">
        <Search size={18} className="text-cyan-400 mr-3 shrink-0" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Type here to search apps, projects, skills..."
          className="w-full bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none font-sans"
          autoFocus
        />
        {value && (
          <button
            onClick={onClear}
            className="p-1 rounded-full hover:bg-white/10 text-slate-400 hover:text-white"
          >
            <X size={14} />
          </button>
        )}
      </div>
    </div>
  );
};
