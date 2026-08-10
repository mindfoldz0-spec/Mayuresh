'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Window } from './Window';
import { useWindowStore } from '../../store/useWindowStore';
import { AppId } from '../../types';

// App Loader Spinner Fallback
const AppLoadingFallback = () => (
  <div className="w-full h-full flex items-center justify-center bg-slate-950 text-cyan-400">
    <div className="flex flex-col items-center gap-3">
      <div className="w-8 h-8 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
      <span className="text-xs font-mono text-slate-400">Loading Application...</span>
    </div>
  </div>
);

// Dynamic Code-Splitting with client-only execution (ssr: false) for ultra fast boot & crash-free rendering
const AboutApp = dynamic(() => import('../apps/AboutApp').then((mod) => mod.AboutApp), {
  loading: () => <AppLoadingFallback />,
  ssr: false,
});
const ProjectsApp = dynamic(() => import('../apps/ProjectsApp').then((mod) => mod.ProjectsApp), {
  loading: () => <AppLoadingFallback />,
  ssr: false,
});
const SkillsApp = dynamic(() => import('../apps/SkillsApp').then((mod) => mod.SkillsApp), {
  loading: () => <AppLoadingFallback />,
  ssr: false,
});
const ExperienceApp = dynamic(() => import('../apps/ExperienceApp').then((mod) => mod.ExperienceApp), {
  loading: () => <AppLoadingFallback />,
  ssr: false,
});
const ContactApp = dynamic(() => import('../apps/ContactApp').then((mod) => mod.ContactApp), {
  loading: () => <AppLoadingFallback />,
  ssr: false,
});
const FileExplorerApp = dynamic(
  () => import('../apps/FileExplorerApp').then((mod) => mod.FileExplorerApp),
  { loading: () => <AppLoadingFallback />, ssr: false }
);
const NotepadApp = dynamic(() => import('../apps/NotepadApp').then((mod) => mod.NotepadApp), {
  loading: () => <AppLoadingFallback />,
  ssr: false,
});
const CalendarApp = dynamic(() => import('../apps/CalendarApp').then((mod) => mod.CalendarApp), {
  loading: () => <AppLoadingFallback />,
  ssr: false,
});
const SettingsApp = dynamic(() => import('../apps/SettingsApp').then((mod) => mod.SettingsApp), {
  loading: () => <AppLoadingFallback />,
  ssr: false,
});
const TerminalApp = dynamic(() => import('../apps/TerminalApp').then((mod) => mod.TerminalApp), {
  loading: () => <AppLoadingFallback />,
  ssr: false,
});
const BrowserApp = dynamic(() => import('../apps/BrowserApp').then((mod) => mod.BrowserApp), {
  loading: () => <AppLoadingFallback />,
  ssr: false,
});
const PhotosApp = dynamic(() => import('../apps/PhotosApp').then((mod) => mod.PhotosApp), {
  loading: () => <AppLoadingFallback />,
  ssr: false,
});
const GamesApp = dynamic(() => import('../apps/GamesApp').then((mod) => mod.GamesApp), {
  loading: () => <AppLoadingFallback />,
  ssr: false,
});
const LinkedInApp = dynamic(() => import('../apps/LinkedInApp').then((mod) => mod.LinkedInApp), {
  loading: () => <AppLoadingFallback />,
  ssr: false,
});

export const WindowManager: React.FC = () => {
  const { windows } = useWindowStore();

  const openWindows = Object.values(windows).filter((w) => w.isOpen);

  const renderAppComponent = (id: AppId) => {
    switch (id) {
      case 'about': return <AboutApp />;
      case 'projects': return <ProjectsApp />;
      case 'skills': return <SkillsApp />;
      case 'experience': return <ExperienceApp />;
      case 'contact': return <ContactApp />;
      case 'explorer': return <FileExplorerApp />;
      case 'notepad': return <NotepadApp />;
      case 'calculator': return <CalendarApp />;
      case 'settings': return <SettingsApp />;
      case 'terminal': return <TerminalApp />;
      case 'browser': return <BrowserApp />;
      case 'photos': return <PhotosApp />;
      case 'games': return <GamesApp />;
      case 'linkedin': return <LinkedInApp />;
      default: return null;
    }
  };

  return (
    <>
      {openWindows.map((windowState) => (
        <Window key={windowState.id} windowState={windowState}>
          {renderAppComponent(windowState.id)}
        </Window>
      ))}
    </>
  );
};
