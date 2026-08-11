import { create } from 'zustand';
import { AppId, WindowState } from '../types';
import { APPS_CONFIG } from '../data/apps';

interface WindowStoreState {
  windows: Record<AppId, WindowState>;
  activeWindowId: AppId | null;
  maxZIndex: number;

  openWindow: (id: AppId) => void;
  closeWindow: (id: AppId) => void;
  minimizeWindow: (id: AppId) => void;
  maximizeWindow: (id: AppId) => void;
  focusWindow: (id: AppId) => void;
  updatePosition: (id: AppId, pos: { x: number; y: number }) => void;
  updateSize: (id: AppId, size: { width: number; height: number }) => void;
  toggleWindow: (id: AppId) => void;
}

const initialWindows: Record<AppId, WindowState> = APPS_CONFIG.reduce((acc, app, index) => {
  acc[app.id] = {
    id: app.id,
    title: app.title,
    iconName: app.iconName,
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 10,
    position: { x: 100 + (index % 4) * 30, y: 80 + (index % 4) * 20 },
    size: {
      width: app.defaultWidth || (app.id === 'calculator' ? 440 : 800),
      height: app.defaultHeight || (app.id === 'calculator' ? 560 : 600),
    },
  };
  return acc;
}, {} as Record<AppId, WindowState>);

export const useWindowStore = create<WindowStoreState>((set, get) => ({
  windows: initialWindows,
  activeWindowId: null,
  maxZIndex: 100,

  openWindow: (id: AppId) => {
    if (id === 'linkedin') {
      if (typeof window !== 'undefined') {
        window.open('https://www.linkedin.com/in/mayuresh-samel-aa1a412ba', '_blank', 'noopener,noreferrer');
      }
      return;
    }
    if (id === 'experience') {
      if (typeof window !== 'undefined') {
        window.open('https://github.com/mindfoldz0-spec', '_blank', 'noopener,noreferrer');
      }
      return;
    }

    const { windows, maxZIndex } = get();
    const target = windows[id];
    if (!target) return;

    const newZ = maxZIndex + 1;

    // Calculate exact viewport center position so windows open in the middle of the screen!
    let centeredPos = target.position;
    if (typeof window !== 'undefined') {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight - 56;
      const winWidth = id === 'calculator' ? 440 : target.size.width || 800;
      const winHeight = id === 'calculator' ? 560 : target.size.height || 600;

      const centerX = Math.max(20, Math.floor((screenWidth - winWidth) / 2));
      const centerY = Math.max(20, Math.floor((screenHeight - winHeight) / 2));
      centeredPos = { x: centerX, y: centerY };
    }

    set({
      windows: {
        ...windows,
        [id]: {
          ...target,
          isOpen: true,
          isMinimized: false,
          zIndex: newZ,
          position: centeredPos,
        },
      },
      activeWindowId: id,
      maxZIndex: newZ,
    });
  },

  closeWindow: (id: AppId) => {
    const { windows, activeWindowId } = get();
    const target = windows[id];
    if (!target) return;

    const remainingOpen = Object.values(windows).filter(
      (w) => w.isOpen && w.id !== id && !w.isMinimized
    );
    let nextActive: AppId | null = null;

    if (remainingOpen.length > 0) {
      remainingOpen.sort((a, b) => b.zIndex - a.zIndex);
      nextActive = remainingOpen[0].id;
    }

    set({
      windows: {
        ...windows,
        [id]: {
          ...target,
          isOpen: false,
          isMinimized: false,
        },
      },
      activeWindowId: activeWindowId === id ? nextActive : activeWindowId,
    });
  },

  minimizeWindow: (id: AppId) => {
    const { windows, activeWindowId } = get();
    const target = windows[id];
    if (!target) return;

    const remainingOpen = Object.values(windows).filter(
      (w) => w.isOpen && w.id !== id && !w.isMinimized
    );
    let nextActive: AppId | null = null;

    if (remainingOpen.length > 0) {
      remainingOpen.sort((a, b) => b.zIndex - a.zIndex);
      nextActive = remainingOpen[0].id;
    }

    set({
      windows: {
        ...windows,
        [id]: {
          ...target,
          isMinimized: true,
        },
      },
      activeWindowId: activeWindowId === id ? nextActive : activeWindowId,
    });
  },

  maximizeWindow: (id: AppId) => {
    const { windows } = get();
    const target = windows[id];
    if (!target) return;

    set({
      windows: {
        ...windows,
        [id]: {
          ...target,
          isMaximized: !target.isMaximized,
        },
      },
    });
    get().focusWindow(id);
  },

  focusWindow: (id: AppId) => {
    const { windows, maxZIndex, activeWindowId } = get();
    const target = windows[id];
    if (!target || !target.isOpen) return;

    if (target.isMinimized) {
      const newZ = maxZIndex + 1;
      set({
        windows: {
          ...windows,
          [id]: {
            ...target,
            isMinimized: false,
            zIndex: newZ,
          },
        },
        activeWindowId: id,
        maxZIndex: newZ,
      });
      return;
    }

    if (activeWindowId === id) return;

    const newZ = maxZIndex + 1;
    set({
      windows: {
        ...windows,
        [id]: {
          ...target,
          zIndex: newZ,
        },
      },
      activeWindowId: id,
      maxZIndex: newZ,
    });
  },

  updatePosition: (id: AppId, pos: { x: number; y: number }) => {
    const { windows } = get();
    const target = windows[id];
    if (!target) return;

    set({
      windows: {
        ...windows,
        [id]: {
          ...target,
          position: pos,
        },
      },
    });
  },

  updateSize: (id: AppId, size: { width: number; height: number }) => {
    const { windows } = get();
    const target = windows[id];
    if (!target) return;

    set({
      windows: {
        ...windows,
        [id]: {
          ...target,
          size,
        },
      },
    });
  },

  toggleWindow: (id: AppId) => {
    const { windows, activeWindowId } = get();
    const target = windows[id];
    if (!target) return;

    if (!target.isOpen) {
      get().openWindow(id);
    } else if (target.isMinimized) {
      get().focusWindow(id);
    } else if (activeWindowId === id) {
      get().minimizeWindow(id);
    } else {
      get().focusWindow(id);
    }
  },
}));
