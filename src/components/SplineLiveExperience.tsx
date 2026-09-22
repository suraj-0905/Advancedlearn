import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Maximize2,
  Minimize2,
  Compass,
  Play,
  Pause,
  ExternalLink,
  Layers,
  ArrowRight,
  Eye,
  Activity,
  Zap,
  RotateCcw,
  Sliders,
  CheckCircle2,
  Info,
} from 'lucide-react';
import { LiveEmoji } from './LiveEmoji';

interface SplineLiveExperienceProps {
  onEnterPlatform: () => void;
  onExploreDemo: (studentId?: string) => void;
  isHeroMode?: boolean;
}

type AnimationMode = 'orbit' | 'parallax' | 'pulse' | 'depth';

interface Hotspot {
  id: string;
  x: number; // percentage
  y: number; // percentage
  label: string;
  tag: string;
  description: string;
  stat: string;
}

const HOTSPOTS: Hotspot[] = [
  {
    id: 'clarity-core',
    x: 48,
    y: 38,
    label: 'Clarity Stream Engine',
    tag: 'Spline Live 3D',
    description: 'Dynamic neural flow visualizing real-time knowledge synthesis and cognitive clarity for CSE topics.',
    stat: '60 FPS Live Render',
  },
  {
    id: 'mastery-node',
    x: 72,
    y: 54,
    label: 'Deterministic Mastery Matrix',
    tag: 'Formula 50/20/15/15',
    description: 'Calculates topic proficiency across Diagnostic, Practice accuracy, Recent trend, and Consistency.',
    stat: '4-Tier Adaptive',
  },
  {
    id: 'retention-pulse',
    x: 24,
    y: 62,
    label: 'Spaced Memory Decay',
    tag: 'Ebbinghaus Model',
    description: 'Tracks memory degradation over 14 days and triggers targeted reinforcement before forgetting occurs.',
    stat: '14-Day Spaced Repetition',
  },
  {
    id: 'prereq-dag',
    x: 64,
    y: 22,
    label: 'Topological Prerequisite DAG',
    tag: 'Strict Gateways',
    description: 'Ensures foundational concepts reach ≥60% mastery before unlocking downstream data structures.',
    stat: 'Directed Acyclic Graph',
  },
];

