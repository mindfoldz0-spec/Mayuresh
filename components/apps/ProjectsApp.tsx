'use client';

import React, { useState } from 'react';
import { PROJECTS } from '../../data/portfolio';
import { Project } from '../../types';
import { Search, ExternalLink, Github, Sparkles, Filter, Layers, CheckCircle } from 'lucide-react';

export const ProjectsApp: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  const categories = ['All', 'Full Stack', 'Frontend', 'Backend', 'AI / Machine Learning'];

  const filteredProjects = PROJECTS.filter((p) => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.techStack.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="p-6 space-y-6 select-text">
      {/* Header & Search / Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Layers className="text-cyan-400" size={22} />
            Featured Engineering Projects
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Explore web applications, AI visualization systems, and high-scale cloud platforms.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tech stack or project..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 focus:border-cyan-400 text-xs text-white placeholder-slate-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        <Filter size={14} className="text-slate-400 shrink-0 mr-1" />
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all shrink-0 ${
              selectedCategory === cat
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20 font-semibold'
                : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            onClick={() => setActiveProject(project)}
            className="group relative rounded-2xl bg-slate-900/60 border border-white/10 hover:border-cyan-400/50 p-5 transition-all hover:shadow-2xl hover:shadow-cyan-500/10 cursor-pointer flex flex-col justify-between"
          >
            <div>
              {/* Image Preview Banner */}
              <div className="relative h-44 w-full rounded-xl overflow-hidden mb-4 bg-slate-950 border border-white/10">
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md border border-white/10 text-[10px] font-mono text-cyan-300">
                  {project.category}
                </div>
              </div>

              {/* Title & Description */}
              <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                {project.title}
              </h3>
              <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                {project.shortDescription}
              </p>

              {/* Tech Stack Badges */}
              <div className="flex flex-wrap gap-1.5 mt-3">
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] text-slate-300 font-mono"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
              <span className="text-[11px] text-cyan-400 font-medium group-hover:underline flex items-center gap-1">
                <Sparkles size={12} />
                Click for details
              </span>

              <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                    title="GitHub Code"
                  >
                    <Github size={14} />
                  </a>
                )}
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 transition-colors"
                    title="Live Preview"
                  >
                    <ExternalLink size={14} />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Project Details Modal */}
      {activeProject && (
        <div
          onClick={() => setActiveProject(null)}
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl bg-slate-900 border border-white/20 rounded-3xl p-6 shadow-2xl text-white space-y-4 max-h-[85vh] overflow-y-auto custom-scrollbar"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider">
                  {activeProject.category}
                </span>
                <h2 className="text-2xl font-bold text-white mt-0.5">{activeProject.title}</h2>
              </div>
              <button
                onClick={() => setActiveProject(null)}
                className="px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-xs"
              >
                Close
              </button>
            </div>

            <img
              src={activeProject.imageUrl}
              alt={activeProject.title}
              className="w-full h-52 object-cover rounded-2xl border border-white/10"
            />

            <p className="text-xs text-slate-300 leading-relaxed">{activeProject.fullDescription}</p>

            {/* Key Technical Highlights */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                Key Technical Highlights
              </h4>
              <div className="space-y-1.5">
                {activeProject.highlights.map((h, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-slate-200">
                    <CheckCircle size={14} className="text-cyan-400 shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Links */}
            <div className="pt-4 border-t border-white/10 flex items-center gap-3">
              {activeProject.liveUrl && (
                <a
                  href={activeProject.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-semibold text-xs flex items-center gap-2"
                >
                  <ExternalLink size={14} />
                  <span>Open Live Demo</span>
                </a>
              )}
              {activeProject.githubUrl && (
                <a
                  href={activeProject.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl bg-white/10 text-white font-medium text-xs flex items-center gap-2 border border-white/15"
                >
                  <Github size={14} />
                  <span>View Repository</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
