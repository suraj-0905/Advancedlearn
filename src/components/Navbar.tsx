import React from 'react';
import { Menu, CheckCircle2, Clock, Sparkles } from 'lucide-react';
import { ThemeSwitcher } from './ThemeSwitcher';
import { StudentProfile } from '../types';
import { DailyStreakCounter } from './DailyStreakCounter';

interface NavbarProps {
  onOpenMobileMenu: () => void;
  currentStudent: StudentProfile | null;
  onWhatShouldIStudyToday: () => void;
  justLoggedIn?: boolean;
  onClearJustLoggedIn?: () => void;
  onStreakChange?: (newStreak: number) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenMobileMenu,
  currentStudent,
  onWhatShouldIStudyToday,
  justLoggedIn = false,
  onClearJustLoggedIn,
  onStreakChange,
}) => {
  return (
    <header
      id="app-navbar"
      className="sticky top-0 z-30 w-full bg-slate-900/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-800 dark:border-cyan-500/20 px-4 lg:px-8 py-3 flex items-center justify-between gap-4"
    >
      <div className="flex items-center gap-3">
        <button
          id="btn-mobile-menu"
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 border border-slate-800"
          aria-label="Open Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-4 text-xs text-slate-400">
          {currentStudent && (
            <>
              <DailyStreakCounter
                student={currentStudent}
                variant="badge"
                justLoggedIn={justLoggedIn}
                onClearJustLoggedIn={onClearJustLoggedIn}
                onStreakChange={onStreakChange}
              />

              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/60 border border-slate-700/60">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                <strong className="text-slate-200">{currentStudent.totalQuestionsSolved}</strong> Solved
              </span>

              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/60 border border-slate-700/60 hidden md:flex">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <strong className="text-slate-200">{currentStudent.totalStudyMinutes}</strong> mins
              </span>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Core Hero CTA: "What Should I Study Today?" */}
        <button
          id="btn-nav-study-today"
          onClick={onWhatShouldIStudyToday}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 transition-all active:scale-95"
        >
          <Sparkles className="w-4 h-4 text-slate-950" />
          <span className="hidden xs:inline">What Should I Study Today?</span>
          <span className="xs:hidden">Study Today</span>
        </button>

        <ThemeSwitcher />
      </div>
    </header>
  );
};
