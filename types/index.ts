export type BootStage = 'booting' | 'loading' | 'lockscreen' | 'desktop';

export type AppId =
  | 'about'
  | 'projects'
  | 'skills'
  | 'experience'
  | 'contact'
  | 'explorer'
  | 'notepad'
  | 'calculator'
  | 'settings'
  | 'terminal'
  | 'browser'
  | 'photos'
  | 'recycle-bin'
  | 'games'
  | 'linkedin';

export interface AppMetadata {
  id: AppId;
  title: string;
  iconName: string;
  category: 'system' | 'portfolio' | 'utility';
  isPinnedToTaskbar?: boolean;
  isDesktopShortcut?: boolean;
  defaultWidth?: number;
  defaultHeight?: number;
}

export interface WindowState {
  id: AppId;
  title: string;
  iconName: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
  prevPosition?: { x: number; y: number };
  prevSize?: { width: number; height: number };
}

export interface Project {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  techStack: string[];
  category: 'Full Stack' | 'Frontend' | 'Backend' | 'AI / Machine Learning' | 'Mobile';
  featured: boolean;
  githubUrl?: string;
  liveUrl?: string;
  imageUrl: string;
  highlights: string[];
}

export interface SkillCategory {
  category: string;
  icon: string;
  skills: {
    name: string;
    level: number; // 0 - 100
    experience: string;
    icon?: string;
    description: string;
  }[];
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  location: string;
  period: string;
  description: string;
  skillsUsed: string[];
  achievements: string[];
  type: 'work' | 'education' | 'project';
}

export interface PhotoItem {
  id: string;
  title: string;
  category: 'Projects' | 'Certificates' | 'Setup & Coding' | 'Design';
  url: string;
  caption: string;
  date: string;
}

export interface FileExplorerItem {
  id: string;
  name: string;
  type: 'folder' | 'file';
  extension?: string;
  size?: string;
  modifiedDate: string;
  appTarget?: AppId;
  content?: string;
  icon: string;
  children?: FileExplorerItem[];
}

export interface WallpaperOption {
  id: string;
  name: string;
  type: 'gradient' | 'image' | 'solid';
  value: string;
  thumbnail: string;
}
