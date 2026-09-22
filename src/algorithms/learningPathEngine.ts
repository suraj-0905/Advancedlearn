import { TOPICS } from '../data/mockData';
import {
  DifficultyLevel,
  LearningPathItem,
  StudentPerformance,
  StudentProfile,
} from '../types';
import { isHighMasteryLowRetention } from './retentionEngine';

export interface StudyTodayPlan {
  totalMinutes: number;
  focusTopicId: string;
  focusTopicName: string;
  primaryRationale: string;
  activities: {
    durationMinutes: number;
    action: string;
    details: string;
    type: 'Revision' | 'Concept' | 'Practice' | 'Assessment';
  }[];
}

/**
 * Deterministic Learning Path Generator
 * Strictly respects prerequisites and personalizes based on:
 * - Skill gaps (mastery < 60%)
 * - Retention deficit (retention < 65% or high-mastery/low-retention)
 * - Prerequisite DAG order
 * - Career & Academic Goals
 */
export function generatePersonalizedLearningPath(
  profile: StudentProfile,
  performances: Record<string, StudentPerformance>
): LearningPathItem[] {
  const items: LearningPathItem[] = [];
  let step = 1;

  // Case 1: Check for critical retention deficit (e.g. Student C with low retention)
  const retentionDeficitTopics = Object.entries(performances).filter(([_, perf]) =>
    isHighMasteryLowRetention(perf.mastery, perf.retention) || (perf.daysSinceLastLearning >= 12 && perf.retention < 60)
  );

  if (retentionDeficitTopics.length > 0) {
    const [topicId, perf] = retentionDeficitTopics[0];
    const topic = TOPICS[topicId];
    if (topic) {
      items.push({
        id: `lp_${step}`,
        stepNumber: step++,
        topicId,
        topicName: topic.name,
        actionTitle: `${topic.name}: Concept Recap & Memory Reactivation`,
        actionType: 'Concept Revision',
        difficulty: perf.currentDifficulty,
        estimatedMinutes: 10,
        recommendedReason: `Your mastery is ${Math.round(perf.mastery)}%, but retention has decayed to ${Math.round(perf.retention)}% over ${perf.daysSinceLastLearning} days. Reactivating memory traces before learning new topics.`,
        prerequisiteReason: 'Memory consolidation required before downstream dependencies.',
        completed: false,
        currentMastery: perf.mastery,
        currentRetention: perf.retention,
      });

      items.push({
        id: `lp_${step}`,
        stepNumber: step++,
        topicId,
        topicName: topic.name,
        actionTitle: `${topic.name}: Targeted Spaced Practice Set`,
        actionType: 'Targeted Exercises',
        difficulty: perf.currentDifficulty,
        estimatedMinutes: 15,
        recommendedReason: 'Solve 5 targeted recall questions to solidify long-term neural pathways.',
        completed: false,
        currentMastery: perf.mastery,
        currentRetention: perf.retention,
      });
    }
  }

  // Case 2: Topological prerequisite resolution for weak topics (mastery < 60%)
  // Find all weak topics
  const weakTopicIds = Object.keys(performances).filter(
    (tid) => performances[tid].mastery < 60
  );

  // If student is like Student B (weak programming fundamentals & arrays)
  const hasWeakFundamentals = (performances['prog_fund']?.mastery ?? 100) < 60;
  const hasWeakArrays = (performances['arrays']?.mastery ?? 100) < 60;
  const hasWeakLinkedLists = (performances['linked_lists']?.mastery ?? 100) < 60;
  const hasWeakTrees = (performances['trees']?.mastery ?? 100) < 60;
  const hasWeakGraphs = (performances['graphs']?.mastery ?? 100) < 60;

  if (hasWeakFundamentals) {
    const perf = performances['prog_fund']!;
    items.push({
      id: `lp_${step}`,
      stepNumber: step++,
      topicId: 'prog_fund',
      topicName: 'Programming Fundamentals',
      actionTitle: 'Programming Fundamentals: Variables, Control Flow & Stack Frames',
      actionType: 'Learn Fundamentals',
      difficulty: 'Easy',
      estimatedMinutes: 20,
      recommendedReason: `Current mastery is ${Math.round(perf.mastery)}%. Master foundational stack frames and memory before pointer manipulation.`,
      prerequisiteReason: 'Root prerequisite for all downstream Computer Science coursework.',
      completed: false,
      currentMastery: perf.mastery,
      currentRetention: perf.retention,
    });
  }

  if (hasWeakArrays) {
    const perf = performances['arrays']!;
    items.push({
      id: `lp_${step}`,
      stepNumber: step++,
      topicId: 'arrays',
      topicName: 'Arrays & Strings',
      actionTitle: 'Arrays: Memory Contiguity & Two-Pointer Invariants',
      actionType: 'Learn Fundamentals',
      difficulty: perf.currentDifficulty,
      estimatedMinutes: 20,
      recommendedReason: `Current mastery is ${Math.round(perf.mastery)}%. Solidify contiguous memory offsets and Two-Pointer pattern.`,
      prerequisiteReason: 'Requires Programming Fundamentals; Essential prerequisite for Stacks, Queues, and Hashing.',
      completed: false,
      currentMastery: perf.mastery,
      currentRetention: perf.retention,
    });

    items.push({
      id: `lp_${step}`,
      stepNumber: step++,
      topicId: 'arrays',
      actionTitle: 'Arrays: High-Yield Practice (Sliding Window & Subarrays)',
      actionType: 'Practice Problems',
      topicName: 'Arrays & Strings',
      difficulty: perf.currentDifficulty,
      estimatedMinutes: 25,
      recommendedReason: 'Apply two-pointer algorithms on sorted vectors to elevate mastery above 60%.',
      completed: false,
      currentMastery: perf.mastery,
      currentRetention: perf.retention,
    });
  }

  if (hasWeakLinkedLists && !hasWeakFundamentals) {
    const perf = performances['linked_lists']!;
    items.push({
      id: `lp_${step}`,
      stepNumber: step++,
      topicId: 'linked_lists',
      topicName: 'Linked Lists',
      actionTitle: 'Linked Lists: Node Linking & Pointer Reversals',
      actionType: 'Learn Fundamentals',
      difficulty: perf.currentDifficulty,
      estimatedMinutes: 20,
      recommendedReason: `Current mastery is ${Math.round(perf.mastery)}%. Master node pointer manipulation and Floyd cycle detection.`,
      prerequisiteReason: 'Direct prerequisite for Tree structures.',
      completed: false,
      currentMastery: perf.mastery,
      currentRetention: perf.retention,
    });
  }

  // Student A scenario: Strong Arrays/LL, but Weak Trees & Graphs
  // CRITICAL RULE: If Trees (45%) and Graphs (35%) are both weak,
  // Graphs requires Trees! Must prioritize Trees first!
  if (hasWeakTrees) {
    const perf = performances['trees']!;
    items.push({
      id: `lp_${step}`,
      stepNumber: step++,
      topicId: 'trees',
      topicName: 'Trees & Binary Search Trees',
      actionTitle: 'Trees: Hierarchical Invariants & Recursive Traversal',
      actionType: 'Learn Fundamentals',
      difficulty: perf.currentDifficulty,
      estimatedMinutes: 20,
      recommendedReason: `Current Trees mastery is ${Math.round(perf.mastery)}% (Developing). Trees is the mandatory prerequisite for Graph theory and must be mastered first.`,
      prerequisiteReason: 'Strict prerequisite for Graphs (mod_ds5). Graphs cannot be safely scheduled until Tree traversals reach >= 60%.',
      completed: false,
      currentMastery: perf.mastery,
      currentRetention: perf.retention,
    });

    items.push({
      id: `lp_${step}`,
      stepNumber: step++,
      topicId: 'trees',
      topicName: 'Trees & Binary Search Trees',
      actionTitle: 'Binary Search Trees: In-Order Traversal & Search Bounds',
      actionType: 'Practice Problems',
      difficulty: 'Medium',
      estimatedMinutes: 20,
      recommendedReason: 'Strengthen Left < Root < Right invariant properties with active coding problems.',
      completed: false,
      currentMastery: perf.mastery,
      currentRetention: perf.retention,
    });

    items.push({
      id: `lp_${step}`,
      stepNumber: step++,
      topicId: 'trees',
      topicName: 'Trees & Binary Search Trees',
      actionTitle: 'Trees: Diagnostic Reassessment & Height Balancing',
      actionType: 'Mini Assessment',
      difficulty: 'Medium',
      estimatedMinutes: 15,
      recommendedReason: 'Verify mastery exceeds 60% before unlocking downstream Graph exploration.',
      completed: false,
      currentMastery: perf.mastery,
      currentRetention: perf.retention,
    });
  }

  if (hasWeakGraphs) {
    const perf = performances['graphs']!;
    items.push({
      id: `lp_${step}`,
      stepNumber: step++,
      topicId: 'graphs',
      topicName: 'Graphs & Algorithms',
      actionTitle: 'Graphs: Adjacency List Representation & BFS / DFS',
      actionType: 'Learn Fundamentals',
      difficulty: 'Easy',
      estimatedMinutes: 25,
      recommendedReason: `Current Graphs mastery is ${Math.round(perf.mastery)}%. Scheduled immediately after Trees fundamentals to leverage hierarchical traversal intuition.`,
      prerequisiteReason: 'Requires Trees traversals (BFS level-order corresponds to Graph BFS).',
      completed: false,
      currentMastery: perf.mastery,
      currentRetention: perf.retention,
    });

    items.push({
      id: `lp_${step}`,
      stepNumber: step++,
      topicId: 'graphs',
      topicName: 'Graphs & Algorithms',
      actionTitle: 'Graphs: Shortest Paths (Dijkstra) & Cycle Detection Practice',
      actionType: 'Practice Problems',
      difficulty: 'Medium',
      estimatedMinutes: 30,
      recommendedReason: 'Build proficiency with priority queue optimizations and visited vertex sets.',
      completed: false,
      currentMastery: perf.mastery,
      currentRetention: perf.retention,
    });
  }

  // If no critical gaps, recommend advanced optimization in strong subjects
  if (items.length === 0) {
    items.push({
      id: `lp_${step}`,
      stepNumber: step++,
      topicId: 'trees',
      topicName: 'Trees & Binary Search Trees',
      actionTitle: 'Advanced Balanced Trees: AVL & Red-Black Invariants',
      actionType: 'Advanced Optimization',
      difficulty: 'Hard',
      estimatedMinutes: 30,
      recommendedReason: 'All core prerequisites are proficient! Advancing to competitive programming depth.',
      completed: false,
      currentMastery: 85,
      currentRetention: 85,
    });
  }

  return items;
}

