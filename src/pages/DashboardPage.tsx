import React from 'react';
import {
  Sparkles,
  Flame,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Brain,
  RotateCcw,
  BookOpen,
  Layers,
  Compass,
  Play,
  FileText,
  Code,
  Calendar,
} from 'lucide-react';
import { WelcomeWaterRipple } from '../components/WelcomeWaterRipple';
import { LiveEmoji, RetentionAlertEmoji } from '../components/LiveEmoji';
import { TOPICS, SUBJECTS } from '../data/mockData';
import { LearningPathItem, StudentPerformance, StudentProfile } from '../types';
import { classifyMastery, getMasteryClassBadge } from '../algorithms/masteryEngine';
import { getRetentionStatus } from '../algorithms/retentionEngine';
import { getRecommendedResources } from '../algorithms/recommendationEngine';
import { DailyStreakCounter } from '../components/DailyStreakCounter';

interface DashboardPageProps {
  student: StudentProfile;
  performances: Record<string, StudentPerformance>;
  learningPath: LearningPathItem[];
  onOpenStudyTodayModal: () => void;
  onNavigateToTab: (tab: string) => void;
  onStartPracticeTopic: (topicId: string) => void;
  onSimulate14Days: () => void;
  justLoggedIn?: boolean;
  onClearJustLoggedIn?: () => void;
  onStreakChange?: (newStreak: number) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  student,
  performances,
  learningPath,
  onOpenStudyTodayModal,
  onNavigateToTab,
  onStartPracticeTopic,
  onSimulate14Days,
  justLoggedIn = false,
  onClearJustLoggedIn,
  onStreakChange,
}) => {
  // Calculate aggregate metrics
  const perfList = Object.values(performances);
  const avgMastery =
    perfList.length > 0
      ? Math.round(perfList.reduce((acc, p) => acc + p.mastery, 0) / perfList.length)
      : 50;

  const avgRetention =
    perfList.length > 0
      ? Math.round(perfList.reduce((acc, p) => acc + p.retention, 0) / perfList.length)
      : 50;

  const strongTopics = perfList.filter((p) => p.mastery >= 70);
  const weakTopics = perfList.filter((p) => p.mastery < 60);

  // Check for 2-week retention deficit (e.g. Student C)
  const retentionDeficit = perfList.find(
    (p) => p.mastery >= 75 && p.retention <= 65
  );

  const recommendedResources = getRecommendedResources(student, performances, 3);

  return (
    <div id="dashboard-page-container" className="space-y-8 pb-12">
      {/* 1. WELCOME BACK / GREETING BANNER WITH LIQUID WATER-DROP CURSOR EFFECT */}
      <WelcomeWaterRipple className="p-6 sm:p-8 bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/70 border border-cyan-500/30 shadow-2xl relative">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-xs font-semibold text-cyan-300">
              <span>B.Tech CSE • Semester {student.semester}</span>
              <span>•</span>
              <span>{student.careerGoal}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-display flex items-center gap-3">
              <LiveEmoji initialEmoji="👋" states={['👋', '✨']} intervalMs={3000} size="xl" />
              <span>Good morning, {student.name}!</span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Your personalized learning path has adapted to your recent diagnostic. Focus today on your highest-yield prerequisite gaps to elevate your overall proficiency.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-1">
              <button
                id="btn-welcome-study-today"
                onClick={onOpenStudyTodayModal}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/25 transition-all active:scale-95"
              >
                <Sparkles className="w-4 h-4" />
                <span>What Should I Study Today?</span>
              </button>

              <button
                id="btn-view-path-welcome"
                onClick={() => onNavigateToTab('learning-path')}
                className="px-5 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-750 text-cyan-300 border border-cyan-500/30 text-xs font-semibold transition-all"
              >
                View Learning Road ({learningPath.length} Steps)
              </button>
            </div>
          </div>

          {/* Key Metrics Quick Pill */}
          <div className="grid grid-cols-2 gap-3 shrink-0 lg:w-72">
            <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-400 block">Overall Mastery</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-cyan-300 font-display">{avgMastery}%</span>
                <span className="text-[10px] text-emerald-400 font-semibold">+4% this wk</span>
              </div>
              <div className="w-full h-1 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${avgMastery}%` }} />
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-400 block">Retention Index</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-amber-300 font-display">{avgRetention}%</span>
                <span className="text-[10px] text-slate-400">14-Day Spaced</span>
              </div>
              <div className="w-full h-1 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-amber-400 rounded-full" style={{ width: `${avgRetention}%` }} />
              </div>
            </div>

            <div
              className={`p-3.5 rounded-2xl transition-all duration-500 space-y-1 ${
                justLoggedIn
                  ? 'bg-slate-900 border-2 border-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.6)] ring-2 ring-amber-400/30'
                  : 'bg-slate-950/70 border border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-400 block">Current Streak</span>
                {justLoggedIn && (
                  <span className="text-[9px] font-black uppercase text-amber-300 bg-amber-500/20 px-1.5 py-0.2 rounded animate-pulse">
                    Glow 🔥
                  </span>
                )}
              </div>
              <div className="flex items-baseline gap-1.5">
                <Flame
                  className={`w-4 h-4 ${
                    justLoggedIn
                      ? 'text-amber-400 animate-bounce filter drop-shadow-[0_0_8px_rgba(245,158,11,0.9)]'
                      : 'text-amber-400'
                  } inline`}
                />
                <span className="text-xl font-bold text-white font-display">
                  {student.currentStreak} Days
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-400 block">Problems Solved</span>
              <div className="flex items-baseline gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 inline" />
                <span className="text-xl font-bold text-white font-display">{student.totalQuestionsSolved}</span>
              </div>
            </div>
          </div>
        </div>
      </WelcomeWaterRipple>

      {/* 2. SPURRED 2-WEEK RETENTION ALERT (Mandatory Section 17 & 18) */}
      {retentionDeficit && (
        <div
          id="retention-alert-banner"
          className="p-5 rounded-2xl bg-gradient-to-r from-amber-950/50 via-slate-900 to-slate-900 border border-amber-500/40 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0 mt-0.5">
              <RetentionAlertEmoji />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-slate-950">
                  2-Week Spaced Revision Alert
                </span>
                <span className="text-xs font-semibold text-amber-300">
                  {TOPICS[retentionDeficit.topicId]?.name}
                </span>
              </div>
              <h3 className="font-bold text-sm text-slate-100 mt-1">
                Strong mastery ({Math.round(retentionDeficit.mastery)}%), but retention needs reinforcement ({Math.round(retentionDeficit.retention)}%).
              </h3>
              <p className="text-xs text-slate-400">
                It has been {retentionDeficit.daysSinceLastLearning} days since your last practice session. The system has scheduled an automated concept recap & practice set.
              </p>
            </div>
          </div>

          <button
            id="btn-launch-retention-test"
            onClick={() => onNavigateToTab('revision')}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shrink-0 shadow-md transition-all"
          >
            Take 2-Week Revision Test →
          </button>
        </div>
      )}

      {/* 3. CURRENT LEARNING PATH & TODAY'S STUDY PLAN */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Personalized Path Road */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <Compass className="w-5 h-5 text-cyan-400" />
              <div>
                <h2 className="font-bold text-base text-slate-100 font-display">
                  Current Personalized Learning Path
                </h2>
                <p className="text-xs text-slate-400">
                  {student.id === 'student.a'
                    ? 'Path: Trees → Traversal → BST → Graphs (Prerequisite Ordered)'
                    : student.id === 'student.b'
                    ? 'Path: Fundamentals → Pointers → Arrays (Foundation Strengthening)'
                    : 'Path: Spaced Revision & Retention Reinforcement'}
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigateToTab('learning-path')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
            >
              <span>Full Path</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {learningPath.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-cyan-500/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold text-xs flex items-center justify-center">
                      {item.stepNumber}
                    </span>
                    <span className="font-semibold text-xs text-slate-200">
                      {item.actionTitle}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-400">
                      {item.difficulty}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-1">
                    {item.recommendedReason}
                  </p>
                </div>

                <button
                  onClick={() => onStartPracticeTopic(item.topicId)}
                  className="flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-cyan-500/20 text-cyan-300 text-xs font-medium border border-slate-700 transition-all shrink-0"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Start Step</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Daily Streak Counter & Next Revision Checkpoint */}
        <div className="space-y-6 flex flex-col">
          {/* Daily Streak Counter with glowing animation */}
          <DailyStreakCounter
            student={student}
            variant="card"
            justLoggedIn={justLoggedIn}
            onClearJustLoggedIn={onClearJustLoggedIn}
            onStreakChange={onStreakChange}
          />

          {/* Next Revision Checkpoint Card */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-xl flex-1 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-5 h-5 text-amber-400" />
                  <h3 className="font-bold text-sm text-slate-100 font-display">
                    Spaced Revision Engine
                  </h3>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-300">
                  14-Day Cycle
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Every 14 days, AdaptiveLearn measures long-term retention decay independently from your mastery score to guarantee permanent neural retention.
              </p>

              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Next Scheduled Checkpoint:</span>
                  <strong className="text-cyan-400">In 3 Days</strong>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Active Target:</span>
                  <span className="text-slate-200 font-medium">Binary Trees & Arrays</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <button
                id="btn-dash-simulate-14-days"
                onClick={onSimulate14Days}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/40 text-xs font-semibold transition-all"
              >
                <span>Simulate 14-Day Passage ⚡</span>
              </button>
              <button
                onClick={() => onNavigateToTab('revision')}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold border border-slate-700 transition-all"
              >
                Open Revision Center →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4. TOPIC MASTERY BREAKDOWN & WEAK VS STRONG AREAS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Topic Mastery Progress Bars */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-cyan-400" />
              <h3 className="font-bold text-base text-slate-100 font-display">
                Topic Mastery Breakdown
              </h3>
            </div>
            <button
              onClick={() => onNavigateToTab('skill-map')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
            >
              View Full Skill Map →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {Object.entries(performances).slice(0, 6).map(([tid, perf]) => {
              const topic = TOPICS[tid];
              const masteryClass = classifyMastery(perf.mastery);
              const badge = getMasteryClassBadge(masteryClass);
              const retStatus = getRetentionStatus(perf.mastery, perf.retention);

              return (
                <div
                  key={tid}
                  className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2 hover:border-cyan-500/30 transition-all"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs font-bold text-slate-200 truncate">
                      {topic?.name || tid}
                    </h4>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${badge.bgClass} ${badge.colorClass}`}>
                      {badge.label}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-400">Mastery</span>
                      <span className="font-bold text-cyan-300">{Math.round(perf.mastery)}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-cyan-400 rounded-full"
                        style={{ width: `${Math.max(5, perf.mastery)}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] pt-1 text-slate-400">
                    <span>Retention: <strong className={retStatus.colorClass}>{Math.round(perf.retention)}%</strong></span>
                    <button
                      onClick={() => onStartPracticeTopic(tid)}
                      className="text-cyan-400 hover:text-cyan-300 font-semibold"
                    >
                      Practice ({perf.currentDifficulty}) →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Weak vs Strong Summary Card */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-xl">
          <h3 className="font-bold text-base text-slate-100 font-display border-b border-slate-800 pb-3">
            Diagnostics Snapshot
          </h3>

          <div className="space-y-3">
            <div>
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 mb-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Strong Foundation (Mastery &gt;= 70%)
              </span>
              <div className="space-y-1">
                {strongTopics.map((p) => (
                  <div
                    key={p.topicId}
                    className="p-2 rounded-xl bg-slate-950/60 border border-slate-800 flex justify-between text-xs"
                  >
                    <span className="text-slate-200">{TOPICS[p.topicId]?.name || p.topicId}</span>
                    <span className="text-emerald-400 font-bold">{Math.round(p.mastery)}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5 mb-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                Targeted Weak Areas (Mastery &lt; 60%)
              </span>
              <div className="space-y-1">
                {weakTopics.map((p) => (
                  <div
                    key={p.topicId}
                    className="p-2 rounded-xl bg-slate-950/60 border border-slate-800 flex justify-between text-xs"
                  >
                    <span className="text-slate-200">{TOPICS[p.topicId]?.name || p.topicId}</span>
                    <span className="text-rose-400 font-bold">{Math.round(p.mastery)}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. RECOMMENDED LEARNING RESOURCES WITH "WHY?" EXPLANATION */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="font-bold text-base text-slate-100 font-display">
              Recommended Learning Resources
            </h3>
            <p className="text-xs text-slate-400">
              Personalized based on your skill gaps, retention needs, and format preferences.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recommendedResources.map((res) => (
            <div
              key={res.id}
              className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-cyan-500/30 transition-all flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="px-2 py-0.5 rounded font-bold bg-cyan-500/15 text-cyan-300">
                    {res.type}
                  </span>
                  <span className="text-slate-400">{res.estimatedDuration}</span>
                </div>

                <h4 className="font-bold text-xs text-slate-100 leading-snug">
                  {res.title}
                </h4>

                {/* Explicit "WHY?" requirement */}
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800/80 text-[11px] text-slate-300">
                  <strong className="text-cyan-400 block mb-0.5">Why recommended:</strong>
                  <span>{res.whyRecommended}</span>
                </div>
              </div>

              <button
                onClick={() => onStartPracticeTopic(res.topicId)}
                className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-cyan-500/20 text-cyan-300 text-xs font-semibold border border-slate-700 transition-all text-center"
              >
                Launch Activity →
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
