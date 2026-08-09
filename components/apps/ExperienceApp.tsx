'use client';

import React from 'react';
import { EXPERIENCES } from '../../data/portfolio';
import { Award, Briefcase, GraduationCap, Calendar, MapPin, CheckCircle } from 'lucide-react';

export const ExperienceApp: React.FC = () => {
  return (
    <div className="p-6 space-y-6 select-text">
      {/* Header */}
      <div className="border-b border-white/10 pb-6">
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <Award className="text-cyan-400" size={22} />
          Work Experience & Academic Timeline
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Career milestones, engineering leadership roles, and technical achievements.
        </p>
      </div>

      {/* Timeline List */}
      <div className="relative border-l-2 border-slate-800 ml-4 space-y-8 py-2">
        {EXPERIENCES.map((item) => (
          <div key={item.id} className="relative pl-6 group">
            {/* Timeline Dot */}
            <div className="absolute -left-[17px] top-1.5 w-8 h-8 rounded-xl bg-slate-900 border border-cyan-400/50 flex items-center justify-center text-cyan-300 shadow-md group-hover:scale-110 transition-transform">
              {item.type === 'work' ? <Briefcase size={16} /> : <GraduationCap size={16} />}
            </div>

            {/* Content Card */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 hover:border-cyan-400/40 transition-all space-y-3 shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                <div>
                  <h3 className="text-base font-bold text-white tracking-wide">{item.role}</h3>
                  <div className="text-xs text-cyan-400 font-medium mt-0.5">{item.company}</div>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400 font-mono">
                  <span className="flex items-center gap-1">
                    <Calendar size={13} />
                    {item.period}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin size={13} />
                    {item.location}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{item.description}</p>

              {/* Achievements */}
              <div className="space-y-1.5 pt-1">
                <h4 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Key Impact & Achievements
                </h4>
                {item.achievements.map((achievement, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-slate-200">
                    <CheckCircle size={14} className="text-cyan-400 shrink-0 mt-0.5" />
                    <span>{achievement}</span>
                  </div>
                ))}
              </div>

              {/* Skills Badges */}
              <div className="flex flex-wrap gap-1.5 pt-2">
                {item.skillsUsed.map((skill) => (
                  <span
                    key={skill}
                    className="px-2 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-400/20 text-[10px] text-cyan-300 font-mono"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
