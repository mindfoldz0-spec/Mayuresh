'use client';

import React, { useState } from 'react';
import { FILE_SYSTEM } from '../../data/portfolio';
import { FileExplorerItem } from '../../types';
import { useWindowStore } from '../../store/useWindowStore';
import {
  Folder,
  FileText,
  Image as ImageIcon,
  Monitor,
  ChevronRight,
  ChevronLeft,
  Search,
  LayoutGrid,
  List as ListIcon,
  Clock,
  Share2,
  MoreHorizontal,
  Cloud,
  Wifi,
  Film,
  Music,
  Download,
  FolderOpen,
  AppWindow,
  Tag,
  Share,
} from 'lucide-react';

// Exact User Provided CSS Code (Scaled using CSS scale transform for Files UI grid)
const folderCss = `
  .folder-item-wrapper {
    position: relative;
    width: 90px;
    height: 70px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  .folder-scaler {
    transform: scale(0.26);
    transform-origin: center center;
  }

  .folder {
    position: relative;
    width: 320px;
    height: 240px;
    perspective: 900px;
    -webkit-tap-highlight-color: transparent;
  }

  .folder::after {
    content: "";
    position: absolute;
    left: 6%; right: 6%; bottom: -26px;
    height: 26px;
    background: radial-gradient(ellipse at center, rgba(30, 80, 140, .22), transparent 70%);
    filter: blur(4px);
    transition: transform .55s cubic-bezier(0.75, -1.27, 0.3, 2.33), opacity .55s ease;
    z-index: 0;
  }
  .folder-item-wrapper:hover .folder::after, .folder.open::after {
    transform: scaleX(1.08) translateY(4px);
    opacity: .85;
  }

  .folder__back {
    position: absolute;
    inset: 0;
    z-index: 1;
  }
  .folder__back svg {
    display: block;
    width: 100%;
    height: 100%;
    filter: drop-shadow(0 1px 0 rgba(255,255,255,.35));
  }

  .papers {
    position: absolute;
    left: 7%; right: 7%;
    top: 14%;
    bottom: 10%;
    z-index: 2;
  }
  .paper {
    position: absolute;
    left: 0; right: 0;
    top: 0; bottom: 0;
    background: #ffffff;
    border-radius: 18px;
    box-shadow: 0 -1px 3px rgba(20, 70, 130, .12), 0 2px 6px rgba(20, 70, 130, .10);
    transform-origin: 50% 100%;
    background-image: linear-gradient(#d4e4f2 1px, transparent 1px);
    background-size: 100% 16px;
    background-position: 12px 22px;
    background-repeat: repeat;
    transition: transform .6s cubic-bezier(0.75, -1.27, 0.3, 2.33);
  }
  .paper::before {
    content: "";
    position: absolute;
    top: 10px; left: 12px;
    width: 42%; height: 6px;
    border-radius: 6px;
    background: #e8f1fa;
  }
  .paper:nth-child(1) { background-color: #fdfdfd; transition-delay: .12s; transform: translateY(6px) rotate(0deg); }
  .paper:nth-child(2) { background-color: #ffffff; transition-delay: .06s; transform: translateY(3px) rotate(0deg); }
  .paper:nth-child(3) { background-color: #ffffff; transition-delay: 0s; transform: translateY(0px) rotate(0deg); }

  .folder-item-wrapper:hover .paper:nth-child(1),
  .folder.open .paper:nth-child(1) { transform: translateY(-58%) rotate(-7deg) scale(.96); }
  .folder-item-wrapper:hover .paper:nth-child(2),
  .folder.open .paper:nth-child(2) { transform: translateY(-46%) rotate(0deg) scale(1); }
  .folder-item-wrapper:hover .paper:nth-child(3),
  .folder.open .paper:nth-child(3) { transform: translateY(-56%) rotate(7deg) scale(.96); }

  .folder__mouth {
    position: absolute;
    left: 4%; right: 4%;
    top: 13%;
    height: 10px;
    border-radius: 10px;
    background: linear-gradient(180deg, rgba(10, 50, 100, .35), rgba(10, 50, 100, 0));
    z-index: 3;
    pointer-events: none;
  }

  .folder__front {
    position: absolute;
    left: 0; right: 0;
    top: 16%; bottom: 0;
    border-radius: 26px 26px 30px 30px;
    background: linear-gradient(180deg, #38c1f7 0%, #1ea0f0 45%, #1b7fe3 100%);
    box-shadow: inset 0 1px 0 rgba(255,255,255,.4), 0 10px 24px rgba(21, 90, 160, .25);
    transform-origin: 50% 100%;
    transform: rotateX(0deg);
    transition: transform .6s cubic-bezier(0.75, -1.27, 0.3, 2.33);
    z-index: 4;
  }
  .folder-item-wrapper:hover .folder__front,
  .folder.open .folder__front {
    transform: rotateX(-14deg) translateY(2px);
  }
`;

