import React, { useState } from 'react';
import { Sparkles, FastForward, CheckCircle2, ChevronRight, X, AlertCircle, Flame } from 'lucide-react';
import { StudentProfile } from '../types';

interface DemoTourBarProps {
  currentStudent: StudentProfile | null;
  onSimulate14Days: () => void;
  onNavigateToTab: (tab: string) => void;
  onLogout: () => void;
  onTriggerLoginGlow?: () => void;
}

export const DemoTourBar: React.FC<DemoTourBarProps> = ({
  currentStudent,
  onSimulate14Days,
  onNavigateToTab,
  onLogout,
  onTriggerLoginGlow,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  if (!currentStudent) return null;

  const demoSteps = [
    { step: 1, title: 'Logged in as Demo Student', desc: `Current: ${currentStudent.name} (${currentStudent.id})`, action: 'Overview' },
    { step: 2, title: 'Check Welcome Banner', desc: 'Observe waving greeting & cursor liquid-ripple effect', action: 'Dashboard', tab: 'dashboard' },
    { step: 3, title: 'Inspect Skill Map', desc: currentStudent.id === 'student.a' ? 'Strong Arrays (90%), Weak Trees (45%)' : 'Different strengths/weaknesses', action: 'Skill Map', tab: 'skill-map' },
    { step: 4, title: 'Personalized Learning Path', desc: currentStudent.id === 'student.a' ? 'Path: Trees -> Traversal -> BST -> Graphs' : 'Path adapts strictly to current student', action: 'Learning Path', tab: 'learning-path' },
    { step: 5, title: 'Adaptive Practice', desc: 'Solve questions, observe immediate feedback & mastery delta', action: 'Practice', tab: 'practice' },
    { step: 6, title: 'AI Tutor Teaching', desc: 'Ask "Explain Binary Trees" to see 6-stage animated teaching', action: 'AI Tutor', tab: 'ai-tutor' },
    { step: 7, title: 'Simulate 14 Days', desc: 'Trigger Ebbinghaus decay to test 2-week revision alert', action: 'Simulate', customAction: 'simulate' },
    { step: 8, title: '2-Week Revision Test', desc: 'Take retention test; see High Mastery / Low Retention alert', action: 'Revision', tab: 'revision' },
    { step: 9, title: 'Check Leaderboard', desc: 'See points: 100 * topics covered + 2 * questions solved', action: 'Leaderboard', tab: 'leaderboard' },
    { step: 10, title: 'Compare with Student B', desc: 'Logout and log in as Student B to verify DIFFERENT learning path', action: 'Logout', customAction: 'logout' },
  ];

  return (
    <>
      {/* Top Demo Helper Strip */}
      <div
        id="demo-tour-banner"
        className="w-full bg-gradient-to-r from-slate-900 via-cyan-950 to-slate-900 border-b border-cyan-500/20 px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-3 text-slate-300 relative z-30"
      >
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="font-semibold text-cyan-300">Hackathon Demo Mode:</span>
          <span className="text-slate-300 hidden sm:inline">
            Active Student: <strong className="text-white">{currentStudent.name}</strong> ({currentStudent.id})
          </span>
          <span className="text-slate-400 hidden md:inline">
            • {currentStudent.id === 'student.a' ? 'Path focused on Trees → Graphs' : currentStudent.id === 'student.b' ? 'Path focused on Fundamentals → Arrays' : 'Path focused on 2-Week Retention'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {onTriggerLoginGlow && (
            <button
              id="btn-test-streak-glow"
              onClick={onTriggerLoginGlow}
              title="Trigger glowing animation for the daily study streak counter"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 font-medium transition-all"
            >
              <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span className="hidden sm:inline">Streak Glow</span>
              <span className="sm:hidden">Glow</span>
            </button>
          )}

          <button
            onClick={() => onNavigateToTab('live-3d')}
            title="Inspect Spline Clarity Stream Live 3D Experience"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-medium transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Spline 3D Scene</span>
            <span className="sm:hidden">3D</span>
          </button>

          <button
            id="btn-simulate-14-days"
            onClick={onSimulate14Days}
            title="Fast-forward time by 14 days to observe memory retention decay and trigger the revision test"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-medium transition-all"
          >
            <FastForward className="w-3.5 h-3.5" />
            <span>Simulate 14 Days</span>
          </button>

          <button
            id="btn-toggle-demo-flow"
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 font-medium transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isOpen ? 'Close Demo Steps' : 'Guided Demo Steps'}</span>
          </button>
        </div>
      </div>

      {/* Slide-out Guided Step Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm">
          <div className="w-full max-w-xl p-6 rounded-2xl bg-slate-900 border border-cyan-500/30 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-base text-slate-100">AdaptiveLearn Evaluation Scenario</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-200 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Walk through the core adaptive loop specified in Section 42 of product specs. Click any step to navigate directly:
            </p>

            <div className="space-y-2">
              {demoSteps.map((s) => (
                <div
                  key={s.step}
                  className="flex items-start justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-cyan-500/40 transition-all gap-3"
                >
                  <div className="flex items-start gap-3">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 font-bold text-xs shrink-0 mt-0.5">
                      {s.step}
                    </span>
                    <div>
                      <h4 className="font-semibold text-xs text-slate-100">{s.title}</h4>
                      <p className="text-[11px] text-slate-400">{s.desc}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (s.customAction === 'simulate') {
                        onSimulate14Days();
                        setIsOpen(false);
                      } else if (s.customAction === 'logout') {
                        onLogout();
                        setIsOpen(false);
                      } else if (s.tab) {
                        onNavigateToTab(s.tab);
                        setIsOpen(false);
                      }
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-cyan-500/20 text-cyan-400 text-xs font-medium border border-slate-700 shrink-0"
                  >
                    Go →
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Switch Student? Logout → Log in as Student B</span>
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-cyan-500 text-slate-950 font-semibold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
