import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Flame,
  Calendar,
  Trophy,
  CheckCircle2,
  Sparkles,
  Zap,
  ChevronRight,
  X,
  PlusCircle,
  Award,
} from 'lucide-react';
import { StudentProfile } from '../types';

export interface StreakInfo {
  currentStreak: number;
  longestStreak: number;
  lastStudyDate: string; // YYYY-MM-DD
  activeDates: string[]; // List of YYYY-MM-DD
  todayCompleted: boolean;
}

interface DailyStreakCounterProps {
  student: StudentProfile;
  variant?: 'badge' | 'card' | 'celebration-toast';
  justLoggedIn?: boolean;
  onClearJustLoggedIn?: () => void;
  onStreakChange?: (newStreak: number) => void;
  className?: string;
}

// Helper to get formatted date string 'YYYY-MM-DD'
const getDayString = (offsetDays: number = 0): string => {
  const d = new Date();
  d.setDate(d.getDate() - offsetDays);
  return d.toISOString().split('T')[0];
};

// Initialize or retrieve streak data for a student
export const getStudentStreakData = (
  studentId: string,
  baselineStreak: number = 5
): StreakInfo => {
  const storageKey = `adaptivelearn_streak_${studentId}`;
  const stored = localStorage.getItem(storageKey);

  const today = getDayString(0);
  const yesterday = getDayString(1);

  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      // Validate consecutive logic
      const lastDate = parsed.lastStudyDate || yesterday;
      const todayDone = parsed.activeDates?.includes(today) || lastDate === today;

      let currentStreak = parsed.currentStreak || baselineStreak;
      // If gap > 1 day and not completed today, streak would reset
      const lastDateTime = new Date(lastDate).getTime();
      const yesterdayTime = new Date(yesterday).getTime();
      const dayDiff = Math.round((yesterdayTime - lastDateTime) / 86400000);

      if (dayDiff > 1 && !todayDone) {
        currentStreak = 1;
      }

      return {
        currentStreak,
        longestStreak: Math.max(parsed.longestStreak || currentStreak, currentStreak),
        lastStudyDate: lastDate,
        activeDates: parsed.activeDates || [yesterday, today],
        todayCompleted: todayDone,
      };
    } catch (e) {
      console.error('Error parsing streak data:', e);
    }
  }

  // Baseline initialization: synthesize recent consecutive days based on baselineStreak
  const activeDates: string[] = [];
  for (let i = 0; i < Math.min(baselineStreak, 14); i++) {
    activeDates.push(getDayString(i));
  }

  const initialData: StreakInfo = {
    currentStreak: baselineStreak,
    longestStreak: Math.max(baselineStreak, baselineStreak + 3),
    lastStudyDate: today,
    activeDates,
    todayCompleted: true,
  };

  localStorage.setItem(storageKey, JSON.stringify(initialData));
  return initialData;
};

// Save streak data
export const saveStudentStreakData = (studentId: string, data: StreakInfo) => {
  const storageKey = `adaptivelearn_streak_${studentId}`;
  localStorage.setItem(storageKey, JSON.stringify(data));
};

