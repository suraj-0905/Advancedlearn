export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard';

export type MasteryClass = 'Beginner' | 'Developing' | 'Proficient' | 'Advanced';

export type ResourceType =
  | 'Video'
  | 'Notes'
  | 'Coding tutorial'
  | 'Coding exercise'
  | 'MCQ'
  | 'Interactive activity'
  | 'Case study'
  | 'Mini project';

export type ErrorCategory =
  | 'Syntax'
  | 'Logic'
  | 'Algorithm selection'
  | 'Complexity'
  | 'Edge case'
  | 'Conceptual misunderstanding';

export type StudentGoal =
  | 'Score 85%+ this semester'
  | 'Prepare for placements'
  | 'Prepare for technical interviews'
  | 'Build programming skills'
  | 'Improve weak subjects'
  | 'Learn a specific technology'
  | 'Prepare university examinations';

export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  branch: 'CSE' | 'ECE' | 'EE' | 'ME' | 'CE' | 'BT' | 'IT';
  semester: number;
  careerGoal: string;
  academicGoals: StudentGoal[];
  strongTopics: string[];
  difficultTopics: string[];
  availableTimeMinutes: number;
  preferredFormats: ResourceType[];
  enrolledSubjectIds: string[];
  currentStreak: number;
  totalStudyMinutes: number;
  totalQuestionsSolved: number;
  lastActiveTimestamp: string;
  registeredAt: string;
  diagnosticCompleted: boolean;
}

export interface SkillNode {
  id: string;
  name: string;
  topicId: string;
  description: string;
  prerequisiteSkillIds: string[];
  importance: 'Core' | 'High' | 'Medium';
}

export interface Topic {
  id: string;
  name: string;
  subjectId: string;
  moduleId: string;
  description: string;
  prerequisiteTopicIds: string[];
  difficulty: DifficultyLevel;
  skills: SkillNode[];
  estimatedHours: number;
  iconName: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  semester: number;
  branch: string;
  description: string;
  topicIds: string[];
  icon: string;
  credits?: number;
}

export interface StudentPerformance {
  studentId: string;
  topicId: string;
  assessmentPerformance: number; // 0 - 100
  practicePerformance: number;    // 0 - 100
  recentPerformance: number;      // 0 - 100
  consistency: number;            // 0 - 100
  mastery: number;                // 0.5*assessment + 0.2*practice + 0.15*recent + 0.15*consistency
  retention: number;              // 0 - 100 calculated independently
  lastPracticed: string;          // ISO date
  lastAssessed: string;           // ISO date
  daysSinceLastLearning: number;  // For retention decay
  questionsAttempted: number;
  questionsCorrect: number;
  averageTimeSeconds: number;
  currentDifficulty: DifficultyLevel;
  errorPatterns?: Record<ErrorCategory, number>;
}

export interface Question {
  id: string;
  topicId: string;
  skillId?: string;
  difficulty: DifficultyLevel;
  question: string;
  codeSnippet?: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  errorCategory?: ErrorCategory;
  hint?: string;
  optimizationAdvice?: string;
}

export interface ResourceItem {
  id: string;
  title: string;
  subjectId: string;
  topicId: string;
  type: ResourceType;
  difficulty: DifficultyLevel;
  estimatedDuration: string; // e.g. "15 mins"
  durationMinutes: number;
  objective: string;
  prerequisite: string;
  url: string;
  provider?: string;
}

export interface LearningPathItem {
  id: string;
  stepNumber: number;
  topicId: string;
  topicName: string;
  actionTitle: string;
  actionType: 'Learn Fundamentals' | 'Practice Problems' | 'Concept Revision' | 'Targeted Exercises' | 'Mini Assessment' | 'Advanced Optimization';
  difficulty: DifficultyLevel;
  estimatedMinutes: number;
  recommendedReason: string;
  prerequisiteReason?: string;
  completed: boolean;
  resourceId?: string;
  currentMastery: number;
  currentRetention: number;
  status?: 'Active' | 'Next' | 'Locked' | 'Completed' | 'current' | 'locked' | 'completed';
}

export interface SupportTicket {
  id: string;
  studentId: string;
  subject: string;
  category: 'Technical' | 'Academic' | 'Content' | 'Feedback' | string;
  priority: 'Low' | 'Medium' | 'High' | string;
  description: string;
  status: 'Open' | 'In Progress' | 'Resolved' | string;
  createdAt: string;
  updatedAt: string;
}

export interface LearningGoal {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  progressPercent: number;
  status: 'In Progress' | 'Completed' | 'Upcoming';
  category: 'Academics' | 'Placement' | 'Skill';
}

export interface HelpTicket {
  id: string;
  studentId: string;
  studentName: string;
  category: 'AI Tutor' | 'Login/account' | 'Assessment/quiz' | 'Coding/practice' | 'Learning path' | 'Resources/video' | 'Leaderboard' | 'Technical issues';
  subject: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  status: 'Open' | 'In Progress' | 'Resolved';
  createdAt: string;
  updatedAt: string;
  resolutionNote?: string;
}

export interface LeaderboardEntry {
  rank: number;
  studentId: string;
  studentName: string;
  branch: string;
  semester: number;
  topicsCovered: number; // mastery >= 60%
  questionsSolved: number;
  points: number; // 100 * topicsCovered + 2 * questionsSolved
  isCurrentStudent?: boolean;
}

export type ThemeMode = 'dark' | 'light' | 'system';

export type TutorState =
  | 'ready'
  | 'thinking'
  | 'finding_concept'
  | 'building_explanation'
  | 'adding_example'
  | 'explanation_ready';
