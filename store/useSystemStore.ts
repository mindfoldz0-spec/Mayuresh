import { create } from 'zustand';
import { BootStage } from '../types';

interface SystemState {
  bootStage: BootStage;
  bootProgress: number;
  loadingMessage: string;
  isStartMenuOpen: boolean;
  isSearchOpen: boolean;
  isCalendarOpen: boolean;
  isControlCenterOpen: boolean;
  wifiConnected: boolean;
  volume: number; // 0 - 100
  isMuted: boolean;
  batteryLevel: number; // 0 - 100
  isCharging: boolean;
  notifications: { id: string; title: string; message: string; time: string; type?: 'info' | 'success' | 'warning' }[];
  
  // Actions
  setBootStage: (stage: BootStage) => void;
  setBootProgress: (progress: number, message?: string) => void;
  toggleStartMenu: (open?: boolean) => void;
  toggleSearch: (open?: boolean) => void;
  toggleCalendar: (open?: boolean) => void;
  toggleControlCenter: (open?: boolean) => void;
  toggleWifi: () => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  addNotification: (title: string, message: string, type?: 'info' | 'success' | 'warning') => void;
  dismissNotification: (id: string) => void;
  restartBootSequence: () => void;
}

export const useSystemStore = create<SystemState>((set) => ({
  bootStage: 'booting',
  bootProgress: 0,
  loadingMessage: 'Starting Mayuresh OS...',
  isStartMenuOpen: false,
  isSearchOpen: false,
  isCalendarOpen: false,
  isControlCenterOpen: false,
  wifiConnected: true,
  volume: 75,
  isMuted: false,
  batteryLevel: 98,
  isCharging: true,
  notifications: [
    {
      id: 'welcome-1',
      title: 'Welcome to Mayuresh OS',
      message: 'Explore projects, skills, and interactive apps from the desktop or Start Menu!',
      time: 'Just now',
      type: 'info',
    },
  ],

  setBootStage: (stage) => set({ bootStage: stage }),
  setBootProgress: (progress, message) =>
    set((state) => ({
      bootProgress: progress,
      loadingMessage: message ?? state.loadingMessage,
    })),
  toggleStartMenu: (open) =>
    set((state) => ({
      isStartMenuOpen: open !== undefined ? open : !state.isStartMenuOpen,
      isSearchOpen: false,
      isCalendarOpen: false,
      isControlCenterOpen: false,
    })),
  toggleSearch: (open) =>
    set((state) => ({
      isSearchOpen: open !== undefined ? open : !state.isSearchOpen,
      isStartMenuOpen: false,
      isCalendarOpen: false,
      isControlCenterOpen: false,
    })),
  toggleCalendar: (open) =>
    set((state) => ({
      isCalendarOpen: open !== undefined ? open : !state.isCalendarOpen,
      isStartMenuOpen: false,
      isSearchOpen: false,
      isControlCenterOpen: false,
    })),
  toggleControlCenter: (open) =>
    set((state) => ({
      isControlCenterOpen: open !== undefined ? open : !state.isControlCenterOpen,
      isStartMenuOpen: false,
      isSearchOpen: false,
      isCalendarOpen: false,
    })),
  toggleWifi: () => set((state) => ({ wifiConnected: !state.wifiConnected })),
  setVolume: (volume) => set({ volume, isMuted: volume === 0 }),
  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
  addNotification: (title, message, type = 'info') =>
    set((state) => ({
      notifications: [
        {
          id: `notif-${Date.now()}`,
          title,
          message,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type,
        },
        ...state.notifications,
      ],
    })),
  dismissNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
  restartBootSequence: () =>
    set({
      bootStage: 'booting',
      bootProgress: 0,
      loadingMessage: 'Starting Mayuresh OS...',
      isStartMenuOpen: false,
    }),
}));
