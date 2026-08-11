'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  Sparkles,
  Flag,
} from 'lucide-react';
import { useSettingsStore } from '../../store/useSettingsStore';

interface CalendarEvent {
  id: string;
  title: string;
  start: string; // YYYY-MM-DD
  type: 'holiday' | 'custom';
  globalName?: string;
  description?: string;
  bgColor?: string;
}

// Indian Gazetted Public Holidays
const INDIAN_HOLIDAYS_BASE = [
  { date: '-01-01', localName: "New Year's Day", name: "New Year's Day" },
  { date: '-01-26', localName: 'Republic Day (Gantantra Diwas)', name: 'Republic Day' },
  { date: '-03-08', localName: 'Maha Shivratri', name: 'Maha Shivratri' },
  { date: '-03-25', localName: 'Holi (Festival of Colors)', name: 'Holi' },
  { date: '-04-14', localName: 'Dr. B.R. Ambedkar Jayanti', name: 'Ambedkar Jayanti' },
  { date: '-05-01', localName: 'Maharashtra Day / Labour Day', name: 'Maharashtra Day' },
  { date: '-08-15', localName: 'Independence Day (Swatantrata Diwas)', name: 'Independence Day' },
  { date: '-09-07', localName: 'Ganesh Chaturthi', name: 'Ganesh Chaturthi' },
  { date: '-10-02', localName: 'Mahatma Gandhi Jayanti', name: 'Gandhi Jayanti' },
  { date: '-10-24', localName: 'Dussehra (Vijaya Dashami)', name: 'Dussehra' },
  { date: '-11-01', localName: 'Deepavali (Diwali)', name: 'Diwali' },
  { date: '-11-15', localName: 'Guru Nanak Jayanti', name: 'Guru Nanak Jayanti' },
  { date: '-12-25', localName: 'Christmas Day (Bada Din)', name: 'Christmas' },
];

