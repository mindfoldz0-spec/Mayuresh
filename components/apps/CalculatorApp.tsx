'use client';

import React, { useState, useEffect } from 'react';
import { Delete, RotateCcw } from 'lucide-react';

export const CalculatorApp: React.FC = () => {
  const [display, setDisplay] = useState<string>('0');
  const [formula, setFormula] = useState<string>('');
  const [isEvaluated, setIsEvaluated] = useState<boolean>(false);

  const handleDigit = (digit: string) => {
    if (isEvaluated) {
      setDisplay(digit);
      setFormula(digit);
      setIsEvaluated(false);
      return;
    }
    if (display === '0' && digit !== '.') {
      setDisplay(digit);
      setFormula(digit);
    } else {
      if (digit === '.' && display.includes('.')) return;
      setDisplay(display + digit);
      setFormula(formula + digit);
    }
  };

  const handleOperator = (op: string) => {
    setIsEvaluated(false);
    if (formula === '' && display === '0') {
      setFormula('0 ' + op + ' ');
    } else {
      setFormula(formula + ' ' + op + ' ');
    }
    setDisplay('0');
  };

  const handleClear = () => {
    setDisplay('0');
    setFormula('');
    setIsEvaluated(false);
  };

  const handleBackspace = () => {
    if (isEvaluated) {
      handleClear();
      return;
    }
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
      setFormula(formula.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  const handleEvaluate = () => {
    try {
      // Safe evaluation of basic math expressions
      const sanitized = formula.replace(/×/g, '*').replace(/÷/g, '/');
      // eslint-disable-next-line no-eval
      const result = eval(sanitized);
      const formatted = Number.isInteger(result) ? String(result) : String(Number(result.toFixed(4)));
      setDisplay(formatted);
      setFormula(formula + ' = ' + formatted);
      setIsEvaluated(true);
    } catch {
      setDisplay('Error');
    }
  };

  // Keyboard handler for numpad
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (/\d/.test(e.key)) handleDigit(e.key);
      else if (e.key === '.') handleDigit('.');
      else if (e.key === '+') handleOperator('+');
      else if (e.key === '-') handleOperator('-');
      else if (e.key === '*') handleOperator('×');
      else if (e.key === '/') handleOperator('÷');
      else if (e.key === 'Enter' || e.key === '=') handleEvaluate();
      else if (e.key === 'Backspace') handleBackspace();
      else if (e.key === 'Escape') handleClear();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [display, formula, isEvaluated]);

  return (
    <div className="flex flex-col h-full bg-slate-950 p-4 select-none font-sans text-white">
      {/* Display Screen */}
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-4 mb-4 flex flex-col justify-end items-end h-28 shadow-inner">
        <div className="text-xs text-slate-400 font-mono h-5 overflow-hidden text-right">
          {formula}
        </div>
        <div className="text-3xl font-bold font-mono tracking-tight text-cyan-300 mt-1 truncate max-w-full">
          {display}
        </div>
      </div>

      {/* Calculator Buttons Grid */}
      <div className="grid grid-cols-4 gap-2 flex-1">
        <button
          onClick={handleClear}
          className="p-3 rounded-xl bg-red-500/20 text-red-300 hover:bg-red-500/30 font-bold text-sm transition-colors border border-red-500/30"
        >
          C
        </button>
        <button
          onClick={handleBackspace}
          className="p-3 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 flex items-center justify-center transition-colors"
        >
          <Delete size={18} />
        </button>
        <button
          onClick={() => handleOperator('%')}
          className="p-3 rounded-xl bg-white/10 hover:bg-white/15 text-cyan-400 font-bold text-sm transition-colors"
        >
          %
        </button>
        <button
          onClick={() => handleOperator('÷')}
          className="p-3 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-bold text-base transition-colors border border-cyan-500/30"
        >
          ÷
        </button>

        {/* Number Buttons */}
        {['7', '8', '9'].map((num) => (
          <button
            key={num}
            onClick={() => handleDigit(num)}
            className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 font-bold text-base transition-colors"
          >
            {num}
          </button>
        ))}
        <button
          onClick={() => handleOperator('×')}
          className="p-3 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-bold text-base transition-colors border border-cyan-500/30"
        >
          ×
        </button>

        {['4', '5', '6'].map((num) => (
          <button
            key={num}
            onClick={() => handleDigit(num)}
            className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 font-bold text-base transition-colors"
          >
            {num}
          </button>
        ))}
        <button
          onClick={() => handleOperator('-')}
          className="p-3 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-bold text-base transition-colors border border-cyan-500/30"
        >
          -
        </button>

        {['1', '2', '3'].map((num) => (
          <button
            key={num}
            onClick={() => handleDigit(num)}
            className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 font-bold text-base transition-colors"
          >
            {num}
          </button>
        ))}
        <button
          onClick={() => handleOperator('+')}
          className="p-3 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-bold text-base transition-colors border border-cyan-500/30"
        >
          +
        </button>

        <button
          onClick={() => handleDigit('0')}
          className="col-span-2 p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 font-bold text-base transition-colors"
        >
          0
        </button>
        <button
          onClick={() => handleDigit('.')}
          className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 font-bold text-base transition-colors"
        >
          .
        </button>
        <button
          onClick={handleEvaluate}
          className="p-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-base shadow-lg shadow-cyan-500/30 transition-all"
        >
          =
        </button>
      </div>
    </div>
  );
};
