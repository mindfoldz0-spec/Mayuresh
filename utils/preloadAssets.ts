import { PROJECTS, PHOTOS, WALLPAPERS } from '../data/portfolio';
import { REAL_ICONS_MAP } from '../components/common/AppIcon';

// All critical static image paths to pre-cache into browser memory
export const LOCAL_ICONS = Object.values(REAL_ICONS_MAP);

export const LOCAL_WALLPAPERS = [
  '/wallpapers/windows11.jpg',
  '/wallpapers/macos-big-sur.jpg',
  '/wallpapers/seashore.jpg',
  '/wallpapers/forest-lake.jpg',
  '/wallpapers/tanjiro.jpg',
  '/wallpapers/gta6.png',
  '/wallpapers/odyssey.jpg',
  '/wallpapers/bugatti.jpg',
  '/wallpapers/windows-xp.jpg',
];

export const PROFILE_PHOTOS = [
  '/mayuresh.png',
];

// Helper to format path with basePath if present
const getFullPath = (path: string): string => {
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${basePath}${cleanPath}`;
};

export const getAllPreloadUrls = (): string[] => {
  const urls: string[] = [];

  // 1. Icons
  LOCAL_ICONS.forEach((path) => {
    if (path) urls.push(getFullPath(path));
  });

  // 2. Wallpapers
  LOCAL_WALLPAPERS.forEach((path) => {
    if (path) urls.push(getFullPath(path));
  });

  // 3. Profile photo
  PROFILE_PHOTOS.forEach((path) => {
    if (path) urls.push(getFullPath(path));
  });

  // 4. Projects & Photos media
  PROJECTS.forEach((p) => {
    if (p.imageUrl) urls.push(getFullPath(p.imageUrl));
  });

  PHOTOS.forEach((ph) => {
    if (ph.url) urls.push(getFullPath(ph.url));
  });

  // Remove duplicates
  return Array.from(new Set(urls));
};

let isPreloadingStarted = false;
let globalLoadedCount = 0;

export const preloadAllAssets = (
  onProgress?: (progress: number) => void
): Promise<void> => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve();
      return;
    }

    const urls = getAllPreloadUrls();
    const total = urls.length;

    if (total === 0) {
      onProgress?.(100);
      resolve();
      return;
    }

    if (isPreloadingStarted && globalLoadedCount >= total) {
      onProgress?.(100);
      resolve();
      return;
    }

    isPreloadingStarted = true;
    let completed = globalLoadedCount;

    urls.forEach((url) => {
      const img = new Image();
      img.onload = () => {
        completed++;
        globalLoadedCount = Math.max(globalLoadedCount, completed);
        const percent = Math.min(100, Math.floor((completed / total) * 100));
        onProgress?.(percent);
        if (completed >= total) resolve();
      };
      img.onerror = () => {
        // Continue even if a remote image fails
        completed++;
        globalLoadedCount = Math.max(globalLoadedCount, completed);
        const percent = Math.min(100, Math.floor((completed / total) * 100));
        onProgress?.(percent);
        if (completed >= total) resolve();
      };
      img.src = url;
    });

    // Timeout safety fallback after 3 seconds
    setTimeout(() => {
      onProgress?.(100);
      resolve();
    }, 3000);
  });
};
