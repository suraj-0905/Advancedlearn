import React, { useEffect, useState } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { ThemeMode } from '../types';

export const ThemeSwitcher: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    return (localStorage.getItem('adaptivelearn_theme') as ThemeMode) || 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    localStorage.setItem('adaptivelearn_theme', theme);

    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else if (theme === 'light') {
      root.classList.remove('dark');
      root.classList.add('light');
    } else {
      // System
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (systemDark) {
        root.classList.add('dark');
        root.classList.remove('light');
      } else {
        root.classList.remove('dark');
        root.classList.add('light');
      }
    }
  }, [theme]);

  return (
    <div
      id="theme-switcher-control"
      className={`flex items-center gap-1 p-1 rounded-xl bg-slate-800/60 dark:bg-slate-900/80 border border-slate-700/60 dark:border-cyan-500/20 text-xs ${className}`}
    >
      <button
        id="theme-btn-dark"
        onClick={() => setTheme('dark')}
        title="Deep Navy / Cyan Dark Theme"
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-medium transition-all ${
          theme === 'dark'
            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Moon className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Dark</span>
      </button>

      <button
        id="theme-btn-light"
        onClick={() => setTheme('light')}
        title="Light Educational Theme"
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-medium transition-all ${
          theme === 'light'
            ? 'bg-sky-500/20 text-sky-600 dark:text-sky-300 border border-sky-400/40 shadow-sm'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Sun className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Light</span>
      </button>

      <button
        id="theme-btn-system"
        onClick={() => setTheme('system')}
        title="Follow System Theme"
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-medium transition-all ${
          theme === 'system'
            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Monitor className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">System</span>
      </button>
    </div>
  );
};
