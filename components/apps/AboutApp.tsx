'use client';

import React, { useState } from 'react';
import { MAYURESH_PROFILE } from '../../data/portfolio';
import { useWindowStore } from '../../store/useWindowStore';
import {
  User,
  Mail,
  Github,
  Linkedin,
  MapPin,
  ExternalLink,
  MousePointer,
  PaintBucket,
  Type,
  Search,
  Maximize2,
  Minimize2,
  X,
  Pencil,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Briefcase,
  Layers,
  Sparkles,
} from 'lucide-react';

export const AboutApp: React.FC = () => {
  const { openWindow } = useWindowStore();
  const [activeEducationIndex, setActiveEducationIndex] = useState(0);

  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

  const educationList = [
    {
      title: 'Diploma in Computer Engineering (2024)',
      institution: '3rd Year Capstone Milestone',
      desc: 'Engineered Lost Dune web game engine, custom AABB physics, and interactive web architectures.',
    },
    {
      title: 'Bachelor of Computer Engineering',
      institution: 'Software Engineering Major',
      desc: 'Specializing in full stack web development, cloud deployments, and UI design systems.',
    },
  ];

  return (
    <div className="w-full min-h-full p-3 sm:p-5 bg-[#a8dacb] text-[#1e1b18] font-sans select-text overflow-y-auto custom-scrollbar flex flex-col items-center justify-start">
      {/* Retro Desktop Window Container (Exact Reference UI Design) */}
      <div className="w-full max-w-4xl bg-[#f5ede0] border-2 border-[#23201d] rounded-2xl shadow-[8px_8px_0px_rgba(35,32,29,0.15)] overflow-hidden flex flex-col my-2">
        
        {/* Retro Header Bar: CURRICULUM VITAE */}
        <div className="h-11 bg-[#b8e2d4] border-b-2 border-[#23201d] px-4 flex items-center justify-between shrink-0 font-mono">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#f25c38] border border-[#23201d]" />
            <div className="w-3 h-3 rounded-full bg-[#fdd835] border border-[#23201d]" />
            <div className="w-3 h-3 rounded-full bg-[#22c55e] border border-[#23201d]" />
          </div>

          <span className="font-black text-xs md:text-sm tracking-widest text-[#1e1b18] uppercase">
            CURRICULUM VITAE
          </span>

          <div className="flex items-center gap-2 text-xs font-bold text-[#1e1b18]">
            <span>_</span>
            <span>🗖</span>
            <span>✕</span>
          </div>
        </div>

        {/* Inner Main CV Dashboard */}
        <div className="p-4 sm:p-6 space-y-5 text-left">
          
          {/* Top Profile Card (Sage Green Theme - #a3d9c9) */}
          <div className="relative bg-[#a3d9c9] border-2 border-[#23201d] rounded-2xl p-4 sm:p-6 shadow-[4px_4px_0px_#23201d] flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden">
            
            {/* Floating Left Graphic Tool Palette */}
            <div className="hidden lg:flex flex-col gap-2 p-2 bg-[#f5ede0] border-2 border-[#23201d] rounded-xl shadow-[3px_3px_0px_#23201d] absolute left-3 top-1/2 -translate-y-1/2 z-20">
              <button className="p-1 rounded hover:bg-[#a3d9c9] border border-transparent hover:border-[#23201d]" title="Pointer"><MousePointer size={14} /></button>
              <button className="p-1 rounded hover:bg-[#a3d9c9] border border-transparent hover:border-[#23201d]" title="Bucket"><PaintBucket size={14} /></button>
              <button className="p-1 rounded hover:bg-[#a3d9c9] border border-transparent hover:border-[#23201d]" title="Text"><Type size={14} /></button>
              <button className="p-1 rounded hover:bg-[#a3d9c9] border border-transparent hover:border-[#23201d]" title="Search"><Search size={14} /></button>
              <button className="p-1 rounded hover:bg-[#a3d9c9] border border-transparent hover:border-[#23201d]" title="Layers"><Layers size={14} /></button>
            </div>

            {/* Profile Info Details */}
            <div className="space-y-2 lg:pl-14 flex-1">
              <h1 className="text-2xl sm:text-4xl font-black text-[#1e1b18] tracking-tight uppercase">
                {MAYURESH_PROFILE.name}
              </h1>
              <p className="text-xs sm:text-sm font-extrabold text-[#23201d] uppercase tracking-wide">
                {MAYURESH_PROFILE.title}
              </p>

              <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs font-semibold text-[#3a352e]">
                <div className="flex items-center gap-1.5">
                  <MapPin size={14} className="text-[#f25c38]" />
                  <span>{MAYURESH_PROFILE.location}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Mail size={14} className="text-[#f25c38]" />
                  <a href={`mailto:${MAYURESH_PROFILE.email}`} className="hover:underline">{MAYURESH_PROFILE.email}</a>
                </div>
                <div className="flex items-center gap-1.5">
                  <Github size={14} className="text-[#1e1b18]" />
                  <a href={MAYURESH_PROFILE.github} target="_blank" rel="noreferrer" className="hover:underline">github.com/mindfoldz0-spec</a>
                </div>
                <div className="flex items-center gap-1.5">
                  <Linkedin size={14} className="text-[#0284c7]" />
                  <a href={MAYURESH_PROFILE.linkedin} target="_blank" rel="noreferrer" className="hover:underline">linkedin/mayuresh-samel</a>
                </div>
              </div>
            </div>

            {/* Circular Portrait Badge Frame */}
            <div className="relative shrink-0">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-[#23201d] bg-[#f5ede0] shadow-[4px_4px_0px_#23201d] overflow-hidden flex items-center justify-center">
                <img
                  src={`${basePath}/mayuresh.png`}
                  alt="Mayuresh Samel"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="absolute -top-1 -right-1 p-1 rounded-full bg-[#f25c38] border-2 border-[#23201d] text-white" title="Verified Creator">
                <Sparkles size={14} />
              </span>
            </div>
          </div>

          {/* Lower Grid Layout: Skills + Education (Left 6 cols) & Experience + Reference (Right 6 cols) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
            
            {/* Left Column: Skills Card & Education Card */}
            <div className="md:col-span-6 space-y-5">
              
              {/* Skills Rating Card (#fbf7f0 Cream) */}
              <div className="bg-[#fbf7f0] border-2 border-[#23201d] rounded-2xl p-4 sm:p-5 shadow-[4px_4px_0px_#23201d] space-y-3">
                <div className="flex items-center justify-between border-b-2 border-[#23201d]/10 pb-2">
                  <h3 className="font-extrabold text-xs text-[#1e1b18] uppercase tracking-wider">
                    TECHNICAL SKILLS
                  </h3>
                  <Pencil size={14} className="text-[#6e675f]" />
                </div>

                <div className="space-y-2.5 text-xs font-bold">
                  <div className="flex justify-between items-center">
                    <span className="text-[#3a352e]">Full Stack Web Architecture</span>
                    <span className="text-[#15803d] font-mono tracking-widest">•••••</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#3a352e]">React & Next.js Framework</span>
                    <span className="text-[#15803d] font-mono tracking-widest">•••••</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#3a352e]">Web Game Engine Development</span>
                    <span className="text-[#15803d] font-mono tracking-widest">•••••</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#3a352e]">TypeScript & Node.js Backend</span>
                    <span className="text-[#15803d] font-mono tracking-widest">•••••</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#3a352e]">Glassmorphism & Windows UI</span>
                    <span className="text-[#15803d] font-mono tracking-widest">•••••</span>
                  </div>
                </div>
              </div>

              {/* Education Carousel Card (#b8e2d4 Sage Green) */}
              <div className="bg-[#b8e2d4] border-2 border-[#23201d] rounded-2xl p-4 shadow-[4px_4px_0px_#23201d] space-y-3">
                <div className="flex items-center justify-between border-b-2 border-[#23201d] pb-2">
                  <button
                    onClick={() => setActiveEducationIndex((prev) => (prev > 0 ? prev - 1 : educationList.length - 1))}
                    className="p-1 rounded hover:bg-[#a8dacb] border border-[#23201d]"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  
                  <span className="font-extrabold text-xs text-[#1e1b18] uppercase tracking-wider flex items-center gap-1.5">
                    <GraduationCap size={16} />
                    <span>EDUCATION & DIPLOMA</span>
                  </span>

                  <button
                    onClick={() => setActiveEducationIndex((prev) => (prev < educationList.length - 1 ? prev + 1 : 0))}
                    className="p-1 rounded hover:bg-[#a8dacb] border border-[#23201d]"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>

                <div className="text-left space-y-1">
                  <h4 className="font-black text-xs text-[#1e1b18]">
                    {educationList[activeEducationIndex].title}
                  </h4>
                  <p className="text-[11px] font-bold text-[#226d56]">
                    {educationList[activeEducationIndex].institution}
                  </p>
                  <p className="text-[11px] text-[#3a352e] pt-1 leading-relaxed">
                    {educationList[activeEducationIndex].desc}
                  </p>
                </div>
              </div>

            </div>

            {/* Right Column: Experiences Card & References */}
            <div className="md:col-span-6 space-y-5">
              
              {/* Experiences Window Card (#f0d697 Warm Sand) */}
              <div className="bg-[#f0d697] border-2 border-[#23201d] rounded-2xl p-4 sm:p-5 shadow-[4px_4px_0px_#23201d] space-y-4">
                <div className="flex items-center justify-between border-b-2 border-[#23201d] pb-2 font-mono">
                  <span className="font-black text-xs text-[#1e1b18] uppercase tracking-wider flex items-center gap-1.5">
                    <Briefcase size={15} />
                    <span>EXPERIENCES</span>
                  </span>
                  <div className="flex gap-1 text-[10px] font-bold text-[#1e1b18]">
                    <span>_</span>
                    <span>🗖</span>
                    <span>✕</span>
                  </div>
                </div>

                {/* Experience Item 1 */}
                <div className="space-y-1 text-left border-b border-[#23201d]/20 pb-3">
                  <h4 className="font-extrabold text-xs text-[#1e1b18]">Senior Full Stack Software Engineer</h4>
                  <p className="text-[11px] font-mono font-bold text-[#855305]">
                    Mayuresh Digital Studio | 2023 - Present
                  </p>
                  <ul className="text-[11px] text-[#3a352e] pt-1 space-y-1 list-disc list-inside leading-normal">
                    <li>Engineering high-performance Next.js 14 applications, AI voice models, and desktop simulators.</li>
                    <li>Designing responsive glassmorphic UI systems and REST/GraphQL API proxies.</li>
                  </ul>
                </div>

                {/* Experience Item 2 */}
                <div className="space-y-1 text-left">
                  <h4 className="font-extrabold text-xs text-[#1e1b18]">Web Game Engine & UI Developer</h4>
                  <p className="text-[11px] font-mono font-bold text-[#855305]">
                    3rd Year Diploma Milestone | 2022 - 2023
                  </p>
                  <ul className="text-[11px] text-[#3a352e] pt-1 space-y-1 list-disc list-inside leading-normal">
                    <li>Developed Lost Dune 2D HTML5 canvas engine with custom AABB physics and touch controls.</li>
                    <li>Crafted Windows 11 desktop environment simulator portfolio.</li>
                  </ul>
                </div>
              </div>

              {/* Reference & Contact Card (#fbf7f0 Cream) */}
              <div className="bg-[#fbf7f0] border-2 border-[#23201d] rounded-2xl p-4 shadow-[4px_4px_0px_#23201d] space-y-2 text-left">
                <h4 className="font-extrabold text-xs text-[#1e1b18] uppercase tracking-wider">
                  REFERENCE & AVAILABILITY
                </h4>
                <p className="text-xs font-bold text-[#1e1b18]">
                  Mayuresh Samel — Full Stack Software Engineer
                </p>
                <p className="text-[11px] text-[#5c5449]">
                  Available for Full-Time Roles, Technical Lead Consultations, and High-Impact Software Engineering.
                </p>
                <div className="pt-2 flex gap-2">
                  <button
                    onClick={() => openWindow('contact')}
                    className="px-3 py-1.5 rounded-xl bg-[#f25c38] text-white font-extrabold text-xs border-2 border-[#23201d] shadow-[2px_2px_0px_#23201d] hover:bg-[#d94827] transition-all active:scale-95 flex items-center gap-1.5"
                  >
                    <Mail size={14} />
                    <span>Contact Mayuresh</span>
                  </button>

                  <button
                    onClick={() => openWindow('projects')}
                    className="px-3 py-1.5 rounded-xl bg-[#f5ede0] text-[#1e1b18] font-extrabold text-xs border-2 border-[#23201d] shadow-[2px_2px_0px_#23201d] hover:bg-white transition-all active:scale-95 flex items-center gap-1.5"
                  >
                    <Briefcase size={14} />
                    <span>View Projects</span>
                  </button>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
