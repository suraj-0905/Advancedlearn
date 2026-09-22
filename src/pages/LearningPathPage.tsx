import React from 'react';
import { Compass, CheckCircle2, Lock, Play, ArrowRight, Sparkles, BookOpen, AlertCircle } from 'lucide-react';
import { TOPICS } from '../data/mockData';
import { LearningPathItem, StudentPerformance, StudentProfile } from '../types';

interface LearningPathPageProps {
  student: StudentProfile;
  performances: Record<string, StudentPerformance>;
  learningPath: LearningPathItem[];
  onStartStep: (topicId: string) => void;
  onOpenTutor: (topicName: string) => void;
}

export const LearningPathPage: React.FC<LearningPathPageProps> = ({
  student,
  performances,
  learningPath,
  onStartStep,
  onOpenTutor,
}) => {
  return (
    <div id="learning-path-page" className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-cyan-500/30 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider">
              <Compass className="w-4 h-4" />
              <span>Topologically Ordered Prerequisite Path</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
              Personalized Learning Road
            </h1>
            <p className="text-xs text-slate-400 max-w-2xl">
              Constructed specifically for <strong>{student.name}</strong> based on your diagnostic mastery, missing prerequisites, and upcoming retention checkpoints.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs shrink-0 space-y-1">
            <span className="text-slate-400 block font-medium">Path Logic Profile:</span>
            <strong className="text-cyan-300 block">
              {student.id === 'student.a'
                ? 'Strong Arrays → Deep Dive Trees & Graphs'
                : student.id === 'student.b'
                ? 'Weak Basics → Foundation Strengthening First'
                : '14-Day Retention Deficit → Spaced Reinforcement'}
            </strong>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-500/20 text-xs text-slate-300 flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <span>
            <strong>Prerequisite Rule Enforced:</strong> Advanced topics (such as Graphs or Binary Search Trees) are strictly locked until prerequisites (such as Basic Trees or Arrays) reach a minimum 60% mastery threshold.
          </span>
        </div>
      </div>

      {/* Sequential Milestone Road */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-200 font-display flex items-center gap-2">
          <span>Active Sequential Milestone Sequence</span>
          <span className="px-2 py-0.5 rounded-full text-xs bg-cyan-500/15 text-cyan-300 font-semibold">
            {learningPath.length} Milestones
          </span>
        </h2>

        <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-4 before:bottom-4 before:w-0.5 before:bg-gradient-to-b before:from-cyan-400 before:via-blue-500 before:to-slate-800">
          {learningPath.map((item, index) => {
            const topic = TOPICS[item.topicId];
            const perf = performances[item.topicId];
            const isCompleted = item.status === 'completed';
            const isCurrent = item.status === 'current';
            const isLocked = item.status === 'locked';

            return (
              <div
                key={item.id}
                className="relative flex items-start gap-4 group"
              >
                {/* Node Milestone Circle */}
                <div
                  className={`absolute -left-6 sm:-left-8 flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full font-bold text-xs shadow-lg transition-transform group-hover:scale-110 ${
                    isCompleted
                      ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/30'
                      : isCurrent
                      ? 'bg-cyan-400 text-slate-950 ring-4 ring-cyan-500/20 shadow-cyan-500/40 animate-pulse'
                      : isLocked
                      ? 'bg-slate-800 text-slate-500 border border-slate-700'
                      : 'bg-slate-800 text-cyan-300 border border-cyan-500/30'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : isLocked ? (
                    <Lock className="w-3.5 h-3.5" />
                  ) : (
                    <span>{item.stepNumber}</span>
                  )}
                </div>

                {/* Milestone Content Card */}
                <div
                  className={`w-full p-5 sm:p-6 rounded-2xl border transition-all ${
                    isCurrent
                      ? 'bg-slate-900 border-cyan-400 shadow-xl shadow-cyan-500/10'
                      : isCompleted
                      ? 'bg-slate-900/50 border-emerald-500/30'
                      : isLocked
                      ? 'bg-slate-950/40 border-slate-850 opacity-60'
                      : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            isCompleted
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : isCurrent
                              ? 'bg-cyan-500/20 text-cyan-300'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {item.status}
                        </span>

                        <span className="text-xs font-semibold text-slate-400">
                          {topic?.name || item.topicId}
                        </span>

                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300">
                          {item.difficulty}
                        </span>
                      </div>

                      <h3 className="text-base sm:text-lg font-bold text-white font-display">
                        {item.actionTitle}
                      </h3>
                    </div>

                    {/* Progress indicator */}
                    {perf && (
                      <div className="text-right sm:shrink-0 text-xs">
                        <span className="text-slate-400 block">Current Mastery</span>
                        <span className="font-bold text-cyan-400 text-sm">
                          {Math.round(perf.mastery)}%
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Recommendation Rationale */}
                  <div className="py-3 text-xs text-slate-300 leading-relaxed">
                    <strong className="text-cyan-400">Algorithm Rationale: </strong>
                    <span>{item.recommendedReason}</span>
                  </div>

                  {/* Prerequisites info */}
                  {topic && topic.prerequisiteTopicIds.length > 0 && (
                    <div className="text-[11px] text-slate-400 pb-3 flex items-center gap-2">
                      <span>Prerequisites:</span>
                      <span className="text-slate-300 font-medium">
                        {topic.prerequisiteTopicIds.map((p) => TOPICS[p]?.name || p).join(', ')}
                      </span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    {!isLocked && (
                      <>
                        <button
                          onClick={() => onStartStep(item.topicId)}
                          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all active:scale-95 ${
                            isCurrent
                              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950'
                              : 'bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700'
                          }`}
                        >
                          <Play className="w-3.5 h-3.5" />
                          <span>{isCompleted ? 'Practice Again' : 'Start Practice'}</span>
                        </button>

                        <button
                          onClick={() => onOpenTutor(topic?.name || item.topicId)}
                          className="px-4 py-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold transition-all"
                        >
                          Learn with AI Tutor →
                        </button>
                      </>
                    )}

                    {isLocked && (
                      <span className="text-xs text-rose-400 flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5" />
                        Prerequisite requirement not yet met (Need &gt;= 60% mastery on foundational topics).
                      </span>
                    )}
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
