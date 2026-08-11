'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSystemStore } from '../../store/useSystemStore';
import { Settings, ChevronLeft, ChevronRight } from 'lucide-react';

export const Clock: React.FC = () => {
  const { isCalendarOpen, toggleCalendar } = useSystemStore();
  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'weekly' | 'monthly'>('weekly');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setDateStr(now.toLocaleDateString([], { month: 'numeric', day: 'numeric', year: 'numeric' }));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const monthName = selectedDate.toLocaleDateString('en-US', { month: 'long' });
  const dayNumber = selectedDate.getDate();

  // Helper for 7 week dates
  const getWeekDates = (date: Date) => {
    const current = new Date(date);
    const firstDayOfWeek = current.getDate() - current.getDay();
    const week = [];
    for (let i = 0; i < 7; i++) {
      week.push(new Date(current.setDate(firstDayOfWeek + i)));
    }
    return week;
  };

  const weekDates = getWeekDates(selectedDate);

  const daysInMonth = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const startDayOfMonth = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const totalDays = daysInMonth(selectedDate);
  const startOffset = startDayOfMonth(selectedDate);

  const handlePrevMonth = () => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1));
  };
  const handleNextMonth = () => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1));
  };

  return (
    <div className="relative select-none">
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleCalendar();
        }}
        className={`px-3 py-1.5 rounded-xl text-right transition-all flex flex-col justify-center ${
          isCalendarOpen ? 'bg-cyan-500/25 border border-cyan-400/40' : 'hover:bg-white/10'
        }`}
      >
        <span className="text-xs font-semibold text-white leading-none">{timeStr}</span>
        <span className="text-[10px] text-slate-300 font-mono mt-0.5">{dateStr}</span>
      </button>

      {/* Calendar Taskbar Flyout Modal */}
      <AnimatePresence>
        {isCalendarOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-14 right-0 w-80 rounded-[28px] p-5 text-white shadow-2xl z-[9990] font-sans"
            style={{
              background: 'linear-gradient(145deg, rgba(30, 45, 35, 0.9) 0%, rgba(15, 23, 20, 0.95) 100%)',
              backdropFilter: 'blur(40px) saturate(1.8)',
              WebkitBackdropFilter: 'blur(40px) saturate(1.8)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
            }}
          >
            {/* Top Bar Switcher */}
            <div className="flex items-center justify-between gap-2 mb-4">
              <div className="bg-black/30 backdrop-blur-md p-1 rounded-2xl flex items-center border border-white/10">
                <button
                  onClick={() => setViewMode('weekly')}
                  className={`px-4 py-1.5 rounded-xl text-[11px] font-semibold transition-all ${
                    viewMode === 'weekly' ? 'bg-white text-slate-950 shadow-md font-bold' : 'text-white/70 hover:text-white'
                  }`}
                >
                  Weekly
                </button>
                <button
                  onClick={() => setViewMode('monthly')}
                  className={`px-4 py-1.5 rounded-xl text-[11px] font-semibold transition-all ${
                    viewMode === 'monthly' ? 'bg-white text-slate-950 shadow-md font-bold' : 'text-white/70 hover:text-white'
                  }`}
                >
                  Monthly
                </button>
              </div>

              <button
                onClick={() => setViewMode((prev) => (prev === 'weekly' ? 'monthly' : 'weekly'))}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-white/80 transition-all"
              >
                <Settings size={15} />
              </button>
            </div>

            {/* Month & Big Date Header */}
            <div className="flex items-baseline justify-between mb-5 px-1">
              <div className="flex items-center gap-1">
                <h1 className="text-4xl font-light tracking-tight text-white">{monthName}</h1>
                {viewMode === 'monthly' && (
                  <div className="flex items-center ml-1">
                    <button onClick={handlePrevMonth} className="p-1 text-white/70 hover:text-white">
                      <ChevronLeft size={16} />
                    </button>
                    <button onClick={handleNextMonth} className="p-1 text-white/70 hover:text-white">
                      <ChevronRight size={16} />
                    </button>
                  </div>
                )}
              </div>
              <span className="text-4xl font-light text-white font-mono">{dayNumber}</span>
            </div>

            {/* Weekly / Monthly Grid */}
            {viewMode === 'weekly' ? (
              <div>
                <div className="grid grid-cols-7 text-center text-[10px] font-medium text-white/50 mb-2">
                  <span>S</span>
                  <span>M</span>
                  <span>T</span>
                  <span>W</span>
                  <span>T</span>
                  <span>F</span>
                  <span>S</span>
                </div>

                <div className="grid grid-cols-7 text-center items-center justify-items-center">
                  {weekDates.map((d) => {
                    const isToday =
                      d.getDate() === selectedDate.getDate() &&
                      d.getMonth() === selectedDate.getMonth() &&
                      d.getFullYear() === selectedDate.getFullYear();

                    return (
                      <div
                        key={d.toISOString()}
                        onClick={() => setSelectedDate(d)}
                        className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-semibold cursor-pointer transition-all ${
                          isToday ? 'bg-white text-slate-950 font-bold shadow-md' : 'text-white/90 hover:bg-white/15'
                        }`}
                      >
                        {d.getDate()}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div>
                <div className="grid grid-cols-7 text-center text-[10px] font-medium text-white/50 mb-1">
                  <span>S</span>
                  <span>M</span>
                  <span>T</span>
                  <span>W</span>
                  <span>T</span>
                  <span>F</span>
                  <span>S</span>
                </div>

                <div className="grid grid-cols-7 text-center gap-1 text-xs">
                  {Array.from({ length: startOffset }).map((_, i) => (
                    <div key={`empty-${i}`} className="h-7" />
                  ))}
                  {Array.from({ length: totalDays }).map((_, i) => {
                    const dayNum = i + 1;
                    const isToday = dayNum === selectedDate.getDate();

                    return (
                      <div
                        key={dayNum}
                        onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), dayNum))}
                        className={`h-7 rounded-lg flex items-center justify-center font-medium cursor-pointer transition-all ${
                          isToday ? 'bg-white text-slate-950 font-bold shadow-md' : 'hover:bg-white/15 text-white/90'
                        }`}
                      >
                        {dayNum}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
