import React from 'react';
import { Trophy, Medal, Flame, CheckCircle2, Sparkles } from 'lucide-react';
import { LeaderboardEmoji, LiveEmoji } from '../components/LiveEmoji';
import { StudentPerformance, StudentProfile } from '../types';

interface LeaderboardPageProps {
  currentStudent: StudentProfile;
  performances: Record<string, StudentPerformance>;
}

export const LeaderboardPage: React.FC<LeaderboardPageProps> = ({
  currentStudent,
  performances,
}) => {
  // Calculate current student points: 100 * topics covered + 2 * questions solved
  const topicsCoveredCount = Object.values(performances).filter((p) => p.mastery >= 60).length;
  const currentPoints = 100 * topicsCoveredCount + 2 * currentStudent.totalQuestionsSolved;

  const mockLeaderboard = [
    {
      id: 'student_1',
      name: 'Rohan Gupta',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=80&auto=format&fit=crop&q=80',
      branch: 'CSE',
      semester: 2,
      topicsCovered: 11,
      questionsSolved: 142,
      points: 100 * 11 + 2 * 142,
      streak: 14,
      badge: 'Algorithm Master',
    },
    {
      id: currentStudent.id,
      name: `${currentStudent.name} (You)`,
      avatar: currentStudent.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&auto=format&fit=crop&q=80',
      branch: currentStudent.branch,
      semester: currentStudent.semester,
      topicsCovered: topicsCoveredCount,
      questionsSolved: currentStudent.totalQuestionsSolved,
      points: currentPoints,
      streak: currentStudent.currentStreak,
      badge: 'Adaptive Achiever',
      isCurrent: true,
    },
    {
      id: 'student_2',
      name: 'Ananya Roy',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=80',
      branch: 'CSE',
      semester: 2,
      topicsCovered: 9,
      questionsSolved: 110,
      points: 100 * 9 + 2 * 110,
      streak: 9,
      badge: 'Consistent Learner',
    },
    {
      id: 'student_3',
      name: 'Devansh Kulkarni',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80',
      branch: 'CSE',
      semester: 2,
      topicsCovered: 8,
      questionsSolved: 95,
      points: 100 * 8 + 2 * 95,
      streak: 7,
      badge: 'Tree Traversal Ace',
    },
    {
      id: 'student_4',
      name: 'Sneha Nair',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&auto=format&fit=crop&q=80',
      branch: 'CSE',
      semester: 2,
      topicsCovered: 7,
      questionsSolved: 88,
      points: 100 * 7 + 2 * 88,
      streak: 5,
      badge: 'Fast Recaller',
    },
  ].sort((a, b) => b.points - a.points);

  return (
    <div id="leaderboard-page-container" className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-cyan-500/30 shadow-2xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider">
              <Trophy className="w-4 h-4" />
              <span>Academic Competition • B.Tech CSE Class</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display flex items-center gap-3">
              <LeaderboardEmoji />
              <span>Adaptive Leaderboard</span>
            </h1>
            <p className="text-xs text-slate-300">
              Rankings computed transparently: <strong>100 pts per topic covered (≥60% mastery)</strong> + <strong>2 pts per practice question solved</strong>.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center shrink-0">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Your Current Points</span>
            <span className="text-2xl font-black text-cyan-300 font-display">{currentPoints}</span>
          </div>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <h2 className="text-base font-bold text-white font-display border-b border-slate-800 pb-3">
          Semester 2 CSE Standings
        </h2>

        <div className="space-y-2.5">
          {mockLeaderboard.map((user, idx) => {
            const rank = idx + 1;
            return (
              <div
                key={user.id}
                className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                  user.isCurrent
                    ? 'bg-gradient-to-r from-cyan-950/60 to-slate-900 border-cyan-400 shadow-lg shadow-cyan-500/10'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  {/* Rank Badge */}
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                      rank === 1
                        ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/30'
                        : rank === 2
                        ? 'bg-slate-300 text-slate-950'
                        : rank === 3
                        ? 'bg-amber-700 text-white'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : rank}
                  </div>

                  {/* Avatar & Name */}
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-700 shrink-0"
                  />

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className={`font-bold text-xs sm:text-sm truncate ${user.isCurrent ? 'text-cyan-300' : 'text-white'}`}>
                        {user.name}
                      </h3>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-400 hidden sm:inline">
                        {user.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      {user.topicsCovered} Topics Covered • {user.questionsSolved} Problems Solved
                    </p>
                  </div>
                </div>

                {/* Score & Streak */}
                <div className="flex items-center gap-4 text-right shrink-0">
                  <div className="hidden sm:flex items-center gap-1 text-xs text-amber-400">
                    <Flame className="w-3.5 h-3.5" />
                    <span>{user.streak}d</span>
                  </div>

                  <div className="text-right">
                    <span className="text-sm sm:text-base font-black text-cyan-400 font-display">
                      {user.points} pts
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
