'use client';

import React from 'react';
import { useSettingsStore } from '../../store/useSettingsStore';

export const Wallpaper: React.FC = () => {
  const { wallpaperValue } = useSettingsStore();

  return (
    <div
      className="absolute inset-0 w-full h-full -z-10 transition-all duration-700 bg-cover bg-center overflow-hidden"
      style={{
        background: wallpaperValue,
      }}
    >
      {/* Soft Ambient Mesh Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-sky-500/10 via-transparent to-black/40 pointer-events-none" />
    </div>
  );
};
