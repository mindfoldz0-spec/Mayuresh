'use client';

import React, { useState } from 'react';
import { PHOTOS } from '../../data/portfolio';
import { PhotoItem } from '../../types';
import { Image as ImageIcon, Filter, Maximize2, X, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

export const PhotosApp: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [lightboxPhoto, setLightboxPhoto] = useState<PhotoItem | null>(null);

  const categories = ['All', 'Projects', 'Setup & Coding', 'Certificates'];

  const filteredPhotos = PHOTOS.filter(
    (p) => selectedCategory === 'All' || p.category === selectedCategory
  );

  return (
    <div className="p-6 space-y-6 select-none font-sans text-white">
      {/* Header */}
      <div className="border-b border-white/10 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <ImageIcon className="text-cyan-400" size={22} />
            Photos & Project Media Gallery
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Screenshots, workstation setups, certifications, and high-resolution visuals.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <Filter size={14} className="text-slate-400 shrink-0 mr-1" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all shrink-0 ${
                selectedCategory === cat
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Photos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredPhotos.map((photo) => (
          <div
            key={photo.id}
            onClick={() => setLightboxPhoto(photo)}
            className="group relative rounded-2xl overflow-hidden bg-slate-900 border border-white/10 hover:border-cyan-400/50 cursor-pointer shadow-lg transition-all"
          >
            <div className="h-48 w-full overflow-hidden">
              <img
                src={photo.url}
                alt={photo.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
              <span className="text-[10px] font-mono text-cyan-300 uppercase tracking-wider">
                {photo.category}
              </span>
              <h3 className="text-xs font-bold text-white leading-tight">{photo.title}</h3>
              <p className="text-[11px] text-slate-300 mt-1 line-clamp-1">{photo.caption}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {lightboxPhoto && (
        <div
          onClick={() => setLightboxPhoto(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-6"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl bg-slate-900 border border-white/20 rounded-3xl p-4 shadow-2xl space-y-4"
          >
            <div className="flex justify-between items-center px-2">
              <div>
                <h3 className="text-base font-bold text-white">{lightboxPhoto.title}</h3>
                <p className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                  <Calendar size={12} /> {lightboxPhoto.date} • {lightboxPhoto.category}
                </p>
              </div>
              <button
                onClick={() => setLightboxPhoto(null)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="relative h-[60vh] w-full rounded-2xl overflow-hidden bg-black border border-white/10 flex items-center justify-center">
              <img
                src={lightboxPhoto.url}
                alt={lightboxPhoto.title}
                className="max-w-full max-h-full object-contain"
              />
            </div>

            <p className="text-xs text-slate-300 px-2 italic text-center">
              &ldquo;{lightboxPhoto.caption}&rdquo;
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
