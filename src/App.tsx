/** @jsxRuntime classic */



import React, { useState, useEffect, useMemo } from 'react';
import {
  STUDENT_A_PROFILE,
  STUDENT_B_PROFILE,
  STUDENT_C_PROFILE,
  STUDENT_A_PERFORMANCES,
  STUDENT_B_PERFORMANCES,
  STUDENT_C_PERFORMANCES,
} from './data/mockData';
import { StudentPerformance, StudentProfile } from './types';
import { generateLearningPath } from './algorithms/learningPathEngine';
import { decayRetention } from './algorithms/retentionEngine';

// Components
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { DemoTourBar } from './components/DemoTourBar';
import { StudyTodayModal } from './components/StudyTodayModal';
import { InteractiveSkillMap } from './components/InteractiveSkillMap';
import { SplineLiveExperience } from './components/SplineLiveExperience';
import {
  DailyStreakCounter,
  getStudentStreakData,
  saveStudentStreakData,
} from './components/DailyStreakCounter';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DiagnosticPage } from './pages/DiagnosticPage';
import { DashboardPage } from './pages/DashboardPage';
import { LearningPathPage } from './pages/LearningPathPage';
import { PracticePage } from './pages/PracticePage';
import { RevisionPage } from './pages/RevisionPage';
import { AITutorPage } from './pages/AITutorPage';
import { ProgressPage } from './pages/ProgressPage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { CoursesPage } from './pages/CoursesPage';
import { HelpDeskPage } from './pages/HelpDeskPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

