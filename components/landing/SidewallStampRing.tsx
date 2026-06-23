'use client';

import { useId } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface SidewallStampRingProps {
  /** The technical string to wrap around the ring, e.g. "225/45R17 94V — M+S —" */
  text: string;
  size?: number;
  durationSeconds?: number;
  className?: string;
}

/**
 * A circular band of repeating monospace text, modeled on the stamped
 * technical lettering found on a real tyre sidewall. Rotates ambiently;
 * the rotation is dropped entirely (not just slowed) when the user prefers
 * reduced motion, since a duration of ~0 on an infinite loop just flickers.
 */
export function SidewallStampRing({
  text,
  size = 420,
  durationSeconds = 40,
  className = '',
}: SidewallStampRingProps) {
  const prefersReducedMotion = useReducedMotion();
  const pathId = `sidewall-${useId().replace(/:/g, '')}`;

  const cx = size / 2;
  const cy = size / 2;
  const radius = size / 2 - 14;
  const d = `M ${cx - radius} ${cy} a ${radius} ${radius} 0 1 0 ${radius * 2} 0 a ${radius} ${radius} 0 1 0 ${-radius * 2} 0`;
  const repeated = ` ${text} `.repeat(6);

  return (
    <motion.svg
      viewBox={`0 0 ${size} ${size}`}
      width="100%"
      height="100%"
      className={className}
      aria-hidden="true"
      animate={prefersReducedMotion ? undefined : { rotate: 360 }}
      transition={
        prefersReducedMotion
          ? undefined
          : { repeat: Infinity, ease: 'linear', duration: durationSeconds }
      }
    >
      <path id={pathId} d={d} fill="none" />
      <text fill="currentColor" letterSpacing="0.18em" className="font-mono text-[11px]">
        <textPath href={`#${pathId}`} startOffset="0%">
          {repeated}
        </textPath>
      </text>
    </motion.svg>
  );
}
