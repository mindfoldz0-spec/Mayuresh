'use client';

import React, { useState } from 'react';
import * as LucideIcons from 'lucide-react';
import { AppId } from '../../types';

export const REAL_ICONS_MAP: Record<string, string> = {
  // App ID → icon file
  explorer:     '/icons/explorer.png',
  notepad:      '/icons/notepad.png',
  calculator:   '/icons/calendar.png',
  settings:     '/icons/settings.png',
  terminal:     '/icons/terminal.png',
  about:        '/icons/about.png',
  windows:      '/icons/windows.png',
  'windows-11': '/icons/windows.png',
  browser:      '/icons/browser.png',
  photos:       '/icons/photos.png',
  'recycle-bin':'/icons/explorer.png',
  projects:     '/icons/vscode.png',
  skills:       '/icons/chatgpt.png',
  experience:   '/icons/github.png',
  contact:      '/icons/gmail.png',
  games:        '/icons/games.png',
  linkedin:     '/icons/linkedin.png',

  // Lucide icon name fallbacks
  Folder:    '/icons/explorer.png',
  FileText:  '/icons/notepad.png',
  Calculator:'/icons/calendar.png',
  Settings:  '/icons/settings.png',
  Terminal:  '/icons/terminal.png',
  User:      '/icons/about.png',
  Briefcase: '/icons/vscode.png',
  Code:      '/icons/chatgpt.png',
  Award:     '/icons/github.png',
  Mail:      '/icons/gmail.png',
  Globe:     '/icons/browser.png',
  Image:     '/icons/photos.png',
  Trash2:    '/icons/explorer.png',
  Gamepad:   '/icons/games.png',
  Linkedin:  '/icons/linkedin.png',
};

interface AppIconProps {
  id?: AppId | string;
  iconName?: string;
  size?: number;
  className?: string;
  alt?: string;
}

export const AppIcon: React.FC<AppIconProps> = ({
  id,
  iconName,
  size = 24,
  className = '',
  alt = 'Icon',
}) => {
  const imageSrc =
    (id && REAL_ICONS_MAP[id]) ||
    (iconName && REAL_ICONS_MAP[iconName]);

  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  const fullSrc = imageSrc ? `${basePath}${imageSrc}` : '';

  if (imageSrc && !imageError) {
    return (
      <img
        src={fullSrc}
        alt={alt}
        width={size}
        height={size}
        onError={() => setImageError(true)}
        className={`object-contain select-none shrink-0 ${className}`}
        style={{ width: `${size}px`, height: `${size}px` }}
      />
    );
  }

  // Fallback to Lucide icon
  const key = iconName || 'AppWindow';
  const LucideComp =
    (LucideIcons as unknown as Record<string, React.ElementType>)[key] ||
    LucideIcons.AppWindow;

  return <LucideComp size={size} className={`shrink-0 ${className}`} />;
};
