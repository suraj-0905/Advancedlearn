import { DifficultyLevel, MasteryClass, StudentPerformance } from '../types';

/**
 * Deterministic Mastery Engine
 * Mastery = 50% Assessment Performance + 20% Practice Performance + 15% Recent Performance + 15% Consistency
 */
export function calculateMastery(
  assessmentPerformance: number,
  practicePerformance: number,
  recentPerformance: number,
  consistency: number
): number {
  const mastery =
    0.50 * Math.max(0, Math.min(100, assessmentPerformance)) +
    0.20 * Math.max(0, Math.min(100, practicePerformance)) +
    0.15 * Math.max(0, Math.min(100, recentPerformance)) +
    0.15 * Math.max(0, Math.min(100, consistency));

  return Math.round(mastery * 10) / 10;
}

export function classifyMastery(mastery: number): MasteryClass {
  if (mastery >= 80) return 'Advanced';
  if (mastery >= 60) return 'Proficient';
  if (mastery >= 40) return 'Developing';
  return 'Beginner';
}

export function getMasteryClassBadge(masteryClass: MasteryClass): {
  label: string;
  colorClass: string;
  bgClass: string;
  borderClass: string;
} {
  switch (masteryClass) {
    case 'Advanced':
      return {
        label: 'Advanced',
        colorClass: 'text-emerald-400',
        bgClass: 'bg-emerald-500/10',
        borderClass: 'border-emerald-500/30',
      };
    case 'Proficient':
      return {
        label: 'Proficient',
        colorClass: 'text-cyan-400',
        bgClass: 'bg-cyan-500/10',
        borderClass: 'border-cyan-500/30',
      };
    case 'Developing':
      return {
        label: 'Developing',
        colorClass: 'text-amber-400',
        bgClass: 'bg-amber-500/10',
        borderClass: 'border-amber-500/30',
      };
    case 'Beginner':
    default:
      return {
        label: 'Beginner',
        colorClass: 'text-rose-400',
        bgClass: 'bg-rose-500/10',
        borderClass: 'border-rose-500/30',
      };
  }
}

/**
 * Topic-level Adaptive Difficulty:
 * Mastery >= 80%  -> Increase difficulty (Hard / Advanced)
 * 60 - 79%        -> Maintain difficulty (Medium / Proficient)
 * 40 - 59%        -> Add additional practice/revision (Medium/Developing)
 * < 40%           -> Reduce difficulty + reinforce prerequisites (Easy/Beginner)
 */
export function determineAdaptiveDifficulty(mastery: number): {
  difficulty: DifficultyLevel;
  strategy: string;
} {
  if (mastery >= 80) {
    return {
      difficulty: 'Hard',
      strategy: 'Advanced complexity & edge-case optimization',
    };
  } else if (mastery >= 60) {
    return {
      difficulty: 'Medium',
      strategy: 'Core problem-solving & application speed',
    };
  } else if (mastery >= 40) {
    return {
      difficulty: 'Medium',
      strategy: 'Targeted reinforcement exercises & guided hints',
    };
  } else {
    return {
      difficulty: 'Easy',
      strategy: 'Foundational concepts & prerequisite strengthening',
    };
  }
}

export function updatePerformanceWithPractice(
  current: StudentPerformance,
  correctCount: number,
  totalCount: number,
  avgTimeSeconds: number
): StudentPerformance {
  const sessionAccuracy = totalCount > 0 ? (correctCount / totalCount) * 100 : 0;
  
  // Recalculate practice performance as moving average
  const newPracticePerf = Math.round(current.practicePerformance * 0.7 + sessionAccuracy * 0.3);
  const newRecentPerf = Math.round(sessionAccuracy);
  const newConsistency = Math.min(100, current.consistency + (sessionAccuracy >= 60 ? 4 : -2));

  const newMastery = calculateMastery(
    current.assessmentPerformance,
    newPracticePerf,
    newRecentPerf,
    newConsistency
  );

  const { difficulty } = determineAdaptiveDifficulty(newMastery);

  return {
    ...current,
    practicePerformance: newPracticePerf,
    recentPerformance: newRecentPerf,
    consistency: newConsistency,
    mastery: newMastery,
    lastPracticed: new Date().toISOString(),
    daysSinceLastLearning: 0,
    questionsAttempted: current.questionsAttempted + totalCount,
    questionsCorrect: current.questionsCorrect + correctCount,
    averageTimeSeconds: Math.round((current.averageTimeSeconds + avgTimeSeconds) / 2),
    currentDifficulty: difficulty,
  };
}

export function recordQuestionAttempt(
  current: StudentPerformance,
  isCorrect: boolean,
  timeTakenSeconds: number
): StudentPerformance {
  return updatePerformanceWithPractice(
    current,
    isCorrect ? 1 : 0,
    1,
    timeTakenSeconds
  );
}

