import React from 'react';
import {
  LayoutDashboard,
  Compass,
  BookOpen,
  GitFork,
  GraduationCap,
  PenTool,
  RotateCcw,
  BarChart3,
  Trophy,
  Sparkles,
  LifeBuoy,
  User,
  Settings,
  LogOut,
  X,
} from 'lucide-react';
import {
  DashboardEmoji,
  LearningPathEmoji,
  PracticeEmoji,
  RevisionEmoji,
  ProgressEmoji,
  LeaderboardEmoji,
  AITutorEmoji,
  HelpDeskEmoji,
  ProfileEmoji,
  LogoutEmoji,
  LiveEmoji,
} from './LiveEmoji';
import { StudentProfile } from '../types';

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onLogout: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  currentStudent: StudentProfile | null;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  onLogout,
  isOpenMobile,
  onCloseMobile,
  currentStudent,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, liveEmoji: <DashboardEmoji /> },
    { id: 'live-3d', label: '3D Experience', icon: Sparkles, liveEmoji: <LiveEmoji initialEmoji="✨" states={['✨', '🌊', '🔮']} intervalMs={2400} /> },
    { id: 'learning-path', label: 'Learning Path', icon: Compass, liveEmoji: <LearningPathEmoji /> },
    { id: 'subjects', label: 'Subjects', icon: BookOpen, liveEmoji: <LiveEmoji initialEmoji="📖" states={['📖', '📘']} intervalMs={3000} /> },
    { id: 'skill-map', label: 'Skill Map', icon: GitFork, liveEmoji: <LiveEmoji initialEmoji="🧩" states={['🧩', '🎯']} intervalMs={3200} /> },
    { id: 'my-courses', label: 'My Courses', icon: GraduationCap, liveEmoji: <LiveEmoji initialEmoji="🎓" states={['🎓', '📜']} intervalMs={3400} /> },
    { id: 'practice', label: 'Practice', icon: PenTool, liveEmoji: <PracticeEmoji /> },
    { id: 'revision', label: 'Revision', icon: RotateCcw, liveEmoji: <RevisionEmoji /> },
    { id: 'progress', label: 'Progress', icon: BarChart3, liveEmoji: <ProgressEmoji /> },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy, liveEmoji: <LeaderboardEmoji /> },
    { id: 'ai-tutor', label: 'AI Tutor', icon: Sparkles, liveEmoji: <AITutorEmoji /> },
    { id: 'help-desk', label: 'Help Desk', icon: LifeBuoy, liveEmoji: <HelpDeskEmoji /> },
    { id: 'profile', label: 'Profile', icon: User, liveEmoji: <ProfileEmoji /> },
    { id: 'settings', label: 'Settings', icon: Settings, liveEmoji: <LiveEmoji initialEmoji="⚙️" states={['⚙️', '🔧']} intervalMs={3500} /> },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        id="app-sidebar"
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-slate-900/95 dark:bg-slate-950/95 border-r border-slate-800 dark:border-cyan-500/20 flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800 dark:border-cyan-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 font-black text-lg shadow-lg shadow-cyan-500/20">
              AL
            </div>
            <div>
              <h1 className="font-extrabold text-base tracking-tight text-white font-display">
                ADAPTIVE<span className="text-cyan-400">LEARN</span>
              </h1>
              <p className="text-[10px] text-cyan-400 font-medium tracking-wide">
                B.Tech CSE • Adaptive AI
              </p>
            </div>
          </div>

          <button
            onClick={onCloseMobile}
            className="text-slate-400 hover:text-slate-200 lg:hidden p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-bold tracking-wider uppercase text-slate-500">
            Learning Navigation
          </div>

          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-item-${item.id}`}
                onClick={() => {
                  onSelectTab(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all group ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/10 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/10 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                <div className="shrink-0">{item.liveEmoji}</div>
              </button>
            );
          })}
        </div>

        {/* Bottom Student Card & Logout */}
        <div className="p-3.5 border-t border-slate-800 dark:border-cyan-500/20 space-y-2 bg-slate-950/60">
          {currentStudent && (
            <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-900/80 border border-slate-800">
              <img
                src={currentStudent.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=60&auto=format&fit=crop&q=80'}
                alt={currentStudent.name}
                className="w-8 h-8 rounded-lg object-cover ring-1 ring-cyan-500/30"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-200 truncate">{currentStudent.name}</p>
                <p className="text-[10px] text-cyan-400 truncate">
                  Sem {currentStudent.semester} • {currentStudent.branch}
                </p>
              </div>
            </div>
          )}

          <button
            id="nav-item-logout"
            onClick={onLogout}
            title="Logout and return to Login screen"
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all"
          >
            <div className="flex items-center gap-2.5">
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </div>
            <LogoutEmoji />
          </button>
        </div>
      </aside>
    </>
  );
};
