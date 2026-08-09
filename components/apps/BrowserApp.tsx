'use client';

import React, { useState } from 'react';
import { AboutApp } from './AboutApp';
import { ProjectsApp } from './ProjectsApp';
import { ContactApp } from './ContactApp';
import { ArrowLeft, ArrowRight, RotateCcw, Globe, Lock, Plus, X } from 'lucide-react';

export const BrowserApp: React.FC = () => {
  const [url, setUrl] = useState('https://mayuresh.dev/about');
  const [inputUrl, setInputUrl] = useState('https://mayuresh.dev/about');
  const [activeTab, setActiveTab] = useState<'about' | 'projects' | 'contact'>('about');

  const handleNavigate = (newTab: 'about' | 'projects' | 'contact') => {
    setActiveTab(newTab);
    const newUrl = `https://mayuresh.dev/${newTab}`;
    setUrl(newUrl);
    setInputUrl(newUrl);
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputUrl.includes('projects')) handleNavigate('projects');
    else if (inputUrl.includes('contact')) handleNavigate('contact');
    else handleNavigate('about');
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 font-sans select-none">
      {/* Top Browser Tab Bar */}
      <div className="h-10 px-3 bg-slate-900 border-b border-white/10 flex items-center gap-2 shrink-0 overflow-x-auto no-scrollbar">
        <div
          onClick={() => handleNavigate('about')}
          className={`px-3 py-1.5 rounded-t-xl text-xs flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'about'
              ? 'bg-slate-950 text-cyan-300 font-semibold border-t-2 border-cyan-400'
              : 'hover:bg-white/5 text-slate-400'
          }`}
        >
          <Globe size={14} />
          <span>Mayuresh - Profile</span>
        </div>

        <div
          onClick={() => handleNavigate('projects')}
          className={`px-3 py-1.5 rounded-t-xl text-xs flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'projects'
              ? 'bg-slate-950 text-cyan-300 font-semibold border-t-2 border-cyan-400'
              : 'hover:bg-white/5 text-slate-400'
          }`}
        >
          <Globe size={14} />
          <span>Projects</span>
        </div>

        <div
          onClick={() => handleNavigate('contact')}
          className={`px-3 py-1.5 rounded-t-xl text-xs flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'contact'
              ? 'bg-slate-950 text-cyan-300 font-semibold border-t-2 border-cyan-400'
              : 'hover:bg-white/5 text-slate-400'
          }`}
        >
          <Globe size={14} />
          <span>Contact</span>
        </div>
      </div>

      {/* Address Bar Toolbar */}
      <div className="h-11 px-3 bg-slate-900/80 border-b border-white/10 flex items-center gap-3 shrink-0">
        <div className="flex items-center gap-1">
          <button className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400">
            <ArrowLeft size={15} />
          </button>
          <button className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400">
            <ArrowRight size={15} />
          </button>
          <button className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400">
            <RotateCcw size={15} />
          </button>
        </div>

        {/* URL Input Form */}
        <form onSubmit={handleAddressSubmit} className="flex-1">
          <div className="flex items-center w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-white/15 focus-within:border-cyan-400 text-xs">
            <Lock size={13} className="text-emerald-400 mr-2 shrink-0" />
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              className="w-full bg-transparent text-white focus:outline-none font-mono text-xs"
            />
          </div>
        </form>
      </div>

      {/* Browser Viewport Frame */}
      <div className="flex-1 overflow-y-auto bg-slate-950 custom-scrollbar select-text">
        {activeTab === 'about' && <AboutApp />}
        {activeTab === 'projects' && <ProjectsApp />}
        {activeTab === 'contact' && <ContactApp />}
      </div>
    </div>
  );
};
