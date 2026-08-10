'use client';

import React, { useState, useRef, useCallback } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import {
  Calendar as CalendarIcon,
  Plus,
  AlertCircle,
  Sparkles,
  X,
  Flag,
  Check,
  RefreshCw,
} from 'lucide-react';
import { useSettingsStore } from '../../store/useSettingsStore';

// Initial Custom Portfolio & Milestone Events
const INITIAL_CUSTOM_EVENTS: any[] = [
  {
    id: 'portfolio-launch',
    title: '🚀 Portfolio Launch',
    start: '2026-08-20',
    allDay: true,
    backgroundColor: '#0284c7', // Cyan / Blue for portfolio launch
    borderColor: '#0369a1',
    textColor: '#ffffff',
    extendedProps: {
      type: 'custom',
      description: 'Official launch of Mayuresh Samel Windows OS Portfolio website.',
    },
  },
  {
    id: 'lost-dune-release',
    title: '🎮 Lost Dune Game Release',
    start: '2026-08-15',
    allDay: true,
    backgroundColor: '#7c3aed', // Purple for game release
    borderColor: '#6d28d9',
    textColor: '#ffffff',
    extendedProps: {
      type: 'custom',
      description: 'Release of 3rd year diploma project Lost Dune web game.',
    },
  },
  {
    id: 'diploma-engineering',
    title: '🎓 Diploma Engineering Milestone',
    start: '2026-08-05',
    allDay: true,
    backgroundColor: '#059669', // Emerald for education
    borderColor: '#047857',
    textColor: '#ffffff',
    extendedProps: {
      type: 'custom',
      description: 'Milestone achievement in Computer Engineering diploma studies.',
    },
  },
];

