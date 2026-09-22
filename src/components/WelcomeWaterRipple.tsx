import React, { useRef, useEffect, useState } from 'react';

interface WelcomeWaterRippleProps {
  children: React.ReactNode;
  className?: string;
}

export const WelcomeWaterRipple: React.FC<WelcomeWaterRippleProps> = ({ children, className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000, isHovering: false });
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number; opacity: number; scale: number }[]>([]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setMousePos({ x, y, isHovering: true });

    // Spawn subtle liquid ripples occasionally
    if (Math.random() > 0.6) {
      const newRipple = {
        x,
        y,
        id: Date.now() + Math.random(),
        opacity: 0.5,
        scale: 0.4,
      };
      setRipples((prev) => [...prev.slice(-4), newRipple]);
    }
  };

  const handleMouseLeave = () => {
    setMousePos((prev) => ({ ...prev, isHovering: false }));
  };

  // Animate ripples expanding and fading
  useEffect(() => {
    if (ripples.length === 0) return;
    const interval = setInterval(() => {
      setRipples((prev) =>
        prev
          .map((r) => ({
            ...r,
            scale: r.scale + 0.08,
            opacity: r.opacity - 0.05,
          }))
          .filter((r) => r.opacity > 0)
      );
    }, 40);
    return () => clearInterval(interval);
  }, [ripples]);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden rounded-2xl transition-all duration-300 ${className}`}
    >
      {/* Liquid Water-Drop Wall Cursor Follower */}
      {mousePos.isHovering && (
        <>
          {/* Darkened liquid drop center with soft cyan refraction glow rim */}
          <div
            className="pointer-events-none absolute transition-transform duration-75 ease-out rounded-full z-10"
            style={{
              left: `${mousePos.x}px`,
              top: `${mousePos.y}px`,
              width: '180px',
              height: '180px',
              transform: 'translate(-50%, -50%)',
              background: 'radial-gradient(circle, rgba(4, 23, 2, 0.75) 0%, rgba(6, 182, 212, 0.15) 60%, rgba(6, 182, 212, 0) 100%)',
              boxShadow: '0 0 35px 2px rgba(6, 182, 212, 0.25) inset, 0 0 25px 0px rgba(6, 182, 212, 0.2)',
              backdropFilter: 'blur(3px)',
              WebkitBackdropFilter: 'blur(3px)',
            }}
          />

          {/* Surrounding soft distortion halo */}
          <div
            className="pointer-events-none absolute transition-transform duration-150 ease-out rounded-full z-0"
            style={{
              left: `${mousePos.x}px`,
              top: `${mousePos.y}px`,
              width: '280px',
              height: '280px',
              transform: 'translate(-50%, -50%)',
              background: 'radial-gradient(circle, rgba(14, 165, 233, 0.08) 0%, rgba(6, 182, 212, 0.03) 50%, transparent 80%)',
            }}
          />
        </>
      )}

      {/* Expanding water ripple rings */}
      {ripples.map((ripple) => (
        <div
          key={ripple.id}
          className="pointer-events-none absolute rounded-full border border-cyan-400/30 z-10"
          style={{
            left: `${ripple.x}px`,
            top: `${ripple.y}px`,
            width: `${120 * ripple.scale}px`,
            height: `${120 * ripple.scale}px`,
            transform: 'translate(-50%, -50%)',
            opacity: ripple.opacity,
            boxShadow: '0 0 12px rgba(6, 182, 212, 0.3)',
          }}
        />
      ))}

      {/* Content strictly on top with high readability */}
      <div className="relative z-20 pointer-events-auto">{children}</div>
    </div>
  );
};