export default function App() {
  // Navigation & View State
  const [authView, setAuthView] = useState<'landing' | 'login' | 'register' | 'diagnostic' | 'app'>('landing');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isStudyTodayOpen, setIsStudyTodayOpen] = useState(false);

  // Selected contexts for practice & tutor
  const [selectedPracticeTopicId, setSelectedPracticeTopicId] = useState<string>('trees');
  const [selectedTutorTopic, setSelectedTutorTopic] = useState<string>('Binary Trees');

  // Active Student State
  const [currentStudent, setCurrentStudent] = useState<StudentProfile | null>(null);
  const [hasJustLoggedIn, setHasJustLoggedIn] = useState<boolean>(false);

  // Performances map keyed by topicId for the active student
  const [performances, setPerformances] = useState<Record<string, StudentPerformance>>({});

  // Check initial local session if any
  useEffect(() => {
    const savedStudentId = localStorage.getItem('adaptivelearn_active_student_id');
    if (savedStudentId) {
      loadStudentSession(savedStudentId, false);
    }
  }, []);

  const loadStudentSession = (studentId: string, triggerLoginGlow: boolean = false) => {
    let profile: StudentProfile;
    let perfs: Record<string, StudentPerformance>;

    if (studentId === 'student.b') {
      profile = { ...STUDENT_B_PROFILE };
      perfs = { ...STUDENT_B_PERFORMANCES };
    } else if (studentId === 'student.c') {
      profile = { ...STUDENT_C_PROFILE };
      perfs = { ...STUDENT_C_PERFORMANCES };
    } else {
      // Default to Student A
      profile = { ...STUDENT_A_PROFILE };
      perfs = { ...STUDENT_A_PERFORMANCES };
    }

    // Check for localStorage updates
    const storedPerfs = localStorage.getItem(`adaptivelearn_perfs_${studentId}`);
    if (storedPerfs) {
      try {
        perfs = JSON.parse(storedPerfs);
      } catch (e) {
        console.error(e);
      }
    }

    setCurrentStudent(profile);
    setPerformances(perfs);
    localStorage.setItem('adaptivelearn_active_student_id', studentId);
    setAuthView('app');
    setActiveTab('dashboard');

    if (triggerLoginGlow) {
      setHasJustLoggedIn(true);
    }
  };

  const handleStreakChange = (newStreak: number) => {
    if (!currentStudent) return;
    setCurrentStudent((prev: StudentProfile | null) => (prev ? { ...prev, currentStreak: newStreak } : null));
  };

  // Dynamically recalculate the personalized learning path whenever student or performances change!
  const currentLearningPath = useMemo(() => {
    if (!currentStudent) return [];
    return generateLearningPath(currentStudent, performances);
  }, [currentStudent, performances]);

  // Handle Login
  const handleLoginSuccess = (studentId: string) => {
    loadStudentSession(studentId, true);
  };

  // Handle Logout (per Section 27: to change student: Logout -> Login again)
  const handleLogout = () => {
    setCurrentStudent(null);
    localStorage.removeItem('adaptivelearn_active_student_id');
    setAuthView('login');
  };

  // Handle Registration -> leads directly to Diagnostic Assessment
  const handleRegisterSuccess = (newProfile: StudentProfile) => {
    setCurrentStudent(newProfile);
    localStorage.setItem('adaptivelearn_active_student_id', newProfile.id);
    setAuthView('diagnostic');
  };

  // Handle Diagnostic Assessment Completion
  const handleCompleteDiagnostic = (newPerformances: Record<string, StudentPerformance>) => {
    if (!currentStudent) return;
    const updatedStudent: StudentProfile = {
      ...currentStudent,
      diagnosticCompleted: true,
    };
    setCurrentStudent(updatedStudent);
    setPerformances(newPerformances);
    localStorage.setItem(`adaptivelearn_perfs_${currentStudent.id}`, JSON.stringify(newPerformances));
    setAuthView('app');
    setActiveTab('dashboard');
  };

  // Simulate 14 Days Time Passage (Decays retention via Ebbinghaus function)
  const handleSimulate14Days = () => {
    const updated: Record<string, StudentPerformance> = {};
    Object.entries(performances).forEach(([tid, p]) => {
      updated[tid] = decayRetention(p, 14);
    });

    setPerformances(updated);
    if (currentStudent) {
      localStorage.setItem(`adaptivelearn_perfs_${currentStudent.id}`, JSON.stringify(updated));
    }
  };

  // Reset Progress to initial baseline
  const handleResetProgress = () => {
    if (!currentStudent) return;
    loadStudentSession(currentStudent.id);
  };

  // Update a single topic performance (e.g. from Practice or Revision)
  const handleUpdatePerformance = (topicId: string, updated: StudentPerformance, pointsEarned: number = 0) => {
    const newPerfs = {
      ...performances,
      [topicId]: updated,
    };
    setPerformances(newPerfs);

    if (currentStudent) {
      const newSolved = pointsEarned > 0 ? currentStudent.totalQuestionsSolved + 1 : currentStudent.totalQuestionsSolved;
      
      // Record today's study activity in daily streak tracker
      try {
        const streakData = getStudentStreakData(currentStudent.id, currentStudent.currentStreak);
        const today = new Date().toISOString().split('T')[0];
        if (!streakData.todayCompleted || !streakData.activeDates.includes(today)) {
          if (!streakData.activeDates.includes(today)) {
            streakData.activeDates.push(today);
          }
          streakData.todayCompleted = true;
          streakData.lastStudyDate = today;
          saveStudentStreakData(currentStudent.id, streakData);
        }
      } catch (err) {
        console.error('Failed to update streak on study action:', err);
      }

      const updatedStudent = {
        ...currentStudent,
        totalQuestionsSolved: newSolved,
        totalStudyMinutes: currentStudent.totalStudyMinutes + 5,
      };
      setCurrentStudent(updatedStudent);
      localStorage.setItem(`adaptivelearn_perfs_${currentStudent.id}`, JSON.stringify(newPerfs));
    }
  };

  // Update profile
  const handleUpdateProfile = (updatedFields: Partial<StudentProfile>) => {
    if (!currentStudent) return;
    const updated = { ...currentStudent, ...updatedFields };
    setCurrentStudent(updated);
  };

  // Routing to Practice from another tab
  const handleStartPracticeTopic = (topicId: string) => {
    setSelectedPracticeTopicId(topicId);
    setActiveTab('practice');
  };

  // Routing to AI Tutor from another tab
  const handleOpenTutorForTopic = (topicName: string) => {
    setSelectedTutorTopic(topicName);
    setActiveTab('ai-tutor');
  };

  // Handler for Today's Study Plan activity launches
  const handleStartActivity = (activityType: string, topicId: string) => {
    if (activityType === 'Revision') {
      setSelectedPracticeTopicId(topicId);
      setActiveTab('revision');
    } else if (activityType === 'Learn') {
      setSelectedTutorTopic(topicId);
      setActiveTab('ai-tutor');
    } else {
      setSelectedPracticeTopicId(topicId);
      setActiveTab('practice');
    }
  };

  const handleSelectStudent = (studentId: string) => {
    loadStudentSession(studentId);
  };

  // 1. Landing View
  if (authView === 'landing') {
    return (
      <LandingPage
        onStartLearning={() => setAuthView('register')}
        onViewDemo={() => setAuthView('login')}
        onSelectStudent={handleSelectStudent}
      />
    );
  }

  // 2. Login View
  if (authView === 'login') {
    return (
      <LoginPage
        onLoginSuccess={handleLoginSuccess}
        onNavigateRegister={() => setAuthView('register')}
      />
    );
  }

  // 3. Register View
  if (authView === 'register') {
    return (
      <RegisterPage
        onRegisterSuccess={handleRegisterSuccess}
        onNavigateLogin={() => setAuthView('login')}
      />
    );
  }

  // 4. Diagnostic Assessment View
  if (authView === 'diagnostic' && currentStudent) {
    return (
      <DiagnosticPage
        currentStudent={currentStudent}
        onCompleteDiagnostic={handleCompleteDiagnostic}
      />
    );
  }

  // 5. Main Application Shell
  return (
    <div id="adaptivelearn-app-shell" className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Demo Tour Bar (Evaluation Guide & 14-Day Simulation trigger) */}
      <DemoTourBar
        currentStudent={currentStudent}
        onSimulate14Days={handleSimulate14Days}
        onNavigateToTab={(tab) => setActiveTab(tab)}
        onLogout={handleLogout}
        onTriggerLoginGlow={() => setHasJustLoggedIn(true)}
      />

      {/* Daily Streak Celebration Toast upon login */}
      {currentStudent && (
        <DailyStreakCounter
          student={currentStudent}
          variant="celebration-toast"
          justLoggedIn={hasJustLoggedIn}
          onClearJustLoggedIn={() => setHasJustLoggedIn(false)}
          onStreakChange={handleStreakChange}
        />
      )}

      <div className="flex-1 flex">
        {/* Left Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={(tab) => setActiveTab(tab)}
          onLogout={handleLogout}
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
          currentStudent={currentStudent}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
          {/* Top Navbar */}
          <Navbar
            onOpenMobileMenu={() => setIsMobileSidebarOpen(true)}
            currentStudent={currentStudent}
            onWhatShouldIStudyToday={() => setIsStudyTodayOpen(true)}
            justLoggedIn={hasJustLoggedIn}
            onClearJustLoggedIn={() => setHasJustLoggedIn(false)}
            onStreakChange={handleStreakChange}
          />

          {/* Page Content Container */}
          <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 max-w-7xl w-full mx-auto">
            {currentStudent && (
              <>
                {/* 1. Dashboard */}
                {activeTab === 'dashboard' && (
                  <DashboardPage
                    student={currentStudent}
                    performances={performances}
                    learningPath={currentLearningPath}
                    onOpenStudyTodayModal={() => setIsStudyTodayOpen(true)}
                    onNavigateToTab={(tab) => setActiveTab(tab)}
                    onStartPracticeTopic={handleStartPracticeTopic}
                    onSimulate14Days={handleSimulate14Days}
                    justLoggedIn={hasJustLoggedIn}
                    onClearJustLoggedIn={() => setHasJustLoggedIn(false)}
                    onStreakChange={handleStreakChange}
                  />
                )}

                {/* 2. Learning Path */}
                {activeTab === 'learning-path' && (
                  <LearningPathPage
                    student={currentStudent}
                    performances={performances}
                    learningPath={currentLearningPath}
                    onStartStep={handleStartPracticeTopic}
                    onOpenTutor={handleOpenTutorForTopic}
                  />
                )}

                {/* 3D Live Experience */}
                {activeTab === 'live-3d' && (
                  <div className="space-y-6">
                    <SplineLiveExperience
                      isHeroMode={true}
                      onEnterPlatform={() => setActiveTab('dashboard')}
                      onExploreDemo={(studentId) => {
                        if (studentId) loadStudentSession(studentId);
                      }}
                    />
                  </div>
                )}

                {/* 3. Skill Map */}
                {activeTab === 'skill-map' && (
                  <div className="space-y-6">
                    <div className="p-6 rounded-3xl bg-slate-900 border border-cyan-500/30 shadow-2xl">
                      <h1 className="text-2xl font-bold font-display text-white">
                        Interactive Prerequisite Skill Graph
                      </h1>
                      <p className="text-xs text-slate-400 mt-1">
                        Click any topic node to inspect its deterministic 4-part mastery breakdown, retention index, and prerequisite chains.
                      </p>
                    </div>
                    <InteractiveSkillMap
                      performances={performances}
                      onSelectTopicForPractice={handleStartPracticeTopic}
                      onSelectTopicForTutor={handleOpenTutorForTopic}
                    />
                  </div>
                )}

                {/* 4. Subjects & Courses */}
                {(activeTab === 'subjects' || activeTab === 'my-courses') && (
                  <CoursesPage
                    student={currentStudent}
                    performances={performances}
                    onNavigateToTopic={handleStartPracticeTopic}
                  />
                )}

                {/* 5. Practice */}
                {activeTab === 'practice' && (
                  <PracticePage
                    student={currentStudent}
                    performances={performances}
                    selectedTopicId={selectedPracticeTopicId}
                    onUpdatePerformance={handleUpdatePerformance}
                    onNavigateToTab={(tab) => setActiveTab(tab)}
                  />
                )}

                {/* 6. Revision & Retention */}
                {activeTab === 'revision' && (
                  <RevisionPage
                    student={currentStudent}
                    performances={performances}
                    onSimulate14Days={handleSimulate14Days}
                    onUpdatePerformance={handleUpdatePerformance}
                    onOpenTutor={handleOpenTutorForTopic}
                  />
                )}

                {/* 7. Progress & Analytics */}
                {activeTab === 'progress' && (
                  <ProgressPage
                    student={currentStudent}
                    performances={performances}
                  />
                )}

                {/* 8. Leaderboard */}
                {activeTab === 'leaderboard' && (
                  <LeaderboardPage
                    currentStudent={currentStudent}
                    performances={performances}
                  />
                )}

                {/* 9. AI Tutor */}
                {activeTab === 'ai-tutor' && (
                  <AITutorPage
                    student={currentStudent}
                    initialTopic={selectedTutorTopic}
                  />
                )}

                {/* 10. Help Desk */}
                {activeTab === 'help-desk' && (
                  <HelpDeskPage student={currentStudent} />
                )}

                {/* 11. Profile */}
                {activeTab === 'profile' && (
                  <ProfilePage
                    student={currentStudent}
                    onUpdateProfile={handleUpdateProfile}
                  />
                )}

                {/* 12. Settings */}
                {activeTab === 'settings' && (
                  <SettingsPage
                    onSimulate14Days={handleSimulate14Days}
                    onResetProgress={handleResetProgress}
                  />
                )}
              </>
            )}
          </main>
        </div>
      </div>

      {/* "What Should I Study Today?" Dynamic Engine Modal */}
      {currentStudent && (
        <StudyTodayModal
          isOpen={isStudyTodayOpen}
          onClose={() => setIsStudyTodayOpen(false)}
          profile={currentStudent}
          performances={performances}
          onStartActivity={handleStartActivity}
        />
      )}
    </div>
  );
}
