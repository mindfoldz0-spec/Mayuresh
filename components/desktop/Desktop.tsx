'use client';

import React, { useState } from 'react';
import { Wallpaper } from './Wallpaper';
import { DesktopIcon } from './DesktopIcon';
import { ContextMenu } from './ContextMenu';
import { APPS_CONFIG } from '../../data/apps';
import { AppId } from '../../types';
import { useSystemStore } from '../../store/useSystemStore';
import { WindowManager } from '../window/WindowManager';

export const Desktop: React.FC = () => {
  const [selectedIcon, setSelectedIcon] = useState<AppId | null>(null);
  const [contextMenuPos, setContextMenuPos] = useState<{ x: number; y: number } | null>(null);
  const { toggleStartMenu, toggleSearch, toggleCalendar, toggleControlCenter } = useSystemStore();

  const desktopApps = APPS_CONFIG.filter((app) => app.isDesktopShortcut);

  const handleDesktopClick = () => {
    setSelectedIcon(null);
    setContextMenuPos(null);
    toggleStartMenu(false);
    toggleSearch(false);
    toggleCalendar(false);
    toggleControlCenter(false);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    // Constrain position within window bounds
    const x = Math.min(e.clientX, window.innerWidth - 230);
    const y = Math.min(e.clientY, window.innerHeight - 300);
    setContextMenuPos({ x, y });
  };

  return (
    <div
      onClick={handleDesktopClick}
      onContextMenu={handleContextMenu}
      className="relative w-screen h-screen overflow-hidden select-none"
    >
      {/* Background Wallpaper */}
      <Wallpaper />

      {/* Grid of Desktop Shortcuts */}
      <div className="absolute top-2 left-1 flex flex-col flex-wrap max-h-[calc(100vh-70px)] gap-1 z-10 p-1">
        {desktopApps.map((app) => (
          <DesktopIcon
            key={app.id}
            id={app.id}
            title={app.title}
            iconName={app.iconName}
            isSelected={selectedIcon === app.id}
            onSelect={(id) => setSelectedIcon(id)}
          />
        ))}
      </div>

      {/* Render All Open Windows */}
      <WindowManager />

      {/* Desktop Context Menu */}
      {contextMenuPos && (
        <ContextMenu
          x={contextMenuPos.x}
          y={contextMenuPos.y}
          onClose={() => setContextMenuPos(null)}
        />
      )}
    </div>
  );
};