export const SplineLiveExperience: React.FC<SplineLiveExperienceProps> = ({
  onEnterPlatform,
  onExploreDemo,
  isHeroMode = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Animation States
  const [animMode, setAnimMode] = useState<AnimationMode>('orbit');
  const [isPlaying, setIsPlaying] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showHotspots, setShowHotspots] = useState(true);
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);

  // Tuning Parameters
  const [depthIntensity, setDepthIntensity] = useState<number>(1.2);
  const [glowSpeed, setGlowSpeed] = useState<number>(1);
  const [showControls, setShowControls] = useState(false);

  // Mouse Parallax Coordinates (-1 to 1)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [orbitAngle, setOrbitAngle] = useState(0);

  // Continuous Orbit Loop
  useEffect(() => {
    if (!isPlaying) return;
    let animId: number;
    const updateOrbit = () => {
      setOrbitAngle((prev) => (prev + 0.015 * glowSpeed) % (Math.PI * 2));
      animId = requestAnimationFrame(updateOrbit);
    };
    animId = requestAnimationFrame(updateOrbit);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, glowSpeed]);

  // Handle Mouse Movement on 3D Container
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1; // -1 to 1
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1; // -1 to 1
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  // Calculate 3D rotations based on active mode
  let rotateX = 0;
  let rotateY = 0;
  let translateZ = 0;
  let scale = 1;

  if (animMode === 'orbit') {
    rotateX = Math.sin(orbitAngle) * 9 * depthIntensity + -mousePos.y * 6;
    rotateY = Math.cos(orbitAngle) * 14 * depthIntensity + mousePos.x * 10;
    translateZ = Math.sin(orbitAngle * 2) * 15;
    scale = 1 + Math.sin(orbitAngle) * 0.03;
  } else if (animMode === 'parallax') {
    rotateX = -mousePos.y * 18 * depthIntensity;
    rotateY = mousePos.x * 22 * depthIntensity;
    translateZ = 20;
    scale = 1.02;
  } else if (animMode === 'pulse') {
    const pulseFactor = Math.sin(orbitAngle * 3);
    rotateX = -mousePos.y * 10 + pulseFactor * 4;
    rotateY = mousePos.x * 12 + Math.cos(orbitAngle * 3) * 6;
    translateZ = pulseFactor * 30;
    scale = 1 + pulseFactor * 0.05;
  } else if (animMode === 'depth') {
    rotateX = -mousePos.y * 24 * depthIntensity;
    rotateY = mousePos.x * 28 * depthIntensity;
    translateZ = 45;
    scale = 1.06;
  }

  const splineFileUrl = 'https://app.spline.design/file/02a13f2d-5dd1-4f5e-a4d8-cb41535af327';
  const previewImageUrl = '/spline-clarity-stream.jpg';
  const remoteFallback = 'https://filespreview.spline.design/02a13f2d-5dd1-4f5e-a4d8-cb41535af327.jpg';

  return (
    <div
      id="spline-live-experience"
      className={`relative w-full transition-all duration-500 overflow-hidden ${
        isFullscreen
          ? 'fixed inset-0 z-50 bg-slate-950 flex flex-col justify-between p-4 sm:p-8'
          : isHeroMode
          ? 'rounded-3xl border border-cyan-500/30 bg-slate-950/80 shadow-2xl backdrop-blur-xl'
          : 'rounded-3xl border border-cyan-500/20 bg-slate-950/90 shadow-2xl'
      }`}
    >
      {/* Dynamic Background Glow & Ambient Energy Rings */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-32 left-1/4 w-96 h-96 rounded-full bg-cyan-500/15 blur-3xl transition-transform duration-1000"
          style={{
            transform: `translate(${mousePos.x * 40}px, ${mousePos.y * 30}px) scale(${1 + Math.sin(orbitAngle) * 0.2})`,
          }}
        />
        <div
          className="absolute -bottom-32 right-1/4 w-96 h-96 rounded-full bg-blue-600/15 blur-3xl transition-transform duration-1000"
          style={{
            transform: `translate(${-mousePos.x * 30}px, ${-mousePos.y * 40}px) scale(${1 + Math.cos(orbitAngle) * 0.2})`,
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(2,6,23,0.7)_100%)]" />
      </div>

      {/* Top Experience Header Bar */}
      <div className="relative z-20 flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-cyan-500/20 bg-slate-950/60 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-semibold text-cyan-300">
            <LiveEmoji states={['✨', '🌊', '🔮']} intervalMs={2400} size="sm" />
            <span>Spline 3D Live Experience</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping ml-1" />
          </div>
          <span className="hidden sm:inline-block text-xs font-bold text-slate-300">
            Clarity Stream
          </span>
          <span className="text-[10px] text-slate-500 font-mono hidden md:inline-block">
            02a13f2d-5dd1
          </span>
        </div>

        {/* Live Mode Controls & Tools */}
        <div className="flex items-center gap-2">
          {/* Mode Selector */}
          <div className="flex items-center bg-slate-900/90 border border-slate-800 rounded-xl p-0.5 text-xs font-medium">
            <button
              onClick={() => setAnimMode('orbit')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                animMode === 'orbit'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Continuous 3D Orbit Motion"
            >
              Orbit 3D
            </button>
            <button
              onClick={() => setAnimMode('parallax')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                animMode === 'parallax'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Mouse Gyro Tilt & Parallax"
            >
              Parallax
            </button>
            <button
              onClick={() => setAnimMode('pulse')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                animMode === 'pulse'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Kinetic Neural Wave Pulse"
            >
              Pulse
            </button>
            <button
              onClick={() => setAnimMode('depth')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                animMode === 'depth'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Deep Spatial Immersion"
            >
              Deep 3D
            </button>
          </div>

          {/* Play/Pause */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-800 transition-all"
            title={isPlaying ? 'Pause Animation' : 'Resume Animation'}
          >
            {isPlaying ? <Pause className="w-4 h-4 text-cyan-400" /> : <Play className="w-4 h-4 text-emerald-400" />}
          </button>

          {/* Toggle Hotspots */}
          <button
            onClick={() => setShowHotspots(!showHotspots)}
            className={`p-1.5 rounded-lg border transition-all ${
              showHotspots
                ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
                : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
            title="Toggle Interactive Hotspots"
          >
            <Layers className="w-4 h-4" />
          </button>

          {/* Settings / Sliders Drawer */}
          <button
            onClick={() => setShowControls(!showControls)}
            className={`p-1.5 rounded-lg border transition-all ${
              showControls
                ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
                : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
            title="Tune 3D Physics & Shaders"
          >
            <Sliders className="w-4 h-4" />
          </button>

          {/* Spline Design External Link */}
          <a
            href={splineFileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-800 text-xs transition-all hover:text-cyan-300"
            title="Open in Spline Design App"
          >
            <span>Spline App</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          {/* Fullscreen Button */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-800 transition-all"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen 3D Stage'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Physics Tuning Panel Drawer */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="relative z-30 px-6 py-3 bg-slate-900/90 border-b border-cyan-500/20 flex flex-wrap items-center gap-6 text-xs text-slate-300"
          >
            <div className="flex items-center gap-2">
              <span className="text-slate-400">3D Depth Tilt:</span>
              <input
                type="range"
                min="0.4"
                max="2.5"
                step="0.1"
                value={depthIntensity}
                onChange={(e) => setDepthIntensity(parseFloat(e.target.value))}
                className="w-24 accent-cyan-400 cursor-pointer"
              />
              <span className="font-mono text-cyan-400">{depthIntensity.toFixed(1)}x</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-400">Flow Speed:</span>
              <input
                type="range"
                min="0.2"
                max="2.5"
                step="0.1"
                value={glowSpeed}
                onChange={(e) => setGlowSpeed(parseFloat(e.target.value))}
                className="w-24 accent-cyan-400 cursor-pointer"
              />
              <span className="font-mono text-cyan-400">{glowSpeed.toFixed(1)}x</span>
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <button
                onClick={() => {
                  setDepthIntensity(1.2);
                  setGlowSpeed(1);
                  setAnimMode('orbit');
                }}
                className="flex items-center gap-1 text-[11px] text-cyan-400 hover:underline"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset to Natural</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN 3D INTERACTIVE STAGE */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative w-full min-h-[440px] sm:min-h-[540px] lg:min-h-[600px] flex items-center justify-center p-4 sm:p-8 cursor-grab active:cursor-grabbing select-none"
        style={{ perspective: 1200 }}
      >
        {/* Floating Ambient Depth Particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(16)].map((_, i) => {
            const size = (i % 4) + 2;
            const left = `${(i * 19) % 95}%`;
            const top = `${(i * 27) % 90}%`;
            const delay = (i % 5) * 0.8;
            const duration = 6 + (i % 4) * 2;
            return (
              <motion.div
                key={i}
                className="absolute rounded-full bg-cyan-400/30"
                style={{
                  width: size,
                  height: size,
                  left,
                  top,
                  boxShadow: '0 0 10px rgba(34, 211, 238, 0.6)',
                }}
                animate={{
                  y: [-15, 15, -15],
                  x: [-10, 10, -10],
                  opacity: [0.2, 0.8, 0.2],
                  scale: [1, 1.4, 1],
                }}
                transition={{
                  duration,
                  delay,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            );
          })}
        </div>

        {/* 3D Tilted Photo Card */}
        <motion.div
          className="relative max-w-4xl w-full rounded-3xl overflow-hidden border border-cyan-500/40 shadow-[0_20px_60px_-15px_rgba(6,182,212,0.35)] bg-slate-900/90"
          style={{
            transformStyle: 'preserve-3d',
            transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(${translateZ}px) scale(${scale})`,
            transition: animMode === 'parallax' ? 'transform 0.15s ease-out' : 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)',
          }}
        >
          {/* Main Spline Photo Canvas */}
          <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] overflow-hidden bg-slate-950">
            <img
              src={previewImageUrl}
              onError={(e) => {
                // If local image fails, fallback to remote Spline preview
                (e.currentTarget as HTMLImageElement).src = remoteFallback;
              }}
              alt="Spline Clarity Stream 3D Scene"
              className="w-full h-full object-cover object-center filter saturate-110 contrast-105"
            />

            {/* Dynamic Cybernetic Scanline Beam */}
            <div
              className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-cyan-400/10 to-transparent h-24 w-full"
              style={{
                transform: `translateY(${((Math.sin(orbitAngle * 1.5) + 1) / 2) * 400}px)`,
                boxShadow: '0 0 25px rgba(34, 211, 238, 0.25)',
              }}
            />

            {/* Holographic Specular Glint on Card Surface */}
            <div
              className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-cyan-500/0 via-cyan-300/15 to-transparent transition-opacity duration-300"
              style={{
                opacity: 0.3 + (mousePos.x + 1) * 0.25,
                transform: `translateX(${mousePos.x * 60}px) translateY(${mousePos.y * 40}px)`,
              }}
            />

            {/* Vignette & Depth Mask */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/30" />

            {/* Interactive 3D Hotspots */}
            {showHotspots && (
              <div className="absolute inset-0 pointer-events-auto">
                {HOTSPOTS.map((hotspot) => {
                  const isActive = activeHotspot?.id === hotspot.id;
                  return (
                    <div
                      key={hotspot.id}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20 group"
                      style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
                    >
                      <button
                        onClick={() => setActiveHotspot(isActive ? null : hotspot)}
                        className={`relative flex items-center justify-center w-8 h-8 rounded-full border transition-all duration-300 ${
                          isActive
                            ? 'bg-cyan-400 text-slate-950 border-white shadow-lg shadow-cyan-400/50 scale-125'
                            : 'bg-slate-950/80 hover:bg-cyan-500/20 text-cyan-300 border-cyan-400/60 shadow-md shadow-cyan-500/30 hover:scale-115'
                        }`}
                        title={hotspot.label}
                      >
                        <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                        <span className="absolute inset-0 rounded-full border border-cyan-400 animate-ping opacity-60" />
                      </button>

                      {/* Tooltip Card on Hover or Active */}
                      <AnimatePresence>
                        {(isActive || undefined) && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute bottom-10 left-1/2 -translate-x-1/2 w-64 p-3.5 rounded-2xl bg-slate-950/95 border border-cyan-500/40 shadow-2xl backdrop-blur-xl space-y-1.5 z-30 pointer-events-none"
                          >
                            <div className="flex items-center justify-between">
                              <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-[10px] font-bold text-cyan-300">
                                {hotspot.tag}
                              </span>
                              <span className="text-[10px] font-mono text-emerald-400 font-semibold">
                                {hotspot.stat}
                              </span>
                            </div>
                            <h4 className="text-xs font-bold text-white font-display">
                              {hotspot.label}
                            </h4>
                            <p className="text-[11px] text-slate-300 leading-snug">
                              {hotspot.description}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Bottom In-Card Overlay Badges */}
            <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2 z-10 pointer-events-none">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-cyan-500/30 backdrop-blur-md text-xs text-white">
                <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span className="font-semibold">Interactive Spatial 3D</span>
                <span className="text-slate-400 text-[11px]">| Drag to Rotate</span>
              </div>

              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 backdrop-blur-md text-xs text-cyan-300">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-mono text-[11px]">B.Tech CSE Adaptive Matrix</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Experience Footer & Direct App Gateways */}
      <div className="relative z-20 px-6 py-5 border-t border-cyan-500/20 bg-slate-950/80 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <span className="text-sm font-bold text-white font-display">
              Ready to experience personalized learning?
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              Live Ready
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Diagnose knowledge deficits, generate prerequisite DAG pathways, and retain concepts with Ebbinghaus spacing.
          </p>
        </div>

        {/* CTA Gateway Group */}
        <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2.5 w-full sm:w-auto">
          <button
            onClick={() => onExploreDemo('student.a')}
            className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-200 border border-cyan-500/30 text-xs font-semibold transition-all hover:border-cyan-400 hover:text-cyan-300 shadow-sm"
          >
            Demo Student A
          </button>
          <button
            onClick={() => onExploreDemo('student.b')}
            className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-200 border border-blue-500/30 text-xs font-semibold transition-all hover:border-blue-400 hover:text-blue-300 shadow-sm"
          >
            Demo Student B
          </button>
          <button
            id="btn-spline-enter"
            onClick={onEnterPlatform}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-400 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/30 transition-all active:scale-95"
          >
            <span>Enter AdaptiveLearn</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
