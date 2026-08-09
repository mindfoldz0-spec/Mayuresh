'use client';

import React, { useState } from 'react';
import { Trash2, RefreshCw, FileText, Archive, CheckCircle2 } from 'lucide-react';
import { useSystemStore } from '../../store/useSystemStore';

export const RecycleBinApp: React.FC = () => {
  const { addNotification } = useSystemStore();
  const [items, setItems] = useState([
    { id: 'del-1', name: 'old_legacy_portfolio_2019.zip', size: '4.5 MB', deletedDate: '2021-03-12', icon: Archive },
    { id: 'del-2', name: 'draft_ideas.txt', size: '1 KB', deletedDate: '2023-01-10', icon: FileText },
  ]);

  const handleEmpty = () => {
    setItems([]);
    addNotification('Recycle Bin Emptied', 'All items purged from disk.', 'info');
  };

  const handleRestore = () => {
    setItems([]);
    addNotification('Items Restored', 'Deleted items restored to Documents folder!', 'success');
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 p-6 select-none font-sans text-white">
      {/* Top Toolbar */}
      <div className="border-b border-white/10 pb-4 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30">
            <Trash2 size={20} />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Recycle Bin</h2>
            <p className="text-xs text-slate-400 font-mono">{items.length} Deleted Items</p>
          </div>
        </div>

        {items.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleRestore}
              className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-medium border border-cyan-500/30 flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw size={14} />
              <span>Restore All</span>
            </button>
            <button
              onClick={handleEmpty}
              className="px-3 py-1.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs font-medium border border-red-500/30 flex items-center gap-1.5 transition-colors"
            >
              <Trash2 size={14} />
              <span>Empty Bin</span>
            </button>
          </div>
        )}
      </div>

      {/* Main List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {items.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 text-xs">
            <Trash2 size={48} className="mb-3 opacity-30" />
            <span className="font-semibold text-slate-400 text-sm">Recycle Bin is empty</span>
            <span className="text-slate-600 mt-1">Deleted items will appear here</span>
          </div>
        ) : (
          <div className="space-y-2">
            {items.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className="p-3 rounded-2xl bg-slate-900/60 border border-white/10 flex items-center justify-between text-xs text-slate-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-white/5 text-slate-400">
                      <Icon size={18} />
                    </div>
                    <div>
                      <div className="font-semibold text-white">{item.name}</div>
                      <div className="text-[10px] text-slate-500 font-mono">Deleted: {item.deletedDate}</div>
                    </div>
                  </div>
                  <span className="text-slate-400 font-mono text-xs">{item.size}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
