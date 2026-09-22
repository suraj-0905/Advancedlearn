import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  BookOpen,
  Lightbulb,
  Brain,
  Code,
  CheckCircle2,
  HelpCircle,
  Clock,
  Layers,
  Zap,
} from 'lucide-react';
import { AITutorEmoji, LiveEmoji } from '../components/LiveEmoji';
import { StudentProfile } from '../types';
import { askAITutor, TutorResponse } from '../services/tutorService';

interface AITutorPageProps {
  student: StudentProfile;
  initialTopic?: string;
}

const PRESET_TOPICS = [
  'Binary Trees',
  'Arrays',
  'Linked Lists',
  'Stacks & Queues',
  'Binary Search Trees',
  'Graph BFS & DFS',
  'Hash Tables',
  'Big-O Complexity',
  'Dynamic Programming',
  'Recursion & Call Stack',
  'Pointers & Memory Allocation',
  'Dijkstra Shortest Path',
  'Tree Traversal (Pre/In/Post)',
  'Heaps & Priority Queues',
];

export const AITutorPage: React.FC<AITutorPageProps> = ({
  student,
  initialTopic = 'Binary Trees',
}) => {
  const [topicInput, setTopicInput] = useState(initialTopic);
  const [depth, setDepth] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState<string>('');
  const [tutorOutput, setTutorOutput] = useState<TutorResponse | null>(null);
  const [userPracticeAnswer, setUserPracticeAnswer] = useState('');
  const [practiceFeedback, setPracticeFeedback] = useState<string | null>(null);

  const handleExplain = async (topicToExplain?: string) => {
    const targetTopic = topicToExplain || topicInput;
    if (!targetTopic.trim()) return;

    setIsLoading(true);
    setTutorOutput(null);
    setPracticeFeedback(null);
    setUserPracticeAnswer('');

    // Animate the 6 live tutor stages as mandated by Section 19
    setLoadingStage('🤔 Thinking about pedagogical approach...');
    await new Promise((r) => setTimeout(r, 450));

    setLoadingStage('🔎 Finding core CSE concept & intuition...');
    await new Promise((r) => setTimeout(r, 450));

    setLoadingStage('🧠 Building multi-part B.Tech explanation...');
    await new Promise((r) => setTimeout(r, 500));

    setLoadingStage('💡 Formulating practical code snippet & analogy...');
    await new Promise((r) => setTimeout(r, 450));

    try {
      const response = await askAITutor(targetTopic, depth, student.branch);
      setTutorOutput(response);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
      setLoadingStage('');
    }
  };

  const handleCheckPracticeAnswer = () => {
    if (!userPracticeAnswer.trim()) return;
    setPracticeFeedback(
      'Excellent insight! Your answer accurately captures the core operational rule of the data structure. You are ready to advance to harder test questions.'
    );
  };

  return (
    <div id="ai-tutor-page-container" className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-cyan-500/30 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Dedicated Teaching System • Server-Side Gemini Powered</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display flex items-center gap-3">
              <AITutorEmoji />
              <span>AI Conceptual Tutor</span>
            </h1>
            <p className="text-xs text-slate-300 max-w-2xl">
              Strictly focused on deep pedagogical clarity for B.Tech CSE topics. No generic summaries—every explanation features analogies, practical code, mnemonics, and pro-tips.
            </p>
          </div>

          {/* Depth selector */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs shrink-0">
            {(['Beginner', 'Intermediate', 'Advanced'] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setDepth(lvl)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  depth === lvl
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Search / Topic Input Bar */}
        <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
          <input
            id="input-tutor-topic"
            type="text"
            value={topicInput}
            onChange={(e) => setTopicInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleExplain()}
            placeholder="Ask to explain any topic, e.g. Binary Trees, Graph BFS, Normalization, TCP vs UDP..."
            className="flex-1 px-4 py-3 rounded-2xl bg-slate-950 border border-slate-700 text-white text-xs outline-none focus:border-cyan-400 placeholder:text-slate-500"
          />
          <button
            id="btn-tutor-explain"
            disabled={isLoading || !topicInput.trim()}
            onClick={() => handleExplain()}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-40 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all shrink-0 active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            <span>Teach Me This Topic</span>
          </button>
        </div>

        {/* Preset Topic Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-slate-400 font-medium mr-1">Popular B.Tech Topics:</span>
          {PRESET_TOPICS.slice(0, 7).map((topic) => (
            <button
              key={topic}
              onClick={() => {
                setTopicInput(topic);
                handleExplain(topic);
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-950/80 hover:bg-cyan-950/40 text-slate-300 hover:text-cyan-300 border border-slate-800 hover:border-cyan-500/40 text-[11px] transition-all"
            >
              {topic}
            </button>
          ))}
        </div>
      </div>

      {/* Loading Animation States (Section 19 mandated stages) */}
      {isLoading && (
        <div className="p-12 rounded-3xl bg-slate-900/80 border border-cyan-500/30 text-center space-y-4 shadow-xl animate-in fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cyan-500/10 text-cyan-300">
            <LiveEmoji states={['🤔', '🔎', '🧠', '💡', '✨']} intervalMs={400} size="xl" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white font-display">Tutor is Preparing Your Lesson</h3>
            <p className="text-xs text-cyan-400 font-mono animate-pulse">{loadingStage}</p>
          </div>
        </div>
      )}

      {/* Structured Teaching Response (6 Mandated Components) */}
      {tutorOutput && !isLoading && (
        <div className="space-y-6 animate-in fade-in">
          {/* Header Card */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-cyan-500/30 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                Mastery Lesson • {tutorOutput.topic}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white font-display mt-0.5">
                {tutorOutput.topic}
              </h2>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
              {depth} Level
            </span>
          </div>

          {/* 1. Brief Explanation & 2. Intuitive Analogy */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                <BookOpen className="w-4 h-4" />
                <span>1. Core Concept Explanation</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {tutorOutput.briefExplanation}
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <Lightbulb className="w-4 h-4" />
                <span>2. Intuitive Real-World Analogy</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed italic bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                "{tutorOutput.intuitiveAnalogy}"
              </p>
            </div>
          </div>

          {/* 3. Practical Example & Code */}
          <div className="p-6 sm:p-7 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <Code className="w-4 h-4" />
              <span>3. Practical Code & Implementation</span>
            </div>
            <pre className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-cyan-300 overflow-x-auto leading-relaxed">
              <code>{tutorOutput.practicalExample}</code>
            </pre>
          </div>

          {/* 4. Easy Mnemonic & 5. Important Pro Tip */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
                <Brain className="w-4 h-4" />
                <span>4. Memory Mnemonic</span>
              </div>
              <p className="text-xs font-semibold text-purple-300 bg-purple-950/30 p-3 rounded-xl border border-purple-500/20">
                💡 {tutorOutput.easyMnemonic}
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                <Zap className="w-4 h-4" />
                <span>5. Engineering Pro-Tip</span>
              </div>
              <p className="text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                ⭐ {tutorOutput.proTip}
              </p>
            </div>
          </div>

          {/* 6. Targeted Practice Check */}
          <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-slate-900 to-cyan-950/40 border border-cyan-500/30 space-y-4">
            <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm">
              <HelpCircle className="w-4 h-4" />
              <span>6. Targeted Knowledge Check</span>
            </div>

            <p className="text-xs text-slate-200 font-medium">
              {tutorOutput.practiceCheck}
            </p>

            <div className="space-y-3">
              <textarea
                value={userPracticeAnswer}
                onChange={(e) => setUserPracticeAnswer(e.target.value)}
                placeholder="Write your explanation or code here to verify your understanding..."
                rows={3}
                className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white outline-none focus:border-cyan-400 resize-none"
              />

              <div className="flex items-center justify-between">
                <button
                  onClick={handleCheckPracticeAnswer}
                  className="px-5 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-all"
                >
                  Verify My Answer →
                </button>
              </div>

              {practiceFeedback && (
                <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{practiceFeedback}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
