'use client';

import React, { useState, useEffect } from 'react';
import { Save, Trash2, FileText, Check, Copy } from 'lucide-react';
import { useSystemStore } from '../../store/useSystemStore';

export const NotepadApp: React.FC = () => {
  const { addNotification } = useSystemStore();
  const [content, setContent] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('mayuresh_notepad_content') ||
        `Welcome to Mayuresh OS Notepad!
----------------------------------
Developer: Mayuresh
Role: Full Stack Software Engineer
Location: Mumbai, India

Notes & Reminders:
- Next.js App Router & TypeScript architecture setup complete.
- Windows OS visual theme verified.
- Contact Mayuresh at mayuresh.dev@example.com for collaboration.`;
    }
    return '';
  });

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    localStorage.setItem('mayuresh_notepad_content', content);
    setSaved(true);
    addNotification('Saved', 'Notepad file saved to local storage!', 'success');
    setTimeout(() => setSaved(false), 2000);
  };

  const handleClear = () => {
    setContent('');
  };

  const linesCount = content ? content.split('\n').length : 0;
  const wordsCount = content ? content.trim().split(/\s+/).filter(Boolean).length : 0;
  const charsCount = content.length;

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 font-mono select-text">
      {/* Top Menu Bar */}
      <div className="h-10 px-4 bg-slate-900 border-b border-white/10 flex items-center justify-between gap-3 text-xs select-none shrink-0 font-sans">
        <div className="flex items-center gap-3 text-slate-300">
          <span className="font-semibold text-white flex items-center gap-1.5">
            <FileText size={14} className="text-cyan-400" />
            welcome.txt
          </span>
          <span className="text-[10px] text-slate-500">• Notepad</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            className="px-3 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-medium flex items-center gap-1.5 transition-colors border border-cyan-500/30"
          >
            {saved ? <Check size={14} className="text-emerald-400" /> : <Save size={14} />}
            <span>{saved ? 'Saved' : 'Save'}</span>
          </button>

          <button
            onClick={handleClear}
            className="px-3 py-1 rounded-lg bg-white/5 hover:bg-red-500/20 text-slate-300 hover:text-red-400 text-xs transition-colors"
            title="Clear Text"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Main Textarea */}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Type here..."
        className="flex-1 w-full p-4 bg-transparent text-sm text-cyan-100 focus:outline-none resize-none leading-relaxed custom-scrollbar font-mono"
      />

      {/* Footer Status Bar */}
      <div className="h-7 px-4 bg-slate-900 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400 font-mono select-none shrink-0">
        <div>
          <span>Lines: {linesCount}</span> • <span>Words: {wordsCount}</span> • <span>Chars: {charsCount}</span>
        </div>
        <div>UTF-8 • Windows (CRLF)</div>
      </div>
    </div>
  );
};
