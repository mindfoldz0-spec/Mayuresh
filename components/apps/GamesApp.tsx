'use client';

import React, { useState } from 'react';
import { Gamepad, Play, ExternalLink, ArrowLeft, ShieldCheck, Flame, GraduationCap, Sparkles } from 'lucide-react';
import { AppIcon } from '../common/AppIcon';

export const GamesApp: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const gameUrl = 'https://mindfoldz0-spec.github.io/lost-dune/';

  if (isPlaying) {
    return (
      <div className="w-full h-full flex flex-col bg-[#1e1b18] text-[#fbf7f0] font-sans overflow-hidden select-none">
        {/* Game Toolbar */}
        <div className="h-10 bg-[#2c2824] border-b-2 border-[#1e1b18] px-4 flex items-center justify-between shrink-0 shadow-md z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPlaying(false)}
              className="flex items-center gap-2 text-xs font-bold text-[#1e1b18] bg-[#fdd835] border-2 border-[#1e1b18] px-3 py-1 rounded-full hover:bg-[#ffe566] transition-all active:scale-95 shadow-[2px_2px_0px_#1e1b18]"
            >
              <ArrowLeft size={14} />
              <span>Back to Overview</span>
            </button>
            <span className="text-xs font-bold text-[#f25c38] flex items-center gap-2 bg-[#fbe7e1] border border-[#f25c38]/30 px-3 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-[#f25c38] animate-ping" />
              <span>Lost Dune — Playing Live</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={gameUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-bold text-[#1e1b18] bg-[#f5ede0] border-2 border-[#1e1b18] px-3 py-1 rounded-full hover:bg-white transition-all shadow-[2px_2px_0px_#1e1b18]"
            >
              <ExternalLink size={13} />
              <span>Open Fullscreen</span>
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
    <div className="w-full h-full p-2.5 sm:p-4 bg-[#e8decb] text-[#1e1b18] font-sans overflow-hidden select-none flex items-center justify-center">
      {/* Editorial Cream Paper Container (100% Fit, No Scrollbars) */}
      <div className="w-full h-full max-w-xl bg-[#f5ede0] border-2 border-[#23201d] rounded-2xl shadow-[6px_6px_0px_rgba(35,32,29,0.12)] p-4 sm:p-5 flex flex-col justify-between items-center text-center overflow-hidden">
        
        {/* Compact Title Header */}
        <div className="flex flex-col items-center space-y-1.5 shrink-0">
          <div className="w-14 h-14 rounded-xl bg-[#1e1b18] border-2 border-[#23201d] flex items-center justify-center shadow-[3px_3px_0px_#23201d]">
            <AppIcon id="games" size={38} alt="Lost Dune Icon" />
          </div>
          
          <div>
            <h1 className="font-extrabold text-xl sm:text-2xl text-[#1e1b18] leading-tight">Lost Dune</h1>
            <p className="text-[11px] sm:text-xs text-[#5c5449] font-bold flex items-center justify-center gap-1 mt-0.5">
              <GraduationCap size={14} className="text-[#f25c38]" />
              <span>Created & Developed by <strong className="text-[#1e1b18] font-extrabold">Mayuresh Samel</strong></span>
            </p>
          </div>

          <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-[#efe4d3] border-2 border-[#23201d] text-[10px] sm:text-xs font-extrabold text-[#1e1b18] shadow-[2px_2px_0px_#23201d]">
            <ShieldCheck size={12} className="text-[#f25c38]" />
            <span>3rd Year Diploma Project (2024)</span>
          </span>
        </div>

        {/* Compact Narrative Box */}
        <div className="w-full bg-[#fbf7f0] border-2 border-[#23201d] rounded-xl p-3 sm:p-3.5 shadow-[3px_3px_0px_#23201d] text-left space-y-1 shrink-0">
          <div className="flex items-center gap-1.5 text-[#f25c38] font-black text-[11px] uppercase tracking-wide">
            <Sparkles size={14} />
            <span>About the Game</span>
          </div>
          
          <p className="text-xs text-[#1e1b18] leading-normal font-bold">
            <strong className="text-[#f25c38]">Lost Dune</strong> is an original web platformer game created and developed by <strong className="text-[#1e1b18]">Mayuresh Samel</strong> during the 3rd year of his Diploma in Computer Engineering (2024).
          </p>

          <p className="text-[11px] text-[#5c5449] leading-tight">
            Built as a major academic capstone project, the game features custom interactive mechanics, elemental desert environment exploration, and responsive web game engine optimization.
          </p>
        </div>

        {/* Yellow Animated PLAY Button Container */}
        <div className="w-full bg-[#fbf7f0] border-2 border-[#23201d] rounded-xl p-2.5 sm:p-3 shadow-[3px_3px_0px_#23201d] flex flex-col items-center justify-center shrink-0">
          <p className="text-[9px] font-extrabold uppercase tracking-wider text-[#6e675f] mb-1.5">Launch Lost Dune in Browser</p>
          
          <style jsx>{`
            .user-styled-play-btn button {
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 10px;
              padding: 0 12px;
              height: 44px;
              color: white;
              text-shadow: 2px 2px rgb(116, 116, 116);
              text-transform: uppercase;
              cursor: pointer;
              border: solid 2px black;
              letter-spacing: 1px;
              font-weight: 600;
              font-size: 16px;
              background-color: hsl(49deg 98% 60%);
              border-radius: 50px;
              position: relative;
              overflow: hidden;
              transition: all 0.5s ease;
              box-shadow: 0 4px 12px rgba(253, 216, 53, 0.4);
            }

            .user-styled-play-btn button:active {
              transform: scale(0.9);
              transition: all 100ms ease;
            }

            .user-styled-play-btn button svg {
              transition: all 0.5s ease;
              z-index: 2;
            }

            .user-styled-play-btn .play {
              transition: all 0.5s ease;
              transition-delay: 300ms;
            }

            .user-styled-play-btn button:hover svg {
              transform: scale(3) translate(50%);
            }

            .user-styled-play-btn .now {
              position: absolute;
              left: 0;
              transform: translateX(-100%);
              transition: all 0.5s ease;
              z-index: 2;
            }

            .user-styled-play-btn button:hover .now {
              transform: translateX(10px);
              transition-delay: 300ms;
            }

            .user-styled-play-btn button:hover .play {
              transform: translateX(200%);
              transition-delay: 300ms;
            }
          `}</style>

          <div className="user-styled-play-btn select-none">
            <button onClick={() => setIsPlaying(true)} type="button">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36" width="34px" height="34px">
                <rect width={36} height={36} x={0} y={0} fill="#fdd835" />
                <path fill="#e53935" d="M38.67,42H11.52C11.27,40.62,11,38.57,11,36c0-5,0-11,0-11s1.44-7.39,3.22-9.59 c1.67-2.06,2.76-3.48,6.78-4.41c3-0.7,7.13-0.23,9,1c2.15,1.42,3.37,6.67,3.81,11.29c1.49-0.3,5.21,0.2,5.5,1.28 C40.89,30.29,39.48,38.31,38.67,42z" />
                <path fill="#b71c1c" d="M39.02,42H11.99c-0.22-2.67-0.48-7.05-0.49-12.72c0.83,4.18,1.63,9.59,6.98,9.79 c3.48,0.12,8.27,0.55,9.83-2.45c1.57-3,3.72-8.95,3.51-15.62c-0.19-5.84-1.75-8.2-2.13-8.7c0.59,0.66,3.74,4.49,4.01,11.7 c0.03,0.83,0.06,1.72,0.08,2.66c4.21-0.15,5.93,1.5,6.07,2.35C40.68,33.85,39.8,38.9,39.02,42z" />
                <path fill="#212121" d="M35,27.17c0,3.67-0.28,11.2-0.42,14.83h-2C32.72,38.42,33,30.83,33,27.17 c0-5.54-1.46-12.65-3.55-14.02c-1.65-1.08-5.49-1.48-8.23-0.85c-3.62,0.83-4.57,1.99-6.14,3.92L15,16.32 c-1.31,1.6-2.59,6.92-3,8.96v10.8c0,2.58,0.28,4.61,0.54,5.92H10.5c-0.25-1.41-0.5-3.42-0.5-5.92l0.02-11.09 c0.15-0.77,1.55-7.63,3.43-9.94l0.08-0.09c1.65-2.03,2.96-3.63,7.25-4.61c3.28-0.76,7.67-0.25,9.77,1.13 C33.79,13.6,35,22.23,35,27.17z" />
                <path fill="#01579b" d="M17.165,17.283c5.217-0.055,9.391,0.283,9,6.011c-0.391,5.728-8.478,5.533-9.391,5.337 c-0.913-0.196-7.826-0.043-7.696-5.337C9.209,18,13.645,17.32,17.165,17.283z" />
                <path fill="#212121" d="M40.739,37.38c-0.28,1.99-0.69,3.53-1.22,4.62h-2.43c0.25-0.19,1.13-1.11,1.67-4.9 c0.57-4-0.23-11.79-0.93-12.78c-0.4-0.4-2.63-0.8-4.37-0.89l0.1-1.99c1.04,0.05,4.53,0.31,5.71,1.49 C40.689,24.36,41.289,33.53,40.739,37.38z" />
                <path fill="#81d4fa" d="M10.154,20.201c0.261,2.059-0.196,3.351,2.543,3.546s8.076,1.022,9.402-0.554 c1.326-1.576,1.75-4.365-0.891-5.267C19.336,17.287,12.959,16.251,10.154,20.201z" />
                <path fill="#212121" d="M17.615,29.677c-0.502,0-0.873-0.03-1.052-0.069c-0.086-0.019-0.236-0.035-0.434-0.06 c-5.344-0.679-8.053-2.784-8.052-6.255c0.001-2.698,1.17-7.238,8.986-7.32l0.181-0.002c3.444-0.038,6.414-0.068,8.272,1.818 c1.173,1.191,1.712,3,1.647,5.53c-0.044,1.688-0.785,3.147-2.144,4.217C22.785,29.296,19.388,29.677,17.615,29.677z M17.086,17.973 c-7.006,0.074-7.008,4.023-7.008,5.321c-0.001,3.109,3.598,3.926,6.305,4.27c0.273,0.035,0.48,0.063,0.601,0.089 c0.563,0.101,4.68,0.035,6.855-1.732c0.865-0.702,1.299-1.57,1.326-2.653c0.051-1.958-0.301-3.291-1.073-4.075 c-1.262-1.281-3.834-1.255-6.825-1.222L17.086,17.973z" />
                <path fill="#e1f5fe" d="M15.078,19.043c1.957-0.326,5.122-0.529,4.435,1.304c-0.489,1.304-7.185,2.185-7.185,0.652 C12.328,19.467,15.078,19.043,15.078,19.043z" />
              </svg>
              <span className="now">now!</span>
              <span className="play">play</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
