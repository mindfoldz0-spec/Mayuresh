'use client';

import React from 'react';
import { Window } from './Window';
import { useWindowStore } from '../../store/useWindowStore';
import { AboutApp } from '../apps/AboutApp';
import { ProjectsApp } from '../apps/ProjectsApp';
import { SkillsApp } from '../apps/SkillsApp';
import { ExperienceApp } from '../apps/ExperienceApp';
import { ContactApp } from '../apps/ContactApp';
import { FileExplorerApp } from '../apps/FileExplorerApp';
import { NotepadApp } from '../apps/NotepadApp';
import { CalculatorApp } from '../apps/CalculatorApp';
import { SettingsApp } from '../apps/SettingsApp';
import { TerminalApp } from '../apps/TerminalApp';
import { BrowserApp } from '../apps/BrowserApp';
import { PhotosApp } from '../apps/PhotosApp';
import { RecycleBinApp } from '../apps/RecycleBinApp';
import { GamesApp } from '../apps/GamesApp';
import { CalendarApp } from '../apps/CalendarApp';
import { LinkedInApp } from '../apps/LinkedInApp';
import { AppId } from '../../types';

export const WindowManager: React.FC = () => {
  const { windows } = useWindowStore();

  const renderAppComponent = (id: AppId) => {
    switch (id) {
      case 'about': return <AboutApp />;
      case 'projects': return <ProjectsApp />;
      case 'skills': return <SkillsApp />;
      case 'experience': return <ExperienceApp />;
      case 'contact': return <ContactApp />;
      case 'explorer': return <FileExplorerApp />;
      case 'notepad': return <NotepadApp />;
      case 'calculator': return <CalendarApp />;   // Calendar icon → Calendar app
      case 'settings': return <SettingsApp />;
      case 'terminal': return <TerminalApp />;
      case 'browser': return <BrowserApp />;
      case 'photos': return <PhotosApp />;
      case 'recycle-bin': return <RecycleBinApp />;
      case 'games': return <GamesApp />;
      case 'linkedin': return <LinkedInApp />;
      default: return null;
    }
  };

  return (
    <>
      {Object.values(windows).map((windowState) => (
        <Window key={windowState.id} windowState={windowState}>
          {renderAppComponent(windowState.id)}
        </Window>
      ))}
    </>
  );
};
