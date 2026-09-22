import React from 'react';
import { BookOpen, GraduationCap, Clock, Award, CheckCircle2, ArrowRight } from 'lucide-react';
import { SUBJECTS, TOPICS } from '../data/mockData';
import { StudentPerformance, StudentProfile } from '../types';

interface CoursesPageProps {
  student: StudentProfile;
  performances: Record<string, StudentPerformance>;
  onNavigateToTopic: (topicId: string) => void;
}

export const CoursesPage: React.FC<CoursesPageProps> = ({
  student,
  performances,
  onNavigateToTopic,
}) => {
  return (
    <div id="courses-page-container" className="space-y-8 max-w-6xl mx-auto pb-12">
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-cyan-500/30 shadow-2xl space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 text-xs font-semibold">
          <GraduationCap className="w-3.5 h-3.5" />
          <span>B.Tech CSE Core Curriculum</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
          My Enrolled Courses & Subjects
        </h1>
        <p className="text-xs text-slate-400">
          All courses calibrated to your academic year (Semester {student.semester}, {student.branch}).
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {SUBJECTS.map((sub) => {
          const subTopics = Object.values(TOPICS).filter((t) => t.subjectId === sub.id);
          const completedCount = subTopics.filter(
            (t) => (performances[t.id]?.mastery ?? 0) >= 60
          ).length;
          const progressPercent = Math.round((completedCount / (subTopics.length || 1)) * 100);

          return (
            <div
              key={sub.id}
              className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-5 shadow-xl hover:border-cyan-500/30 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider">
                      {sub.code} • {sub.credits} Credits
                    </span>
                    <h3 className="text-lg font-bold text-white font-display mt-0.5">
                      {sub.name}
                    </h3>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-cyan-300 text-xs font-bold">
                    Sem {sub.semester}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {sub.description}
                </p>

                {/* Progress bar */}
                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Curriculum Mastery</span>
                    <span className="font-bold text-cyan-300">{progressPercent}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(5, progressPercent)}%` }}
                    />
                  </div>
                </div>

                {/* Topic tags */}
                <div className="pt-2">
                  <span className="text-[11px] text-slate-400 block mb-1.5">Included Topics:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {subTopics.map((t) => {
                      const perf = performances[t.id];
                      const isMastered = (perf?.mastery ?? 0) >= 60;
                      return (
                        <button
                          key={t.id}
                          onClick={() => onNavigateToTopic(t.id)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                            isMastered
                              ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                              : 'bg-slate-950 text-slate-400 border border-slate-800 hover:border-cyan-500/40'
                          }`}
                        >
                          {t.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  {completedCount} of {subTopics.length} Topics Covered
                </span>
                <button
                  onClick={() => onNavigateToTopic(subTopics[0]?.id || 'trees')}
                  className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                >
                  <span>Explore Subject</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
