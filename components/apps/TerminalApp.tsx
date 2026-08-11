'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useWindowStore } from '../../store/useWindowStore';
import { AppId } from '../../types';
import { MAYURESH_PROFILE, PROJECTS, SKILL_CATEGORIES } from '../../data/portfolio';

interface LogLine {
  id: string;
  type: 'input' | 'output' | 'error' | 'success';
  text: string;
}

export const TerminalApp: React.FC = () => {
  const { openWindow } = useWindowStore();
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState<LogLine[]>([
    {
      id: 'init-1',
      type: 'output',
      text: 'Mayuresh OS Terminal [Version 4.2.0]\n(c) Mayuresh Portfolio Corporation. All rights reserved.\n\nType "help" to view available shell commands.',
    },
  ]);
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [cmdHistoryIndex, setCmdHistoryIndex] = useState<number>(-1);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    // Add to history
    setCmdHistory((prev) => [...prev, trimmed]);
    setCmdHistoryIndex(-1);

    const newLogs: LogLine[] = [
      { id: `in-${Date.now()}`, type: 'input', text: `mayuresh@os-desktop:~$ ${trimmed}` },
    ];

    const parts = trimmed.split(' ');
    const mainCmd = parts[0].toLowerCase();
    const arg = parts.slice(1).join(' ').toLowerCase();

    switch (mainCmd) {
      case 'help':
        newLogs.push({
          id: `out-${Date.now()}`,
          type: 'output',
          text: `AVAILABLE COMMANDS:
  help           Display list of commands
  about          Show Mayuresh profile details
  projects       List engineering projects
  skills font    List technical skills & stack
  contact        Display direct contact channels
  open <app>     Launch app (e.g. "open projects", "open notepad")
  neofetch       Display ASCII system specifications
  whoami         Show active logged in user
  date           Display current system timestamp
  clear          Clear terminal prompt screen`,
        });
        break;

      case 'about':
        newLogs.push({
          id: `out-${Date.now()}`,
          type: 'output',
          text: `NAME: ${MAYURESH_PROFILE.name}\nROLE: ${MAYURESH_PROFILE.title}\nLOCATION: ${MAYURESH_PROFILE.location}\nBIO: ${MAYURESH_PROFILE.bio}`,
        });
        break;

      case 'projects':
        const projList = PROJECTS.map((p) => `  - ${p.title}: ${p.shortDescription}`).join('\n');
        newLogs.push({
          id: `out-${Date.now()}`,
          type: 'output',
          text: `FEATURED PROJECTS:\n${projList}`,
        });
        break;

      case 'skills':
        const skillsList = SKILL_CATEGORIES.map(
          (cat) => `  [${cat.category}]\n  ` + cat.skills.map((s) => s.name).join(', ')
        ).join('\n\n');
        newLogs.push({
          id: `out-${Date.now()}`,
          type: 'output',
          text: `TECHNICAL SKILLS:\n${skillsList}`,
        });
        break;

      case 'contact':
        newLogs.push({
          id: `out-${Date.now()}`,
          type: 'output',
          text: `EMAIL: ${MAYURESH_PROFILE.email}\nGITHUB: ${MAYURESH_PROFILE.github}\nLINKEDIN: ${MAYURESH_PROFILE.linkedin}`,
        });
        break;

      case 'whoami':
        newLogs.push({
          id: `out-${Date.now()}`,
          type: 'output',
          text: 'mayuresh (Administrator / Principal Engineer)',
        });
        break;

      case 'date':
        newLogs.push({
          id: `out-${Date.now()}`,
          type: 'output',
          text: new Date().toString(),
        });
        break;

      case 'clear':
        setHistory([]);
        setInputVal('');
        return;

      case 'neofetch':
        newLogs.push({
          id: `out-${Date.now()}`,
          type: 'output',
          text: `
     /\\       mayuresh@os-desktop
    /  \\      -------------------
   / /\\ \\     OS: Mayuresh OS v4.2 x86_64
  / /__\\ \\    Host: Next.js 14 App Router
 / /____\\ \\   Kernel: TypeScript 5.5
/_/      \\_\\ Uptime: 99.99%
              Shell: Mayuresh Shell v1.0
              WM: Framer Motion Window Manager
              CPU: Virtual 8-Core JS Engine
              Memory: 16GB Virtual Web Memory
`,
        });
        break;

      case 'open':
        const validApps: AppId[] = [
          'about',
          'projects',
          'skills',
          'experience',
          'contact',
          'explorer',
          'notepad',
          'calendar',
          'settings',
          'terminal',
          'browser',
          'photos',
          'recycle-bin',
        ];
        if (validApps.includes(arg as AppId)) {
          openWindow(arg as AppId);
          newLogs.push({
            id: `out-${Date.now()}`,
            type: 'success',
            text: `Opening process window: [${arg}]...`,
          });
        } else {
          newLogs.push({
            id: `out-${Date.now()}`,
            type: 'error',
            text: `App "${arg}" not found. Available apps: ${validApps.join(', ')}`,
          });
        }
        break;

      default:
        newLogs.push({
          id: `out-${Date.now()}`,
          type: 'error',
          text: `Command not recognized: "${trimmed}". Type "help" for a list of available commands.`,
        });
    }

    setHistory((prev) => [...prev, ...newLogs]);
    setInputVal('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCommand(inputVal);
    } else if (e.key === 'ArrowUp') {
      if (cmdHistory.length > 0) {
        const nextIdx = cmdHistoryIndex + 1 < cmdHistory.length ? cmdHistoryIndex + 1 : cmdHistoryIndex;
        setCmdHistoryIndex(nextIdx);
        setInputVal(cmdHistory[cmdHistory.length - 1 - nextIdx] || '');
      }
    } else if (e.key === 'ArrowDown') {
      if (cmdHistoryIndex > 0) {
        const nextIdx = cmdHistoryIndex - 1;
        setCmdHistoryIndex(nextIdx);
        setInputVal(cmdHistory[cmdHistory.length - 1 - nextIdx] || '');
      } else {
        setCmdHistoryIndex(-1);
        setInputVal('');
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 p-4 font-mono text-xs select-text text-slate-200 overflow-y-auto custom-scrollbar">
      <div className="space-y-3">
        {history.map((log) => (
          <div key={log.id} className="whitespace-pre-wrap leading-relaxed">
            {log.type === 'input' && <span className="text-cyan-400 font-bold">{log.text}</span>}
            {log.type === 'output' && <span className="text-slate-300">{log.text}</span>}
            {log.type === 'success' && <span className="text-emerald-400 font-semibold">{log.text}</span>}
            {log.type === 'error' && <span className="text-rose-400 font-semibold">{log.text}</span>}
          </div>
        ))}
      </div>

      {/* Live Input Line */}
      <div className="flex items-center gap-2 mt-3 pt-2 border-t border-slate-800">
        <span className="text-cyan-400 font-bold shrink-0">mayuresh@os-desktop:~$</span>
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
          className="flex-1 bg-transparent text-white focus:outline-none font-mono text-xs"
        />
      </div>

      <div ref={endRef} />
    </div>
  );
};
