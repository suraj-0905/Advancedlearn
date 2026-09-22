import { StudentPerformance } from '../types';

/**
 * Deterministic Retention Engine
 * Retention is calculated independently from mastery.
 *
 * newRetention = 0.30 * oldRetention + 0.70 * revisionScore
 */
export function calculateNewRetention(oldRetention: number, revisionScore: number): number {
  const result = 0.30 * oldRetention + 0.70 * revisionScore;
  return Math.round(Math.max(0, Math.min(100, result)) * 10) / 10;
}

/**
 * Retention decay calculation over time (Ebbinghaus spaced forgetting curve model)
 * After ~7 days, retention degrades gracefully unless refreshed.
 * At 14 days, retention drops by ~20-30 points without active revision.
 */
export function calculateRetentionDecay(initialRetention: number, daysElapsed: number): number {
  if (daysElapsed <= 2) return initialRetention;
  // Decay exponent
  const decayFactor = Math.exp(-0.035 * (daysElapsed - 2));
  const decayed = initialRetention * decayFactor;
  return Math.max(25, Math.round(decayed * 10) / 10);
}

export function isHighMasteryLowRetention(mastery: number, retention: number): boolean {
  return mastery >= 75 && retention <= 65;
}

export function getRetentionStatus(mastery: number, retention: number): {
  status: 'Optimal' | 'At Risk' | 'Needs Revision' | 'Reinforcing';
  label: string;
  description: string;
  isHighMasteryLowRetention: boolean;
  colorClass: string;
  badgeClass: string;
} {
  const highMasteryLowRetention = isHighMasteryLowRetention(mastery, retention);

  if (highMasteryLowRetention) {
    return {
      status: 'Needs Revision',
      label: 'High Mastery / Low Retention',
      description: 'Strong mastery, but retention needs reinforcement.',
      isHighMasteryLowRetention: true,
      colorClass: 'text-amber-400',
      badgeClass: 'bg-amber-500/15 border-amber-500/40 text-amber-300',
    };
  }

  if (retention >= 75) {
    return {
      status: 'Optimal',
      label: 'Retained Solidly',
      description: 'Memory traces are sharp. Spaced checkpoint on schedule.',
      isHighMasteryLowRetention: false,
      colorClass: 'text-emerald-400',
      badgeClass: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300',
    };
  } else if (retention >= 55) {
    return {
      status: 'At Risk',
      label: 'Moderate Retention',
      description: 'Recall latency increasing. Targeted review recommended.',
      isHighMasteryLowRetention: false,
      colorClass: 'text-cyan-400',
      badgeClass: 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300',
    };
  } else {
    return {
      status: 'Needs Revision',
      label: 'Critical Revision Due',
      description: 'High risk of memory decay. Rapid recap required.',
      isHighMasteryLowRetention: false,
      colorClass: 'text-rose-400',
      badgeClass: 'bg-rose-500/15 border-rose-500/40 text-rose-300',
    };
  }
}

/**
 * Generates an automated reinforcement plan when retention falls
 */
export function generateRetentionReinforcementPlan(topicName: string) {
  return [
    {
      step: 1,
      title: `${topicName}: 5-Min Concept Recap`,
      type: 'Concept Recap',
      durationMinutes: 5,
      description: 'High-yield refresher of core invariants, formulas, and visual memory anchors.',
    },
    {
      step: 2,
      title: `${topicName}: Guided Practice`,
      type: 'Practice',
      durationMinutes: 10,
      description: '3 multi-step questions with interactive hints to reactivate recall pathways.',
    },
    {
      step: 3,
      title: `${topicName}: Targeted Exercises`,
      type: 'Targeted Exercises',
      durationMinutes: 10,
      description: 'Solve 2 problems testing the exact failure vectors identified in revision.',
    },
    {
      step: 4,
      title: `${topicName}: Mini-Test & Reassessment`,
      type: 'Reassessment',
      durationMinutes: 5,
      description: 'Quick 3-question evaluation to confirm retention recovery back to >= 80%.',
    },
  ];
}

/**
 * Fast-forward simulation of 14 days
 */
export function simulate14DaysPassage(
  performances: Record<string, StudentPerformance>
): Record<string, StudentPerformance> {
  const updated: Record<string, StudentPerformance> = {};

  for (const [topicId, perf] of Object.entries(performances)) {
    const newDays = perf.daysSinceLastLearning + 14;
    const decayedRetention = calculateRetentionDecay(perf.retention, newDays);

    updated[topicId] = {
      ...perf,
      daysSinceLastLearning: newDays,
      retention: decayedRetention,
    };
  }

  return updated;
}

export function decayRetention(perf: StudentPerformance, days: number): StudentPerformance {
  const newDays = perf.daysSinceLastLearning + days;
  return {
    ...perf,
    daysSinceLastLearning: newDays,
    retention: calculateRetentionDecay(perf.retention, newDays),
  };
}