export const CalendarApp: React.FC = () => {
  const { theme } = useSettingsStore();

  // In-memory cache for Nager.Date Indian holidays by year { [year: number]: any[] }
  const holidayCache = useRef<Record<number, any[]>>({});

  // State management
  const [displayedYear, setDisplayedYear] = useState<number | null>(null);
  const [holidays, setHolidays] = useState<any[]>([]);
  const [customEvents, setCustomEvents] = useState<any[]>(INITIAL_CUSTOM_EVENTS);
  const [isLoadingHolidays, setIsLoadingHolidays] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Selected event modal details
  const [selectedEvent, setSelectedEvent] = useState<{
    title: string;
    date: string;
    type: string;
    globalName?: string;
    description?: string;
  } | null>(null);

  // Add event modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedDateForAdd, setSelectedDateForAdd] = useState('');
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDesc, setNewEventDesc] = useState('');

  // Fetch Indian Public Holidays from Nager.Date API with year caching
  const fetchHolidaysForYear = useCallback(async (year: number) => {
    // Check in-memory cache first
    if (holidayCache.current[year]) {
      setHolidays(holidayCache.current[year]);
      setApiError(null);
      return;
    }

    setIsLoadingHolidays(true);
    setApiError(null);

    try {
      // Nager.Date API (Public, No Key Required, IN = India)
      const res = await fetch(`https://date.nager.at/api/v4/PublicHolidays/${year}/IN`);

      if (!res.ok) {
        throw new Error(`API responded with status ${res.status}`);
      }

      const data = await res.json();

      // Convert Nager.Date response to FullCalendar event format
      const formattedHolidays: any[] = data.map((holiday: any) => ({
        id: `holiday-${holiday.date}-${holiday.name}`,
        title: `🇮🇳 ${holiday.localName || holiday.name}`,
        start: holiday.date,
        allDay: true,
        backgroundColor: '#dc2626', // Red accent for Indian national holidays
        borderColor: '#b91c1c',
        textColor: '#ffffff',
        extendedProps: {
          type: 'holiday',
          globalName: holiday.name,
          localName: holiday.localName,
          countryCode: holiday.countryCode,
        },
      }));

      // Cache the result for this year
      holidayCache.current[year] = formattedHolidays;
      setHolidays(formattedHolidays);
    } catch (err) {
      console.warn(`Failed to fetch Indian holidays for ${year} from Nager.Date:`, err);
      setApiError(`Holiday data for ${year} unavailable`);
    } finally {
      setIsLoadingHolidays(false);
    }
  }, []);

  // Handle FullCalendar dates set (triggered on view & year changes)
  const handleDatesSet = (dateInfo: any) => {
    // Determine displayed year from mid-date of the view
    const currentYear = dateInfo.view.currentStart.getFullYear();

    if (currentYear !== displayedYear) {
      setDisplayedYear(currentYear);
      fetchHolidaysForYear(currentYear);
    }
  };

  // Handle click on event
  const handleEventClick = (clickInfo: any) => {
    const ev = clickInfo.event;
    const type = ev.extendedProps?.type || 'custom';

    setSelectedEvent({
      title: ev.title,
      date: ev.startStr || ev.start?.toISOString().split('T')[0] || '',
      type,
      globalName: ev.extendedProps?.globalName,
      description: ev.extendedProps?.description,
    });
  };

  // Handle click on date cell to add custom event
  const handleDateClick = (arg: any) => {
    setSelectedDateForAdd(arg.dateStr);
    setIsAddModalOpen(true);
  };

  // Handle creation of new user custom event
  const handleCreateCustomEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle.trim() || !selectedDateForAdd) return;

    const newEv: any = {
      id: `user-${Date.now()}`,
      title: `⭐ ${newEventTitle.trim()}`,
      start: selectedDateForAdd,
      allDay: true,
      backgroundColor: '#0284c7',
      borderColor: '#0369a1',
      textColor: '#ffffff',
      extendedProps: {
        type: 'custom',
        description: newEventDesc.trim() || 'User created event',
      },
    };

    setCustomEvents((prev) => [...prev, newEv]);
    setIsAddModalOpen(false);
    setNewEventTitle('');
    setNewEventDesc('');
  };

  // Combine Nager.Date Indian holidays + Custom events
  const allCalendarEvents = [...holidays, ...customEvents];

  return (
    <div
      className={`h-full flex flex-col font-sans select-text overflow-hidden transition-colors ${
        theme === 'light' ? 'bg-slate-50 text-slate-800' : 'bg-slate-950 text-slate-100'
      }`}
    >
      {/* Calendar Header Bar */}
      <div
        className={`h-14 px-4 border-b flex items-center justify-between shrink-0 ${
          theme === 'light'
            ? 'bg-white border-slate-200 shadow-sm'
            : 'bg-slate-900/90 border-white/10'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-red-500/15 border border-red-500/30 text-red-500">
            <CalendarIcon size={20} />
          </div>
          <div>
            <h2 className="text-base font-bold tracking-tight">Calendar</h2>
            <p className="text-[11px] opacity-60 font-mono">
              India Public Holidays (Nager.Date) + Custom Milestones
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Status Indicator */}
          {isLoadingHolidays ? (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-mono">
              <RefreshCw size={12} className="animate-spin" />
              <span>Fetching Indian Holidays...</span>
            </div>
          ) : apiError ? (
            <div
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 text-amber-400 text-xs font-mono cursor-pointer"
              onClick={() => displayedYear && fetchHolidaysForYear(displayedYear)}
              title="Click to retry loading Indian holidays"
            >
              <AlertCircle size={12} />
              <span>{apiError} (Retry)</span>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-mono">
              <Check size={12} />
              <span>India ({displayedYear}) Sync Active</span>
            </div>
          )}

          {/* Add Custom Event Button */}
          <button
            onClick={() => {
              setSelectedDateForAdd(new Date().toISOString().split('T')[0]);
              setIsAddModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all shadow-md shadow-blue-600/20 cursor-pointer"
          >
            <Plus size={15} />
            <span>Add Event</span>
          </button>
        </div>
      </div>

      {/* Main FullCalendar Area */}
      <div className="flex-1 p-4 overflow-y-auto custom-scrollbar relative">
        <FullCalendar
          plugins={[dayGridPlugin as any, timeGridPlugin as any, interactionPlugin as any]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay',
          }}
          editable={false}
          selectable={true}
          events={allCalendarEvents}
          datesSet={handleDatesSet}
          eventClick={handleEventClick}
          dateClick={handleDateClick}
          height="100%"
          aspectRatio={1.6}
        />
      </div>

      {/* Event Details Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-[9990] bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div
            className={`w-full max-w-md rounded-2xl p-6 shadow-2xl border ${
              theme === 'light'
                ? 'bg-white border-slate-200 text-slate-800'
                : 'bg-slate-900 border-white/15 text-white'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <div className="flex items-center gap-2">
                {selectedEvent.type === 'holiday' ? (
                  <Flag size={18} className="text-red-500" />
                ) : (
                  <Sparkles size={18} className="text-cyan-400" />
                )}
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {selectedEvent.type === 'holiday' ? 'Indian Public Holiday' : 'Portfolio Event'}
                </span>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <h3 className="text-xl font-bold mb-2">{selectedEvent.title}</h3>
            <div className="text-xs font-mono text-cyan-400 mb-4">Date: {selectedEvent.date}</div>

            {selectedEvent.globalName && (
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs mb-3">
                <span className="text-slate-400">Global Name: </span>
                <span className="font-semibold">{selectedEvent.globalName}</span>
              </div>
            )}

            {selectedEvent.description && (
              <p className="text-xs opacity-80 leading-relaxed p-3 rounded-xl bg-white/5 border border-white/10 mb-4">
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

      {/* Add Custom Event Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[9990] bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div
            className={`w-full max-w-md rounded-2xl p-6 shadow-2xl border ${
              theme === 'light'
                ? 'bg-white border-slate-200 text-slate-800'
                : 'bg-slate-900 border-white/15 text-white'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <Plus size={14} /> Add Custom Event
              </span>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateCustomEvent} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Date</label>
                <input
                  type="date"
                  required
                  value={selectedDateForAdd}
                  onChange={(e) => setSelectedDateForAdd(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800/80 border border-white/15 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">
                  Event Title *
                </label>
                <input
                  type="text"
                  required
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  placeholder="Hackathon Demo / Interview..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-800/80 border border-white/15 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={newEventDesc}
                  onChange={(e) => setNewEventDesc(e.target.value)}
                  placeholder="Event details..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-800/80 border border-white/15 text-xs text-white focus:outline-none focus:border-blue-500 resize-none"
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
