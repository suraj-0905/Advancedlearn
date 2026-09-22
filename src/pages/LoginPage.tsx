import React, { useState } from 'react';
import { LogIn, KeyRound, User, Sparkles, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { LiveEmoji } from '../components/LiveEmoji';

interface LoginPageProps {
  onLoginSuccess: (studentId: string) => void;
  onNavigateRegister: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  onNavigateRegister,
}) => {
  const [username, setUsername] = useState('student.a');
  const [password, setPassword] = useState('demo123');
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanUser = username.trim().toLowerCase();
    if (
      (cleanUser === 'student.a' || cleanUser === 'student.b' || cleanUser === 'student.c') &&
      password === 'demo123'
    ) {
      onLoginSuccess(cleanUser);
    } else {
      // Allow custom registered accounts from localStorage
      const customUsers = JSON.parse(localStorage.getItem('adaptivelearn_registered_users') || '{}');
      if (customUsers[cleanUser] && customUsers[cleanUser].password === password) {
        onLoginSuccess(cleanUser);
      } else {
        setErrorMsg('Invalid credentials. Use demo accounts: student.a, student.b, or student.c with password "demo123".');
      }
    }
  };

  const handleQuickDemoLogin = (id: string) => {
    setUsername(id);
    setPassword('demo123');
    onLoginSuccess(id);
  };

  return (
    <div id="login-page-container" className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-slate-950 font-black text-2xl shadow-xl shadow-cyan-500/20">
          AL
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
          Welcome to <span className="text-cyan-400">AdaptiveLearn</span>
        </h2>
        <p className="text-xs text-slate-400">
          Intelligent Personalized Learning System for B.Tech CSE Students
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="p-7 rounded-3xl bg-slate-900/90 border border-cyan-500/25 shadow-2xl shadow-cyan-500/10 space-y-6">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Username / Email
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  id="login-username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="student.a or your email"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-white text-xs outline-none transition-all placeholder:text-slate-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  id="login-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="demo123"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-white text-xs outline-none transition-all placeholder:text-slate-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-700 text-cyan-500 focus:ring-cyan-400 bg-slate-950"
                />
                <span>Remember me</span>
              </label>

              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-cyan-400 hover:text-cyan-300 font-medium"
              >
                Forgot Password?
              </button>
            </div>

            <button
              id="btn-submit-login"
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all active:scale-95"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In to Learning Path</span>
            </button>
          </form>

          {/* Quick Demo Selector for Evaluators & Judges */}
          <div className="pt-4 border-t border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="font-semibold text-cyan-300 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                1-Click Demo Profiles:
              </span>
              <span>Pass: demo123</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                id="btn-demo-student-a"
                onClick={() => handleQuickDemoLogin('student.a')}
                className="p-2 rounded-xl bg-slate-950 hover:bg-cyan-950/40 border border-slate-800 hover:border-cyan-500/40 text-left transition-all group"
              >
                <span className="block font-bold text-xs text-white group-hover:text-cyan-300">Student A</span>
                <span className="block text-[10px] text-slate-400 truncate">Weak Trees</span>
              </button>

              <button
                type="button"
                id="btn-demo-student-b"
                onClick={() => handleQuickDemoLogin('student.b')}
                className="p-2 rounded-xl bg-slate-950 hover:bg-blue-950/40 border border-slate-800 hover:border-blue-500/40 text-left transition-all group"
              >
                <span className="block font-bold text-xs text-white group-hover:text-blue-300">Student B</span>
                <span className="block text-[10px] text-slate-400 truncate">Weak Basics</span>
              </button>

              <button
                type="button"
                id="btn-demo-student-c"
                onClick={() => handleQuickDemoLogin('student.c')}
                className="p-2 rounded-xl bg-slate-950 hover:bg-amber-950/40 border border-slate-800 hover:border-amber-500/40 text-left transition-all group"
              >
                <span className="block font-bold text-xs text-white group-hover:text-amber-300">Student C</span>
                <span className="block text-[10px] text-slate-400 truncate">Low Retention</span>
              </button>
            </div>
          </div>

          <div className="text-center pt-2 text-xs text-slate-400">
            Don't have an account yet?{' '}
            <button
              id="btn-nav-register"
              onClick={onNavigateRegister}
              className="text-cyan-400 hover:text-cyan-300 font-bold"
            >
              Create New Account →
            </button>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-sm p-6 rounded-2xl bg-slate-900 border border-cyan-500/30 space-y-4">
            <h3 className="text-base font-bold text-white font-display">Reset Password</h3>
            <p className="text-xs text-slate-300">
              Enter your email address and we'll send password recovery instructions.
            </p>
            {forgotSent ? (
              <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs">
                Recovery link sent! (Demo mode: Use password "demo123")
              </div>
            ) : (
              <div className="space-y-3">
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="student.a@cse.btech.edu"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs outline-none"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => setForgotSent(true)}
                    className="flex-1 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs"
                  >
                    Send Link
                  </button>
                  <button
                    onClick={() => setShowForgotPassword(false)}
                    className="py-2 px-3 rounded-xl bg-slate-800 text-slate-300 text-xs"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
            {forgotSent && (
              <button
                onClick={() => {
                  setShowForgotPassword(false);
                  setForgotSent(false);
                }}
                className="w-full py-2 rounded-xl bg-slate-800 text-slate-300 text-xs"
              >
                Done
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
