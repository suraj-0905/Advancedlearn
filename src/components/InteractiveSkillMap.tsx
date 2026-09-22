import React, { useState } from 'react';
import { motion } from 'motion/react';
import { TOPICS, SUBJECTS } from '../data/mockData';
import { StudentPerformance, Topic } from '../types';
import { classifyMastery, getMasteryClassBadge } from '../algorithms/masteryEngine';
import { getRetentionStatus } from '../algorithms/retentionEngine';
import {
  Layers,
  ArrowRight,
  Sparkles,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Clock,
  X,
} from 'lucide-react';

interface InteractiveSkillMapProps {
  performances: Record<string, StudentPerformance>;
  onSelectTopicForPractice?: (topicId: string) => void;
  onSelectTopicForTutor?: (topicId: string) => void;
}

export const InteractiveSkillMap: React.FC<InteractiveSkillMapProps> = ({
  performances,
  onSelectTopicForPractice,
  onSelectTopicForTutor,
}) => {
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>('trees');
  const [filterSubject, setFilterSubject] = useState<string>('all');

  const topicList = Object.values(TOPICS);
  const filteredTopics = filterSubject === 'all'
    ? topicList
    : topicList.filter((t) => t.subjectId === filterSubject);

  const selectedTopic = selectedTopicId ? TOPICS[selectedTopicId] : null;
  const selectedPerf = selectedTopicId ? performances[selectedTopicId] : null;

  return (
    <div id="interactive-skill-map-container" className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-800/80">
        <div className="flex flex-wrap items-center gap-2">
          <button
            id="filter-subject-all"
            onClick={() => setFilterSubject('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filterSubject === 'all'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            All Subjects ({topicList.length})
          </button>
          {SUBJECTS.map((sub) => (
            <button
              key={sub.id}
              id={`filter-subject-${sub.id}`}
              onClick={() => setFilterSubject(sub.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filterSubject === sub.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              {sub.name}
            </button>
          ))}
        </div>

        {/* Legend */}
        <div className="hidden lg:flex items-center gap-3 text-[11px] text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span> Advanced (80+)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span> Proficient (60-79)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span> Developing (40-59)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400"></span> Beginner (&lt;40)
          </span>
        </div>
      </div>

      {/* Main Grid: Node Network & Detail Drawer */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Nodes Canvas/Grid */}
        <div className="xl:col-span-2 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredTopics.map((topic) => {
              const perf = performances[topic.id];
              const mastery = perf?.mastery ?? 40;
              const retention = perf?.retention ?? 50;
              const masteryClass = classifyMastery(mastery);
              const badge = getMasteryClassBadge(masteryClass);
              const retentionStatus = getRetentionStatus(mastery, retention);
              const isSelected = selectedTopicId === topic.id;

              return (
                <motion.div
                  key={topic.id}
                  id={`skill-node-${topic.id}`}
                  onClick={() => setSelectedTopicId(topic.id)}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className={`relative p-4 rounded-xl cursor-pointer transition-all duration-200 border ${
                    isSelected
                      ? 'bg-slate-800/90 border-cyan-400 shadow-lg shadow-cyan-500/10'
                      : 'bg-slate-900/60 hover:bg-slate-850 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {/* High Mastery / Low Retention alert badge */}
                  {retentionStatus.isHighMasteryLowRetention && (
                    <span className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950 flex items-center gap-1 shadow-md animate-bounce">
                      <AlertTriangle className="w-3 h-3" />
                      Revise
                    </span>
                  )}

                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                        <Layers className="w-4 h-4" />
                      </div>
                      <h4 className="font-semibold text-sm text-slate-100 line-clamp-1">
                        {topic.name}
                      </h4>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 mb-3 min-h-[32px]">
                    {topic.description}
                  </p>

                  {/* Prerequisites Preview */}
                  {topic.prerequisiteTopicIds.length > 0 && (
                    <div className="flex items-center gap-1 text-[11px] text-slate-400 mb-3">
                      <span className="text-slate-400">Prereq:</span>
                      <span className="text-cyan-400 truncate max-w-[130px]">
                        {topic.prerequisiteTopicIds.map((pid) => TOPICS[pid]?.name || pid).join(', ')}
                      </span>
                    </div>
                  )}

                  {/* Progress & Metrics */}
                  <div className="space-y-2 pt-2 border-t border-slate-800/80">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Mastery</span>
                      <span className={`font-bold ${badge.colorClass}`}>
                        {Math.round(mastery)}% ({masteryClass})
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          mastery >= 80 ? 'bg-emerald-400' : mastery >= 60 ? 'bg-cyan-400' : mastery >= 40 ? 'bg-amber-400' : 'bg-rose-400'
                        }`}
                        style={{ width: `${Math.max(5, Math.min(100, mastery))}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Retention</span>
                      <span className={`font-medium ${retentionStatus.colorClass}`}>
                        {Math.round(retention)}%
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Node Detail Drawer / Inspection Card */}
        <div className="xl:col-span-1">
          {selectedTopic && selectedPerf ? (
            <div
              id="skill-node-inspector"
              className="sticky top-20 p-5 rounded-2xl bg-slate-900/90 border border-cyan-500/30 shadow-xl space-y-5"
            >
              <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[11px] font-semibold tracking-wider uppercase text-cyan-400">
                    Topic Inspector
                  </span>
                  <h3 className="text-lg font-bold text-slate-100">{selectedTopic.name}</h3>
                </div>
                <button
                  onClick={() => setSelectedTopicId(null)}
                  className="text-slate-400 hover:text-slate-200 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedTopic.description}
              </p>

              {/* 4-Component Mastery Breakdown */}
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
                  <span>Deterministic Mastery</span>
                  <span className="text-cyan-400 font-bold text-sm">
                    {Math.round(selectedPerf.mastery)}%
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                  <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800/80">
                    <span className="text-slate-400 block">Assessment (50%)</span>
                    <span className="font-bold text-slate-200 text-xs">
                      {Math.round(selectedPerf.assessmentPerformance)}%
                    </span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800/80">
                    <span className="text-slate-400 block">Practice (20%)</span>
                    <span className="font-bold text-slate-200 text-xs">
                      {Math.round(selectedPerf.practicePerformance)}%
                    </span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800/80">
                    <span className="text-slate-400 block">Recent (15%)</span>
                    <span className="font-bold text-slate-200 text-xs">
                      {Math.round(selectedPerf.recentPerformance)}%
                    </span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800/80">
                    <span className="text-slate-400 block">Consistency (15%)</span>
                    <span className="font-bold text-slate-200 text-xs">
                      {Math.round(selectedPerf.consistency)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Retention & 2-Week Spaced State */}
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-300">2-Week Retention Index</span>
                  <span className="font-bold text-amber-400 text-sm">
                    {Math.round(selectedPerf.retention)}%
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  <span>
                    Last active: {selectedPerf.daysSinceLastLearning} days ago
                  </span>
                </div>
                {selectedPerf.mastery >= 75 && selectedPerf.retention <= 65 && (
                  <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>
                      <strong>High Mastery / Low Retention:</strong> Strong conceptual grasp, but retention is decaying. Take the 2-week revision checkpoint!
                    </span>
                  </div>
                )}
              </div>

              {/* Prerequisites Chain */}
              <div className="space-y-1.5 text-xs">
                <span className="font-medium text-slate-300">Prerequisite Dependencies</span>
                {selectedTopic.prerequisiteTopicIds.length > 0 ? (
                  <div className="space-y-1">
                    {selectedTopic.prerequisiteTopicIds.map((pid) => {
                      const pTopic = TOPICS[pid];
                      const pPerf = performances[pid];
                      const isMet = (pPerf?.mastery ?? 0) >= 60;
                      return (
                        <div
                          key={pid}
                          className="flex items-center justify-between p-2 rounded-lg bg-slate-950/40 border border-slate-800"
                        >
                          <span className="text-slate-200">{pTopic?.name || pid}</span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              isMet
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : 'bg-rose-500/20 text-rose-300'
                            }`}
                          >
                            {isMet ? 'Satisfied (>=60%)' : `Prereq Gap (${Math.round(pPerf?.mastery ?? 0)}%)`}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-slate-400 text-xs">Root foundational topic (no prerequisites).</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 space-y-2">
                <button
                  id="btn-practice-selected-topic"
                  onClick={() => onSelectTopicForPractice && onSelectTopicForPractice(selectedTopic.id)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-semibold text-xs tracking-wide shadow-md transition-all"
                >
                  <Flame className="w-4 h-4" />
                  Practice This Topic ({selectedPerf.currentDifficulty})
                </button>

                <button
                  id="btn-tutor-selected-topic"
                  onClick={() => onSelectTopicForTutor && onSelectTopicForTutor(selectedTopic.name)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-750 text-cyan-300 border border-cyan-500/30 font-medium text-xs tracking-wide transition-all"
                >
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  Learn with AI Tutor
                </button>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 text-center text-slate-400 text-xs">
              Click on any node in the Skill Map to inspect mastery breakdowns, prerequisite dependencies, and adaptive practice paths.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
