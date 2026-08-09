'use client';

import React, { useState } from 'react';
import { FILE_SYSTEM } from '../../data/portfolio';
import { FileExplorerItem, AppId } from '../../types';
import { useWindowStore } from '../../store/useWindowStore';
import {
  Folder,
  FileText,
  Image as ImageIcon,
  Monitor,
  Trash2,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  Search,
  Grid,
  List as ListIcon,
  HardDrive,
  User,
  Briefcase,
  Code,
} from 'lucide-react';

export const FileExplorerApp: React.FC = () => {
  const { openWindow } = useWindowStore();
  const [currentFolder, setCurrentFolder] = useState<FileExplorerItem>(FILE_SYSTEM[0]); // Desktop default
  const [history, setHistory] = useState<FileExplorerItem[]>([FILE_SYSTEM[0]]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');

  const navigateTo = (folder: FileExplorerItem) => {
    const newHistory = history.slice(0, historyIndex + 1);
    setHistory([...newHistory, folder]);
    setHistoryIndex(newHistory.length);
    setCurrentFolder(folder);
  };

  const handleBack = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setCurrentFolder(history[historyIndex - 1]);
    }
  };

  const handleForward = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setCurrentFolder(history[historyIndex + 1]);
    }
  };

  const handleItemClick = (item: FileExplorerItem) => {
    if (item.type === 'folder' && item.children) {
      navigateTo(item);
    } else if (item.appTarget) {
      openWindow(item.appTarget);
    }
  };

  const displayedChildren = (currentFolder.children || []).filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getFileIcon = (iconName: string) => {
    switch (iconName) {
      case 'User': return User;
      case 'Briefcase': return Briefcase;
      case 'Code': return Code;
      case 'FileText': return FileText;
      case 'Image': return ImageIcon;
      case 'Monitor': return Monitor;
      case 'Trash2': return Trash2;
      default: return Folder;
    }
  };

  return (
    <div className="flex flex-col h-full select-none text-slate-100 font-sans">
      {/* Top Address & Navigation Bar */}
      <div className="h-12 px-4 bg-slate-900 border-b border-white/10 flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-1">
          <button
            onClick={handleBack}
            disabled={historyIndex === 0}
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 disabled:opacity-40"
            title="Back"
          >
            <ArrowLeft size={16} />
          </button>
          <button
            onClick={handleForward}
            disabled={historyIndex >= history.length - 1}
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 disabled:opacity-40"
            title="Forward"
          >
            <ArrowRight size={16} />
          </button>
        </div>

        {/* Address Breadcrumb Bar */}
        <div className="flex-1 px-3 py-1.5 rounded-xl bg-slate-950 border border-white/10 text-xs flex items-center gap-1.5 font-mono text-slate-300 overflow-x-auto no-scrollbar">
          <HardDrive size={14} className="text-cyan-400 shrink-0" />
          <span>MayureshOS (C:)</span>
          <ChevronRight size={12} className="text-slate-500 shrink-0" />
          <span className="text-white font-semibold">{currentFolder.name}</span>
        </div>

        {/* Search & View Toggle */}
        <div className="flex items-center gap-2">
          <div className="relative w-40 sm:w-48">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search directory..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-950 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center bg-slate-950 border border-white/10 rounded-xl p-0.5">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg ${viewMode === 'grid' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400'}`}
              title="Grid View"
            >
              <Grid size={14} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg ${viewMode === 'list' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400'}`}
              title="List View"
            >
              <ListIcon size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Explorer Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-48 bg-slate-950/70 border-r border-white/10 p-3 space-y-4 shrink-0 overflow-y-auto custom-scrollbar">
          <div>
            <div className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider mb-2">
              QUICK ACCESS
            </div>
            <div className="space-y-1">
              {FILE_SYSTEM.map((folder) => {
                const Icon = getFileIcon(folder.icon);
                const isActive = currentFolder.id === folder.id;

                return (
                  <button
                    key={folder.id}
                    onClick={() => navigateTo(folder)}
                    className={`w-full px-2.5 py-1.5 rounded-xl text-xs flex items-center gap-2.5 transition-all text-left ${
                      isActive
                        ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-400/30'
                        : 'hover:bg-white/5 text-slate-300'
                    }`}
                  >
                    <Icon size={16} className={isActive ? 'text-cyan-400' : 'text-slate-400'} />
                    <span className="truncate">{folder.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Main Content */}
        <div className="flex-1 p-4 overflow-y-auto custom-scrollbar bg-slate-900/40">
          {displayedChildren.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 text-xs">
              <Folder size={40} className="mb-2 opacity-40" />
              <span>This folder is empty</span>
            </div>
          ) : viewMode === 'grid' ? (
            /* Grid View */
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {displayedChildren.map((item) => {
                const Icon = getFileIcon(item.icon);

                return (
                  <div
                    key={item.id}
                    onDoubleClick={() => handleItemClick(item)}
                    onTouchEnd={() => handleItemClick(item)}
                    className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-400/50 hover:bg-white/10 flex flex-col items-center justify-center gap-2 text-center cursor-pointer transition-all group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center text-cyan-300 group-hover:scale-105 shadow-md">
                      <Icon size={24} />
                    </div>
                    <span className="text-xs font-medium text-slate-200 line-clamp-2 leading-tight">
                      {item.name}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">{item.size || 'Folder'}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            /* List View */
            <div className="space-y-1">
              <div className="grid grid-cols-12 gap-2 text-[11px] font-mono text-slate-400 border-b border-white/10 pb-2 px-3">
                <span className="col-span-6">Name</span>
                <span className="col-span-3">Date Modified</span>
                <span className="col-span-3 text-right">Size</span>
              </div>
              {displayedChildren.map((item) => {
                const Icon = getFileIcon(item.icon);

                return (
                  <div
                    key={item.id}
                    onDoubleClick={() => handleItemClick(item)}
                    onTouchEnd={() => handleItemClick(item)}
                    className="grid grid-cols-12 gap-2 text-xs text-slate-200 p-2.5 rounded-xl hover:bg-white/10 items-center cursor-pointer transition-colors"
                  >
                    <div className="col-span-6 flex items-center gap-2.5 truncate">
                      <Icon size={16} className="text-cyan-400 shrink-0" />
                      <span className="truncate">{item.name}</span>
                    </div>
                    <span className="col-span-3 text-slate-400 font-mono text-[11px]">
                      {item.modifiedDate}
                    </span>
                    <span className="col-span-3 text-slate-400 font-mono text-[11px] text-right">
                      {item.size || '--'}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
