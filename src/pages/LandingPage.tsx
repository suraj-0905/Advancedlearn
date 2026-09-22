import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  Brain,
  Layers,
  RotateCcw,
  Compass,
  Trophy,
  CheckCircle2,
  Cpu,
  BarChart3,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { LiveEmoji } from '../components/LiveEmoji';
import { SplineLiveExperience } from '../components/SplineLiveExperience';

interface LandingPageProps {
  onStartLearning: () => void;
  onViewDemo: () => void;
  onSelectStudent?: (studentId: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartLearning,
  onViewDemo,
  onSelectStudent,
}) => {
  const [activeView, setActiveView] = useState<'3d-live' | 'architecture'>('3d-live');

  return (
    <div id="landing-page" className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 w-full bg-slate-950/80 backdrop-blur-md border-b border-cyan-500/20 px-6 lg:px-16 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg shadow-cyan-500/30">
            AL
          </div>
          <div>
            <span className="font-extrabold text-lg tracking-tight font-display text-white">
              ADAPTIVE<span className="text-cyan-400">LEARN</span>
            </span>
            <span className="hidden sm:inline-block ml-2 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
              B.Tech CSE Edition
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onViewDemo}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-cyan-300 hover:text-cyan-200 hover:bg-slate-900 border border-cyan-500/30 transition-all"
          >
            Demo Accounts
          </button>
          <button
            onClick={onStartLearning}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-md shadow-cyan-500/20 transition-all"
          >
            Start Learning
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-6 lg:px-16 pt-12 pb-16 max-w-6xl mx-auto text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-semibold text-cyan-300 shadow-sm">
          <LiveEmoji states={['✨', '🚀', '💡']} intervalMs={2500} size="sm" />
          <span>AI-Powered Personalized Learning System for B.Tech CSE</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white font-display leading-tight max-w-4xl mx-auto">
          Learn smarter. <br />
          <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent">
            Adapt faster.
          </span>{' '}
          Retain longer.
        </h1>

        <p className="text-base sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Every student learns differently. AdaptiveLearn continuously diagnoses what you know, targets what you struggle with, and dynamically determines the next right step.
        </p>

        {/* View Switcher Pills */}
        <div className="inline-flex items-center p-1 rounded-2xl bg-slate-900/90 border border-cyan-500/30 shadow-lg">
          <button
            onClick={() => setActiveView('3d-live')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeView === '3d-live'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Live 3D Photo Animation</span>
            <span className="px-1.5 py-0.5 rounded-full text-[9px] bg-slate-950/40 text-cyan-200 uppercase font-mono">
              Spline
            </span>
          </button>
          <button
            onClick={() => setActiveView('architecture')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeView === 'architecture'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Algorithm Overview</span>
          </button>
        </div>

        {/* Featured Live 3D Photo Animation Centerpiece */}
        {activeView === '3d-live' ? (
          <div className="pt-2">
            <SplineLiveExperience
              isHeroMode={true}
              onEnterPlatform={onStartLearning}
              onExploreDemo={(studentId) => {
                if (onSelectStudent && studentId) {
                  onSelectStudent(studentId);
                } else {
                  onViewDemo();
                }
              }}
            />
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              id="btn-hero-start"
              onClick={onStartLearning}
              className="flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm shadow-xl shadow-cyan-500/25 transition-all active:scale-95"
            >
              <span>Start Learning</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              id="btn-hero-demo"
              onClick={onViewDemo}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-850 text-slate-200 border border-cyan-500/30 font-semibold text-sm transition-all"
            >
              <span>View Demo (Student A & B)</span>
              <Sparkles className="w-4 h-4 text-cyan-400" />
            </button>
          </div>
        )}

        {/* Core Product Message Banner */}
        <div className="p-6 rounded-3xl bg-slate-900/70 border border-cyan-500/20 max-w-3xl mx-auto shadow-2xl backdrop-blur-md text-left space-y-2">
          <div className="text-xs font-bold tracking-wider uppercase text-cyan-400">
            Core Philosophy
          </div>
          <p className="text-lg font-bold text-slate-100 font-display">
            "Don't just give students content. Give them the next right step."
          </p>
          <p className="text-xs text-slate-400">
            AdaptiveLearn is not a generic catalog of 100 video lectures. It uses deterministic mathematical algorithms for scoring, prerequisites, and spaced 2-week retention, paired with Gemini AI for conceptual tutoring.
          </p>
        </div>
      </section>

      {/* The Core Adaptive Loop Diagram */}
      <section className="px-6 lg:px-16 py-16 bg-slate-900/40 border-y border-slate-800">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
              The Continuous Adaptive Learning Loop
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
              How the platform personalizes your journey at every single milestone:
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 text-center">
            {[
              { step: '1', title: 'Student Profile', desc: 'Goals, time & format preference', emoji: '👤' },
              { step: '2', title: 'Diagnostic', desc: 'Topic-wise baseline assessment', emoji: '🎯' },
              { step: '3', title: 'Skill-Gap Engine', desc: 'Prerequisites & mastery scoring', emoji: '🧩' },
              { step: '4', title: 'Personal Path', desc: 'Topological prerequisite road', emoji: '🧭' },
              { step: '5', title: 'Adaptive Practice', desc: 'Difficulty scales per topic', emoji: '✏️' },
              { step: '6', title: '2-Week Revision', desc: 'Retention decay & reinforcement', emoji: '🔄' },
            ].map((item) => (
              <div
                key={item.step}
                className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col items-center space-y-2"
              >
                <div className="text-2xl">{item.emoji}</div>
                <div className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
                  Step {item.step}
                </div>
                <div className="font-bold text-xs text-slate-100">{item.title}</div>
                <div className="text-[11px] text-slate-400 leading-tight">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contrast Showcase: Student A vs Student B */}
      <section className="px-6 lg:px-16 py-20 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
            Real Personalization Proof
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-display">
            Student A ≠ Student B
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Two classmates in the same semester receive completely different learning paths based on their knowledge gaps:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Student A Card */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-cyan-500/30 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white font-display">Student A: Aryan Sharma</h3>
                <p className="text-xs text-cyan-400">Semester 2 CSE • Goal: FAANG Placements</p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300">
                Trees Focus
              </span>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Strong: Arrays (90%), Stacks (82%)</span>
                <span className="text-emerald-400 font-bold">Advanced</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Weak: Trees (45%), Graphs (35%)</span>
                <span className="text-rose-400 font-bold">Critical Gap</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1 text-xs">
              <span className="font-bold text-cyan-300 block">Generated Learning Path:</span>
              <p className="text-slate-300">
                Trees fundamentals → Tree traversal → Binary Search Trees → Tree practice → Graph fundamentals
              </p>
            </div>
          </div>

          {/* Student B Card */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-blue-500/30 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white font-display">Student B: Bhavna Patel</h3>
                <p className="text-xs text-blue-400">Semester 2 CSE • Goal: Systems Engineering</p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300">
                Basics Focus
              </span>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Strong: Trees (75%), Graphs (72%)</span>
                <span className="text-emerald-400 font-bold">Proficient</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Weak: Programming Basics (38%), Arrays (42%)</span>
                <span className="text-rose-400 font-bold">Prereq Deficit</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1 text-xs">
              <span className="font-bold text-blue-300 block">Generated Learning Path:</span>
              <p className="text-slate-300">
                Programming fundamentals → Pointer arithmetic → Arrays fundamentals → Linked lists practice
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 lg:px-16 py-12 border-t border-slate-800 text-center text-xs text-slate-500 space-y-3">
        <p>AdaptiveLearn • Built with Next-Gen Adaptive Learning Algorithms for B.Tech CSE</p>
        <p className="text-slate-600">
          Architecture ready for expansion to ECE, EE, ME, CE, IT, and Biotechnology branches.
        </p>
      </footer>
    </div>
  );
};
