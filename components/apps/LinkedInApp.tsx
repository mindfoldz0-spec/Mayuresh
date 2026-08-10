'use client';

import React, { useEffect } from 'react';
import { Linkedin, ExternalLink, UserCheck, Briefcase, Award, ArrowUpRight } from 'lucide-react';
import { AppIcon } from '../common/AppIcon';

export const LinkedInApp: React.FC = () => {
  const linkedinUrl = 'https://www.linkedin.com/in/mayuresh-samel-aa1a412ba';

  const handleOpenLinkedIn = () => {
    window.open(linkedinUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="p-6 md:p-8 h-full flex flex-col items-center justify-center text-center select-text font-sans bg-slate-950 text-white">
      {/* LinkedIn Logo */}
      <div className="w-24 h-24 rounded-3xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center mb-6 shadow-2xl shadow-blue-500/20 hover:scale-105 transition-transform">
        <AppIcon id="linkedin" size={64} alt="LinkedIn Icon" />
      </div>

      {/* Name & Title */}
      <h1 className="text-3xl font-extrabold text-white tracking-tight mb-1 flex items-center gap-2 justify-center">
        Mayuresh Samel
      </h1>
      <p className="text-sm text-blue-400 font-medium mb-6 flex items-center gap-1.5 justify-center">
        <Linkedin size={16} className="text-blue-500" />
        Official LinkedIn Profile
      </p>

      {/* Profile Overview Card */}
      <div className="w-full max-w-md bg-slate-900/90 border border-blue-500/20 rounded-2xl p-6 mb-6 shadow-2xl backdrop-blur-xl text-left space-y-4">
        <div className="flex items-center gap-3 border-b border-white/10 pb-3">
          <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-400/40 text-blue-400 font-bold">
            MS
          </div>
          <div>
            <div className="text-sm font-bold text-white">Mayuresh Samel</div>
            <div className="text-xs text-slate-400">Software Engineer & Computer Engineering Developer</div>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Connect with Mayuresh Samel on LinkedIn to explore professional experience, engineering projects, skills, and industry collaborations.
        </p>

        <div className="flex flex-wrap gap-2 pt-1">
          <span className="px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-300 text-[11px] font-semibold flex items-center gap-1">
            <Briefcase size={12} /> Full Stack & Systems
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[11px] font-semibold flex items-center gap-1">
            <Award size={12} /> Diploma Engineering
          </span>
        </div>
      </div>

      {/* Action Redirect Button */}
      <button
        onClick={handleOpenLinkedIn}
        className="flex items-center justify-center gap-2.5 py-3.5 px-8 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold text-sm shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
      >
        <ExternalLink size={18} />
        <span>Open LinkedIn Profile</span>
        <ArrowUpRight size={16} />
      </button>
    </div>
  );
};
