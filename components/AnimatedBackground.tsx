"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform, MotionValue } from "framer-motion";

function WaveLine({
  smoothX,
  smoothY,
  d,
  isMagenta,
  parallaxFactor,
  baseOpacity,
}: {
  smoothX: MotionValue<number>;
  smoothY: MotionValue<number>;
  d: string;
  isMagenta: boolean;
  parallaxFactor: number;
  baseOpacity: number;
}) {
  // Each wave translates individually based on its own depth factor
  const moveX = useTransform(smoothX, (v: number) => v * parallaxFactor);
  const moveY = useTransform(smoothY, (v: number) => (v * parallaxFactor) * 0.4);

  return (
    <motion.path
      d={d}
      stroke={isMagenta ? "url(#paint0_linear)" : "url(#paint1_linear)"}
      strokeWidth="1"
      opacity={baseOpacity}
      style={{ x: moveX, y: moveY }}
    />
  );
}

export default function AnimatedBackground() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth out the direct mouse values for that silky high-end feel
  const springConfig = { damping: 40, stiffness: 30, mass: 1 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Increase mapping bounds to make the expansion feel deeper
      const xOffset = (e.clientX / window.innerWidth - 0.5) * 600;
      const yOffset = (e.clientY / window.innerHeight - 0.5) * 600;

      mouseX.set(xOffset);
      mouseY.set(yOffset);
    };

    const handleDeviceOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma === null || e.beta === null) return;
      
      // gamma gives left-to-right tilt (-90 to 90)
      // Cap at 45 degrees for max effect then normalize to -1 to 1 bounds
      let gammaNorm = e.gamma / 45;
      if (gammaNorm > 1) gammaNorm = 1;
      if (gammaNorm < -1) gammaNorm = -1;
      
      // beta gives front-to-back tilt (-180 to 180)
      // Assuming device resting angle is around 45 degrees tilt towards the user
      let betaNorm = (e.beta - 45) / 45;
      if (betaNorm > 1) betaNorm = 1;
      if (betaNorm < -1) betaNorm = -1;

      // Apply the gyroscope orientation to the spring values
      mouseX.set(gammaNorm * 400); 
      mouseY.set(betaNorm * 400);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("deviceorientation", handleDeviceOrientation, { passive: true });
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("deviceorientation", handleDeviceOrientation);
    };
  }, [mouseX, mouseY]);

  // Make the blue orb move in the opposite direction
  const inverseX = useTransform(smoothX, (v) => -v * 0.5);
  const inverseY = useTransform(smoothY, (v) => -v * 0.5);

  // Generate a mesh of 24 highly intertwined waves
  const numWaves = 24;
  const waves = Array.from({ length: numWaves }).map((_, i) => {
    const isMagenta = i % 2 === 0;

    // Distribute y-origins to create a ribbon effect
    const startY = 400 + (i - numWaves / 2) * 12;

    // Modulate amplitude uniquely per wave to stagger the intersections
    const amplitudeMultiplier = 1 + (i * 0.05);

    // Create the dual cubic bezier wave (S-curve)
    const cp1y = startY - (180 * amplitudeMultiplier);
    const cp2y = startY + (180 * amplitudeMultiplier);
    const cp3y = startY - (180 * amplitudeMultiplier);
    const cp4y = startY + (180 * amplitudeMultiplier);

    const d = `M-200 ${startY} C200 ${cp1y} 500 ${cp2y} 720 ${startY} C940 ${cp3y} 1240 ${cp4y} 1640 ${startY}`;

    // Depth effect ranges massively between layers
    const parallaxFactor = (-(numWaves / 2) + i) * 0.08;

    return {
      id: i,
      d,
      isMagenta,
      parallaxFactor,
      baseOpacity: 0.15 + (i % 3) * 0.1, // Variation in string opacity
    };
  });

  return (
    <div className="anim-bg-wrapper">
      {/* Base Dark Background */}
      <div className="anim-bg-base" />

      {/* Deep Magenta Glow Orb */}
      <motion.div
        className="anim-orb orb-1"
        style={{ x: smoothX, y: smoothY }}
      />

      {/* Deep Blue Glow Orb */}
      <motion.div
        className="anim-orb orb-2"
        style={{ x: inverseX, y: inverseY }}
      />



      <style>{`
        .anim-bg-wrapper {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          z-index: -50;
          overflow: hidden;
          background-color: transparent;
          pointer-events: none;
        }

        .anim-bg-base {
          position: absolute;
          inset: 0;
          background: radial-gradient(1200px circle at 20% 10%, rgba(255,255,255,0.06), rgba(0,0,0,0) 55%),
                      radial-gradient(900px circle at 80% 85%, rgba(255,255,255,0.04), rgba(0,0,0,0) 60%);
          opacity: 1;
        }

        :global(html[data-theme="light"]) .anim-bg-base {
          background: radial-gradient(1200px circle at 20% 10%, rgba(0,0,0,0.05), rgba(255,255,255,0) 55%),
                      radial-gradient(900px circle at 80% 85%, rgba(0,0,0,0.035), rgba(255,255,255,0) 60%);
        }

        .anim-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(140px);
          opacity: 0.8;
          will-change: transform;
          transition: background 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .orb-1 {
          width: 70vw;
          height: 70vw;
          max-width: 900px;
          max-height: 900px;
          background: radial-gradient(circle, rgba(140, 10, 80, 0.45) 0%, rgba(140, 10, 80, 0) 70%);
          top: -20vh;
          left: -10vw;
        }

        /* Light Mode variants */
        :global(html[data-theme="light"]) .orb-1 {
          background: radial-gradient(circle, rgba(255, 120, 180, 0.3) 0%, rgba(255, 120, 180, 0) 70%);
        }

        .orb-2 {
          width: 80vw;
          height: 80vw;
          max-width: 1000px;
          max-height: 1000px;
          background: radial-gradient(circle, rgba(15, 60, 160, 0.45) 0%, rgba(15, 60, 160, 0) 70%);
          bottom: -30vh;
          right: -10vw;
        }

        :global(html[data-theme="light"]) .orb-2 {
          background: radial-gradient(circle, rgba(120, 180, 255, 0.3) 0%, rgba(120, 180, 255, 0) 70%);
        }

        @media (prefers-reduced-motion: reduce) {
          .anim-orb {
            transition: none;
          }
        }

      `}</style>
    </div>
  );
}
