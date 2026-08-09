'use client';

import React, { useState } from 'react';
import { SKILL_CATEGORIES } from '../../data/portfolio';
import { Code, Layout, Server, Database, Wrench, Sparkles, CheckCircle2 } from 'lucide-react';

export const SkillsApp: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categoryIcons: Record<string, React.ElementType> = {
    'Frontend Development': Layout,
    'Backend Development': Server,
    'Databases & Caching': Database,
    'Cloud, DevOps & Tools': Wrench,
  };

  const filteredCategories = SKILL_CATEGORIES.filter(
    (c) => selectedCategory === 'All' || c.category === selectedCategory
  );

  return (
    <div className="p-6 space-y-6 select-text">
      {/* Header */}
      <div className="border-b border-white/10 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Code className="text-cyan-400" size={22} />
            Technical Skills & Engineering Stack
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Core stack competencies, proficiency ratings, and production experience.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              selectedCategory === 'All'
                ? 'bg-cyan-500 text-slate-950 font-bold'
                : 'bg-white/5 text-slate-300 border border-white/10'
            }`}
          >
            All Skills
          </button>
          {SKILL_CATEGORIES.map((cat) => (
            <button
              key={cat.category}
              onClick={() => setSelectedCategory(cat.category)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
                selectedCategory === cat.category
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'bg-white/5 text-slate-300 border border-white/10'
              }`}
            >
              {cat.category}
            </button>
          ))}
        </div>
      </div>

      {/* Skills Category Section */}
      <div className="space-y-8">
        {filteredCategories.map((group) => {
          const Icon = categoryIcons[group.category] || Code;

          return (
            <div key={group.category} className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  <Icon size={18} />
                </div>
                <h3 className="text-base font-bold text-white tracking-wide">
                  {group.category}
                </h3>
              </div>

              {/* Grid of Skill Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {group.skills.map((skill) => (
                  <div
                    key={skill.name}
                    className="p-4 rounded-2xl bg-slate-900/60 border border-white/10 hover:border-cyan-400/40 transition-all space-y-2.5 shadow-md"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-1.5">
                          <CheckCircle2 size={14} className="text-cyan-400" />
                          {skill.name}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1">{skill.description}</p>
                      </div>
                      <span className="px-2 py-0.5 rounded-md bg-white/10 text-[10px] font-mono text-cyan-300 shrink-0">
                        {skill.experience}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                        <span>Proficiency</span>
                        <span className="text-cyan-400 font-bold">{skill.level}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
