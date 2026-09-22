import { RESOURCES_CATALOG, TOPICS } from '../data/mockData';
import {
  ResourceItem,
  StudentPerformance,
  StudentProfile,
} from '../types';

export interface RecommendedResourceWithReason extends ResourceItem {
  recommendationScore: number;
  whyRecommended: string;
}

/**
 * Resource Recommendation Engine
 * Considers:
 * - Topic weakness (lower mastery gets higher priority)
 * - Retention deficit
 * - Prerequisite relationship
 * - Preferred resource format (Video, Notes, Interactive, Coding exercise)
 * - Available study time fit
 */
export function getRecommendedResources(
  profile: StudentProfile,
  performances: Record<string, StudentPerformance>,
  limit: number = 4
): RecommendedResourceWithReason[] {
  const scoredResources: RecommendedResourceWithReason[] = [];

  for (const res of RESOURCES_CATALOG) {
    const perf = performances[res.topicId];
    const topic = TOPICS[res.topicId];
    if (!topic) continue;

    let score = 50; // base score

    let whyReason = '';

    // Factor 1: Topic Mastery (lower mastery -> higher need)
    if (perf) {
      if (perf.mastery < 50) {
        score += 35;
        whyReason = `Your current ${topic.name} mastery is ${Math.round(perf.mastery)}%, requiring foundational reinforcement.`;
      } else if (perf.mastery < 70) {
        score += 20;
        whyReason = `Your ${topic.name} mastery is ${Math.round(perf.mastery)}%. Regular practice will push you into the Advanced tier.`;
      }

      // Factor 2: Retention deficit
      if (perf.retention < 65) {
        score += 25;
        whyReason = `Your ${topic.name} retention index is ${Math.round(perf.retention)}% (${perf.daysSinceLastLearning} days since last session). Spaced reactivation is crucial.`;
      }
    }

    // Factor 3: Prerequisite importance
    if (res.topicId === 'trees' && (performances['graphs']?.mastery ?? 100) < 60) {
      score += 30;
      whyReason = `Your current Trees mastery is ${Math.round(perf?.mastery ?? 45)}%, and Tree Traversal is a required prerequisite for the Graph module.`;
    }

    // Factor 4: Format preference
    if (profile.preferredFormats.includes(res.type)) {
      score += 15;
    }

    // Factor 5: Time fit
    if (res.durationMinutes <= profile.availableTimeMinutes) {
      score += 10;
    }

    if (!whyReason) {
      whyReason = `Aligned with your target goal: ${profile.careerGoal}.`;
    }

    scoredResources.push({
      ...res,
      recommendationScore: score,
      whyRecommended: whyReason,
    });
  }

  // Sort descending by score
  scoredResources.sort((a, b) => b.recommendationScore - a.recommendationScore);

  return scoredResources.slice(0, limit);
}
