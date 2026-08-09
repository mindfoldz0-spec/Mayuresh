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
  toggleTheme: () => void;
  setAccentColor: (color: string) => void;
  toggleAnimations: () => void;
  toggleSound: () => void;
  toggleTranslucency: () => void;
  resetSettings: () => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  wallpaperId: 'wall-bloom',
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

  toggleTheme: () =>
    set((state) => {
      const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
      if (typeof document !== 'undefined') {
        if (nextTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
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
      wallpaperId: 'wall-bloom',
      wallpaperValue: WALLPAPERS[0].value,
      theme: 'dark',
      accentColor: '#0078d4',
      animationsEnabled: true,
      soundEnabled: true,
      translucencyEnabled: true,
    }),
}));
