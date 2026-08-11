import { create } from 'zustand';
import { WALLPAPERS } from '../data/portfolio';

interface SettingsState {
  wallpaperId: string;
  wallpaperValue: string;
  theme: 'dark' | 'light';
  accentColor: string;
  animationsEnabled: boolean;
  soundEnabled: boolean;
  translucencyEnabled: boolean;

  setWallpaper: (wallpaperId: string) => void;
  setTheme: (theme: 'dark' | 'light') => void;
  toggleTheme: () => void;
  setAccentColor: (color: string) => void;
  toggleAnimations: () => void;
  toggleSound: () => void;
  toggleTranslucency: () => void;
  resetSettings: () => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  wallpaperId: 'wall-windowsxp',
  wallpaperValue: WALLPAPERS[0].value,
  theme: 'dark',
  accentColor: '#0078d4',
  animationsEnabled: true,
  soundEnabled: true,
  translucencyEnabled: true,

  setWallpaper: (wallpaperId: string) => {
    const wall = WALLPAPERS.find((w) => w.id === wallpaperId);
    if (wall) {
      set({ wallpaperId, wallpaperValue: wall.value });
    }
  },

  setTheme: (theme: 'dark' | 'light') => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
      }
    }
    set({ theme });
  },

  toggleTheme: () =>
    set((state) => {
      const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-theme', nextTheme);
        if (nextTheme === 'dark') {
          document.documentElement.classList.add('dark');
          document.documentElement.classList.remove('light');
        } else {
          document.documentElement.classList.remove('dark');
          document.documentElement.classList.add('light');
        }
      }
      return { theme: nextTheme };
    }),

  setAccentColor: (accentColor) => set({ accentColor }),
  toggleAnimations: () => set((state) => ({ animationsEnabled: !state.animationsEnabled })),
  toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
  toggleTranslucency: () => set((state) => ({ translucencyEnabled: !state.translucencyEnabled })),
  resetSettings: () =>
    set({
      wallpaperId: 'wall-windowsxp',
      wallpaperValue: WALLPAPERS[0].value,
      theme: 'dark',
      accentColor: '#0078d4',
      animationsEnabled: true,
      soundEnabled: true,
      translucencyEnabled: true,
    }),
}));
