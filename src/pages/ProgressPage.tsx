import React from 'react';
import { BarChart3, TrendingUp, Clock, CheckCircle2, Award, Flame, Zap } from 'lucide-react';
import { TOPICS } from '../data/mockData';
import { StudentPerformance, StudentProfile } from '../types';
import { classifyMastery } from '../algorithms/masteryEngine';

interface ProgressPageProps {
  student: StudentProfile;
  performances: Record<string, StudentPerformance>;
}

export const ProgressPage: React.FC<ProgressPageProps> = ({ student, performances }) => {
  const perfList = Object.values(performances);
  const totalCovered = perfList.filter((p) => p.mastery >= 60).length;
  const totalMastered = perfList.filter((p) => p.mastery >= 80).length;
  const avgMastery = Math.round(
    perfList.reduce((acc, p) => acc + p.mastery, 0) / (perfList.length || 1)
  );
  const avgRetention = Math.round(
    perfList.reduce((acc, p) => acc + p.retention, 0) / (perfList.length || 1)
  );

  return (
    <div id="progress-page-container" className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-cyan-500/30 shadow-2xl space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 text-xs font-semibold">
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Performance & Retention Analytics</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
          Learning Growth Analytics
        </h1>
        <p className="text-xs text-slate-400">
          Continuous tracking of concept mastery, retention decay resistance, and practice consistency.
        </p>
      </div>

      {/* 4 Top KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <span className="text-xs text-slate-400 font-medium">Average Mastery</span>
          <div className="text-2xl sm:text-3xl font-black text-cyan-300 font-display">{avgMastery}%</div>
          <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${avgMastery}%` }} />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <span className="text-xs text-slate-400 font-medium">Average Retention</span>
          <div className="text-2xl sm:text-3xl font-black text-amber-300 font-display">{avgRetention}%</div>
          <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div className="h-full bg-amber-400 rounded-full" style={{ width: `${avgRetention}%` }} />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <span className="text-xs text-slate-400 font-medium">Topics Proficient (&gt;=60%)</span>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-display">
            {totalCovered} / {Object.keys(TOPICS).length}
          </div>
          <span className="text-[11px] text-slate-500">{totalMastered} Advanced Masteries</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <span className="text-xs text-slate-400 font-medium">Study Consistency</span>
          <div className="text-2xl sm:text-3xl font-black text-white font-display flex items-center gap-1.5">
            <Flame className="w-6 h-6 text-amber-400" />
            <span>{student.currentStreak} Days</span>
          </div>
          <span className="text-[11px] text-slate-500">{student.totalQuestionsSolved} Questions Solved</span>
        </div>
      </div>

      {/* Topic by Topic Comparison Table */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
        <h2 className="text-base font-bold text-white font-display">
          Detailed Topic Performance Matrix
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Topic</th>
                <th className="py-3 px-4">Mastery</th>
                <th className="py-3 px-4">Retention</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Current Difficulty</th>
                <th className="py-3 px-4">Days Since Practice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {Object.entries(performances).map(([tid, perf]) => {
                const topic = TOPICS[tid];
                const masteryClass = classifyMastery(perf.mastery);

                return (
                  <tr key={tid} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-100">
                      {topic?.name || tid}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-cyan-400">
                      {Math.round(perf.mastery)}%
                    </td>
                    <td className="py-3.5 px-4 font-bold text-amber-400">
                      {Math.round(perf.retention)}%
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          masteryClass === 'Advanced'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : masteryClass === 'Proficient'
                            ? 'bg-cyan-500/20 text-cyan-300'
                            : masteryClass === 'Developing'
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-rose-500/20 text-rose-300'
                        }`}
                      >
                        {masteryClass}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 font-medium">
                      {perf.currentDifficulty}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      {perf.daysSinceLastLearning} days
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
