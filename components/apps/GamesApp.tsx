'use client';

import React, { useState } from 'react';
import { Gamepad, Play, ExternalLink, Award, Sparkles, ArrowLeft, RefreshCw } from 'lucide-react';
import { AppIcon } from '../common/AppIcon';

export const GamesApp: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const gameUrl = 'https://mindfoldz0-spec.github.io/lost-dune/';

  if (isPlaying) {
    return (
      <div className="w-full h-full flex flex-col bg-slate-950 text-white font-sans overflow-hidden">
        {/* Game Toolbar */}
        <div className="h-10 bg-slate-900 border-b border-white/10 px-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPlaying(false)}
              className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-lg transition-colors"
            >
              <ArrowLeft size={14} />
              <span>Back to Overview</span>
            </button>
            <span className="text-xs font-semibold text-cyan-400 flex items-center gap-1.5">
              <Gamepad size={14} />
              Lost Dune — Playing
            </span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={gameUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-lg transition-colors"
            >
              <ExternalLink size={13} />
              <span>Open in New Tab</span>
            </a>
          </div>
        </div>

        {/* Embedded Game Iframe */}
        <iframe
          src={gameUrl}
          title="Lost Dune by Mayuresh Samel"
          className="w-full flex-1 border-none bg-black"
          allow="autoplay; fullscreen; focus-without-user-activation; accelerometer; gyroscope"
        />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 h-full flex flex-col items-center justify-start overflow-y-auto select-text font-sans bg-slate-950 text-white">
      {/* Game Icon & Banner */}
      <div className="relative group mb-6">
        <div className="w-24 h-24 rounded-3xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center shadow-2xl shadow-cyan-500/20 group-hover:scale-105 transition-transform duration-300">
          <AppIcon id="games" size={64} alt="Lost Dune Icon" />
        </div>
        <span className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-500 to-red-500 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider text-white shadow-md border border-white/20">
          Diploma Project
        </span>
      </div>

      {/* Game Title */}
      <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-1 flex items-center justify-center gap-3">
        Lost Dune
      </h1>
      <p className="text-xs md:text-sm text-cyan-400 font-medium mb-6 flex items-center gap-1.5">
        <Award size={16} className="text-amber-400" />
        Created & Developed by <strong className="text-white">Mayuresh Samel</strong>
      </p>

      {/* Elaborate Description Box */}
      <div className="w-full max-w-2xl bg-slate-900/80 border border-white/10 rounded-2xl p-6 mb-6 shadow-2xl backdrop-blur-xl text-left space-y-4">
        <div className="flex items-center gap-2 text-amber-400 text-sm font-semibold border-b border-white/10 pb-3">
          <Sparkles size={18} />
          <span>About the Game</span>
        </div>

        <p className="text-sm text-slate-200 leading-relaxed">
          <strong className="text-cyan-300">Lost Dune</strong> is an original web game developed by <strong className="text-white">Mayuresh Samel</strong> during the <strong className="text-amber-300">3rd year of his Diploma in Computer Engineering</strong>.
        </p>

        <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
          Built as a major milestone project, the game combines custom interactive mechanics, atmospheric desert environment design, and web optimization techniques. It represents Mayuresh’s passion for game development, creative level design, and web technology during his engineering diploma studies.
        </p>

        {/* Feature Tags */}
        <div className="flex flex-wrap gap-2 pt-2">
          <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-semibold">
            🎓 3rd Year Diploma Project
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[11px] font-semibold">
            🕹️ Web Game Engine
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-300 text-[11px] font-semibold">
            🏜️ Desert Dune Adventure
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px] font-semibold">
            ⚡ Custom Interactive Mechanics
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-md">
        <button
          onClick={() => setIsPlaying(true)}
          className="w-full sm:w-1/2 flex items-center justify-center gap-2.5 py-3 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
        >
          <Play size={18} fill="currentColor" />
          <span>Play Game Now</span>
        </button>

        <a
          href={gameUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-1/2 flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/10 text-slate-200 hover:text-white font-semibold text-sm transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-center"
        >
          <ExternalLink size={16} />
          <span>Open in New Tab</span>
        </a>
      </div>
    </div>
  );
};
