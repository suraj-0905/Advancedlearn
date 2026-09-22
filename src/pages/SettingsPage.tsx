import React, { useState } from 'react';
import { Settings, Moon, Sun, Monitor, FastForward, RotateCcw, Volume2, Sparkles, CheckCircle2 } from 'lucide-react';
import { ThemeSwitcher } from '../components/ThemeSwitcher';

interface SettingsPageProps {
  onSimulate14Days: () => void;
  onResetProgress: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  onSimulate14Days,
  onResetProgress,
}) => {
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [resetConfirmed, setResetConfirmed] = useState(false);

  const handleReset = () => {
    onResetProgress();
    setResetConfirmed(true);
    setTimeout(() => setResetConfirmed(false), 3000);
  };

  return (
    <div id="settings-page-container" className="space-y-8 max-w-4xl mx-auto pb-16">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-cyan-500/30 shadow-2xl space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 text-xs font-semibold">
          <Settings className="w-3.5 h-3.5" />
          <span>System & Evaluation Preferences</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
          Platform Settings
        </h1>
        <p className="text-xs text-slate-400">
          Customize UI aesthetics, live emoji animations, and simulation variables for evaluator testing.
        </p>
      </div>

      <div className="space-y-6">
        {/* Theme Settings */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
          <h2 className="text-base font-bold text-white font-display">Appearance & Theme</h2>
          <p className="text-xs text-slate-400">
            Choose between deep navy dark theme (default) or light educational theme.
          </p>
          <div className="pt-2">
            <ThemeSwitcher />
          </div>
        </div>

        {/* Hackathon Simulation Controls */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-base font-display">
            <FastForward className="w-5 h-5" />
            <span>Hackathon Evaluation & Simulation</span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Fast-forward time to test how the platform handles long-term memory retention decay and prerequisite recalculation:
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              id="btn-settings-simulate-14"
              onClick={onSimulate14Days}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-semibold transition-all"
            >
              <FastForward className="w-4 h-4" />
              <span>Simulate 14-Day Memory Decay</span>
            </button>

            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 text-xs font-semibold transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Demo Progress to Baseline</span>
            </button>
          </div>

          {resetConfirmed && (
            <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Demo dataset restored to initial baseline successfully.</span>
            </div>
          )}
        </div>

        {/* Animation & Audio Preferences */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
          <h2 className="text-base font-bold text-white font-display">Interaction & Effects</h2>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 cursor-pointer">
              <div>
                <span className="font-semibold text-slate-200 block">Live Animated Emoji Micro-Transitions</span>
                <span className="text-slate-400 text-[11px]">
                  State-based smooth transitions (scale, glow, state morphs)
                </span>
              </div>
              <input
                type="checkbox"
                checked={animationsEnabled}
                onChange={(e) => setAnimationsEnabled(e.target.checked)}
                className="w-4 h-4 rounded text-cyan-500 focus:ring-cyan-400 bg-slate-900"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 cursor-pointer">
              <div>
                <span className="font-semibold text-slate-200 block">Practice Sound Effects</span>
                <span className="text-slate-400 text-[11px]">
                  Subtle audio chime on correct answer submission
                </span>
              </div>
              <input
                type="checkbox"
                checked={soundEnabled}
                onChange={(e) => setSoundEnabled(e.target.checked)}
                className="w-4 h-4 rounded text-cyan-500 focus:ring-cyan-400 bg-slate-900"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
