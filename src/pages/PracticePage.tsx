import React, { useState, useEffect } from 'react';
import { PenTool, CheckCircle2, XCircle, ArrowRight, Sparkles, Clock, AlertCircle, RotateCcw } from 'lucide-react';
import { QUESTIONS_BANK, TOPICS } from '../data/mockData';
import { Question, StudentPerformance, StudentProfile } from '../types';
import { recordQuestionAttempt, determineAdaptiveDifficulty } from '../algorithms/masteryEngine';
import { LiveEmoji } from '../components/LiveEmoji';

interface PracticePageProps {
  student: StudentProfile;
  performances: Record<string, StudentPerformance>;
  selectedTopicId?: string;
  onUpdatePerformance: (topicId: string, updated: StudentPerformance, pointsEarned: number) => void;
  onNavigateToTab: (tab: string) => void;
}

export const PracticePage: React.FC<PracticePageProps> = ({
  student,
  performances,
  selectedTopicId = 'trees',
  onUpdatePerformance,
  onNavigateToTab,
}) => {
  const [activeTopicId, setActiveTopicId] = useState<string>(selectedTopicId);
  const [sessionQuestionCount, setSessionQuestionCount] = useState<number>(5);
  const [sessionQuestions, setSessionQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [isSessionFinished, setIsSessionFinished] = useState(false);
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());
  const [sessionResults, setSessionResults] = useState<{ isCorrect: boolean; time: number }[]>([]);
  const [lastMasteryDelta, setLastMasteryDelta] = useState<number | null>(null);
  const [lastOldDifficulty, setLastOldDifficulty] = useState<string | null>(null);
  const [lastNewDifficulty, setLastNewDifficulty] = useState<string | null>(null);

  // Initialize questions for active topic
  useEffect(() => {
    const perf = performances[activeTopicId];
    const difficulty = perf?.currentDifficulty || 'Medium';

    let topicQuestions = QUESTIONS_BANK.filter((q) => q.topicId === activeTopicId);
    if (topicQuestions.length === 0) {
      topicQuestions = QUESTIONS_BANK;
    }

    // Shuffle and pick desired count
    const picked = [...topicQuestions].sort(() => 0.5 - Math.random()).slice(0, sessionQuestionCount);
    // If not enough, cycle
    while (picked.length < sessionQuestionCount && topicQuestions.length > 0) {
      picked.push(topicQuestions[picked.length % topicQuestions.length]);
    }

    setSessionQuestions(picked);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setIsSessionFinished(false);
    setSessionResults([]);
    setQuestionStartTime(Date.now());
  }, [activeTopicId, sessionQuestionCount]);

  const currentQuestion = sessionQuestions[currentIndex];
  const activePerf = performances[activeTopicId] || {
    studentId: student.id,
    topicId: activeTopicId,
    assessmentPerformance: 50,
    practicePerformance: 50,
    recentPerformance: 50,
    consistency: 60,
    mastery: 50,
    retention: 60,
    lastPracticed: new Date().toISOString(),
    lastAssessed: new Date().toISOString(),
    daysSinceLastLearning: 0,
    questionsAttempted: 0,
    questionsCorrect: 0,
    averageTimeSeconds: 40,
    currentDifficulty: 'Medium' as const,
  };

  const handleSelectOption = (idx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null || !currentQuestion) return;

    const timeSpent = Math.max(3, Math.round((Date.now() - questionStartTime) / 1000));
    const isCorrect = selectedOption === currentQuestion.correctAnswer;

    // Calculate adaptive engine delta
    const oldMastery = activePerf.mastery;
    const oldDiff = activePerf.currentDifficulty;
    const updatedPerf = recordQuestionAttempt(activePerf, isCorrect, timeSpent);
    const delta = Math.round(updatedPerf.mastery - oldMastery);

    setLastMasteryDelta(delta);
    setLastOldDifficulty(oldDiff);
    setLastNewDifficulty(updatedPerf.currentDifficulty);

    setSessionResults((prev) => [...prev, { isCorrect, time: timeSpent }]);
    setIsAnswerSubmitted(true);

    // Points earned: 2 points per correct question
    onUpdatePerformance(activeTopicId, updatedPerf, isCorrect ? 2 : 0);
  };

  const handleNext = () => {
    if (currentIndex < sessionQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
      setQuestionStartTime(Date.now());
      setLastMasteryDelta(null);
    } else {
      setIsSessionFinished(true);
    }
  };

  const handleRestartSession = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setIsSessionFinished(false);
    setSessionResults([]);
    setQuestionStartTime(Date.now());
  };

  return (
    <div id="practice-page-container" className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Topic Switcher & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400">
            <PenTool className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white font-display">Adaptive Practice Center</h1>
            <p className="text-xs text-slate-400">
              Questions adjust dynamically based on your performance speed and correctness.
            </p>
          </div>
        </div>

        {/* Topic Selector dropdown */}
        <div className="flex items-center gap-2">
          <select
            id="practice-topic-selector"
            value={activeTopicId}
            onChange={(e) => setActiveTopicId(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-cyan-300 text-xs font-semibold outline-none focus:border-cyan-400"
          >
            {Object.values(TOPICS).map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} (Mastery: {Math.round(performances[t.id]?.mastery || 40)}%)
              </option>
            ))}
          </select>

          {/* Question Count selector */}
          <div className="flex items-center bg-slate-950 rounded-xl p-1 border border-slate-800 text-xs">
            {[5, 10, 15].map((cnt) => (
              <button
                key={cnt}
                onClick={() => setSessionQuestionCount(cnt)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  sessionQuestionCount === cnt
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {cnt} Qs
              </button>
            ))}
          </div>
        </div>
      </div>

      {!isSessionFinished && currentQuestion ? (
        /* Active Question Card */
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-cyan-500/30 shadow-2xl space-y-6">
          {/* Header Row: Question X of Y & Live Emojis */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-cyan-400">
                Question {currentIndex + 1} of {sessionQuestions.length}
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-400 font-medium">
                {TOPICS[currentQuestion.topicId]?.name || currentQuestion.topicId}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                  currentQuestion.difficulty === 'Easy'
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : currentQuestion.difficulty === 'Hard'
                    ? 'bg-rose-500/20 text-rose-300'
                    : 'bg-amber-500/20 text-amber-300'
                }`}
              >
                Difficulty: {currentQuestion.difficulty}
              </span>

              {/* Animated Live Emoji State */}
              <div className="pl-2 border-l border-slate-800">
                {!isAnswerSubmitted ? (
                  <LiveEmoji states={['✏️', '🤔']} intervalMs={2000} size="sm" />
                ) : selectedOption === currentQuestion.correctAnswer ? (
                  <LiveEmoji states={['✅', '🎉']} intervalMs={1500} size="sm" />
                ) : (
                  <LiveEmoji states={['❌', '💡']} intervalMs={1500} size="sm" />
                )}
              </div>
            </div>
          </div>

          {/* Question Text */}
          <div className="space-y-3">
            <h2 className="text-base sm:text-lg font-semibold text-slate-100 leading-relaxed">
              {currentQuestion.question}
            </h2>

            {currentQuestion.codeSnippet && (
              <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-cyan-300 overflow-x-auto leading-relaxed">
                <code>{currentQuestion.codeSnippet}</code>
              </pre>
            )}
          </div>

          {/* Option Buttons */}
          <div className="space-y-2.5">
            {currentQuestion.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrectAnswer = idx === currentQuestion.correctAnswer;

              let btnStyle = 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700';

              if (isAnswerSubmitted) {
                if (isCorrectAnswer) {
                  btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-200 font-medium shadow-sm';
                } else if (isSelected && !isCorrectAnswer) {
                  btnStyle = 'bg-rose-500/20 border-rose-500 text-rose-200';
                }
              } else if (isSelected) {
                btnStyle = 'bg-cyan-500/15 border-cyan-400 text-white font-medium shadow-md shadow-cyan-500/10';
              }

              return (
                <button
                  key={idx}
                  id={`practice-opt-${idx}`}
                  disabled={isAnswerSubmitted}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full text-left p-4 rounded-xl border text-xs sm:text-sm transition-all flex items-center justify-between ${btnStyle}`}
                >
                  <span>{opt}</span>
                  <div className="flex items-center gap-2 ml-2 shrink-0">
                    {isAnswerSubmitted && isCorrectAnswer && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    )}
                    {isAnswerSubmitted && isSelected && !isCorrectAnswer && (
                      <XCircle className="w-4 h-4 text-rose-400" />
                    )}
                    <span className="w-5 h-5 rounded-full border border-slate-700 flex items-center justify-center text-[10px] text-slate-400">
                      {String.fromCharCode(65 + idx)}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Real-time Feedback & Mastery Delta (Section 14) */}
          {isAnswerSubmitted && (
            <div className="space-y-4 p-5 rounded-2xl bg-slate-950/80 border border-slate-800 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-sm">
                  {selectedOption === currentQuestion.correctAnswer ? (
                    <span className="text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> Correct Answer!
                    </span>
                  ) : (
                    <span className="text-rose-400 flex items-center gap-1.5">
                      <XCircle className="w-4 h-4" /> Incorrect Answer
                    </span>
                  )}
                </div>

                {/* Immediate Mastery Delta */}
                {lastMasteryDelta !== null && (
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-400">Mastery Delta:</span>
                    <span
                      className={`font-black px-2 py-0.5 rounded ${
                        lastMasteryDelta >= 0
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-rose-500/20 text-rose-300'
                      }`}
                    >
                      {lastMasteryDelta >= 0 ? `+${lastMasteryDelta}%` : `${lastMasteryDelta}%`}
                    </span>
                    {lastOldDifficulty !== lastNewDifficulty && (
                      <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold text-[10px]">
                        Difficulty updated: {lastNewDifficulty}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Error Category Tagging */}
              {selectedOption !== currentQuestion.correctAnswer && (
                <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-[11px] text-rose-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>
                    <strong>Diagnostic Error Tag:</strong> Conceptual misunderstanding regarding tree topology / traversal order.
                  </span>
                </div>
              )}

              {/* Detailed Explanation */}
              <div className="text-xs text-slate-300 space-y-1">
                <span className="font-semibold text-cyan-300 block">Explanation:</span>
                <p className="leading-relaxed">{currentQuestion.explanation}</p>
              </div>
            </div>
          )}

          {/* Action Row */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <span className="text-xs text-slate-500">
              Current Topic Mastery: <strong className="text-cyan-400">{Math.round(activePerf.mastery)}%</strong>
            </span>

            {!isAnswerSubmitted ? (
              <button
                id="btn-submit-answer"
                disabled={selectedOption === null}
                onClick={handleSubmitAnswer}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-bold text-xs shadow-md transition-all active:scale-95"
              >
                <span>Submit Answer</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                id="btn-next-practice-question"
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md transition-all active:scale-95"
              >
                <span>{currentIndex === sessionQuestions.length - 1 ? 'View Session Summary' : 'Next Question'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Practice Session Summary */
        <div className="p-8 rounded-3xl bg-slate-900 border border-cyan-500/30 shadow-2xl space-y-6 text-center animate-in fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cyan-500/20 text-cyan-300 mb-2">
            <LiveEmoji states={['🎉', '🏆', '✨']} intervalMs={1500} size="xl" />
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-white font-display">Practice Session Complete!</h2>
            <p className="text-xs text-slate-400">
              Your deterministic mastery score has updated across the platform.
            </p>
          </div>

          {/* Quick Score Metrics */}
          <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-[11px] text-slate-400 block">Score</span>
              <span className="text-xl font-bold text-cyan-300">
                {sessionResults.filter((r) => r.isCorrect).length} / {sessionResults.length}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-[11px] text-slate-400 block">New Mastery</span>
              <span className="text-xl font-bold text-emerald-400">
                {Math.round(activePerf.mastery)}%
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-[11px] text-slate-400 block">Difficulty</span>
              <span className="text-xl font-bold text-amber-400">
                {activePerf.currentDifficulty}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <button
              onClick={handleRestartSession}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-semibold transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Practice More Questions</span>
            </button>

            <button
              onClick={() => onNavigateToTab('dashboard')}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs shadow-md transition-all"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