// Custom Milestones
const INITIAL_CUSTOM_EVENTS: CalendarEvent[] = [
  {
    id: 'portfolio-launch',
    title: '🚀 Portfolio Launch',
    start: '2026-08-20',
    type: 'custom',
    description: 'Official launch of Mayuresh Samel Windows OS Portfolio website.',
    bgColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
  },
  {
    id: 'lost-dune-release',
    title: '🎮 Lost Dune Game Release',
    start: '2026-08-15',
    type: 'custom',
    description: 'Release of 3rd year diploma project Lost Dune web game by Mayuresh Samel.',
    bgColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
  },
  {
    id: 'diploma-engineering',
    title: '🎓 Diploma Engineering Milestone',
    start: '2026-08-05',
    type: 'custom',
    description: 'Milestone achievement in Computer Engineering diploma studies.',
    bgColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
  },
];

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const CalendarApp: React.FC = () => {
  const { theme } = useSettingsStore();

  const [isMounted, setIsMounted] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date(2026, 7, 11)); // Default to Aug 2026

  // In-memory cache for Indian holidays by year
  const holidayCache = useRef<Record<number, CalendarEvent[]>>({});

  // State
  const [holidays, setHolidays] = useState<CalendarEvent[]>([]);
  const [customEvents, setCustomEvents] = useState<CalendarEvent[]>(INITIAL_CUSTOM_EVENTS);

  // Modals
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedDateForAdd, setSelectedDateForAdd] = useState('');
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDesc, setNewEventDesc] = useState('');

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Fetch Indian Public Holidays with year caching & dataset fallback
  const fetchHolidaysForYear = useCallback(async (year: number) => {
    if (holidayCache.current[year]) {
      setHolidays(holidayCache.current[year]);
      return;
    }

    let rawHolidays: any[] = [];

    try {
      const res = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/IN`);
      if (res.ok && res.status !== 204) {
        const text = await res.text();
        if (text && text.trim().length > 0) {
          rawHolidays = JSON.parse(text);
        }
      }
    } catch (err) {
      console.log('Using Indian Holidays dataset for year:', year);
    }

    if (!rawHolidays || rawHolidays.length === 0) {
      rawHolidays = INDIAN_HOLIDAYS_BASE.map((h) => ({
        date: `${year}${h.date}`,
        localName: h.localName,
        name: h.name,
      }));
    }

    const formattedHolidays: CalendarEvent[] = rawHolidays.map((holiday: any) => ({
      id: `holiday-${holiday.date}-${holiday.name}`,
      title: `🇮🇳 ${holiday.localName || holiday.name}`,
      start: holiday.date,
      type: 'holiday',
      globalName: holiday.name,
      description: `Official Indian Public Holiday (${holiday.localName || holiday.name})`,
      bgColor: 'bg-red-500/20 text-red-300 border-red-500/40',
    }));

    holidayCache.current[year] = formattedHolidays;
    setHolidays(formattedHolidays);
  }, []);

  useEffect(() => {
    fetchHolidaysForYear(currentYear);
  }, [currentYear, fetchHolidaysForYear]);

  const allEvents = [...holidays, ...customEvents];

  const getEventsForDate = (dateStr: string) => {
    return allEvents.filter((ev) => ev.start === dateStr);
  };

  const prevMonth = () => setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  const goToToday = () => setCurrentDate(new Date());

  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();
  const totalGridCells = Math.ceil((firstDayIndex + daysInMonth) / 7) * 7;

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle.trim() || !selectedDateForAdd) return;

    const newEv: CalendarEvent = {
      id: `user-${Date.now()}`,
      title: `⭐ ${newEventTitle.trim()}`,
      start: selectedDateForAdd,
      type: 'custom',
      description: newEventDesc.trim() || 'Custom event',
      bgColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    };

    setCustomEvents((prev) => [...prev, newEv]);
    setIsAddModalOpen(false);
    setNewEventTitle('');
    setNewEventDesc('');
  };

  const isToday = (dayNum: number) => {
    const today = new Date();
    return (
      today.getDate() === dayNum &&
      today.getMonth() === currentMonth &&
      today.getFullYear() === currentYear
    );
  };

  if (!isMounted) return null;

  return (
    <div
      className={`h-full flex flex-col font-sans select-text overflow-hidden transition-colors ${
        theme === 'light' ? 'bg-white text-slate-900' : 'bg-slate-950 text-slate-100'
      }`}
    >
      {/* Clean Minimal Header */}
      <div
        className={`h-14 px-6 border-b flex items-center justify-between shrink-0 ${
          theme === 'light' ? 'border-slate-200 bg-slate-50' : 'border-white/10 bg-slate-900/60'
        }`}
      >
        {/* Left: App Title */}
        <div className="flex items-center gap-2.5">
          <CalendarIcon size={20} className="text-red-500" />
          <h2 className="text-base font-bold tracking-tight">Calendar</h2>
        </div>

        {/* Center: Month Navigation */}
        <div className="flex items-center gap-3">
          <button
            onClick={prevMonth}
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <ChevronLeft size={18} />
          </button>

          <span className="text-sm font-bold text-white tracking-wide min-w-[140px] text-center">
            {MONTHS[currentMonth]} {currentYear}
          </span>

          <button
            onClick={nextMonth}
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <ChevronRight size={18} />
          </button>

          <button
            onClick={goToToday}
            className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold transition-colors text-slate-200"
          >
            Today
          </button>
        </div>

        {/* Right: Add Event Button */}
        <button
          onClick={() => {
            setSelectedDateForAdd(new Date().toISOString().split('T')[0]);
            setIsAddModalOpen(true);
          }}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all shadow-md shadow-blue-600/20 cursor-pointer"
        >
          <Plus size={15} />
          <span>Add Event</span>
        </button>
      </div>

      {/* Clean Calendar Grid */}
      <div className="flex-1 p-4 md:p-6 overflow-y-auto custom-scrollbar flex flex-col">
        {/* Day Names Row */}
        <div className="grid grid-cols-7 mb-2 text-center text-xs font-semibold text-slate-400 border-b border-white/10 pb-2">
          {DAYS.map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 flex-1 gap-2 auto-rows-fr">
          {Array.from({ length: totalGridCells }).map((_, index) => {
            const dayOffset = index - firstDayIndex + 1;
            const isCurrentMonthDay = dayOffset > 0 && dayOffset <= daysInMonth;

            let dayNum = dayOffset;
            let cellMonth = currentMonth;
            let cellYear = currentYear;

            if (dayOffset <= 0) {
              dayNum = prevMonthDays + dayOffset;
              cellMonth = currentMonth - 1;
            } else if (dayOffset > daysInMonth) {
              dayNum = dayOffset - daysInMonth;
              cellMonth = currentMonth + 1;
            }

            const cellDate = new Date(cellYear, cellMonth, dayNum);
            const dateStr = `${cellDate.getFullYear()}-${String(
              cellDate.getMonth() + 1
            ).padStart(2, '0')}-${String(cellDate.getDate()).padStart(2, '0')}`;

            const dayEvents = getEventsForDate(dateStr);
            const isTodayCell = isCurrentMonthDay && isToday(dayNum);

            return (
              <div
                key={index}
                onClick={() => {
                  setSelectedDateForAdd(dateStr);
                  setIsAddModalOpen(true);
                }}
                className={`min-h-[85px] p-2 rounded-2xl border flex flex-col transition-all cursor-pointer ${
                  isCurrentMonthDay
                    ? theme === 'light'
                      ? 'bg-slate-50 border-slate-200 hover:border-blue-400'
                      : 'bg-slate-900/50 border-white/10 hover:border-blue-500/50'
                    : 'opacity-20 bg-transparent border-transparent'
                } ${isTodayCell ? 'ring-2 ring-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/10' : ''}`}
              >
                {/* Date Header */}
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                      isTodayCell
                        ? 'bg-blue-500 text-white font-extrabold'
                        : isCurrentMonthDay
                        ? 'text-slate-200'
                        : 'text-slate-500'
                    }`}
                  >
                    {dayNum}
                  </span>
                </div>

                {/* Events list */}
                <div className="flex-1 space-y-1 overflow-y-auto no-scrollbar">
                  {dayEvents.map((ev) => (
                    <div
                      key={ev.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedEvent(ev);
                      }}
                      className={`text-[11px] font-medium px-2 py-0.5 rounded-lg border truncate transition-transform hover:scale-[1.02] ${ev.bgColor}`}
                    >
                      {ev.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Event Details Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-[9990] bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl p-6 shadow-2xl border bg-slate-900 border-white/15 text-white">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                {selectedEvent.type === 'holiday' ? (
                  <>
                    <Flag size={16} className="text-red-400" /> Indian Public Holiday
                  </>
                ) : (
                  <>
                    <Sparkles size={16} className="text-blue-400" /> Portfolio Event
                  </>
                )}
              </span>
              <button
                onClick={() => setSelectedEvent(null)}
                className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <h3 className="text-lg font-bold mb-1">{selectedEvent.title}</h3>
            <div className="text-xs font-mono text-blue-400 mb-4">Date: {selectedEvent.start}</div>

            {selectedEvent.description && (
              <p className="text-xs text-slate-300 leading-relaxed p-3.5 rounded-xl bg-white/5 border border-white/10 mb-4">
                {selectedEvent.description}
              </p>
            )}

            <button
              onClick={() => setSelectedEvent(null)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Add Event Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[9990] bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl p-6 shadow-2xl border bg-slate-900 border-white/15 text-white">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                <Plus size={14} /> Add Event
              </span>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Date</label>
                <input
                  type="date"
                  required
                  value={selectedDateForAdd}
                  onChange={(e) => setSelectedDateForAdd(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-white/15 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Event Title *</label>
                <input
                  type="text"
                  required
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  placeholder="Meeting / Hackathon..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-white/15 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={newEventDesc}
                  onChange={(e) => setNewEventDesc(e.target.value)}
                  placeholder="Event details..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-white/15 text-xs text-white focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="w-1/2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white shadow-md shadow-blue-600/30 cursor-pointer"
                >
                  Create Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
