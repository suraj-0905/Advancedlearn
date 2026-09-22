import React, { useState } from 'react';
import { UserPlus, User, Mail, KeyRound, Compass, GraduationCap, Target, ArrowRight } from 'lucide-react';
import { StudentProfile } from '../types';

interface RegisterPageProps {
  onRegisterSuccess: (newStudent: StudentProfile) => void;
  onNavigateLogin: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({
  onRegisterSuccess,
  onNavigateLogin,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [branch, setBranch] = useState<'CSE' | 'ECE' | 'EE' | 'ME' | 'CE' | 'BT' | 'IT'>('CSE');
  const [semester, setSemester] = useState<number>(2);
  const [careerGoal, setCareerGoal] = useState('Tier-1 Product / FAANG Software Engineer');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    const newId = cleanEmail.split('@')[0] || `student_${Date.now()}`;

    const newProfile: StudentProfile = {
      id: newId,
      name: name.trim() || 'CSE Scholar',
      email: cleanEmail,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      branch,
      semester,
      careerGoal,
      academicGoals: ['Score 85%+ this semester', 'Prepare for technical interviews', 'Build programming skills'],
      strongTopics: ['prog_fund'],
      difficultTopics: ['trees', 'graphs'],
      availableTimeMinutes: 45,
      preferredFormats: ['Coding exercise', 'Interactive activity', 'Notes'],
      enrolledSubjectIds: ['cs_ds', 'cs_prog', 'cs_dbms', 'cs_cn'],
      currentStreak: 1,
      totalStudyMinutes: 0,
      totalQuestionsSolved: 0,
      lastActiveTimestamp: new Date().toISOString(),
      registeredAt: new Date().toISOString(),
      diagnosticCompleted: false, // will go to diagnostic test!
    };

    // Save custom user password locally
    const customUsers = JSON.parse(localStorage.getItem('adaptivelearn_registered_users') || '{}');
    customUsers[newId] = { profile: newProfile, password };
    localStorage.setItem('adaptivelearn_registered_users', JSON.stringify(customUsers));

    onRegisterSuccess(newProfile);
  };

  return (
    <div id="register-page-container" className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-slate-950 font-black text-2xl shadow-xl shadow-cyan-500/20">
          AL
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
          Create Student Account
        </h2>
        <p className="text-xs text-slate-400">
          Join AdaptiveLearn for personalized B.Tech CSE learning
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-lg px-4">
        <div className="p-7 rounded-3xl bg-slate-900/90 border border-cyan-500/25 shadow-2xl shadow-cyan-500/10 space-y-5">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs outline-none focus:border-cyan-400 placeholder:text-slate-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="priya.sharma@college.edu"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs outline-none focus:border-cyan-400 placeholder:text-slate-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Branch
                </label>
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value as any)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs outline-none focus:border-cyan-400"
                >
                  <option value="CSE">B.Tech CSE (Active)</option>
                  <option value="IT">B.Tech IT</option>
                  <option value="ECE">B.Tech ECE (Ready)</option>
                  <option value="EE">B.Tech EE (Ready)</option>
                  <option value="ME">B.Tech ME (Ready)</option>
                  <option value="CE">B.Tech CE (Ready)</option>
                  <option value="BT">B.Tech BT (Ready)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Current Semester
                </label>
                <select
                  value={semester}
                  onChange={(e) => setSemester(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs outline-none focus:border-cyan-400"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                    <option key={sem} value={sem}>
                      Semester {sem}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Primary Career Goal
              </label>
              <div className="relative">
                <Target className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  value={careerGoal}
                  onChange={(e) => setCareerGoal(e.target.value)}
                  placeholder="e.g. Systems Engineer, FAANG Placements, AI Researcher"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs outline-none focus:border-cyan-400 placeholder:text-slate-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs outline-none focus:border-cyan-400 placeholder:text-slate-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs outline-none focus:border-cyan-400 placeholder:text-slate-500"
                />
              </div>
            </div>

            <button
              id="btn-submit-register"
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all active:scale-95"
            >
              <UserPlus className="w-4 h-4" />
              <span>Create Account & Take Diagnostic</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center pt-2 text-xs text-slate-400">
            Already have an account?{' '}
            <button
              onClick={onNavigateLogin}
              className="text-cyan-400 hover:text-cyan-300 font-bold"
            >
              Sign In →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
