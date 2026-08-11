'use client';

import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Settings,
  X,
  Sparkles,
  FileEdit,
  Bell,
  Minus,
  Square,
  Copy,
} from 'lucide-react';
import { AppIcon } from '../common/AppIcon';
import { useWindowStore } from '../../store/useWindowStore';

interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time?: string;
  type: 'reminder' | 'event';
}

const INITIAL_EVENTS: CalendarEvent[] = [
  {
    id: 'evt-1',
    title: '🚀 Portfolio Launch',
    date: '2026-08-20',
    time: '10:00 AM',
    type: 'event',
  },
  {
    id: 'evt-2',
    title: '🎮 Lost Dune Game Release',
    date: '2026-08-15',
    time: '02:00 PM',
    type: 'event',
  },
  {
    id: 'rem-1',
    title: 'Review Engineering Milestone',
    date: '2026-08-21',
    time: '05:00 PM',
    type: 'reminder',
  },
];

export const CalendarApp: React.FC = () => {
  const { minimizeWindow, maximizeWindow, closeWindow, windows } = useWindowStore();
  const isMaximized = windows['calculator']?.isMaximized || false;

  const [viewMode, setViewMode] = useState<'weekly' | 'monthly'>('weekly');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>(INITIAL_EVENTS);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'reminder' | 'event'>('event');
  const [eventTitle, setEventTitle] = useState('');
  const [eventTime, setEventTime] = useState('12:00 PM');

  // Month & Day names
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long' });
  const dayNumber = selectedDate.getDate();

  // Helper for week dates around selected date
  const getWeekDates = (date: Date) => {
    const current = new Date(date);
    const firstDayOfWeek = current.getDate() - current.getDay(); // Sunday
    const week = [];
    for (let i = 0; i < 7; i++) {
      week.push(new Date(current.setDate(firstDayOfWeek + i)));
    }
    return week;
  };

  const weekDates = getWeekDates(selectedDate);

  // Month grid calculations
  const daysInMonth = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const startDayOfMonth = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const totalDays = daysInMonth(currentDate);
  const startOffset = startDayOfMonth(currentDate);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const hasEventOnDate = (dateObj: Date) => {
    const dateStr = dateObj.toISOString().split('T')[0];
    return events.some((e) => e.date === dateStr);
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle.trim()) return;

    const dateStr = selectedDate.toISOString().split('T')[0];
    const newEvt: CalendarEvent = {
      id: `evt-${Date.now()}`,
      title: eventTitle,
      date: dateStr,
      time: eventTime,
      type: modalType,
    };

    setEvents((prev) => [...prev, newEvt]);
    setEventTitle('');
    setIsAddModalOpen(false);
  };

  return (
    <div
      className={`w-full text-white shadow-2xl relative overflow-hidden flex flex-col justify-between select-none font-sans transition-all ${
        isMaximized ? 'h-full rounded-none p-8' : 'rounded-[36px] p-7'
      }`}
      style={{
        background: 'rgba(38, 52, 42, 0.48)',
        backdropFilter: 'blur(50px) saturate(180%)',
        WebkitBackdropFilter: 'blur(50px) saturate(180%)',
        border: '1px solid rgba(255, 255, 255, 0.25)',
        boxShadow: '0 30px 60px rgba(0, 0, 0, 0.5), inset 0 1.5px 1px rgba(255, 255, 255, 0.3)',
      }}
    >
      {/* Top Header Row with App Icon, Title, Switcher & Window Controls */}
      <div className="flex items-center justify-between gap-2 mb-6 cursor-move select-none">
        {/* Top Left: App Icon & Title */}
        <div className="flex items-center gap-2">
          <AppIcon id="calculator" size={20} />
          <span className="text-xs font-semibold text-white/90 tracking-wide">Calendar</span>
        </div>

        {/* Center: Segmented Pill Switcher */}
        <div
          className="p-1 rounded-2xl flex items-center"
          style={{
            background: 'rgba(255, 255, 255, 0.10)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
          }}
        >
          <button
            onClick={() => setViewMode('weekly')}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all duration-300 ${
              viewMode === 'weekly'
                ? 'bg-white text-slate-900 shadow-md font-bold'
                : 'text-white/80 hover:text-white'
            }`}
          >
            Weekly
          </button>
          <button
            onClick={() => setViewMode('monthly')}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all duration-300 ${
              viewMode === 'monthly'
                ? 'bg-white text-slate-900 shadow-md font-bold'
                : 'text-white/80 hover:text-white'
            }`}
          >
            Monthly
          </button>
        </div>

        {/* Top Right: Settings & Window Controls (Minimize, Maximize, Close) */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setViewMode((prev) => (prev === 'weekly' ? 'monthly' : 'weekly'))}
            className="w-8 h-8 rounded-full flex items-center justify-center text-white/90 transition-all active:scale-95 shadow-sm mr-1"
            style={{
              background: 'rgba(255, 255, 255, 0.12)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              backdropFilter: 'blur(12px)',
            }}
            title="Settings"
          >
            <Settings size={15} />
          </button>

            {/* Window Controls (Minimize & Close only) */}
            <div className="flex items-center gap-0.5" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => minimizeWindow('calculator')}
                className="w-8 h-8 rounded-lg hover:bg-white/15 flex items-center justify-center text-white/80 hover:text-white transition-colors"
                title="Minimize"
              >
                <Minus size={14} />
              </button>
              <button
                onClick={() => closeWindow('calculator')}
                className="w-8 h-8 rounded-lg hover:bg-red-500/80 flex items-center justify-center text-white/80 hover:text-white transition-colors"
                title="Close"
              >
                <X size={15} />
              </button>
            </div>
        </div>
      </div>

      {/* Hero Date Header (Month + Big Date) */}
      <div className="flex items-baseline justify-between mb-8 px-1">
        <div className="flex items-center gap-2">
          <h1 className="text-5xl font-light tracking-tight text-white drop-shadow-sm">
            {monthName}
          </h1>
          {viewMode === 'monthly' && (
            <div className="flex items-center gap-1 ml-2">
              <button
                onClick={handlePrevMonth}
                className="p-1 rounded-lg hover:bg-white/15 text-white/70 hover:text-white"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={handleNextMonth}
                className="p-1 rounded-lg hover:bg-white/15 text-white/70 hover:text-white"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>
        <span className="text-5xl font-light text-white tracking-tight font-mono drop-shadow-sm">
          {dayNumber}
        </span>
      </div>

      {/* View Mode Content */}
      {viewMode === 'weekly' ? (
        /* WEEKLY VIEW (Matches exact design screenshot!) */
        <div className="mb-8">
          {/* Days Header */}
          <div className="grid grid-cols-7 text-center text-xs font-medium text-white/50 mb-3">
            <span>S</span>
            <span>M</span>
            <span>T</span>
            <span>W</span>
            <span>T</span>
            <span>F</span>
            <span>S</span>
          </div>

          {/* Dates Row */}
          <div className="grid grid-cols-7 text-center items-center justify-items-center">
            {weekDates.map((d) => {
              const isSelected =
                d.getDate() === selectedDate.getDate() &&
                d.getMonth() === selectedDate.getMonth() &&
                d.getFullYear() === selectedDate.getFullYear();

              const isToday =
                d.getDate() === new Date().getDate() &&
                d.getMonth() === new Date().getMonth() &&
                d.getFullYear() === new Date().getFullYear();

              const hasEvent = hasEventOnDate(d);

              return (
                <div
                  key={d.toISOString()}
                  onClick={() => setSelectedDate(d)}
                  className="flex flex-col items-center cursor-pointer group"
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-base font-semibold transition-all duration-300 ${
                      isSelected || isToday
                        ? 'bg-white text-slate-950 font-bold shadow-lg scale-105'
                        : 'text-white/95 hover:bg-white/15'
                    }`}
                  >
                    {d.getDate()}
                  </div>
                  {/* Event Dot Indicator */}
                  <div className="h-2 flex items-center justify-center mt-1">
                    {hasEvent && (
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${
                          isSelected || isToday ? 'bg-emerald-500' : 'bg-white/80'
                        }`}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* MONTHLY VIEW GRID */
        <div className="mb-8">
          <div className="grid grid-cols-7 text-center text-xs font-medium text-white/50 mb-2">
            <span>S</span>
            <span>M</span>
            <span>T</span>
            <span>W</span>
            <span>T</span>
            <span>F</span>
            <span>S</span>
          </div>

          <div className="grid grid-cols-7 text-center gap-1 text-sm">
            {Array.from({ length: startOffset }).map((_, i) => (
              <div key={`empty-${i}`} className="h-9" />
            ))}
            {Array.from({ length: totalDays }).map((_, i) => {
              const dayNum = i + 1;
              const d = new Date(currentDate.getFullYear(), currentDate.getMonth(), dayNum);
              const isSelected =
                d.getDate() === selectedDate.getDate() &&
                d.getMonth() === selectedDate.getMonth() &&
                d.getFullYear() === selectedDate.getFullYear();

              return (
                <div
                  key={dayNum}
                  onClick={() => setSelectedDate(d)}
                  className={`h-9 rounded-xl flex items-center justify-center font-medium cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-white text-slate-950 font-bold shadow-md'
                      : 'hover:bg-white/15 text-white/90'
                  }`}
                >
                  {dayNum}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Bottom Action Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-white/15">
        <button
          onClick={() => {
            setModalType('reminder');
            setIsAddModalOpen(true);
          }}
          className="flex items-center gap-2 text-xs font-medium text-white/85 hover:text-white transition-colors py-2 px-1"
        >
          <FileEdit size={16} className="text-white/85" />
          <span>Add Reminder</span>
        </button>

        <button
          onClick={() => {
            setModalType('event');
            setIsAddModalOpen(true);
          }}
          className="text-white text-xs font-semibold px-4 py-2.5 rounded-2xl flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
          style={{
            background: 'rgba(255, 255, 255, 0.14)',
            border: '1px solid rgba(255, 255, 255, 0.22)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Plus size={15} />
          <span>New Event</span>
        </button>
      </div>

      {/* Add Event Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div
            className="w-full max-w-sm rounded-3xl p-6 text-white shadow-2xl relative"
            style={{
              background: 'rgba(25, 35, 28, 0.92)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              backdropFilter: 'blur(30px)',
            }}
          >
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-white/10 text-white/70"
            >
              <X size={18} />
            </button>

            <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
              {modalType === 'event' ? <Sparkles size={18} className="text-emerald-400" /> : <Bell size={18} className="text-amber-400" />}
              Add {modalType === 'event' ? 'New Event' : 'Reminder'}
            </h3>
            <p className="text-xs text-slate-300 mb-4">
              For {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>

            <form onSubmit={handleAddEvent} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Title</label>
                <input
                  type="text"
                  placeholder={modalType === 'event' ? 'e.g. Design Sync Meeting' : 'e.g. Pay Internet Bill'}
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/20 text-white text-sm focus:outline-none focus:border-white/50"
                  autoFocus
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Time</label>
                <input
                  type="text"
                  value={eventTime}
                  onChange={(e) => setEventTime(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/20 text-white text-sm focus:outline-none focus:border-white/50 font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-300 hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-white text-slate-950 font-bold text-xs hover:bg-white/90 shadow-md"
                >
                  Save {modalType === 'event' ? 'Event' : 'Reminder'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
