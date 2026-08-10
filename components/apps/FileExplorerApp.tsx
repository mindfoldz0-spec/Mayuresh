'use client';

import React, { useState } from 'react';
import { FILE_SYSTEM } from '../../data/portfolio';
import { FileExplorerItem, AppId } from '../../types';
import { useWindowStore } from '../../store/useWindowStore';
import { AppIcon } from '../common/AppIcon';
import {
  Folder,
  FileText,
  Image as ImageIcon,
  Monitor,
  Trash2,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Search,
  LayoutGrid,
  List as ListIcon,
  HardDrive,
  User,
  Briefcase,
  Code,
  Award,
  Mail,
  Archive,
  Star,
  Home,
} from 'lucide-react';

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

  const handleUp = () => {
    const parentFolder = FILE_SYSTEM.find((f) =>
      f.children?.some((c) => c.id === currentFolder.id)
    );
    if (parentFolder) navigateTo(parentFolder);
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

  const getFileIcon = (iconName: string) => {
    switch (iconName) {
      case 'User': return User;
      case 'Briefcase': return Briefcase;
      case 'Code': return Code;
      case 'Award': return Award;
      case 'Mail': return Mail;
      case 'FileText': return FileText;
      case 'Image': return ImageIcon;
      case 'Monitor': return Monitor;
      case 'Trash2': return Trash2;
      case 'Archive': return Archive;
      default: return Folder;
    }
  };

  const getIconColor = (iconName: string) => {
    switch (iconName) {
      case 'Folder': return 'text-amber-400';
      case 'User': return 'text-blue-400';
      case 'Briefcase': return 'text-emerald-400';
      case 'Code': return 'text-violet-400';
      case 'Award': return 'text-yellow-400';
      case 'Mail': return 'text-sky-400';
      case 'FileText': return 'text-slate-300';
      case 'Image': return 'text-pink-400';
      case 'Monitor': return 'text-cyan-400';
      case 'Trash2': return 'text-slate-500';
      case 'Archive': return 'text-orange-400';
      default: return 'text-amber-400';
    }
  };

  const getBreadcrumbs = () => {
    const crumbs: { name: string; folder?: FileExplorerItem }[] = [
      { name: 'This PC' },
    ];
    // Find if currentFolder is a root or nested
    const rootMatch = FILE_SYSTEM.find((f) => f.id === currentFolder.id);
    if (rootMatch) {
      crumbs.push({ name: rootMatch.name, folder: rootMatch });
    } else {
      // nested - find parent
      for (const root of FILE_SYSTEM) {
        if (root.children?.some((c) => c.id === currentFolder.id)) {
          crumbs.push({ name: root.name, folder: root });
          crumbs.push({ name: currentFolder.name, folder: currentFolder });
          break;
        }
      }
    }
    return crumbs;
  };

  return (
    <div className="flex flex-col h-full select-none text-slate-200 font-sans bg-[#191919]">
      {/* Navigation Bar */}
      <div className="h-11 px-3 flex items-center gap-2 shrink-0 border-b border-white/[0.06] bg-[#1f1f1f]">
        {/* Nav Buttons */}
        <div className="flex items-center gap-0.5">
          <button
            onClick={handleBack}
            disabled={historyIndex === 0}
            className="p-1.5 rounded-md hover:bg-white/[0.08] text-slate-400 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
          >
            <ArrowLeft size={15} />
          </button>
          <button
            onClick={handleForward}
            disabled={historyIndex >= history.length - 1}
            className="p-1.5 rounded-md hover:bg-white/[0.08] text-slate-400 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
          >
            <ArrowRight size={15} />
          </button>
          <button
            onClick={handleUp}
            className="p-1.5 rounded-md hover:bg-white/[0.08] text-slate-400 transition-colors"
          >
            <ArrowUp size={15} />
          </button>
        </div>

        {/* Address / Breadcrumb Bar */}
        <div className="flex-1 h-7 px-3 rounded-md bg-[#2d2d2d] border border-white/[0.06] text-xs flex items-center gap-1 text-slate-400 overflow-x-auto no-scrollbar">
          <HardDrive size={13} className="text-slate-500 shrink-0" />
          {getBreadcrumbs().map((crumb, i) => (
            <React.Fragment key={i}>
              {i > 0 && <ChevronRight size={11} className="text-slate-600 shrink-0" />}
              <button
                onClick={() => crumb.folder && navigateTo(crumb.folder)}
                className={`whitespace-nowrap hover:text-white transition-colors ${
                  i === getBreadcrumbs().length - 1 ? 'text-slate-200' : 'text-slate-400'
                }`}
              >
                {crumb.name}
              </button>
            </React.Fragment>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-44">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${currentFolder.name}`}
            className="w-full pl-8 pr-3 h-7 rounded-md bg-[#2d2d2d] border border-white/[0.06] text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#4cc2ff]/50 transition-colors"
          />
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-44 bg-[#1f1f1f] border-r border-white/[0.06] py-2 px-2 shrink-0 overflow-y-auto custom-scrollbar">
          {/* Quick Access */}
          <div className="mb-4">
            <div className="flex items-center gap-1.5 px-2 py-1.5 text-[11px] text-slate-500 font-medium">
              <Star size={12} />
              <span>Quick access</span>
            </div>
            {FILE_SYSTEM.filter((f) => f.id !== 'root-recycle').map((folder) => {
              const isActive = currentFolder.id === folder.id;
              return (
                <button
                  key={folder.id}
                  onClick={() => navigateTo(folder)}
                  className={`w-full px-2 py-[5px] rounded-md text-[12px] flex items-center gap-2 transition-colors text-left ${
                    isActive
                      ? 'bg-white/[0.08] text-white'
                      : 'hover:bg-white/[0.04] text-slate-400'
                  }`}
                >
                  <Folder size={15} className={isActive ? 'text-amber-400' : 'text-amber-400/70'} />
                  <span className="truncate">{folder.name}</span>
                </button>
              );
            })}
          </div>

          {/* This PC */}
          <div className="mb-4">
            <div className="flex items-center gap-1.5 px-2 py-1.5 text-[11px] text-slate-500 font-medium">
              <Monitor size={12} />
              <span>This PC</span>
            </div>
            <button className="w-full px-2 py-[5px] rounded-md text-[12px] flex items-center gap-2 text-slate-400 hover:bg-white/[0.04] transition-colors text-left">
              <HardDrive size={15} className="text-slate-500" />
              <span>Local Disk (C:)</span>
            </button>
          </div>

          {/* Recycle Bin */}
          <div>
            <div className="h-px bg-white/[0.06] mx-2 mb-2" />
            {FILE_SYSTEM.filter((f) => f.id === 'root-recycle').map((folder) => {
              const isActive = currentFolder.id === folder.id;
              return (
                <button
                  key={folder.id}
                  onClick={() => navigateTo(folder)}
                  className={`w-full px-2 py-[5px] rounded-md text-[12px] flex items-center gap-2 transition-colors text-left ${
                    isActive
                      ? 'bg-white/[0.08] text-white'
                      : 'hover:bg-white/[0.04] text-slate-400'
                  }`}
                >
                  <Trash2 size={15} className="text-slate-500" />
                  <span className="truncate">{folder.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden bg-[#191919]">
          {/* Content Toolbar */}
          <div className="h-8 px-3 flex items-center justify-between border-b border-white/[0.06] bg-[#1f1f1f] shrink-0">
            <span className="text-[11px] text-slate-500">
              {displayedChildren.length} item{displayedChildren.length !== 1 ? 's' : ''}
            </span>
            <div className="flex items-center gap-0.5 bg-[#2d2d2d] rounded-md p-0.5">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1 rounded transition-colors ${viewMode === 'grid' ? 'bg-white/[0.1] text-white' : 'text-slate-500 hover:text-slate-300'}`}
              >
                <LayoutGrid size={13} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1 rounded transition-colors ${viewMode === 'list' ? 'bg-white/[0.1] text-white' : 'text-slate-500 hover:text-slate-300'}`}
              >
                <ListIcon size={13} />
              </button>
            </div>
          </div>

          {/* File Content */}
          <div className="flex-1 p-3 overflow-y-auto custom-scrollbar">
            {displayedChildren.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-600 text-xs">
                <Folder size={48} className="mb-3 opacity-30" />
                <span>This folder is empty</span>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-1">
                {displayedChildren.map((item) => {
                  const Icon = getFileIcon(item.icon);
                  const isSelected = selectedItem === item.id;

                  return (
                    <div
                      key={item.id}
                      onClick={() => handleItemClick(item)}
                      onDoubleClick={() => handleItemDoubleClick(item)}
                      onTouchEnd={() => handleItemDoubleClick(item)}
                      className={`p-3 rounded-md flex flex-col items-center justify-center gap-2 text-center cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-[#4cc2ff]/10 outline outline-1 outline-[#4cc2ff]/40'
                          : 'hover:bg-white/[0.04]'
                      }`}
                    >
                      <div className="w-10 h-10 flex items-center justify-center">
                        {item.type === 'folder' ? (
                          <Folder size={32} className="text-amber-400" />
                        ) : (
                          <Icon size={28} className={getIconColor(item.icon)} />
                        )}
                      </div>
                      <span className="text-[11px] text-slate-300 line-clamp-2 leading-tight max-w-full break-all">
                        {item.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* List View */
              <div>
                <div className="grid grid-cols-12 gap-2 text-[11px] text-slate-500 border-b border-white/[0.06] pb-1.5 px-2 mb-1">
                  <span className="col-span-6">Name</span>
                  <span className="col-span-3">Date modified</span>
                  <span className="col-span-3 text-right">Size</span>
                </div>
                {displayedChildren.map((item) => {
                  const Icon = getFileIcon(item.icon);
                  const isSelected = selectedItem === item.id;

                  return (
                    <div
                      key={item.id}
                      onClick={() => handleItemClick(item)}
                      onDoubleClick={() => handleItemDoubleClick(item)}
                      onTouchEnd={() => handleItemDoubleClick(item)}
                      className={`grid grid-cols-12 gap-2 text-[12px] py-[5px] px-2 rounded-md items-center cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-[#4cc2ff]/10 outline outline-1 outline-[#4cc2ff]/40'
                          : 'hover:bg-white/[0.04]'
                      }`}
                    >
                      <div className="col-span-6 flex items-center gap-2 truncate">
                        {item.type === 'folder' ? (
                          <Folder size={16} className="text-amber-400 shrink-0" />
                        ) : (
                          <Icon size={16} className={`${getIconColor(item.icon)} shrink-0`} />
                        )}
                        <span className="truncate text-slate-300">{item.name}</span>
                      </div>
                      <span className="col-span-3 text-slate-500 text-[11px]">
                        {item.modifiedDate}
                      </span>
                      <span className="col-span-3 text-slate-500 text-[11px] text-right">
                        {item.size || '—'}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Status Bar */}
          <div className="h-6 px-3 flex items-center justify-between border-t border-white/[0.06] bg-[#1f1f1f] shrink-0 text-[10px] text-slate-500">
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