// Folder Component rendering exact user provided HTML & CSS scaled cleanly
export const UserExactFolderIcon: React.FC<{
  name: string;
  onClick?: () => void;
  onDoubleClick?: () => void;
  isSelected?: boolean;
}> = ({ name, onClick, onDoubleClick, isSelected }) => {
  return (
    <div
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onTouchEnd={onDoubleClick}
      className={`group flex flex-col items-center justify-center p-2 rounded-2xl transition-all select-none ${
        isSelected
          ? 'bg-sky-500/20 ring-2 ring-sky-400/60 shadow-md'
          : 'hover:bg-black/5 dark:hover:bg-white/5'
      }`}
    >
      <div className="folder-item-wrapper">
        <div className="folder-scaler">
          <div className="folder">
            <div className="folder__back">
              <svg viewBox="0 0 320 240" preserveAspectRatio="none">
                <defs>
                  <linearGradient id={`bg-${name.replace(/\s+/g, '-')}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#38c1f7" />
                    <stop offset="100%" stopColor="#1ea0f0" />
                  </linearGradient>
                </defs>
                <path
                  fill={`url(#bg-${name.replace(/\s+/g, '-')})`}
                  d="M 34 240 L 290 240 Q 320 240 320 210 L 320 60 Q 320 30 290 30 L 140 30 Q 124 30 116 20 Q 108 4 84 4 L 26 4 Q 4 4 4 26 L 4 210 Q 4 240 34 240 Z"
                />
              </svg>
            </div>
            <div className="papers">
              <div className="paper"></div>
              <div className="paper"></div>
              <div className="paper"></div>
            </div>
            <div className="folder__mouth"></div>
            <div className="folder__front"></div>
          </div>
        </div>
      </div>

      <span className="mt-1 text-xs font-bold text-slate-800 dark:text-slate-100 tracking-tight text-center line-clamp-1 max-w-[110px]">
        {name}
      </span>
    </div>
  );
};

export const FileExplorerApp: React.FC = () => {
  const { openWindow } = useWindowStore();
  const [currentFolder, setCurrentFolder] = useState<FileExplorerItem>(FILE_SYSTEM[0]);
  const [history, setHistory] = useState<FileExplorerItem[]>([FILE_SYSTEM[0]]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const navigateTo = (folder: FileExplorerItem) => {
    const newHistory = history.slice(0, historyIndex + 1);
    setHistory([...newHistory, folder]);
    setHistoryIndex(newHistory.length);
    setCurrentFolder(folder);
    setSelectedItem(null);
  };

  const handleBack = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setCurrentFolder(history[historyIndex - 1]);
      setSelectedItem(null);
    }
  };

  const handleForward = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setCurrentFolder(history[historyIndex + 1]);
      setSelectedItem(null);
    }
  };

  const handleItemClick = (item: FileExplorerItem) => {
    setSelectedItem(item.id);
  };

  const handleItemDoubleClick = (item: FileExplorerItem) => {
    if (item.type === 'folder' && item.children) {
      navigateTo(item);
    } else if (item.appTarget) {
      openWindow(item.appTarget);
    }
  };

  const displayedChildren = (currentFolder.children || []).filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full select-none text-slate-800 dark:text-slate-100 font-sans bg-[#f7f2ed] dark:bg-[#1c1b1a] overflow-hidden">
      {/* Inject exact CSS from user's provided code */}
      <style>{folderCss}</style>

      {/* macOS Finder Toolbar & Window Header */}
      <div className="h-12 px-4 flex items-center justify-between shrink-0 bg-[#ebe3da]/90 dark:bg-[#252321]/90 backdrop-blur-md border-b border-black/10 dark:border-white/10">
        
        {/* Navigation Arrows & View Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <button
              onClick={handleBack}
              disabled={historyIndex === 0}
              className="p-1.5 rounded-md hover:bg-black/5 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={handleForward}
              disabled={historyIndex >= history.length - 1}
              className="p-1.5 rounded-md hover:bg-black/5 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Grid / List View Switcher */}
          <div className="flex items-center bg-black/5 dark:bg-white/10 rounded-lg p-0.5 border border-black/5 dark:border-white/10">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-all ${
                viewMode === 'grid' ? 'bg-white dark:bg-slate-800 shadow-sm text-sky-600 dark:text-sky-400' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <LayoutGrid size={15} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md transition-all ${
                viewMode === 'list' ? 'bg-white dark:bg-slate-800 shadow-sm text-sky-600 dark:text-sky-400' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <ListIcon size={15} />
            </button>
          </div>
        </div>

        {/* Current Folder Path Breadcrumb Pill */}
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-100 bg-white/70 dark:bg-black/30 px-3.5 py-1 rounded-full border border-black/5 dark:border-white/10 shadow-sm">
          <Folder size={14} className="text-sky-500" />
          <span>{currentFolder.name}</span>
        </div>

        {/* Action Controls & Search Box */}
        <div className="flex items-center gap-2">
          <button className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
            <Share size={15} />
          </button>
          <button className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
            <Tag size={15} />
          </button>
          <button className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
            <MoreHorizontal size={15} />
          </button>

          {/* Search Box */}
          <div className="relative w-36 sm:w-44">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search"
              className="w-full pl-8 pr-3 h-7 rounded-full bg-white/70 dark:bg-black/40 border border-black/10 dark:border-white/10 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400/50 transition-all"
            />
          </div>
        </div>

      </div>

      {/* Main Finder Body: Translucent Glass Sidebar + Folder Grid View */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* macOS Style Translucent Sidebar */}
        <div className="w-48 bg-[#ebdcd0]/60 dark:bg-[#23201e]/60 backdrop-blur-md border-r border-black/10 dark:border-white/10 py-3 px-2.5 shrink-0 overflow-y-auto custom-scrollbar flex flex-col space-y-4 text-xs font-medium">
          
          {/* Recents & Shared Section */}
          <div className="space-y-0.5">
            <button className="w-full px-2.5 py-1.5 rounded-lg flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
              <Clock size={15} className="text-sky-500" />
              <span>Recents</span>
            </button>
            <button className="w-full px-2.5 py-1.5 rounded-lg flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
              <Share2 size={15} className="text-sky-500" />
              <span>Shared</span>
            </button>
          </div>

          {/* FAVORITES */}
          <div className="space-y-1">
            <div className="px-2.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Favorites
            </div>
            {FILE_SYSTEM.filter((f) => f.id !== 'root-recycle').map((folder) => {
              const isActive = currentFolder.id === folder.id;
              return (
                <button
                  key={folder.id}
                  onClick={() => navigateTo(folder)}
                  className={`w-full px-2.5 py-1.5 rounded-lg flex items-center gap-2 transition-all text-left ${
                    isActive
                      ? 'bg-sky-500 text-white shadow-sm font-semibold'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  <Folder size={15} className={isActive ? 'text-white' : 'text-sky-500'} />
                  <span className="truncate">{folder.name}</span>
                </button>
              );
            })}
          </div>

          {/* SHARED NETWORKS */}
          <div className="space-y-1">
            <div className="px-2.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Shared
            </div>
            <button className="w-full px-2.5 py-1.5 rounded-lg flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
              <Monitor size={15} className="text-slate-400" />
              <span className="truncate">Mayuresh's Mac Pro</span>
            </button>
            <button className="w-full px-2.5 py-1.5 rounded-lg flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
              <Wifi size={15} className="text-slate-400" />
              <span className="truncate">Network Storage</span>
            </button>
          </div>

          {/* LOCATIONS */}
          <div className="space-y-1">
            <div className="px-2.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Locations
            </div>
            <button className="w-full px-2.5 py-1.5 rounded-lg flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
              <Cloud size={15} className="text-sky-400" />
              <span>iCloud Drive</span>
            </button>
            <button className="w-full px-2.5 py-1.5 rounded-lg flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
              <Wifi size={15} className="text-sky-400" />
              <span>AirDrop</span>
            </button>
          </div>

        </div>

        {/* Main Grid View of Exact Verbatim Scaled Peek Folders */}
        <div className="flex-1 flex flex-col overflow-hidden bg-[#fdfbf7] dark:bg-[#171615]">
          
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto custom-scrollbar">
            {displayedChildren.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 text-xs">
                <Folder size={52} className="mb-3 opacity-30 text-sky-500" />
                <span>This folder is empty</span>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {displayedChildren.map((item) => {
                  const isSelected = selectedItem === item.id;

                  return (
                    <UserExactFolderIcon
                      key={item.id}
                      name={item.name}
                      isSelected={isSelected}
                      onClick={() => handleItemClick(item)}
                      onDoubleClick={() => handleItemDoubleClick(item)}
                    />
                  );
                })}
              </div>
            ) : (
              /* List View */
              <div className="space-y-1">
                <div className="grid grid-cols-12 gap-2 text-[11px] font-bold text-slate-400 border-b border-black/5 dark:border-white/5 pb-2 px-3">
                  <span className="col-span-6">Name</span>
                  <span className="col-span-3">Date Modified</span>
                  <span className="col-span-3 text-right">Size</span>
                </div>
                {displayedChildren.map((item) => {
                  const isSelected = selectedItem === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleItemClick(item)}
                      onDoubleClick={() => handleItemDoubleClick(item)}
                      onTouchEnd={() => handleItemDoubleClick(item)}
                      className={`grid grid-cols-12 gap-2 text-xs py-2 px-3 rounded-xl items-center cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-sky-500/15 text-sky-600 dark:text-sky-400 font-semibold'
                          : 'hover:bg-black/5 dark:hover:bg-white/5 text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      <div className="col-span-6 flex items-center gap-2.5 truncate">
                        <Folder size={18} className="text-sky-500 shrink-0" />
                        <span className="truncate">{item.name}</span>
                      </div>
                      <span className="col-span-3 text-slate-400 text-[11px]">
                        {item.modifiedDate}
                      </span>
                      <span className="col-span-3 text-slate-400 text-[11px] text-right">
                        {item.size || '—'}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Status Bar */}
          <div className="h-6 px-4 flex items-center justify-between border-t border-black/5 dark:border-white/5 bg-[#ebe3da]/60 dark:bg-[#252321]/60 shrink-0 text-[10px] font-medium text-slate-400">
            <span>{displayedChildren.length} item{displayedChildren.length !== 1 ? 's' : ''}</span>
            {selectedItem && (
              <span>{displayedChildren.find((c) => c.id === selectedItem)?.name}</span>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
