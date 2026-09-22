import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2, Clock, AlertTriangle, ArrowRight, BookOpen, Layers } from 'lucide-react';
import { QUESTIONS_BANK, TOPICS } from '../data/mockData';
import { Question, StudentPerformance, StudentProfile } from '../types';
import { calculateMastery, determineAdaptiveDifficulty } from '../algorithms/masteryEngine';

interface DiagnosticPageProps {
  currentStudent: StudentProfile;
  onCompleteDiagnostic: (updatedPerformances: Record<string, StudentPerformance>) => void;
}

export const DiagnosticPage: React.FC<DiagnosticPageProps> = ({
  currentStudent,
  onCompleteDiagnostic,
}) => {
  // Select 10 questions covering diverse CSE topics
  const [questions] = useState<Question[]>(() => {
    return QUESTIONS_BANK.slice(0, 10);
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<number, { selected: number; isCorrect: boolean; timeSeconds: number }>>({});
  const [isFinished, setIsFinished] = useState(false);
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());
  const [topicScores, setTopicScores] = useState<Record<string, { total: number; correct: number; percent: number }>>({});

  const currentQ = questions[currentIndex];

  useEffect(() => {
    setQuestionStartTime(Date.now());
    setSelectedOption(null);
  }, [currentIndex]);

  const handleNextQuestion = () => {
    if (selectedOption === null) return;

    const timeSpent = Math.max(2, Math.round((Date.now() - questionStartTime) / 1000));
    const isCorrect = selectedOption === currentQ.correctAnswer;

    const updatedAnswers = {
      ...answers,
      [currentIndex]: {
        selected: selectedOption,
        isCorrect,
        timeSeconds: timeSpent,
      },
    };
    setAnswers(updatedAnswers);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Calculate topic-wise scores
      finishDiagnostic(updatedAnswers);
    }
  };

  const finishDiagnostic = (allAnswers: Record<number, { selected: number; isCorrect: boolean; timeSeconds: number }>) => {
    const scores: Record<string, { total: number; correct: number; percent: number }> = {};

    questions.forEach((q, idx) => {
      const ans = allAnswers[idx];
      if (!scores[q.topicId]) {
        scores[q.topicId] = { total: 0, correct: 0, percent: 0 };
      }
      scores[q.topicId].total += 1;
      if (ans && ans.isCorrect) {
        scores[q.topicId].correct += 1;
      }
    });

    for (const tid of Object.keys(scores)) {
      scores[tid].percent = Math.round((scores[tid].correct / scores[tid].total) * 100);
    }

    setTopicScores(scores);
    setIsFinished(true);
  };

  const handleProceedToDashboard = () => {
    // Generate new student performances from diagnostic
    const newPerformances: Record<string, StudentPerformance> = {};

    Object.keys(TOPICS).forEach((tid) => {
      const topicScore = topicScores[tid];
      const assessmentScore = topicScore ? topicScore.percent : 50; // default for untested topics
      const practiceScore = assessmentScore;
      const recentScore = assessmentScore;
      const consistency = 75;

      const mastery = calculateMastery(assessmentScore, practiceScore, recentScore, consistency);
      const { difficulty } = determineAdaptiveDifficulty(mastery);

      newPerformances[tid] = {
        studentId: currentStudent.id,
        topicId: tid,
        assessmentPerformance: assessmentScore,
        practicePerformance: practiceScore,
        recentPerformance: recentScore,
        consistency,
        mastery,
        retention: Math.min(95, assessmentScore + 10),
        lastPracticed: new Date().toISOString(),
        lastAssessed: new Date().toISOString(),
        daysSinceLastLearning: 0,
        questionsAttempted: topicScore?.total || 0,
        questionsCorrect: topicScore?.correct || 0,
        averageTimeSeconds: 45,
        currentDifficulty: difficulty,
      };
    });

    onCompleteDiagnostic(newPerformances);
  };

  return (
    <div id="diagnostic-assessment-page" className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-semibold text-cyan-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Foundational Diagnostic Assessment</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-white">
            Topic-Wise Knowledge Mapping
          </h1>
          <p className="text-xs text-slate-400">
            Determining what you already know, what is weak, and where prerequisites are missing.
          </p>
        </div>

        {!isFinished ? (
          /* Active Question Card */
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-cyan-500/30 shadow-2xl space-y-6">
            {/* Progress and Topic Tag */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 text-xs">
              <span className="font-semibold text-cyan-400">
                Question {currentIndex + 1} of {questions.length}
              </span>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 font-medium">
                  {TOPICS[currentQ.topicId]?.name || currentQ.topicId}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/15 text-cyan-300">
                  {currentQ.difficulty}
                </span>
              </div>
            </div>

            {/* Question Text */}
            <div className="space-y-3">
              <h2 className="text-sm sm:text-base font-semibold text-slate-100 leading-relaxed">
                {currentQ.question}
              </h2>

              {currentQ.codeSnippet && (
                <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-cyan-300 overflow-x-auto">
                  <code>{currentQ.codeSnippet}</code>
                </pre>
              )}
            </div>

            {/* Options */}
            <div className="space-y-2.5">
              {currentQ.options.map((opt, idx) => (
                <button
                  key={idx}
                  id={`diagnostic-opt-${idx}`}
                  onClick={() => setSelectedOption(idx)}
                  className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm transition-all flex items-center justify-between ${
                    selectedOption === idx
                      ? 'bg-cyan-500/15 border-cyan-400 text-white font-medium shadow-md shadow-cyan-500/10'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-950'
                  }`}
                >
                  <span>{opt}</span>
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] shrink-0 ml-2 ${
                      selectedOption === idx
                        ? 'border-cyan-400 bg-cyan-500 text-slate-950 font-bold'
                        : 'border-slate-700 text-slate-500'
                    }`}
                  >
                    {String.fromCharCode(65 + idx)}
                  </div>
                </button>
              ))}
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <span className="text-xs text-slate-500">
                Calculated independently per topic. No single score.
              </span>
              <button
                id="btn-next-diagnostic-question"
                disabled={selectedOption === null}
                onClick={handleNextQuestion}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-bold text-xs shadow-md transition-all"
              >
                <span>{currentIndex === questions.length - 1 ? 'Analyze Diagnostic' : 'Next Question'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* Diagnostic Results Breakdown */
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-cyan-500/30 shadow-2xl space-y-6 animate-in fade-in">
            <div className="text-center space-y-1">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300">
                Diagnostic Complete!
              </span>
              <h2 className="text-xl sm:text-2xl font-bold font-display text-white">
                Topic-Wise Baseline Identified
              </h2>
              <p className="text-xs text-slate-400">
                Notice that your score is not a single number; every topic is scored independently.
              </p>
            </div>

            {/* Topic Score Bars */}
            <div className="space-y-3">
              {Object.entries(topicScores).map(([tid, data]) => {
                const topic = TOPICS[tid];
                return (
                  <div key={tid} className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-200">{topic?.name || tid}</span>
                      <span className={data.percent >= 60 ? 'text-cyan-400' : 'text-amber-400'}>
                        {data.percent}% ({data.correct}/{data.total} correct)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          data.percent >= 75
                            ? 'bg-emerald-400'
                            : data.percent >= 50
                            ? 'bg-cyan-400'
                            : 'bg-amber-400'
                        }`}
                        style={{ width: `${Math.max(8, data.percent)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Launch Personalized Dashboard Button */}
            <div className="pt-2 text-center">
              <button
                id="btn-diagnostic-launch-dashboard"
                onClick={handleProceedToDashboard}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm shadow-xl shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
              >
                <span>Generate My Personalized Learning Path</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
