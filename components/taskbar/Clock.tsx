'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSystemStore } from '../../store/useSystemStore';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

export const Clock: React.FC = () => {
  const { isCalendarOpen, toggleCalendar } = useSystemStore();
  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date());

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

  const daysInMonth = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const startDayOfMonth = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };
  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const totalDays = daysInMonth(currentMonth);
  const offset = startDayOfMonth(currentMonth);
  const today = new Date();

  return (
    <div className="relative">
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

      {/* Calendar Flyout Modal */}
      <AnimatePresence>
        {isCalendarOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-14 right-0 w-80 bg-slate-900/90 backdrop-blur-2xl border border-white/15 rounded-2xl shadow-2xl p-4 text-white z-[9990] font-sans"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <CalendarIcon size={16} className="text-cyan-400" />
                <span className="text-sm font-semibold">
                  {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={handlePrevMonth}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={handleNextMonth}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* Days Header */}
            <div className="grid grid-cols-7 gap-1 text-center text-[11px] text-slate-400 font-medium mb-2">
              <span>Su</span>
              <span>Mo</span>
              <span>Tu</span>
              <span>We</span>
              <span>Th</span>
              <span>Fr</span>
              <span>Sa</span>
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1 text-center text-xs">
              {Array.from({ length: offset }).map((_, i) => (
                <div key={`empty-${i}`} className="p-2" />
              ))}
              {Array.from({ length: totalDays }).map((_, i) => {
                const dayNum = i + 1;
                const isToday =
                  today.getDate() === dayNum &&
                  today.getMonth() === currentMonth.getMonth() &&
                  today.getFullYear() === currentMonth.getFullYear();

                return (
                  <div
                    key={dayNum}
                    className={`p-2 rounded-lg font-medium cursor-pointer transition-all ${
                      isToday
                        ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/30'
                        : 'hover:bg-white/10 text-slate-200'
                    }`}
                  >
                    {dayNum}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
