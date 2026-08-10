'use client';

import React from 'react';
import { useSettingsStore } from '../../store/useSettingsStore';

export const Wallpaper: React.FC = () => {
  const { wallpaperValue } = useSettingsStore();

  const match = wallpaperValue.match(/url\(['"]?([^'"]+)['"]?\)/);
  const rawImageUrl = match ? match[1] : null;
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  const imageUrl = rawImageUrl ? `${basePath}${rawImageUrl}` : null;

  return (
    <div className="absolute inset-0 w-full h-full z-0 overflow-hidden select-none">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt="Desktop Wallpaper"
          className="w-full h-full object-cover object-center transition-opacity duration-700"
        />
      ) : (
        <div
          className="w-full h-full transition-all duration-700 bg-cover bg-center"
          style={{ background: wallpaperValue }}
        />
      )}

      {/* Soft Ambient Overlay */}
      <div
        className={`absolute inset-0 pointer-events-none ${
          imageUrl
            ? 'bg-black/10'
            : 'bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-sky-500/10 via-transparent to-black/40'
        }`}
      />
    </div>
  );
};
