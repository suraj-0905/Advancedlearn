import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export interface LiveEmojiProps {
  initialEmoji?: string;
  states?: string[];
  intervalMs?: number;
  trigger?: any; // Change on external trigger
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  label?: string;
  subtleGlow?: boolean;
}

const sizeClasses = {
  sm: 'text-base w-6 h-6',
  md: 'text-xl w-8 h-8',
  lg: 'text-2xl w-10 h-10',
  xl: 'text-3xl w-12 h-12',
  '2xl': 'text-4xl w-14 h-14',
};

/**
 * Premium animated live emoji component with subtle floating, glow, scale, and morphing transitions.
 */
export const LiveEmoji: React.FC<LiveEmojiProps> = ({
  initialEmoji = '✨',
  states,
  intervalMs = 3200,
  trigger,
  className = '',
  size = 'md',
  label,
  subtleGlow = true,
}) => {
  const [index, setIndex] = useState(0);

  // Cycle through states if array is provided
  useEffect(() => {
    if (!states || states.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % states.length);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [states, intervalMs]);

  // When external trigger changes, advance index
  useEffect(() => {
    if (trigger !== undefined && states && states.length > 1) {
      setIndex((prev) => (prev + 1) % states.length);
    }
  }, [trigger, states]);

  const currentEmoji = states && states.length > 0 ? states[index] : initialEmoji;

  return (
    <span
      className={`relative inline-flex items-center justify-center select-none ${sizeClasses[size]} ${className}`}
      role="img"
      aria-label={label || 'live animated icon'}
    >
      {/* Optional subtle ambient aura glow behind the emoji */}
      {subtleGlow && (
        <span
          className="absolute inset-0 rounded-full bg-cyan-400/10 blur-sm pointer-events-none -z-10 animate-pulse"
          style={{ animationDuration: '3s' }}
        />
      )}

      <AnimatePresence mode="wait">
        <motion.span
          key={currentEmoji + index}
          initial={{ opacity: 0, scale: 0.75, y: 3, rotate: -8 }}
          animate={{
            opacity: 1,
            scale: [1, 1.08, 1],
            y: [0, -2, 0],
            rotate: [0, 4, -3, 0],
          }}
          exit={{ opacity: 0, scale: 0.8, y: -3, rotate: 8 }}
          transition={{
            duration: 0.6,
            ease: [0.16, 1, 0.3, 1],
          }}
          whileHover={{ scale: 1.2, rotate: 6 }}
          className="inline-block"
        >
          {currentEmoji}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};

// Preset sequence transitions required by spec:
export const DashboardEmoji: React.FC<{ className?: string }> = ({ className }) => (
  <LiveEmoji states={['👋', '🚀']} intervalMs={3600} size="md" className={className} />
);

export const LearningPathEmoji: React.FC<{ className?: string }> = ({ className }) => (
  <LiveEmoji states={['🧭', '🚶']} intervalMs={3400} size="md" className={className} />
);

export const PracticeEmoji: React.FC<{ className?: string }> = ({ className }) => (
  <LiveEmoji states={['✏️', '💡']} intervalMs={3200} size="md" className={className} />
);

export const RevisionEmoji: React.FC<{ className?: string }> = ({ className }) => (
  <LiveEmoji states={['🔄', '🧠']} intervalMs={3000} size="md" className={className} />
);

export const ProgressEmoji: React.FC<{ className?: string }> = ({ className }) => (
  <LiveEmoji states={['📈', '🎉']} intervalMs={3800} size="md" className={className} />
);

export const LeaderboardEmoji: React.FC<{ className?: string }> = ({ className }) => (
  <LiveEmoji states={['🏆', '🥇']} intervalMs={3500} size="md" className={className} />
);

export const AITutorEmoji: React.FC<{ className?: string }> = ({ className }) => (
  <LiveEmoji states={['🤔', '🧠', '💡']} intervalMs={2800} size="md" className={className} />
);

export const HelpDeskEmoji: React.FC<{ className?: string }> = ({ className }) => (
  <LiveEmoji states={['🛟', '💬']} intervalMs={3500} size="md" className={className} />
);

export const ProfileEmoji: React.FC<{ className?: string }> = ({ className }) => (
  <LiveEmoji states={['👋', '✨']} intervalMs={3500} size="md" className={className} />
);

export const LogoutEmoji: React.FC<{ className?: string }> = ({ className }) => (
  <LiveEmoji states={['👋', '😄', '🚪💨']} intervalMs={2500} size="md" className={className} />
);

// Event-specific animations:
export const QuestionCompletedEmoji: React.FC<{ onComplete?: () => void }> = () => (
  <LiveEmoji states={['✏️', '🤔', '✅', '🎉']} intervalMs={700} size="xl" />
);

export const TopicMasteredEmoji: React.FC = () => (
  <LiveEmoji states={['🧠', '💡', '⭐']} intervalMs={800} size="xl" />
);

export const MilestoneEmoji: React.FC = () => (
  <LiveEmoji states={['🎯', '🚀', '🏆']} intervalMs={800} size="xl" />
);

export const RetentionAlertEmoji: React.FC = () => (
  <LiveEmoji states={['🧠', '⚠️', '🔄']} intervalMs={1200} size="md" />
);

export const RevisionSuccessEmoji: React.FC = () => (
  <LiveEmoji states={['🔄', '🧠', '🎉']} intervalMs={900} size="xl" />
);
