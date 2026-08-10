'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
];

export const CalendarApp: React.FC = () => {
  const [now, setNow] = useState(new Date());
  const [viewDate, setViewDate] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(id);
  }, []);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const isToday = (d: number) =>
    d === now.getDate() && month === now.getMonth() && year === now.getFullYear();

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div className="h-full flex flex-col items-center justify-start bg-white font-sans select-none p-4 overflow-auto">
      {/* Header */}
      <div className="w-full max-w-sm">
        {/* Month Nav */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={prevMonth}
            className="p-2 rounded-full hover:bg-slate-100 transition-colors"
          >
            <ChevronLeft size={20} className="text-slate-600" />
          </button>
          <div className="text-center">
            <div className="text-xl font-bold text-slate-900">
              {MONTHS[month]}
            </div>
            <div className="text-sm text-slate-500">{year}</div>
          </div>
          <button
            onClick={nextMonth}
            className="p-2 rounded-full hover:bg-slate-100 transition-colors"
          >
            <ChevronRight size={20} className="text-slate-600" />
          </button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 mb-2">
          {DAYS.map((d) => (
            <div key={d} className="text-center text-[11px] font-semibold text-slate-400 py-1">
              {d}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-y-1">
          {cells.map((day, i) => (
            <div
              key={i}
              className="flex items-center justify-center h-9"
            >
              {day !== null && (
                <div
                  className={`w-9 h-9 flex items-center justify-center rounded-full text-sm font-medium transition-colors cursor-default ${
                    isToday(day)
                      ? 'bg-red-500 text-white font-bold'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {day}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Today info */}
        <div className="mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
          <div className="text-sm text-slate-500">Today</div>
          <div className="text-2xl font-bold text-red-500 mt-1">
            {DAYS[now.getDay()]}, {MONTHS[now.getMonth()]} {now.getDate()}
          </div>
          <div className="text-sm text-slate-400 mt-1">
            {now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    </div>
  );
};
