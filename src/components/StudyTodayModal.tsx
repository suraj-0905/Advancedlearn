import React, { useState } from 'react';
import { Sparkles, Clock, X, CheckCircle2, ArrowRight, BookOpen, PenTool, RotateCcw } from 'lucide-react';
import { StudentPerformance, StudentProfile } from '../types';
import { generateTodayStudyPlan } from '../algorithms/learningPathEngine';

interface StudyTodayModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: StudentProfile;
  performances: Record<string, StudentPerformance>;
  onStartActivity: (activityType: string, topicId: string) => void;
}

export const StudyTodayModal: React.FC<StudyTodayModalProps> = ({
  isOpen,
  onClose,
  profile,
  performances,
  onStartActivity,
}) => {
  const [selectedMinutes, setSelectedMinutes] = useState<number>(profile.availableTimeMinutes || 45);

  if (!isOpen) return null;

  const plan = generateTodayStudyPlan(profile, performances, selectedMinutes);

  return (
    <div
      id="study-today-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in"
    >
      <div
        id="study-today-modal-card"
        className="w-full max-w-2xl p-6 sm:p-8 rounded-3xl bg-slate-900 border border-cyan-500/30 shadow-2xl shadow-cyan-500/10 space-y-6 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Adaptive Daily Engine</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
              What Should I Study Today?
            </h2>
            <p className="text-xs text-slate-400">
              Personalized for {profile.name} • Aligned with {profile.careerGoal}
            </p>
          </div>

          <button
            id="btn-close-study-modal"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Available Time Selector */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span>How much time do you have right now?</span>
          </label>
          <div className="grid grid-cols-4 gap-2.5">
            {[15, 30, 45, 60].map((mins) => (
              <button
                key={mins}
                onClick={() => setSelectedMinutes(mins)}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border ${
                  selectedMinutes === mins
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/20'
                    : 'bg-slate-950/60 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                {mins} Mins
              </button>
            ))}
          </div>
        </div>

        {/* Engine Recommendation Rationale */}
        <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-cyan-300">
            <span>Focus Target: {plan.focusTopicName}</span>
            <span>{plan.totalMinutes} Min Plan</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {plan.primaryRationale}
          </p>
        </div>

        {/* Generated Schedule Steps */}
        <div className="space-y-2.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Recommended Action Breakdown
          </h3>

          <div className="space-y-2">
            {plan.activities.map((act, index) => (
              <div
                key={index}
                className="flex items-start justify-between p-3.5 rounded-xl bg-slate-950/50 border border-slate-800/80 hover:border-cyan-500/30 transition-all gap-3"
              >
                <div className="flex items-start gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-slate-800 text-cyan-300 font-bold text-xs shrink-0 mt-0.5">
                    {act.durationMinutes}m
                  </span>
                  <div>
                    <h4 className="font-semibold text-xs sm:text-sm text-slate-100">{act.action}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">{act.details}</p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onStartActivity(act.type, plan.focusTopicId);
                    onClose();
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-cyan-500/20 text-cyan-300 text-xs font-medium border border-slate-700 shrink-0 transition-all"
                >
                  <span>Start</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Footer actions */}
        <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Engine recalibrates dynamically as soon as you complete activities.
          </span>
          <button
            onClick={() => {
              onStartActivity('Practice', plan.focusTopicId);
              onClose();
            }}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20"
          >
            Launch Today's Session
          </button>
        </div>
      </div>
    </div>
  );
};
