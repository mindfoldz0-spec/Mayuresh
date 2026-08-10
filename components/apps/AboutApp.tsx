'use client';

import React from 'react';
import { MAYURESH_PROFILE } from '../../data/portfolio';
import { useWindowStore } from '../../store/useWindowStore';
import {
  User,
  Mail,
  Github,
  Linkedin,
  Twitter,
  Download,
  Code2,
  Sparkles,
  MapPin,
  ExternalLink,
  CheckCircle2,
  Briefcase,
} from 'lucide-react';

export const AboutApp: React.FC = () => {
  const { openWindow } = useWindowStore();

  return (
    <div className="p-6 md:p-8 space-y-8 select-text">
      {/* Hero Profile Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900/60 via-slate-900 to-cyan-950/60 border border-white/15 p-6 md:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10">
          {/* Avatar Graphic */}
          <div className="relative shrink-0">
            <div className="w-28 h-28 rounded-3xl bg-slate-900 border-2 border-cyan-400/50 p-1 shadow-2xl shadow-cyan-500/30 overflow-hidden flex items-center justify-center">
              <img
                src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/mayuresh.png`}
                alt="Mayuresh"
                className="w-full h-full object-cover rounded-[20px]"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 p-1.5 rounded-xl bg-emerald-500 border-2 border-slate-950 text-slate-950 shadow-md">
              <CheckCircle2 size={16} />
            </div>
          </div>

          {/* Profile Header Details */}
          <div className="flex-1 text-center md:text-left space-y-2">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <h1 className="text-3xl font-bold text-white tracking-tight">
                {MAYURESH_PROFILE.name}
              </h1>
              <span className="px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-xs font-mono">
                Full Stack Engineer
              </span>
            </div>
            <p className="text-slate-300 text-sm md:text-base font-medium">
              {MAYURESH_PROFILE.title}
            </p>
            <p className="text-slate-400 text-xs flex items-center justify-center md:justify-start gap-1">
              <MapPin size={14} className="text-cyan-400" />
              {MAYURESH_PROFILE.location} • Available for contract & full-time roles
            </p>

            {/* Quick Action Buttons */}
            <div className="pt-3 flex flex-wrap items-center justify-center md:justify-start gap-3">
              <button
                onClick={() => openWindow('contact')}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs transition-all flex items-center gap-2 shadow-lg shadow-cyan-500/25"
              >
                <Mail size={16} />
                <span>Contact Mayuresh</span>
              </button>

              <button
                onClick={() => openWindow('projects')}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs border border-white/15 transition-all flex items-center gap-2"
              >
                <Briefcase size={16} />
                <span>View Projects</span>
              </button>

              <a
                href={MAYURESH_PROFILE.resumeUrl}
                download
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-all flex items-center gap-2"
              >
                <Download size={16} />
                <span>Download Resume</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {MAYURESH_PROFILE.stats.map((stat, i) => (
          <div
            key={i}
            className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center justify-center text-center shadow-md"
          >
            <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
              {stat.value}
            </div>
            <div className="text-xs text-slate-400 mt-1 font-medium">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Biography & Philosophy */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Bio Left Column */}
        <div className="md:col-span-2 space-y-4">
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3">
            <h3 className="text-sm font-semibold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
              <Sparkles size={16} />
              About Me
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              {MAYURESH_PROFILE.bio}
            </p>
            <p className="text-slate-300 text-sm leading-relaxed">
              I specialize in combining strong software engineering principles with fluid visual aesthetics. Whether building distributed microservices, WebGL interactive graphics, or real-time web applications, I focus on sub-second responsiveness, accessibility, and high code quality.
            </p>
          </div>
        </div>

        {/* Social Links Right Column */}
        <div className="space-y-4">
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
            <h3 className="text-sm font-semibold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
              <Code2 size={16} />
              Connect & Socials
            </h3>

            <div className="space-y-2">
              <a
                href={MAYURESH_PROFILE.github}
                target="_blank"
                rel="noreferrer"
                className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 flex items-center justify-between text-xs text-slate-200 transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <Github size={16} className="text-cyan-400" />
                  <span>GitHub Profile</span>
                </div>
                <ExternalLink size={14} className="text-slate-500 group-hover:text-cyan-400" />
              </a>

              <a
                href={MAYURESH_PROFILE.linkedin}
                target="_blank"
                rel="noreferrer"
                className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 flex items-center justify-between text-xs text-slate-200 transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <Linkedin size={16} className="text-blue-400" />
                  <span>LinkedIn Network</span>
                </div>
                <ExternalLink size={14} className="text-slate-500 group-hover:text-blue-400" />
              </a>

              <a
                href={MAYURESH_PROFILE.twitter}
                target="_blank"
                rel="noreferrer"
                className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 flex items-center justify-between text-xs text-slate-200 transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <Twitter size={16} className="text-sky-400" />
                  <span>Twitter / X</span>
                </div>
                <ExternalLink size={14} className="text-slate-500 group-hover:text-sky-400" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
