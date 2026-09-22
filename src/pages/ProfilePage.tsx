import React, { useState } from 'react';
import { User, Mail, GraduationCap, Target, Clock, BookOpen, CheckCircle2, Award, Edit3, Save } from 'lucide-react';
import { ProfileEmoji } from '../components/LiveEmoji';
import { StudentProfile } from '../types';

interface ProfilePageProps {
  student: StudentProfile;
  onUpdateProfile: (updated: Partial<StudentProfile>) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ student, onUpdateProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [careerGoal, setCareerGoal] = useState(student.careerGoal);
  const [availableTime, setAvailableTime] = useState(student.availableTimeMinutes);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    onUpdateProfile({
      careerGoal,
      availableTimeMinutes: availableTime,
    });
    setIsEditing(false);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div id="profile-page-container" className="space-y-8 max-w-4xl mx-auto pb-16">
      {/* Header Profile Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-cyan-500/30 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={student.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=160&auto=format&fit=crop&q=80'}
              alt={student.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-cyan-500/40 shadow-xl"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-white font-display">
                  {student.name}
                </h1>
                <ProfileEmoji />
              </div>
              <p className="text-xs text-cyan-400 font-medium">
                {student.branch} • Semester {student.semester} • Student ID: {student.id}
              </p>
              <p className="text-xs text-slate-400 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" />
                <span>{student.email}</span>
              </p>
            </div>
          </div>

          <button
            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-cyan-300 border border-cyan-500/30 text-xs font-semibold self-start sm:self-center transition-all"
          >
            {isEditing ? (
              <>
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </>
            ) : (
              <>
                <Edit3 className="w-4 h-4" />
                <span>Edit Profile</span>
              </>
            )}
          </button>
        </div>

        {isSaved && (
          <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Profile and learning preferences updated successfully!</span>
          </div>
        )}
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Academic & Career Goals */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
            <Target className="w-4 h-4" />
            <span>Academic & Career Alignment</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-slate-400 block mb-1">Target Career Role</label>
              {isEditing ? (
                <input
                  type="text"
                  value={careerGoal}
                  onChange={(e) => setCareerGoal(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs outline-none focus:border-cyan-400"
                />
              ) : (
                <p className="font-semibold text-slate-100 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  {student.careerGoal}
                </p>
              )}
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Academic Semester Goals</label>
              <div className="space-y-1.5">
                {student.academicGoals.map((goal, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-slate-950/40 border border-slate-800 text-slate-300 flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>{goal}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Adaptive Parameters & Time Availability */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <Clock className="w-4 h-4" />
            <span>Learning Routine Preferences</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-slate-400 block mb-1">Available Daily Study Time</label>
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={15}
                    max={180}
                    step={15}
                    value={availableTime}
                    onChange={(e) => setAvailableTime(Number(e.target.value))}
                    className="w-24 px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs outline-none focus:border-cyan-400"
                  />
                  <span className="text-slate-400">minutes per session</span>
                </div>
              ) : (
                <p className="font-semibold text-slate-100 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  {student.availableTimeMinutes} Minutes per day
                </p>
              )}
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Preferred Learning Formats</label>
              <div className="flex flex-wrap gap-1.5">
                {student.preferredFormats.map((fmt) => (
                  <span
                    key={fmt}
                    className="px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-[11px] font-medium"
                  >
                    {fmt}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800">
              <span className="text-slate-400 block mb-1">Platform Telemetry</span>
              <p className="text-slate-300">
                Registered: {new Date(student.registeredAt).toLocaleDateString()} • Diagnostic Active: Yes
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