export const DailyStreakCounter: React.FC<DailyStreakCounterProps> = ({
  student,
  variant = 'badge',
  justLoggedIn = false,
  onClearJustLoggedIn,
  onStreakChange,
  className = '',
}) => {
  const [streakData, setStreakData] = useState<StreakInfo>(() =>
    getStudentStreakData(student.id, student.currentStreak || 5)
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showGlowCelebration, setShowGlowCelebration] = useState(false);
  const [celebrationToastVisible, setCelebrationToastVisible] = useState(false);

  // Sync when student changes
  useEffect(() => {
    const data = getStudentStreakData(student.id, student.currentStreak || 5);
    setStreakData(data);
  }, [student.id, student.currentStreak]);

  // Handle Glowing Animation Trigger upon User Login
  useEffect(() => {
    if (justLoggedIn) {
      setShowGlowCelebration(true);
      setCelebrationToastVisible(true);

      // Auto dismiss glowing toast after 6.5s
      const timer = setTimeout(() => {
        setCelebrationToastVisible(false);
        if (onClearJustLoggedIn) onClearJustLoggedIn();
      }, 6500);

      // Keep glowing halo on the badge for 10s
      const glowTimer = setTimeout(() => {
        setShowGlowCelebration(false);
      }, 10000);

      return () => {
        clearTimeout(timer);
        clearTimeout(glowTimer);
      };
    }
  }, [justLoggedIn, onClearJustLoggedIn]);

  // Record a study session for today
  const handleCheckInToday = () => {
    const today = getDayString(0);
    const updatedDates = streakData.activeDates.includes(today)
      ? streakData.activeDates
      : [...streakData.activeDates, today];

    const newStreak = streakData.todayCompleted
      ? streakData.currentStreak
      : streakData.currentStreak + 1;

    const newLongest = Math.max(streakData.longestStreak, newStreak);

    const updated: StreakInfo = {
      ...streakData,
      currentStreak: newStreak,
      longestStreak: newLongest,
      lastStudyDate: today,
      activeDates: updatedDates,
      todayCompleted: true,
    };

    setStreakData(updated);
    saveStudentStreakData(student.id, updated);
    if (onStreakChange) onStreakChange(newStreak);

    // Trigger glowing celebration
    setShowGlowCelebration(true);
    setTimeout(() => setShowGlowCelebration(false), 5000);
  };

  // Simulate consecutive next day for evaluation / testing
  const handleSimulateNextDay = () => {
    const newStreak = streakData.currentStreak + 1;
    const newLongest = Math.max(streakData.longestStreak, newStreak);
    const today = getDayString(0);

    const updated: StreakInfo = {
      ...streakData,
      currentStreak: newStreak,
      longestStreak: newLongest,
      lastStudyDate: today,
      todayCompleted: true,
    };

    setStreakData(updated);
    saveStudentStreakData(student.id, updated);
    if (onStreakChange) onStreakChange(newStreak);

    setShowGlowCelebration(true);
    setTimeout(() => setShowGlowCelebration(false), 4000);
  };

  // Calculate 7 days of the current week (Mon - Sun)
  const weekDays = [
    { label: 'M', dayOffset: 6 },
    { label: 'T', dayOffset: 5 },
    { label: 'W', dayOffset: 4 },
    { label: 'T', dayOffset: 3 },
    { label: 'F', dayOffset: 2 },
    { label: 'S', dayOffset: 1 },
    { label: 'S', dayOffset: 0 },
  ].map((item) => {
    const dateStr = getDayString(item.dayOffset);
    const isCompleted =
      streakData.activeDates.includes(dateStr) ||
      (item.dayOffset === 0 && streakData.todayCompleted);
    const isToday = item.dayOffset === 0;
    return {
      ...item,
      dateStr,
      isCompleted,
      isToday,
    };
  });

  // Next Milestone determination
  const milestones = [
    { days: 3, label: '3-Day Spark', reward: '+50 XP' },
    { days: 7, label: '7-Day Firestorm', reward: '+150 XP • Silver Badge' },
    { days: 14, label: '14-Day Memory Shield', reward: '+300 XP • Gold Badge' },
    { days: 30, label: '30-Day CSE Titan', reward: '+1000 XP • Master Halo' },
  ];

  const nextMilestone =
    milestones.find((m) => m.days > streakData.currentStreak) ||
    milestones[milestones.length - 1];

  const progressToNext = Math.min(
    100,
    Math.round((streakData.currentStreak / nextMilestone.days) * 100)
  );

  // -------------------------------------------------------------
  // VARIANT: CELEBRATION TOAST (Popped up when user logs in)
  // -------------------------------------------------------------
  if (variant === 'celebration-toast') {
    return (
      <AnimatePresence>
        {celebrationToastVisible && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="fixed top-16 right-4 sm:right-8 z-50 max-w-sm w-full p-4 rounded-3xl bg-slate-950/95 border-2 border-amber-500 shadow-[0_0_40px_rgba(245,158,11,0.45)] backdrop-blur-2xl"
          >
            {/* Glowing Amber Pulse Halo */}
            <div className="absolute inset-0 rounded-3xl pointer-events-none bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-yellow-500/20 animate-pulse" />

            <div className="relative z-10 flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="relative p-2.5 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950 shadow-lg shadow-amber-500/40 shrink-0">
                  <Flame className="w-6 h-6 animate-bounce text-slate-950" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-yellow-300 animate-ping" />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">
                      Login Streak Active
                    </span>
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  </div>
                  <h4 className="text-base font-extrabold text-white font-display">
                    {streakData.currentStreak} Day Study Streak!
                  </h4>
                  <p className="text-xs text-slate-300">
                    Welcome back, {student.name}. Your consecutive study momentum is blazing!
                  </p>
                </div>
              </div>

              <button
                onClick={() => setCelebrationToastVisible(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-900 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Action in Toast */}
            <div className="relative z-10 mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <button
                onClick={() => {
                  setCelebrationToastVisible(false);
                  setIsModalOpen(true);
                }}
                className="text-xs text-amber-300 hover:text-amber-200 font-semibold flex items-center gap-1"
              >
                <span>View Streak Timeline</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              <span className="text-[10px] text-slate-400 font-mono">
                Best: {streakData.longestStreak} days
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // -------------------------------------------------------------
  // VARIANT: CARD (For Dashboard Page Key Metrics)
  // -------------------------------------------------------------
  if (variant === 'card') {
    return (
      <div
        id="daily-streak-card"
        className={`relative p-4 rounded-2xl transition-all duration-300 ${
          showGlowCelebration
            ? 'bg-slate-900/90 border-2 border-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.5)]'
            : 'bg-slate-950/80 border border-amber-500/30 hover:border-amber-400/60 shadow-lg'
        } ${className}`}
      >
        {/* Subtle Ambient Glow Behind Card */}
        {showGlowCelebration && (
          <div className="absolute inset-0 rounded-2xl bg-amber-500/10 pointer-events-none animate-pulse" />
        )}

        <div className="relative z-10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span>Consecutive Study Streak</span>
            </span>

            {showGlowCelebration && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse">
                Blazing 🔥
              </span>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <motion.div
                animate={
                  showGlowCelebration
                    ? { scale: [1, 1.25, 1], rotate: [-4, 4, 0] }
                    : { scale: 1 }
                }
                transition={{ duration: 1.2, repeat: showGlowCelebration ? Infinity : 0 }}
                className="relative inline-flex p-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 shadow-md shadow-amber-500/30"
              >
                <Flame className="w-5 h-5 text-amber-400" />
              </motion.div>

              <span className="text-2xl sm:text-3xl font-black text-white font-display">
                {streakData.currentStreak}
              </span>
              <span className="text-xs font-bold text-amber-300">Days</span>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-800 text-[11px] font-medium transition-all hover:text-amber-300 hover:border-amber-500/30"
            >
              Details
            </button>
          </div>

          {/* 7-Day Mini Calendar Dots */}
          <div className="pt-1">
            <div className="flex items-center justify-between gap-1">
              {weekDays.map((d, idx) => (
                <div key={idx} className="flex flex-col items-center gap-1 flex-1">
                  <span className="text-[10px] text-slate-400 font-mono">{d.label}</span>
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold transition-all ${
                      d.isCompleted
                        ? 'bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950 shadow-sm shadow-amber-500/40 font-black'
                        : d.isToday
                        ? 'border border-dashed border-amber-400/60 text-amber-400 bg-amber-500/10'
                        : 'bg-slate-900 text-slate-400 border border-slate-800'
                    }`}
                    title={d.dateStr}
                  >
                    {d.isCompleted ? '✓' : ''}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Progress to Next Milestone */}
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">
              Next: <strong className="text-slate-200">{nextMilestone.label}</strong>
            </span>
            <span className="text-amber-400 font-semibold font-mono">
              {streakData.currentStreak}/{nextMilestone.days}d ({progressToNext}%)
            </span>
          </div>
        </div>

        {/* Details Modal */}
        {renderDetailsModal()}
      </div>
    );
  }

  // -------------------------------------------------------------
  // VARIANT: BADGE (Compact for Navbar)
  // -------------------------------------------------------------
  return (
    <>
      <button
        id="btn-navbar-streak"
        onClick={() => setIsModalOpen(true)}
        className={`group relative flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all duration-300 ${
          showGlowCelebration
            ? 'bg-slate-900 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.6)] ring-2 ring-amber-400/40 text-amber-300'
            : 'bg-slate-800/70 hover:bg-slate-800 border-slate-700/80 hover:border-amber-500/50 text-slate-300 hover:text-white'
        } ${className}`}
        title={`Consecutive Study Streak: ${streakData.currentStreak} Days (Click for timeline)`}
      >
        {/* Animated Glow Halo */}
        {showGlowCelebration && (
          <span className="absolute inset-0 rounded-xl bg-amber-500/20 animate-ping opacity-50 pointer-events-none" />
        )}

        <motion.div
          animate={
            showGlowCelebration
              ? { scale: [1, 1.35, 1], rotate: [-6, 6, 0] }
              : { scale: 1 }
          }
          transition={{ duration: 1.4, repeat: showGlowCelebration ? Infinity : 0 }}
          className="relative"
        >
          <Flame
            className={`w-4 h-4 transition-colors ${
              showGlowCelebration
                ? 'text-amber-400 filter drop-shadow-[0_0_8px_rgba(245,158,11,0.9)]'
                : 'text-amber-400 group-hover:text-amber-300'
            }`}
          />
        </motion.div>

        <div className="flex items-baseline gap-1 text-xs">
          <strong className="text-white font-bold font-display text-sm">
            {streakData.currentStreak}
          </strong>
          <span className="text-[11px] text-slate-400 group-hover:text-slate-300 font-medium">
            Streak
          </span>
        </div>

        {streakData.todayCompleted && (
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 ml-0.5" title="Studied Today" />
        )}
      </button>

      {/* Floating Celebration Toast on Login */}
      <AnimatePresence>
        {celebrationToastVisible && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-16 right-4 sm:right-8 z-50 max-w-sm p-4 rounded-3xl bg-slate-950/95 border-2 border-amber-400 shadow-[0_0_35px_rgba(245,158,11,0.5)] backdrop-blur-2xl"
          >
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950 shadow-lg shadow-amber-500/40 shrink-0">
                <Flame className="w-6 h-6 animate-bounce" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/30">
                  Daily Streak
                </span>
                <h4 className="text-sm font-extrabold text-white font-display">
                  {streakData.currentStreak} Consecutive Days!
                </h4>
                <p className="text-xs text-slate-300">
                  You logged in today! Your streak is on fire. Keep learning to reach your next milestone.
                </p>
              </div>
              <button
                onClick={() => setCelebrationToastVisible(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Details Modal */}
      {renderDetailsModal()}
    </>
  );

  // Renders the Interactive Streak Modal
  function renderDetailsModal() {
    return (
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative max-w-md w-full rounded-3xl bg-slate-900 border-2 border-amber-500/40 shadow-2xl p-6 space-y-6 text-slate-100"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    <Flame className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold font-display text-white">
                      Daily Study Streak
                    </h3>
                    <p className="text-xs text-slate-400">
                      Consecutive Days Learning Engine
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Main Glowing Counter Hero */}
              <div className="relative p-6 rounded-2xl bg-gradient-to-b from-slate-950 to-slate-900 border border-amber-500/30 text-center space-y-2 overflow-hidden shadow-inner">
                <div className="absolute inset-0 bg-amber-500/5 blur-xl pointer-events-none" />

                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="inline-flex p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-lg shadow-amber-500/30"
                >
                  <Flame className="w-8 h-8 text-amber-400" />
                </motion.div>

                <div>
                  <span className="text-4xl sm:text-5xl font-black text-white font-display">
                    {streakData.currentStreak}
                  </span>
                  <span className="text-lg font-bold text-amber-300 ml-1.5">Days</span>
                </div>

                <p className="text-xs text-slate-300 max-w-xs mx-auto">
                  {streakData.todayCompleted
                    ? '🎉 You have studied today! Your consecutive streak is locked in.'
                    : '⚡ Complete a practice question or diagnostic today to extend your streak!'}
                </p>

                <div className="pt-2 flex items-center justify-center gap-4 text-xs font-mono text-slate-400">
                  <span>Record: <strong className="text-white">{streakData.longestStreak} days</strong></span>
                  <span>•</span>
                  <span>Status: <strong className="text-emerald-400">Active</strong></span>
                </div>
              </div>

              {/* 7-Day Calendar Strip */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                  <span>This Week's Activity</span>
                  <span className="text-[11px] text-amber-400 font-mono">
                    {streakData.activeDates.length} Days Active
                  </span>
                </h4>

                <div className="grid grid-cols-7 gap-2 p-3 rounded-2xl bg-slate-950 border border-slate-800">
                  {weekDays.map((d, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-1.5">
                      <span className="text-[11px] text-slate-400 font-medium">
                        {d.label}
                      </span>
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
                          d.isCompleted
                            ? 'bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950 shadow-md shadow-amber-500/40 font-black scale-105'
                            : d.isToday
                            ? 'border-2 border-dashed border-amber-400 text-amber-400 bg-amber-500/10'
                            : 'bg-slate-900 text-slate-400 border border-slate-800'
                        }`}
                      >
                        {d.isCompleted ? '✓' : ''}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Milestones Progress */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-slate-200">
                    <Trophy className="w-3.5 h-3.5 text-amber-400" />
                    <span>Next Milestone: {nextMilestone.label}</span>
                  </div>
                  <span className="text-amber-400 font-mono text-[11px]">
                    {streakData.currentStreak} / {nextMilestone.days} Days
                  </span>
                </div>

                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressToNext}%` }}
                    transition={{ duration: 0.8 }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Reward: {nextMilestone.reward}</span>
                  <span>{nextMilestone.days - streakData.currentStreak} days to unlock</span>
                </div>
              </div>

              {/* Interactive Demo / Testing Controls */}
              <div className="pt-2 flex flex-col sm:flex-row gap-2">
                {!streakData.todayCompleted ? (
                  <button
                    onClick={handleCheckInToday}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/30 hover:brightness-110 active:scale-95 transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Check-in Today's Study</span>
                  </button>
                ) : (
                  <button
                    onClick={handleSimulateNextDay}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-750 text-amber-300 border border-amber-500/30 font-semibold text-xs transition-all active:scale-95"
                    title="Advance to next consecutive day to observe streak increment and glowing animation"
                  >
                    <PlusCircle className="w-4 h-4 text-amber-400" />
                    <span>Simulate Next Day (+1 Streak)</span>
                  </button>
                )}

                <button
                  onClick={() => setIsModalOpen(false)}
                  className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold transition-all"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    );
  }
};
