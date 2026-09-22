import React, { useState } from 'react';
import {
  RotateCcw,
  FastForward,
  AlertTriangle,
  CheckCircle2,
  Brain,
  Sparkles,
  ArrowRight,
  TrendingDown,
  BookOpen,
} from 'lucide-react';
import { TOPICS, QUESTIONS_BANK } from '../data/mockData';
import { StudentPerformance, StudentProfile } from '../types';
import { getRetentionStatus } from '../algorithms/retentionEngine';
import { LiveEmoji } from '../components/LiveEmoji';

interface RevisionPageProps {
  student: StudentProfile;
  performances: Record<string, StudentPerformance>;
  onSimulate14Days: () => void;
  onUpdatePerformance: (topicId: string, updated: StudentPerformance, pointsEarned: number) => void;
  onOpenTutor: (topicName: string) => void;
}

export const RevisionPage: React.FC<RevisionPageProps> = ({
  student,
  performances,
  onSimulate14Days,
  onUpdatePerformance,
  onOpenTutor,
}) => {
  const [selectedTopicId, setSelectedTopicId] = useState<string>('trees');
  const [isTestRunning, setIsTestRunning] = useState(false);
  const [testQuestionIndex, setTestQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [testScore, setTestScore] = useState(0);
  const [isTestFinished, setIsTestFinished] = useState(false);

  const activePerf = performances[selectedTopicId] || {
    studentId: student.id,
    topicId: selectedTopicId,
    mastery: 82,
    retention: 56,
    daysSinceLastLearning: 14,
    assessmentPerformance: 85,
    practicePerformance: 80,
    recentPerformance: 75,
    consistency: 70,
    lastPracticed: new Date().toISOString(),
    lastAssessed: new Date().toISOString(),
    questionsAttempted: 15,
    questionsCorrect: 12,
    averageTimeSeconds: 42,
    currentDifficulty: 'Medium' as const,
  };

  const status = getRetentionStatus(activePerf.mastery, activePerf.retention);
  const testQuestions = QUESTIONS_BANK.filter((q) => q.topicId === selectedTopicId).slice(0, 4);

  const handleStartTest = () => {
    setIsTestRunning(true);
    setTestQuestionIndex(0);
    setSelectedOption(null);
    setTestScore(0);
    setIsTestFinished(false);
  };

  const handleAnswerTestQuestion = () => {
    if (selectedOption === null) return;
    const currentQ = testQuestions[testQuestionIndex];
    const isCorrect = selectedOption === currentQ.correctAnswer;
    const newScore = isCorrect ? testScore + 1 : testScore;
    setTestScore(newScore);

    if (testQuestionIndex < testQuestions.length - 1) {
      setTestQuestionIndex(testQuestionIndex + 1);
      setSelectedOption(null);
    } else {
      // Test finished - boost retention based on test outcome!
      const finalPercent = (newScore / testQuestions.length) * 100;
      const boostedRetention = Math.min(100, Math.round(activePerf.retention + (finalPercent * 0.35)));

      const updatedPerf: StudentPerformance = {
        ...activePerf,
        retention: boostedRetention,
        daysSinceLastLearning: 0,
        lastPracticed: new Date().toISOString(),
      };

      onUpdatePerformance(selectedTopicId, updatedPerf, 5);
      setIsTestFinished(true);
      setIsTestRunning(false);
    }
  };

  return (
    <div id="revision-page-container" className="space-y-8 pb-12">
      {/* Header Banner with 14-Day Simulation */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-cyan-500/30 shadow-2xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-xs font-semibold text-amber-300">
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Mandatory 2-Week Spaced Revision Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
              Retention Decay & Revision Checkpoint
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              In accordance with Ebbinghaus memory decay curves, knowledge decays if not reinforced. AdaptiveLearn measures Retention independently from Mastery to stop silent forgetting before it harms exam results.
            </p>
          </div>

          <button
            id="btn-revision-simulate-14"
            onClick={onSimulate14Days}
            title="Fast-forward time by 14 days"
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all shrink-0 active:scale-95"
          >
            <FastForward className="w-4 h-4" />
            <span>Simulate 14 Days Time Passage</span>
          </button>
        </div>
      </div>

      {/* Critical Demonstration: Mastery vs Retention Split (Section 16) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-base font-bold text-white font-display">
              Topic Retention Analyzer
            </h2>
            <p className="text-xs text-slate-400">
              Select any topic to observe its independent mastery and retention state:
            </p>
          </div>

          <select
            value={selectedTopicId}
            onChange={(e) => {
              setSelectedTopicId(e.target.value);
              setIsTestRunning(false);
              setIsTestFinished(false);
            }}
            className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-cyan-300 text-xs font-semibold outline-none"
          >
            {Object.values(TOPICS).map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        {/* Dual Gauge Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Mastery Gauge */}
          <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">Deterministic Mastery</span>
              <span className="text-2xl font-black text-cyan-300 font-display">
                {Math.round(activePerf.mastery)}%
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-cyan-400 rounded-full transition-all duration-500"
                style={{ width: `${activePerf.mastery}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400">
              Reflects problem-solving accuracy, speed, and consistency when actively learning.
            </p>
          </div>

          {/* Retention Gauge */}
          <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">2-Week Retention Index</span>
              <span className={`text-2xl font-black font-display ${status.colorClass}`}>
                {Math.round(activePerf.retention)}%
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-amber-400 rounded-full transition-all duration-500"
                style={{ width: `${activePerf.retention}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400">
              Decayed over {activePerf.daysSinceLastLearning} days without active recall.
            </p>
          </div>
        </div>

        {/* High Mastery / Low Retention Explanatory Alert */}
        {status.isHighMasteryLowRetention && (
          <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 space-y-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
              <h3 className="font-bold text-sm text-amber-300">
                Evaluation Example Confirmed: Strong Mastery ({Math.round(activePerf.mastery)}%), but Retention Needs Reinforcement ({Math.round(activePerf.retention)}%)!
              </h3>
            </div>
            <p className="text-xs leading-relaxed text-amber-200/90">
              Because 14 days passed since your last learning session on <strong>{TOPICS[selectedTopicId]?.name}</strong>, your neural recall pathways have decayed despite your solid foundational understanding.
            </p>

            {/* Auto-Generated Reinforcement Plan (Section 18) */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-amber-500/30 space-y-2 text-xs">
              <span className="font-bold text-amber-300 block">
                System-Generated Reinforcement Action Plan:
              </span>
              <ol className="list-decimal list-inside space-y-1 text-slate-300">
                <li>Automated conceptual recap with AI Tutor</li>
                <li>Targeted 4-question spaced retrieval test (below)</li>
                <li>Code reconstruction practice on traversal edge cases</li>
                <li>Automatic retention recalculation upon test completion</li>
              </ol>
            </div>
          </div>
        )}

        {/* 2-Week Revision Test Interface */}
        {!isTestRunning && !isTestFinished && (
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <div className="text-xs text-slate-400">
              Ready to verify recall and restore retention index to 90%+?
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => onOpenTutor(TOPICS[selectedTopicId]?.name || selectedTopicId)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-cyan-300 border border-cyan-500/30 text-xs font-semibold"
              >
                Concept Recap with AI Tutor
              </button>
              <button
                id="btn-start-revision-test"
                onClick={handleStartTest}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-md"
              >
                Take 2-Week Revision Test →
              </button>
            </div>
          </div>
        )}

        {/* Active Test Card */}
        {isTestRunning && testQuestions.length > 0 && (
          <div className="p-6 rounded-2xl bg-slate-950 border border-cyan-500/30 space-y-5 animate-in fade-in">
            <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-3">
              <span className="font-bold text-cyan-400">
                Retention Test Question {testQuestionIndex + 1} of {testQuestions.length}
              </span>
              <span className="text-slate-400">
                Target: {TOPICS[selectedTopicId]?.name}
              </span>
            </div>

            <div className="space-y-3">
              <p className="font-semibold text-sm text-slate-100 leading-relaxed">
                {testQuestions[testQuestionIndex].question}
              </p>
              {testQuestions[testQuestionIndex].codeSnippet && (
                <pre className="p-3 rounded-lg bg-slate-900 font-mono text-xs text-cyan-300">
                  <code>{testQuestions[testQuestionIndex].codeSnippet}</code>
                </pre>
              )}
            </div>

            <div className="space-y-2">
              {testQuestions[testQuestionIndex].options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedOption(idx)}
                  className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all ${
                    selectedOption === idx
                      ? 'bg-cyan-500/15 border-cyan-400 text-white font-semibold'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                disabled={selectedOption === null}
                onClick={handleAnswerTestQuestion}
                className="px-5 py-2 rounded-xl bg-cyan-500 disabled:opacity-40 text-slate-950 font-bold text-xs"
              >
                Submit Response →
              </button>
            </div>
          </div>
        )}

        {/* Test Completion Card */}
        {isTestFinished && (
          <div className="p-6 rounded-2xl bg-slate-950 border border-emerald-500/30 space-y-4 text-center animate-in fade-in">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white font-display">
              Revision Test Completed!
            </h3>
            <p className="text-xs text-slate-300">
              You scored {testScore} out of {testQuestions.length}. Your retention index for{' '}
              <strong>{TOPICS[selectedTopicId]?.name}</strong> has been reinforced to{' '}
              <strong className="text-emerald-400">{Math.round(activePerf.retention)}%</strong>.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setIsTestFinished(false)}
                className="px-5 py-2 rounded-xl bg-slate-800 text-slate-200 text-xs font-semibold"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