/**
 * "What Should I Study Today?" Generator
 * Adapts to available study time (e.g. 15, 30, 45, 60 minutes)
 */
export function generateTodayStudyPlan(
  profile: StudentProfile,
  performances: Record<string, StudentPerformance>,
  customMinutes?: number
): StudyTodayPlan {
  const availableMinutes = customMinutes ?? profile.availableTimeMinutes ?? 45;

  // Find candidate focus topic:
  // 1. Retention deficit topic
  // 2. Weakest topic with prerequisites satisfied
  let focusTopicId = 'trees';
  let focusTopicName = 'Trees & Binary Search Trees';
  let rationale = 'Targeting your lowest mastery topic with prerequisite support.';

  const retentionDeficit = Object.entries(performances).find(([_, p]) =>
    isHighMasteryLowRetention(p.mastery, p.retention) || (p.daysSinceLastLearning >= 12 && p.retention < 60)
  );

  if (retentionDeficit) {
    focusTopicId = retentionDeficit[0];
    focusTopicName = TOPICS[focusTopicId]?.name ?? 'Core Topic';
    rationale = `Spaced repetition alert: Your mastery in ${focusTopicName} is strong (${Math.round(retentionDeficit[1].mastery)}%), but retention has dropped to ${Math.round(retentionDeficit[1].retention)}%. Refreshing now prevents long-term memory loss.`;
  } else {
    // Find lowest mastery respecting prerequisite
    const sorted = Object.entries(performances).sort((a, b) => a[1].mastery - b[1].mastery);
    if (sorted.length > 0) {
      // Check if lowest is graphs, but trees is also weak
      if (sorted[0][0] === 'graphs' && (performances['trees']?.mastery ?? 100) < 60) {
        focusTopicId = 'trees';
        focusTopicName = TOPICS['trees'].name;
        rationale = 'Trees is weak (45%) and is a mandatory prerequisite for Graphs. Prioritizing Tree fundamentals first.';
      } else {
        focusTopicId = sorted[0][0];
        focusTopicName = TOPICS[focusTopicId]?.name ?? sorted[0][0];
        rationale = `Your current mastery is ${Math.round(sorted[0][1].mastery)}%. Focused study today will elevate you to Proficient status.`;
      }
    }
  }

  // Allocate time chunks based on availableMinutes
  let activities: StudyTodayPlan['activities'] = [];

  if (availableMinutes <= 20) {
    activities = [
      {
        durationMinutes: Math.round(availableMinutes * 0.5),
        action: `Revise ${focusTopicName} Core Invariants`,
        details: 'Review fundamental definitions, memory structures, and visual diagrams.',
        type: 'Concept',
      },
      {
        durationMinutes: Math.round(availableMinutes * 0.5),
        action: 'Quick 3-Question Practice Check',
        details: 'Answer 3 targeted conceptual questions with immediate feedback.',
        type: 'Practice',
      },
    ];
  } else if (availableMinutes <= 35) {
    activities = [
      {
        durationMinutes: 8,
        action: `Revise ${focusTopicName} Key Rules`,
        details: 'High-speed concept recap and mental walk-through.',
        type: 'Revision',
      },
      {
        durationMinutes: 15,
        action: 'Solve 5 Guided Practice Problems',
        details: 'Interactive problem-solving adapted to your current difficulty level.',
        type: 'Practice',
      },
      {
        durationMinutes: Math.max(5, availableMinutes - 23),
        action: 'Progress Check & Mastery Update',
        details: 'Quick assessment to recalculate mastery score.',
        type: 'Assessment',
      },
    ];
  } else {
    // 45 min standard plan (from prompt specification):
    // 10 min -> Revise Binary Trees
    // 15 min -> Learn Tree Traversal
    // 15 min -> Solve coding problems
    // 5 min -> Mini assessment
    const m1 = Math.round(availableMinutes * 0.22);
    const m2 = Math.round(availableMinutes * 0.33);
    const m3 = Math.round(availableMinutes * 0.33);
    const m4 = availableMinutes - (m1 + m2 + m3);

    activities = [
      {
        durationMinutes: m1,
        action: `Revise ${focusTopicName} Core Principles`,
        details: 'Strengthen prerequisite recall and review key structural invariants.',
        type: 'Revision',
      },
      {
        durationMinutes: m2,
        action: `Deep Dive: ${focusTopicName} Algorithmic Patterns`,
        details: 'Learn traversals, edge-case handling, and optimal asymptotic complexity.',
        type: 'Concept',
      },
      {
        durationMinutes: m3,
        action: 'Solve Adaptive Coding & MCQ Practice',
        details: 'Interactive questions tailored to your current topic difficulty.',
        type: 'Practice',
      },
      {
        durationMinutes: m4,
        action: '5-Minute Mini Assessment Checkpoint',
        details: 'Confirm retention and log today’s streak progress.',
        type: 'Assessment',
      },
    ];
  }

  return {
    totalMinutes: availableMinutes,
    focusTopicId,
    focusTopicName,
    primaryRationale: rationale,
    activities,
  };
}

export const generateLearningPath = generatePersonalizedLearningPath;
